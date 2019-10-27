import Vue from 'vue'

import db from './datastore'
import fs from 'fs'

import App from './App'
import router from './router'
import store from './store'
import path from 'path'
import vueCropper from 'vue-cropper'
import dayjs from 'dayjs'
import kebabCase from 'lodash/kebabCase'
import ViewUI from 'view-design'

import './assets/override.scss'
import 'view-design/dist/styles/iview.css'

Vue.config.productionTip = false

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.use(ViewUI)
Vue.use(vueCropper)

Vue.prototype.$fs = fs
Vue.prototype.$db = db
Vue.prototype.$path = path
Vue.prototype.$time = dayjs
Vue.prototype.$getId = () => {
  return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36)
}

Vue.filter('dateFormat', function(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs(dataStr).format(pattern)
})

const nextComponents = require.context('./components', true, /\.vue$/)
nextComponents.keys().forEach(fileName => {
  const componentConfig = nextComponents(fileName)
  const componentName = kebabCase(
    fileName.replace(/^\.\/(.*)\.\w+$/, '$1')
  )
  Vue.component(
    componentName,
    componentConfig.default || componentConfig
  )
})

let devInnerHeight = 1080.0
let devDevicePixelRatio = 1.0
let devScaleFactor = 1
let scaleFactor = require('electron').screen.getPrimaryDisplay().scaleFactor
let zoomFactor = (window.innerHeight / devInnerHeight) * (window.devicePixelRatio / devDevicePixelRatio) * (devScaleFactor / scaleFactor)
require('electron').webFrame.setZoomFactor(zoomFactor)

/* eslint-disable no-new */
new Vue({
  components: {App},
  router,
  store,
  template: '<App/>'
}).$mount('#app')
