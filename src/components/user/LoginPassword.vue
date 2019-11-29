<template>
  <div class="login">
    <router-link to="/movie/home">
      <van-icon class="out" name="arrow-left" />
    </router-link>
    <figure class="img-out">
      <img class="logo" src="../../assets/logo.png" />
    </figure>
    <div class="cont">
      <div class="form-cont">
        <div class="form-grop">
          <label class="form-lable">
            <van-icon name="phone" />
          </label>
          <input class="form-input" type="number" v-model.trim="form.phone" placeholder="请输入手机号码" />
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
            v-show="! passwordShow"
            class="form-input"
            type="password"
            v-model.trim="form.password"
            placeholder="请输入密码"
          />
          <input
            v-show="passwordShow"
            class="form-input"
            type="text"
            v-model.trim="form.password"
            placeholder="请输入密码"
          />
          <div class="form-more">
            <van-icon
              class="form-more-colse"
              name="close"
              v-show="form.password"
              @click="form.password = ''"
            />
            <router-link to="/findPassword1">
              <span>忘记密码</span>
            </router-link>
          </div>
        </div>
      </div>
      <div class="form-btn" @click="loginClick">登录</div>
      <div class="form-link">
        <div class="form-link-left">
          <!-- <router-link to="/loginCode">短信验证码登录</router-link> -->
          <router-link to="/loginCard">卡号登录</router-link>
        </div>
        <div class="form-link-right">
          <router-link to="/register">注册</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginPassword",
  data() {
    return {
      passwordShow: false,
      form: {
        phone: "",
        password: ""
      }
    };
  },
  created() {},
  methods: {
    // 登录
    loginClick() {
      let vm = this;
      if (this.form.phone == "") {
        this.$toast("请输入手机号");
        return false;
      } else if (!this.isPhone(this.form.phone + "")) {
        this.$toast("手机号格式错误");
        return false;
      } else if (this.form.password == "") {
        this.$toast("请输入密码");
        return false;
      }
      let postData = {
        grantType: "phone_password",
        appId: this.$init.channelId,
        appSecret: this.$init.appSecret,
        phone: this.form.phone,
        password: this.$md5(this.form.password).toUpperCase()
      };
      this.$http
        .post("/panda-common-oauth/oauth2/token", postData)
        .then(function(response) {
          if (response.data.code == "1000") {
            const user = {
              phone: vm.form.phone,
              accessToken: response.data.result.accessToken,
              refreshToken: response.data.result.refreshToken,
              token: response.data.result.accessToken
            };
            vm.$init.user = user;
            vm.$cookies.set("user", JSON.stringify(user), "30d");
            vm.$cookies.set(
              "sccessToken",
              response.data.result.accessToken,
              "100MIN"
            );

            vm.getUserInfo();
          } else {
            vm.$toast(response.data.msg);
          }
        })
        .catch(function(error) {
          vm.$toast("请求超时，请稍后再试！");
        });
    },
    // 获取用户信息
    getUserInfo() {
      let vm = this;
      this.$axios({
        method: "get",
        url: this.$init.ip + "/panda-common-oauth/oauth2/getUser",
        headers: {
          "Access-Token": this.$init.user.token
        }
      })
        .then(function(response) {
          if (response.data.code == "1000") {
            for (let key in response.data.result) {
              vm.$init.user[key] = response.data.result[key];
            }
            vm.$cookies.set("user", JSON.stringify(vm.$init.user), "30d");
            vm.$router.push("/");
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
  width: 230px;
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
  border-bottom: 1px solid #e990bc;
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
  right: 120px;
}
</style>
