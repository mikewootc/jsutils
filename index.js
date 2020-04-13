

function TimedPromise(action, timeout) {
    return new Promise((resolve, reject) => {
        let timedOut = false;
        let resolved = false;
        action(() => {
            if (!timedOut) {
                //console.log('TP, resolve');
                resolved = true;
                resolve();
            } else {
                //console.log('TP, timed out before resolve, ignore');
            }
        }, () => {
            reject();
        });
        setTimeout(() => {
            if (!resolved) {
                //console.log('TP, timeout');
                timedOut = true;
                reject(new Error('Timeout'));
            }
        }, timeout);
    });
}



module.exports = {
    TimedPromise,
}
