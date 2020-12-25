<template>
  <div class="shop">
    <van-nav-bar title="购物车" left-text="返回" left-arrow @click-left="onClickLeft" />
    <img :src="require('../../assets/image/images/shopbag_bg.png')" alt class="bg-img" />
    <div class="check" v-if="list.length > 0">
      <van-row v-for="(item,index) in list" :key="index" type="flex" align="center">
        <van-swipe-cell :name="item.sid" :before-close="beforeClose">
          <div class="all">
            <van-col offset="1">
              <van-checkbox v-model="item.checked" checked-color="#0C34BA"></van-checkbox>
            </van-col>
            <van-col offset="1">
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
            <div class="count">
              <van-stepper
                v-model="item.count"
                async-change
                @change="onChange(item.count,item)"
                theme="round"
                button-size="24"
                disable-input
              />
            </div>
          </div>
          <van-button
            slot="right"
            color="#0C34BA"
            square
            text="删除"
            type="danger"
            class="delete-button"
          />
        </van-swipe-cell>
      </van-row>
    </div>
    <div v-else>
      <van-empty description="购物袋空空如也,去逛一逛!">
        <van-button round color="#0C34BA" class="bottom-button" @click="goMenu">去逛一逛</van-button>
      </van-empty>
    </div>
    <van-submit-bar
      :price="getPrice"
      button-color="#0C34BA"
      button-text="提交订单"
      @submit="onSubmit"
      :disabled="!isChecked"
    >
      <van-checkbox v-model="isAll" @click="checkedAll" checked-color="#0C34BA">全选</van-checkbox>
    </van-submit-bar>
  </div>
</template>

<script>
import { appkey } from "@/datas/key";

import {
  ShopCartRow,
  FindAllShopCart,
  ModifyShopcartCount,
  RemoveShopcart
} from "@/service/request";
export default {
  data() {
    return {
      list: [],
      count: [],
      all: false
    };
  },
  created() {
    // this.initData();
  },
  mounted() {
    this.initData();
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    onSubmit() {
      let sids = []
       this.list.forEach(item=>{
        if(item.checked) sids.push(item.sid)
      })
      let a = sids.join('-')
      // let a =  JSON.stringify(sids)
      this.$router.push({
        name: "Pay",
        query: {sids: a}
        });
    },
    async initData() {
      let token = this.$cookies.get("token");
      let res = await FindAllShopCart(token);
      res.result.map((item, index) => {
        this.list.push(Object.assign({}, item, { checked: false }));
      });
      // console.log(this.list);
      this.count = res.result.map(v => v.count);
    },
    async onChange(count, item) {
      let res = await ModifyShopcartCount({
        appkey: appkey,
        tokenString: this.$cookies.get("token"),
        count: count,
        sid: item.sid
      });
      if (res.code == 600) {
        // this.initData();
      }
    },
    beforeClose({ position, instance, name }) {
      switch (position) {
        case "left":
        case "cell":
        case "outside":
          instance.close();
          break;
        case "right":
          this.$dialog
            .confirm({
              message: "确定删除吗？"
            })
            .then(() => {
              instance.close();
              RemoveShopcart({
                appkey: appkey,
                tokenString: this.$cookies.get("token"),
                sids: JSON.stringify([name])
              }).then(res => {
                if (res.code == 7000) {
                  this.$toast.success({ message: "删除成功", duration: 500 });
                  this.list = [];
                  this.initData();
                }
              });
              // console.log(res)
            })
            .catch(() => {
              //点击取消按钮后的调用
              return;
            });
          break;
      }
    },
    checkedAll() {
      this.list.forEach(item => {
        item.checked = !this.all;
      });
    },
    goMenu() {
      this.$router.push({ name: "Menu" });
    }
  },
  computed: {
    isAll: {
      get() {
        let type = true;
        this.list.forEach(item => {
          if (item.checked == false) type = false;
        });
        return type;
      },
      set() {
        let type = true;
        this.list.forEach(item => {
          if (item.checked == false) type = false;
        });
        this.all = type;
      }
    },
    getPrice() {
      let price = 0;
      this.list.forEach(item => {
        if (item.checked) price = price + item.price * item.count;
      });
      return price * 100;
    },
    isChecked() {
      let type = false;
      this.list.forEach(item => {
        if (item.checked == true) type = true;
      });
      return type;
    }
  }
  // watch:{
  //   $route(to,from){
  //     console.log(to.path)
  //     this.list =[]
  //     this.initData();
  //     console.log('加载数据')
  //   }
  // }
};
</script>

<style lang="scss" scoped>
.shop {
  position: absolute;
  bottom: 50px;
  top: 0;
  left: 0;
  right: 0;
  background-color: #f5f5f5;
  .bg-img {
    width: 100%;
  }
  /deep/ .van-swipe-cell__right .van-button {
    height: 100%;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  }

  /deep/ .van-swipe-cell__right {
    padding-top: 0px;
    padding-bottom: 0px;
    box-sizing: border-box;
  }
  .check {
    .van-row {
      position: relative;
      width: 90%;
      margin: 10px 5%;
      background-color: #fff;
      border-radius: 10px;
      .van-swipe-cell {
        width: 100%;
        height: 100%;
        margin: 10px 0;
        line-height: 100%;
        .delete-button {
          height: 100%;
        }
        .all {
          display: flex;
          align-items: center;
        }
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
          right: 10px;
          bottom: 0px;
          /deep/ .van-stepper__plus {
            background: #0c34ba;
          }
          /deep/ .van-stepper__minus {
            color: #0c24ba;
            border-color: #0c24ba;
          }
        }
      }
    }
  }
  .empty {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .desc {
      font-size: 16px;
      color: rgb(129, 129, 129);
      margin-bottom: 20px;
    }
  }
}
</style>