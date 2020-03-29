import React from 'react'
import ReactDOM from 'react-dom'
import { ConfigProvider } from 'antd'
import CN from 'antd/es/locale/zh_CN'

import App from './App'

const Root = (
  <ConfigProvider locale={CN}>
    <App />
  </ConfigProvider>
)

ReactDOM.render(
  Root,
  document.getElementById('app')
);

// PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(() => console.log('serviceWorker注册成功'))
      .catch(() => console.log('serviceWorker注册失败'))
  })
}