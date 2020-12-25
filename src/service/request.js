import {
  axiosGet,
  axiosPost
} from '@/libs/http'


import {
  appkey
} from '@/datas/key'

function getBanner() {
  return new Promise((resolve, reject) => {
    axiosGet({
      url: '/api/banner?',
      success(data) {
        resolve(data);
      },
      error(err) {
        reject(err);
      }
    })
  })
}

function getHotList() {
  return new Promise((resolve, reject) => {
    axiosGet({
      url: '/api/typeProducts?key=isHot&value=1',
      success(data) {
        resolve(data);
      },
      error(err) {
        reject(err);
      }
    })
  })
}

function getTypeList(t, value) {
  let type = new Promise((resolve, reject) => {
    axiosGet({
      url: `/api/typeProducts?key=${t}&value=${value}`,
      success(data) {
        resolve(data);
      },
      error(err) {
        reject(err)
      }
    })
  })
  return type;
}

function getDetail(id) {
  return new Promise((resolve, reject) => {
    axiosGet({
      url: `/api/productDetail?pid=${id}`,
      success(data) {
        resolve(data);
      },
      error(err) {
        reject(err)
      }
    })
  })
}


function Login(list) {
  return new Promise((resolve, reject) => {
    list.appkey = appkey
    axiosPost({
      url: `/api/login`,
      data: list,
      success(data) {
        resolve(data);
      },
      error(err) {
        reject(err)
      }
    })
  })
}

function Register(list) {
  return new Promise((resolve, reject) => {
    list.appkey = appkey
    axiosPost({
      url: `/api/register`,
      data: list,
      success(data) {
        resolve(data);
      },
      error(err) {
        reject(err)
      }
    })
  })
}

function FindAccountInfo(token) {
  return new Promise((resolve, reject) => {
    axiosGet({
      url: `/api/findAccountInfo?tokenString=${token}`,
      success(data) {
        resolve(data);
      },
      error(err) {
        reject(err)
      }
    })
  })
}


function FindMyInfo(token) {
  return new Promise((resolve, reject) => {
    axiosGet({
      url: `/api/findMy?tokenString=${token}`,
      success(data) {
        resolve(data);
      },
      error(err) {
        reject(err)
      }
    })
  })
}


function Search(keyword) {
  return new Promise((resolve, reject) => {
    axiosGet({
      url: `/api/search?name=${keyword}`,
      success(data) {
        resolve(data);
      },
      error(err) {
        reject(err)
      }
    })
  })
}

function LikeAndNotLike(type, list) {
  let temp = type ? 'like' : 'notlike';
  return new Promise((resolve, reject) => {
    axiosPost({
      url: `/api/${temp}`,
      data: list,
      success(data) {
        resolve(data);
      },
      error(err) {
        reject(err)
      }
    })
  })
}

function FindLike(token, pid) {
  let temp = pid ? 'findlike' : 'findAllLike';
  return new Promise((resolve, reject) => {
    axiosGet({
      url: `/api/${temp}?pid=${pid}&tokenString=${token}`,
      success(data) {
        resolve(data);
      },
      error(err) {
        reject(err)
      }
    })
  })
}

function GetShopCartCount(token) {
  return new Promise((resolve, reject) => {
    axiosGet({
      url: `/api/shopcartCount?tokenString=${token}`,
      success(data) {
        resolve(data);
      },
      error(err) {
        reject(err)
      }
    })
  })
}

function AddShopCart(list) {
  return new Promise((resolve, reject) => {
    axiosPost({
      url: '/api/addShopcart',
      data: list,
      success(data) {
        resolve(data)
      },
      error(err) {
        reject(err)
      }
    })
  })
}

function ShopCartRow(token) {
  return new Promise((resolve, reject) => {
    axiosGet({
      url: `/api/shopcartRows?tokenString=${token}`,
      success(data) {
        resolve(data);
      },
      error(err) {
        reject(err)
      }
    })
  })
}

function FindAllShopCart(token) {
  return new Promise((resolve, reject) => {
    axiosGet({
      url: `/api/findAllShopcart?tokenString=${token}`,
      success(data) {
        resolve(data);
      },
      error(err) {
        reject(err)
      }
    })
  })
}

function ModifyShopcartCount(list) {
  return new Promise((resolve, reject) => {
    axiosPost({
      url: '/api/modifyShopcartCount',
      data: list,
      success(data) {
        resolve(data)
      },
      error(err) {
        reject(err)
      }
    })
  })
}

function RemoveShopcart(list) {
  return new Promise((resolve, reject) => {
    axiosPost({
      url: '/api/removeShopcart',
      data: list,
      success(data) {
        resolve(data)
      },
      error(err) {
        reject(err)
      }
    })
  })
}

function FindAddress(token) {
  return new Promise((resolve, reject) => {
    axiosGet({
      url: `/api/findAddress?tokenString=${token}`,
      success(data) {
        resolve(data);
      },
      error(err) {
        reject(err)
      }
    })
  })
}

function FindAddressByAid(aid, token) {
  return new Promise((resolve, reject) => {
    axiosGet({
      url: `/api/findAddressByAid?tokenString=${token}&aid=${aid}`,
      success(data) {
        resolve(data);
      },
      error(err) {
        reject(err)
      }
    })
  })
}

function AddAddress(list) {
  return new Promise((resolve, reject) => {
    axiosPost({
      url: '/api/addAddress',
      data: list,
      success(data) {
        resolve(data)
      },
      error(err) {
        reject(err)
      }
    })
  })
}

function DeleteAddress(list) {
  return new Promise((resolve, reject) => {
    axiosPost({
      url: '/api/deleteAddress',
      data: list,
      success(data) {
        resolve(data)
      },
      error(err) {
        reject(err)
      }
    })
  })
}

function UpdateNickName(list) {
  return new Promise((resolve, reject) => {
    axiosPost({
      url: '/api/updateNickName',
      data: list,
      success(data) {
        resolve(data)
      },
      error(err) {
        reject(err)
      }
    })
  })
}

function UpdateDesc(list) {
  return new Promise((resolve, reject) => {
    axiosPost({
      url: '/api/updateDesc',
      data: list,
      success(data) {
        resolve(data)
      },
      error(err) {
        reject(err)
      }
    })
  })
}


function UpdateAvatar(list) {
  return new Promise((resolve, reject) => {
    axiosPost({
      url: '/api/updateAvatar',
      data: list,
      success(data) {
        resolve(data)
      },
      error(err) {
        reject(err)
      }
    })
  })
}

function UpdatePassword(list) {
  return new Promise((resolve, reject) => {
    axiosPost({
      url: '/api/updatePassword',
      data: list,
      success(data) {
        resolve(data)
      },
      error(err) {
        reject(err)
      }
    })
  })
}

function Logout(list) {
  return new Promise((resolve, reject) => {
    axiosPost({
      url: '/api/logout',
      data: list,
      success(data) {
        resolve(data)
      },
      error(err) {
        reject(err)
      }
    })
  })
}

function DestroyAccount(list) {
  return new Promise((resolve, reject) => {
    axiosPost({
      url: '/api/destroyAccount',
      data: list,
      success(data) {
        resolve(data)
      },
      error(err) {
        reject(err)
      }
    })
  })
}

function UpdateUserBg(list) {
  return new Promise((resolve, reject) => {
    axiosPost({
      url: '/api/updateUserBg',
      data: list,
      success(data) {
        resolve(data)
      },
      error(err) {
        reject(err)
      }
    })
  })
}

function EditAddress(list) {
  return new Promise((resolve, reject) => {
    axiosPost({
      url: '/api/editAddress',
      data: list,
      success(data) {
        resolve(data)
      },
      error(err) {
        reject(err)
      }
    })
  })
}

function Pay(list) {
  return new Promise((resolve, reject) => {
    axiosPost({
      url: '/api/pay',
      data: list,
      success(data) {
        resolve(data)
      },
      error(err) {
        reject(err)
      }
    })
  })
}

function CommitShopcart(token, sids) {
  return new Promise((resolve, reject) => {
    axiosGet({
      url: `/api/commitShopcart?tokenString=${token}&sids=${sids}`,
      success(data) {
        resolve(data);
      },
      error(err) {
        reject(err)
      }
    })
  })
}

function FindOrder(token, status) {
  return new Promise((resolve, reject) => {
    axiosGet({
      url: `/api/findOrder?tokenString=${token}&status=${status}`,
      success(data) {
        resolve(data);
      },
      error(err) {
        reject(err)
      }
    })
  })
}

function Receive(list) {
  return new Promise((resolve, reject) => {
    axiosPost({
      url: '/api/receive',
      data: list,
      success(data) {
        resolve(data)
      },
      error(err) {
        reject(err)
      }
    })
  })
}

function Remove(list) {
  return new Promise((resolve, reject) => {
    axiosPost({
      url: '/api/removeOrder',
      data: list,
      success(data) {
        resolve(data)
      },
      error(err) {
        reject(err)
      }
    })
  })
}

function RetrievePassword(list){
  return new Promise((resolve, reject) => {
    axiosPost({
      url: '/api/retrievePassword',
      data: list,
      success(data) {
        resolve(data)
      },
      error(err) {
        reject(err)
      }
    })
  })
}

export {
  getBanner,
  getHotList,
  getTypeList,
  getDetail,
  Login,
  Register,
  FindAccountInfo,
  FindMyInfo,
  Search,
  LikeAndNotLike,
  FindLike,
  GetShopCartCount,
  AddShopCart,
  ShopCartRow,
  FindAllShopCart,
  ModifyShopcartCount,
  RemoveShopcart,
  FindAddress,
  FindAddressByAid,
  AddAddress,
  DeleteAddress,
  UpdateNickName,
  UpdateDesc,
  UpdateAvatar,
  UpdatePassword,
  Logout,
  DestroyAccount,
  UpdateUserBg,
  EditAddress,
  Pay,
  CommitShopcart,
  FindOrder,
  Receive,
  Remove,
  RetrievePassword
}