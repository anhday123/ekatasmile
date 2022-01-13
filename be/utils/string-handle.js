let removeUnicode = (text, options) => {
    /*
        string là chuỗi cần remove unicode
        trả về chuỗi ko dấu tiếng việt ko khoảng trắng
    */
    if (typeof text != 'string') {
        throw new Error('Type of text input must be string!');
    }
    text = text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
    if (options) {
        if (options.replaceSpaceWithHyphen) {
            text = text.replace(/\s/g, '-');
        }
        if (options.removeSpace) {
            text = text.replace(/\s/g, '');
        }
        if (options.removeSpecialCharacter) {
            text = text.replace(/[^a-zA-Z0-9\s]/g, '');
        }
    }

    return text;
};

let getFirstLetter = (text) => {
    text = text.split(' ');
    text = text.map((item) => {
        if (/[a-zA-Z]/.test(item)) {
            return item[0];
        } else {
            return item;
        }
    });
    text = text.join('');
    return text;
};

module.exports = { removeUnicode, getFirstLetter };
