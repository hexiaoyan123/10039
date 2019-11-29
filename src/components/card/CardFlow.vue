<template>
  <div class="container">
    <Vheader name="流水查询"></Vheader>

    <ul class="list">
      <li class="item" v-for="(item, index) in list" :key="index">
        <div class="item-left">
          {{item.timeStamp}}
        </div>
        <div class="item-center">
          {{item.flowName}}
        </div>
        <div class="item-right">
          <span class="on">{{item.serviceTypeName}}</span>
        </div>
      </li>
      <!-- <li class="item">
        <div class="item-left">
          2018-01-01
        </div>
        <div class="item-center">
          充值
        </div>
        <div class="item-right">
          <span class="blue">已付款</span>
        </div>
      </li> -->
    </ul>  
    <div class="noData" v-if="list.length == 0">暂无数据！</div>
  </div>
</template>

<script>
import Vheader from '../HeaderV'
export default {
  name: 'CardFlow',
  components: {
    Vheader
  },
  data () {
    return {
      list: [],
    }
  },
  created () {
    this.getList();
  },
  methods: {
    // 获取我的卡券
    getList () {
      let vm = this;
      this.$http.get('/panda-payment-api/wap/listVoucherJournal/'+this.$route.params.id).then(function (response) {
        if(response.data.code == '1000'){
          if( response.data.result){
            vm.list = response.data.result;
          }
        }else{
          vm.$toast(response.data.msg)
        }
      })
      .catch(function (error) {
        vm.$toast('请求超时，请稍后再试！')
      });
    },
    // 返回上一页
    goBack () {
      this.$router.back(-1);
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
  background-color: #fff;
  color: #4d4d4d;
  z-index: 20;
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

.list{
  margin-bottom: 20px;
  border-bottom: 1px solid #dddddd;
}
.item{
  border-top: 1px solid #dddddd;
  padding: 20px;
  line-height: 44px;
  font-size: 24px;
  color: #818181;
  display: flex;
  background-color: #fff;
}
.item-left{
  flex: 4;
}
.item-center{
  flex: 2;
  text-align: center;
}
.item-right{
  flex: 4;
  text-align: right;
}

.item .red{
  color: #ff4403;
  border-color: #ff4403;
}
.item .blue{
  color: #00b202;
  border-color: #00b202;
}
</style>
