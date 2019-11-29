<template>
<div class="container address">
  <div class="ads-form-grop">
    <label>姓名</label>
    <input v-model="form.name" type="text" placeholder="请填取票人姓名">
    <span class="clear" v-show="form.name" @click="form.name = ''">
      <i class="iconfont">&#xe6e1;</i>
    </span>
  </div>
  <div class="ads-form-grop">
    <label>手机号</label>
    <input v-model="form.phone" type="text" placeholder="请填写手机号码">
    <span class="clear" v-show="form.phone"  @click="form.phone = ''">
      <i class="iconfont">&#xe6e1;</i>
    </span>
  </div>
  <div class="ads-form-grop">
    <label>身份证号</label>
    <input v-model="form.code" type="text" placeholder="请填写身份证号码">
    <span class="clear" v-show="form.code"  @click="form.code = ''">
      <i class="iconfont">&#xe6e1;</i>
    </span>
  </div>

  <div class="bottom-btn">提交</div>
</div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        name: '',
        phone: '',
        code:''
      }
    }
  },
  created () {

  },
  methods: {

  }
}
</script>

<style scoped>
.address{
  padding-bottom: 100px;
}
.bottom-btn{
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px;
  line-height: 100px;
  text-align: center;
  font-size: 28px;
  color: #ffffff;
  background-color: #ff9300;
}
.ads-form-grop{
  border-bottom: 1px solid #f8f8f8;
  display: flex;
  padding: 30px 40px 30px 30px;
  line-height: 38px;
  position: relative;
}
.ads-form-grop label{
  width: 100px;
}
.ads-form-grop input{
  border: none;
  font-size: 24px;
  line-height: 38px;
  outline: none;
  flex: 10;
  text-align: right;
}
.ads-form-grop .clear{
  position: absolute;
  right: 10px;
  line-height: 38px;
  top: 30px;
}
.ads-form-grop .clear .iconfont{
  font-size: 24px;
  color: #b4b4b4;
}
</style>