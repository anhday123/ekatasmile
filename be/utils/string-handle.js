class InputString {
    constructor(text) {
        if (typeof text != 'string') {
            throw new Error('Typeof input must be string!');
        }
        this.value = String(text).trim();
    }
}

class HandleOptions {
    constructor(options) {
        this.removeUnicode = options.removeUnicode;
        this.removeSpace = options.removeSpace;
        this.removeSpecialCharacter = options.removeSpecialCharacter;
        this.removeStringInBrackets = options.removeStringInBrackets;
        this.replaceSpaceWithHyphen = options.replaceSpaceWithHyphen;
        this.createSlug = options.createSlug;
        this.createRegexQuery = options.createRegexQuery;
        this.getFirstLetter = options.getFirstLetter;
        this.lowerCase = options.lowerCase;
        this.upperCase = options.upperCase;
    }
}

/**
 * Xử lý chuỗi thường gặp
 * @param {InputString} text Chuỗi cần xử lý
 * @param {HandleOptions} options Các tùy chọn xử lý
 * @returns {String} Trả về chuỗi đã được xử lý
 */
let stringHandle = (text, options) => {
    if (text) {
        text = new InputString(text).value;
    }
    if (options) {
        options = new HandleOptions(options);
    }
    if (options) {
        if (options.removeStringInBrackets) {
            if (options.removeStringInBrackets == 'round') {
                text = text.replace(/\((.*?)\)/gi, '');
            }
            if (options.removeStringInBrackets == 'square') {
                text = text.replace(/\[(.*?)\]/gi, '');
            }
            if (options.removeStringInBrackets == 'curly') {
                text = text.replace(/\{(.*?)\}/gi, '');
            }
            if (options.removeStringInBrackets == 'angle') {
                text = text.replace(/\<(.*?)\>/gi, '');
            }
        }
        if (options.removeUnicode) {
            text = text
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/đ/g, 'd')
                .replace(/Đ/g, 'D');
        }
        if (options.getFirstLetter) {
            text = text.replace(/[^a-zA-Z0-9\s]/g, '');
            text = text.split(' ');
            text = text.map((e) => {
                if (/[0-9]/g.test(e)) {
                    return e;
                }
                return e[0];
            });
            text = text.join('');
        }
        if (options.createSlug) {
            console.log(text);
            text = text
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/đ/g, 'd')
                .replace(/Đ/g, 'D');
            text = text.replace(/[^a-zA-Z0-9\s]/g, '');
            text = text.replace(/\s{1,}/g, '-');
            text = text.toLowerCase();
        }
        if (options.createRegexQuery) {
            text = text
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/đ/g, 'd')
                .replace(/Đ/g, 'D');
            text = text.replace(/[^a-zA-Z0-9\s]/g, '');
            text = text.replace(/\s{1,}/g, '(.*?)');
            text = text.toLowerCase();
        }
        if (options.removeSpecialCharacter) {
            text = text.replace(/[^a-zA-Z0-9\s]/g, '');
        }
        if (options.replaceSpaceWithHyphen) {
            text = text.replace(/(\s{1,}-{1,}\s{1,})/g, '-');
        }
        if (options.removeSpace) {
            text = text.replace(/\s/g, '');
        }
        if (options.lowerCase) {
            text = text.toLowerCase();
        }
        if (options.upperCase) {
            text = text.toUpperCase();
        }
    }
    return text;
};

module.exports = { stringHandle };
