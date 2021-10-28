let initialState = {
  branchId: '',
}

const branch = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_BRANCH_ID': {
      return { ...state, branchId: action.data || '' }
    }

    default:
      return state
  }
}

export default branch
