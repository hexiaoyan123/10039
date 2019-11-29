<template>
  <div class="container catr-cont">
    
    <!-- 商品列表开始 -->
    <div style="min-height:101%;">
      <div class="goods-list"  v-for="(obj, key) in shop" :key="key">
          <div class="business-name">
            <!-- <div class="business-name-choice">
              <van-icon name="check" v-show="! obj.check" @click="pushCheck(key)"/>
              <van-icon name="checked" v-show="obj.check" @click="delCheck(key)"/>
            </div> -->
            <span>{{obj.name}}</span>
          </div>
          <ul class="goods-cont">
            <li class="goods-item" v-for="(item, index) in obj.list" :key="index">
              <div class="goods-item-choice">
                <van-icon name="check" v-show="! item.check" @click="pushCheck(item)"/>
                <van-icon name="checked" v-show="item.check" @click="delCheck(item)"/>
              </div>
              <div class="goods-item-img">
                <figure class="img">
                  <img v-if="item.imageUrl" style="width: 100%;" :src="item.imageUrl.split(',')[0] | imgSpecilize" alt="" @click.stop="goGoods(item.productId)">
                </figure>
              </div>
              <div class="goods-item-info">
                <h4>{{item.name}}</h4>
                <div class="goods-item-info-spec">
                  {{item.specification}}
                </div>
                <div class="goods-item-info-cont">
                  <div class="on goods-item-info-cont-left">
                    <small>¥</small> {{item.salesPrice | moneyFormat}}
                  </div>
                  <div class="goods-item-info-cont-btn">
                    <div class="btn goods-item-info-cont-btn-reduce" @click="reduceNum(item)">
                      <i class="iconfont">&#xe638;</i>
                    </div>
                    <div class="goods-item-info-cont-btn-info">{{item.quantity}}</div>
                    <div class="btn goods-item-info-cont-btn-add" @click="addNum(item)">
                      <i class="iconfont">&#xe602;</i>
                    </div>
                    <div class="goods-item-info-cont-btn-info" @click="delGoods(item)">删除</div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
      </div>
    </div>
    <!-- 商品列表结束 -->
    
    <!-- 购物车控制 -->
    <div class="fix-bar">
      <div class="fix-bar-left">
        <div class="fix-bar-choice" @click="checkAll" v-show="list.length > 0">
          <van-icon name="check" v-show="! checkGoods.all"/>
          <van-icon name="checked" v-show="checkGoods.all"/>
          <div class="fix-bar-choice-ctrl"></div>
          <div class="fix-bar-choice-title">全选</div>
        </div>
        <div class="fix-bar-info">
          <div class="fix-bar-info-maney">
            价格: <em class="on"> <small>¥ </small>{{checkGoods.many | moneyFormat}}</em>
          </div>
        </div>
      </div>
      <!-- <div class="fix-bar-right fix-bar-edit" @click="editCart">
        编辑
      </div> -->
      <div class="fix-bar-right" @click="generateOrder">
        结算 <small>({{checkGoods.num}}件)</small>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Cart',
  components: {
    
  },
  data () {
    return {
      // 弹出层
      popup: false,
      radio: 1, // 全选
      list: [], // 购物车商品列表
      checkGoods: {
        num: 0, // 选中商品个数
        many: 0, // 选中商品总金额
        all: false,
      },
      // 配送方式筛选
      shop: {},
    }
  },
  created () {
    this.getList();
  },
  methods: {
    // 查看商品
    goGoods (id) {
      this.$router.push('/product/'+id)
    },
    // 获取数据
    getList () {
      let vm = this;
      this.list = [];
      this.shop = {};
      this.$http.get('/panda-shop-api/v1/listCart').then(function (response) {
        if(response.data.code == '1000'){
          if(response.data.result){
            vm.list = response.data.result;
            vm.list.forEach((e, i) => {
              if(vm.shop[e.shippingMethodId]){
                vm.shop[e.shippingMethodId].list.push(e)
              }else{
                vm.shop[e.shippingMethodId] = {
                  name: e.shippingMethodName,
                  check: false,
                  list: []
                }
                vm.shop[e.shippingMethodId].list.push(e)
              }
            })
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
    // 前往编辑购物车
    editCart () {
      this.$router.push('/product/cartEdit')
    },
    // 计算件数, 总金额
    calculation () {
      let num = 0;
      let many = 0;
      let checkOn = true;
      this.list.forEach((e, i) => {
        if(e.check){
          num += e.quantity;
          many += (e.quantity * e.salesPrice);
        }else{
          checkOn = false;
        }
      })
      this.checkGoods.num = num;
      this.checkGoods.many = many;
      this.checkGoods.all = checkOn;
    },
    // 添加选中商品
    pushCheck (obj) {
      let vm = this;
      let list = [];
      vm.list.forEach((e, i) => {
        if(e.id == obj.id){
          e.check = true;
        }
        list.push(e);
      })
      vm.list = list;
      this.calculation();
    },
    // 删除选中商品
    delCheck (obj) {
      let list = [];
      this.list.forEach((e, i) => {
        if(e.id == obj.id){
          e.check = false;
        }
        list.push(e);
      })
      this.list = list;
      this.calculation();
    },
    // 修改购物车商品 数量接口
    editNum (obj) {
      let vm =this;
      let postData = {
        id: obj.id,
        quantity: obj.quantity,
        productSkuId: obj.productSkuId
      }
      this.$http.post('/panda-shop-api/v1/updateCart', postData).then(function (response) {
        if(response.data.code == '1000'){
          
        }else{
          vm.$toast(response.data.msg)
        }
      })
      .catch(function (error) {
        vm.$toast('请求超时，请稍后再试！')
      });
    }, 
    // 商品件数 + 
    addNum (obj) {
      let list = [];
      this.list.forEach((e, i) => {
        if(e.id == obj.id){
          e.quantity += 1;
        }
        list.push(e);
      })
      this.list = list;
      this.editNum(obj);
      this.calculation();
    },
    // 商品件数 - 
    reduceNum (obj) {
      let list = [];
      this.list.forEach((e, i) => {
        if(e.id == obj.id && e.quantity > 1){
          e.quantity -= 1;
        }
        list.push(e);
      })
      this.list = list;
      this.editNum(obj);
      this.calculation();
    },
    // 商品购物车删除
    delGoods (obj) {
     var vm = this;
     this.$dialog.confirm({
        title: '确认删除',
        message: ''
      }).then(() => {
        vm.$http.get('/panda-shop-api/v1/delCart/'+obj.id).then(function (response) {
          if(response.data.code == '1000'){
            vm.getList();
          }else{
            vm.$toast(response.data.msg)
          }
        })
        .catch(function (error) {
          vm.$toast('请求超时，请稍后再试！')
        });
      }).catch(() => {
        // on cancel
      });
    },
    // 全选
    checkAll () {
      let checkOn = this.checkGoods.all; // 全选状态
      let list = [];
      this.list.forEach((e, i) => {
        if(checkOn){
          e.check = false;
        }else{
          e.check = true;
        }
        list.push(e);
      })
      this.list = list;
      this.calculation();
    },
    // 生成订单
    generateOrder () {
      let vm = this;
      let postData = {
        reqCartList: [],
        receiverId: '',
        shippingMethodId: '',
        remark: ''
      }
      var shippingList = [];
      this.list.forEach((e, i) => {
        if(e.check){
          postData.shippingMethodId = e.shippingMethodId;
          postData.reqCartList.push(e);
          if(shippingList.indexOf(e.shippingMethodId) < 0){
            shippingList.push(e.shippingMethodId);
          }
        }
      })
      if(postData.reqCartList.length == 0){
        this.$toast('请选择需要购买的商品');
        return false;
      }else if(shippingList.length > 1){
        this.$toast('下单商品的配送方式不一样，请分开下单！');
        return false;
      }

      this.$cookies.set('goodsOrder', JSON.stringify(postData))
      sessionStorage.setItem('goodsOrder', JSON.stringify(postData))
      vm.$router.push('/product/orderPay');
    },
  },
  filters: {
    // 金钱格式化
    moneyFormat (value) {
      if(value){
        return (value/ 100).toFixed(2)
      }else if(value === 0){
        return '0'
      }else{
        return ''
      }
    }
  }
}
</script>

<style scoped>
.catr-cont{
  padding-bottom: 190px;
  background-color: #f8f8f8;
}
header{
  width: 100%;
  font-size: 28px;
  color: #4d4d4d;
  line-height: 80px;
  text-align: center;
  border-bottom: 1px solid #dfdfdf;
  background-color: #fff;
  text-align: left;
  padding-left: 20px;
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

/* 购物车控制条 */
.fix-bar{
  position: fixed;
  bottom: 88px;
  left: 0;
  height: 100px;
  width: 100%;
  background-color: #fff;
  display: flex;
  font-size: 28px;
  border-top: 1px solid #eee;
}
.fix-bar-right{
  height: 100%;
  line-height: 100px;
  color: #fff;
  background-color: #ff5162;
  text-align: center;
  /* width: 220px; */
  padding: 0 40px;
  font-weight: 700;
  font-size: 28px;
}
.fix-bar-right small{
  font-size: 20px;
  font-weight: 500;
}
.fix-bar-edit{
  background-color: #fc9800;
}
.fix-bar-left{
  flex: 10;
  display: flex;
}
.fix-bar-choice{
  width: 90px;
  text-align: center;
  height: 100px;
  line-height: 50px;
  padding-top: 10px;
}
.fix-bar-choice-title{
  line-height: 30px;
  font-size: 22px;
}
.fix-bar-info{
  flex: 10;
  line-height: 100px;
}
.fix-bar-info-maney{
  padding-right: 20px;
  float: right;
  font-size: 28px;
  font-weight: 700;
}
.fix-bar-info-maney .on{
  font-weight: 700;
}

/* 商品列表 */
.goods-list{
  margin-bottom: 20px;
  background-color: #fff;
}
.business-name{
  line-height: 44px;
  padding: 20px 20px 20px 26px;
  position: relative;
  font-size: 28px;
  font-weight: 700;
}
.business-name-choice{
  position: absolute;
  left: 20px;
  top: 17px;
  font-size: 20px;
}
.business-name .iconfont{
  font-size: 32px;
}
.goods-item{
  border-top: 1px solid #eee;
  display: flex;
  position: relative;
  padding: 20px 20px 20px 90px;
}
.goods-item-choice{
  position: absolute;
  height: 100%;
  top: 0;
  left: 0;
  width: 90px;
  box-sizing: border-box;
  padding: 0 20px;
  padding-top: 75px;
  color: #c1c1c1;
  text-align: center;
}
.goods-item-choice .van-icon{
  font-size: 20px;
}
.goods-item-choice .van-icon.van-icon-checked{
  color: #ff5162;
}
.goods-item-img .img{
  display: block;
  height: 150px;
  width: 150px;
  overflow: hidden;
  margin: 0;
  border-radius: 5px;
}
.img img{
  display: block;
}
.goods-item-info{
  flex: 10;
  padding-left: 20px;
}
.goods-item-info h4{
  font-size: 24px;
  line-height: 38px;
}
.goods-item-info-spec{
color: #c1c1c1;
font-size: 24px;
line-height: 38px;
}
.goods-item-info-cont{
  display: flex;
  padding-top: 14px;
}
.goods-item-info-cont-left{
  flex: 8;
  line-height: 60px;
  font-size: 28px;
}
.goods-item-info-cont-btn{
  display: flex;
  border-radius: 8px;
  overflow: hidden;
}
.goods-item-info-cont-btn .btn {
  height: 60px;
  /* line-height: 50px; */
  width: 60px;
  text-align: center;
  font-size: 32px;
  background-color: #f7f7f7;
}
.goods-item-info-cont-btn .iconfont{
  font-size: 28px;
  line-height: 60px;
}
.goods-item-info-cont-btn-info{
  line-height: 60px;
  width: 90px;
  text-align: center;
  font-size: 24px;       
  margin: 0 2px;
  background-color: #f7f7f7;
}
.header-more{
  position: absolute;
  line-height: 80px;
  top: 0;
  right: 0;
  padding: 0 20px;
  font-size: 24px;
  color: #ff5162;
}
.fix-bar .van-icon-check{
  font-size: 18px;
  line-height: 20px;
  color: #c1c1c1;
}
.fix-bar .van-icon-checked{
  font-size: 18px;
  line-height: 20px;
  color: #ff5162;
}
.goods-item-choice .van-icon{
  font-size: 18px;
}
</style>

<style>
.van-radio .van-icon-checked{
  color: #ff5162;
}
</style>
