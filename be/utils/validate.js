let validate = (dataValidated, dataForm, checkNull, HTTPStatusCode) => {
    /*
        dataValidated là object cần kiểm tra
        dataForm là object mẫu có key là 1 object gồm 2 phần not_null và data_type
        not_null true tương đương với thuộc tính này là thuộc tính bắt buộc
        data_type là kiểu dữ liệu của thuộc tính
        HTTPStatusCode status code của error nếu cần
    */
    if (HTTPStatusCode) {
        if (typeof HTTPStatusCode == 'number') {
            HTTPStatusCode = `${String(HTTPStatusCode)}:`;
        } else {
            throw new Error(`Kiểu dữ liệu của HTTPStatusCode phải là number!`);
        }
    } else {
        HTTPStatusCode = '';
    }
    if (dataValidated == undefined) {
        throw new Error(`${HTTPStatusCode} dataValidated không xác định!`);
    }
    if (dataForm == undefined) {
        throw new Error(`${HTTPStatusCode} dataForm không xác định!`);
    }
    if (typeof dataValidated != 'object') {
        throw new Error(`${HTTPStatusCode} Kiểu dữ liệu của dataValidated phải là object!`);
    }
    if (typeof dataForm != 'object') {
        throw new Error(`${HTTPStatusCode} Kiểu dữ liệu của dataForm phải là object!`);
    }
    for (let property in dataForm) {
        if (checkNull == true) {
            if (dataForm[property]['not_null'] && dataForm[property]['not_null'] == true) {
                if (dataValidated[property] == undefined) {
                    throw new Error(`${HTTPStatusCode} <${String(property)}> không được để trống!`);
                }
            }
        }
        if (dataValidated[property]) {
            if (dataForm[property]['data_type'].includes('array')) {
                if (
                    !Array.isArray(dataValidated[property]) &&
                    !dataForm[property]['data_type'].includes(typeof dataValidated[property])
                ) {
                    throw new Error(
                        `${HTTPStatusCode} Kiểu dữ liệu của <${String(property)}> phải thuộc <${
                            dataForm[property]['data_type']
                        }>!`
                    );
                } else {
                    continue;
                }
            }
            if (!dataForm[property]['data_type'].includes(typeof dataValidated[property])) {
                throw new Error(
                    `${HTTPStatusCode} Kiểu dữ liệu của <${String(property)}> phải thuộc <${
                        dataForm[property]['data_type']
                    }>!`
                );
            }
        }
    }
};

module.exports = { validate };
