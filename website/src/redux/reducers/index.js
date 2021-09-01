import { combineReducers } from 'redux'
import login from './login/login'
import store from './store/store'
import modal from './modal/modal'
const rootReducers = combineReducers({
  login,
  store,
  modal,
})
export default rootReducers
