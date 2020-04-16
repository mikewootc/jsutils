# mike-jsutils

mikewootc's jsutils:

* Promise with timeout


# Install

    npm install mike-jsutils

or:

    yarn add mike-jsutils

# Usage

## Promise with timeout

```js
    const {TimedPromise} = require('mike-jsutils');

    let tp = TimedPromise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, 2000);
    }, 1000);
```

Notice: this TimedPromise won't call resolve() again after timeout.
