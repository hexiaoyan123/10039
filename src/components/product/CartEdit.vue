<template>
  <div class="container catr-cont">

    <!-- 商品列表开始 -->
    <div class="goods-list">
      <!-- <div class="business-name">
        <div class="business-name-choice">
          <van-radio-group v-model="radio">
            <van-radio name="1"></van-radio>
          </van-radio-group>
        </div>
        <i class="iconfont">&#xe606;</i>
        <span>手机数码旗舰店</span>
      </div> -->
      <ul class="goods-cont">
        <li class="goods-item" v-for="(item, index) in list" :key="index">
          <div class="goods-item-img">
            <figure class="img">
              <img style="width: 100%;" :src="$init.imgIp + item.imageUrl.split(',')[0]" alt="">
            </figure>
          </div>
          <div class="goods-item-info">
            <h4>{{item.name}}</h4>
            <div class="goods-item-info-spec">
              {{item.specification}}
            </div>
            <div class="goods-item-info-cont">
              <div class="on goods-item-info-cont-left">
                ¥ <span class="priceSpan" v-html="moneyFormat(item.salesPrice)"></span> <small style="color:#666;">x {{item.quantity}}</small>
              </div>
              <div class="goods-item-info-cont-btn" @click="delCart(item)">
                <div class="goods-item-info-cont-btn-info">删除</div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <!-- 商品列表结束 -->
    
    <!-- 购物车控制 -->
    <div class="fix-bar">
      <div class="fix-bar-left">
        <div class="fix-bar-info">
          <div class="fix-bar-info-maney">
            价格: <em class="on">¥ <span class="priceSpan" v-html="moneyFormat(checkGoods.many)"></span></em>
          </div>
        </div>
        <div class="fix-bar-right fix-bar-clear" @click="clearCart">  
          清空
        </div>
      </div>
      <div class="fix-bar-right"  @click="goBack">
        完成
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
      list: [], // 购物车商品列表
      checkGoods: {
        num: 0, // 选中商品个数
        many: 0, // 选中商品总金额
        all: false,
      }
    }
  },
  created () {
    this.getList();
  },
  methods: {
  	moneyFormat(value) {
				if(value) {
					var moneyValue = (value / 100).toFixed(2).split('.');

					return '<big>' + moneyValue[0] + '</big>.' + moneyValue[1]
				} else if(value === 0) {
					return '0'
				} else {
					return ''
				}
			},
    // 获取数据
    getList () {
      let vm = this;
      this.$http.get('/panda-shop-api/wap/pageCart/1/100').then(function (response) {
        if(response.data.code == '1000'){
          vm.list = response.data.result.list;
          vm.calculation()
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
    // 删除商品
    delCart (obj) {
      let vm = this;
      this.$http.get('/panda-shop-api/wap/delCart/'+ obj.id).then(function (response) {
        if(response.data.code == '1000'){
          let list = [];
          vm.list.forEach((e, i) => {
            if(e.id != obj.id){
              list.push(e)
            }
          })
          vm.list = list;
          vm.calculation()
          vm.$toast('删除成功');
        }else{
          vm.$toast(response.data.msg)
        }
      })
      .catch(function (error) {
        vm.$toast('请求超时，请稍后再试！')
      });
    },
    // 清空
    clearCart () {
      let vm =this;
      let postData = [];
      this.list.forEach((e, i) => {
        postData.push(e.id)
      })
      if(postData.length == 0){
        vm.$toast('购物车为空')
        return false;
      }
      this.$http.post('/panda-shop-api/wap/delCart', postData).then(function (response) {
        if(response.data.code == '1000'){
          vm.list= [];
          vm.checkGoods.num = 0;
          vm.checkGoods.many = 0;
        }else{
          vm.$toast(response.data.msg)
        }
      })
      .catch(function (error) {
        vm.$toast('请求超时，请稍后再试！')
      });
    },
    // 计算件数, 总金额
    calculation () {
      let num = 0;
      let many = 0;
      let checkOn = true;
      this.list.forEach((e, i) => {
          num += e.quantity;
          many += (e.quantity * e.salesPrice);
      })
      this.checkGoods.num = num;
      this.checkGoods.many = many;
      this.checkGoods.all = checkOn;
    },
    // 生成订单
    generateOrder () {
      let vm = this;
      let orderGoods = []
      let postData = {
        reqCartList: []
      }
      this.list.forEach((e, i) => {
          let obj = {
            id: e.id,
            quantity: e.quantity,
            productId: e.productId
          }
          postData.reqCartList.push(obj);
          orderGoods.push(e);
      })
      if(postData.reqCartList.length == 0){
        this.$toast('请选择需要购买的商品');
        return false;
      }
      this.$http.post('/panda-shop-api/wap/generateOrder', postData).then(function (response) {
        if(response.data.code == '1000'){
          let order = {
            goods: orderGoods,
            id: response.data.result
          }
          vm.$init.order = order;
          window.sessionStorage.setItem('order', JSON.stringify(order));
          vm.$router.push('/product/orderPay');
        }else{
          vm.$toast(response.data.msg)
        }
      })
      .catch(function (error) {
        vm.$toast('请求超时，请稍后再试！')
      });
    },
  },
  filters: {
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
  padding-bottom: 102px;
  background-color: #f8f8f8;
}
header{
  width: 100%;
  font-size: 28px;
  color: #4d4d4d;
  line-height: 84px;
  text-align: center;
  border-bottom: 1px solid #dfdfdf;
  background-color: #fff;
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
  bottom: 0;
  left: 0;
  height: 100px;
  width: 100%;
  background-color: #fff;
  display: flex;
  font-size: 28px;
  border-top: 1px solid #dfdfdf;
}
.fix-bar-right{
  height: 100%;
  line-height: 100px;
  color: #fff;
  background-color: #ff5162;
  text-align: center;
  /* width: 220px; */
  font-weight: 700;
  font-size: 32px;
  padding: 0 40px;
}
.fix-bar-right small{
  font-size: 20px;
  font-weight: 500;
}
.fix-bar-left{
  flex: 10;
  display: flex;
}
.fix-bar-choice{
  width: 100px;
  text-align: center;
  height: 100px;
  line-height: 60px;
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
  padding-left: 20px;
  font-size: 32px;
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
  padding: 20px 20px 20px 90px;
  position: relative;
  font-size: 32px;
  font-weight: 700;
}
.business-name-choice{
  position: absolute;
  left: 20px;
  top: 17px;
}
.business-name .iconfont{
  font-size: 32px;
}
.goods-item{
  border-top: 1px solid #dfdfdf;
  display: flex;
  position: relative;
  padding: 20px 20px 20px 20px;
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
  color: #999;
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
}
.goods-item-info{
  flex: 10;
  padding-left: 20px;
}
.goods-item-info h4{
  color: #4d4d4d;
  font-size: 24px;
  line-height: 45px;
}
.goods-item-info-spec{
color: #818181;
font-size: 24px;
line-height: 45px;
}
.goods-item-info-cont{
  display: flex;
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
  font-size: 28px;
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
.fix-bar-clear{
  background-color: #fc9800;
}
</style>

<style>
.van-radio .van-icon-checked{
  color: #ff5162;
}
</style>
