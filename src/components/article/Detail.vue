<template>
<div class="container area">
  <Vheader :name="info.name"></Vheader>
  <div style="min-height: 101%;">
    <figure class="img">
      <img :src="$init.imgIp + info.imageUrl" />
    </figure>
    <div class="strategy-name">{{info.name}}</div>
    <div class="strategy-info">
      <div class="strategy-info-left">浏览人数: <em>{{info.browseNum}}</em></div>
      <div class="strategy-info-right" v-show="info.author">
        作者: <em>{{info.author}}</em>
      </div>
    </div>
    <div class="taps clearfix" v-show="taps.length > 0">
      <div class="tap" v-for="(item, index) in taps" :key="index">{{item}}</div>
    </div>
    <div class="strategy-cont rich-text" v-html="info.content"></div>
  </div>
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
      imgIp: this.$init.imgIp,
      id: this.$route.params.id,
      info: {}, // 景点介绍
      taps: [], // 标签列表
    }
  },
  created () {
    this.getStrategy()
  },
  methods: {
    // 获取文章
    getStrategy () {
      let vm = this;
      this.$http.get('/panda-activity-api/v1/getArticle/'+ this.id).then(function (response) {
        if(response.data.code == '1000'){
          if(response.data.result){
            vm.info = response.data.result;
            // 标签处理
            if(response.data.result.label){
              vm.taps = response.data.result.label.split(',');
            }
          }
        }else{
          vm.$toast(response.data.msg);
        }
      })
      .catch(function (error) {
        vm.$toast('请求超时，请稍后再试！')
      });
    },
  },
  watch: {
    '$route' (to, from) {
      this.getStrategy()
    }
  }
}
</script>

<style scoped>
.img{
  margin-bottom: 6px;
}
.img img{
  display: block;
  width: 100%;
}
.container{
  padding-top: 84px;
}
.strategy-name{
  font-size: 28px;
  padding: 0 30px;
  line-height: 60px;
}
.strategy-info{
  padding: 0 30px;
  display: flex;
  font-size: 24px;
  line-height: 38px;
  color: #c1c1c1;
}
.strategy-info-left{
  flex: 10;
}
.strategy-info em{
  color: #ff5162;
}

.strategy-cont{
  padding: 0px 30px 30px 30px;
  font-size: 24px;
  line-height: 38px;
}

/* 标签列表 */
.taps{
  padding: 10px 30px 10px 30px;
}
.taps .tap{
  float: left;
  font-size: 20px;
  color: #c1c1c1;
  line-height: 38px;
  padding: 0 20px;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-right: 20px;
  margin-bottom: 10px;
}
</style>