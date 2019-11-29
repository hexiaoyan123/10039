<template>
<div class="container agency">
  <Vheader name="找旅行社"></Vheader>
  <ul class="agency-list">
    <li class="agency-item">
      <div class="item-name">{{info.name}}</div>
      <div class="item-star">
        <van-rate
          :value="info.starLevel"
          :size="12"
          :count="5"
          color="#2ba"
          void-color="#2db880"
        />
      </div>
    </li>
    <li class="agency-item2">
      <label>企业名称</label>
      <div class="agency-title">
        {{info.name}}
      </div>
    </li>
    <li class="agency-item2">
      <label>许可证号</label>
      <div class="agency-title">
        {{info.licenseKey}}
      </div>
    </li>
    <li class="agency-item2">
      <label>经营场所</label>
      <div class="agency-title">
        {{info.address}}
      </div>
    </li>
    <li class="agency-item2">
      <label>法人代表</label>
      <div class="agency-title">
        {{info.legalPerson}}
      </div>
    </li>
    <li class="agency-item2">
      <label>联系电话</label>
      <div class="agency-title">
        {{info.phone}}
      </div>
    </li>
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
      this.$http.get('/panda-travel-api/v1/getTravelAgency/'+this.id, this.$init.channelId).then(function (response) {
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
  }
}
</script>

<style scoped>
.agency{
  /* background-color: #fff; */
  padding-top: 84px;
}
.agency-item{
  padding: 40px 30px;
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
  padding: 50px 30px;
  border-top: 1px solid #ececec;
  font-size: 28px;
  line-height: 38px;
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