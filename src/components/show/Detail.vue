 <template>
  <div class="container">
    <Vheader :name="film.goodsName"></Vheader>

    <div style="min-height: 101%;">

      <div class="nh-out">
        <div class="nh-bg" :style="{'background-image': 'url('+film.poster+')'}"></div>
        <div class="nh-cont">
          <figure class="fm-header-img">
            <img :src="film.poster" alt="">
          </figure>
          <div class="nh-cont-cont">
            <h2>{{film.goodsName}}</h2>
            <p>{{film.words}} </p>
          </div>
        </div>
      </div>

      <!-- 文字介绍开始 -->
      <div class="fm-text">
        <div class="fm-text-p">
          <em>场馆地址：</em>
          {{film.address}}
        </div>
        <div class="fm-text-p">
          <em>场馆名称：</em>
          {{film.venueName}}
        </div>
      </div>
      <div class="fm-text">
        <div class="fm-text-p fm-text-more">
          <em>详情：</em>
          <div class="html-cont" v-html="film.details"></div>
        </div>
      </div>
      <div class="fm-text">
        <div class="fm-text-p">
          <em>购买须知：</em>
          <div class="html-cont" v-html="film.notice"></div>
        </div>
      </div>
      <!-- 文字介绍结束 -->

      <!-- 商品选择框开始 -->
      <div class="show-modo" v-show="data.modo" @click="data.modo = false">
        <div class="show-modo-in" style="max-height: 80%;" @click.stop="1">
          <dl>
            <dt>选择排期</dt>
            <dd>
              <span class="check-item" v-for="(item, index) in planList" :key="index" @click="checkPlan(item)" :class="{'check-item-on': check.plan.planId == item.planId}">{{item.planName}}</span>
            </dd>
          </dl>
          <dl>
            <dt>选择票档</dt>
            <dd>
              <span class="check-item" v-for="(item, index) in levelArr" :key="index" @click="checkLevel(item)" :class="{'check-item-on': check.level.levelId == item.levelId}">{{item.levelAlias}}</span>
            </dd>
          </dl>
          <dl>
            <dt>选择组合</dt>
            <dd>
              <span class="check-item" v-for="(item, index) in priceArr" :key="index" @click="checkPrice(item)" :class="{'check-item-on': check.price.count == item.count}">{{item.count}}组</span>
            </dd>
          </dl>
          <dl>
            <dt>选择配送方式（距离演出3天内无法发快递）</dt>
            <dd>
              <span v-show="deliverArr.length == 0">无</span>
              <span class="check-item" @click="checkDeliver('1')" :class="{'check-item-on': check.deliver == '1'}" v-show="deliverArr.indexOf('1') >= 0 && nowTime < limitTime">快递</span>
              <span class="check-item" @click="checkDeliver('2')" :class="{'check-item-on': check.deliver == '2'}" v-show="deliverArr.indexOf('2') >= 0">上门自取</span>
              <span class="check-item" @click="checkDeliver('3')" :class="{'check-item-on': check.deliver == '3'}" v-show="deliverArr.indexOf('3') >= 0">现场自取</span>
            </dd>
          </dl>
        </div>

        <!-- 立即购买开始 -->
        <div class="show-new-footer">
          <div class="snf-left">
            <em>
              <small>¥</small>
              {{check.price.price * 1.4 | priceFormat}} 
            </em>
            <span v-show="check.deliver == '1'">
              + 配送：¥{{check.price.express | priceFormat}}
            </span>
          </div>
          <div class="snf-right" @click="createOrder">
            立即购买
          </div>
        </div>
        <!-- 立即购买结束 -->
      </div>
      <!-- 商品选择框结束 -->
    </div>

    
    <!-- 商品按钮开始 -->
    <div class="show-foter show-modo-btn"  @click="data.modo = true">
      立即购买
    </div>
    <!-- 商品按钮结束 -->
    
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
      film: {}, // 影片信息
      planList: [], // 价格筛选 -- 日期
      levelArr: [], // 价格筛选 -- 水平
      priceArr: [], // 价格筛选 -- 金额
      deliverArr: [], // 价格筛选 -- 配送方式

      // 选中的内容
      check: {
        plan: {},
        level: {},
        price: {},
        deliver: ''
      },

      
      limitTime: '', // 三天前时间戳
      nowTime: '', // 当前时间戳

      info: {
        showTimes: {
          showTimes: []
        }
      },
      data: {
        modo: false, // 显示选择框
        onDay: {}, // 选中的日期
        onManey: {}, // 选中的价格
        nums: 1, // 票数量
      }
    }
  },
  created () {
    this.getData();
  },
  methods: {
    // 生成订单
    createOrder () {
      if(this.check.deliver == '' || this.check.deliver == undefined){
        this.$toast('请选择配送方式')
        return
      }
      var data = {
        costPrice: this.check.price.price, // 成本价
        price: this.check.price.price * 1.4, // 展示价格
        quantity: this.check.price.count,
        freight: this.check.deliver == '1' ?  this.check.price.express -0 : 0,
        deliverType: this.check.deliver,
        goodsId: this.$route.params.id,
        goodsName: this.film.goodsName,
        goodsPoster: this.film.poster,
        venueId: this.film.venueId,
        venueName: this.film.venueName,
        venueAddress: this.film.address,
        planId: this.check.plan.planId,
        planName: this.check.plan.planName,
        planStartTime: this.check.plan.startTime,
        priceId: this.check.price.priceId
      }
      this.$cookies.set('showOrder', JSON.stringify(data));
      this.$router.push('/show/orderAction');
    },
    // 选中时间
    checkPlan (obj) {
      if(obj.planId != this.check.plan.planId){
        this.check.plan = obj;
        this.limitTime = new Date((this.check.plan.startTime - 3*24*60*60)*1000).getTime() / 1000;
        this.levelArr = this.check.plan.levelArr;
        this.check.level = this.levelArr[0];
        this.priceArr = this.check.level.priceArr;
        this.check.price = this.priceArr[0];
        if(this.check.price.deliverType){
          this.deliverArr = this.check.price.deliverType.split(',');
          this.check.deliver = this.deliverArr[0];
        }else{
          this.deliverArr = [];
          this.check.deliver = '';
        }
        if(this.nowTime > this.limitTime && this.check.deliver == '1'){
          this.check.deliver = this.deliverArr[1];
        }
      }
    },
    // 选中水准
    checkLevel (obj) {
      if(this.check.level.levelId != obj.levelId){
        this.check.level = obj;
        this.priceArr = this.check.level.priceArr;
        this.check.price = this.priceArr[0];
        if(this.check.price.deliverType){
          this.deliverArr = this.check.price.deliverType.split(',');
          this.check.deliver = this.deliverArr[0];
        }else{
          this.deliverArr = [];
          this.check.deliver = '';
        }
        if(this.nowTime > this.limitTime && this.check.deliver == '1'){
          this.check.deliver = this.deliverArr[1];
        }
      }
    },
    // 选中价格
    checkPrice (obj) {
      this.check.price = obj;
      if(this.check.price.deliverType){
        this.deliverArr = this.check.price.deliverType.split(',');
        this.check.deliver = this.deliverArr[0];
      }else{
        this.deliverArr = [];
        this.check.deliver = '';
      }
      if(this.nowTime > this.limitTime && this.check.deliver == '1'){
        this.check.deliver = this.deliverArr[1];
      }
    },
    // 选中配送方式
    checkDeliver (str) {
      this.check.deliver = str;
    },
    // 获取影院详情
    getData () {
      let vm = this;
      this.$http.get('/panda-ticket-api/v1/getGoods/'+this.$route.params.id).then(function (response) {
        if(response.data.code == '1000'){
          if(response.data.result){
            vm.film = response.data.result;
            let planList = [];
            response.data.result.planList.forEach((e, i) => {
              let State = true;
              let obj1 = e;
              if(obj1.levelArr && obj1.levelArr.length > 0){
                let levelArr = []
                obj1.levelArr.forEach((p, j) => {
                  if(p.priceArr && p.priceArr.length > 0){
                    levelArr.push(p)
                  }
                })
                obj1.levelArr = levelArr;
              }else{
                State = false;
              }
             
              if(State){
                planList.push(obj1);
              }
            })

            // vm.planList = response.data.result.planList;
            vm.planList = planList;
            vm.nowTime = new Date(new Date().setHours(0, 0, 0, 0)) / 1000;
            vm.checkPlan(vm.planList[0]);
            
          }else{
            vm.film = {};
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
  },
  filters: {
    // 金钱格式化
    priceFormat (value) {
      if(value){
        return ((value-0)/ 100).toFixed(2)
      }else if(value === 0){
        return '0'
      }else{
        return ''
      }
    },
    // 时间格式化
    dateFormat (shijianchuo) {
      function add0(m){return m<10?'0'+m:m }
      var time = new Date(shijianchuo *1000);
      var y = time.getFullYear();
      var m = time.getMonth()+1;
      var d = time.getDate();
      var h = time.getHours();
      var mm = time.getMinutes();
      var s = time.getSeconds();
      return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
    }
  }
}
</script>

<style scoped>
.container{
  background-color: #f8f8f8;
  padding-top: 84px;
  padding-bottom: 100px;
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

/* 影片头 */
.fm-header{
  position: relative;
  margin-bottom: 20px;
}
.fm-header-top{
  height: 174px;
  box-sizing: border-box;
  padding-left: 240px;
  padding-right: 20px;
  background: #ff366c;
  background: -webkit-gradient(linear,left top,right bottom,from(#ff7380),to(#ff366c));
  background: linear-gradient(to bottom right,#ff7380,#ff366c);
  color: #fff;
  padding-top: 10px;
  
}
.fm-header-top h2{
  color: #fff;
  font-size: 28px;
  line-height: 60px;
  display: flex;
}
.fm-header-top h2 span{
  flex: 10;
  overflow: hidden;
}
.fm-header-top p{
  font-size: 24px;
  line-height: 50px;
}
.fm-header-bottom{
  padding-left: 240px;
  font-size: 0;
  background-color: #fff;
  padding-top: 24px;
  height: 150px;
  box-sizing: border-box;
  border-bottom: 1px solid #eee;
}
.fm-header-lable{
  display: inline-block;
  line-height: 46px;
  padding: 0 38px;
  border: 1px solid #fff;
  border-radius: 4px;
  color: #eee;
  font-size: 22px;
  margin-right: 10px;
  margin-bottom: 10px;
}
.fm-header-img{
  display: block;
  position: absolute;
  height: 270px;
  width: 190px;
  border: 1px solid #eee;
  border-radius: 8px;
  z-index: 10;
  top: 28px;
  left: 26px;
  overflow: hidden;
}
.fm-header-img img{
  display: block;
  height: 100%;
  width: 100%;
}

/* 文字介绍 */
.fm-text{
  background-color: #fff;
  border-top: 1px solid #eee;
  padding: 24px;
  /* border-bottom: 1px solid #eee; */
}
.fm-text-p{
  line-height: 38px;
  color: #c1c1c1;
  font-size: 24px;
}
.fm-text-p em{
  color: #4d4d4d;
}
.fm-text-more{
  /* margin-top: 40px; */
}

/* 剧照开始 */
.fm-img-name{
  display: flex;
  line-height: 60px;
  font-size: 24px;
  color: #4d4d4d;
  padding: 0 20px;
  padding-top: 10px;
  background-color: #fff;
}
.fm-img-name-left{
  flex: 10;
}
.fm-img-name-right{
  height: 60px;
}
.fm-img-out{
  width: 100%;
  box-sizing: border-box;
  padding: 0 20px 20px 20px;
  background-color: #fff;
  display: -webkit-box;
  /* overflow-x: scroll;
  -webkit-overflow-scrolling:touch; */
  overflow-y: hidden;
  overflow-x: scroll;
  -webkit-overflow-scrolling: touch;
  -webkit-box-flex: 1;
}
.fm-img-in{
  padding: 0 0 20px 20px;
  font-size: 0;
  white-space:nowrap; 
  min-width: 101%;
  /* display: -webkit-box;
  overflow-x: scroll;
  -webkit-overflow-scrolling:touch; */
}
.fm-img-item{
  /* display: inline-block; */
  display: block;
  height: 160px;
  width: 160px;
  overflow: hidden;
  margin-right: 20px;
}
.fm-img-item img{
  display: block;
  height: 100%;
}

.updata-cont{
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
}
.updata-right{
  flex: 10;
  text-align: center;
  line-height: 100px;
  color: #fff;
  background-color: #ff5162;
  font-size: 28px;
}

/* 背景 */
.nh-out{
  position: relative;
  border-bottom: 1px solid #ddd;
}
.nh-bg{
  height: 256px;
  background-color: #fff;
  background-size: 100% auto;
  /* background-image: url(http://res.fcloud.mopon.cn/access/201808/27121889268654923.jpg); */
  filter: blur(8px) brightness(50%);
}
.nh-cont{
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
  box-sizing: border-box;
  padding-left: 210px;
}
.nh-cont-cont{
  color: #fff;
  /* padding-top: 16px; */
  font-size: 24px;
  line-height: 44px;
}
.nh-cont-cont h2{
  padding-top: 40px;
  color: #fff;
  font-size: 28px;
  line-height: 38px;
  font-weight: 700;
  margin-bottom: 10px;
}
.fm-header-img{
  display: block;
  position: absolute;
  height: 180px;
  width: 135px;
  /* border: 1px solid #eee; */
  /* border-radius: 8px; */
  z-index: 10;
  top: 28px;
  left: 26px;
  overflow: hidden;
}

.show-foter{
  position: fixed;
  width: 100%;
  line-height: 80px;
  color: #fff;
  text-align: center;
  left: 0;
  bottom: 0;
  background-color: #ff5162;
  font-size: 24px;
}

/* 模态框 */
.show-modo{
  position: fixed;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  z-index: 10;
}
.show-modo-in{
  max-block-size: 500px;
  overflow-x: hidden;
  overflow-y: auto;
  position: fixed;
  width: 100%;
  left: 0;
  bottom: 80px;
  background-color: rgba(0, 0, 0, 0.8);
  padding: 20px;
  color: #fff;
  font-size: 24px;
  height: 60%;
}
.show-modo-in dd{
  padding-top: 20px;
}
.check-item{
  display: inline-block;
  line-height: 46px;
  border: 1px solid #fff;
  border-radius: 23px;
  text-align: center;
  padding: 0 30px;
  margin-right: 20px;
  margin-bottom: 20px;
}
.check-item-on{
  background-color: #ff5162
}

/* 选择数量 */
.show-modo-nums{
  width: 240px;
  line-height: 46px;
  display: flex;
  border: 1px solid #fff;
  border-radius: 23px;
  overflow: hidden;
}
.show-modo-nums-form{
  flex: 10;
  text-align: center;
}
.show-modo-nums-left,
.show-modo-nums-right{
  width: 70px;
  background-color: #ff5162;
  text-align: center;
  font-size: 32px;
}

/* 新立即购买 */
.show-new-footer{
  position: fixed;
  width: 100%;
  left: 0;
  bottom: 0;
  line-height: 80px;
  font-size: 24px;
  background-color: #fff;
  display: flex;
}
.snf-left{
  flex: 10;
  padding: 0 10px;
  font-size: 28px;
  box-sizing: border-box;
  height: 80px;
}
.snf-left em{
  color: #ff5162;
  font-weight: 700;
}
.snf-left span{
  font-size: 24px;
}
.snf-right{
  width: 260px;
  text-align: center;
  color: #fff;
  background-color: #ff5162;
  font-size: 28px;
  font-weight: 700;
}
.show-modo-btn{
  font-size: 28px;
  font-weight: 700;
}
</style>

<style >
.html-cont img{
  display: block;
  max-width: 100%;
}
.html-cont{
  font-size: 24px;
  line-height: 38px;
}
</style>