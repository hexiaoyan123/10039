// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import md5 from 'js-md5'
import AMap from 'vue-amap' // 地图
import App from './App'
import router from './router'
import store from './store'
import init from './common/init'
import base from './common/base'
import axios from 'axios'
import vueFinger from 'vue-finger'
import VueCookies from 'vue-cookies'
import VueClipboard from 'vue-clipboard2'
import vueTouch from 'kim-vue-touch'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import {
  List,
  Waterfall,
  Sku,
  Picker,
  SwitchCell,
  Actionsheet,
  Rate,
  Row,
  Col,
  Icon,
  Swipe,
  SwipeItem,
  Lazyload,
  Toast,
  Popup,
  Tab,
  Tabs,
  AddressList,
  AddressEdit,
  Area,
  RadioGroup,
  Radio,
  Field,
  Cell,
  CellGroup,
  GoodsAction,
  GoodsActionBigBtn,
  GoodsActionMiniBtn,
  Checkbox,
  CheckboxGroup,
  Collapse,
  CollapseItem
} from 'vant'

Vue.use(List).use(Waterfall).use(Sku).use(Picker).use(SwitchCell).use(Actionsheet).use(Rate).use(Row).use(Col).use(Icon).use(Swipe).use(SwipeItem).use(Lazyload).use(Toast).use(Popup).use(Tab).use(Tabs).use(AddressList).use(AddressEdit).use(Area).use(RadioGroup).use(Radio).use(Field).use(Cell).use(CellGroup).use(GoodsAction).use(GoodsActionBigBtn).use(GoodsActionMiniBtn).use(Checkbox).use(CheckboxGroup).use(Collapse).use(CollapseItem)
Vue.use(vueFinger)
Vue.use(VueCookies)
Vue.use(VueClipboard)
Vue.use(vueTouch)
Vue.use(ElementUI)

Vue.filter('imgSpecilize', (val, size) => {
  if (val && val.indexOf('.') > 0) {
    val = val.split(',')[0]
    let str1 = val.split('.')[0]
    let str2 = val.split('.')[1]
    if (size) {
      return init.imgIp + str1 + size + '.' + str2
    } else {
      return init.imgIp + str1 + '_20' + '.' + str2
    }
  } else {
    return ''
  }
})

Vue.config.productionTip = false

// 地图
Vue.use(AMap)
AMap.initAMapApiLoader({
  key: '1fd17a03360de26427d86c89708ddd77',
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor', 'AMap.Geolocation'],
  v: '1.4.4',
  uiVersion: '1.0.11'
})

Vue.prototype.$base = base
Vue.prototype.$axios = axios
Vue.prototype.$init = init
Vue.prototype.$md5 = md5
Vue.prototype.$http = {
  post(url, data, channel) {
    return axios({
      method: 'post',
      baseURL: init.ip,
      url: url,
      data: data,
      timeout: 0,
      transformResponse: [function (data) {
        if (data && typeof (data) == 'string') {
          let dataObj = JSON.parse(data)
          if (dataObj.msg && dataObj.msg.indexOf('您没有登录，请登录！') >= 0) {
            // localStorage.clear()
            // window.location.hash = Vue.prototype.$init.loginUrl ? ('#' + Vue.prototype.$init.loginUrl) : '#/user/loginCode'
            window.location.href = init.redirectUrl
          }
          return dataObj
        } else {
          return data
        }
      }],
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Token': Vue.prototype.$init.accessToken ? Vue.prototype.$init.accessToken : 'Access-Token',
        'Channel-Id': channel ? channel : init.channelId
      }
    })
  },
  get(url, channel) {
    return axios({
      method: 'get',
      baseURL: init.ip,
      url: url,
      timeout: 0,
      transformResponse: [function (data) {
        if (data && typeof (data) == 'string') {
          let dataObj = JSON.parse(data)
          if (dataObj.msg && dataObj.msg.indexOf('您没有登录，请登录！') >= 0) {
            // localStorage.clear()
            // window.location.hash = Vue.prototype.$init.loginUrl ? ('#' + Vue.prototype.$init.loginUrl) : '#/user/loginCode'
            window.location.href = init.redirectUrl
          }
          return dataObj
        } else {
          return data
        }
      }],
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Token': Vue.prototype.$init.accessToken ? Vue.prototype.$init.accessToken : 'Access-Token',
        'Channel-Id': channel ? channel : init.channelId
      }
    })
  }
}

// Vue.prototype.$init.refreshToken = VueCookies.get('refreshToken')
Vue.prototype.$init.refreshToken = window.localStorage.getItem('refreshToken')
if ((!Vue.prototype.$init.refreshToken) && window.navigator.cookieEnabled) {
  Vue.prototype.$init.refreshToken = VueCookies.get('refreshToken')
}

Vue.prototype.refreshTokenFun = (CellBack) => {
  Vue.prototype.$http.get('/v1/refreshToken/' + Vue.prototype.$init.refreshToken).then((response) => {
    if (response.data.code === '1000') {
      Vue.prototype.$init.user = response.data.result
      Vue.prototype.$init.accessToken = response.data.result.accessToken
      Vue.prototype.$init.refreshToken = response.data.result.refreshToken
      window.localStorage.setItem('refreshToken', response.data.result.refreshToken)
      // 设置Cookies
      if (window.navigator.cookieEnabled) {
        VueCookies.set('refreshToken', response.data.result.refreshToken, '30d')
      }

      if (CellBack) {
        CellBack()
      }
    } else {
      if (CellBack) {
        localStorage.removeItem('refreshToken')
        // 清除Cookies
        if (window.navigator.cookieEnabled) {
          VueCookies.remove('refreshToken')
        }

        Vue.prototype.$init.refreshToken = ''
        Vue.prototype.$init.accessToken = ''
        Vue.prototype.$init.user = {
          cacheChannel: {},
          cacheUser: {}
        }
        Vue.prototype.$init.loginUrl ? CellBack(Vue.prototype.$init.loginUrl) : CellBack('/user/loginCode')
      }
    }
  }).catch(() => {
    if (CellBack) {
      localStorage.removeItem('refreshToken')
      // 清除Cookies
      if (window.navigator.cookieEnabled) {
        VueCookies.remove('refreshToken')
      }

      Vue.prototype.$init.refreshToken = ''
      Vue.prototype.$init.accessToken = ''
      Vue.prototype.$init.user = {
        cacheChannel: {},
        cacheUser: {}
      }
      Vue.prototype.$init.loginUrl ? CellBack(Vue.prototype.$init.loginUrl) : CellBack('/user/loginCode')
    }
  })
}

let payBackData = VueCookies.get('payBackData') // 支付回调
if (payBackData) {
  VueCookies.remove('payBackData')
}

// 验证微信登陆
if (base.isWeixn()) {
  Vue.prototype.$init.wechat.power = VueCookies.get('wechatPower') ? true : false
}

// 验证微信登陆权限
Vue.prototype.getWechat = () => {
  let backUrlStr = window.location.href
  let backUrl = encodeURIComponent(backUrlStr)
  window.location.href = Vue.prototype.$init.ip + '/panda-common-gateway/v1/wechatLogin' + '?redirectUrl=' + backUrl + '&channelId=' + Vue.prototype.$init.channelId
}

router.beforeEach((to, from, next) => {
  // alert(to.query.token);
  // console.info("to.query.token：" + to.query.token);
  // console.info("Vue.prototype.$init.accessToken：" + Vue.prototype.$init.accessToken);
  // console.info("VueCookies.get('sccessToken')：" + VueCookies.get('sccessToken'));
  // console.info("payBackData：" + payBackData);
  if (to.query.token && to.query.token != '') {
    if (to.query.token === 'null') {
      window.location.href = Vue.prototype.$init.redirectUrl;
    } else {
      Vue.prototype.$init.accessToken = to.query.token
      axios.defaults.headers['Access-Token'] = to.query.token
      VueCookies.set('sccessToken', to.query.token, '10000MIN')
      next()
    }
  } else if (Vue.prototype.$init.accessToken) {
    if (VueCookies.isKey('sccessToken')) {
      axios.defaults.headers['Access-Token'] = VueCookies.get('sccessToken')
      next()
    } else {
      VueCookies.set('sccessToken', Vue.prototype.$init.user.token, '10000MIN')
      axios.defaults.headers['Access-Token'] = VueCookies.get('sccessToken')
      next()
    }
  } else if (VueCookies.isKey('sccessToken')) {
    axios.defaults.headers['Access-Token'] = VueCookies.get('sccessToken')
    Vue.prototype.$init.user.token = VueCookies.get('sccessToken')
    Vue.prototype.$init.accessToken = VueCookies.get('sccessToken')

    // if (payBackData) {
    //   let payBackDataObj = JSON.parse(payBackData)
    //   Vue.prototype.$init.user = payBackDataObj.user
    //   Vue.prototype.$init.accessToken = payBackDataObj.accessToken
    //   Vue.prototype.$init.refreshToken = payBackDataObj.refreshToken
    //   // 验证cookie
    //   if ((!Vue.prototype.$init.refreshToken) && window.navigator.cookieEnabled) {
    //     Vue.prototype.$init.refreshToken = VueCookies.get('refreshToken')
    //   }

    //   payBackData = false
    // }

    next()
    // } else if (payBackData) {
    //   let payBackDataObj = JSON.parse(payBackData)
    //   Vue.prototype.$init.user = payBackDataObj.user
    //   Vue.prototype.$init.accessToken = payBackDataObj.accessToken
    //   Vue.prototype.$init.refreshToken = payBackDataObj.refreshToken
    //   // 验证cookie
    //   if ((!Vue.prototype.$init.refreshToken) && window.navigator.cookieEnabled) {
    //     Vue.prototype.$init.refreshToken = VueCookies.get('refreshToken')
    //   }

    //   payBackData = false
    //   next()
  } else {
    next()
  }

  // if (to.path == '/user/loginCard') {
  //   next()
  // }

  // if (Vue.prototype.$init.refreshToken) {
  //   if (Vue.prototype.$init.accessToken) {
  //     next()
  //   } else {
  //     if (payBackData) {
  //       let payBackDataObj = JSON.parse(payBackData)
  //       Vue.prototype.$init.user = payBackDataObj.user
  //       Vue.prototype.$init.accessToken = payBackDataObj.accessToken
  //       Vue.prototype.$init.refreshToken = payBackDataObj.refreshToken
  //       // 验证cookie
  //       if ((!Vue.prototype.$init.refreshToken) && window.navigator.cookieEnabled) {
  //         Vue.prototype.$init.refreshToken = VueCookies.get('refreshToken')
  //       }

  //       payBackData = false
  //       next()
  //     } else {
  //       Vue.prototype.refreshTokenFun(next)
  //     }
  //     window.$refreshTokenInterval = setInterval(() => {
  //       Vue.prototype.refreshTokenFun()
  //     }, 100 * 60 * 1000)
  //   }
  // } else {
  //   if (base.isWeixn()) {
  //     if (to.query.refreshToken) {
  //       Vue.prototype.$init.refreshToken = to.query.refreshToken
  //       Vue.prototype.$init.wechat.power = true
  //       window.localStorage.setItem('wechatPower', 'true')
  //       Vue.prototype.refreshTokenFun(next)
  //     } else {
  //       Vue.prototype.getWechat()
  //     }
  //     return
  //   }

  //   if (Vue.prototype.$init.user.cachechannelIdUrl) {
  //     next()
  //   } else {
  //     Vue.prototype.$http.get('/panda-admin-api/v1/getChannel').then((response) => {
  //       if (response.data.code === '1000') {
  //         Vue.prototype.$init.user.cacheChannel = response.data.result
  //         next()
  //       } else {
  //         next()
  //       }
  //     })
  //   }
  // }
})

router.afterEach((to, from) => {
  // 请空提示
  Toast.clear('clearAll')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
