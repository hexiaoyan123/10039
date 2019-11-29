<template>
  <div class="login">
    <!-- <router-link to="/index">
      <van-icon class="out" name="arrow-left" />
    </router-link>-->
    <figure class="img-out">
      <img class="logo" src="../../assets/logo.png" />
    </figure>
    <div class="cont">
      <div class="form-cont">
        <div class="form-grop">
          <label class="form-lable">
            <van-icon name="card" />
          </label>
          <input
            @blur="iptBlur"
            @focus="iptFocus"
            class="form-input"
            type="number"
            v-model.trim="form.phone"
            placeholder="请输入卡号"
          />
          <div class="form-more">
            <van-icon name="close" v-show="form.phone" @click="form.phone = ''" />
          </div>
        </div>
        <div class="form-grop">
          <label class="form-lable">
            <van-icon @click="passwordShow = false" v-show="passwordShow" name="password-view" />
            <van-icon
              @click="passwordShow = true"
              v-show="! passwordShow"
              name="password-not-view"
            />
          </label>
          <input
            @blur="iptBlur"
            @focus="iptFocus"
            v-show="! passwordShow"
            class="form-input"
            type="password"
            v-model.trim="form.password"
            placeholder="请输入密码"
          />
          <input
            @blur="iptBlur"
            @focus="iptFocus"
            v-show="passwordShow"
            class="form-input"
            type="text"
            v-model.trim="form.password"
            placeholder="请输入密码"
          />
          <div class="form-more">
            <van-icon name="close" v-show="form.password" @click="form.password = ''" />
            <!-- <router-link to="/findPassword1">
                      <span>忘记密码</span>
            </router-link>-->
          </div>
        </div>
      </div>
      <div class="form-btn" @click="loginClick">登录</div>
      <!-- <div class="form-link">
          <div class="form-link-left">
            <router-link to="/loginPassword">密码登录</router-link>
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
  name: "LoginCard",
  data() {
    return {
      passwordShow: false,
      form: {
        phone: "",
        password: ""
      }
    };
  },
  created() {
    // 设置登陆入口
    this.$cookies.set("loginUrl", "");
    this.$init.loginUrl = "";

    // 清除刷新token
    this.$cookies.remove("refreshToken");
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

    // 登录
    loginClick() {
      let vm = this;
      if (this.form.phone == "") {
        this.$toast("请输入卡号");
        return false;
      } else if (this.form.password == "") {
        this.$toast("请输入密码");
        return false;
      }
      let postData = {
        loginMethod: "3",
        username: this.form.phone,
        password: this.form.password,
        authCode: ""
      };
      this.$http
        .post("/v1/login", postData)
        .then(function(response) {
          if (response.data.code == "1000") {
            // 权限赋值
            vm.$init.user = response.data.result;
            vm.$init.accessToken = response.data.result.accessToken;
            vm.$init.refreshToken = response.data.result.refreshToken;
            this.$cookies.set(
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
            vm.$router.push("/movie/home");
          } else {
            vm.$toast(response.data.msg);
          }
        })
        .catch(function(error) {
          vm.$toast("请求超时，请稍后再试！");
        });
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
  }
};
</script>

<style scoped>
.login {
  padding-top: 130px;
  position: relative;
}
.img-out {
  display: block;
  width: 360px;
  height: 176px;
  margin: 0 auto;
}
.logo {
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
  position: relative;
}
.form-input {
  flex: 10;
  border: none;
  outline: none;
  font-size: 28px;
  line-height: 66px;
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
.form-more-colse {
  position: absolute;
  line-height: 66px;
  top: 0;
  right: 20px;
}
</style>
