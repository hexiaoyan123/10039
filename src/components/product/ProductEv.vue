<template>
  <div class="product-cont">

    <div class="ev-list">
      <div class="ev-item" v-for="(item, index) in list" :key="index">
        <div class="ev-item-top">
          <figure class="ev-item-top-img">
            <img v-show="! item.imageUrl" src="../../assets/user.jpg" alt="">
            
            <img v-if="item.imageUrl && item.imageUrl.indexOf('http') < 0" :src="$init.imgIp + item.imageUrl" alt="">
            <img v-if="item.imageUrl && item.imageUrl.indexOf('http') >= 0" :src="item.imageUrl" alt="">
          </figure>
          <div class="ev-item-top-left">
            {{item.nickname}}
          </div>
          <div class="ev-item-top-right">
            {{item.createTime | dateFormat}}
          </div>
        </div>
        <div class="ev-item-info">
          <div class="ev-item-info-top">
            <div class="ev-item-info-top-left">
              <van-rate :size="12" v-model="item.score" disabled disabled-color="#cc0066" />
            </div>
            <div class="ev-item-info-top-right">
              <!-- {{item.score}} -->
            </div>
          </div>
          <div class="ev-item-info-text">
            {{item.content}}
          </div>
          <!-- <p>15寸</p>
          <p>购买日期: 2018-01-01</p> -->
        </div>
      </div>
    </div>
    <div v-show="list.length == 0" class="noData">暂无数据！</div>

  </div>
</template>

<script>
export default {
  name: 'ProductEv',
  components: {
    
  },
  data () {
    return {
      list: [],
      page: 1,
    }
  },
  created () {
    this.getReview(true)
  },
  methods: {
    // 获取评价信息
    getReview (clear) {
      let vm = this;
      if(clear){
        this.page = 1;
        this.list = []
      }else{
        this.page += 1;
      }
      let postData = {
        "productId": this.$route.params.id,
        pageNo: this.page,
        pageSize: 100
      }
      this.$http.post('/panda-shop-api/v1/pageReview', postData).then(function (response) {
        if(response.data.code == '1000'){
          if(response.data.result){
            vm.list = vm.list.concat(response.data.result) // 评价列表
          }
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
      return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm);
    }
  }
}
</script>

<style scoped>
.ev-item{
  background-color: #ffffff;
  border-bottom: 1px solid #eee;
  border-top: 1px solid #eee;
  margin-bottom: 20px;
  padding: 0 0 0 20px;
  font-size: 24px;
  color: #818181;
  line-height: 38px;
}
.ev-item-top{
  padding: 20px 20px 0 0;
  display: flex;
  line-height: 76px;
  /* border-bottom: 1px solid #eee; */
}
.ev-item-top-left{
  flex: 10;
  padding-left: 20px;
}
.ev-item-top-img{
  display: block;
  height: 76px;
  width: 76px;
  border-radius: 50%;
  overflow: hidden;
}
.ev-item-top-img img{
  display: block;
  height: 100%;
  width: 100%;
}
.ev-item-info{
  padding: 20px 20px 20px 0;
}
.ev-item-info-top{
  line-height: 38px;
  display: flex;
  font-size: 24px;
}
.ev-item-info-top-left{
  flex: 10;
}
.ev-item-info-text{
  line-height: 38px;
  font-size: 24px;
  color: #c1c1c1;
}
</style>
