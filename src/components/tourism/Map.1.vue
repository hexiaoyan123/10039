<template>
<div class="container map">
  <Vheader name="找厕所"></Vheader>
  <el-amap vid="amap" :zoom="zoom" :center="center" :markers="markers" :plugin="plugin" :amap-manager="amapManager" class="map-toilet">
    <el-amap-marker v-for="(marker, index) in markers" :key="index" :position="marker.location" :template="marker.template" :vid="index"></el-amap-marker>
  </el-amap>
  <div id="panel"></div>
</div>
</template>

<script>
import Vheader from '../HeaderV'
import { AMapManager } from 'vue-amap'
let amapManager=new AMapManager();
export default {
  components: {
    Vheader
  },
  data () {
    var vm = this;
    return {
      zoom: 15, // 比例
      center: [116.332197,39.695021], // 初始化中心点
      userCenter: [], // 用户坐标
      loaded: false,
      markers: [], // 标记点
      plugin: [{
        pName: 'Geolocation', // 定位
        events: {
          init(o) {
            o.getCurrentPosition((status, result) => {
              if (result && result.position) {
                vm.userCenter = [result.position.lng, result.position.lat];
                vm.loaded = true;
                vm.$nextTick();
              }
            });
          }
        }
      }, {
        pName: 'Scale', // 比例尺
        events: {
          init(instance) {
            // console.log(instance);
          }
        }
      }, {
        pName: 'PlaceSearch',
        events: {
          init(map) {
            var placeSearch = new AMap.PlaceSearch({ 
              type: '风景名胜|公共设施',
              pageSize: 50,
              pageIndex: 1,
              showCover: false, // 显示半径
              renderStyle: 'default',
              // autoFitView: true
            });
            placeSearch.searchNearBy('厕所', vm.center, 1000, function(status, result) {
              if(result && result.poiList && result.poiList.pois){
                result.poiList.pois.forEach((e, i) => {
                  vm.markers.push({
                    location: [e.location.lng, e.location.lat],
                    info: e,
                    template: '<span class="wc"><i class="iconfont">&#xe62d;</i><em class="wc-jiao"></em></span>'
                  })
                });
              }
            });
          }
        }
      }],
      amapManager,
    }
  },
  created () {
    
  },
  methods: {
    
  }
}
</script>

<style>
.wc{
  position: relative;
  display: inline-block;
  border-radius: 50%;
  font-size: 24px;
  height: 38px;
  width: 38px;
  text-align: center;
  line-height: 38px;
  background-color: #fff;
  border: 1px solid red;
  color: red;
}
.wc-jiao{
  position: absolute;
  top: 36px;
  left: 50%;
  margin-left: -9px;
  border-top: 10px solid red;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
}
.wc .iconfont{
  font-size: 24px;
}
.amap-scalecontrol{
  left: 200px !important;
}
</style>