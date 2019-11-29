<template>
  <div class="login">
    <input id="reset-input" type="hidden">
    <div class="cont">
        <div class="form-cont input-card">
            <div class="form-grop">
                <!-- <label class="form-lable">
                  <van-icon name="card" />
                </label> -->
                <input @blur="iptBlur" @focus="iptFocus" class="form-input " type="number" jump=true  v-model.trim="form.phone" placeholder="请输入卡号">
                <div class="form-more">
                    <van-icon name="close" v-show="form.phone" @click="form.phone = ''"/>
                </div>
            </div>
            <div class="form-grop">
                <!-- <label class="form-lable">
                  <van-icon @click="passwordShow = false" v-show="passwordShow" name="password-view" />
                  <van-icon @click="passwordShow = true" v-show="! passwordShow" name="password-not-view" />
                </label> -->
                <input @blur="iptBlur" @focus="iptFocus" v-show="! passwordShow" class="form-input" jump=true type="password" v-model.trim="form.password" placeholder="请输入密码">
                <input @blur="iptBlur" @focus="iptFocus" v-show="passwordShow" class="form-input" jump=true type="text" v-model.trim="form.password" placeholder="请输入密码">
                <div class="form-more">
                    <van-icon  name="close"  v-show="form.password" @click="form.password = ''" />
                </div>
            </div>
        </div>
        <div class="form-btn" @click="loginClick">登录</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginCard',
  data () {
    return {
      passwordShow: false,
      form: {
        phone: '',
        password: ''
      },
      height: '100%'
    }
  },
  created () {
    // 设置登陆入口
    this.$cookies.set('loginUrl', '/user/loginSea');
    this.$init.loginUrl = "/user/loginSea";

    // 清除刷新token
    this.$cookies.remove('refreshToken');
    this.$init.refreshToken = '';
    this.$init.accessToken = '';
    this.$init.user = {
      cacheChannel: {},
      cacheUser: {}
    }

    // 清除刷新token轮询
    if(window.$refreshTokenInterval){
      clearInterval(window.$refreshTokenInterval);
      window.$refreshTokenInterval = false;
    }

    // function jump_top(){ 
    //   var u = navigator.userAgent;
    //   var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    //   var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    //   if(isAndroid){
    //     $("body").css("height","0px");
    //     $("body").css("height",document.body.scrollHeight);
    //     $('[jump=true]').bind("focus",function(event){
    //       if($(event.target).attr("type")=="button")return;
    //       $("body").css("margin-bottom","500px");
    //       $(window).scrollTop($(event.target).offset().top-100);
    //       event.preventDefault();
    //     });
    //     $("body").bind("click",function(event){
    //       if($(event.target).attr("type")=="button")return;
    //       $("body").css("height","0px");
    //       $("body").css("height",document.body.scrollHeight);
    //       $("body").css("margin-bottom","0px");
    //       event.preventDefault();
    //     }); 
    //   };
    // }
    // jump_top();
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


    // 输入法焦距
    inputFocus () {
      this.height = '150%';
    },
    // 登录
    loginClick () {
      let vm = this;
      if(this.form.phone == ''){
        this.$toast('请输入手机号')
        return false;
      }else if(this.form.password == ''){
        this.$toast('请输入密码')
        return false;
      }
      let postData = {
        'loginMethod':'3',
        'username': this.form.phone,
        'password': this.form.password,
        'authCode': ''
      }
      this.$http.post('/v1/login', postData).then(function (response) {
        if(response.data.code == '1000'){
          // 权限赋值
          vm.$init.user = response.data.result;
          vm.$init.accessToken = response.data.result.accessToken;
          vm.$init.refreshToken = response.data.result.refreshToken;
          vm.$cookies.set('refreshToken', response.data.result.refreshToken, '30d');

          // 刷新token定时器
          window.$refreshTokenInterval = setInterval(() => {
            vm.$http.get('/v1/refreshToken/' +vm.$init.refreshToken).then((response) => {
              if (response.data.code === '1000') {
                vm.$init.user = response.data.result;
                vm.$init.accessToken = response.data.result.accessToken;
              }
            })
          }, 100 * 60 * 1000)

          // 跳转到首页
          vm.$router.push('/index');
        }else{
          vm.$toast(response.data.msg)
        }
      })
      .catch(function (error) {
        vm.$toast('请求超时，请稍后再试！')
      });
    },
    // 验证手机号
    isPhone (str) {
      var myreg=/^[1][2,3,4,5,7,8,9][0-9]{9}$/;  
      if (!myreg.test(str)) {  
        return false;  
      } else {  
        return true;  
      }
    }
  }
}
</script>

<style scoped>
.login{
  min-height: 100%;
  position: relative;
  background: url(../../assets/sea.jpg) no-repeat;
  background-size: 100% auto;
  background-color: #003444;
}
.img-out{
  display: block;
  width: 230px;
  height: 176px;
  margin: 0 auto;
}
.logo{
  width: 100%;
}
.cont{
  padding: 10px 75px;
  padding-top: 700px;
  height: 100%;
}
.form-grop{
    display: flex;
    border: 4px solid #fff;
    font-size: 28px;
    line-height: 66px;
    margin-bottom: 24px;
    position: relative;
    background-color: rgba(0, 0, 0, 0.4);
    border-radius: 44px;
    box-sizing: border-box;
    padding: 10px 30px;
}
.form-input{
    flex: 10;
    border: none;
    outline: none;
    font-size: 28px;
    line-height: 66px;
    background-color: transparent;
    color: #fff;
}
.van-icon{
    display: inline-block;
    padding: 0 5px;
}
.form-btn{
    color: #fff;
    line-height: 88px;
    font-size: 28px;
    text-align: center;
    border-radius: 40px;
    background-color: #65cdda;
}
.form-cont{
    padding-bottom: 0px;
}
.form-link{
  line-height: 80px;
  padding-top: 30px;
  color: #818181;
}
.form-link a{
  color: #818181;
  font-size: 28px;
}
.form-link-left{
  float: left;
}
.form-link-right{
  float: right;
}
.out{
  position: absolute;
  font-size: 32px;
  color: #818181;
  top: 30px;
  left: 30px;
}
.form-more-colse{
  position: absolute;
  line-height: 66px;
  top: 0;
  right: 20px;
}
::-webkit-input-placeholder { /* WebKit, Blink, Edge */
    color:    #fff;
}
:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
   color:    #fff;
}
::-moz-placeholder { /* Mozilla Firefox 19+ */
   color:    #fff;
}
:-ms-input-placeholder { /* Internet Explorer 10-11 */
   color:    #fff;
}
.form-more{
  color: #fff;
  font-size: 36px;
  line-height: 36px;
  padding-top: 12px;
}
</style>
