<template>
  <div class="container address-list">
    <Vheader name="地址"></Vheader>

    <van-cell-group>
      <van-field label="收货人" v-model="form.consignee" placeholder="名字" />
      <van-field label="联系电话" v-model="form.phone" placeholder="手机号" />
      <van-field label="收件地址" @click="modelShow = true" v-model="form.areaName" placeholder="选择地址" readonly/>
      <van-field label="详细地址" v-model="form.address" placeholder="如街道、楼层、门牌号等" />
      <van-switch-cell title="设为默认地址" v-model="form.isDefault" />
    </van-cell-group>

    <div class="btn-out">
      <div class="btn btn-save" @click="onSave">保存</div>
      <div class="btn btn-del" v-show="actionType == 'edit'" @click="onDelete">删除</div>
    </div>

    <!-- 地址选择开始 -->
    <van-popup v-model="modelShow" position="bottom" >
      <van-tabs v-model="active">
        <van-tab :title="columns.column1.val.id ? columns.column1.val.name : '请选择'">
          <div class="adress-list">
            <div class="adress-item" v-for="(item, index) in columns.column1.list" :key="index" @click="adCheck(1, item)">{{item.name}}</div>
          </div>
        </van-tab>
        <van-tab :title="columns.column2.val.id ? columns.column2.val.name : '请选择'" v-if="columns.column1.val && columns.column1.val.id">
          <div class="adress-list">
            <div class="adress-item" v-for="(item, index) in columns.column2.list" :key="index" @click="adCheck(2, item)">{{item.name}}</div>
          </div>
        </van-tab>
        <van-tab :title="columns.column3.val.id ? columns.column3.val.name : '请选择'" v-if="columns.column2.val.id">
          <div class="adress-list">
            <div class="adress-item" v-for="(item, index) in columns.column3.list" :key="index" @click="adCheck(3, item)">{{item.name}}</div>
          </div>
        </van-tab>
        <van-tab :title="columns.column4.val.id ? columns.column4.val.name : '请选择'" v-if="columns.column3.val.id && columns.column4.list.length > 0">
          <div class="adress-list">
            <div class="adress-item" v-for="(item, index) in columns.column4.list" :key="index" @click="adCheck(4, item)">{{item.name}}</div>
          </div>
        </van-tab>
      </van-tabs>
    </van-popup>
    <!-- 地址选择结束 -->

  </div>
</template>

<script>
import Vheader from '../HeaderV'
export default {
  name: 'AddressAdd',
  components: {
    Vheader
  },
  data () {
    return {
      actionType: this.$route.query.actionType, // 操作类型

      columnsReady: false,
      columnsLoading: false,
      columns: {
        column1: {
          list: [],
          val: {}
        },
        column2: {
          list: [],
          val: {}
        },
        column3: {
          list: [],
          val: {}
        },
        column4: {
          list: [],
          val: {}
        }
      },
      cityCheck: [], // 选中的列表
      active: 0,
      modelShow: false,

      // 地址信息
      form: {
        isDefault: false, // 默认
        consignee: '', // 收货人
        phone: '', // 收货人号码
        areaName: '', // 选择城市地址
        address: '', // 详细地址
        id: '' // 地址ID
      },
    }
  },
  created () {
    // TODO 编辑地址处理
    if(this.actionType == 'edit'){
      if(this.$init.editAddress){
        this.form = this.$init.editAddress;
        this.form.isDefault = this.form.isDefault == 1 ? true : false
      }else{
        let editAddress = window.sessionStorage.getItem('editAddress')
        if(editAddress){
          this.form = JSON.parse(editAddress);
          this.form.isDefault = this.form.isDefault == 1 ? true : false
        }
      }
    }

    // 获取地址
    this.getArea(0, 0);
  },
  methods: {
    // 验证手机号
    isPhone (str) {
      str += '';
      var myreg=/^[1][2,3,4,5,7,8,9][0-9]{9}$/;  
      if (!myreg.test(str)) {  
        return false;  
      } else {  
        return true;  
      }
    },
    // 保存
    onSave() {
      let vm = this;
      // 请求参数
      var postData = {
        "isDefault": vm.form.isDefault ? 1 : 0,
        "consignee": vm.form.consignee,
        "phone": vm.form.phone,
        "areaName": vm.form.areaName,
        "address": vm.form.address
      }
      if(! this.isPhone(postData.phone)){
        vm.$toast('手机号格式错误')
        return
      }
      var httpUrl = ''; // 请求地址
      if(this.actionType == 'edit'){
        httpUrl = '/panda-shop-api/v1/updateReceiver';
        postData.id = vm.form.id;
      }else{
        httpUrl = '/panda-shop-api/v1/saveReceiver'
      }
      this.$http.post(httpUrl, postData).then(function (response) {
        if(response.data.code == '1000'){
          vm.$router.back(-1);
        }else{
          vm.$toast(response.data.msg)
        }
      })
      .catch(function (error) {
        vm.$toast('请求超时，请稍后再试！')
      });
    },
    // 删除
    onDelete(val) {
      let vm = this;
      this.$http.get('/panda-shop-api/v1/delReceiver/'+ this.form.id).then(function (response) {
        if(response.data.code == '1000'){
          vm.$router.back(-1);
        }else{
          vm.$toast(response.data.msg)
        }
      })
      .catch(function (error) {
        vm.$toast('请求超时，请稍后再试！')
      });
    },
    // 详细地址模糊搜索
    onChangeDetail(val) {
      this.searchResult = [];
    },
    // 返回上一页
    goBack () {
      this.$router.back(-1);
    },
    // 获取地址
    getArea (id, sort, obj) {
      let vm = this;
      vm.columnsLoading = true;
      this.$http.get('/panda-shop-api/v1/getArea/'+ id).then(function (response) {
        if(response.data.code == '1000'){
          if(response.data.result && response.data.result.length > 0){
            vm.columns['column'+(sort+1)].list = response.data.result;
            vm.$nextTick(function(){
              vm.active = sort;
            })
          }else{
            vm.addressOk(obj);
          }
          // 隐藏加载中
          vm.columnsLoading = false;
        }else{
          vm.$toast(response.data.msg)
        }
      })
      .catch(function (error) {
        vm.$toast('请求超时，请稍后再试！')
      });
    },
    // 地址点击
    adCheck (key, obj) {
      this.columns['column'+key].val = obj;
      if(obj.sort == 1){
        this.columns.column2 = {
          list: [],
          val: {}
        }
        this.columns.column3 = {
          list: [],
          val: {}
        }
        this.columns.column4 = {
          list: [],
          val: {}
        }
      }else if(obj.sort == 2){
        this.columns.column3 = {
          list: [],
          val: {}
        }
        this.columns.column4 = {
          list: [],
          val: {}
        }
      }else if(obj.sort == 3){
        this.columns.column4 = {
          list: [],
          val: {}
        }
      }
      this.getArea(obj.id, key, obj)
    },
    // 确定地址
    addressOk (obj) {
      this.modelShow = false;
      this.form.areaName = obj.fullName;
    },
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
.btn-out{
  padding: 20px;
}
.btn{
  line-height: 80px;
  text-align: center;
  border: 1px solid #dfdfdf;
  border-radius: 6px;
  font-size: 32px;
  margin-top: 20px;
}
.btn-save{
  color: #ffffff;
  background-color: #ff5162;
  border-color: #ff5162;
}

/* 地址 */
.adress-list{
  height: 660px;
  overflow: auto;
}
.adress-item{
  display: block;
  height: 76px;
  color: #000;
  line-height: 76px;
  padding: 0 20px;
  border-top: 1px solid #eeeeee;
  overflow: hidden
}
</style>

<style>
.van-button--primary{
  background-color: #ff5162;
  border: 1px solid #ff5162;
}
.van-switch--on{
  background-color: #ff5162;
}
.van-cell__value input,
.van-cell__value textarea{
  font-size: 14px;
}
</style>
