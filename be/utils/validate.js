let validate = (objectValidated, objectCompare) => {
    /*
        objectValidated là object cần kiểm tra
        objectCompare là object mẫu có key trùng với key của objectValidated và value là kiểu dữ liệu
    */
    if (objectValidated == undefined || objectCompare == undefined) {
        throw new Error('Input is undefined!');
    }
    if (typeof objectValidated != 'object' || typeof objectCompare != 'object') {
        throw new Error('Typeof input must be object!');
    }
    for (let compare in objectCompare) {
        if (objectValidated[compare] == undefined) {
            throw new Error(String(compare) + ' is undefined!');
        }
        if (typeof objectValidated[compare] != objectCompare[compare]) {
            throw new Error("Typeof '" + compare + "' must be " + objectCompare[compare] + '!');
        }
    }
};

module.exports = { validate };
