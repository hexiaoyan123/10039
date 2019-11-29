<template>
  <div class="city-cont">
    <div class="city-list" @scroll.passive="scrollTouch">
      <!-- 搜索开始 -->
      <div class="city-header">
        <div class="city-header-form">
          <div> 选择城市  </div>
        </div>
        <div class="city-header-close"  @click="closeCity">取消</div>
      </div>
      <!-- 搜索结束 -->

      <!-- 当前城市开始 -->
      <div class="city-itme">
        <h3>当前城市</h3>
        <ul class="city-lables clearfix">
          <li @click="closeCity">
            <van-icon name="location" /> 
            {{city.cityName}}
          </li>
        </ul>
      </div>
      <!-- 当前城市结束 -->

      <!-- 热门城市列表开始 -->
      <div class="city-itme"> 
        <h3 id="cityhot">热门城市</h3>
        <ul class="city-lables clearfix">
          <li v-for="(item, index) in hot" :key="index" @click="clickCity(item)">{{item.cityName}}</li>
        </ul>
      </div>
      <!-- 热门城市列表结束 -->

      <!-- 城市列表开始 -->
      <div class="city-itme" v-for="(list, key) in citys" :key="key" :type="key"> 
        <h3 :id="'city'+key">{{key}}</h3>
        <ul class="city-lables clearfix">
          <li v-for="(item, index) in list" :key="index" @click="clickCity(item)">{{item.cityName}}</li>
        </ul>
      </div>
      <!-- 城市列表结束 -->
    </div>

    <!-- 字母导航开始 -->
    <div class="city-letter-cont">
      <ul>
        <li key="hot" @click="maoClick('hot')" :class="{'on': 'hot' == nowKey}">热</li>
        <li v-for="(item, key) in citys" :key="key" @click="maoClick(key)" :class="{'on': key == nowKey}">{{key}}</li>
      </ul>
    </div>
    <!-- 字母导航结束 -->

  </div>
</template>

<script>
export default {
  name: 'MovieCity',
  props: ['vCity'],
  data () {
    return {
      hot: [], // 热门城市
      citys: [], // 城市列表
      nowKey: '', // 当前选择的导航key


      // 城市
      city: {}, // 选中的地址
      list: [], // 地址列表
      address: {},
    }
  },
  created () {
    this.city  = this.vCity;
    this.getList();
  },
  methods: {
    // 关闭窗口
    closeCity () {
      this.$emit('closeCity', false);
    },
    // 点击城市
    clickCity (item) {
      this.city = item;
      this.$emit('clickCity', item);
    },
    // 获取数据
    getList () {
      let vm = this;
      this.$http.get('/panda-ticket-api/v1/listCity').then(function (response) {
        if(response.data.code == '1000'){
          vm.hot = response.data.result.hot;
          vm.citys = response.data.result.city;
        }else{
          vm.$toast(response.data.msg)
        }
      })
      .catch(function (error) {
        vm.$toast('请求超时，请稍后再试！')
      });
    },
    // 锚链接点击
    maoClick (key) {
      var keyDemo = document.querySelector('#city'+key); // 获取元素
      var top = keyDemo.offsetTop; // 需要滑动的距离
      var hesderHeight = 0; // 头部高度
      document.querySelector('.city-list').scrollTop = top-hesderHeight; // 设置滑动
      this.nowKey = key;
    },
    // 滑动监听
    scrollTouch () {
      let vm = this;
      var hesderHeight = 0; // 头部高度
      var Demo = document.querySelector('.city-list');
      var top = Demo.scrollTop; // 滑动距离
      var demoList = document.querySelectorAll('.city-itme');
      demoList.forEach((e, i) => {
        if(e.offsetTop <= top+hesderHeight+10){
          vm.nowKey = e.getAttribute('type');
        }
      })
    },
  }
}
</script>

<style scoped>
header{
  width: 100%;
  font-size: 28px;
  color: #4d4d4d;
  line-height: 84px;
  text-align: center;
  border-bottom: 1px solid #dfdfdf;
  background-color: #fff;
  /* position: absolute; */
  position: fixed;
  top: 0;
  left: 0;
}
.class-back{
  position: absolute;
  width: 80px;
  height: 80px;
  line-height: 92px;
  top: 0;
  left: 0;
  text-align: center;
  font-size: 28px;
}
.header-more{
  position: absolute;
  line-height: 80px;
  top: 0;
  right: 0;
  padding: 0 20px;
  font-size: 32px;
  color: #ff5162;
}
.fix-bar-clear{
  background-color: #fc9800;
}
.city-cont{
  height: 100%;
}
.city-list{
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  /* padding-top: 85px; */
  background-color: #f2f2f2;
}
.city-itme h3{
  background-color: #f2f2f2;
  line-height: 100px;
  font-size: 30px;
  color: #666666;
  padding: 0 20px;
}
.city-lables{
  background-color: #fff;
}
.city-lables li{
  padding: 0 40px;
  line-height: 66px;
  font-size: 24px;
  border-bottom: 1px solid #ededed;
  border-right: 1px solid #ededed;
  box-sizing: border-box;
  overflow: hidden;
}
.city-lables li:nth-child(4n){
  border-right: none;
}
.city-letter-cont{
  position: absolute;
  right: 0;
  top: 120px;
  z-index: 10;
  font-size: 30px;
  line-height: 42px;
  text-align: center;
  width: 60px;
}

/* 新头部开始 */
.city-header{
  padding: 10px 20px;
  background-color: #ff5162;
  display: flex;
}
.city-header-close{
  color: #fff;
  width: 80px;
  text-align: right;
  line-height: 56px;
}
.city-header-form{
  flex: 10;
  position: relative;
  line-height: 56px;
  color: #fff;
  font-size: 32px;
}

/* 搜索列表 */
.s-list{
  position: fixed;
  z-index: 30;
  background-color: rgba(0, 0, 0, 0.3);
  height: 100%;
  width: 100%;
  top: 76px;
  left: 0;
  box-sizing: border-box;
  padding-bottom: 76px;
}
.s-list-in{
  background-color: #fff;
  max-height: 70%;
}
.s-list-in li{
  color: #666666;
  line-height: 66px;
  padding: 0 40px;
  font-size: 24px;
  border-top: 1px solid #ededed;
}
.city-header-form-clear{
  position: absolute;
  right: 0;
  top: 0;
  line-height: 56px;
  width: 50px;
  text-align: center;
  color: #999;
}
</style>