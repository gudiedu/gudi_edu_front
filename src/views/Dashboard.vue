<template>
  <!--GLOBAL MASKING -->
  <div id="mask"></div>

  <!-- GLOBAL WRAP -->
  <div id="wrap_area">
    <!-- Content area -->
    <div id="container">
      <ul>
        <li class="lnb">
          <!-- lnb area -->
          <Menu></Menu>
        </li>
        <li class="contents">
          <!-- content AREA -->
          <!-- connecting to router view -->
          <div class="content">
            <router-view :type="type" :menu="menu"></router-view>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Menu from '@/components/LeftMenu.vue'
export default {
  data: function() {
    return {
      type: this.$route.params.type,
      menu: this.$route.params.menu,
    }
  },
  watch: {
    $route(to) {
      this.type = to.params.type;
      this.menu = to.params.menu;
    },
  },
    mounted:function(){
    //sessioin
    console.log("세션 loginId ?")
    console.log(sessionStorage.getItem("loginID"))
    //cookie 값
    console.log("쿠키 값:")
    console.log(document.cookie);    //LOGIN_ID=admin10
  },
  components: {Menu},
  

}
</script>

<style>

</style>