<template>
  <div class="container"  ref="backScroller">
    <div class="header-nav">
      <div class="header-nav-city" @click="city.show = true">
        <van-icon name="location" />
        <em>{{city.city.cityName}}</em>
      </div>
      <div class="header-nav-cont">
        <div class="new-tabs">
          <ul>
            <li class="new-tab" :class="{'new-tab-now': showType == item.id}" @click="tabClick(item.id)" v-for="(item, index) in tabList" :key="index">{{item.name}}</li>
          </ul>
        </div>
      </div>
    </div>

    <van-list
      v-model="falls.loading"
      :finished="falls.finished"
      @load="getList" >
      <ul class="move-list">
        <li class="move-item clearfix" v-for="(item, index) in list" :key="index" @click="goDetail(item.goodsId)">
          <div class="move-item-l">
            <figure class="img">
              <img :src="item.poster" alt="">
            </figure>
          </div>
          <div class="move-item-r">
            <h3 class="unoverflow">{{item.goodsName}}</h3>
            <div class="move-item-lable unoverflow">{{item.startTime | dateFormat}}</div>
            <p class="unoverflow">{{item.venueName}}</p>
            <!-- <p class="unoverflow show-item-price">
              <span>￥</span>
              <em>{{item.price | priceFormat}}</em>
            </p> -->
            <span class="move-item-btn" @click.stop="goDetail(item.goodsId)">购票</span>
          </div>
        </li>
      </ul>
      <h3 v-show="list.length == 0" class="noData">暂无数据！</h3>
      <h3 v-show="falls.finished && list.length > 0" class="noData">到底了！</h3>
    </van-list>

    <!-- 城市选择开始 -->
    <van-popup v-model="city.show" position="right" :overlay="false">
      <city :v-city="city.city" @closeCity="closeCityModo" @clickCity="getCity"></city>
    </van-popup>
    <!-- 城市选择结束 -->

    <!-- 回到顶部结束 -->
    <go-top vlass="container"></go-top>
    <!-- 回到顶部结束 -->
  </div>
</template>

<script>
import City from './City'
import GoTop from '../GoTop'
export default {
  components: {
    'city': City,
    'go-top': GoTop
  },
  data () {
    return {
      // 城市
      city: {
        show: false, //城市弹窗
        city: {}, // 选中的地址
      },
      // 分类
      tabList: [{
        id: 0,
        name: '全部'
      }, {
        id: 1,
        name: '演唱会'
      }, {
        id: 2,
        name: '话剧歌剧'
      }, {
        id: 3,
        name: '音乐会'
      }, {
        id: 4,
        name: '儿童亲子'
      }, {
        id: 5,
        name: '休闲展览'
      }, {
        id: 6,
        name: '舞蹈芭蕾'
      }, {
        id: 7,
        name: '戏曲综艺'
      }, {
        id: 8,
        name: '体育赛事'
      }],
      showType: 0, // 类型切换
      falls: {
        loading: false, // 加载中
        finished: false, // 结束调用
      },
      list: [],
      pageNum: 0,

      // 热门
      hotFilm: {
        list: [],
      },
      // 待映
      awaitFilm: {
        list: []
      },
      
    }
  },
  created () {
    // 城市处理
    if(this.$init.showCity){
      this.getCity(this.$init.showCity);
    }else if(this.$cookies.get('showCity')){
      let data = JSON.parse(this.$cookies.get('showCity'));
      this.getCity(data);
    }else{
      let city = {cityCode: "110100",cityEnName: "beijing",cityId: "1",cityName: "北京",isHot: "11"}
      this.$cookies.set('showCity', JSON.stringify(city));
      this.getCity(city);
    }
    this.getList(true);
  },
  methods: {
    // 关闭城市选择
    closeCityModo (data) {
      this.city.show = false;
    },
    // 获取选中的地址
    getCity (data) {
      this.city.city = data;
      this.$init.showCity = data;
      this.$cookies.set('showCity', JSON.stringify(data));
      this.city.show = false;
    },
    // 点击标签
    tabClick (id) {
      this.showType = id;
      this.getList(true);
    },
    // 获取列表
    getList (clear) {
      let vm = this;
      if(clear){
        this.list  =[];
        this.pageNum = 1;
        this.falls.finished = false;
      }else{
        this.pageNum += 1;
      }
      vm.falls.loading = true;
      var postData = {
        pageNo: this.pageNum,
        pageSize: 20,
        cityCode: this.city.city.cityCode,
        cateId: this.showType
      }
      this.$http.post('/panda-ticket-api/v1/pageGoods', postData).then(function (response) {
        if(response.data.code == '1000'){
          if(response.data.result && response.data.result.data){
            if(response.data.result.data.length > 0){
              vm.list = vm.list.concat(response.data.result.data);
              if(response.data.result.data.length < postData.pageSize){
                vm.falls.finished = true;
              }
              vm.$nextTick(() => {
                vm.falls.loading = false;
              })
            }else{
              vm.falls.loading = false;
              vm.falls.finished = true;
            }
          }else{
            vm.falls.loading = false;
            vm.falls.finished = true;
          }
        }else{
          vm.$toast(response.data.msg)
        }
      })
      .catch(function (error) {
        vm.$toast('请求超时，请稍后再试！')
      });
    },
    // 购票
    goDetail (id) {
      this.$router.push('/show/detail/'+id);
    },
    // 返回上一页
    goBack () {
      this.$router.back(-1);
    },
  },
  filters: {
    // 金钱格式化
    priceFormat (value) {
      if(value){
        return ((value-0)/ 100).toFixed(2)
      }else if(value === 0){
        return '0'
      }else{
        return ''
      }
    },
    // 时间格式化
    dateFormat (shijianchuo) {
      function add0(m){return m<10?'0'+m:m }
      var time = new Date(shijianchuo *1000);
      var y = time.getFullYear();
      var m = time.getMonth()+1;
      var d = time.getDate();
      var h = time.getHours();
      var mm = time.getMinutes();
      var s = time.getSeconds();
      return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
    }
  },
  beforeRouteEnter (to,from,next) {
    let scrollTop = sessionStorage.getItem('backScroller')
    if(to.meta.isBack && scrollTop){
      next(vm => {
        if(vm && vm.$refs.backScroller){
          vm.$refs.backScroller.scrollTo(0, scrollTop)
        }
      })
    }else{
      next()
    }
  },
  beforeRouteLeave (to, from, next) {
    to.meta.isBack = false;
    from.meta.isBack = true;
    window.sessionStorage.setItem('backScroller', this.$refs.backScroller.scrollTop)
    next()
  }
}
</script>

<style scoped>
.container{
  background-color: #fff;
  padding-top: 80px;
  padding-bottom: 88px;
}
.top img{
  display: block;
  width: 100%;
}

header{
  height: 85px;
  line-height: 85px;
  /* position: absolute; */
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  background-color: #ff5162;
  color: #fff;
  text-align: center;
  display: flex;
  font-size: 28px;
  z-index: 101;
}
.header-back{
  width: 70px;
  text-align: center;
}
.header-cont{
  flex: 10;
}
.header-more{
  width: 75px;
  text-align: center;
}
header .iconfont{
  font-size: 28px;
}

.move-list{
  width: 100%;
  overflow: hidden;
}
.move-item{
  padding: 20px 20px 12px 20px;
  box-sizing: border-box;
  border-bottom: 1px solid #eee;
}
.move-item-r{
  padding-left: 30px;
  width: 82%;
  float: right;
  box-sizing: border-box;
  position: relative;
  padding-top: 19px;
}
.move-item-l{
  width: 18%;
  float: left;
}
.move-item-l .img{
  display: block;
  width: 100%;
  height: 160px;
  overflow: hidden;
  border-radius: 5px;
}
.move-item-l .img img{
  display: block;
  height: 100%;
  width: 100%;
}
.move-item-r h3{
  font-size: 28px;
  line-height: 38px;
  font-weight: 700;
  /* height: 120px; */
  padding-bottom: 10px;
}
.move-item-lable{
  font-size: 24px;
  line-height: 38px;
}
.move-item-r p{
  font-size: 24px;
  line-height: 38px;
  /* margin-top: 16px; */
  width: 70%;
}
.move-item-btn{
  position: absolute;
  display: block;
  line-height: 60px;
  padding: 0 30px;
  border-radius: 6px;
  color: #fff;
  background-color: #ff5162;
  right: 0;
  bottom: 0;
}

/* 头部变导航 */
.header-nav{
  position: fixed;
  box-sizing: border-box;
  width: 100%;
  height: 80px;
  font-size: 24px;
  line-height: 80px;
  top: 0;
  left: 0;
  padding-left: 120px;
  background-color: #fff;
  z-index:10;
  overflow: hidden;
  box-sizing: border-box;
}
.header-nav-city{
  position: absolute;
  left: 0;
  width: 120px;
  box-sizing: border-box;
  padding: 0 10px;
  height: 56px;
  line-height: 56px;
  top: 10px;
  overflow: hidden;
  text-align: center;
  color: #ff5162;
  border-right: 4px solid #ff5162;
}
.header-nav-cont{
  width: 100%;
}
/* 时间分期 */
.new-tabs{
  line-height: 76px;
}
.new-tabs ul{
  display: -webkit-box;
  overflow-y: hidden;
  overflow-x: scroll;
  -webkit-overflow-scrolling: touch;
  -webkit-box-flex: 1;
  white-space:nowrap; 
}
.new-tab{
  width: 200px;
  overflow: hidden;
  font-size: 24px;
  text-align: center;
  border-bottom: 5px solid transparent;
}
.new-tab-now{
  color: #ff5162;
  border-color: #ff5162;
}

/* 改版头部 */
.new-header{
  position: relative;
  box-sizing: border-box;
  background-color: #fff;
  z-index: 9;
  font-size: 24px;
  line-height: 80px;
  text-align: center;
}
.nh-left{
  position: absolute;
  left: 20px;
  color: #ff5162;
}
.nh-center-out{
  display: inline-block;
  margin: 0 auto;
  border: 4px solid #ff5162;
  line-height: 52px;
  color: #ff5162;
  border-radius: 4px;
  /* overflow: hidden; */
}
.nh-center-item{
  display: inline-block;
  width: 120px;
}
.nh-center-item-on{
  color: #fff;
  background-color: #ff5162;
}
</style>

<style>
.van-popup--right{
  height: 100%;
  width: 100%;
  background-color: #fff;
}
</style>
