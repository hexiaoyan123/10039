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
      center: [117.165494,40.232898], // 初始化中心点
      lng: 0,
      lat: 0,
      // center: [], // 初始化中心点
      userCenter: [], // 用户坐标
      loaded: false,
      markers: [], // 标记点
      plugin: [{
        enableHighAccuracy: true,//是否使用高精度定位，默认:true
        timeout: 100,          //超过10秒后停止定位，默认：无穷大
        maximumAge: 0,           //定位结果缓存0毫秒，默认：0
        convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
        showButton: true,        //显示定位按钮，默认：true
        buttonPosition: 'RB',    //定位按钮停靠位置，默认：'LB'，左下角
        showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
        showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
        panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
        zoomToAccuracy:true,//定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：f
        extensions:'all',
        pName: 'Geolocation', // 定位
        events: {
          init(o) {
            o.getCurrentPosition((status, result) => {
              if (result && result.position) {
                vm.userCenter = [result.position.lng, result.position.lat];
                vm.center = [result.position.lng, result.position.lat];
                vm.loaded = true;

                // 设置定位
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
            // setTimeout(() => {
            //   var placeSearch = new AMap.PlaceSearch({ 
            //     type: '风景名胜|公共设施',
            //     pageSize: 50,
            //     pageIndex: 1,
            //     showCover: false, // 显示半径
            //     renderStyle: 'default',
            //     // autoFitView: true
            //   });
            //   placeSearch.searchNearBy('厕所', vm.center, 1000, function(status, result) {
            //     if(result && result.poiList && result.poiList.pois){
            //       result.poiList.pois.forEach((e, i) => {
            //         vm.markers.push({
            //           location: [e.location.lng, e.location.lat],
            //           info: e,
            //           template: '<span class="wc"><i class="iconfont">&#xe62d;</i><em class="wc-jiao"></em></span>'
            //         })
            //       });
            //     }
            //   });
            //   alert(vm.center[0])
            //   alert(vm.center[1])
            // }, 6*1000)
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