<template>
<div class="container agency">
  <Vheader name="找导游"></Vheader>
  <div class="user">
    <figure class="img">
      <img v-show="! info.imageUrl" src="../../assets/user.jpg" alt="">
      <img v-show="info.imageUrl" :src="imgIp + info.imageUrl" alt="">
    </figure>
    <div class="user-name">
      {{info.name}}
    </div>
    <div class="user-star">
      <van-rate
        :value="info.starLevel"
        :size="12"
        :count="5"
        color="#2ba"
        void-color="#2db880"
      />
    </div>
  </div>
  <ul class="agency-list">
    <li class="agency-item2">
      <label>导游证号</label>
      <div class="agency-title">
        {{info.licenseKey}}
      </div>
    </li>
    <li class="agency-item2">
      <label>所属旅行社</label>
      <div class="agency-title">
        {{info.travelAgencyName}}
      </div>
    </li>
    <li class="agency-item2">
      <label>职业等级</label>
      <div class="agency-title">
        {{info.grade | gradeToStr}}
      </div>
    </li>
    <li class="agency-item2">
      <label>导游语种</label>
      <div class="agency-title">
        {{info.language}}
      </div>
    </li>
    <!-- <li class="agency-item2">
      <label>个人荣誉</label>
      <div class="agency-title">
        <i class="iconfont">&#xe608;</i>
      </div>
    </li> -->
  </ul>
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
      value: 3,

      imgIp: this.$init.imgIp,
      id: this.$route.params.id,
      info: {}
    }
  },
  created () {
    this.getInfo()
  },
  methods: {
    // 获取详情
    getInfo () {
      let vm = this;
      this.$http.get('/panda-travel-api/v1/getTourGuide/'+this.id, this.$init.channelId).then(function (response) {
        if(response.data.code == '1000'){
          if(response.data.result){
            vm.info = response.data.result;
          }
        }else{
          vm.$toast(response.data.msg);
        }
      })
      .catch(function (error) {
        vm.$toast('请求超时，请稍后再试！')
      });
    }
  },
  filters: {
    gradeToStr (val) {
      if(val == 4){
        return '特级'
      }else if(val == 3){
        return '高级'
      }else if(val == 3){
        return '中级'
      }else if(val == 3){
        return '初级'
      }else{
        return ''
      }
    }
  }
}
</script>

<style scoped>
.agency{
  /* background-color: #fff; */
  padding-top: 84px;
}
.user{
  padding: 90px 30px 50px 30px;
}
.user-name{
  text-align: center;
  font-size: 28px;
  line-height: 68px;
}
.user-star{
  text-align: center;
}
.img{
  height: 160px;
  width: 160px;
  border-radius: 80px;
  overflow: hidden;
  margin: 0 auto;
}
.img img{
  display: block;
  width: 100%;
}
.item-name{
  color: #4d4d4d;
  font-size: 28px;
  line-height: 46px;
}
.item-code{
  font-size: 24px;
  color: #a3a3a3;
  line-height: 46px;
}
.agency-item2{
  display: flex;
  padding: 26px 30px;
  border-top: 1px solid #ececec;
  font-size: 24px;
  line-height: 38px;
}
.agency-list .agency-item2:first-child{
  border: none;
}
.agency-item2>label{
  flex: 10;
}
.agency-title{
  padding-left: 10px;
  max-width: 80%;
  color: #a3a3a3;
}
</style>