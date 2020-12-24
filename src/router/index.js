import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login'
Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/main',
    name: 'main',
    component: () =>
      import('../views/main.vue'),
    redirect: '/home',
    children: [{
        path: '/menu',
        name: 'Menu',
        component: () =>
          import('../views/main/menu')
      },
      {
        path: '/home',
        name: 'Homepage',
        component: () =>
          import('../views/main/first')
      },
      {
        path: '/shop',
        name: 'Shopbag',
        component: () =>
          import('../views/main/shop')
      },
      {
        path: '/about',
        name: 'My',
        component: () =>
          import('../views/main/about')
      }
    ]
  },
  {
    path: 'account',
    name: 'Account',
    component: () => import('../views/account')
  },
  {
    path: '/like',
    name: 'Like',
    component: () => import('../views/like')
  },
  {
    path: '/address',
    name: 'Address',
    component: () => import('../views/address')
  },
  {
    path: '/secure',
    name: 'Secure',
    component: () => import('../views/secure')
  },
  {
    path: '/order',
    name: 'Order',
    component: () => import('../views/order')
  },
  {
    path: '/detail',
    name: 'Detail',
    component: () => import("../views/detail")
  },
  {
    path:'/search',
    name:'Search',
    component:()=>import('../views/search')
  },
  {
    path:'pay',
    name:'Pay',
    component:()=>import('../views/pay')
  },
  {
    path:'newAddress',
    name:'NewAddress',
    component:()=>import('../views/newAddress')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router