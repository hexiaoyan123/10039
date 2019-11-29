<template>
  <div class="container address-list">
    <Vheader name="我的卡券"></Vheader>
    
    <div class="card">

      <ul class="card-list">
        <li class="card-item">
          <div class="card-item-top">
            <p>卡号: </p>
            <p>类型: </p>
            <p>有效期: 
              <span class="btn">绑定卡券</span>
            </p>
          </div>
          <div class="card-item-bottom">余额: 0.0次</div>
          <div class="card-item-left"></div>
          <div class="card-item-right"></div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Vheader from '../HeaderV'
export default {
  name: 'CardQuery',
  components: {
    Vheader
  },
  data () {
    return {
      showPassword: false,
      card: '9990011136505233', // 卡号
      password: '048625', // 密码
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
  z-index: 101;
}
.address-list{
  padding-top: 84px;
  background-color: #f8f8f8;
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

.card-add{
  background-color: #fff;
  border-bottom: 1px solid #dfdfdf;
  border-top: 1px solid #dfdfdf;
  padding: 0 35px;
}
.card-add span{
  color: #bababa;
  font-size: 28px;
  line-height: 76px;
}
.card-list{
  padding: 35px;
}
.card-item{
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  color: #fff;
  font-size: 24px;
  background: #ff366c; /* For browsers that do not support gradients */  
  background: -webkit-linear-gradient(left top, #ff7380, #ff366c); /* For Safari 5.1 to 6.0 */  
  background: -o-linear-gradient(bottom right, #ff7380, #ff366c); /* For Opera 11.1 to 12.0 */  
  background: -moz-linear-gradient(bottom right, #ff7380, #ff366c); /* For Firefox 3.6 to 15 */  
  background: linear-gradient(to bottom right, #ff7380, #ff366c); /* Standard syntax */ 
}
.card-item-top{
  color: #fff;
  padding: 30px 35px;
}
.card-item-top p{
  padding: 12px;
  line-height: 54px;
}
.card-item-bottom{
  height: 90px;
  line-height: 90px;
  padding: 0 35px;
  border-top: 1px dashed #ffffff;
}
.card-item-left,
.card-item-right{
  height: 30px;
  width: 30px;
  position: absolute;
  bottom: 75px;
  border-radius: 50%;
  background-color: #f8f8f8;
}
.card-item-left{
  left: -15px;
}
.card-item-right{
  right: -15px;
}
.btn{
  display: block;
  float: right;
  width: 200px;
  height: 50px;
  line-height: 50px;
  border-radius: 25px;
  text-align: center;
  border: 1px solid #ffffff;
}
</style>
 