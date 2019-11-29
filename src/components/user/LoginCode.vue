<template>
  <div class="login">
    <!-- <router-link to="/index">
      <van-icon class="out" name="arrow-left" />
    </router-link>-->
    <figure class="logo">
      <img alt="图" title="图" src="../../assets/logo.png" />
    </figure>
    <div class="cont">
      <div class="form-cont">
        <div class="form-grop">
          <label class="form-lable"></label>
          <input
            @blur="iptBlur"
            @focus="iptFocus"
            class="form-input"
            type="number"
            v-model.trim="form.phone"
            placeholder="请输入手机号码"
          />
          <div class="form-more">
            <van-icon name="close" v-show="form.phone" @click="form.phone = ''" />
          </div>
        </div>
        <div class="flex-cont">
          <div class="form-grop flex-left">
            <label class="form-lable"></label>
            <input
              style="width:100px;"
              @blur="iptBlur"
              @focus="iptFocus"
              class="form-input"
              type="number"
              v-model.trim="code.imageCode"
              placeholder="图片验证码"
            />
            <div class="form-more">
              <van-icon name="close" v-show="code.imageCode" @click="code.imageCode = ''" />
            </div>
          </div>
          <div class="flex-right">
            <figure class="form-codeimg" @click="getImgCode">
              <img :src="imgUrl" alt />
            </figure>
          </div>
        </div>
        <div class="form-grop">
          <label class="form-lable"></label>
          <input
            @blur="iptBlur"
            @focus="iptFocus"
            class="form-input"
            type="text"
            v-model.trim="form.code"
            placeholder="请输入验证码"
          />
          <div class="form-more">
            <span v-show="codeNum == 60" @click="getCode" class="on">手机验证码</span>
            <span v-show="codeNum < 60" class="on">{{codeNum}}秒</span>
          </div>
        </div>
      </div>
      <div class="form-btn" @click="upData">登录</div>
      <!-- <div class="form-link">
          <div class="form-link-left">
            <router-link to="/loginPassword">账户密码登录</router-link>
          </div>
          <div class="form-link-right">
            <router-link to="/register">注册</router-link>
          </div>
      </div>-->
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginCode",
  data() {
    return {
      ip: this.$init.ip,
      imgUrl: "",
      // 验证码
      code: {
        imageCodeId: "", // 图片验证码ID
        imageCode: "" // 图片验证码值
      },
      form: {
        phone: "",
        code: ""
      },
      codeNum: 60 // 验证码倒计时
    };
  },
  created() {
    // 2019-01-25 仅微信登陆开始
    let urlStr = window.location.href;
    let urlStrBase = urlStr.substring(0, urlStr.indexOf(this.$route.path));
    let backUrl = encodeURIComponent(urlStrBase + "/movie/home");
    window.location.href =
      this.$init.ip +
      "/panda-common-gateway/v1/wechatLogin?redirectUrl=" +
      backUrl +
      "&channelId=" +
      this.$init.channelId;
    return;
    // 2019-01-25 仅微信登陆结束

    this.getImgCode();
    // 设置登陆入口
    this.$cookies.set("loginUrl", "");
    this.$init.loginUrl = "";

    // 清除刷新token
    this.$cookies.remove("wechatPower");
    this.$cookies.remove("refreshToken");
    this.$init.wechat.power = false;
    this.$init.refreshToken = "";
    this.$init.accessToken = "";
    this.$init.user = {
      cacheChannel: {},
      cacheUser: {}
    };

    // 清除刷新token轮询
    if (window.$refreshTokenInterval) {
      clearInterval(window.$refreshTokenInterval);
      window.$refreshTokenInterval = false;
    }
  },
  methods: {
    //focus
    iptFocus() {
      this.errorMessage = "";
      this.inFocus = true;
    },
    //blur
    iptBlur() {
      let this_ = this;
      this_.inFocus = false;
      setTimeout(function() {
        if (this_.inFocus == false) {
          // 当input 失焦时,滚动一下页面就可以使页面恢复正常
          this_.checkWxScroll();
        }
      }, 200);
    },
    checkWxScroll() {
      var ua = navigator.userAgent.toLowerCase();
      var u = navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
      if (ua.match(/MicroMessenger/i) == "micromessenger" && !!u) {
        //在iphone 微信中
        this.temporaryRepair();
      }
    },
    temporaryRepair() {
      var currentPosition, timer;
      var speed = 1; //页面滚动距离
      timer = setInterval(function() {
        currentPosition =
          document.documentElement.scrollTop || document.body.scrollTop;
        currentPosition -= speed;
        window.scrollTo(0, 0); //页面向上滚动
        clearInterval(timer);
      }, 1);
    },

    // 获取图片验证码
    getImgCode() {
      var vm = this;
      this.code.imageCode = "";
      this.code.imageCodeId =
        new Date().valueOf() + "" + Math.ceil(Math.random() * 10000);
      this.$http
        .get("/v1/getImageCode/" + this.code.imageCodeId)
        .then(function(response) {
          vm.imgUrl = "data:image/png;base64," + response.data.result;
        })
        .catch(function(error) {
          vm.$toast("请求超时，请稍后再试！");
        });
    },
    // 提交数据
    upData() {
      let vm = this;
      if (this.form.phone + "" == "") {
        this.$toast("请输入手机号码");
        return false;
      } else if (!this.isPhone(this.form.phone + "")) {
        this.$toast("手机号码格式错误");
        return false;
      } else if (this.form.code == "") {
        this.$toast("请输入验证码");
        return false;
      }
      let postData = {
        loginMethod: 1,
        username: this.form.phone,
        password: "",
        authCode: this.form.code
      };
      this.$http
        .post("/v1/login", postData)
        .then(function(response) {
          // console.error(response.data);
          if ("1000" == response.data.code) {
            // 权限赋值
            vm.$init.user = response.data.result;
            vm.$init.accessToken = response.data.result.accessToken;
            vm.$init.refreshToken = response.data.result.refreshToken;
            // this.$cookies.set('refreshToken', response.data.result.refreshToken);
            window.localStorage.setItem(
              "refreshToken",
              response.data.result.refreshToken
            );

            // 刷新token定时器
            window.$refreshTokenInterval = setInterval(() => {
              vm.$http
                .get("/v1/refreshToken/" + vm.$init.refreshToken)
                .then(response => {
                  if (response.data.code === "1000") {
                    vm.$init.user = response.data.result;
                    vm.$init.accessToken = response.data.result.accessToken;
                  }
                });
            }, 100 * 60 * 1000);

            // 跳转到首页
            vm.$router.back(-1);
            // vm.$router.push('/index');
          } else {
            vm.form.code = "";
            vm.$toast(response.data.msg);
          }
          vm.getImgCode();
        })
        .catch(function(error) {
          // console.error(error);
          vm.$toast("请求超时，请稍后再试！");
        });
    },
    // 获取验证码
    getCode() {
      if (this.isPhone(this.form.phone + "")) {
        if (this.form.phone + "" == "") {
          this.$toast("请输入手机号");
          return false;
        } else if (!this.isPhone(this.form.phone + "")) {
          this.$toast("手机号格式错误");
          return false;
        } else if (this.code.imageCode == "") {
          this.$toast("请输入图片验证码");
          return false;
        }
        let postData = {
          imageCodeId: this.code.imageCodeId,
          imageCode: this.code.imageCode,
          phone: this.form.phone
        };
        // 这里写请求
        let vm = this;
        this.$http
          .post("/v1/getPhoneCode", postData)
          .then(function(response) {
            if ("1000" == response.data.code) {
              vm.countDown();
            } else {
              vm.$toast(response.data.msg);
            }
            vm.getImgCode();
          })
          .catch(function(error) {
            vm.$toast("请求超时，请稍后再试！");
          });
      } else if (this.form.phone + "" == "") {
        this.$toast("请输入手机号码");
      } else {
        this.$toast("手机号码格式错误");
      }
    },
    // 倒计时
    countDown() {
      let vm = this;
      vm.codeNum = 59;
      function numDown() {
        if (vm.codeNum > 1) {
          vm.codeNum = vm.codeNum - 1;
        } else {
          vm.codeNum = 60;
          window.clearInterval(int);
          return false;
        }
      }
      var int = setInterval(numDown, 1000);
    },
    // 验证手机号
    isPhone(str) {
      var myreg = /^[1][2,3,4,5,7,8,9][0-9]{9}$/;
      if (!myreg.test(str)) {
        return false;
      } else {
        return true;
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.path == "/user/loginCode") {
      next("/movie/home");
    } else {
      next();
    }
  }
};
</script>

<style scoped>
.login {
  padding-top: 130px;
  position: relative;
}
.logo {
  display: block;
  width: 360px;
  margin: 0 auto;
}
.logo img {
  display: block;
  width: 100%;
}
.cont {
  padding: 75px;
}
.form-grop {
  display: flex;
  border-bottom: 1px solid #ff5162;
  font-size: 28px;
  line-height: 66px;
  margin-bottom: 42px;
}
.form-input {
  flex: 10;
  border: none;
  outline: none;
  font-size: 28px;
  line-height: 66px;
  height: 66px;
  box-sizing: border-box;
}
.van-icon {
  display: inline-block;
  padding: 0 5px;
}
.form-btn {
  color: #fff;
  line-height: 80px;
  font-size: 28px;
  text-align: center;
  border-radius: 40px;
  background-color: #ff5162;
}
.form-cont {
  padding-bottom: 30px;
}
.form-link {
  line-height: 80px;
  padding-top: 30px;
  color: #818181;
}
.form-link a {
  color: #818181;
  font-size: 28px;
}
.form-link-left {
  float: left;
}
.form-link-right {
  float: right;
}
.out {
  position: absolute;
  font-size: 32px;
  color: #818181;
  top: 30px;
  left: 30px;
}
.flex-cont {
  display: flex;
}
.flex-left {
  flex: 10;
}
.flex-right {
  padding-left: 40px;
}
.form-codeimg {
  height: 66px;
  width: 200px;
  border: 1px solid #ff5162;
  box-sizing: border-box;
}
.form-codeimg img {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
