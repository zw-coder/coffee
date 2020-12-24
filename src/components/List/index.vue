<template>
  <div class="coffe-list">
    <van-row>
      <van-col class="hot-title" offset="1">{{title}}</van-col>
    </van-row>
    <van-list type="flex" justify="space-between">
      <div
        v-for="item in list"
        :key="item.id"
        class="coffe-item"
        @click.stop="goToDetail(item.pid)"
      >
        <img v-lazy="item.smallImg" />
        <span class="name">{{item.name}}</span>
        <span class="price">￥{{item.price}}</span>
      </div>
    </van-list>
  </div>
</template>

<script>
export default {
  props: ["list",'title'],
  methods: {
    goToDetail(id) {
      this.$router.push({path: '/detail', query: {pid: id}})
    }
  }
};
</script>

<style lang="scss" scoped>
.coffe-list {
  // margin-top: 20px;
  padding-top:10px ;
  background-color: #F5F5F5;
  .hot-title {
    height: 24px;
    font-size: 18px !important;
    font-weight: 800;
    margin-bottom: 20px;
  }
  .van-list {
    //  flex-direction:row;
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 0 20px;
    box-sizing: border-box;
    //  flex-wrap: wrap;

    .coffe-item {
      position: relative;
      width: 160px;
      display: inline-block;
      margin-bottom: 10px;
      border-radius: 12px;
      overflow: hidden;
      font-size: 16px;

      img {
        width: 100%;
        height: 100%;
      }
      .name {
        position: absolute;
        left: 0;
        bottom: 4px;
        background-color: rgba(0, 0, 0, 0.3);
        color: #fff;
        display: inline-block;
        right: 0;
        padding: 2px 5px 2px 5px;
      }
      .price {
        position: absolute;
        left: 0;
        top: 0;
        background-color: rgba(196, 192, 192, 0.3);
        color: #000;
        display: inline-block;
        padding: 2px 5px 2px 5px;
      }
    }
  }
}
</style>