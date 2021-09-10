// regex email
let email = /^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/;
// regex password
// Tối thiểu tám ký tự, ít nhất một chữ cái và một số:
let pass1 = /^(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{8,}$/;
// Tối thiểu tám ký tự, ít nhất một chữ cái và một ký tự đặc biệt:
let pass2 = /^(?=.*[A-Za-z])(?=.*[!@#$%^&*()?])[A-Za-z\d!@#$%^&*()?]{8,}$/;
// Tối thiểu tám ký tự, ít nhất một chữ cái, một số và một ký tự đặc biệt:
let pass3 = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()?])[A-Za-z\d!@#$%^&*()?]{8,}$/;
// Tối thiểu tám ký tự, ít nhất một chữ cái viết hoa, một chữ cái viết thường và một số:
let pass4 = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
// Tối thiểu tám ký tự, ít nhất một chữ cái viết hoa, một chữ cái viết thường, một số và một ký tự đặc biệt:
let pass5 = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()?])[A-Za-z\d!@#$%^&*()?]{8,}$/;
