<template>
  <div class="container address-list">
    <!-- <div class="tishi">温馨提示，余额不足和过期卡券均不显示！</div> -->
    <Vheader name="选择卡券"></Vheader>

    <div class="card">
      <div class="card-add" @click="modo = true">
        <i class="iconfont on">&#xe602;</i>
        <span>添加次卡</span>
      </div>

      <ul class="card-list">
        <li
          class="card-item"
          @click="checkCard(item)"
          :class="{'card-item-on': item.on, 'uncheck': noDeta > item.expDate}"
          v-for="(item, index) in list"
          :key="index"
        >
          <div class="card-item-top"></div>
          <div class="card-item-cont">
            <dl>
              <dt>卡号</dt>
              <dd>{{item.voucher}}</dd>
            </dl>
            <dl>
              <dt>类型</dt>
              <dd>{{item.payType | typeToStr}}</dd>
            </dl>
            <dl>
              <dt>有效期</dt>
              <dd>{{item.expDate}}</dd>
            </dl>
            <dl>
              <dt>余额</dt>
              <dd class="on">{{item.balance}} 次</dd>
            </dl>
            <div class="nums-crtl" @click.stop="1">
              <div class="nums-crtl-reduce" @click.stop="cardReduce(item)">-</div>
              <div class="nums-crtl-form">{{item.nowNum}}</div>
              <div class="nums-crtl-add" @click.stop="cardAdd(item)">+</div>
            </div>
          </div>
          <div class="uncheck-label">已过期</div>
          <div class="card-jiao">
            <van-icon name="success" />
          </div>
        </li>
      </ul>
    </div>

    <!-- 添加卡券开始 -->
    <div class="card-modo" v-show="modo" @click="modo = false">
      <div class="card-modo-in" @click.stop="1">
        <h3 class="card-modo-name">添加卡券</h3>
        <ul class="card-modo-form">
          <li class="card-modo-item">
            <div class="card-modo-item-lable">卡号:</div>
            <input @blur="iptBlur" @focus="iptFocus" type="text" v-model="form.voucher" />
            <div class="card-modo-item-ctrl"></div>
          </li>
          <li class="card-modo-item">
            <div class="card-modo-item-lable">密码:</div>
            <input @blur="iptBlur" @focus="iptFocus" type="password" v-model="form.voucherPassword" />
            <div class="card-modo-item-ctrl"></div>
          </li>
        </ul>
        <div class="form-modo-btn" @click="queryCard">确认</div>
      </div>
    </div>
    <!-- 添加卡券结束 -->

    <!-- 需要足额支付卡券操作开始 -->
    <div class="card-footer" v-if="full">
      <div class="card-footer-left">
        <span v-show="totalMoney == 0">请选择卡券</span>
        <span v-show="totalMoney > 0 && (totalMoney < playMoney)" class="card-un">
          已选择 {{cardNums}}次, 需支付
          <small>￥</small>
          <span class="priceSpan" v-html="moneyFormat(playMoney - totalMoney)"></span>
        </span>
        <span v-show="totalMoney >= playMoney" class="on">足额支付</span>
      </div>
      <div
        @click="cardOk"
        class="card-footer-right"
        :class="{'opacity-5': totalMoney < playMoney}"
      >确认使用</div>
    </div>
    <!-- 需要足额支付卡券操作结束 -->

    <!-- 可以补差卡券支付开始 -->
    <div class="card-footer" v-if="! full">
      <div class="card-footer-left">
        <span v-show="totalMoney == 0">请选择卡券</span>
        <span v-show="totalMoney > 0 && (totalMoney < playMoney)" class="card-un">
          已选择 {{cardNums}}次, 需支付
          <small>￥</small>
          <span class="priceSpan" v-html="moneyFormat(playMoney - totalMoney)"></span>
        </span>
        <span v-show="totalMoney >= playMoney" class="on">足额支付</span>
      </div>
      <div @click="cardOk" class="card-footer-right">确认使用</div>
    </div>
    <!-- 可以补差卡券支付结束 -->
  </div>
</template>

<script>
import Vheader from "./HeaderV";
export default {
  name: "OrderPayOnceCard",
  components: {
    Vheader
  },
  data() {
    return {
      list: [], // 卡券列表
      form: {
        voucher: "", // 卡号
        voucherPassword: "" // 密码
      },
      modo: false, // 模态框
      // 多张卡 选中的卡券
      totalMoney: 0, // 选中次卡总金额
      playMoney: 0, // 需要支付的金额
      playNums: 0, // 需要支付的数量
      cardNums: 0, // 选中卡数量
      full: this.$route.query.full != "1" ? true : false, // 需要足额支付
      payChannelId: this.$route.query.payChannel, // 支付渠道ID
      params: "" // 支付渠道配置参数
    };
  },
  created() {
    // 总金额赋值
    this.playMoney = this.$route.query.money - 0;
    this.playNums = this.$route.query.nums - 0;

    // 支付渠道参数设置
    var paramsJson = this.$cookies.get("payChannel");
    if (paramsJson) {
      var params = JSON.parse(paramsJson);
      if (params.id == this.payChannelId) {
        this.params = params.params ? params.params : "";
      }
    }

    // 卡券列表
    this.getListUserVoucher();

    // 清除选中卡信息
    this.$cookies.remove("checkPayCard");
  },
  methods: {
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
    //focus
    iptFocus() {
      this.errorMessage = "";
      this.inFocus = true;
    },
    //blur
    iptBlur() {
      let this_ = this;
      this_.inFocus = false;
      setTimeout(function() {
        if (this_.inFocus == false) {
          // 当input 失焦时,滚动一下页面就可以使页面恢复正常
          this_.checkWxScroll();
        }
      }, 200);
    },
    checkWxScroll() {
      var ua = navigator.userAgent.toLowerCase();
      var u = navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
      if (ua.match(/MicroMessenger/i) == "micromessenger" && !!u) {
        //在iphone 微信中
        this.temporaryRepair();
      }
    },
    temporaryRepair() {
      var currentPosition, timer;
      var speed = 1; //页面滚动距离
      timer = setInterval(function() {
        currentPosition =
          document.documentElement.scrollTop || document.body.scrollTop;
        currentPosition -= speed;
        window.scrollTo(0, 0); //页面向上滚动
        clearInterval(timer);
      }, 1);
    },

    // 计算选中卡金额
    getTotalMoney() {
      var vm = this;
      let money = 0;
      let cardNums = 0;
      this.list.forEach((e, i) => {
        if (e.on) {
          money += vm.$base.numMulti(e.nowNum, e.money);
          cardNums += e.nowNum;
        }
      });
      this.totalMoney = money;
      this.cardNums = cardNums;
    },
    // 次卡次数增加
    cardAdd(obj) {
      if (obj.nowNum < obj.maxNum) {
        if (this.totalMoney < this.playMoney) {
          // 更新列表
          let newList = [];
          this.list.forEach((e, i) => {
            if (e.voucher == obj.voucher) {
              let changeObj = e;
              changeObj.nowNum = changeObj.nowNum + 1;
              newList.push(changeObj);
            } else {
              newList.push(e);
            }
          });
          this.list = newList;
          this.getTotalMoney();
        } else {
          this.$toast("已足额支付");
        }
      }
    },
    // 次卡减小
    cardReduce(obj) {
      if (obj.nowNum > 1) {
        // 更新列表
        let newList = [];
        this.list.forEach((e, i) => {
          if (e.voucher == obj.voucher) {
            let changeObj = e;
            changeObj.nowNum = changeObj.nowNum - 1;
            newList.push(changeObj);
          } else {
            newList.push(e);
          }
        });
        this.list = newList;
        this.getTotalMoney();
      }
    },
    // 可选多张卡, 选中卡券
    checkCard(obj) {
      if (obj.expDate < this.noDeta) {
        return;
      }

      // 支付渠道参数 验证卡券可用
      if (this.params && this.params != "") {
        if (this.params.indexOf(obj.voucher.substring(0, 6)) < 0) {
          vm.$toast("当前渠道不支持此卡");
          return;
        }
      }

      if (!obj.on && this.totalMoney >= this.playMoney) {
        this.$toast("已足额支付");
        return;
      }
      let newList = [];
      this.list.forEach((e, i) => {
        if (e.voucher == obj.voucher) {
          let changeObj = e;
          changeObj.nowNum = 1;
          changeObj.on = changeObj.on ? false : true;
          newList.push(changeObj);
        } else {
          newList.push(e);
        }
      });
      this.list = newList;
      this.getTotalMoney();
    },
    // 确认使用
    cardOk() {
      if (this.totalMoney == 0) {
        this.$toast("请选择卡券");
        return;
      }
      if (this.full) {
        if (this.playMoney > this.totalMoney) {
          this.$toast("余额不足");
          return;
        }
      }
      let voucherStr = ""; // 选中的卡
      this.list.forEach((e, i) => {
        if (e.on) {
          if (voucherStr != "") {
            voucherStr += ",";
          }
          voucherStr += e.voucher + "_" + e.nowNum;
        }
      });

      // 金额计算
      let money = 0;
      if (this.playMoney > this.totalMoney) {
        money = this.totalMoney;
      } else {
        money = this.playMoney;
      }

      let checkPayCard = {
        payType: "3",
        order: this.$route.params.id,
        voucher: voucherStr,
        money: money,
        payChannel: this.payChannelId
      };
      this.$cookies.set("checkPayCard", JSON.stringify(checkPayCard));
      this.goBack();
    },
    // 获取我的卡券
    getListUserVoucher() {
      let vm = this;
      this.$http
        .get("/panda-payment-api/wap/listUserVoucher/3")
        .then(function(response) {
          if (response.data.code == "1000") {
            if (response.data.result) {
              let list = [];
              response.data.result.forEach((e, i) => {
                let obj = e;
                // TODO
                obj.nowNum = 1; // 当前选中值
                obj.maxNum = e.balance - 0; // 最大选中值
                obj.money = e.realValue - 0; // 卡金额
                obj.on = false; // 选中状态
                list.push(obj);
              });
              vm.list = list;
            }
          } else {
            vm.$toast(response.data.msg);
          }
        })
        .catch(function(error) {
          vm.$toast("请求超时，请稍后再试！");
        });
    },
    // 跳转路径
    goPath(path) {
      this.$router.push(path);
    },
    // 返回上一页
    goBack() {
      this.$router.back(-1);
    },
    // 绑定卡券 (卡号, 密码)
    bindCard(voucher, voucherPassword) {
      let vm = this;
      let postData = {
        voucher: voucher, // 卡号
        voucherPassword: voucherPassword // 密码
      };
      this.$http
        .post("/panda-payment-api/wap/saveUserVoucher", postData)
        .then(function(response) {
          vm.$store.commit("ctrlLoader", false);
          if (response.data.code == "1000") {
          } else {
            vm.$toast(response.data.msg);
          }
        })
        .catch(function(error) {
          vm.$store.commit("ctrlLoader", false);
          vm.$toast("请求超时，请稍后再试！");
        });
    },
    // 查询卡券
    queryCard() {
      let vm = this;
      let postData = this.form;
      if (!postData.voucher) {
        vm.$toast("请输入卡号");
        return;
      } else if (!postData.voucherPassword) {
        vm.$toast("请输入密码");
        return;
      }

      // 验证支付渠道参数
      if (this.params && this.params != "") {
        if (this.params.indexOf(postData.voucher.substring(0, 6)) < 0) {
          vm.$toast("当前渠道不支持此卡");
          return;
        }
      }
      vm.$store.commit("ctrlLoader", true);
      this.$http
        .post("/panda-payment-api/wap/getVoucher", postData)
        .then(function(response) {
          if (response.data.code == "1000") {
            if (response.data.result.payType == 3) {
              let repeat = false;
              vm.list.forEach((e, i) => {
                if (e.voucher == response.data.result.voucher) {
                  repeat = true;
                }
              });
              if (repeat) {
                vm.$store.commit("ctrlLoader", false);
                vm.$toast("存在此卡");
                return;
              } else {
                let obj = response.data.result;
                obj.nowNum = 1; // 当前选中值
                obj.maxNum = Number(obj.balance); // 最大选中值
                obj.money = Number(obj.realValue); // 卡金额
                obj.on = false; // 选中状态
                // 添加卡券
                vm.list.unshift(obj);
                vm.bindCard(postData.voucher, postData.voucherPassword);
                // if(obj.maxNum > 1){
                // }else{
                //   vm.$toast('卡余额为0次')
                // }
              }
            } else {
              vm.$store.commit("ctrlLoader", false);
              vm.$toast("此卡非次卡");
            }
            vm.clearCard();
          } else {
            vm.$store.commit("ctrlLoader", false);
            vm.$toast(response.data.msg);
          }
        })
        .catch(function(error) {
          vm.$store.commit("ctrlLoader", false);
          vm.$toast("请求超时，请稍后再试！");
        });
    },
    // 清除卡信息
    clearCard() {
      this.form = {
        voucher: "", // 卡号
        voucherPassword: "" // 密码
      };
      this.modo = false;
    }
  },
  filters: {
    // 凭证类型转字符串
    typeToStr(value) {
      if (value == 1) {
        return "现金卡";
      } else if (value == 2) {
        return "点卡";
      } else if (value == 3) {
        return "次卡";
      } else if (value == 4) {
        return "通兑票";
      } else if (value == 5) {
        return "现金券";
      } else if (value == 6) {
        return "兑换券";
      } else if (value == 7) {
        return "点券";
      } else {
        return "";
      }
    },
    // 金钱格式化
    moneyFormat(value) {
      if (value) {
        return (value / 100).toFixed(2);
      } else if (value === 0) {
        return 0;
      } else {
        return "";
      }
    }
  },
  computed: {
    noDeta() {
      let add0 = m => {
        return m < 10 ? "0" + m : m;
      };
      var time = new Date();
      var y = time.getFullYear();
      var m = time.getMonth() + 1;
      var d = time.getDate();
      var h = time.getHours();
      var mm = time.getMinutes();
      var s = time.getSeconds();
      return y + "-" + add0(m) + "-" + add0(d);
    }
  }
};
</script>

<style scoped>
.uncheck .card-item-top {
  background: #f8f8f8;
}
.uncheck .card-item-cont {
  background: #f8f8f8;
}
.uncheck-label {
  position: absolute;
  right: 20px;
  top: 100px;
  font-weight: 700;
  font-size: 46px;
  transform: rotate(-30deg);
  display: none;
}
.uncheck .uncheck-label {
  display: block;
}
/* 头 */
header {
  /* position: absolute; */
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  font-size: 28px;
  color: #fff;
  line-height: 84px;
  text-align: center;
  border-bottom: 1px solid #eee;
  background-color: #ff5162;
  z-index: 101;
}
.address-list {
  padding-top: 100px;
  padding-bottom: 90px;
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
  color: #fff;
}

.card-add {
  background-color: #fff;
  border-bottom: 1px solid #eee;
  border-top: 1px solid #eee;
  padding: 0 35px;
}
.card-add span {
  color: #bababa;
  font-size: 28px;
  line-height: 76px;
}
.card-list {
  padding: 35px;
}
.card-item {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
}
.card-item-on .card-jiao {
  display: block;
}
.card-item-top {
  height: 16px;
  line-height: 16px;
  color: #fff;
  position: relative;
  background: #ff5162; /* For browsers that do not support gradients */
  background: -webkit-linear-gradient(
    left top,
    #5fa0f9,
    #ff5162
  ); /* For Safari 5.1 to 6.0 */
  background: -o-linear-gradient(
    bottom right,
    #5fa0f9,
    #ff5162
  ); /* For Opera 11.1 to 12.0 */
  background: -moz-linear-gradient(
    bottom right,
    #5fa0f9,
    #ff5162
  ); /* For Firefox 3.6 to 15 */
  background: linear-gradient(
    to bottom right,
    #5fa0f9,
    #ff5162
  ); /* Standard syntax */
}
.card-item-cont {
  background-color: #fff;
  padding: 10px 20px;
}
.card-item-cont dl {
  display: flex;
  font-size: 24px;
  line-height: 50px;
}
.card-item-cont dt {
  width: 100px;
  color: #999;
}
.card-item-cont dd {
  flex: 10;
}

.card-add .iconfont {
  font-size: 28px;
  line-height: 76px;
}
.card-footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 88px;
  line-height: 88px;
  background-color: #fff;
  display: flex;
  font-size: 24px;
}
.card-footer-left {
  flex: 10;
  padding: 0 20px;
}
.card-footer-right {
  width: 200px;
  text-align: center;
  background-color: #ff5162;
  color: #fff;
}

/* 卡券模态框 */
.card-modo {
  box-sizing: border-box;
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  left: 0;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  padding: 20px;
}
.card-modo-in {
  width: 100%;
  background-color: #fff;
  border-radius: 20px;
  box-sizing: border-box;
  padding: 20px;
}

/* 輸入框 */
.card-modo-item {
  display: flex;
  font-size: 24px;
  color: #818181;
  line-height: 75px;
  padding: 12px 20px;
  border-bottom: 1px solid #eee;
}
.card-modo-item input {
  display: block;
  height: 75px;
  border: none;
  font-size: 28px;
  line-height: 75px;
  outline: none;
  flex: 10;
  padding: 0 10px;
  min-width: 10px;
}
.card-modo-item-ctrl {
  position: relative;
}
.card-modo-code {
  display: block;
  height: 75px;
  width: 160px;
  border-radius: 6px;
  margin-right: 70px;
}
.card-modo-item-ctrl .iconfont {
  position: absolute;
  display: inline-block;
  top: 0;
  right: 0;
  height: 75px;
  line-height: 75px;
  width: 70px;
  text-align: center;
  font-size: 48px;
}
.form-modo-btn {
  width: 600px;
  margin: 20px auto;
  line-height: 80px;
  border-radius: 40px;
  color: #fff;
  font-size: 28px;
  text-align: center;
  background-color: #ff5162;
}
.card-modo-item-ctrl-password {
  display: inline-block;
  line-height: 75px;
  width: 75px;
  text-align: right;
}
.card-modo-name {
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  line-height: 80px;
  margin: 0 20px;
  border-bottom: 4px solid #ff5162;
}
.card-jiao {
  display: none;
  height: 0;
  width: 0;
  position: absolute;
  border: 30px solid transparent;
  bottom: 0;
  right: 0;
  border-right-color: #ff5162;
  border-bottom-color: #ff5162;
  color: #fff;
}
.card-un {
  color: rgb(241, 155, 56);
}
.opacity-5 {
  opacity: 0.5;
}
.card-item-on .nums-crtl {
  display: flex;
}
.nums-crtl {
  position: absolute;
  bottom: 40px;
  right: 20px;
  display: flex;
  width: 210px;
  border: 1px solid #eee;
  line-height: 60px;
  border-radius: 30px;
  overflow: hidden;
  display: none;
}
.nums-crtl-reduce {
  width: 66px;
  text-align: center;
  border-right: 1px solid #dfdfdf;
  font-size: 32px;
}
.nums-crtl-add {
  width: 66px;
  text-align: center;
  border-left: 1px solid #dfdfdf;
  font-size: 36px;
}
.nums-crtl-form {
  flex: 10;
  text-align: center;
}

.tishi {
  background-color: #f1cf64;
  color: #fff;
  padding: 0 20px;
  line-height: 60px;
  text-align: center;
  font-size: 27px;
}
</style>
 