/**
 * 带超时的Promise
 *
 * @param {function} action 与原生Promise一样用法的函数.
 * @param {number} timeoutMs 超时时限
 * @param {function} timeoutCallback 超时后调用的回调函数, 会在reject前调用. 可以用于超时前的promise内部清理工作.
 * @param {function} resolveAfterTimeout 如果在超时后action中的工作又完成了, 则调用该函数. 用于某些本身无法在超时后中断的工作, 在超时后如果又成功完成了, 可以在此进行清理工作.
 * @returns {Promise}
 */
function TimedPromise(action, timeoutMs, timeoutCallback, resolveAfterTimeout) {
    return new Promise((resolve, reject) => {
        let timedOut = false;
        let resolved = false;
        let rejected = false;
        action((r) => {
            if (!timedOut) {
                //console.log('TP, resolve');
                resolved = true;
                resolve(r);
            } else {
                if (resolveAfterTimeout && typeof(resolveAfterTimeout) == 'function') {
                    resolveAfterTimeout(r);
                }
                //console.log('TP, timed out before resolve, ignore');
            }
        }, (e) => {
            rejected = true;
            reject(e);
        });
        setTimeout(() => {
            if (!resolved && !rejected) {
                //console.log('TP, timeout');
                timedOut = true;
                if (timeoutCallback && typeof(timeoutCallback) == 'function') {
                    timeoutCallback();
                }
                reject(new Error('Timeout'));
            }
        }, timeoutMs);
    });
}


/**
 * 当list中的每个元素为一个plain object时, 按元素的key-value匹配(只进行浅比较)来获取元素, 并得到该元素的另一个key的值.
 * e.g.: list = [{name: 'mike', age:36}, {name: 'woo', age: 37}];
 *       getListItemValueByAnotherKey(list, 'name', 'mike', 'age'), 得到36.
 *
 * @param {Array} list
 * @param {any} itemKey   匹配元素的key
 * @param {any} itemValue 匹配元素的value
 * @param {any} getKey    想要获取值的key
 * @returns {获取到的value}
 */
function getListItemValueByAnotherKey(list, itemKey, itemValue, getKey) {
    if (!list || !(list instanceof Array) || !itemKey) {
        //console.log('Invalid param');
        return null;
    }

    let item = list.find((it, ix, arr) => (it && it[itemKey] == itemValue));
    if (!item) {
        //console.log('Item not found');
        return null;
    }

    console.log('Item:', item);
    return item[getKey];
}



/**
 * Enhanced error with custom property
 *
 * @extends {Error}
 */
class MyError extends Error {
    constructor(message, options) {
        super(message);

        if (options) {
            for (let k in options) {
                this[k] = options[k];
            }
        }
    }
}



module.exports = {
    TimedPromise,
    MyError,
    getListItemValueByAnotherKey,
}
