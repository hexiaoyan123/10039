<template>
  <div class="container address-list">
    <Vheader name="选择收货地址"></Vheader>
    <!-- <header>
      选择收货地址
      <div class="class-back" @click="goBack">
        <van-icon name="arrow-left" />
      </div>
    </header> -->
    <van-address-list
      v-model="chosenAddressId"
      :list="list"
      @add="onAdd"
      @edit="onEdit"
      @select="onClick"
    />
  </div>
</template>

<script>
import Vheader from '../HeaderV'
export default {
  name: 'AddressList',
  components: {
    Vheader
  },
  data () {
    return {
      // 弹出层
      popup: false,
      // 选中地址
      chosenAddressId: '1',
      // 地址列表
      list: []
    }
  },
  created () {
    this.getList()
  },
  methods: {
    // 获取地址列表
    getList () {
      let vm = this;
      this.$http.get('/panda-shop-api/v1/listReceiver').then(function (response) {
        if(response.data.code == '1000'){
          if(response.data.result && response.data.result.length > 0){
            let addressList = []
            response.data.result.forEach((e, i) => {
              let obj = {
                id: e.id,
                name: e.consignee,
                tel: e.phone,
                address: e.areaName + e.address,
                province: e.areaName,
                more: e
              }
              addressList.push(obj)
            })
            vm.list = addressList; 
          }
        }else{
          vm.$toast(response.data.msg)
        }
      })
      .catch(function (error) {
        vm.$toast('请求超时，请稍后再试！')
      });
    },
    // 添加
    onAdd() {
      this.$router.push({
        path: '/product/addressAdd',
        query: {
          actionType: 'add'
        }
      });
    },
    // 编辑
    onEdit(item, index) {
      this.$init.editAddress = item.more;
      window.sessionStorage.setItem('editAddress', JSON.stringify(item.more))
      this.$router.push({
        path: '/product/addressAdd',
        query: {
          actionType: 'edit'
        }
      });
    },
    // 选中触发
    onClick(item, index){
      this.$init.checkAddress = item;
      window.sessionStorage.setItem('checkAddress', JSON.stringify(item))
      this.$router.back(-1);
    },
    // 返回上一页
    goBack () {
      this.$router.back(-1);
    }
  }
}
</script>

<style scoped>
header{
  /* position: absolute; */
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  font-size: 28px;
  color: #4d4d4d;
  line-height: 84px;
  text-align: center;
  border-bottom: 1px solid #dfdfdf;
}
.address-list{
  padding-top: 84px;
}
.class-back{
  position: absolute;
  width: 80px;
  height: 80px;
  line-height: 92px;
  top: 0;
  left: 0;
  text-align: center;
  font-size: 28px;
}
</style>

<style>
.van-address-list .van-icon-checked{
  color: #ff5162;
}
.van-address-list__add .van-icon-add{
  color: #ff5162;
}
</style>
