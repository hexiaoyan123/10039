<template>
<div class="container ac ac-en-form">
  <Vheader name="活动报名"></Vheader>
  <div class="ac-cont">
    <div class="form-list">
      <div v-for="(item, index) in formList" :key="index">
        <div class="form-item" v-if="item.formCategory == 1">
          <h5 class="form-item-name">{{item.name}} <em v-show="item.required == 1" class="red">*</em></h5>
          <div class="form-item-cont">
            <input type="text" @blur="iptBlur" @focus="iptFocus" v-model="item.val">
            <i class="iconfont clear" v-show="item.val" @click="item.val = ''">&#xe6e1;</i>
          </div>
        </div>
        <div class="form-item" v-if="item.formCategory == 2">
          <h5 class="form-item-name">{{item.name}} <em v-show="item.required == 1" class="red">*</em></h5>
          <div class="form-item-cont">
            <van-radio-group v-model="item.val">
              <van-radio v-for="(str, jndex) in item.value.split(',')" :name="str" :key="jndex">{{str}}</van-radio>
            </van-radio-group>
          </div>
        </div>
        <div class="form-item" v-if="item.formCategory == 3">
          <h5 class="form-item-name">{{item.name}} <em v-show="item.required == 1" class="red">*</em></h5>
          <div class="form-item-cont">
            <van-checkbox-group v-model="item.val">
              <van-checkbox 
                v-for="(str, jndex) in item.value.split(',')" :key="jndex"
                :name="str" checked-color="#ff5162">
                {{str}}
              </van-checkbox>
            </van-checkbox-group>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 页脚开始 -->
  <div class="footer" @click="nextEn" >
    <div class="footer-left">
      合计：<em>￥{{quantity * salesPrice | priceFormat}}</em>
    </div>
    <div class="footer-right">
      我要报名
    </div>
  </div>
  <!-- 页脚结束 -->
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
      info: {},
      formList: [], 
      quantity: 0,
      salesPrice: 0,
      // 验证规则
      validate: {
        v1: /[\a-\z\A-\Z0-9\u4E00-\u9FA5\.]/g,
        v2: /^1(3|4|5|7|8|9)\d{9}$/,
        v3: /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
        v4: /[\a-\z\A-\Z0-9\u4E00-\u9FA5\，\。\“\”]/g
      }
    }
  },
  created () {
    this.getData()
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


    // 获取数据
    getData () {
      let vm = this;
      let checkAc = {}
      if(this.$init.checkAc){
        checkAc = this.$init.checkAc
      }else if(this.$cookies.get('checkAc')){
        checkAc = JSON.parse(this.$cookies.get('checkAc'))
      }
      if(checkAc.activityId != this.$route.params.id){
        vm.$toast('未选择活动');
        return;
      }
      // console.log(checkAc)
      vm.info = checkAc;
      vm.quantity = checkAc.quantity;
      vm.salesPrice = checkAc.salesPrice;
      var formList = []
      checkAc.cacheActivityFormList.forEach((e, i) => {
        var obj = {}
        for(let key in e){
          obj[key] = e[key]
        }
        // if(e.formCategory == 1 || e.formCategory == 2){
        //   obj.val = ''
        // }else if(e.formCategory == 3){
        //   obj.val = []
        // }
        if(e.formCategory == 3){
          obj.val = []
        }else{
          obj.val = ''
        }
        formList.push(obj)
      })
      vm.formList = formList
    },
    // 下一步
    nextEn () {
      let vm = this;
      let ready = true;
      let yanzheng = true;
      let reqSaveOrderItemList = [];
      this.formList.forEach((e, i) => {
        let obj = {
          activityFormId: e.activityFormId,
          result: ''
        }
        if(e.formCategory == 1){
          if(e.required == 1 && e.val == ''){
            ready = false;
            return
          }
          let reg = new RegExp(vm.validate['v' + e.checkRule])
          if(reg.test(e.val)){
            obj.result = e.val;
          }else{
            yanzheng = false;
            vm.$toast(e.name + '格式错误')
            return false;
          }
        }else if(e.formCategory == 2){
          if(e.required == 1 && e.val == ''){
            ready = false;
            return
          }
          obj.result = e.val;
        }else if(e.formCategory == 3){
          if(e.required == 1 && e.val == []){
            ready = false;
            return
          }
          obj.result = e.val.join(',');
        }

        reqSaveOrderItemList.push(obj)
      })

      // 验证必填
      if(! ready){
        vm.$toast('请补全信息');
        return;
      }
      if(! yanzheng){
        return
      }

      // 设置
      let postData = {
        activityId: vm.info.activityId,
        activitySkuId: vm.info.activitySkuId,
        quantity: vm.info.quantity,
        reqSaveOrderItemList: reqSaveOrderItemList
      }
      this.$store.commit('ctrlLoader', true)
      this.$http.post('/panda-activity-api/v1/saveOrder', postData).then(function (response) {
        vm.$store.commit('ctrlLoader', false)
        if(response.data.code == '1000'){
          vm.$router.push('/ac/orderPay/' + response.data.result)
        }else{
          vm.$toast(response.data.msg);
        }
      })
      .catch(function (error) {
        vm.$store.commit('ctrlLoader', false)
        vm.$toast('请求超时，请稍后再试！')
      });
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
    }
  }
}
</script>

<style scoped>
.red{
  color: red;
}
.ac{
  box-sizing: border-box;
  padding-top: 84px;
  padding-bottom: 88px;
}
.ac-cont{
  min-height: 101%;
}
.footer{
  position: fixed;
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
.footer-left{
  background-color: #fff;
  flex: 10;
  padding: 0 30px;
  font-size: 24px;
  text-align: left;
  color: #c1c1c1;
}
.footer-left em{
  font-size: 28px;
  color: #ff5162;
}
.footer-right{
  background-color: #ff5162;
  width: 240px;
}

.form-list{
  padding: 20px 30px;
}
.form-item{
  padding-bottom: 50px;
}
.form-item-name{
  font-size: 24px;
  color: #c1c1c1;
  line-height: 38px;
  margin-bottom: 16px;
}
.form-item-cont{
  position: relative;
}
.form-item-cont input{
  width: 100%;
  display: block;
  outline: none;
  box-sizing: border-box;
  padding: 14px 66px 14px 14px;
  border: 1px solid #eee;
  border-radius: 5px;
  font-size: 24px;
  line-height: 38px;
  list-style: none;
  outline: none;
}
.form-item-cont .clear{
  position: absolute;
  width: 66px;
  height: 66px;
  line-height: 66px;
  text-align: center;
  right: 0;
  top: 0;
  font-size: 28px;
  color: #c1c1c1;
}
</style>

<style>
.ac-en-form .van-checkbox{
  padding: 5px 0;
}
.ac-en-form .van-checkbox--checked{
  border-color: #ff5162;
  background-color: #ff5162;
}
.ac-en-form .van-checkbox--round{
  border-radius: 2px;
}
.ac-en-form  .van-checkbox__icon{
  border-color: #eee;
}
.ac-en-form .van-radio{
  padding: 5px 0;
}
.ac-en-form .van-radio .van-icon-check{
  color: #eee;
}
.ac-en-form .van-radio .van-icon-checked{
  color: #ff5162;
}
</style>