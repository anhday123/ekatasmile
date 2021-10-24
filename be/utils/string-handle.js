let removeUnicode = (text, removeSpace) => {
    /*
        string là chuỗi cần remove unicode
        trả về chuỗi ko dấu tiếng việt ko khoảng trắng
    */
    if (typeof text != 'string') {
        throw new Error('Type of text input must be string!');
    }
    if (removeSpace && typeof removeSpace != 'boolean') {
        throw new Error('Type of removeSpace input must be boolean!');
    }
    text = text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
    if (removeSpace) {
        text = text.replace(/\s/g, '');
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
