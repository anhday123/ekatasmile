import { combineReducers } from 'redux'
import login from './login/login'
import store from './store/store'
import branch from './branch/branch'
const rootReducers = combineReducers({
  login,
  store,
  branch,
})
export default rootReducers
