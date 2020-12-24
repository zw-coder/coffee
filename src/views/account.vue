<template>
  <div class="account">
    <van-nav-bar title="个人资料" left-text="返回" left-arrow @click-left="onClickLeft" />
    <div class="container">
      <div class="bg"></div>
      <div class="content">
        <div class="item login" v-if="!account" @click.stop="Login">请先登陆</div>
        <div class="item">
          <span>头像</span>
          <span>
            <van-uploader :after-read="afterRead">
              <img :src="account.userImg" alt height="40" />
            </van-uploader>
          </span>
        </div>
        <div class="item">
          <span>用户ID</span>
          <span class="id">{{account.userId}}</span>
        </div>
        <div class="item">
          <span>手机号</span>
          <span class="phone">{{account.phone}}</span>
        </div>
        <div class="item">
          <span>昵称</span>
          <input
            class="nickname"
            type="text"
            v-model="account.nickName"
            @change="changeInfo('nickname')"
          />
        </div>
        <div class="item desc-box">
          <div>简介</div>
          <textarea class="desc" v-model="account.desc" @change="changeInfo('desc')"></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { appkey } from "@/datas/key";
import {
  FindAccountInfo,
  UpdateNickName,
  UpdateDesc,
  UpdateAvatar
} from "@/service/request";
export default {
  data() {
    return {
      account: {},
      maxSize: 1 * 1024 * 1024
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    async initData() {
      let token = this.$cookies.get("token");
      if (!token) {
        this.$notify({ message: "您还未登陆!", duration: 1500 });
      }
      let res = await FindAccountInfo(token);
      console.log(res);
      if (res.code == "B001") {
        this.account = res.result[0];
      }
    },
    onClickLeft() {
      this.$router.push({ name: "My" });
    },
    async changeInfo(type) {
      let token = this.$cookies.get("token");
      if (!token) {
        return;
      }
      if (type == "nickname") {
        let res = await UpdateNickName({
          nickName: this.account.nickName,
          appkey: appkey,
          tokenString: token
        });
        if ((res.code = "C001")) {
          this.$toast.success({ message: "修改昵称成功", duration: 500 });
          this.account = res.result[0];
        }
      } else {
        let res1 = await UpdateDesc({
          desc: this.account.desc,
          appkey: appkey,
          tokenString: token
        });
        if ((res1.code = "D001"))
          this.$toast.success({ message: "修改简介成功", duration: 500 });
        this.account = res1.result[0];
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
      let res = await UpdateAvatar({
        imgType: type,
        serverBase64Img: base64,
        appkey: appkey,
        tokenString: token
      });
      // console.log(res);
      if ((res.code = "H001")) {
        this.$toast.success({ message: "修改头像成功", duration: 500 });
        this.account.userImg = res.userImg;
      }
    },
    Login() {
      this.$router.push({ name: "Login" });
    }
  }
};
</script>

<style lang="scss" scoped>
.account {
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
      .item {
        display: flex;
        justify-content: space-between;
        padding: 0 10px;
        width: 100%;
        height: 50px;
        align-items: center;
        border-bottom: 1px solid rgba(0, 0, 0, 0.02);
        flex-wrap: wrap;
        font-size: 14px;
        img {
          border-radius: 100%;
        }

        .id,
        .nickname,
        .phone,
        .desc {
          color: #959699;
        }
        .nickname {
          border: none;
          width: 80px;
          text-align: right;
        }
      }
      .login {
        color: #0c34ba;
        font-size: 18px;
        font-weight: 600;
      }
      .desc-box {
        display: block;
        text-align: left;
        padding: 10px 10px;
        .desc {
          width: 100%;
          border: none;
          margin-top: 5px;
        }
      }
    }
  }
}
</style>