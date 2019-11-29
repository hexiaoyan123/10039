<template>
  <div class="container">
    <!-- 搜索开始 -->
    <div class="seanch-btn-out">
      <div class="seanch-btn" @click="goForm">
        <i class="iconfont">&#xe6ac;</i> 搜索商品
      </div>
    </div>
    <!-- 搜索结束 -->
    <div class="container-content" ref="backScroller">
      <iframe
        class="index-frame"
        width="100%"
        scrolling="no"
        :src="url"
        name="viewport"
        content="width=device-width,initial-scale=2.0 ,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no"
        frameborder="0"
        @load="readA"
      ></iframe>
    </div>
  </div>
</template>

<script>
export default {
  name: "Index",
  components: {},
  data() {
    return {
      url: ""
    };
  },
  created() {
    this.$store.commit("ctrlLoader", true);
    this.getUrl();
  },
  methods: {
    // 搜索
    goForm() {
      this.$router.push("/product/shForm");
    },
    // 装载iframe
    readA() {
      this.$store.commit("ctrlLoader", false);
      var listDemo = document
        .querySelector(".index-frame")
        .contentWindow.document.querySelectorAll("a");
      listDemo.forEach(function(e, i) {
        var url = e.href;
        e.href = "javascript:;";
        if (url && url != "#") {
          e.onclick = function() {
            window.parent.location.href = url;
            return;
          };
        }
      });
      // 设置iframe高度
      var winHeight = document.querySelector(".index-frame").contentWindow
        .document.body.scrollHeight;
      // console.log(winHeight)
      document.querySelector(".index-frame").setAttribute("height", winHeight);
    },
    // 获取渠道链接
    getUrl() {
      let vm = this;
      this.$http
        .get("/panda-admin-api/v1/getChannel")
        .then(function(response) {
          if ("1000" == response.data.code) {
            vm.$init.user.cacheChannel = response.data.result;
            vm.url = vm.$init.htmlIp + vm.$init.user.cacheChannel.indexUrl;
          } else {
            vm.$toast(response.data.msg);
          }
        })
        .catch(function(error) {
          vm.$toast("请求超时，请稍后再试！");
        });
      // vm.url = vm.$init.htmlIp + '/201905/190430170939128756.html';
    }
  },
  beforeRouteEnter(to, from, next) {
    let scrollTop = sessionStorage.getItem("indexBackScroller");
    if (from.meta.productInfo && scrollTop) {
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
    window.sessionStorage.setItem(
      "indexBackScroller",
      this.$refs.backScroller.scrollTop
    );
    next();
  }
};
</script>

<style scoped>
.container {
  background-color: #f8f8f8;
  padding-bottom: 88px;
  padding-top: 94px;
}
.index-frame {
  /* height: 100%; */
  width: 100vw;
  border: 0;
  /* min-width: 100%; */
  min-height: 101%;
}
.container-content {
  width: 100%;
  height: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.seanch-btn-out {
  height: 94px;
  width: 100%;
  background-color: #fff;
  /* position: relative; */
  position: absolute;
  top: 0;
  left: 0;
}
.seanch-btn {
  position: absolute;
  width: 90%;
  height: 70px;
  line-height: 70px;
  box-shadow: 0 0 20px #f0f0f0;
  left: 5%;
  top: 15px;
  border-radius: 6px;
  color: #c1c1c1;
  font-size: 24px;
  box-sizing: border-box;
  padding: 0 46px;
}
.seanch-btn .iconfont {
  font-size: 24px;
}
</style>
