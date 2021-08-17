import React from 'react'
import './404.scss'

import { useHistory } from 'react-router-dom'

export default function PageNotFound() {
  const history = useHistory()
  return (
    <section id="notfound">
      <div className="notfound">
        <div className="notfound-404">
          <h1>404</h1>
          <h2>Page not found</h2>
        </div>
        <a onClick={() => history.goBack()}>Về trang chủ</a>
      </div>
    </section>
  )
}
