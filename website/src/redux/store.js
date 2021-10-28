import { createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import rootReducers from './reducers'

const persistConfig = {
  keyPrefix: '',
  key: 'invoice',
  storage,
  whitelist: ['invoice'],
}

const pReducer = persistReducer(persistConfig, rootReducers)

export const store = createStore(pReducer)
export const persistor = persistStore(store)
