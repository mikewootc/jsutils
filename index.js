function TimedPromise(action, timeoutMs, timeoutCallback) {
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
