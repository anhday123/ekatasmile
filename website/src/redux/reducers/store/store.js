import { ACTION, ROUTES, loginAccessTokenConst } from '../../../consts/index';
import { isExpired, decodeToken } from "react-jwt";
// nhận data từ server
const initialState = []
var store = (state = initialState, action) => {
  switch (action.type) {
    case ACTION.GET_STORE: {
      console.log(action)
      state = [{ data: action.data }, { selectValue: action.data[0].store_id }]
      console.log("|||222")
      return [...state]
    }
    case ACTION.SELECT_VALUE: {
      console.log(action)
      var array = [...state]
      array[1].selectValue = action.data
      console.log(array)
      console.log("______________555555")
      // state = [{ data: action.data }, { selectValue: action.data[0].store_id }]
      // console.log("|||222")
      return [...array]
    }
    default:
      return state
  }
}
export default store
