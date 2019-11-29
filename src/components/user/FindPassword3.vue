<template>
  <div class="container">
    <header>
        <router-link to="/findPassword2">
            <van-icon class="out" name="arrow-left" />
        </router-link>
        <span>找回密码</span>
    </header>
    <div class="cont">
        <div class="form-cont">
            <div class="form-grop">
                <label class="form-lable">
                    新密码:
                </label>
                <input class="form-input" type="text" v-model.trim="password" placeholder="请填写新的密码">
                <div class="form-more">
                    <van-icon name="close" v-show="password" @click="password = ''"/>
                </div>
            </div>
        </div>
        <div class="form-btn" @click="updatePassword">下一步</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data () {
    return {
        findPasswordPhone: window.sessionStorage.getItem('findPasswordPhone'),
        findPasswordAccessToken: window.sessionStorage.getItem('findPasswordAccessToken'),
        password: ''
    }
  },
  methods: {
    // 更新密码
    updatePassword () {
        let vm = this;
        if(this.password == ''){
            this.$toast('请输入新的密码');
            return false;
        }else if(! this.checkPassword(this.password)){
            return false;
        }
        let postData = {
            "updatePasswordType":"retrieve_password",
            "appId": this.$init.channelId,
            "appSecret": this.$init.appSecret,
            "accessToken": this.findPasswordAccessToken,
            "phone": this.findPasswordPhone,
            "password": this.$md5(this.password).toUpperCase()
        }
        this.$http.post('/panda-common-oauth/oauth2/updatePassword', postData).then(function (response) {
            if(response.data.code == '1000'){
                vm.$router.push('/loginPassword');
            }else{
                vm.$toast(response.data.msg)
            }
        })
        .catch(function (error) {
            vm.$toast('请求超时，请稍后再试！')
            // console.log(error)
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
    },
    // 密码验证
    checkPassword (str) {
        var reg2 = /([a-zA-Z0-9!@#$%^&*()_?<>{}]){8,18}/;
        var reg3 = /[a-zA-Z]+/;
        var reg4 = /[0-9]+/;
        if(reg2.test(str) && reg3.test(str) && reg4.test(str)){
            return true;
        }else if(!reg2.test(str)){
            this.$toast("长度在8-18位");
            return false;
        }else if(!reg3.test(str)){
            this.$toast("需含有字母");
            return false;
        }else if(!reg4.test(str)){
            this.$toast("需含有数字");
            return false;
        }
    },
  }
}
</script>

<style scoped>
header{
    font-size: 28px;
    color: #4d4d4d;
    line-height: 84px;
    text-align: center;
    border-bottom: 1px solid #dfdfdf;
    position: relative;
}
.out{
    position: absolute;
    left: 0px;
    line-height: 84px;
    top: 0;
    width: 80px;
    font-size: 28px;
}
.cont{
    padding: 75px;
}
.form-grop{
    display: flex;
    border-bottom: 1px solid #e990bc;
    font-size: 28px;
    line-height: 66px;
    margin-bottom: 42px;
}
.form-input{
    flex: 10;
    border: none;
    outline: none;
    font-size: 28px;
    line-height: 66px;
    text-align: right;
}
.van-icon{
    display: inline-block;
    padding: 0 5px;
}
.form-btn{
    color: #fff;
    line-height: 80px;
    font-size: 28px;
    text-align: center;
    border-radius: 40px;
    background-color: #ff5162;
}
.form-cont{
    padding-bottom: 30px;
}
</style>
