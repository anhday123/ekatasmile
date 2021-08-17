const absolute = (datas, dataForm) => {
    // Kiểm tra các thuộc tính của object datas tương đồng với dataForm
    // nếu đúng thì trả về datas nếu không trả về false
    let keys = Object.keys(datas);
    if (keys.length != dataForm.length) return false;
    for (let i in dataForm)
        if (!keys.includes(dataForm[i])) {
            console.log(dataForm[i]);
            return false;
        }
    return datas;
};

const relative = (datas, dataForm) => {
    // Kiểm tra tất cả các thuộc tính của object datas có nằm trong dataForm hay không
    // nếu đúng thì trả về datas nếu không trả về false
    let keys = Object.keys(datas);
    for (let i in keys)
        if (!dataForm.includes(keys[i])) {
            console.log(keys[i]);
            return false;
        }
    return datas;
};

module.exports = { absolute, relative };
