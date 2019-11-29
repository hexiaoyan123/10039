<template>
  <div class="container">
    <Vheader name="用户信息"></Vheader>

    <input type="file" id="file" style="display: none;" @change="upGo">

    <van-cell-group>
      <van-cell title="头像">
        <div class="user-img-cont" @click="clickFile">
          <figure class="user-img">
            <img v-show="imageUrl" :src="imageUrl" alt="">
            <img v-show="! imageUrl" src="../../assets/user.jpg" alt="">
          </figure>
          <van-icon class="user-img-sel" name="arrow" />
        </div>
      </van-cell>
      <van-field label="手机号" v-model="phone" placeholder="请输入手机号" />
      <van-field label="昵称" v-model="nickname" placeholder="请输入用户名" />
    </van-cell-group>

    <div class="user-btn-cont">
      <div class="user-btn" @click="updateUser">修改</div>
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
      phone: this.$init.user.cacheUser.phone,
      nickname: this.$init.user.cacheUser.nickname,
      // imageUrl: this.$init.user.cacheUser.imageUrl,
      imageUrl: this.$init.user.cacheUser.imageUrl && this.$init.user.cacheUser.imageUrl.indexOf('http://') >= 0 ? this.$init.user.cacheUser.imageUrl : this.$init.imgIp + this.$init.user.cacheUser.imageUrl
    }
  },
  created () {
    this.phone = this.$init.user.cacheUser.phone;
    this.nickname = this.$init.user.cacheUser.nickname;
    // this.imageUrl = this.$init.user.cacheUser.imageUrl;
  },
  methods: {
    // 打开上传文件
    clickFile () {
      document.getElementById("file").click()
    },
    // 上传图片
    upGo () {
      let vm = this;
      var file = document.getElementById("file").files[0];
      if(!/image\/\w+/.test(file.type)){  
        hint('请求超时，请稍后再试！');
        return false;  
      } 
      var param = new FormData(); 
      param.append('file', file, file.name);
      this.$http.post('/panda-admin-api/resource/uploadImage', param).then(function (response) {
        if(response.data.code == '1000'){
          vm.imageUrl = response.data.result.fileUrl + response.data.result.fileSuffix;
        }else{
          vm.$toast(response.data.msg)
        }
      })
      .catch(function (error) {
        vm.$toast('请求超时，请稍后再试！')
      });
    },
    // 跳转路径
    goPath (path) {
      this.$router.push(path)
    },
    // 返回上一页
    goBack () {
      this.$router.back(-1);
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
    // 更新用户信息
    updateUser () {
      // console.log(this.$init.user)
      let vm = this;
      let postData = {
        id: this.$init.user.cacheUser.id,
        phone: this.phone,
        nickname:  this.nickname,
        imageUrl:  this.imageUrl,
      }
      if(! postData.phone){
        this.$toast('请输入手机号')
        return;
      }else if(! postData.nickname){
        this.$toast('请输入昵称')
        return;
      }else if(! postData.imageUrl){
        this.$toast('请上传用户头像')
        return;
      }else if(! this.isPhone(postData.phone)){
        this.$toast('手机号格式错误')
        return;
      }
      this.$http.post('/v1/updateUser', postData).then(function (response) {
        if(response.data.code == '1000'){
          vm.refreshToken();
        }else{
          vm.$toast(response.data.msg)
        }
      })
      .catch(function (error) {
        vm.$toast('请求超时，请稍后再试！')
      });
    },
    // 刷新token
    refreshToken () {
      let vm = this;
      this.$http.get('/v1/refreshToken/' + this.$init.refreshToken).then(function (response) {
        if(response.data.code == '1000'){
          var user = response.data.result;
          vm.$init.user = user;
          vm.$init.accessToken = response.data.result.accessToken;
          vm.$init.refreshToken = response.data.result.refreshToken;
          vm.$cookies.set('refreshToken', response.data.result.refreshToken, '30d');
          vm.goBack()
        }else{
          vm.$toast(response.data.msg)
        }
      })
      .catch(function (error) {
        vm.$toast('请求超时，请稍后再试！')
      })
    },
  }
}
</script>

<style scoped>
.container{
  background-color: #f8f8f8;
  padding-top: 84px;
}
.top img{
  display: block;
  width: 100%;
}

header{
  height: 85px;
  line-height: 85px;
  /* position: absolute; */
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  background-color: #ff5162;
  color: #fff;
  text-align: center;
  display: flex;
  font-size: 28px;
  z-index: 101;
}
.header-back{
  width: 70px;
  text-align: center;
}
.header-cont{
  flex: 10;
}
.header-more{
  width: 75px;
  text-align: center;
}
header .iconfont{
  font-size: 28px;
}
.user-img{
  display: inline-block;
  height: 100px;
  width: 100px;
  border-radius: 50%;
  background-color: #f8f8f8;
  overflow: hidden;
}
.user-img img{
  display: inline-block;
  height: 100%;
  width: 100%;
}
.user-img-cont{
  position: relative;
  padding-right: 40px;
}
.user-img-sel{
  position: absolute;
  top: 40px;
  right: 0;
}
.user-btn-cont{
  padding: 40px 20px 20px 20px;
  display: flex;
}
.user-btn{
  line-height: 80px;
  text-align: center;
  font-size: 32px;
  color: #fff;
  background-color: #ff5162;
  border-radius: 6px;
  flex: 5;
}
.user-btn2{
  /* margin-top: 20px; */
  flex: 3;
  line-height: 80px;
  text-align: center;
  font-size: 32px;
  color: #ff5162;
  background-color: #fff;
  border-radius: 6px;
}
</style>
<style>
.van-field__control{
  height: 24px;
  font-size: 12px;
  line-height: 24px;
  text-align: right;
}
</style>

