<template>
  <div class="container eq-cont">
    <figure class="img-eq-top">
      <img src="../assets/eq-top.png" alt="">
    </figure>
    <figure class="img-eq">
      <img src="../assets/eq-bottom.png" alt="">
    </figure>
  </div>
</template>

<script>
export default {
  
}
</script>

<style scoped>
.container{
  background-color: #fff;
  padding-bottom: 88px;
  position: relative;
}
.img-eq{
  display: block;
  width: 100%;
  position: absolute;
  bottom: 88px;
  left: 0;
}
.img-eq img{
  display: block;
  width: 100%;
}
.img-eq-top{
  display: block;
  width: 100%;
  position: absolute;
  top: 10%;
  left: 0;
  z-index: 30;
}
.img-eq-top img{
  display: block;
  width: 100%;
}
</style>