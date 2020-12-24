<template>
  <div class="address">
    <van-nav-bar title="地址管理" left-text="返回" left-arrow @click-left="onClickLeft" />
    <div class="container">
      <div class="bg"></div>
      <div class="content" v-if="list.length > 0">
        <div class="item" v-for="item in list" :key="item.id">
          <div class="top">
            <span>{{item.name}}</span>
            <span>&nbsp;{{item.tel}}</span>
            <van-tag color="#0c34ba" round v-if="item.isDefault != 0">默认</van-tag>
          </div>
          <div class="bottom">
            <span>{{item.city + item.province + item.county +' '+ item.addressDetail}}</span>
          </div>
          <van-icon class="van-icon-edit" @click="changeAddress(item.aid)"></van-icon>
        </div>
      </div>
      <van-empty v-else description="还未添加地址"></van-empty>
    </div>
    <van-button color=" #0c34ba" round class="address-btn" @click="newAddress">新增地址</van-button>
  </div>
</template>

<script>
import { FindAddress } from "@/service/request";
export default {
  data() {
    return {
      list: []
    };
  },
  created() {
    this.getAddress();
  },
  methods: {
    onClickLeft() {
      this.$router.push({ name: "My" });
    },
    changeAddress(aid) {
      this.$router.push({ name: "NewAddress", query: { aid: aid, type: 1 } });
    },
    newAddress() {
      this.$router.push({ name: "NewAddress", query: { type: 2 } });
    },
    async getAddress() {
      let res = await FindAddress(this.$cookies.get("token"));
      // console.log(res)
      if (res.code == 20000) {
        this.list = res.result;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.address {
  background-color: #f5f5f5;
  position: absolute;
  min-height: 100vh;
  width: 100%;
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    .bg {
      height: 100px;
      width: 100%;
      background-color: #0c34ba;
    }
    .content {
      background-color: #fff;
      width: 94%;
      transform: translateY(-30px);
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      display: flex;
      flex-wrap: wrap;
      padding-top: 5%;
      padding-bottom: 2%;
      .item {
        width: 100%;
        height: 20px;
        display: flex;
        font-size: 16px;
        flex-direction: column;
        position: relative;
        padding-left: 5%;
        margin-top: 10px;
        padding-bottom: 40px;
        align-items: flex-start;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        .top {
          margin-bottom: 10px;
        }
        .bottom {
          font-size: 13px;
        }
        .van-icon-edit {
          position: absolute;
          right: 20px;
          top: 30%;
          font-size: 20px;
          color: rgb(134, 134, 134);
        }
      }
    }
  }
  /deep/ .van-button {
    position: fixed;
    left: 16px;
    right: 16px;
    bottom: 10px;
    width: calc(100% - 32px);
  }
}
</style>