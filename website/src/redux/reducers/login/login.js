import { ACTION } from './../../../consts/index'
import { decodeToken } from 'react-jwt'
// nhận data từ server
const initialState = {
  dataUser: {},
  loading: false,
  username: '',
  objectUsername: {},
  branchName: '',
}
var login = (state = initialState, action) => {
  switch (action.type) {
    case ACTION.LOGIN: {
      var data = decodeToken(action.data.accessToken)
      console.log(data)
      if (data) {
        localStorage.setItem('accessToken', action.data.accessToken)
        localStorage.setItem('refreshToken', action.data.refreshToken)
        localStorage.setItem('username', data.data.username)
        localStorage.setItem(
          'permission_list',
          JSON.stringify(data.data.role.permission_list || [])
        )
        localStorage.setItem(
          'menu_list',
          JSON.stringify(data.data.role.menu_list || [])
        )
        return {
          ...state,
          dataUser: data,
          username: data.data.username,
          objectUsername: data.data,
        }
      }

      return {
        ...state,
      }
    }

    case 'SAVE_BRANCH_NAME': {
      return {
        ...state,
        branchName: action.data || '',
      }
    }

    case ACTION.LOGOUT: {
      localStorage.clear()
      return {
        ...state,
        dataUser: {},
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
