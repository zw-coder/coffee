<template>
  <div class="container">
    <van-nav-bar title="商品详情" left-text="返回" left-arrow @click-left="onClickLeft" />
    <div class="content" v-if="info" ref="content">
      <div class="content-wrapper">
        <img v-lazy="info.large_img" width="100%" />
        <div class="desc">
          <div class="name">{{info.name}}</div>
          <div class="choose-box">
            <div v-for="(item,index) in info.rules" :key="index">
              <van-row class="temperature" type="flex" align="center">
                <van-col span="3" class="info_desc">{{item.title}}</van-col>
                <van-col
                  v-for="(v,i) in item.rules"
                  :key="i"
                  offset="2"
                  class="info_choose"
                  @click="toggleRule(v, index)"
                  :class="{'active':v.isActive}"
                >{{v.title}}</van-col>
              </van-row>
            </div>
          </div>
          <div class="desc-box">
            <div class="title">商品描述</div>
            <div class="desc-info" v-for="(i,index) in info.desc" :key="index">
              <span v-if="i">{{index+1}}.{{i}}</span>
            </div>
          </div>
          <div class="cart-box">
            <span class="price">￥{{info.price}}</span>
            <div class="count">
              <van-stepper v-model="count" theme="round" button-size="24" disable-input />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="shop-cart">
      <van-goods-action>
        <van-goods-action-icon
          icon="like"
          text="收藏"
          @click="onClickLike"
          :color="islike ? '#f00' : '#999' "
        />
        <van-goods-action-icon icon="cart-o" text="购物车" @click="onClickShop" :badge="badge" />
        <van-goods-action-button color="#6A91EC" text="加入购物车" @click="onClickAdd" />
        <van-goods-action-button color="#0C34BA" text="立即购买" @click="onClickBuy" />
      </van-goods-action>
    </div>
  </div>
</template>

<script>
import {
  getDetail,
  FindLike,
  LikeAndNotLike,
  GetShopCartCount,
  AddShopCart
} from "@/service/request";
import { appkey } from "@/datas/key";
import BScroll from "better-scroll";
export default {
  data() {
    return {
      pid: this.$route.query.pid,
      info: [],
      choose1: true,
      choose2: true,
      count: 0,
      islike: true,
      badge: 0
    };
  },
  mounted() {},
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    async initData() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner"
      });
      let res = await getDetail(this.pid);
      if (res.code == 600) res.result[0].desc = res.result[0].desc.split(/\n/);
      let ruleItems = ["tem", "sugar", "cream", "milk"];
      let rulesData = [];

      ruleItems.map(v => {
        if (res.result[0][v] == "") {
          return;
        }
        let rule = {
          title: res.result[0][v + "_desc"],
          rules: []
        };

        let r = res.result[0][v].split("/");
        r.map((value, index) => {
          let o = { title: value, isActive: index == 0 };
          rule.rules.push(o);
        });

        rulesData.push(rule);
      });

      res.result[0].rules = rulesData;
      this.info = res.result[0];
      this.$toast.clear();
      let token = this.$cookies.get("token");
      let b = await FindLike(token, this.pid);
      if (b.result.length == 0) this.islike = false;
    },
    _initScroll() {
      this.scroll = new BScroll(this.$refs.content, {
        scrollY: true,
        click: true
      });
    },
    async onClickLike() {
      let token = this.$cookies.get("token");
      let res = await LikeAndNotLike(!this.islike, {
        pid: this.pid,
        tokenString: token,
        appkey: appkey
      });
      console.log(res);
      if (res.code == 800) {
        this.$toast.success({
          message: res.msg,
          forbidClick: true,
          duration: 500
        });
        this.islike = !this.islike;
      } else if (res.code == 900) {
        this.$toast.success({
          message: res.msg,
          forbidClick: true,
          duration: 500
        });
        this.islike = !this.islike;
      } else {
        this.$toast.fail({
          message: res.msg,
          forbidClick: true,
          duration: 500
        });
      }
      // console.log(a);
    },
    async onClickAdd() {
      console.log(this.info);
      let type = [];
      this.info.rules.forEach(i => {
        i.rules.forEach(j => {
          if (j.isActive) type.push(j.title);
        });
      });

      let list = {
        pid: this.pid,
        count: this.count,
        appkey: appkey,
        tokenString: this.$cookies.get("token"),
        rule: type.join("/")
      };
      let res = await AddShopCart(list);
      if (res.code == 3000) {
        this.$toast.success({ duration: 500, message: "成功添加" });
        this.getBadge();
      }
    },
    onClickBuy() {
      this.$router.push({ name: "Pay" });
    },
    onClickShop() {
      this.$router.push("shop");
    },
    async getBadge() {
      let token = this.$cookies.get("token");
      let res = await GetShopCartCount(token);
      if (res.code == 4000) this.badge = res.result;
    },
    toggleRule(v, index) {
      if (v.isActive) {
        return;
      }
      let ruleData = this.info.rules[index].rules;
      ruleData.forEach(item => {
        if (item.isActive) {
          item.isActive = false;
        }
      });

      v.isActive = true;
    }
  },
  created() {
    console.log("pid", this.pid);
    this.initData();
    this.getBadge();
    this.$nextTick(() => {
      setTimeout(() => {
        this._initScroll();
      }, 500);
    });
  },
  computed: {}
};
</script>

<style lang="scss" scoped>
.container {
  .content {
    height: calc(100vh - 50px);
    .name {
      position: absolute;
      left: 10px;
      top: -40px;
      border-radius: 20px;
      background-color: #f6f3f3;
      color: #444;
      font-size: 16px;
      padding: 10px 14px;
    }
    .desc {
      display: block;
      width: 100%;
      // position: absolute;
      transform: translateY(-30px);
      bottom: 50px;
      background-color: #fff;
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;
      overflow: hidden;
      .choose-box {
        margin: 14px 16px;
        font-size: 14px;
        padding-bottom: 20px;
        border-bottom: 1px solid #eee;
        .van-row {
          height: 40px;
        }
        .info_choose {
          height: 24px;
          width: 66px;
          line-height: 24px;
          font-size: 14px;
          border-radius: 20px;
          background-color: #ebebeb;
          color: #6a6a6a;
          display: block;
          &.active {
            background-color: #6a91ec;
            color: #fff;
          }
        }
      }
      .desc-box {
        margin: 14px 16px;
        border-bottom: 1px solid #eee;
        .title {
          font-size: 18px;
          font-weight: 500;
          margin-bottom: 20px;
        }
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        .desc-info {
          span {
            text-align: left;
            display: block;
            margin-bottom: 16px;
          }
        }
      }
      .cart-box {
        display: flex;
        justify-content: space-between;
        margin: 14px 16px;
        padding-bottom: 30px;
        .price {
          color: #0c34ba;
          font-size: 16px;
          font-weight: 600;
        }
      }
    }
  }
}
</style>