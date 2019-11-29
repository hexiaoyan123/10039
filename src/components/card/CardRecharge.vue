<template>
  <div class="container address-list">
    <Vheader name="卡券充值"></Vheader>
    
    <div class="card">
      <ul class="card-form">
        <li class="card-item">
          <div class="card-item-lable">卡号:</div>
          <input type="text">
          <div class="card-item-ctrl">
            
          </div>
        </li>
        <li class="card-item">
          <div class="card-item-lable">验证码:</div>
          <input type="text">
          <div class="card-item-ctrl">
            <figure  class="card-code">
              <img  style="width: 100%;" src="../../assets/logo.png" alt="">
            </figure>
            <i class="iconfont">&#xe794;</i>
          </div>
        </li>
      </ul>
      <div class="form-btn">确认</div>
    </div>
  </div>
</template>

<script>
import Vheader from '../HeaderV'
export default {
  name: 'CardRecharge',
  components: {
    Vheader
  },
  data () {
    return {
      card: '9990011136505233', // 卡号
      password: '048625', // 密码
      codeUrl: '', // 验证码图片
      code: '', // 输入的验证码
    }
  },
  methods: {
    
  }
}
</script>

<style scoped>
/* 头 */
header{
  /* position: absolute; */
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  font-size: 28px;
  color: #fff;
  line-height: 84px;
  text-align: center;
  border-bottom: 1px solid #dfdfdf;
  background-color: #ff5162;
}
.address-list{
  padding-top: 85px;
}
.class-back{
  position: absolute;
  width: 80px;
  height: 80px;
  line-height: 92px;
  top: 0;
  left: 0;
  text-align: center;
  font-size: 28px;
  color: #fff;
}

/* 文本框 */
.card-item{
  display: flex;
  font-size: 24px;
  color: #818181;
  line-height: 75px;
  padding: 12px 20px;
  border-bottom: 1px solid #dfdfdf;
}
.card-item input{
  display: block;
  height: 75px;
  border: none;
  font-size: 28px;
  line-height: 75px;
  outline: none;
  flex: 10;
  padding: 0 10px;
  min-width: 10px;
}
.card-item-ctrl{
  position: relative;
}
.card-code{
  display: block;
  height: 75px;
  width: 160px;
  border-radius: 6px;
  margin-right: 70px;
}
.card-item-ctrl .iconfont{
  position: absolute;
  display: inline-block;
  top: 0;
  right: 0;
  height: 75px;
  line-height: 75px;
  width: 70px;
  text-align: center;
  font-size: 48px;
}
.form-btn{
  width: 600px;
  margin: 0 auto;
  line-height: 80px;
  border-radius: 40px;
  color: #fff;
  font-size: 28px;
  text-align: center;
  background-color: #ff5162;
  margin-top: 60px;
}
</style>
 