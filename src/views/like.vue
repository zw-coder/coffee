<template>
  <div class="like">
    <van-nav-bar title="我的收藏" left-text="返回" left-arrow @click-left="onClickLeft" />
    <div class="container">
      <div class="bg"></div>
      <div class="content">
        <div v-if="list.length > 0">
          <div class="item" v-for="item in list" :key="item.id">
            <img :src="item.smallImg" />
            <span class="name">{{item.name}}</span>
            <div class="desc">
              <span class="price">￥{{item.price}}</span>
              <van-icon class="van-icon-delete" @click="deleteLike(item.pid)"></van-icon>
            </div>
          </div>
        </div>
        <van-empty description="暂无收藏,去逛一逛!" v-else width="100%">
          <van-button round color="#0C34BA" class="bottom-button" @click="goMenu">去逛一逛</van-button>
        </van-empty>
      </div>
    </div>
  </div>
</template>

<script>
import { FindLike, LikeAndNotLike } from "@/service/request";
import { appkey } from "@/datas/key";

export default {
  data() {
    return {
      list: []
    };
  },
  methods: {
    async getMyLike() {
      let res = await FindLike(this.$cookies.get("token"));
      if (res.code == 2000) this.list = res.result;
    },
    onClickLeft() {
      this.$router.go(-1);
    },
    async deleteLike(pid) {
      let res = await LikeAndNotLike(false, {
        appkey: appkey,
        tokenString: this.$cookies.get("token"),
        pid: pid
      });
      if (res.code == 900) {
        this.$toast.success({ message: "", duration: 500 });
        this.getMyLike();
      }
    },
    goMenu() {
      this.$router.push({ name: "Menu" });
    }
  },
  mounted() {
    this.getMyLike();
  }
};
</script>

<style lang="scss" scoped>
.like {
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
      width: 90%;
      transform: translateY(-30px);
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      display: flex;
      flex-wrap: wrap;
      padding-top: 5%;
      .van-empty{
        width:100%
      }
      .item {
        height: 180px;
        display: flex;
        flex-direction: column;
        padding-left: 5%;
        padding-bottom: 40px;
        align-items: flex-start;
        img {
          height: 140px;
          width: 140px;
          border-radius: 10px;
        }
        .name {
          font-size: 16px;
          font-weight: 400;
          margin: 10px 0 10px;
        }
        .desc {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          .price {
            font-size: 14px;
            color: #0c34ba;
            font-weight: 600;
          }
          .van-icon-delete {
            font-size: 20px;
            color: rgb(196, 196, 196);
          }
        }
      }
    }
  }
}
</style>