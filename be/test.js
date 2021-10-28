function delay(ms) {
    const token = {};

    token.promise = new Promise((resolve) => {
        const timer = setTimeout(() => {
            resolve(); // promise makes sense only if there is this call
            console.log('hey');
        }, ms);
        token.clear = () => {
            clearTimeout(timer);
            console.log('timer cleared');
        };
    });
    return token;
}

function cancellation() {
    const token = {};

    token.promise = new Promise((_, reject) => {
        token.cancel = () => reject(new Error('cancelled'));
    });
    return token;
}

var cancelDeferred = cancellation();
var clearDeferred = delay(2000);

Promise.race([cancelDeferred.promise, clearDeferred.promise]).catch((e) => {
    console.log('catch', e.message);
    clearDeferred.clear();
});

setTimeout(() => {
    cancelDeferred.cancel();
}, 500);
