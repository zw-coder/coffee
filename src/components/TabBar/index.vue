<template>
  <div class="nav">
    <van-tabbar route >
      <van-tabbar-item v-for="(item,index) in tabbarData" :key="index" :to="item.url">
        <span>{{item.title}}</span>
        <template #icon="props">
          <img :src="props.active ? item.icon.active : item.icon.inactive"/>
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabbarIndex: 0,
      tabbarData: [
        {
          title: "首页",
          icon: {
            active: require("../../assets/image/images/tabbar_18.png"),
            inactive: require("../../assets/image/images/tabbar_03.png")
          },
          url: {
            name: "Homepage"
          }
        },
        {
          title: "菜单",
          icon: {
            active: require("../../assets/image/images/tabbar_19.png"),
            inactive: require("../../assets/image/images/tabbar_05.png")
          },
          url: {
            name: "Menu"
          }
        },
        {
          title: "购物袋",
          icon: {
            active: require("../../assets/image/images/tabbar_21.png"),
            inactive: require("../../assets/image/images/tabbar_09.png")
          },
          url: {
            name: "Shopbag"
          }
        },
        {
          title: "我的",
          icon: {
            active: require("../../assets/image/images/tabbar_22.png"),
            inactive: require("../../assets/image/images/tabbar_11.png")
          },
          url: {
            name: "My"
          }
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
.nav{
  position:fixed;
  bottom: 0;
  left: 0;
  right:0;
  background-color: #FBFBFB;
}
</style>