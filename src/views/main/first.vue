<template>
  <div class="first" ref="first">
    <div class="wrapper">
      <div class="header">
        <van-row type="flex" align="center" gutter="2" justify="space-around">
          <van-col span="10">{{time}}</van-col>
          <van-col span="12">
            <van-field left-icon="search" placeholder="请输入商品" @click.stop="goToSearch" />
          </van-col>
        </van-row>
      </div>
      <div class="banner">
        <van-swipe :autoplay="3000">
          <van-swipe-item
            v-for="(item, index) in banner"
            :key="index"
            @click.stop="goToDetail(item.pid)"
          >
            <img v-lazy="item.bannerImg" />
          </van-swipe-item>
        </van-swipe>
      </div>

      <List :list="list" :title="title" />
    </div>
  </div>
</template>

<script>
import { getBanner, getHotList ,FindMyInfo } from "@/service/request";
import BScroll from "better-scroll";
import List from "@/components/List";
export default {
  name: "Menu",
  components: {
    List
  },
  data() {
    return {
      banner: [],
      list: [],
      title: "热门推荐",
      name: ""
    };
  },
  created() {
    this._initData();
    this.getUserInfo();
  },
  mounted() {},
  methods: {
    async getUserInfo() {
      let token = this.$cookies.get("token");
      if (!token) return;
      else {
        let res = await FindMyInfo(token);
        if (res.code == "A001") {
          // this.$toast.clear();
          this.name = res.result[0].nickName+',';
        }
      }
    },
    async _initData() {
      this.$toast.loading({ duration: 0, forbidClick: true, message: "" });
      let res = await getBanner();
      this.banner = res.result;
      this.$toast.clear();
      // console.log(this.banner);
      let res1 = await getHotList();
      if (res1.result.length > 0) {
        this.finished = true;
        this.list = res1.result;
        setTimeout(() => {
          this._initScroll();
        }, 500);
      }
    },
    _initScroll() {
      this.scroll = new BScroll(this.$refs.first, {
        scrollY: true,
        click: true
      });
    },
    goToSearch() {
      this.$router.push({ name: "Search" });
    },
    goToDetail(id) {
      this.$router.push({ path: "/detail", query: { pid: id } });
    }
  },
  computed: {
    time() {
      let date = new Date();
      let hour = date.getHours();
      if (0 < hour && hour < 11) {
        return this.name+"早上好!";
      } else if (hour > 18) {
        return this.name+"晚上好!";
      } else if (hour > 13 && hour < 18) {
        return this.name+"下午好!";
      } else {
        return this.name+"中午好!";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.first {
  height: calc(100vh - 50px);
  background-color: #f5f5f5;
  overflow: hidden;
  .header {
    color: #000;
    background-color: rgba(255, 255, 255, 1);
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    padding: 8px 0 8px 0;
    position: relative;
    box-sizing: content-box;
    &:after {
      content: "";
      left: 0;
      right: 0;
      height: 80px;
      bottom: -79.5px;
      border: none;
      border-bottom-left-radius: 50%;
      border-bottom-right-radius: 50%;
      position: absolute;
    }
    .van-row {
      width: 100%;
      height: 80%;
      .van-col {
        font-size: 16px;
        .van-field {
          height: 36px;
          line-height: 18px;
          border-radius: 20px;
          background-color: #f7f8fa;
          .van-icon {
            color: #6a9efa;
          }
        }
      }
    }
  }
  .banner {
    height: 200px;
    padding: 0 10px;
    border: none;
    .van-swipe {
      border-radius: 10px;
      overflow: hidden;
      height: 100%;
      .van-swipe-item {
        img {
          height: 200px;
          width: 100%;
        }
      }
    }
  }
}
</style>