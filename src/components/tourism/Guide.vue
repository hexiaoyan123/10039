<template>
<div class="container agency">
  <Vheader name="找导游"></Vheader>
  <div class="logo-cont">
    <figure class="img">
      <img src="@/assets/tour/logo1.png" alt="">
    </figure>
  </div>
  <div class="form-cont">
    <div class="agency-form-name-cont">
      <div class="agency-form-name-placeholder" v-show="! form.name">
        <i class="iconfont">&#xe6ac;</i>
        关键词/导游证号 姓名 星级
      </div>
      <div class="agency-form-name-clear" v-show="form.name" @click="form.name = ''">
        <i class="iconfont">&#xe6e1;</i>
      </div>
      <input @blur="iptBlur" @focus="iptFocus" class="agency-form-name" v-model="form.name" type="text">
    </div>
    <div class="agency-form-select">
      <label>筛选条件</label>
    </div>
    <div class="agency-form-select2">
      <label>性别</label>
      <ul>
        <li class="btn-item" :class="{'btn-item-on': form.sex == 1}" @click="sexCheck(1)">
          <span>男</span>
        </li>
        <li class="btn-item" :class="{'btn-item-on': form.sex == 2}" @click="sexCheck(2)">
          <span>女</span>
        </li>
      </ul>
    </div>
    <div class="agency-form-select2">
      <label>等级</label>
      <ul>
        <li class="btn-item" :class="{'btn-item-on': form.grade == item.val}" v-for="item in gradeList" :key="item.val" @click="gradeCheck(item.val)">
          <span>{{item.label}}</span>
        </li>
      </ul>
    </div>
    <div class="agency-form-select2">
      <label>评星</label>
      <ul>
        <!-- <li class="btn-item" :class="{'btn-item-on': form.starLevel == index + 1}" v-for="(item, index) in starList" :key="index" @click="starLevelCheck(index + 1)">
          <span>{{item}}</span>
        </li> -->
        <li class="btn-item" :class="{'btn-item-on': form.starLevel == item.val}" v-for="(item, index) in starList2" :key="index" @click="starLevelCheck(item.val)">
          <span>{{item.label}}</span>
        </li>
      </ul>
    </div>
    <div class="agency-up-btn" @click="goPath">查询</div>
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
      starList: ['一星', '二星', '三星', '四星', '五星'],

      starList2: [{
        label: '五星',
        val: 5
      }, {
        label: '四星',
        val: 4
      }, {
        label: '三星',
        val: 3
      }, {
        label: '二星',
        val: 2
      }, {
        label: '一星',
        val: 1
      }],
      gradeList: [{
        label: '特级',
        val: 4
      }, {
        label: '高级',
        val: 3
      }, {
        label: '中级',
        val: 2
      }, {
        label: '初级',
        val: 1
      }],
      form: {
        sex: '', // 性别（1：男；2：女；）
        grade: '', // 等级
        starLevel: '', // 星级
        name: '', // 名称
      }
    }
  },
  created () {

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


    // 星级 - 选中或取消
    starLevelCheck (num) {
      if(this.form.starLevel == num){
        this.form.starLevel = ''
      }else{
        this.form.starLevel = num
      }
    },
    // 等级 - 选中或取消
    gradeCheck (num) {
      if(this.form.grade == num){
        this.form.grade = ''
      }else{
        this.form.grade = num
      }
    },
    // 性别 - 选中或取消
    sexCheck (num) {
      if(this.form.sex == num){
        this.form.sex = ''
      }else{
        this.form.sex = num
      }
    },
    // 查询
    goPath () {
      this.$router.push({
        path: '/tourism/guideList',
        query: this.form
      })
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
  padding: 14px 0 30px 0;
  font-size: 24px;
  line-height: 36px;
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
  min-width: 90px;
  text-align: center;
}
.btn-item-on{
  border-color: #ff9201;
  color: #ff9201;
}
.agency-up-btn{
  line-height: 80px;
  text-align: center;
  font-size: 28px;
  color: #fff;
  background-color: #ff5162;
  border-radius: 5px;
  margin-top: 60px;
}
.agency-form-select2{
  display: flex;
  padding: 0 0 18px 0;
  font-size: 24px;
  line-height: 36px;
}
.agency-form-select2>label{
  width: 60px;
}
.agency-form-select2>ul{
  flex: 10;
  display: flex;
}
</style>