<template>
  <div class="container group">
    <div class="quality">
      <!-- <h2>热销单品</h2> -->
      <div class="quality-cont">
        <van-row gutter="6">
          <van-col span="8" v-for="(item, index) in calssList" :key="index">
            <div class="quality-item" @click="goClass(item.id)">
              <figure class="img" v-if="item.imageUrl">
                <img :src="item.imageUrl | imgSpecilize" alt="">
              </figure>
              <p class="unoverflow">{{item.name}}</p>
            </div>
          </van-col>
        </van-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchClassItem',
  props: ['category'],
  data () {
    return {
      calssList: [], // 分类列表
      // 渠道ID
      channel: this.$init.channelId,
    }
  },
  created () {
    // if(this.$route.query.channel){
    //   this.channel = this.$route.query.channel
    // }
    this.getListProductCategory();
  },
  methods: {
    // 获取商品分类
    getListProductCategory () {
      let vm = this;
      this.$http.get('/panda-shop-api/v1/listProductCategory/'+this.category, this.channel).then(function (response) {
        if(response.data.code == '1000'){
          if(response.data.result){
            vm.calssList = response.data.result;
          }
        }else{
          vm.$toast(response.data.msg)
        }
      })
      .catch(function (error) {
        vm.$toast('请求超时，请稍后再试！')
      });
    },
    // 查看商品筛选
    goClass (id) {
      this.$router.replace('/product/searchScreen/'+this.category + '?check=' + id)
    },
  }
}
</script>

<style scoped>
.group{
  padding: 24px;
}
.ad img{
  display: block;
  width: 100%;
}

.quality{
  padding: 0;
  margin-bottom: 20px;
}
.quality h2{
  height: 28px;
  line-height: 28px;
  font-size: 28px;
  border-left: 5px solid #ff5162;
  padding-left: 8px;
  color: #4d4d4d;
  margin-bottom: 26px;
}
.quality-cont{
  background-color: #ffffff;
  padding: 0 10px;
}
.quality-item{
  text-align: center;
  font-size: 24px;
  line-height: 38px;
  margin: 10px 0;
}
.quality-item .img{
  display: block;
  width: 100%;
  height: 160px;
  border-radius: 5px;
  overflow: hidden;
}
.quality-item .img img{
  display: block;
  width: 100%;
}
</style>
