const initialState = {
  invoices: [],
}
const invoice = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_INVOICE':
      return { ...state, invoices: action.data }

    default:
      return state
  }
}

export default invoice
