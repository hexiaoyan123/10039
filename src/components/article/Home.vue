<template>
  <div class="goods-list-out-cont produce-cont order-goods-list">
    <Vheader name="文章"></Vheader>
    <van-tabs v-model="dataStatu" >
      <van-tab v-for="(item, index) in classList" :key="item.articleCategoryId" :title="item.name">
        <List v-if="dataStatu == index" :dataStatu="item.articleCategoryId"></List>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import Vheader from '../HeaderV'
import List from './List'
export default {
  name: 'ArticleHome',
  components: {
    List,
    Vheader
  },
  data () {
    return {
      // 状态
      dataStatu: '',
      classList: [], // 分类
    }
  },
  created () {
    this.getClass()
  },
  methods: {
    // 活儿文章分类
    getClass () {
      let vm = this;
      let postData = {
        channelId: this.$init.channelId,
        parentId: '0'
      }
      this.$http.post('/panda-activity-api/v1/listArticleCategory', postData).then(function (response) {
        if(response.data.code == '1000'){
          if(response.data.result){
            vm.classList = response.data.result
          }
        }else{
          vm.$toast(response.data.msg);
        }
      })
      .catch(function (error) {
        vm.$toast('请求超时，请稍后再试！')
      });
    }
  },
  beforeRouteLeave (to, from, next) {
    if(to.path.indexOf('/article/detail/') >= 0 || to.path.indexOf('/article/detail/') >= 0 || to.meta.productInfo){
      from.meta.isBack = true;
      to.meta.isBack = false;
      window.sessionStorage.setItem('orderBackScroller1', document.querySelectorAll('.van-tabs__content')[0].scrollTop)
      window.sessionStorage.setItem('orderBackScroller2', document.querySelectorAll('.van-tabs__nav')[0].scrollLeft)
    }else{
      from.meta.isBack = false;
    }
    next()
  },
  beforeRouteEnter (to,from,next) {
    let scrollTop = sessionStorage.getItem('orderBackScroller1');
    let scrollLeft = sessionStorage.getItem('orderBackScroller2');
    next(vm => {
      if(vm && scrollTop && to.meta.isBack){
        document.querySelectorAll('.van-tabs__content')[0].scrollTo(0, scrollTop)
        document.querySelectorAll('.van-tabs__nav')[0].scrollTo(scrollLeft, 0)
      }
    })
  }
}
</script>

<style scoped>
.produce-cont{
  padding-top: 84px;
}
/* 商品列表 */
.goods-list-out-cont{
  /* margin-top: 20px; */
  box-sizing: border-box;
  height: 100%;
  overflow: auto;
  background-color: #FFF;
}
</style>
<style>
.order-goods-list .van-tabs{
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
}
.order-goods-list .van-tabs__content{
  height: 100%;
  box-sizing: border-box;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
.order-goods-list .van-tab__pane{
  height: auto;
}
</style>
