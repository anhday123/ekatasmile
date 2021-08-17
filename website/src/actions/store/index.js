import { loginAccessTokenConst, ACTION } from "../../consts/index.js";

export const getStore = (data) => {
    // alert('1223')
    // alert(data)
    // console.log("|||")
    return {
        type: ACTION.GET_STORE,
        data: data,
    };
};
export const getStoreSelectValue = (data) => {
    // alert('1223')
    // alert(data)
    // console.log("|||")
    return {
        type: ACTION.SELECT_VALUE,
        data: data,
    };
};
