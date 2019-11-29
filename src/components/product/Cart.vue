<template>
  <div class="container catr-cont">
    <div v-if="list.length > 0">
      <!-- 商品列表开始 -->
      <div style="min-height:101%">
        <div class="goods-list" v-for="(stor, storeId) in store" :key="storeId">
          <div class="business-name unoverflow">
            <!-- <div class="business-name-choice">
              <van-icon name="check" v-show="! obj.check" @click="pushCheck(key)"/>
              <van-icon name="checked" v-show="obj.check" @click="delCheck(key)"/>
            </div>-->
            <span class="titleSpan">{{stor.storeName}}</span>
          </div>

          <!-- 配送方式列表开始 -->
          <div v-for="(obj, key) in stor.list" :key="key">
            <div class="goods-ship unoverflow">
              <div class="goods-ship-choice">
                <van-icon name="check" v-show="! obj.check" @click="checkOfType(obj)" />
                <van-icon name="checked" v-show="obj.check" @click="delCheckOfType(obj)" />
              </div>
              {{obj.name}}
            </div>
            <ul class="goods-cont">
              <li class="goods-item" v-for="(item, index) in obj.list" :key="index">
                <div class="goods-item-choice">
                  <van-icon name="check" v-show="! item.check" @click="pushCheck(item, obj)" />
                  <van-icon name="checked" v-show="item.check" @click="delCheck(item, obj)" />
                </div>
                <div class="goods-item-img">
                  <figure class="img">
                    <img
                      v-if="item.imageUrl"
                      style="width: 100%;"
                      :src="item.imageUrl.split(',')[0] | imgSpecilize"
                      alt
                      @click.stop="goGoods(item.productId)"
                    />
                  </figure>
                </div>
                <div class="goods-item-info">
                  <div class="goods-item-info-title">
                    <h4>{{item.name}}</h4>
                    <div
                      style="border-radius: 30px;display: inline-block;margin-top: 5px; background-color: #FE636B;"
                    >
                      <span class="goods-item-info-spec-text">
                        <span>{{item.specification}}</span>
                      </span>
                    </div>
                    <i class="goods-item-info-removeimg">
                      <img @click="delGoods(item)" src="../../assets/remove.png" width="100%" />
                    </i>
                  </div>
                  <div class="goods-item-info-cont">
                    <div class="on goods-item-info-cont-left">
                      <small>¥</small>
                      <b class="priceSpan" v-html="moneyFormat(item.salesPrice)"></b>
                    </div>
                    <div class="goods-item-info-cont-btn">
                      <div class="btn goods-item-info-cont-btn-reduce" @click="reduceNum(item)">
                        <i class="iconfont">&#xe638;</i>
                      </div>
                      <div class="goods-item-info-cont-btn-info">{{item.quantity}}</div>
                      <div class="btn goods-item-info-cont-btn-add" @click="addNum(item)">
                        <i class="iconfont">&#xe602;</i>
                      </div>
                      <!--<div class="goods-item-info-cont-btn-info" @click="delGoods(item)">删除</div>-->
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <!-- 配送方式列表结束 -->
        </div>
      </div>
      <!-- 商品列表结束 -->
      <!-- 购物车控制 -->
      <div class="fix-bar">
        <div class="fix-bar-left">
          <div class="fix-bar-choice" @click="checkAll" v-show="list.length > 0">
            <van-icon name="check" v-show="! checkGoods.all" />
            <van-icon name="checked" v-show="checkGoods.all" />
            <div class="fix-bar-choice-ctrl"></div>
            <div class="fix-bar-choice-title">全选</div>
          </div>
          <div class="fix-bar-info">
            <div class="fix-bar-info-maney">
              价格:
              <em class="on">
                <small>¥</small>
                <span class="priceSpan" v-html="moneyFormat(checkGoods.many)"></span>
              </em>
            </div>
          </div>
        </div>
        <!-- <div class="fix-bar-right fix-bar-edit" @click="editCart">
        编辑
        </div>-->
        <div class="fix-bar-right" @click="generateOrder">
          结算
          <small>({{checkGoods.num}}件)</small>
        </div>
      </div>
    </div>
    <div v-if="inited && list.length === 0" class="noCartContent">
      <ul>
        <li>
          <i>
            <img src="@/assets/noThing/gouwuche.png" width="100%" />
          </i>
        </li>
        <li>
          <span>购物车是空的</span>
        </li>
        <li>
          <i>
            <img src="@/assets/noThing/gwc-button.png" @click="goPath('/index')" width="100%" />
          </i>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Vheader from "../HeaderV";
export default {
  name: "Cart",
  components: {
    Vheader
  },
  data() {
    return {
      inited: false,
      // 弹出层
      popup: false,
      radio: 1, // 全选
      list: [], // 购物车商品列表
      checkGoods: {
        num: 0, // 选中商品个数
        many: 0, // 选中商品总金额
        all: false
      },
      // 配送方式筛选
      shop: {},
      // 店铺列表
      store: {}
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 跳转路径
    goPath(path) {
      this.$router.push(path);
    },
    moneyFormat(value) {
      if (value) {
        var moneyValue = (value / 100).toFixed(2).split(".");

        return "<big>" + moneyValue[0] + "</big>." + moneyValue[1];
      } else if (value === 0) {
        return "0";
      } else {
        return "";
      }
    },
    // 查看商品
    goGoods(id) {
      this.$router.push("/product/" + id);
    },
    // 获取数据
    getList() {
      let vm = this;
      this.list = [];
      this.shop = {};
      this.store = {};

      this.$http
        .get("/panda-shop-api/v1/listCart")
        .then(function(response) {
          if ("1000" == response.data.code) {
            if (response.data.result) {
              vm.list = response.data.result;
              if (vm.list.length === 0) {
                return flase;
              }
              vm.list.forEach((e, i) => {
                if (vm.shop[e.shippingMethodId]) {
                  vm.shop[e.shippingMethodId].list.push(e);
                } else {
                  vm.shop[e.shippingMethodId] = {
                    name: e.shippingMethodName,
                    storeName: e.storeName,
                    storeId: e.storeId,
                    check: false,
                    list: []
                  };
                  vm.shop[e.shippingMethodId].list.push(e);
                }
              });
              // 店铺
              for (let key in vm.shop) {
                if (vm.store["store" + vm.shop[key].storeId]) {
                  vm.store["store" + vm.shop[key].storeId].list.push(
                    vm.shop[key]
                  );
                } else {
                  vm.store["store" + vm.shop[key].storeId] = {
                    storeName: vm.shop[key].storeName,
                    storeId: vm.shop[key].storeId,
                    check: false,
                    list: []
                  };
                  vm.store["store" + vm.shop[key].storeId].list.push(
                    vm.shop[key]
                  );
                }
              }
              //    console.log(vm.store)
            }
          } else {
            vm.$toast(response.data.msg);
          }
          vm.inited = true;
        })
        .catch(function(error) {
          vm.$toast("请求超时，请稍后再试！");
        });
    },
    // 返回上一页
    goBack() {
      this.$router.back(-1);
    },
    // 前往编辑购物车
    editCart() {
      this.$router.push("/product/cartEdit");
    },
    // 计算件数, 总金额
    calculation() {
      let num = 0;
      let many = 0;
      let checkOn = true;
      this.list.forEach((e, i) => {
        if (e.check) {
          num += e.quantity;
          many += e.quantity * e.salesPrice;
        } else {
          checkOn = false;
        }
      });
      this.checkGoods.num = num;
      this.checkGoods.many = many;
      this.checkGoods.all = checkOn;
    },
    // 添加选中商品
    pushCheck(obj, obj_p) {
      let vm = this;
      let typeCheckNum = 0;
      let list = [];
      vm.list.forEach((e, i) => {
        if (e.id == obj.id) {
          e.check = true;
        }
        if (e.check && e.shippingMethodName == obj_p.name) {
          typeCheckNum++;
        }
        list.push(e);
      });
      obj_p.check = typeCheckNum === obj_p.list.length;
      vm.list = list;
      this.calculation();
    },
    // 删除选中商品
    delCheck(obj, obj_p) {
      let list = [];
      obj_p.check = false;
      this.list.forEach((e, i) => {
        if (e.id == obj.id) {
          e.check = false;
        }
        list.push(e);
      });
      this.list = list;
      this.calculation();
    },
    // 修改购物车商品 数量接口
    editNum(obj) {
      let vm = this;
      let postData = {
        id: obj.id,
        quantity: obj.quantity,
        productSkuId: obj.productSkuId
      };
      this.$http
        .post("/panda-shop-api/v1/updateCart", postData)
        .then(function(response) {
          if ("1000" == response.data.code) {
          } else {
            vm.$toast(response.data.msg);
          }
        })
        .catch(function(error) {
          vm.$toast("请求超时，请稍后再试！");
        });
    },
    // 商品件数 +
    addNum(obj) {
      let list = [];
      this.list.forEach((e, i) => {
        if (e.id == obj.id) {
          e.quantity += 1;
        }
        list.push(e);
      });
      this.list = list;
      this.editNum(obj);
      this.calculation();
    },
    // 商品件数 -
    reduceNum(obj) {
      let list = [];
      this.list.forEach((e, i) => {
        if (e.id == obj.id && e.quantity > 1) {
          e.quantity -= 1;
        }
        list.push(e);
      });
      this.list = list;
      this.editNum(obj);
      this.calculation();
    },
    // 商品购物车删除
    delGoods(obj) {
      var vm = this;
      this.$dialog
        .confirm({
          title: "确认删除",
          message: ""
        })
        .then(() => {
          vm.$http
            .get("/panda-shop-api/v1/delCart/" + obj.id)
            .then(function(response) {
              if ("1000" == response.data.code) {
                vm.getList();
              } else {
                vm.$toast(response.data.msg);
              }
            })
            .catch(function(error) {
              vm.$toast("请求超时，请稍后再试！");
            });
        })
        .catch(() => {
          // on cancel
        });
    },
    checkOfType(obj) {
      let list = [];
      obj.check = true;
      this.list.forEach((e, i) => {
        if (e.shippingMethodName == obj.name) {
          e.check = true;
        }
        list.push(e);
      });
      this.list = list;
      this.editNum(obj);
      this.calculation();
    },
    delCheckOfType(obj) {
      let list = [];
      obj.check = false;
      this.list.forEach((e, i) => {
        if (e.shippingMethodName == obj.name) {
          e.check = false;
        }
        list.push(e);
      });
      this.list = list;
      this.editNum(obj);
      this.calculation();
    },
    // 全选
    checkAll() {
      let checkOn = this.checkGoods.all; // 全选状态
      let list = [];
      this.list.forEach((e, i) => {
        if (checkOn) {
          e.check = false;
        } else {
          e.check = true;
        }
        list.push(e);
      });
      for (var key in this.store) {
        this.store[key].list.forEach((e, i) => {
          if (checkOn) {
            e.check = false;
          } else {
            e.check = true;
          }
        });
      }
      this.list = list;
      this.calculation();
    },
    // 生成订单
    generateOrder() {
      let vm = this;
      let postData = {
        reqCartList: [],
        receiverId: "",
        shippingMethodId: "",
        remark: ""
      };
      var shippingList = [];
      this.list.forEach((e, i) => {
        if (e.check) {
          postData.shippingMethodId = e.shippingMethodId;
          postData.reqCartList.push(e);
          if (shippingList.indexOf(e.shippingMethodId) < 0) {
            shippingList.push(e.shippingMethodId);
          }
        }
      });
      if (postData.reqCartList.length == 0) {
        this.$toast("请选择需要购买的商品");
        return false;
      } else if (shippingList.length > 1) {
        this.$toast("下单商品的配送方式不一样，请分开下单！");
        return false;
      }

      this.$cookies.set("goodsOrder", JSON.stringify(postData));
      sessionStorage.setItem("goodsOrder", JSON.stringify(postData));
      vm.$router.push("/product/orderPay");
    }
  },
  filters: {
    // 金钱格式化
  }
};
</script>

<style scoped>
.titleSpan {
  display: inline-block;
  position: relative;
  margin-left: 10px;
}

.titleSpan:before {
  content: " ";
  display: inline-block;
  position: absolute;
  top: 10%;
  height: 80%;
  width: 6px;
  left: -18px;
  background-color: #ff5162;
}

.catr-cont {
  padding-bottom: 180px;
  background-color: #f8f8f8;
}

.class-back {
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

.fix-bar {
  position: fixed;
  bottom: 88px;
  left: 0;
  height: 90px;
  width: 100%;
  background-color: #fff;
  display: flex;
  font-size: 28px;
  border-top: 1px solid #f8f8f8;
}

.fix-bar-right {
  height: 100%;
  line-height: 90px;
  color: #fff;
  background: -webkit-linear-gradient(left, #ff8e62, #fd4471);
  /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(right, #ff8e62, #fd4471);
  /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(right, #ff8e62, #fd4471);
  /* Firefox 3.6 - 15 */
  background: linear-gradient(to right, #ff8e62, #fd4471);
  text-align: center;
  /* width: 220px; */
  padding: 0 40px;
  font-weight: 700;
  font-size: 28px;
}

.fix-bar-right small {
  font-size: 20px;
  font-weight: 500;
}

.fix-bar-edit {
  background-color: #fc9800;
}

.fix-bar-left {
  flex: 10;
  display: flex;
  padding-left: 30px;
}

.fix-bar-choice {
  width: 60px;
  height: 90px;
  line-height: 40px;
  padding-top: 10px;
  text-align: center;
  margin-left: -10px;
}

.fix-bar-choice-title {
  line-height: 30px;
  font-size: 22px;
}

.fix-bar-info {
  flex: 10;
  line-height: 90px;
}

.fix-bar-info-maney {
  padding-right: 20px;
  float: right;
  font-size: 28px;
  font-weight: 700;
}

.fix-bar-info-maney .on {
  font-weight: 700;
}
/* 商品列表 */

.goods-ship {
  line-height: 38px;
  height: 60px;
  font-size: 24px;
  font-weight: 700;
  padding: 11px 20px 11px 60px;
  box-sizing: border-box;
  position: relative;
}

.goods-cont {
  box-sizing: border-box;
  padding: 0 30px;
}

.goods-list {
  margin-bottom: 20px;
  background-color: #fff;
}

.business-name {
  line-height: 44px;
  padding: 20px 20px 20px 30px;
  position: relative;
  font-size: 28px;
  font-weight: 700;
  border-bottom: 1px solid #f8f8f8;
}

.business-name-choice {
  position: absolute;
  left: 0px;
  top: 0px;
  font-size: 20px;
  width: 90px;
  text-align: center;
  height: 84px;
  line-height: 84px;
  box-sizing: border-box;
}

.business-name-choice i {
  line-height: 84px;
}

.business-name .iconfont {
  font-size: 32px;
}

.goods-ship-choice {
  display: inline-block;
  height: 40px;
  width: 40px;
  text-align: center;
  position: absolute;
  top: 15px;
  left: 20px;
}

.goods-ship-choice .van-icon {
  font-size: 14px;
}

.goods-item {
  margin-bottom: 20px;
  border-radius: 10px;
  box-shadow: 0px 5px 20px #e0e0e0;
  display: flex;
  position: relative;
  padding: 20px 20px 20px 60px;
}

.goods-item-choice {
  position: absolute;
  height: 100%;
  width: 60px;
  top: 0;
  left: 0;
  box-sizing: border-box;
  padding: 90px 0px 0 0;
  color: #eee;
  text-align: center;
}

.goods-item-choice .van-icon {
  font-size: 20px;
}

.van-icon.van-icon-check {
  color: #eeeeee;
}

.van-icon.van-icon-checked {
  color: #ff5162;
}

.goods-item-img .img {
  display: block;
  height: 200px;
  width: 200px;
  overflow: hidden;
  margin: 0;
  border-radius: 5px;
}

.img img {
  display: block;
}

.goods-item-info {
  flex: 10;
  padding-left: 20px;
}

.goods-item-info-title {
  padding-right: 80px;
  position: relative;
}

.goods-item-info-removeimg {
  position: absolute;
  right: 8px;
  top: 8px;
  width: 20px;
  display: inline-block;
}

.goods-item-info h4 {
  font-size: 24px;
  line-height: 36px;
  height: 36px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}

.goods-item-info-spec-text {
  color: #c1c1c1;
  font-size: 18px;
  color: #ffffff;
}

.goods-item-info-spec-text span {
  display: -webkit-box;
  height: 26px;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  border-radius: 40px;
  padding: 3px 20px;
  background: -webkit-linear-gradient(left, #ff8e62, #fd4471);
  /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(right, #ff8e62, #fd4471);
  /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(right, #ff8e62, #fd4471);
  /* Firefox 3.6 - 15 */
  background: linear-gradient(to right, #ff8e62, #fd4471);
  /* 标准的语法（必须放在最后） */
}

.goods-item-info-cont {
  display: flex;
  margin-top: 60px;
  /* padding-top: 14px; */
}

.goods-item-info-cont-left {
  flex: 8;
  line-height: 60px;
  font-size: 28px;
}

.goods-item-info-cont-btn {
  display: flex;
  border-radius: 8px;
  overflow: hidden;
}

.goods-item-info-cont-btn .btn {
  height: 40px;
  width: 40px;
  text-align: center;
  font-size: 26px;
  background-color: #f7f7f7;
  font-weight: 700;
  margin-top: 12px;
}

.goods-item-info-cont-btn .iconfont {
  font-size: 20px;
  line-height: 40px;
}

.goods-item-info-cont-btn-info {
  line-height: 60px;
  width: 80px;
  text-align: center;
  font-size: 24px;
  margin: 0 4px;
}

.header-more {
  position: absolute;
  line-height: 80px;
  top: 0;
  right: 0;
  padding: 0 20px;
  font-size: 24px;
  color: #ff5162;
}

.fix-bar .van-icon-check {
  font-size: 14px;
  line-height: 20px;
  color: #eee;
}

.fix-bar .van-icon-checked {
  font-size: 14px;
  line-height: 20px;
  color: #ff5162;
}

.goods-item-choice .van-icon {
  font-size: 14px;
}

.business-name-choice .van-icon {
  font-size: 14px;
}

.business-name-choice {
  color: #eee;
}

.noCartContent ul {
  margin-top: 80px;
}

.noCartContent ul li {
  text-align: center;
}

.noCartContent ul li:nth-child(1) i {
  display: inline-block;
  width: 160px;
  height: 160px;
}

.noCartContent ul li:nth-child(2) {
  margin-top: 10px;
}

.noCartContent ul li:nth-child(2) span {
  font-size: 30px;
  color: #969696;
}

.noCartContent ul li:nth-child(3) {
  margin-top: 30px;
}

.noCartContent ul li:nth-child(3) i {
  display: inline-block;
  width: 240px;
}
</style>

<style>
.van-radio .van-icon-checked {
  color: #ff5162;
}
</style>