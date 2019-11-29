<template>
<div class="container ac ignore-cont">
  <Vheader name="活动报名"></Vheader>
  <div class="ac-cont">
    <div class="imgs" v-if="info.imageUrl">
      <van-swipe >
        <van-swipe-item  v-for="(item, index) in info.imageUrl.split(',')" :key="index">
          <figure class="img">
            <img :src="$init.imgIp + item" />
          </figure>
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="info">
      <div class="name">{{info.name}}</div>
      <p class="info-item">
        <i class="iconfont">&#xe6b7;</i>
        {{info.startTime | dateFormat}} - {{info.endTime | dateFormat}}
      </p>
      <p class="info-item" @click="goMap">
        <i class="iconfont">&#xe639;</i>
        {{info.areaName}} {{info.address}}
        <i class="iconfont right">&#xe625;</i>
      </p>
    </div>
    <div class="rich-text" v-html="info.introduction"></div>
    <!-- 用户列表开始 -->
    <div class="user-list">
      <div class="user-list-name">
        已报名（{{cacheRegisterList.length}}）
      </div>
      <div class="user-list-cont">
        <ul class="user-list-cont-in">
          <li class="user-item" v-for="(item, index) in cacheRegisterList" :key="index">
            <figure class="user-img">
              <img v-show="! item.imageUrl" src="../../assets/user.jpg" alt="">
              <img v-show="item.imageUrl && item.imageUrl.indexOf('http://') >= 0" :src="item.imageUrl" alt="">
              <img v-show="item.imageUrl && item.imageUrl.indexOf('http://') < 0" :src="item.imageUrl | imgSpecilize" alt="">
            </figure>
            <p class="user-name unoverflow">{{item.nickname}}</p>
          </li>
        </ul>
      </div>
    </div>
    <!-- 用户列表结束 -->
  </div>
  <!-- 页脚开始 -->
  <div class="footer" @click="showModu(1)" v-show="noTimestamp < info.startTime - 60*60">
    我要报名
  </div>
  <div class="footer" v-show="noTimestamp >= info.startTime -  60*60 && noTimestamp <= info.endTime">
    报名截止
  </div>
  <div class="footer" v-show="noTimestamp > info.endTime">
    活动结束
  </div>
  <!-- 页脚结束 -->

   <!-- 选择商品参数 -->
  <van-actionsheet v-model="show" title="">
    <div class="choice-cont">
      <div class="choice-btn-list">
        <div class="choice-btn-item" @click="checkSku(item)" :class="{'on': item.activitySkuId == sku.activitySkuId}" v-for="item in info.cacheActivitySkuList" :key="item.activitySkuId">
          {{item.name}}
        </div>
      </div>

      <div class="choice-num-cont">
        <div class="choice-num-cont-left">数量</div>
        <div class="choice-num-cont-right">
          <div class="choice-num-reduce" @click="choiceNumReduce">
            <i class="iconfont">&#xe638;</i>
          </div>
          <div class="choice-num-show">
            {{choice.num}}
          </div>  
          <div class="choice-num-add" @click="choiceNumAdd">
            <i class="iconfont">&#xe602;</i>
          </div>
        </div>
      </div>

      <!-- 页脚开始 -->
      <div class="footer2">
        <div class="footer2-left">
          <span v-show="sku.activitySkuId">合计：<em>￥{{sku.salesPrice * choice.num | priceFormat}}</em></span>
          <span v-show="! sku.activitySkuId">请选择</span>
        </div>
        <div class="footer2-right"  @click="nextEn">
          我要报名
        </div>
      </div>
      <!-- 页脚结束 -->
    </div>
  </van-actionsheet>
  <!-- 选择商品参数 -->

</div>
</template>

<script>
import Vheader from '../HeaderV'
export default {
  components: {
    Vheader
  },
  data () {
    return {
      noTimestamp: Date.parse(new Date()) / 1000,
      info: {},
      show: false,
      choice: {
        type: 1, // 类型 (1:加入购物车, 2:立即购买)
        num: 1, // 数量
        price: 0,
        activitySkuId: '',
      },
      sku: {}, // 选中的SKU
      cacheRegisterList: [], // 报名人员
    }
  },
  created () {
    this.getData()
  },
  methods: {
    // 查看地图
    goMap () {
      this.$router.push({
        path: '/ac/map',
        query: {
          longitude: this.info.longitude,
          latitude: this.info.latitude
        }
      })
    },
    // 选中SKu
    checkSku (obj) {
      this.sku = obj;
    },
    // 获取详情
    getData () {
      let vm = this;
      this.$http.get('/panda-activity-api/v1/getActivity/' + this.$route.params.id).then(function (response) {
        if(response.data.code == '1000'){
          if(response.data.result){
            vm.info = response.data.result;
            if(vm.info.cacheRegisterList){
              vm.cacheRegisterList = vm.info.cacheRegisterList
            }
            vm.info.cacheActivitySkuList.forEach((e, i) => {
              if(e.isDefault == 1){
                vm.sku = e;
              }
            })
          }
        }else{
          vm.$toast(response.data.msg);
        }
      })
      .catch(function (error) {
        vm.$toast('请求超时，请稍后再试！')
      });
    },
    // 打开报名弹窗
    showModu (type) {
      this.choice.type = type;
      this.show = true;
    },
    // 数量 +
    choiceNumAdd () {
      this.choice.num += 1;
    },
    // 数量 - 
    choiceNumReduce () {
      if(this.choice.num > 1){
        this.choice.num -= 1;
      }else{
        this.choice.num = 1;
      }
    },
    // 下一步
    nextEn () {
      if(! this.sku.activitySkuId){
        vm.$toast('请选择');
        return;
      }
      this.$init.checkAc = {
        activityId: this.$route.params.id,
        activitySkuId: this.sku.activitySkuId,
        quantity: this.choice.num,
        salesPrice: this.sku.salesPrice,
        cacheActivityFormList: this.info.cacheActivityFormList
      }
      this.$cookies.set('checkAc', JSON.stringify(this.$init.checkAc))

      this.$router.push('/ac/enrollForm/'+this.$route.params.id)
    }
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
}
</script>

<style scoped>
.ac{
  box-sizing: border-box;
  padding-top: 84px;
  padding-bottom: 88px;
  background-color: #f8f8f8;
}
.ac-cont{
  min-height: 101%;
}
.img{
  display: block;
  width: 100%;
  background-color: #fff;
}
.img img{
  display: block;
  width: 100%;
}
.info{
  box-sizing: border-box;
  padding: 20px 30px;
  background-color: #fff;
  margin-bottom: 20px;
}
.name{
  padding: 10px 0 20px 0;
  font-size: 28px;
  line-height: 38px;
}
.info-item{
  font-size: 24px;
  line-height: 60px;
  color: #c1c1c1;
}
.info-item .iconfont{
  color: #ff5162;
  font-size: 24px;
}
.info-item .right{
  float: right;
  color: #c1c1c1;
}
.rich-text{
  padding: 20px 30px;
  background-color: #fff;
}
.user-list{
  background-color: #fff;
  margin-top: 20px;
  padding: 20px 30px;
}
.user-list-name{
  font-size: 24px;
  line-height: 38px;
}
.user-list-cont{
  width: 100%;
  padding: 30px 0 46px 0;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
}
.user-list-cont-in{
  white-space: nowrap;
  height: 148px;
  min-width: 101%;
}
.user-item{
  display: inline-block;
  width: 190px;
}
.user-img{
  width: 110px;
  height: 110px;
  overflow: hidden;
  border-radius: 50%;
  margin: 0 auto;
}
.user-img img{
  display: block;
  width: 100%;
}
.user-name{
  font-size: 24px;
  line-height: 38px;
  text-align: center;
  color: #c1c1c1;
}


dt {
  font-size: 24px;
  line-height: 56px;
  color: #374048;
}
dl {
  clear: both;
  overflow:hidden;
}
dl.hl dt{
  color: #ff5162;
}
dt, dd {
    /* float:left; */
    line-height: 40px;
    /* margin-left: 10px; */
}
.item {
  display: inline-block;
  line-height: 46px;
  padding: 0 26px;
  border-radius: 4px;
  border: 1px solid #d3d3d3;
  margin-bottom: 18px;
  margin-right: 18px;
}
.disabled {
    color:#999;
    border: 1px dashed #666;
}
.active {
  color: #fff;
  background-color: #ff5162;
  border: 1px solid #ff5162;
}

/* 选择商品参数 */
.choice-cont{
  background: #fff;
}
.choice-top{
  padding: 30px 27px 18px 180px;
  position: relative;
  border-bottom: 1px solid #eee;
}
.choice-top .img{
  display: inline-block;
  height: 120px;
  width: 120px;
  border: 1px solid #eee;
  border-radius: 8px;
  position: absolute;
  bottom: 24px;
  left: 27px;
  overflow: hidden;
}
.choice-top .img img{
  display: inline-block;
  height: 100%;
  width: 100%;
}
.choice-top h3{
  line-height: 66px;
  color: #ff5162;
  font-size: 36px;
}
.choice-top p{
  line-height: 56px;
  font-size: 24px;
  color: #818181;
}
#choice-close{
  position: absolute;
  top: 18px;
  right: 18px;
  font-size: 32px;
}
.choice-item{
  padding: 10px 27px;
  font-size: 24px;
  color: #818181;
}
.choice-item h3{
  line-height: 56px;
}
.choice-item li{
  display: inline-block;
  line-height: 46px;
  padding: 0 26px;
  border-radius: 4px;
  border: 1px solid #eee;
  margin-bottom: 18px;
  margin-right: 18px;
}
.choice-item .on{
  color: #fff;
  background-color: #ff5162;
  border: 1px solid #ff5162;
}
.choice-num-cont{
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  padding: 20px 30px;
  line-height: 60px;
  display: flex;
  color: #c1c1c1;
  font-size: 24px;
}
.choice-num-cont-left{
  flex: 10;
}
.choice-num-cont-right{
  text-align: right;
  border: 1px solid #eee;
  border-radius: 5px;
  display: flex;
  text-align: center;
}
.choice-num-reduce{
  width: 80px;
}
.choice-num-show{
  border-left: 1px solid #eee;
  border-right: 1px solid #eee;
  width: 114px;
  color: #ff5162;
}
.choice-num-add{
  width: 80px;
}
.choice-ok{
  color: #fff;
  line-height: 88px;
  text-align: center;
  background-color: #ff5162;
  font-size: 28px;
}
.choice-ok-cont{
  display: flex;
}
.choice-ok-cont .choice-ok{
  flex: 5;
}

.footer{
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 88px;
  line-height: 88px;
  font-size: 28px;
  text-align: center;
  color: #fff;
  background-color: #ff5162;
}

.footer2{
  display: flex;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 88px;
  line-height: 88px;
  font-size: 28px;
  text-align: center;
  color: #fff;
  z-index: 100;
  box-shadow: 0 1px 6px #ccc;
}
.footer2-left{
  background-color: #fff;
  flex: 10;
  padding: 0 30px;
  font-size: 24px;
  text-align: left;
  color: #c1c1c1;
}
.footer2-left em{
  font-size: 28px;
  color: #ff5162;
}
.footer2-right{
  background-color: #ff5162;
  width: 240px;
}


.choice-btn-list{
  padding: 20px 30px 0 30px;
}
.choice-btn-item{
  font-size: 24px;
  line-height: 38px;
  border: 1px solid #eee;
  text-align: center;
  margin-bottom: 20px;
  border-radius: 5px;
  padding: 11px;
}
.choice-btn-item.on{
  background-color: #ff5162;
  border-color: #ff5162;
  color: #fff;
}
</style>

<style>
.van-button--bottom-action.van-button--primary{
  background-color: #ff5162;
}
.van-button--bottom-action{
  background-color: #ff5162;
}
</style>