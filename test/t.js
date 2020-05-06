#!/usr/bin/env node
'use strict'

//const {TimedPromise} = require('mike-jsutils');
const {TimedPromise} = require('../index');

function afunc(delay, id) {
    console.log('afunc, enter');
    let timedOut = false;
    return TimedPromise((resolve, reject) => {
        setTimeout(() => {
            if (!timedOut) {
                console.log(`afunc ${id}, wants to resolve`);
                resolve();
            }
        }, delay);
    }, 2000);
}

function bfunc() {
    console.log('bfunc, enter');
    return TimedPromise((resolve, reject) => {
        reject(Error('bfunc reject'));
    }, 2000);
}

function testTimeoutWithCallback() {
    console.log('testTimeoutWithCallback, enter');
    return TimedPromise((resolve, reject) => {
        setTimeout(() => {
            console.log(`testTimeoutWithCallback, wants to resolve`);
            resolve();
        }, 2000);
    }, 1000, () => {console.log('Timeout callback');});
}


(async () => {
    try {
        let ret = await afunc(1000, 1);
        console.log('[OK] afunc resolved\n\n\n');
    } catch(err) {
        console.log('[FAILED] afunc', err);
    }

    try {
        console.log('bfunc before');
        let ret = await bfunc();
        console.log('[OK] bfunc resolved');
    } catch(err) {
        console.log('[FAILED] bfunc', err, '\r\n\n');
    }
    
    try {
        let ret = await afunc(3000, 2);
        console.log('[OK] afunc 2 resolved');
    } catch(err) {
        console.log('[FAILED] afunc 2', err, '\r\n\n');
    }

    try {
        let ret = await testTimeoutWithCallback();
        console.log('[OK] testTimeoutWithCallback resolved');
    } catch(err) {
        console.log('[FAILED] testTimeoutWithCallback', err);
    }
})();


// vim:set tw=0:
