<template>
  <div class="container" ref="backScroller">
    <!-- 筛选开始 -->
    <div class="nca-select">
      <div class="nca-select-item city" @click="city.show = true">
        <em>{{city.city.name}}</em>
        <i class="iconfont">
          <img src="../../assets/down.png" width="100%" />
        </i>
      </div>
      <div class="nca-select-item" @click="search.show = true">
        <div class="find_cinema">
          <i class="iconfont">
            <img src="../../assets/movie/fangjiajing.png" width="100%" />
          </i>找影院
        </div>
      </div>
    </div>
    <!-- 筛选结束 -->

    <!-- 影院列表开始 -->
    <div class="ca-list">
      <div class="cs-item" v-for="val in cinemaList" :key="val.id" @click="clickCinema(val)">
        <h4>
          <div class="cs-item-name-left">
            <!-- <span class="cs-item-dui">兑</span> -->
            <span class="cs-item-zuo">座</span>
          </div>
          <div class="cs-item-name-right">{{val.cinemaName}}</div>
        </h4>
        <p>{{val.areaName}}{{val.cinemaAddress}}</p>
        <!-- <div class="cs-dist">0.3km</div> -->
        <div class="cs-dist" v-if="val.distance">{{val.distance | distanceTo}}km</div>
      </div>

      <!-- <h3 v-show="cinemaList.length == 0" class="noData">暂无数据！</h3> -->
      <h3 v-show="cinemaList.length > 0" class="noData">
        <i class="keguan">
          <img src="../../assets/keguan.png" width="100%" />
        </i>
        <span>客官，没有更多了！</span>
      </h3>
    </div>
    <!-- 影院列表结束 -->

    <!-- 城市选择开始 -->
    <van-popup v-model="city.show" position="right" :overlay="false">
      <movie-city :v-city="city.city" @closeCity="closeCityModo" @clickCity="getCity"></movie-city>
    </van-popup>
    <!-- 城市选择结束 -->

    <!-- 搜索筛选框开始 -->
    <div class="search-modo" v-if="search.show">
      <cinema-search @closeSearch="closeSMode" :v-city="city.city"></cinema-search>
    </div>
    <!-- 搜索筛选框结束 -->
    <!-- 定位开始 -->
    <div v-if="! $store.state.position.lng">
      <v-map></v-map>
    </div>
    <!-- 定位结束 -->

    <go-top vlass="container"></go-top>
  </div>
</template>

<script>
import MovieCity from "./City";
import MovieCinemaSearch from "./CinemaSearch";
import GoTop from "../GoTop";
import vMap from "../Map";
export default {
  name: "CityCinema",
  components: {
    "movie-city": MovieCity,
    "cinema-search": MovieCinemaSearch,
    "go-top": GoTop,
    "v-map": vMap
  },
  data() {
    let self = this;
    return {
      // 城市
      city: {
        show: false, //城市弹窗
        city: {} // 选中的地址
      },
      // 搜索
      search: {
        show: false,
        val: ""
      },

      // 影院
      cinemaList: []
      //坐标
    };
  },
  created() {
    // 城市处理
    if (this.$init.clickCity) {
      this.getCity(this.$init.clickCity);
    } else if (window.localStorage.getItem("clickCity")) {
      let data = JSON.parse(window.localStorage.getItem("clickCity"));
      this.getCity(data);
    } else {
      let city = {
        id: "110100",
        parentId: "110000",
        grade: "2",
        name: "北京",
        abbr: "B"
      };
      window.localStorage.setItem("clickCity", JSON.stringify(city));
      this.getCity(city);
      //this.city.show = true;
    }
    //this.listCityCinema();

    this.$store.commit("ctrlLoader", true);
  },
  methods: {
    // 返回上一页
    goBack() {
      this.$router.back(-1);
    },

    // 根据城市获取影院
    listCityCinema() {
      let vm = this;
      // let latitude = vm.$store.state.position.lat
      //   ? vm.$store.state.position.lat
      //   : vm.$store.state.position.lat
      //   ? window.localStorage.getItem("positionslat")
      //   : "";
      // let longitude = this.$store.state.position.lng
      //   ? vm.$store.state.position.lng
      //   : this.$store.state.position.lng
      //   ? window.localStorage.getItem("positionslng")
      //   : "";
      let latitude = window.localStorage.getItem("positionslat")
        ? window.localStorage.getItem("positionslat")
        : vm.$store.state.position.lat
        ? window.localStorage.getItem("positionslat")
        : "";
      let longitude = window.localStorage.getItem("positionslng")
        ? window.localStorage.getItem("positionslng")
        : this.$store.state.position.lng
        ? window.localStorage.getItem("positionslng")
        : "";
      //alert(longitude);
      // let longitude = "116.38";
      // let latitude = "39.90";
      vm.$http
        .get(
          "/panda-cinema-api/v2/listCityCinema/" +
            vm.city.city.id +
            "?longitude=" +
            longitude +
            "&latitude=" +
            latitude
        )
        .then(function(response) {
          if ("1000" == response.data.code && response.data.result) {
            // if (response.data.result) {
            vm.cinemaList = response.data.result;
            // }
            vm.$store.commit("ctrlLoader", false);
          } else {
            vm.$toast(response.data.msg);
          }
        })
        .catch(function(error) {
          vm.$toast("请求超时，请稍后再试！");
        });
    },

    // 获取选中的地址1
    getCity(data) {
      this.city.city = data;
      this.$init.clickCity = data;
      window.localStorage.setItem("clickCity", JSON.stringify(data));
      this.city.show = false;
      this.listCityCinema();
    },

    // 点击影院
    clickCinema(obj) {
      window.localStorage.setItem("clickCinema", JSON.stringify(obj));
      this.$router.push({
        path: "/movie/field",
        query: {
          cinema: obj
        }
      });
    },

    // 关闭城市选择
    closeCityModo(data) {
      this.city.show = false;
    },

    // 关闭搜索框
    closeSMode(data) {
      this.search.show = false;
    }
  },
  filters: {
    // 距离计算1
    distanceTo(vlaue) {
      if (vlaue) {
        return (vlaue / 1000).toFixed(1);
      } else {
        return "";
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    let scrollTop = localStorage.getItem("movieBackScroller");
    if (to.meta.isBack && scrollTop) {
      next(vm => {
        if (vm && vm.$refs.backScroller) {
          vm.$refs.backScroller.scrollTo(0, scrollTop);
        }
      });
    } else {
      next();
    }
  },
  beforeRouteLeave(to, from, next) {
    to.meta.isBack = false;
    from.meta.isBack = true;
    window.localStorage.setItem(
      "movieBackScroller",
      this.$refs.backScroller.scrollTop
    );
    next();
  }
};
</script>

<style scoped>
.container {
  background-color: #fff;
  /* padding-top: 155px; */
  padding-bottom: 120px;
}

.top img {
  display: block;
  width: 100%;
}

header {
  height: 85px;
  line-height: 85px;
  /* position: absolute; */
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  background-color: #c06;
  color: #fff;
  text-align: center;
  display: flex;
  font-size: 28px;
  z-index: 101;
}

.header-back {
  width: 70px;
  text-align: center;
}

.header-cont {
  flex: 10;
}

.header-more {
  width: 75px;
  text-align: center;
}

header .iconfont {
  font-size: 28px;
}

.ca-select {
  position: fixed;
  top: 85px;
  width: 100%;
  background-color: #fff;
  box-sizing: border-box;
  padding: 0 20px;
  font-size: 24px;
  color: #808080;
  display: flex;
  line-height: 70px;
  border-bottom: 1px solid #e6e6e6;
  z-index: 101;
}

.ca-select .iconfont {
  font-size: 24px;
  color: #808080;
}

.ca-select-left {
  flex: 2;
}

.ca-select-center {
  text-align: center;
  flex: 4;
  font-size: 28px;
  color: #4d4d4d;
}

.ca-select-right {
  text-align: right;
  flex: 2;
  display: flex;
  height: 68px;
}

.cs-item:first-child {
  border-top: 1px solid #e6e6e6;
}

.cs-item {
  padding: 10px 24px;
  border-bottom: 1px solid #e6e6e6;
  position: relative;
}

.cs-dist {
  position: absolute;
  top: 40px;
  right: 20px;
  font-size: 24px;
  color: #bababa;
}

.cs-item h4 {
  font-size: 28px;
  color: #4d4d4d;
  line-height: 50px;
  /* padding-left: 40px; */
  position: relative;
  display: flex;
}

.cs-item-name-left {
  line-height: 30px;
  padding-top: 7px;
}

.cs-item-name-right {
  flex: 10;
}

.cs-item p {
  font-size: 22px;
  color: #c1c1c1;
  line-height: 38px;
  width: calc(100% - 100px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cs-item-dui {
  display: inline-block;
  height: 30px;
  width: 30px;
  font-size: 22px;
  line-height: 30px;
  text-align: center;
  border-radius: 4px;
  color: #fff;
  background-color: #ff9900;
  /* position: absolute; */
  top: 9px;
  left: 0;
  margin-right: 10px;
}

.cs-item-zuo {
  display: inline-block;
  height: 30px;
  width: 30px;
  font-size: 22px;
  line-height: 30px;
  text-align: center;
  border-radius: 4px;
  color: #fff;
  background-color: #ff4f65;
  /* position: absolute; */
  top: 9px;
  left: 0;
  margin-right: 10px;
}

.city-popup {
  height: 100%;
  width: 100%;
  background-color: #fff;
}
/* 地区筛选 */

.class-window {
  position: absolute;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 98px;
  line-height: 76px;
  padding-top: 156px;
}

.class-window-btn {
  width: 100%;
  box-sizing: border-box;
  line-height: 80px;
  border-top: 1px solid #d9d9d9;
  font-size: 28px;
  text-align: center;
  background-color: #ffffff;
  display: flex;
}

.class-window-btn-left {
  flex: 5;
}

.class-window-btn-right {
  flex: 5;
  color: #ffffff;
  background-color: #cc0066;
}

.class-window-list {
  padding: 20px;
  background-color: #ffffff;
  font-size: 24px;
  line-height: 80px;
  max-height: 530px;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.class-window-list-item {
  border-bottom: 1px solid #eeeeee;
  text-align: center;
}

.class-window-list-item:last {
  border: none;
}
/* 搜索框 */

.search-modo {
  position: fixed;
  height: 100%;
  width: 100%;
  z-index: 102;
  background-color: #fff;
  top: 0;
  left: 0;
  box-sizing: border-box;
}

.search-modo-left {
  flex: 10;
}

.search-modo-left input {
  display: block;
  width: 100%;
  border: 1px solid #e6e6e6;
  line-height: 47px;
  border-radius: 4px;
  box-sizing: border-box;
  padding: 0 6px;
}

.search-modo-right {
}

.search-modo-btn {
  display: inline-block;
  line-height: 50px;
  background-color: #c06;
  color: #fff;
  padding: 0 30px;
  border-radius: 4px;
  margin-left: 20px;
}

.ca-select-right-lable {
  display: inline-block;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ca-select-right-1 {
  flex: 9;
}

.ca-select-right-2 {
  width: 50px;
  height: 60px;
  overflow: hidden;
  text-align: right;
}

.iconfont {
  width: 30px;
  height: 20px;
  display: inline-block;
}

.nca-select-item:last-child {
  width: calc(100% - 100px);
  margin-right: 0px;
}

.nca-select-item.city em {
  display: inline-block;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.nca-select-item.city .iconfont {
  position: absolute;
  top: 18px;
  line-height: 0px;
  right: -25px;
}
/* 新搜索 */

.nca-select {
  display: flex;
  padding: 20px 20px;
  line-height: 80px;
}
.nca-select-item:first-child {
  line-height: 0px;
}
.nca-select-item {
  margin-right: 40px;
  position: relative;
}

.nca-select-item .find_cinema {
  width: 100%;
  text-align: center;
  border-radius: 5px;
  background-color: #f4f4f4;
}

.nca-select-item .find_cinema .iconfont {
  position: relative;
}

.nca-select-item .find_cinema .iconfont img {
  position: absolute;
  top: -2px;
  right: 5px;
}

.nca-select-item em {
  font-size: 24px;
  line-height: 66px;
}

.nca-select .van-icon {
  margin-right: 5px;
}
/* 时间分期 */

.new-tabs {
  line-height: 66px;
}

.new-tabs ul {
  display: -webkit-box;
  overflow-y: hidden;
  overflow-x: scroll;
  -webkit-overflow-scrolling: touch;
  -webkit-box-flex: 1;
  white-space: nowrap;
}

.new-tab {
  width: 200px;
  overflow: hidden;
  font-size: 24px;
  text-align: center;
  border-bottom: 5px solid transparent;
}

.new-tab-now {
  color: #c06;
  border-color: #c06;
}

.noData {
  position: relative;
}

.keguan {
  position: absolute;
  top: 15px;
  left: 36%;
  display: inline-block;
  height: 40px;
  width: 40px;
}

.noData span {
  position: absolute;
  top: 5px;
  left: calc(36% + 50px);
}
</style>

<style>
.van-popup--right {
  height: 100%;
  width: 100%;
  background-color: #fff;
}
</style>