<template>
<div class="container">
    <!-- 搜索开始 -->
    <div class="ss-top">
        <div class="seanch-btn" @click="goForm">
        <i class="iconfont">&#xe6ac;</i> 搜索商品
        </div>
    </div>
    <!-- 搜索结束 -->

    <div class="ss-cont">
        <!-- 左侧导航栏开始 -->
        <div class="nav-cont">
            树菜单
        </div>
        <!-- 左侧导航栏结束 -->
        <!-- 内容开始 -->
        <div class="in-cont">
            <class-list></class-list>
        </div>
        <!-- 内容结束 -->
    </div>

</div>
</template>

<script>
import ClassList from './ClassList'
export default {
    name: 'class',
    components: {
        'class-list': ClassList
    },
    data () {
        return {

        }
    },
    created () {

    },
    methods: {
        // 搜索
        goForm () {
            this.$router.push('/product/searchForm')
        },

    }
}
</script>

<style scoped>
.container{
  background-color: #f8f8f8;
  padding-top: 100px;
  padding-bottom: 88px;
}
/* 头部搜索框 */
.ss-top{
    position: absolute;
    height: 100px;
    background: #fff;
    width: 100%;
    top: 0;
    left: 0;
}
.seanch-btn{
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
.seanch-btn .iconfont{
  font-size: 24px;
}

.ss-cont{
    height: 100%;
    overflow: hidden;
    padding-left: 150px;
    position: relative;
}

/* 导航菜单 */
.nav-cont{
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 150px;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
}

/* 内容菜单 */
.in-cont{
    height: 100%;
}
</style>