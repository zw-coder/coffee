<template>
  <div class="secure">
    <van-nav-bar title="安全中心" left-text="返回" left-arrow @click-left="onClickLeft" />
    <div class="container">
      <div class="bg"></div>
      <div class="content">
        <van-cell class="item" title="修改密码" is-link @click="show = !show" />
        <van-cell class="item" title="注销账号" is-link @click="deleteAccount" />
      </div>
      <van-button
        round
        block
        color="#0c34ba"
        type="primary"
        native-type="submit"
        @click="Logout"
        class="logout-btn"
      >退出登陆</van-button>
      <van-popup
        v-model="show"
        round
        position="bottom"
        :style="{ height: '32%', paddingTop: '20px' }"
      >
        <div style="height:40px;text-align:left;font-size:18px;margin-left:10px;">修改密码</div>
        <van-form>
          <van-field
            v-model="oldPassword"
            :type="isOldpassword ? 'password' : 'text'"
            name="密码"
            label="旧密码"
            placeholder="旧密码"
            :right-icon="isOldpassword ? 'closed-eye' : 'eye-o'"
            @click-right-icon="onOldprassword"
          />

          <van-field
            v-model="newPassword"
            :type="isNewpassword ? 'password' : 'text'"
            name="密码"
            label="新密码"
            placeholder="新密码"
            :right-icon="isNewpassword ? 'closed-eye' : 'eye-o'"
            @click-right-icon="onNewprassword"
          />
          <div style="margin: 16px">
            <van-button
              round
              block
              color="#0c34ba"
              type="primary"
              native-type="submit"
              @click="changePassword"
            >确认修改</van-button>
          </div>
        </van-form>
      </van-popup>
    </div>
  </div>
</template>

<script>
import { UpdatePassword, Logout, DestroyAccount } from "@/service/request";
import { appkey } from "@/datas/key";
export default {
  data() {
    return {
      show: false,
      oldPassword: "",
      newPassword: "",
      isOldpassword: true,
      isNewpassword: true
    };
  },
  methods: {
    onClickLeft() {
      this.$router.push({ name: "My" });
    },
    async changePassword() {
      if (this.oldPassword == "" || this.newPassword == "") return;
      let token = this.$cookies.get("token");
      // console.log("token", token);
      if (!token) {
        this.$notify("您还未登陆!");
        return;
      }
      let res = await UpdatePassword({
        appkey: appkey,
        tokenString: token,
        password: this.newPassword,
        oldPassword: this.oldPassword
      });
      if (res.code != "E001") {
        this.$toast.fail({ message: res.msg, duration: 500 });
      } else {
        this.$toast.success({
          message: res.msg + ",请重新登陆",
          duration: 1000
        });
        this.show = false;
        this.$routre.push({ name: "Login" });
      }
    },
    onNewprassword() {
      this.isNewpassword = !this.isNewpassword;
    },
    onOldprassword() {
      this.isOldpassword = !this.isOldpassword;
    },
    Logout() {
      let token = this.$cookies.get("token");
      // console.log(token);
      if (!token) {
        this.$notify({message:"您还未登陆!正在跳转登陆页",duration:800});
        setTimeout(()=>{
        this.$router.push({name:"Login"})
        },1000)
      } else {
        this.$dialog
          .confirm({
            title: "",
            message: "确认退出登陆吗?"
          })
          .then(() => {
            Logout({ appkey: appkey, tokenString: token }).then(res => {
              if (res.code == "F001") {
                this.$cookies.remove("token");
                this.$toast.success({ message: res.msg, duration: 1000 });
                this.$router.push({ name: "Login" });
              }
            });
          })
          .catch(() => {
            // on cancel
          });
      }
    },
    async deleteAccount() {
      let token = this.$cookies.get("token");
      // console.log(token);
      if (!token) {
        this.$notify("您还未登陆!");
      } else {
        let res = await DestroyAccount({ appkey: appkey, tokenString: token });
        if (res.code == "G001") {
          this.$cookies.remove("token");
          this.$toast.success({
            message: "注销成功!请重新登陆",
            duration: 1000
          });
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.secure {
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
        text-align: left;
      }
    }
    .logout-btn {
      width: 90%;
      margin-top: 40px;
    }
  }
}
</style>