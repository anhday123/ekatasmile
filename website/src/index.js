import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import './custom-antd.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { Provider } from 'react-redux'
import store from './redux/store'
import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'
import 'antd/dist/antd.css'
// Sentry.init({
//   dsn: 'https://3e5e5efe140c4de7bef78cbaba9cae70@o880922.ingest.sentry.io/5835082',
//   integrations: [new Integrations.BrowserTracing()],

//   // Set tracesSampleRate to 1.0 to capture 100%
//   // of transactions for performance monitoring.
//   // We recommend adjusting this value in production
//   tracesSampleRate: 1.0,
// })

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
