import { loginAccessTokenConst, ACTION } from "./../../consts/index.js";
export const loginAccessToken = (data) => {

    return {
        type: loginAccessTokenConst.LOGIN_ACCESSTOKEN,
        data: data,
    };
};
export const logoutAction = (data) => {

    return {
        type: ACTION.LOGOUT,
        data: data,
    };
};
export const errorReducer = (data) => {

    return {
        type: ACTION.ERROR,
        data: data,
    };
};
