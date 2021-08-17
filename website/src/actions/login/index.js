import { loginAccessTokenConst, ACTION } from "./../../consts/index.js";
export const loginAccessToken = (data) => {
    // alert(data)
    // console.log("|||")
    return {
        type: loginAccessTokenConst.LOGIN_ACCESSTOKEN,
        data: data,
    };
};
export const logoutAction = (data) => {
    // alert('1223')
    // alert(data)
    // console.log("|||")
    return {
        type: ACTION.LOGOUT,
        data: data,
    };
};
export const errorReducer = (data) => {
    // alert('1223')
    // alert(data)
    // console.log("|||")
    return {
        type: ACTION.ERROR,
        data: data,
    };
};
