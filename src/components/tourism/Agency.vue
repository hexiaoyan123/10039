<template>
<div class="container agency">
  <Vheader name="找旅行社"></Vheader>
  <div class="logo-cont">
    <figure class="img">
      <img src="@/assets/tour/logo1.png" alt="">
    </figure>
  </div>
  <div class="form-cont">
    <div class="agency-form-name-cont">
      <div class="agency-form-name-placeholder" v-show="! form.name">
        <i class="iconfont">&#xe6ac;</i>
        关键词/旅行社名称
      </div>
      <div class="agency-form-name-clear" v-show="form.name" @click="form.name = ''">
        <i class="iconfont">&#xe6e1;</i>
      </div>
      <input @blur="iptBlur" @focus="iptFocus" class="agency-form-name" v-model="form.name" type="text">
    </div>
    <div class="agency-form-select">
      <label>筛选条件</label>
      <ul>
        <li class="btn-item" v-show="form.travelAreaId == ''" @click="area.show = true">
          <span>城市</span>
          <i class="iconfont">&#xe656;</i>
        </li>
        <li class="btn-item" v-show="form.travelAreaId != ''" @click="area.show = true">
          <span>{{area.name}}</span>
          <i class="iconfont">&#xe656;</i>
        </li>
        <li class="btn-item" v-show="! form.starLevel" @click="star.show = true">
          <span>星级</span>
          <i class="iconfont">&#xe656;</i>
        </li>
        <li class="btn-item" v-show="form.starLevel" @click="star.show = true">
          <span>{{star.name}}</span>
          <i class="iconfont">&#xe656;</i>
        </li>
      </ul>
    </div>
    <div class="agency-up-btn" @click="goAg">查询</div>

    <!-- 选择区域开始 -->
    <div class="area-cont" v-show="area.show">
      <div class="area-cont-top">
        选择城市 <span class="area-cont-close" @click="area.show = false">取消</span>
      </div>
      <div class="area-list-name">
        服务开通城市
      </div>
      <ul class="area-list clearfix">
        <li class="area-item" v-for="(item, index) in areaList" :key="index" @click="checkArea(item)">{{item.name}}</li>
      </ul>
    </div>
    <!-- 选择区域结束 -->

    <!-- 选择星级开始 -->
    <div class="area-cont" v-show="star.show">
      <div class="area-cont-top">
        选择星级 <span class="area-cont-close" @click="star.show = false">取消</span>
      </div>
      <div class="area-list-name">
        星级
      </div>
      <ul class="area-list clearfix">
        <li class="area-item" @click="checkStar(1)">一星</li>
        <li class="area-item" @click="checkStar(2)">二星</li>
        <li class="area-item" @click="checkStar(3)">三星</li>
        <li class="area-item" @click="checkStar(4)">四星</li>
        <li class="area-item" @click="checkStar(5)">五星</li>
      </ul>
    </div>
    <!-- 选择星级结束 -->
  </div>
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
      areaList: [], // 区域列表
      area: {
        show: false,
        name: ''
      },
      // 星级别
      star: {
        show: false,
        name: ''
      },
      form: {
        name: '',
        travelAreaId: '', // 区域
        starLevel: '', // 星级别
      }
    }
  },
  created () {
    this.getAreaList()
  },
  methods: {
    //focus
    iptFocus () {
        this.errorMessage = '';
        this.inFocus = true;
    },
    //blur
    iptBlur () {
      let this_ = this;
      this_.inFocus = false;
      setTimeout(function () {
        if(this_.inFocus == false){
          // 当input 失焦时,滚动一下页面就可以使页面恢复正常
          this_.checkWxScroll();
        }
      },200)
    },
    checkWxScroll(){
        var ua = navigator.userAgent.toLowerCase();
        var u = navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        if(ua.match(/MicroMessenger/i) == 'micromessenger'&&!!u){//在iphone 微信中
          this.temporaryRepair();
        }
    },
    temporaryRepair(){
      var currentPosition,timer;
      var speed=1;//页面滚动距离
      timer=setInterval(function(){
        currentPosition=document.documentElement.scrollTop || document.body.scrollTop;
        currentPosition-=speed;
        window.scrollTo(0,0);//页面向上滚动
        clearInterval(timer);
      },1);
    },

    
    // 查询
    goAg () {
      this.$router.push({
        path: '/tourism/agencyList',
        query: this.form
      })
    },
    // 选择星级
    checkStar (num) {
      var strArr = ['星级', '一星', '二星', '三星', '四星', '五星'];
      this.star.name = strArr[num];
      this.form.starLevel = num;
      this.star.show = false;
    },
    // 选择区域
    checkArea (obj) {
      this.form.travelAreaId = obj.id;
      this.area.name = obj.name;
      this.area.show = false;
    },
    // 获取区域
    getAreaList () {
      let vm = this;
      var postData = {
        channelId: this.$init.channelId,
        parentId: '0',
        name: ''
      }
      this.$http.post('/panda-travel-api/v1/listTravelArea', postData, this.$init.channelId).then(function (response) {
        if(response.data.code == '1000'){
          if(response.data.result && response.data.result.length > 0){
            vm.areaList = response.data.result;
          }
        }else{
          vm.$toast(response.data.msg);
        }
      })
      .catch(function (error) {
        vm.$toast('请求超时，请稍后再试！')
      });
    }
  }
}
</script>

<style scoped>
.agency{
  /* background-color: #fff; */
  padding-top: 84px;
}
.logo-cont{
  padding: 190px 0 300px 0;
}
.img{
  width: 276px;
  margin: 0 auto;
}
.img img{
  display: block;
  width: 100%;
}
.form-cont{
  padding: 0 76px;
  box-sizing: border-box;
}
.agency-form-name-cont{
  position: relative;
}
.agency-form-name-placeholder{
  line-height: 36px;
  font-size: 28px;
  color: #c1c1c1;
  width: 100%;
  position: absolute;
  left: 0;
  top: 18px;
  text-align: center;
  z-index: -1;
}
.agency-form-name-placeholder .iconfont{
  font-size: 28px;
}
.agency-form-name-clear{
  position: absolute;
  right: 0;
  top: 18px;
  width: 50px;
  text-align: center;
  z-index: 5;
}
.agency-form-name-clear .iconfont{
  line-height: 36px;
  font-size: 28px;
  color: #c1c1c1;
}
.agency-form-name{
  background-color: transparent;
  display: block;
  width: 100%;
  box-sizing: border-box;
  outline: none;
  border: none;
  border-bottom: 1px solid #ebebeb;
  padding: 18px 50px 18px 0;
  line-height: 36px;
  font-size: 28px;
  border-radius: 0;
}
.agency-form-name:focus{
  border-color: #ff5162;
}
.agency-form-select{
  display: flex;
  padding: 14px 0 120px 0;
  font-size: 24px;
  line-height: 34px;
}
.agency-form-select>label{
  flex: 10;
}
.agency-form-select>ul{
  display: flex;
}
.btn-item{
  border: 1px solid #ececec;
  color: #808080;
  font-size: 20px;
  padding: 0 12px;
  height: 36px;
  box-sizing: border-box;
  border-radius: 18px;
  margin-left: 14px;
}
.agency-up-btn{
  line-height: 80px;
  text-align: center;
  font-size: 28px;
  color: #fff;
  background-color: #ff5162;
  border-radius: 5px;
}

/* 选择区域 */
.area-cont{
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  background-color: #fff;
  box-sizing: border-box;
  z-index: 1001;
  padding-top: 84px;
  font-size: 24px;
}
.area-cont-top{
  position: absolute;
  width: 100%;
  height: 84px;
  top: 0;
  left: 0;
  line-height: 84px;
  background-color: #fff;
  text-align: center;
  font-size: 28px;
}
.area-cont-close{
  font-size: 24px;
  line-height: 84px;
  width: 100px;
  text-align: center;
  position: absolute;
  right: 0;
  top: 0;
  color: #c1c1c1;
}
.area-list-name{
  padding: 30px;
  font-size: 28px;
  font-weight: 700;
}
.area-list{
  padding: 10px 30px 30px 30px;
}
.area-item{
  font-size: 24px;
  float: left;
  border: 1px solid #eee;
  width: 26%;
  margin-right: 11%;
  text-align: center;
  border-radius: 5px;
  line-height: 46px;
  margin-bottom: 20px;
  box-sizing: border-box;
}
.area-item:nth-child(3n){
  margin-right: 0;
}
</style>