<template>
  <div class="search" ref="search">
    <div class="search-wrapper">
      <van-row class="search-box" type="flex" justify="space-between" align="center">
        <van-col>
          <van-icon name="arrow-left" @click="goback" />
        </van-col>
        <van-col span="20">
          <form action="/">
            <van-search v-model="value" show-action placeholder="请输入搜索关键词" @search="onSearch" />
          </form>
        </van-col>
      </van-row>
      <List v-if="list" :list="list" :title="title" />
    </div>
  </div>
</template>

<script>
import { Search } from "@/service/request";
import List from "@/components/List";
import BScroll from "better-scroll";
export default {
  data() {
    return {
      value: "",
      list: [],
      title: "推荐"
    };
  },
  components: {
    List
  },
  mounted() {
    this.onSearch();
  },
  methods: {
    goback() {
      this.$router.go(-1);
    },
    async onSearch() {
      this.$toast.loading({ duration: 500, forbidClick: true, message: "" });
      let res = await Search(this.value);
      if (res.result.length === 0)
        this.$toast.fail({
          duration: 500,
          forbidClick: true,
          message: "重新输入关键词"
        });
      else {
        this.list = res.result;
        this.$toast.success({ duration: 500, forbidClick: true, message: "" });
        setTimeout(() => {
          this._initScroll();
        }, 500);
      }
      // this.$toast.clear()
    },
    _initScroll() {
      this.scroll = new BScroll(this.$refs.search, {
        scrollY: true,
        click: true
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.search {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow: hidden;
  .search-box {
    // padding:5px 0;
    .van-icon {
      font-size: 30px;
      margin-left: 10px;
    }
  }
}
</style>