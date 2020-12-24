<template>
  <div class="login">
    <van-row class="nav">
      <van-col span="2" offset="2" class="store-logo">
        <img :src="require('../assets/image/125.png')" height="40" width="40" />
      </van-col>
      <van-col span="4" offset="2" class="store-name">COFFE</van-col>
      <van-col span="4" offset="8" class="store-link" @click="toHomePage">先逛逛</van-col>
    </van-row>
    <van-row type="flex" justify="center" class="logo">
      <van-col>
        <img :src="require('../assets/image/125.png')" height="200px" />
      </van-col>
    </van-row>
    <van-form>
      <!-- 登录 -->
      <van-field v-model="userLogin.phone" name="手机号" label="手机号" placeholder="手机号" />
      <van-field
        v-model="userLogin.password"
        :type="ispassword ? 'password' : 'text'"
        name="密码"
        label="密码"
        placeholder="密码"
        :right-icon="ispassword ? 'closed-eye' : 'eye-o'"
        @click-right-icon="onprassword"
      />
      <!-- <div class="mima">忘记密码？</div> -->
      <div style="margin: 16px">
        <van-button round block type="info" color="#0c34ba" native-type="submit" @click="login">登录</van-button>
      </div>
      <!-- 登录 -->
      <!-- 注册 -->
      <div style="margin: 16px">
        <van-button
          class="login-btn"
          round
          block
          type="info"
          @click="showPopup"
          color="#E2E2E2"
          :style="{color:'#000'}"
          native-type="submit"
        >注册</van-button>

        <van-popup
          v-model="show"
          round
          position="bottom"
          :style="{ height: '32%', paddingTop: '20px' }"
        >
          <van-form @submit="onSubmit">
            <van-field v-model="userRegister.nickname" name="昵称" label="昵称" placeholder="昵称" />
            <van-field v-model="userRegister.phone" name="手机号" label="手机号" placeholder="手机号" />
            <van-field
              v-model="userRegister.password"
              :type="ispassword ? 'password' : 'text'"
              name="密码"
              label="密码"
              placeholder="密码"
              :right-icon="ispassword ? 'closed-eye' : 'eye-o'"
              @click-right-icon="onprassword"
            />
            <div style="margin: 16px">
              <van-button
                round
                block
                color="#0c34ba"
                type="primary"
                native-type="submit"
                @click="register"
              >注册</van-button>
            </div>
          </van-form>
        </van-popup>
      </div>
      <!-- 注册 -->
    </van-form>
  </div>
</template>

<script>
import { Login , Register} from "@/service/request";
export default {
  data() {
    return {
      // 注册
      userRegister: {
        nickname: "",
        password: "",
        phone: ""
      },
      // 登录
      userLogin: {
        password: "",
        phone: ""
      },
      // 查看密码眼睛
      ispassword: true,
      // 弹出面板
      show: false
    };
  },
  methods: {
    onprassword() {
      this.ispassword = !this.ispassword;
    },
    showPopup() {
      this.show = true;
    },
    toHomePage() {
      this.$router.push("/home");
    },
    onSubmit(){

    },
    async login() {
      let list = { phone: this.userLogin.phone, password: this.userLogin.password };
      this.$toast.loading({
        duration: 0,
        forbidClick: true,
        message: "正在登陆"
      });
      let res = await Login(list);
      if (res.code == 200) {
        console.log(res)
        this.$toast.success({
          duration: 500,
          forbidClick: true,
          message: "登陆成功"
        });
        this.$cookies.set("token", res.token, "1d");
        this.$toast.clear();
        this.$router.push("home");
      } else {
        this.$toast.fail({
          duration: 500,
          forbidClick: true,
          message: "登陆失败"
        });
      }
    },
    async register(){
        let list = { phone: this.userRegister.phone, password: this.userRegister.password ,nickname: this.userRegister.nickname};
      this.$toast.loading({
        duration: 0,
        forbidClick: true,
        message: "正在注册"
      });
      let res = await  Register(list);
      console.log(res)
      if (res.code == 100) {
        this.$toast.success({
          duration: 500,
          forbidClick: true,
          message: "注册成功"
        });
        this.userLogin.password = this.userRegister.password;
        this.userLogin.phone = this.userRegister.phone;
        this.show = false;
        this.$toast.clear();
      } else {
        this.$toast.fail({
          duration: 1000,
          forbidClick: true,
          message: res.msg
        });
      }
    }
  }
  // created(){
  //   if(this.$cookies.isKey('token')){
  //      this.$toast.success({ duration: 1000, forbidClick: true, message: "已登陆,即将跳转主页" });
  //      this.$router.push('home')
  //   }
  // }
};
</script>

<style lang="scss" scoped>
.login {
  background-color: rgb(248, 248, 248);
  height: 100vh;
  .nav {
    height: 46px;
    line-height: 46px;
    color: rgb(82, 66, 66);
    .store-name {
      font-size: 20px;
      font-weight: 600;
    }
    .store-link {
      font-size: 20px;
      font-weight: 800;
    }
  }
  .logo {
    width: 100%;
  }
  .van-cell-group {
    background-color: rgb(248, 248, 248);
    .van-button {
      width: 90%;
      border-radius: 30px;
      margin: 20px 5% 0;
    }
    .sign-btn {
      /deep/ .van-button__text {
        color: #000;
      }
    }
  }
  .van-popup {
    height: 30%;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }
}
</style>