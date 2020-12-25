<template>
  <div class="about">
    <van-uploader :after-read="afterRead" v-if="myInfo.userBg">
      <img v-lazy="myInfo.userBg" class="bg-img" width="100%" />
    </van-uploader>
    <div class="not-img" v-else></div>
    <div class="container">
      <div class="header">
        <img :src="myInfo.userImg" height="80px" width="80px" />
        <div class="my-info">
          <span class="name">{{myInfo.nickName || ' '}}</span>
          <span class="desc">{{myInfo.desc || '这个家伙很懒,什么都没有留下' }}</span>
        </div>
      </div>
      <div class="content" v-for="(item , index) in lists" :key="index">
        <van-cell title-style="text-align:left" :title="item.title" is-link :to="item.to" />
      </div>
    </div>
  </div>
</template>

<script>
import { appkey } from "@/datas/key";
import { FindAccountInfo, FindMyInfo ,UpdateUserBg } from "@/service/request";
export default {
  data() {
    return {
      myInfo: {},
      maxSize: 1 * 1024 * 1024,
      lists: [
        { title: "个人资料", to: { name: "Account" } },
        { title: "我的订单", to: { name: "Order" } },
        { title: "我的收藏", to: { name: "Like" } },
        { title: "收货地址", to: { name: "Address" } },
        { title: "安全中心", to: { name: "Secure" } }
      ]
    };
  },
  methods: {
    async getUserInfo() {
      let token = this.$cookies.get("token");
      if (!token) return;
      else {
        let res = await FindMyInfo(token);
        if (res.code == "A001") {
          // this.$toast.clear();
          this.myInfo = res.result[0];
        }
      }
    },
    async afterRead(file) {
      let token = this.$cookies.get("token");
      if (!token) {
        return;
      }

      //获取文件类型
      let type = file.file.type.split("/")[1];
      let imgTypes = ["png", "gif", "jpg", "jpeg"];
      if (imgTypes.indexOf(type) === -1) {
        this.$notify({
          message: "图片类型只支持" + imgTypes.join(","),
          color: "#fff",
          background: "#0C34BA"
        });

        return;
      }

      //大小
      if (this.maxSize < file.file.size) {
        this.$notify({
          message: "上传文件大小不能超过" + this.maxSize / 1024 + "KB",
          color: "#fff",
          background: "#0C34BA"
        });
        return;
      }

      //获取base64
      let base64 = file.content.replace(/data:image\/[A-Za-z]+;base64,/, "");

      // 此时可以自行将文件上传至服务器
      let res = await UpdateUserBg({
        imgType: type,
        serverBase64Img: base64,
        appkey: appkey,
        tokenString: token
      });
      // console.log(res);
      if ((res.code = "H001")) {
        this.$toast.success({ message: "修改头像成功", duration: 500 });
        this.myInfo.userBg = res.userBg;
      }
    }
  },
  created() {
    this.getUserInfo();
  }
};
</script>


<style lang="scss" scoped>
.about {
  position: absolute;
  bottom: 50px;
  top: 0;
  left: 0;
  right: 0;
  background-color: #f5f5f5;
  .bg-img{
    min-height: 200px;
  }
  .not-img {
    height: 200px;
    width: 100%;
    background-color: #0c34ba;
    border: none;
  }
  .container {
    width: 90%;
    margin: 0 5%;
    padding-bottom: 40px;
    display: flex;
    flex-direction: column;
    transform: translateY(-50px);
    background-color: #fff;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    .header {
      display: flex;
      height: 80px;
      padding: 10px 20px;
      .my-info {
        display: flex;
        flex-direction: column;
        margin-left: 20px;
        align-items: center;
        margin-top: 10px;
        .desc {
          font-size: 14px;
          font-weight: 400;
          color: #999;
        }
        .name {
          font-size: 16px;
          font-weight: 600;
          color: #0c34ba;
        }
        span {
          height: 40%;
        }
      }
      img {
        border-radius: 100%;
      }
    }
  }
}
</style>