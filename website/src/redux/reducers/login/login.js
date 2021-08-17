import { ACTION, ROUTES, loginAccessTokenConst } from './../../../consts/index';
import { isExpired, decodeToken } from "react-jwt";
// nhận data từ server
const initialState = {
  dataUser: {},
  loading: false,
  username: '',
  objectUsername: {},

}
var login = (state = initialState, action) => {
  switch (action.type) {
    case loginAccessTokenConst.LOGIN_ACCESSTOKEN: {
      var data = decodeToken(action.data.accessToken)
      console.log(data)
      console.log("|||999")
      if (data) {
        localStorage.setItem('accessToken', action.data.accessToken)
        localStorage.setItem('refreshToken', action.data.refreshToken)
        localStorage.setItem('username', action.data.username)
        localStorage.setItem('permission_list', JSON.stringify(action.data.role.permission_list))
        localStorage.setItem('menu_list', JSON.stringify(action.data.role.menu_list))
        localStorage.setItem('branch_id', JSON.stringify(data))
        // if (action.data.user) var { username, role, balance } = action.data.user
        // if (username) localStorage.setItem('username', username)
        // var { balance, username, role } = data
        // if (balance) localStorage.setItem('balance', JSON.stringify(balance))
        // if (username) localStorage.setItem('username', JSON.stringify(username))
        // if (role) localStorage.setItem('role', JSON.stringify(role))
      }

      return {
        ...state,
        dataUser: decodeToken(action.data.accessToken),
        username: action.data.username,
        objectUsername: data.data
      }
    }

    case ACTION.LOGOUT: {
      localStorage.clear()
      return {
        ...state,
        dataUser: {}
      }
    }
    case ACTION.LOADING: {
      state.loading = action.data
      return state
    }

    default:
      return state
  }
}
export default login
