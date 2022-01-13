const { removeUnicode } = require('./utils/string-handle');

let text = 'Ph@n Đăng Lưu 0123 ';

text = removeUnicode(text, { removeSpecialCharacter: true });
console.log(text);
