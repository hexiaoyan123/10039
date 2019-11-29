<template>
  <div class="container">

    <!-- 搜索开始 -->
    <div class="seanch-btn" @click="goForm">
      <i class="iconfont">&#xe6ac;</i> 搜索商品
    </div>
    <!-- 搜索结束 -->

    <div class="class-cont">
      <div class="class-left">
        <ul class="class-nav-list">
          <li class="class-nav-item" :class="{'on': nowProductId == item.id}" v-for="(item, index) in navList" :key="index" @click="checkProduct(item)">
            {{item.name}}
          </li>
        </ul>
      </div>
      <div class="class-right">
        <class-item v-if="productIds.indexOf(item.id) >= 0" v-show="nowProductId == item.id" :category="item.id" v-for="(item, index) in navList" :key="index"></class-item>
      </div>
    </div>
  </div>
</template>

<script>
import SearchClassItem from './SearchClassItem'
export default {
  name: 'SearchClass',
  components: {
    'class-item': SearchClassItem
  },
  data () {
    return {
      // 弹出层
      popup: false,
      // 菜单列表
      navList: [],
      // 当前类别
      nowProductId: '',
      // 请求过的类别id集合
      productIds: [],
      // 渠道ID
      channelId: this.$init.channelId,
    }
  },
  created () {
    // if(this.$route.query.channel){
    //   this.channelId = this.$route.query.channel
    // }
    this.getListProductCategory();
  },
  methods: {
    // 搜索
    goForm () {
      this.$router.push('/product/shForm')
      // this.$router.push('/product/searchForm')
    },
    // 选择类别
    checkProduct (obj) {
      this.nowProductId = obj.id;
      if(this.productIds.indexOf(obj.id) < 0){
        this.productIds.push(obj.id)
      }
    },
    // 获取商品分类
    getListProductCategory () {
      let vm = this;
      this.$http.get('/panda-shop-api/v1/listProductCategory/0').then(function (response) {
        if(response.data.code == '1000'){
          if(response.data.result){
            vm.navList = response.data.result;
            vm.checkProduct(vm.navList[0])
          }
        }else{
          vm.$toast(response.data.msg)
        }
      })
      .catch(function (error) {
        vm.$toast('请求超时，请稍后再试！')
      });
    },
    // 返回上一页
    goBack () {
      this.$router.back(-1);
    },
  },
  beforeRouteLeave (to, from, next) {
    to.meta.isBack = false;
    from.meta.isBack = true;
    next()
  },
  activated () {
    if(! this.$route.meta.isBack){
      this.getListProductCategory();
    }
  }
}
</script>

<style scoped>
.container{
  background-color: #fff;
  padding-top: 100px;
  padding-bottom: 88px;
}

.class-left{
  width: 180px;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  background-color: #ffffff;
}
.class-nav-list{
  border-top: 1px solid #eee;
  border-right: 1px solid #eee;
}
.class-nav-item{
  line-height: 96px;
  font-size: 24px;
  text-align: center;
  border-bottom: 1px solid #eee;
  border-left: 6px solid transparent;
}
.class-nav-item.on{
  border-left-color: #ff5162;
  font-weight: 700;
  background-color: #f8f8f8;
}
.class-right{
  background-color: #f8f8f8;
  flex: 10;
  height: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
.class-cont{
  height: 100%;
  display: flex;
}

.seanch-btn{
  position: absolute;
  width: 90%;
  height: 70px;
  line-height: 70px;
  box-shadow: 0 0 20px #f0f0f0;
  left: 5%;
  top: 15px;
  border-radius: 6px;
  color: #c1c1c1;
  font-size: 24px;
  box-sizing: border-box;
  padding: 0 46px;
}
.seanch-btn .iconfont{
  font-size: 24px;
}
</style>
