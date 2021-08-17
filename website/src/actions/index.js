import * as types from "./../consts/index";
export const toggle = (data) => {
  return {
    type: types.authConstants.TOGGLE,
    data: data,
  };
};
export const key = (data) => {
  return {
    type: types.authConstants.KEY,
    data: data,
  };
};
