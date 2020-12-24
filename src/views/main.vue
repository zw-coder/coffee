<template>
  <div class="mian">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <tab />
  </div>
</template>

<script>
import tab from "@/components/TabBar";
export default {
  components:{
    tab
  }
};
</script>

<style lang="scss" scoped>
</style>