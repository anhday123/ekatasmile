let removeUnicode = (text) => {
    /*
        string là chuỗi cần remove unicode
        trả về chuỗi ko dấu tiếng việt ko khoảng trắng
    */
    if (typeof text != 'string') {
        throw new Error('Type of input must be string!');
    }
    return text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]|\s/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
};

module.exports = { removeUnicode };
