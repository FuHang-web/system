import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/sub_menu/user/Users.vue'
import Roles from '../components/sub_menu/rights/Roles.vue'
import Rights from '../components/sub_menu/rights/Rights.vue'
import Goods from '../components/sub_menu/goods/Goods.vue'
import Params from '../components/sub_menu/goods/Params.vue'
import Categories from '../components/sub_menu/goods/Categories.vue'
import Orders from '../components/sub_menu/orders/Orders.vue'
import Reports from '../components/sub_menu/reports/Reports.vue'
import Message from '../components/sub_menu/message/Message.vue'

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: Login },
  {
    path: '/home',
    name: 'home',
    component: Home,
    redirect: '/welcome',
    children: [
      // 首页
      { path: '/welcome', name: 'welcome', component: Welcome },
      // 用户管理
      { path: '/users', name: 'users', component: Users },
      // 权限管理
      { path: '/roles', name: 'roles', component: Roles },
      { path: '/rights', name: 'rights', component: Rights },
      // 商品管理
      { path: '/goods', name: 'goods', component: Goods },
      { path: '/params', name: 'params', component: Params },
      { path: '/categories', name: 'categories', component: Categories },
      // 订单管理
      { path: '/orders', name: 'orders', component: Orders },
      // 数据统计
      { path: '/reports', name: 'reports', component: Reports },
      // 消息列表
      { path: '/message', name: 'message', component: Message },
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  // next() 放行    next('/login') 强制跳转

  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
