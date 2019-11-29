<template>
  <div class="container address-list">
    <header>
      管理收货地址
      <div class="class-back" @click="goBack">
        <van-icon name="arrow-left" />
      </div>
    </header>
    <van-radio-group v-model="chosenAddressId">
    <div class="list">
      <div class="item ignore-item" v-for="(item, index) in list" :key="index">
        <h2>
          <span>{{item.name}}</span>
          <span>{{item.tel}}</span>
        </h2>
        <p>{{item.address}}</p>
        <div class="ignore-item-ctrl">
          <div class="item-ctrl-default">
            <van-radio :name="item.id" @click="setDefault(item)">[设为默认地址]</van-radio>
          </div>
          <div class="item-ctrl-right">
            <span class="ignore-ctrl-right-item" @click="onEdit(item, index)">
              <van-icon name="edit"/>
              <em class="van-icon">编辑</em>
            </span>
            <span class="ignore-ctrl-right-item" @click="onDel(item, index)">
              <van-icon name="delete" />
              <em>删除</em>
            </span>
          </div>
        </div>  
      </div>
    </div>
    </van-radio-group>
  </div>
</template>

<script>
export default {
  name: 'AddressList',
  components: {
    
  },
  data () {
    return {
      // 弹出层
      popup: false,
      // 选中地址
      chosenAddressId: '',
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
      this.$http.get('/panda-shop-api/wap/listReceiver').then(function (response) {
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
              addressList.push(obj);
              if(e.isDefault == 1){
                vm.chosenAddressId = e.id;
              }
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
    // 新增
    onAdd() {
      this.$router.push('/product/addressAdd')
    },
    // 设为默认
    setDefault (obj) {
      let vm = this;
      if(obj.id == vm.chosenAddressId){
        return false;
      }
      // 请求参数
      var postData = {
        "id": obj.id,
        "isDefault": 1,
        "consignee": obj.name,
        "phone": obj.tel,
        "areaName": obj.province,
        "address": obj.address_detail
      }
      this.$http.post('/panda-shop-api/wap/updateReceiver', postData).then(function (response) {
        if(response.data.code == '1000'){
          vm.$toast('设置成功')
        }else{
          vm.$toast(response.data.msg)
        }
      })
      .catch(function (error) {
        vm.$toast('请求超时，请稍后再试！')
      });
    },
    // 编辑
    onEdit(item, index) {
      this.$init.editAddress = item;
      window.sessionStorage.setItem('editAddress', JSON.stringify(item))
      this.$router.push({
        path: '/product/addressAdd',
        query: {
          actionType: 'edit'
        }
      });
    },
    // 删除
    onDel (item, index) {
      let vm = this;
      this.$http.get('/panda-shop-api/wap/delReceiver/'+ item.id).then(function (response) {
        if(response.data.code == '1000'){
          let list = vm.list;
          list.splice(index, 1);
          vm.list = list;
          vm.$toast('删除成功')
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
    }
  }
}
</script>

<style scoped>
.container{
  background-color: #f8f8f8;
}
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
  background-color: #fff;
}
.address-list{
  padding-top: 100px;
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

.ignore-item{
  padding: 10px 15px 0 15px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  line-height: 24px;
  position: relative;
  background-color: #fff;
  color: #333;
  font-size: 14px;
  overflow: hidden;
  margin-bottom: 10px;
}
.ignore-item h2{
  font-size: 14px;
  line-height: 1.5;
}
.ignore-item p{
  font-size: 12px;
  line-height: 1.5;
  color: #666;
}
.ignore-item-ctrl{
  display: flex;
  margin-top: 10px;
  border-top: 1px solid #e5e5e5;
  line-height: 40px;
}
.item-ctrl-default{
  flex: 3;
}

.item-ctrl-right{
  flex: 5;
  text-align: right;
}
.van-radio__input{
  line-height: 0;
}
.ignore-ctrl-right-item{
  display: inline-block;
  margin-left: 10px;
}

</style>

<style>
.van-radio__control{
  font-size: 0;
  line-height: 0;
}
.van-radio__input{
  font-size: 0;
  line-height: 0;
}
.van-radio .van-icon-checked{
  color: #ff5162;
}
</style>
