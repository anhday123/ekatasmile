const initialState = {
  visibleWelcome: false,
  visibleNotiCreateBranch: false,
}
var store = (state = initialState, action) => {
  switch (action.type) {
    case 'SHOW_MODAL_WELCOME': {
      return {
        ...state,
        visibleWelcome: action.data,
      }
    }
    case 'SHOW_MODAL_NOTI_CREATE_BRANCH': {
      return {
        ...state,
        visibleNotiCreateBranch: action.data,
      }
    }
    default:
      return state
  }
}
export default store
