import { ACTION } from '../../../consts/index';
const defaultValue = false

var sider = (state = defaultValue, action) => {
    switch (action.type) {
        case ACTION.CHANGE_SIDER: {
            console.log('SIDER', action)
            return action.value
        }

        default:
            return state
    }
}
export default sider