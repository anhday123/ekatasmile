import { combineReducers } from 'redux'
import login from './login/login'
import store from './store/store'
const rootReducers = combineReducers({
  login,
  store,
})
export default rootReducers
