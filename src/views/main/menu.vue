<template>
  <div class="menu" ref="menu">
    <div class="menu-wrapper">
      <van-row>
        <van-col span="24">
          <van-cell-group :border="false">
            <van-field
              style="backgroundColor:#F7F8FA"
              v-model="value"
              left-icon="search"
              placeholder="请输入关键词"
              @click.stop="goToSearch"
            />
          </van-cell-group>
        </van-col>
      </van-row>
      <div class="tab-header">
        <van-tabs v-model="activeName" line-width="0" :ellipsis="false" :border="false">
          <template v-for="(item,index) in typeData" class="tabs">
            <van-tab :name="item.value" :key="index">
              <template #title class="tabs">
                <img
                  height="40"
                  width="40"
                  :src="activeName == item.value ? item.icon.active : item.icon.inactive"
                />
                <div class="name">{{item.desc}}</div>
              </template>
              <div class="content">
                <van-row
                  v-for="i in item.info"
                  :key="i.id"
                  type="flex"
                  align="center"
                  @click.stop="goToDetail(i.pid)"
                >
                  <img v-lazy="i.smallImg" height="80" width="80" />
                  <div class="desc">
                    <span class="iname">{{ i.name }}</span>
                    <span class="iename">({{ i.enname }})</span>
                    <span class="iprice">￥{{ i.price }}</span>
                  </div>
                </van-row>
              </div>
            </van-tab>
          </template>
        </van-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { getTypeList } from "@/service/request";
import BScroll from "better-scroll";
export default {
  name: "Menu",
  data() {
    return {
      activeName: "1",
      value: "",
      typeData: [
        {
          key: "isHot",
          value: "1",
          info: [],
          desc: "推荐",
          icon: {
            active: require("@/assets/image/images/icons_18.gif"),
            inactive: require("@/assets/image/images/icons_03.gif")
          }
        },
        {
          value: "latte",
          desc: "拿铁",
          key: "type",
          icon: {
            active: require("@/assets/image/images/icons_19.gif"),
            inactive: require("@/assets/image/images/icons_05.gif")
          }
        },
        {
          value: "coffee",
          desc: "咖啡",
          key: "type",
          icon: {
            active: require("@/assets/image/images/icons_20.gif"),
            inactive: require("@/assets/image/images/icons_07.gif")
          }
        },
        {
          value: "rena_ice",
          desc: "纳瑞冰",
          key: "type",
          icon: {
            active: require("@/assets/image/images/icons_21.gif"),
            inactive: require("@/assets/image/images/icons_09.gif")
          }
        }
      ]
    };
  },
  created() {
    this.getAllList();
    this.$nextTick(() => {
      setTimeout(() => {
        this._initScroll();
      }, 500);
    });
  },
  methods: {
    getAllList() {
      this.$toast.loading({ duration: 0, forbidClick: true, message: "" });
      this.typeData.forEach(async item => {
        let res = await getTypeList(item.key, item.value);
        item.info = res.result;
      });
      this.$toast.clear();
    },
    _initScroll() {
      this.scroll = new BScroll(this.$refs.menu, {
        click: true,
        bounce: false
      });
    },
    goToDetail(id) {
      this.$router.push({ path: "/detail", query: { pid: id } });
    },
    goToSearch() {
      this.$router.push({ name: "Search" });
    }
  }
};
</script>

<style lang="scss" scoped>
.menu {
  width: 100%;
  overflow: hidden;
  height: calc(100vh - 50px);
  background-color: #eee;
  .van-cell-group {
    padding: 10px 14px 20px;
    .van-field {
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .van-tabs {
    width: 100%;
    .van-tab {
      // overflow: auto;

      height: 30px;
      text-align: center;
      .img {
        display: block;
      }
    }
  }
  //样式穿透
  ::v-deep .van-tabs__wrap,
  .van-tabs__wrap--scrollable {
    height: 60px;
    padding: 0 0 10px;
    background-color: #fbfbfb;
  }
  ::v-deep .van-tabs__content {
    width: 100%;
    display: block;
    background-color: #eee;
    padding: 20px 5%;
    overflow: hidden;
    .content {
      width: 90%;
      .van-row {
        height: 76px;
        border-radius: 10px;
        overflow: hidden;
        background-color: #fff;
        margin-bottom: 10px;
        padding: 18px 20px;
        img {
          display: block;
        }
        .desc {
          display: flex;
          flex-direction: column;
          height: 100%;
          justify-content: space-between;
          align-items: flex-start;
          margin-left: 10px;
          span {
            display: block;
            margin-bottom: 6px;
          }
          .iname {
            font-size: 20px;
            font-weight: 500;
            height: 24px;
          }
          .iename {
            font-size: 14px;
            font-weight: 500;
            height: 18px;
            color: #bfbfc0;
          }
          .iprice {
            font-size: 16px;
            font-weight: 500;
            color: #f00;
            height: 164px;
          }
        }
      }
    }
  }
}
</style>