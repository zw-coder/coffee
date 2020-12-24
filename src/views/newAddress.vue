<template>
  <div class="new-address">
    <van-nav-bar
      :title="title==1?'编辑地址':'新增地址'"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="container">
      <van-address-edit
        :area-list="areaList"
        show-postal
        show-delete
        show-set-default
        show-search-result
        :address-info="addressInfo"
        :area-columns-placeholder="['请选择', '请选择', '请选择']"
        @save="onSave"
        @delete="onDelete"
      />
    </div>
  </div>
</template>

<script>
import {
  FindAddressByAid,
  AddAddress,
  DeleteAddress,
  EditAddress
} from "@/service/request";
import { appkey } from "@/datas/key";
import areaList from "@/datas/areaList";
export default {
  data() {
    return {
      title: this.$route.query.type,
      aid: this.$route.query.aid,
      areaList,
      //地址数据初始值
      addressInfo: {
        id: "",
        name: "",
        tel: "",
        province: "",
        city: "",
        county: "",
        addressDetail: "",
        areaCode: "",
        postalCode: "",
        isDefault: false
      }
    };
  },
  created() {
    this.initAddress();
  },
  methods: {
    onClickLeft() {
      this.$router.push({name:'My'});
    },
    async onSave(address) {
      address.appkey = appkey;
      address.tokenString = this.$cookies.get("token");
      address.isDefault = address.isDefault ? 1 : 0;
      if (this.title == 2) {
        let res = await AddAddress(address);
        if (res.code == 9000) {
          this.$toast.success({ duration: 500 });
          this.$router.push({ name: "Address" });
        }
      } else {
        console.log(address);
        address.aid = this.aid;
        delete address.country;
        delete address.id;
        let res1 = await EditAddress(address);
        console.log(res1);
        if (res1.code == 30000) {
          this.$toast.success({message:res1.msg, duration: 500 });
          this.$router.push({ name: "Address" });
        }
      }
    },
    async onDelete() {
      if (this.title == 1) {
        let res = await DeleteAddress({
          appkey: appkey,
          tokenString: this.$cookies.get("token"),
          aid: this.aid
        });
        if (res.code == 10000) {
          this.$toast.success({ message: res.msg, duration: 500 });
          this.$router.push({ name: "Address" });
        }
      }
    },
    async initAddress() {
      let tokenString = this.$cookies.get("token");
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }
      if (this.title == 1) {
        let res = await FindAddressByAid(this.aid, tokenString);
        if (res.code == 40000) {
          for (let key in this.addressInfo) {
            if (key == "id") {
              this.addressInfo[key] = res.result[0].aid;
              continue;
            }

            this.addressInfo[key] =
              key == "isDefault"
                ? Boolean(res.result[0][key])
                : res.result[0][key];
          }
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.new-address {
  width: 100%;
}
.container {
  background-color: #f5f5f5;
  align-items: center;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
/deep/ .van-address-edit {
  width: 92%;
  .van-switch--on {
    background-color: #0c34ba;
  }
  .van-button--danger {
    background-color: #0c34ba;
    border: none;
  }
}
</style>