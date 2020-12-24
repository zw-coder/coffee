<template>
  <div class="pay">
    <van-nav-bar title="提交订单" left-text="返回" left-arrow @click-left="onClickLeft" />
    <div class="content">
      <div class="address-box">
        <van-cell title="选择收获地址" is-link @click="showPopup"></van-cell>
        <div class="item" v-if="getCheckedAddress">
          <div class="top">
            <span>{{ getCheckedAddress.name}}</span>
            <span>&nbsp;{{ getCheckedAddress.tel}}</span>
            <van-tag color="#0c34ba" round v-if=" getCheckedAddress.isDefault != 0">默认</van-tag>
          </div>
          <div class="bottom">
            <span>{{ getCheckedAddress.city + getCheckedAddress.province + getCheckedAddress.county +' '+ getCheckedAddress.addressDetail}}</span>
          </div>
        </div>
        <div v-else class="not-address" @click="newAddress">暂无地址,前往添加</div>
      </div>
      <div class="order-info">
        <div class="title">订单信息</div>
        <van-row v-for="(item,index) in list" :key="index" type="flex" align="center">
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
      <van-row class="submit">
        <van-col span="24">
          <van-button color=" #0c34ba" calss="pay-btn" @click="toPay">立即结算</van-button>
        </van-col>
      </van-row>
    </div>
    <van-popup v-model="show" position="bottom" :style="{ height: 'auto' }" closeable>
      <div class="content" v-if="address.length > 0">
        <van-radio-group v-model="num">
          <template v-for="item in address">
            <van-radio :name="item.id" :key="item.id" checked-color="#0c34ba">
              <div class="item">
                <div class="top">
                  <span>{{item.name}}</span>
                  <span>&nbsp;{{item.tel}}</span>
                  <van-tag color="#0c34ba" round v-if="item.isDefault != 0">默认</van-tag>
                </div>
                <div class="bottom">
                  <span>{{item.city + item.province + item.county +' '+ item.addressDetail}}</span>
                </div>
              </div>
            </van-radio>
          </template>
        </van-radio-group>
      </div>
      <van-empty v-else description="还未添加地址"></van-empty>
      <van-button color=" #0c34ba" round class="address-btn" @click="newAddress">新增地址</van-button>
    </van-popup>
  </div>
</template>

<script>
import { appkey } from "@/datas/key";
import { FindAddress, Pay, CommitShopcart } from "@/service/request";
export default {
  data() {
    return {
      show: false,
      sids: this.$route.query.sids.split("-"),
      chosenAddressId: "1",
      address: [],
      num: 0,
      list: []
    };
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    newAddress() {
      this.$router.push({ name: "NewAddress", query: { type: 2 } });
    },
    showPopup() {
      this.show = true;
    },
    async getAddress() {
      let res = await FindAddress(this.$cookies.get("token"));
      // console.log(res)
      if (res.code == 20000) {
        this.address = res.result;
        console.log(res);
        this.address.forEach(item => {
          if (item.isDefault == 1) {
            // this.checkedAddress = item;
            this.num = item.id;
          }
        });
        if (!this.checkedAddress) {
          this.checkedAddress = this.address[0];
          this.num = this.address[0].id;
        }
      }
    },
    async toPay() {
      if (this.address.length == 0) {
        this.$notify({ message: "地址不能为空" });
        return;
      } else {
        let temp = {};
        this.address.forEach(item => {
          if (item.id == this.num) temp = item;
        });
        let list = {
          appkey: appkey,
          tokenString: this.$cookies.get("token"),
          sids: JSON.stringify(this.sids),
          phone: temp.tel,
          address:
            temp.city + temp.province + temp.county + " " + temp.addressDetail,
          receiver: temp.name
        };
        // console.log(list);
        let res = await Pay(list);
        if (res.code == 60000) {
          this.$toast.success({ message: res.msg, duration: 500 });
          console.log(res);
          this.$router.push({name:'Order'})
        }
      }
    },
    async initData() {
      let res = await CommitShopcart(
        this.$cookies.get("token"),
        JSON.stringify(this.sids)
      );
      if (res.code == 50000) this.list = res.result;
    },
    newAddress() {
      this.$router.push({ name: "NewAddress", query: { type: 2 } });
    }
  },
  created() {
    // this.getAddress();
    // this.initData();
  },
  mounted(){
    // this.$router.go(0) 
    this.getAddress();
    this.initData();
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
    },
    getCheckedAddress() {
      if (!this.address) return;
      let temp = {};
      this.address.forEach(item => {
        if (item.id == this.num) temp = item;
      });
      return temp;
    }
  }
};
</script>

<style lang="scss" scoped>
.pay {
  background-color: #f5f5f5;
  position: absolute;
  min-height: 100vh;
  width: 100%;
  .content {
    padding: 16px;
    .address-box {
      height: 100px;
      background-color: #fff;
      // margin-top: 20px;
      border-radius: 12px;
      display: flex;
      justify-content: flex-start;
      flex-direction: column;
      padding: 14px 10px;
      /deep/ .van-cell__title {
        text-align: left;
        font-size: 14px;
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
        padding-bottom: 20px;
        align-items: flex-start;
        .top {
          margin-bottom: 10px;
        }
        .bottom {
          font-size: 13px;
        }
      }
    }
    .not-address {
      font-size: 14px;
      text-align: left;
      color: #0c34ba;
      font-weight: 600;
      margin-top: 20px;
      margin-left: 10px;
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
    .submit {
      position: fixed;
      bottom: 20px;
      left: 10px;
      right: 10px;
      /deep/ .van-button {
        margin-top: 16px;
        display: block;
        width: 100%;
        border-radius: 20px;
      }
    }
  }
  .van-popup {
    padding: 20px 0;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    .item {
      width: 100%;
      height: 40px;
      display: flex;
      font-size: 16px;
      flex-direction: column;
      position: relative;
      padding-left: 5%;
      margin-top: 10px;
      padding-bottom: 20px;
      align-items: flex-start;
      .top {
        margin-bottom: 10px;
      }
      .bottom {
        font-size: 13px;
      }
    }
  }
}
</style>