#!/usr/bin/env node
'use strict'

//const {TimedPromise} = require('mike-jsutils');
const {TimedPromise, getListItemValueByAnotherKey} = require('../index');

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
            //console.log(`testTimeoutWithCallback, wants to resolve`);
            resolve();
        }, 2000);
    }, 1000, () => {console.log('Timeout callback');});
}


(async () => {
    const l =  [{name: 'mike', age:36}, {name: 'woo', age: 37}];
    let mikeAge = getListItemValueByAnotherKey(l, 'name', 'mike', 'age');
    if (mikeAge == 36) {
        console.log('[OK] getListItemValueByAnotherKey normal');
    } else {
        console.log('[FAIL] getListItemValueByAnotherKey normal');
    }

    try {
        let ret = await afunc(1000, 1);
        console.log('[OK] afunc resolved\n\n\n');
    } catch(err) {
        console.log('[FAIL] afunc', err);
    }

    try {
        console.log('bfunc before');
        let ret = await bfunc();
        console.log('[OK] bfunc resolved');
    } catch(err) {
        console.log('[FAIL] bfunc', err, '\r\n\n');
    }
    
    // 测试超时
    try {
        console.log('Test timeout ===============================================');
        let ret = await afunc(3000, 2);
        console.log('[FAIL] afunc 2 resolved');
    } catch(err) {
        console.log('[OK] afunc 2', err, '\r\n\n');
    }

    try {
        console.log('Test timeout with callback =================================');
        let ret = await testTimeoutWithCallback();
        console.log('[FAIL] testTimeoutWithCallback resolved');
    } catch(err) {
        if (err.message == 'Timeout') {
            console.log('[OK] Got Timeout');
        }
    }
    console.log('\r\n');

    try {
        console.log('Test resolve after timeout =================================');
        let alreadyTimeout = false;
        let res = await TimedPromise((resolve, reject) => {
            setTimeout(() => {
                //console.log(`testResolveAfterTimeout, wants to resolve`);
                resolve(123);
            }, 2000);
        }, 1000, () => {
            console.log('[OK] Got Timeout in callback');
            alreadyTimeout = true;
        }, (data) => {
            if (alreadyTimeout == true && data === 123) {
                console.log('[OK] Got resolve after Timeout');
            }
        });
    } catch(err) {
        console.log('[OK] Got Timeout in catch');
    }
})();


// vim:set tw=0:
