import { combineReducers } from 'redux'
import login from './login/login'
import store from './store/store'
import sider from './sider'
const rootReducers = combineReducers({
    login,
    store,
    sider
})
export default rootReducers