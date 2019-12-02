"use strict";
export default {
  // ip: '//zpyl.dmwcake.com:1250', // 测试
  // imgIp: '//zpyl.static.dmwcake.com:1250',
  // htmlIp: '//zpyl.dmwcake.com:1250/html',

  ip: "//zpyl.piaowutong.cc", // 正式
  imgIp: "//zpyl.static.piaowutong.cc",
  htmlIp: "//100039.wap.piaowutong.cc/html",
  payChannelUrl: "http://100039.wap.piaowutong.cc/#/payment/payChannel",
  redirectUrl: "http://www.weallway.com/magic/wu/mall/index/index.html",

  // 用户信息信息
  user: {
    cacheChannel: {},
    cacheUser: {}
  },

  // 微信信息
  wechat: {
    power: false
  },

  loginUrl: "",

  accessToken: "",
  refreshToken: "",

  // 渠道ID
  channelId: "100039",
  appSecret: "A4VMIGGJPRCGL02893KIJ4H3RO2X9O8Y",

  channelCategory: {
    WAP_SHOP: {
      code: 1,
      msg: "WAP商城"
    },
    WAP_CINEMA: {
      code: 2,
      msg: "WAP电影票"
    },
    WAP_TICKET: {
      code: 3,
      msg: "WAP票务"
    },
    WAP_ACTIVITY: {
      code: 4,
      msg: "WAP活动"
    },
    WAP_SECKILL: {
      code: 5,
      msg: "WAP秒杀"
    },
    WAP_TRAVEL: {
      code: 6,
      msg: "WAP旅游"
    },
    ADMIN: {
      code: 7,
      msg: "管理后台"
    }
  }
};
