<template>
<div class="container area">
  <div class="top-img">
    <figure class="img">
      <img src="//www.apple.com/v/home/dz/images/heroes/iphone-xs/iphone_xs_0afef_mediumtall.jpg" alt="">
    </figure>
  </div>
  <div class="info">
    <div class="info-name">
      <div class="info-name-left">云南民族村</div>
      <div class="info-name-right">4A国家级旅游景区</div>
    </div>
    <div class="info-deta">ajdsfiasjfdiasdfjasidfjasdfjaisdfjasidjfaisdfji</div>
  </div>

  <div class="card-list-name">
    <div class="info-name">
      <div class="info-name-left">游记推荐</div>
      <div class="info-name-right"></div>
    </div>
  </div>
  <div class="card-list clearfix">
    <div class="card-item2" v-for="(item, index) in 4" :key="index">
      <div class="card-item-img">
        <figure class="img">
          <img src="//www.apple.com/v/home/dz/images/heroes/iphone-xs/iphone_xs_0afef_mediumtall.jpg" alt="">
        </figure>
      </div>
      <div class="card-item2-name">
        <div class="card-item2-name-left">
          名字
        </div>
        <div class="card-item2-name-right">
          作者
        </div>
      </div>
    </div>
  </div>




</div>
</template>

<script>
export default {
  components: {
    
  },
  data () {
    return {
      
    }
  },
  created () {

  },
  methods: {
    
  }
}
</script>

<style scoped>
.top-img .img img{
  display: block;
  width: 100%;
}
.info{
  padding: 30px; 
}
.info-name{
  display: flex;
  padding: 10px 0;
}
.info-name-left{
  font-size: 28px;
  line-height: 30px;
  border-left: 4px solid #ff5162;
  flex: 10;
  padding-left: 12px;
}
.info-name-right{
  font-size: 22px;
  color: #ff9300;
}
.info-deta{
  font-size: 20px;
  color: #c1c1c1;
  line-height: 38px;
}

.card-list-name{
  padding: 10px 30px;
  border-top: 6px solid #eee;
}
.card-list{
  padding: 0 15px;
}
.card-item2{
  width: 100%;
  box-sizing: border-box;
  padding: 0 15px;
  padding-bottom: 30px;
}
.card-item{
  width: 50%;
  float: left;
  box-sizing: border-box;
  padding: 0 15px;
  padding-bottom: 30px;
}
.card-item-img .img{
  height: 60%;
  width: 100%;
  overflow:  hidden;
  border-radius: 5px;
  margin: 0 auto;
}
.card-item-img .img img{
  display: block;
  width: 100%;
  height: 100%;
}
.card-item-name{
  width: 100%;
  height: 38px;
  line-height: 38px;
}
.card-item2-name{
  width: 100%;
  height: 38px;
  line-height: 38px;
  display: flex;
}
.card-item2-name-left{
  flex: 10;
}
</style>