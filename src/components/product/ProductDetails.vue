<template>
  <div class="container pd" ref="productDetailCont"  @touchmove="sMove" @touchstart="sStart">
    <!-- <div class="pd-header"> -->
      <!-- <span :class="{'on': showDeta == 1}" @click="setShowType(1)">商品介绍</span> -->
      <!-- <span :class="{'on': showDeta == 2}" @click="setShowType(2)">规格参数</span> -->
    <!-- </div> -->
    <!-- 商品介绍开始 -->
    <div class="pd-cont rich-text" ref="productDetailIn" v-show="showDeta == 1" v-html="introduction">

    </div>
    <!-- 商品介绍结束 -->

    <div class="pd-load">暂无数据！</div>

    <!-- 规格参数开始 -->
    <!-- <div class="pd-cont" v-show="showDeta == 2">
      <div class="pd-table">
        <div v-if="parameterList && parameterList.length > 0" v-for="(item, index) in parameterList" :key="index">
          <div class="pd-tr pd-tr-name">
            {{item.name}}
          </div>
          <div class="pd-tr" v-for="(arr, j) in item.list" :key="j">
            <div class="pd-td">{{arr[1]}}</div>
            <div class="pd-td">{{arr[2]}}</div>
          </div>
        </div>
      </div>
    </div> -->
    <!-- 规格参数结束 -->
  </div>
</template>

<script>
export default {
  name: 'ProductDetails',
  props: ['info'],
  data () {
    return {
      showDeta: 1, // 当前展时窗口
      goods: {},

      // 旧的滚动距离
      startScroll: 0,
      touchStart: 0,
      touchCurrent: 0,
    }
  },
  created () {
    
  },
  methods: {
    // 移动开始
    sStart (e) {
      let vm = this;
      vm.startScroll = vm.$refs.productDetailCont.scrollTop;
      vm.touchStart = e.targetTouches[0].pageY;
    },
    // 移动结束
    sMove (e) {
      let vm = this;
      vm.touchCurrent = e.targetTouches[0].pageY;

      var touchesDiff = vm.touchCurrent - vm.touchStart;
      
      var slide = vm.$refs.productDetailCont;
      var onlyScrolling =
          (slide.scrollHeight > slide.offsetHeight) &&
          (
              (touchesDiff < 0 && vm.startScroll === 0) ||
              (touchesDiff > 0 && vm.startScroll === (slide.scrollHeight - slide.offsetHeight)) ||
              (vm.startScroll > 0 && vm.startScroll < (slide.scrollHeight - slide.offsetHeight))
          );

      // if(vm.$refs.productDetailCont.offsetHeight + vm.$refs.productDetailCont.scrollTop >= vm.$refs.productDetailIn.offsetHeight && touchesDiff > 0){
      //   e.stopPropagation();
      // }
      if (onlyScrolling) {
          e.stopPropagation();
      }
    },
    // 切换详情窗口
    setShowType (num){
      this.showDeta = num;
    },
  },
  computed: {
    // 参数列表
    // parameterList () {
    //   let parameterList = [];
    //   if(this.info){
    //     this.info.parameter.split('|').forEach((e, i) => {
    //       let obj = {
    //         name: '',
    //         list: []
    //       }
    //       e.split(',').forEach((e, i) => {
    //         if(i == 0){
    //           obj.name = e.split(':')[1]
    //         }else{
    //           if(e.split(':')[1]){
    //             obj.list.push(e.split(':'))
    //           }
    //         }
    //       })
    //       parameterList.push(obj)
    //     })
    //   }
    //   return parameterList;
    // },
    // 商品介绍
    introduction () {
      return this.info.introduction;
    },
  }
}
</script>

<style scoped>
.pd-load{
  position: absolute;
  width: 100%;
  line-height: 38px;
  padding: 20px;
  left: 0;
  top: 0;
  text-align: center;
  color: #ddd;
  font-size: 18px;
  z-index: -1;
}
#app .pd{
  background-color: #ffffff;
  position: relative;
  font-size: 22px;
  padding-top: 0px;
  overflow-x: hidden;
}
.pd-header{
  padding: 30px;
  line-height: 24px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #ffffff;
  font-size: 24px;
  color: #4d4d4d;
  display: flex;
  text-align: center;
  z-index: 10;
  box-sizing: border-box;
}
.pd-header span{
  flex: 3;
}
.pd-header span:nth-child(2){
  border-left: 1px solid #e0e0e0;
  border-right: 1px solid #e0e0e0;
}
.pd-cont{
  padding: 20px;
  box-sizing: border-box;
  min-height: 101%;
  /* background-color: #fff; */
}
.pd-table{
  border-top: 1px solid #e0e0e0;
}
.pd-tr{
  display: flex;
  line-height: 50px;
  color: #808080;
  border-bottom: 1px solid #e0e0e0;
}
.pd-tr .pd-td:first-child{
  width: 120px;
  box-sizing: border-box;
  padding: 0 10px;
  border-left: 1px solid #e0e0e0;
}
.pd-tr .pd-td:last-child{
  flex: 10;
  box-sizing: border-box;
  padding: 0 10px;
  border-left: 1px solid #e0e0e0;
  border-right: 1px solid #e0e0e0;
}
.pd-tr-name{
  color: #4d4d4d;
}
.pd-cont-name{
  line-height: 28px;
  font-size: 28px;
  padding-left: 10px;
  border-left: 4px solid #ff5162;
  margin-bottom: 20px;
}
.pd-p{
  font-size: 24px;
  color: #808080;
  line-height: 40px;
}
</style>

<style>
.pd-cont img{
  background-color: #fff;
}
</style>
