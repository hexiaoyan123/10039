import Vue from 'vue'
import Router from 'vue-router'

import UserLoginPassword from '@/components/user/LoginPassword'
import UserLoginCard from '@/components/user/LoginCard'
import UserLoginCardPhone from '@/components/user/LoginCardPhone'
import UserLoginCode from '@/components/user/LoginCode'
import UserLoginSea from '@/components/user/LoginSea'
import UserRegister from '@/components/user/Register'
import UserFindPassword1 from '@/components/user/FindPassword1'
import UserFindPassword2 from '@/components/user/FindPassword2'
import UserFindPassword3 from '@/components/user/FindPassword3'
import UserHome from '@/components/user/Home'
import UserUpdata from '@/components/user/Updata'

import Success from '@/components/Success'
import Fail from '@/components/Fail'
import Error from '@/components/Error'
import OrderPayOnceCard from '@/components/OrderPayOnceCard'
import OrderPayCashCard from '@/components/OrderPayCashCard'
import Index from '@/components/Index'
import QRcode from '@/components/QRcode'

import ProductCart from '@/components/product/Cart'
import ProductCartEdit from '@/components/product/CartEdit'
import ProductOrderEvaluate from '@/components/product/OrderEvaluate'
import ProductAddressList from '@/components/product/AddressList'
import ProductAddressListManage from '@/components/product/AddressListManage'
import ProductAddressAdd from '@/components/product/AddressAdd'
import ProductSearchClass from '@/components/product/SearchClass'
import ProductSearchForm from '@/components/product/SearchForm'
import ProductSearchScreen from '@/components/product/SearchScreen'
import ProductOrderPayCheck from '@/components/product/OrderPayCheck'
import ProductOrderPay from '@/components/product/OrderPay'
import ProductOrderDetails from '@/components/product/OrderDetails'
import ProductOrderDetailsLog from '@/components/product/OrderDetailsLog'
import ProductOrders from '@/components/product/Orders'
import Product from '@/components/product/Product'
import ProductClass from '@/components/product/Class'
import ProductShForm from '@/components/product/ShForm'
import ProductShList from '@/components/product/ShList'
import ProductOrderLogistics from '@/components/product/OrderLogistics'

import CardRecharge from '@/components/card/CardRecharge'
import CardBinding from '@/components/card/CardBinding'
import CardMerge from '@/components/card/CardMerge'
import CardRechargeMoney from '@/components/card/CardRechargeMoney'
import CardRechargeMoneyOk from '@/components/card/CardRechargeMoneyOk'
import CardMy from '@/components/card/CardMy'
import CardQuery from '@/components/card/CardQuery'
import CardInfo from '@/components/card/CardInfo'
import CardFlow from '@/components/card/CardFlow'
import CardSearch from '@/components/card/CardSearch'
import CardHelp from '@/components/card/CardHelp'
import CardSpend from '@/components/card/CardSpend'
import CardEditPW from '@/components/card/CardEditPW'

import MovieHome from '@/components/movie/Home'
import MovieFilm from '@/components/movie/Film'
import MovieCinema from '@/components/movie/Cinema'
import MovieCinemaDetails from '@/components/movie/CinemaDetails'
import MovieCinemaByFilm from '@/components/movie/CinemaByFilm'
import MovieField from '@/components/movie/Field'
import MovieSeat from '@/components/movie/Seat'
import MovieOrderPay from '@/components/movie/OrderPay'
import MovieOrders from '@/components/movie/orders'
import MovieOrderDetails from '@/components/movie/OrderDetails'
import ConfirmCinemaOrder from '@/components/movie/ConfirmCinemaOrder'

import ShowHome from '@/components/show/Home'
import ShowDetail from '@/components/show/Detail'
import showOrderAction from '@/components/show/OrderAction'
import showOrderPay from '@/components/show/OrderPay'
import ShowAddressList from '@/components/show/AddressList'
import ShowAddressAdd from '@/components/show/AddressAdd'
import ShowOrderDetails from '@/components/show/OrderDetails'
import ShowOrder from '@/components/show/Order'

// import TourismAgency from '@/components/tourism/Agency'
// import TourismAgencyList from '@/components/tourism/AgencyList'
// import TourismAgencyDetail from '@/components/tourism/AgencyDetail'
// import TourismGuide from '@/components/tourism/Guide'
// import TourismGuideList from '@/components/tourism/GuideList'
// import TourismGuideDetail from '@/components/tourism/GuideDetail'
// import TourismAddress from '@/components/tourism/Address'
// import TourismAddressForm from '@/components/tourism/AddressForm'
// import TourismOrderForm from '@/components/tourism/OrderForm'
// import TourismTickets from '@/components/tourism/Tickets'
// import TourismTicketsDetail from '@/components/tourism/TicketDetail'
// import TourismOrders from '@/components/tourism/Orders'
// import TourismOrderDetail from '@/components/tourism/OrderDetail'
// import TourismMap from '@/components/tourism/Map'
// import TourismSpots from '@/components/tourism/Spots'
// import TourismArea from '@/components/tourism/Area'
// import TourismSpotDetail from '@/components/tourism/SpotDetail'
// import TourismStrategys from '@/components/tourism/Strategys'
// import TourismStrategyDetail from '@/components/tourism/StrategyDetail'

// import AcHome from '@/components/ac/Home'
// import AcEnrollDetail from '@/components/ac/EnrollDetail'
// import AcEnrollForm from '@/components/ac/EnrollForm'
// import AcOrders from '@/components/ac/Orders'
// import AcOrderDetails from '@/components/ac/OrderDetails'
// import AcMap from '@/components/ac/map'
// import AcOrderPay from '@/components/ac/OrderPay'

import ArticleDetail from '@/components/article/Detail'
import ArticleHome from '@/components/article/Home'

// 聚合支付
import PayChannel from '@/components/payment/PayChannel'
import XianJinKaPay from '@/components/payment/XianJinKaPay'
import CiKaPay from '@/components/payment/CiKaPay'

Vue.use(Router)

export default new Router({
  routes: [
    // 首页
    {
      path: '*',
      redirect: '/movie/home'
    },
    // {
    //   path: '*',
    //   redirect: '/movie/home',
    //   meta: {
    //     power: true,
    //     keepAlive: true
    //   }
    // },
    {
      path: '/product/orderLogistics/:id',
      name: '查看物流',
      component: ProductOrderLogistics,
      meta: {
        power: true
      }
    },
    {
      path: '/user/register',
      name: '注册',
      component: UserRegister,
      meta: {
        power: false
      }
    },
    {
      path: '/user/loginPassword',
      name: '账户密码登录',
      component: UserLoginPassword,
      meta: {
        power: false
      }
    },
    {
      path: '/user/loginCard',
      name: '卡号密码登录',
      component: UserLoginCard,
      meta: {
        power: false
      }
    },
    {
      path: '/user/loginSea',
      name: '海员登录',
      component: UserLoginSea,
      meta: {
        power: false
      }
    },
    {
      path: '/user/loginCardPhone',
      name: '卡号登录绑定手机',
      component: UserLoginCardPhone,
      meta: {
        power: true
      }
    },
    {
      path: '/user/loginCode',
      name: '验证码登录',
      component: UserLoginCode,
      meta: {
        power: false
      }
    },
    {
      path: '/user/findPassword1',
      name: '找回密码',
      component: UserFindPassword1,
      meta: {
        power: false
      }
    },
    {
      path: '/user/findPassword2',
      name: '安全监测',
      component: UserFindPassword2,
      meta: {
        power: false
      }
    },
    {
      path: '/user/findPassword3',
      name: '找回密码',
      component: UserFindPassword3,
      meta: {
        power: false
      }
    },
    {
      path: '/user/home',
      name: '个人中心',
      component: UserHome,
      meta: {
        power: true
      }
    },
    {
      path: '/user/updata',
      name: '个人中心',
      component: UserUpdata,
      meta: {
        power: true
      }
    },

    {
      path: '/success',
      name: '操作成功',
      component: Success,
      meta: {
        power: false
      }
    },
    {
      path: '/fail',
      name: '操作失败',
      component: Fail,
      meta: {
        power: false
      }
    },
    {
      path: '/error',
      name: '系统异常',
      component: Error,
      meta: {
        power: false
      }
    },
    // {
    //   path: '*',
    //   redirect: '/index',
    //   meta: {
    //     power: true,
    //     keepAlive: true
    //   }
    // },
    {
      path: '/index',
      name: '首页',
      component: Index,
      meta: {
        power: true,
        keepAlive: true,
        isBack: false
      }
    },
    {
      path: '/orderPayOnceCard/:id',
      name: '次卡支付',
      component: OrderPayOnceCard,
      meta: {
        power: true
      }
    },
    {
      path: '/orderPayCashCard/:id',
      name: '现金卡支付',
      component: OrderPayCashCard,
      meta: {
        power: true
      }
    },
    {
      path: '/product/cart',
      name: '购物车',
      component: ProductCart,
      meta: {
        power: true
      }
    },
    {
      path: '/product/cartEdit',
      name: '编辑购物车',
      component: ProductCartEdit,
      meta: {
        power: true
      }
    },
    {
      path: '/product/orderEvaluate/:id',
      name: '评价商城订单',
      component: ProductOrderEvaluate,
      meta: {
        power: true
      }
    },
    {
      path: '/product/addressList',
      name: '选择收货地址',
      component: ProductAddressList,
      meta: {
        power: true
      }
    },
    {
      path: '/product/addressListManage',
      name: '管理收货地址',
      component: ProductAddressListManage,
      meta: {
        power: true
      }
    },
    {
      path: '/product/addressAdd',
      name: '添加收货地址',
      component: ProductAddressAdd,
      meta: {
        power: true
      }
    },
    {
      path: '/product/class',
      name: '分类搜索',
      component: ProductClass,
      meta: {
        keepAlive: true,
        isBack: false
      }
    },
    {
      path: '/product/searchClass',
      name: '分类搜索',
      component: ProductSearchClass,
      meta: {
        keepAlive: true,
        isBack: false
      }
    },
    {
      path: '/product/searchForm',
      name: '搜索',
      component: ProductSearchForm,
      meta: {
        power: true
      }
    },
    {
      path: '/product/searchForm/:q',
      name: '搜索',
      component: ProductSearchForm,
      meta: {
        power: true
      }
    },
    {
      path: '/product/searchScreen',
      name: '搜索',
      component: ProductSearchScreen,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/product/searchScreen/:id',
      name: '搜索',
      component: ProductSearchScreen,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/product/orderPay',
      name: '订单结算',
      component: ProductOrderPay,
      meta: {
        power: true
      }
    },
    {
      path: '/product/orderPayCheck/:id',
      name: '订单结算',
      component: ProductOrderPayCheck,
      meta: {
        power: true
      }
    },
    {
      path: '/product/shForm',
      name: '商品搜索',
      component: ProductShForm,
      meta: {

      }
    },
    {
      path: '/product/shList',
      name: '商品搜索',
      component: ProductShList,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/product/orderDetails/:id',
      name: '订单详情',
      component: ProductOrderDetails,
      meta: {
        power: true
      }
    },
    {
      path: '/product/orderDetailsLog/:id',
      name: '订单详情',
      component: ProductOrderDetailsLog,
      meta: {
        power: true
      }
    },
    {
      path: '/product/orders',
      name: '商城订单',
      component: ProductOrders,
      meta: {
        keepAlive: true,
        power: true
      }
    },
    {
      path: '/product/:id',
      name: '商品详情',
      component: Product,
      meta: {
        power: true,
        productInfo: true
      }
    },

    {
      path: '/card/recharge',
      name: '卡券充值',
      component: CardRecharge,
      meta: {
        power: true
      }
    },
    {
      path: '/card/CardRechargeMoney',
      name: '卡券充值',
      component: CardRechargeMoney,
      meta: {
        power: true
      }
    },
    {
      path: '/card/rechargeMoneyOk/:id',
      name: '卡券充值',
      component: CardRechargeMoneyOk,
      meta: {
        power: true
      }
    },
    {
      path: '/card/binding',
      name: '绑定卡券',
      component: CardBinding,
      meta: {
        power: true
      }
    },
    {
      path: '/card/search',
      name: '搜索卡券',
      component: CardSearch,
      meta: {
        power: true
      }
    },
    {
      path: '/card/merge',
      name: '合并卡券',
      component: CardMerge,
      meta: {
        power: true
      }
    },
    {
      path: '/card/my',
      name: '我的卡券',
      component: CardMy,
      meta: {
        power: true
      }
    },
    {
      path: '/card/flow/:id',
      name: '卡券流水',
      component: CardFlow,
      meta: {
        power: true
      }
    },
    {
      path: '/card/query',
      name: '卡券查询',
      component: CardQuery,
      meta: {
        power: true
      }
    },
    {
      path: '/card/info',
      name: '卡券信息',
      component: CardInfo,
      meta: {
        power: true
      }
    },
    {
      path: '/card/help',
      name: '卡券帮助',
      component: CardHelp,
      meta: {
        power: true
      }
    },
    {
      path: '/card/CardSpend',
      name: '消费明细',
      component: CardSpend,
      meta: {
        power: true
      }
    },
    {
      path: '/card/CardEditPW',
      name: '卡劵修改密码',
      component: CardEditPW,
      meta: {
        power: true
      }
    },
    {
      path: '/movieCinema/:id',
      name: '选择影院',
      component: MovieCinema,
      meta: {
        power: true
      }
    },
    {
      //   path: '/movie/cinemaDetails/:id',
      path: '/movie/cinemaDetails',
      name: '选择影院',
      component: MovieCinemaDetails,
      meta: {
        power: true
      }
    },
    {
      path: '/movie/home',
      name: '电影票',
      component: MovieHome,
      meta: {
        power: true,
        keepAlive: true,
        bottomBar: 'movie'
      }
    },
    {
      // path: '/movie/film/:id',
      path: '/movie/film',
      name: '影片详情',
      component: MovieFilm,
      meta: {
        power: true
      }
    },
    {
      path: '/movie/cinema',
      name: '选择影院',
      component: MovieCinema,
      meta: {
        power: true,
        keepAlive: true,
        bottomBar: 'movie'
      }
    },
    {
      path: '/movie/cinemaByFilm/:filmId',
      name: '选择影院',
      component: MovieCinemaByFilm,
      meta: {
        power: true,
        bottomBar: 'movie'
      }
    },
    {
      //   path: '/movie/field/:id',
      path: '/movie/field',
      name: '选择放映场次',
      component: MovieField,
      meta: {
        power: true
      }
    },
    {
      path: '/movie/seat/:id',
      name: '选择座位',
      component: MovieSeat,
      meta: {
        power: true
      }
    },
    {
      path: '/movie/orderPay/:id',
      name: '电影票支付',
      component: MovieOrderPay,
      meta: {
        power: true
      }
    },
    {
      path: '/movie/orders',
      name: '电影订单',
      component: MovieOrders,
      meta: {
        keepAlive: true,
        power: true
      }
    },
    {
      // path: '/movie/orderDetails/:id',
      path: '/movie/orderDetails',
      name: '电影订单详情',
      component: MovieOrderDetails,
      meta: {
        power: true
      }
    },
    {
      path: '/movie/confirmCinemaOrder/:orderId',
      name: '确认电影订单',
      component: ConfirmCinemaOrder,
      meta: {
        power: true
      }
    },
    {
      path: '/show/home',
      name: '演出首页',
      component: ShowHome,
      meta: {
        power: true,
        keepAlive: true
      }
    },
    {
      path: '/show/detail/:id',
      name: '演出详情',
      component: ShowDetail,
      meta: {
        power: true
      }
    },
    {
      path: '/show/orderAction',
      name: '演出支付',
      component: showOrderAction,
      meta: {
        power: true
      }
    },
    {
      path: '/show/orderPay/:id',
      name: '演出支付',
      component: showOrderPay,
      meta: {
        power: true
      }
    },
    {
      path: '/show/addressList',
      name: '地址列表',
      component: ShowAddressList,
      meta: {
        power: true
      }
    },
    {
      path: '/show/addressAdd',
      name: '地址编辑',
      component: ShowAddressAdd,
      meta: {
        power: true
      }
    },
    {
      path: '/show/orderDetail/:id',
      name: '演出订单',
      component: ShowOrderDetails,
      meta: {
        power: true
      }
    },
    {
      path: '/show/order',
      name: '演出订单',
      component: ShowOrder,
      meta: {
        keepAlive: true,
        power: true
      }
    },
    //   {
    //     path: '/tourism/agency',
    //     name: '找旅行社',
    //     component: TourismAgency
    //   },
    //   {
    //     path: '/tourism/agencyList',
    //     name: '找旅行社',
    //     component: TourismAgencyList
    //   },
    //   {
    //     path: '/tourism/agencyDetail/:id',
    //     name: '找旅行社',
    //     component: TourismAgencyDetail
    //   },
    //   {
    //     path: '/tourism/guide',
    //     name: '找导游',
    //     component: TourismGuide
    //   },
    //   {
    //     path: '/tourism/guideList',
    //     name: '找导游',
    //     component: TourismGuideList
    //   },
    //   {
    //     path: '/tourism/guideDetail/:id',
    //     name: '找导游',
    //     component: TourismGuideDetail
    //   },
    //   {
    //     path: '/tourism/address',
    //     name: '选择取票人',
    //     component: TourismAddress
    //   },
    //   {
    //     path: '/tourism/addressForm',
    //     name: '添加取票人',
    //     component: TourismAddressForm
    //   },
    //   {
    //     path: '/tourism/orderForm',
    //     name: '填写订单',
    //     component: TourismOrderForm
    //   },
    //   {
    //     path: '/tourism/tickets',
    //     name: '门票',
    //     component: TourismTickets
    //   },
    //   {
    //     path: '/tourism/ticketDetail',
    //     name: '门票',
    //     component: TourismTicketsDetail
    //   },
    //   {
    //     path: '/tourism/orders',
    //     name: '门票订单',
    //     component: TourismOrders
    //   },
    //   {
    //     path: '/tourism/orderDetail',
    //     name: '门票订单',
    //     component: TourismOrderDetail
    //   },
    //   {
    //     path: '/tourism/map',
    //     name: '地图',
    //     component: TourismMap
    //   },
    //   {
    //     path: '/tourism/spots',
    //     name: '景点',
    //     component: TourismSpots,
    //     meta: {
    //       keepAlive: true,
    //       isBack: false
    //     }
    //   },
    //   {
    //     path: '/tourism/area/:id',
    //     name: '区域',
    //     component: TourismArea
    //   },
    //   {
    //     path: '/tourism/spotDetail/:id',
    //     name: '景点',
    //     component: TourismSpotDetail
    //   },
    //   {
    //     path: '/tourism/strategys',
    //     name: '攻略',
    //     component: TourismStrategys,
    //     meta: {
    //       keepAlive: true,
    //       isBack: false
    //     }
    //   },
    //   {
    //     path: '/tourism/strategyDetail/:id',
    //     name: '攻略',
    //     component: TourismStrategyDetail
    //   },
    // {
    //   path: '/ac/home',
    //   name: '活动中心',
    //   component: AcHome,
    //   meta: {
    //     keepAlive: true,
    //     isBack: false
    //   }
    // },
    // {
    //   path: '/ac/enrollDetail/:id',
    //   name: '活动报名',
    //   component: AcEnrollDetail
    // },
    // {
    //   path: '/ac/enrollForm/:id',
    //   name: '活动报名',
    //   component: AcEnrollForm
    // },
    // {
    //   path: '/ac/orderList',
    //   name: '活动订单',
    //   component: AcOrders,
    //   meta: {
    //     keepAlive: true,
    //     isBack: false
    //   }
    // },
    // {
    //   path: '/ac/orderDetails/:id',
    //   name: '活动订单',
    //   component: AcOrderDetails
    // },
    // {
    //   path: '/ac/map',
    //   name: '活动订单',
    //   component: AcMap
    // },
    // {
    //   path: '/ac/orderPay/:id',
    //   name: '活动订单',
    //   component: AcOrderPay
    // },
    {
      path: '/article/detail/:id',
      name: '文章详情',
      component: ArticleDetail
    },
    {
      path: '/article/home',
      name: '文章详情',
      component: ArticleHome,
      meta: {
        keepAlive: true,
        isBack: false
      }
    },
    {
      path: '/QRcode',
      name: '二维码',
      component: QRcode,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/payment/payChannel',
      name: '支付渠道',
      component: PayChannel,
      meta: {
        power: true
      }
    },
    {
      path: '/payment/xianJinKaPay',
      name: '现金卡支付',
      component: XianJinKaPay,
      meta: {
        power: true
      }
    },
    {
      path: '/payment/ciKaPay',
      name: '次卡支付',
      component: CiKaPay,
      meta: {
        power: true
      }
    }
  ]
})
