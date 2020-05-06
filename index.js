function TimedPromise(action, timeoutMs, timeoutCallback) {
    return new Promise((resolve, reject) => {
        let timedOut = false;
        let resolved = false;
        action((r) => {
            if (!timedOut) {
                //console.log('TP, resolve');
                resolved = true;
                resolve(r);
            } else {
                //console.log('TP, timed out before resolve, ignore');
            }
        }, (e) => {
            reject(e);
        });
        setTimeout(() => {
            if (!resolved) {
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


module.exports = {
    TimedPromise,
}
