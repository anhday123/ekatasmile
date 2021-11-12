const { removeUnicode } = require('./utils/string-handle');

let str = 121;

try {
    if (typeof str != 'string') throw new Error('404: not found');
    console.log(removeUnicode(str, true));
} catch (err) {
    console.log(err);
}
