<template>
  <div class="order">
    <van-nav-bar title="我的订单" left-text="返回" left-arrow @click-left="onClickLeft" />
    <div class="container">
      <div class="bg"></div>
      <div class="content">
        <van-tabs v-model="active" color=" #0c34ba">
          <van-tab title="全部">
            <div class="all">
              <div class="order-info" v-for="(item,index) in list[0]" :key="index">
                <div class="title">订单信息</div>
                <van-row  type="flex" align="center">
                  <van-col>
                    <img :src="item.smallImg" height="70" />
                  </van-col>
                  <van-col offset="1" class="desc-col">
                    <div class="desc">
                      <div>
                        <span class="title">{{item.name}}</span>
                        <span class="rule">{{item.rule}}</span>
                      </div>
                      <div class="enname">{{item.enname}}</div>
                      <div class="price">￥{{item.price}}</div>
                    </div>
                  </van-col>
                  <div class="count">X{{item.count}}</div>
                </van-row>
                <div class="pay-box">
                  共计{{getCount}}件商品
                  <span>合计￥{{getPrice}}</span>
                </div>
              </div>
            </div>
          </van-tab>
          <van-tab title="进行中">
            <div class="doing">
              <div class="order-info">
                <div class="title">订单信息</div>
                <van-row v-for="(item,index) in list[0]" :key="index" type="flex" align="center">
                  <van-col>
                    <img :src="item.small_img" height="70" />
                  </van-col>
                  <van-col offset="1" class="desc-col">
                    <div class="desc">
                      <div>
                        <span class="title">{{item.name}}</span>
                        <span class="rule">{{item.rule}}</span>
                      </div>
                      <div class="enname">{{item.enname}}</div>
                      <div class="price">￥{{item.price}}</div>
                    </div>
                  </van-col>
                  <div class="count">X{{item.count}}</div>
                </van-row>
                <div class="pay-box">
                  共计{{getCount}}件商品
                  <span>合计￥{{getPrice}}</span>
                </div>
              </div>
            </div>
          </van-tab>
          <van-tab title="已完成">
            <div class="finished">
              <div class="order-info">
                <div class="title">订单信息</div>
                <van-row v-for="(item,index) in list[2]" :key="index" type="flex" align="center">
                  <van-col>
                    <img :src="item.small_img" height="70" />
                  </van-col>
                  <van-col offset="1" class="desc-col">
                    <div class="desc">
                      <div>
                        <span class="title">{{item.name}}</span>
                        <span class="rule">{{item.rule}}</span>
                      </div>
                      <div class="enname">{{item.enname}}</div>
                      <div class="price">￥{{item.price}}</div>
                    </div>
                  </van-col>
                  <div class="count">X{{item.count}}</div>
                </van-row>
                <div class="pay-box">
                  共计{{getCount}}件商品
                  <span>合计￥{{getPrice}}</span>
                </div>
              </div>
            </div>
          </van-tab>
        </van-tabs>
      </div>
      <div class="item"></div>
    </div>
  </div>
</template>

<script>
import { FindOrder } from "@/service/request";
export default {
  data() {
    return {
      active: 0,
      list: [],
      status: [0, 1, 2]
    };
  },
  created() {
    this.initData();
  },

  methods: {
    onClickLeft() {
      this.$router.push({ name: "My" });
    },
    async initData() {
      let token = this.$cookies.get("token");
      if (!token) return;
      this.list = [];
      for (let i = 0; i < this.status.length; i++) {
        let res = await FindOrder(token, this.status[i]);
        if (res.code == 70000) {
          console.log(res);
          res.result
          this.list.push(res.result);
        }
      }
      console.log(this.list);
    }
  },
  computed: {
    getPrice() {
      let price = 0;
      this.list.forEach(item => {
        price = price + item.price * item.count;
      });
      return price;
    },
    getCount() {
      let count = 0;
      this.list.forEach(item => {
        count += item.count;
      });
      return count;
    }
  }
};
</script>

<style lang="scss" scoped>
.order {
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
      /deep/ .van-tabs {
        width: 100%;
        .all,
        .doing,
        .finised {
          background-color: #f5f5f5;
          margin-top: 20px;
        }
        .order-info {
          padding: 10px 0;
          margin-top: 20px;
          border-radius: 14px;
          background-color: #fff;
          .title {
            font-size: 14px;
            font-weight: 600;
            text-align: left;
            padding: 5px 0 0 10px;
          }
          .van-row {
            position: relative;
            width: 90%;
            margin: 10px 5%;
            border-radius: 10px;

            .desc-col {
              height: 70px;
              display: block;
              .desc {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: space-around;
                height: 100%;
                .title {
                  font-size: 14px;
                  font-weight: 600;
                  margin-right: 5px;
                }
                .enname {
                  color: #bfbfc0;
                }
                .price {
                  color: #0c34ba;
                  font-weight: 800;
                  font-size: 14px;
                }
              }
            }
            .count {
              position: absolute;
              bottom: 10px;
              right: 10px;
              font-size: 14px;
              color: rgb(112, 112, 112);
            }
          }
          .pay-box {
            height: 40px;
            background-color: #fff;
            border-top: 1px dashed #e4e4e4;
            position: relative;
            font-size: 16px;
            font-weight: 600;
            color: #444;
            display: flex;
            padding: 0px 10px 0;
            justify-content: space-between;
            align-items: flex-end;
            span {
              color: #0c34ba;
            }
            &::before {
              content: "";
              position: absolute;
              top: -10px;
              left: -10px;
              width: 20px;
              height: 20px;
              background-color: #f5f5f5;
              border-radius: 50%;
            }
            &::after {
              content: "";
              position: absolute;
              top: -10px;
              right: -10px;
              width: 20px;
              height: 20px;
              background-color: #f5f5f5;
              border-radius: 50%;
            }
          }
        }
      }
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
      }
    }
  }
}
</style>