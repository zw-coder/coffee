<template>
  <div class="order">
    <van-nav-bar title="我的订单" left-text="返回" left-arrow @click-left="onClickLeft" />
    <div class="container">
      <div class="bg"></div>
      <div class="content">
        <van-tabs v-model="active" color=" #0c34ba" class="tab-box" @change="getChange">
          <template v-for="(item2,index2) in titles">
            <van-tab :title="item2" :key="index2">
              <div class="all" v-if="list[index2] && list[index2].length > 0 ">
                <div class="order-info" v-for="(item,index) in list[index2]" :key="index">
                  <div class="header-box">
                    <div class="title-h">{{item.oid}}</div>
                    <div
                      class="remove"
                      v-if="item.List[0].status == 1"
                      @click="ReceiveOrder(item,index2,index)"
                    >确认收货</div>
                    <div class="delete" v-if="item.List[0].status == 2">
                      已完成
                      <van-icon class="van-icon-delete" @click="RemoveOrder(item,index2,index)"></van-icon>
                    </div>
                  </div>
                  <van-row
                    type="flex"
                    align="center"
                    v-for="(item1,index1) in item.List"
                    :key="index1"
                  >
                    <van-col>
                      <img :src="item1.smallImg" height="70" />
                    </van-col>
                    <van-col offset="1" class="desc-col">
                      <div class="desc">
                        <div>
                          <span class="title">{{item1.name}}</span>
                          <span class="rule">{{item1.rule}}</span>
                        </div>
                        <div class="enname">{{item1.enname}}</div>
                        <div class="price">￥{{item1.price}}</div>
                      </div>
                    </van-col>
                    <div class="count">X{{item1.count}}</div>
                  </van-row>
                  <div class="pay-box">
                    <div
                      class="create-time"
                    >{{ item.List[0].createdAt | formatDate('yyyy-MM-dd hh:mm:ss')}}</div>
                    <div class="desc-box">
                      <span class="count-num">共计{{item.count}}件商品</span>
                      <span>合计￥{{item.price}}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else>
                <van-empty description="订单如也,去逛一逛!">
                  <van-button round color="#0C34BA" class="bottom-button" @click="goMenu">去逛一逛</van-button>
                </van-empty>
              </div>
            </van-tab>
          </template>
        </van-tabs>
      </div>
      <div class="item"></div>
    </div>
  </div>
</template>

<script>
import { appkey } from "@/datas/key";
import { formatDate } from '@/datas/formate'
import { FindOrder, Receive, Remove } from "@/service/request";
export default {
  data() {
    return {
      active: 0,
      list: [],
      status: [0, 1, 2],
      titles: ["全部", "进行中", "已完成"]
    };
  },
  filters:{
    formatDate
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
          // console.log(res);
          let dataArr = [];
          res.result.map(mapItem => {
            if (dataArr.length == 0) {
              dataArr.push({ oid: mapItem.oid, List: [mapItem] });
            } else {
              let res = dataArr.some(item => {
                //判断相同日期，有就添加到当前项
                if (item.oid == mapItem.oid) {
                  item.List.push(mapItem);
                  return true;
                }
              });
              if (!res) {
                //如果没找相同日期添加一个新对象
                dataArr.push({ oid: mapItem.oid, List: [mapItem] });
              }
            }
          });
          this.list.push(dataArr);
        }
      }
      this.list.forEach(item => {
        item.forEach(item1 => {
          let count = 0;
          let price = 0;
          item1.List.forEach(item2 => {
            count += item2.count;
            price += item2.count * item2.price;
          });
          item1.count = count;
          item1.price = price;
        });
      });
      this.$toast.clear();
    },
    async ReceiveOrder(item, index2, index) {
      let list = {
        appkey: appkey,
        tokenString: this.$cookies.get("token"),
        oid: item.oid
      };
      let res = await Receive(list);
      if (res.code == "80000") {
        this.$toast(res.msg);
        if (this.active == 0 || this.active == 1) {
          this.list[index2].splice(index, 1);
          // console.log("111")
        } else {
          item.status = 2;
        }
      }
    },
    async RemoveOrder(item, index2, index) {
      // console.log("1");
      let list = {
        appkey: appkey,
        tokenString: this.$cookies.get("token"),
        oid: item.oid
      };
      let res = await Remove(list);
      if (res.code == "90000") {
        this.$toast(res.msg);
        if (this.active == 2) {
          this.list[index2].splice(index, 1);
          // console.log("111")
        } else {
          item.status = 2;
        }
      }
    },
    goMenu() {
      this.$router.push({ name: "Menu" });
    },
    getChange() {
      this.$toast.loading({ duration: 0 });
      this.initData();
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
      .create-time {
        color: #999;
        font-size: 13px;
      }
      /deep/ .van-tabs {
        width: 100%;
        overflow: hidden;
        /deep/ .van-tabs__nav {
          height: 40px;
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
          padding-bottom: 10px !important;
        }
        .all,
        .doing,
        .finised {
          background-color: #f5f5f5;
          // margin-top: 20px;
          padding-top: 1px;
        }
        .order-info {
          padding: 5px 0 10px;
          margin-top: 20px;
          border-radius: 14px;
          background-color: #fff;
          .header-box {
            display: flex;
            justify-content: space-between;
            padding: 5px 0 5px 10px;
            width: 100%;
            border-bottom: 1px solid rgba(0, 0, 0, 0.05);
            .title-h {
              font-size: 15px;
              font-weight: 200;
              color: #999;
            }
            .remove {
              color: #0c34ba;
              font-weight: 600;
              font-size: 14px;
              width: 130px;
            }
            .delete {
              color: #999;
              font-weight: 600;
              font-size: 14px;
              width: 130px;
              vertical-align: middle;
              .van-icon {
                font-size: 20px;
                margin-left: 10px;
                font-weight: 200;
                vertical-align: top;
              }
            }
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
          // span {
          //   color: #0c34ba;
          // }
          .pay-box {
            height: 60px;
            background-color: #fff;
            border-top: 1px dashed #e4e4e4;
            position: relative;
            font-size: 15px;
            font-weight: 600;
            color: #444;
            display: flex;
            flex-direction: column;
            padding: 0px 10px 0;
            justify-content: space-around;
            align-items: flex-start;
            padding-top: 10px;
            .create-time {
              font-size: 14px;
              font-weight: 200;
            }
            .desc-box {
              display: flex;
              // padding: 0px 10px 0;
              width: 100%;
              justify-content: space-between;
              align-items: flex-start;
              span {
                color: #0c34ba;
              }
              .count-num {
                color: #444;
              }
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