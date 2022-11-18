/* eslint-disable no-new */
/* eslint-disable */
import Vue from 'vue';
import Router from 'vue-router';
import menu from '@/config/menuConfig';
import macro from '@/config/macro';
import cookies from 'vue-cookies';

Vue.use(Router);

var routers = [];

routers.push({
  path: '/',
  redirect: '/caseInterface/case'
});
// 获取菜单
var getMenu = param =>
  param.forEach(item => {
    if (item.entity.path) {
      routers.push({
        path: item.entity.path,
        name: item.entity.component,
        component: () =>
          import('@/components/rootPageTemplate/' + item.entity.component),
        meta: { requireAuth: true, keepAlive: true }
      });
    }
    //回调函数,判断当前节点下是否还有子节点
    if (item.childs) {
      getMenu(item.childs);
    }
  });
getMenu(menu);

const router = new Router({ mode: 'history', routes: routers });

//登录验证
// router.beforeEach((to, from, next) => {
//     if (cookies.get('token') !== null) {
//       next();
//     } else {
//       window.location.href = String.format(
//         '{0}?targeturl={1}',
//         macro.CAS_LOGIN_URL,
//         macro.SERVER_LOGIN_URL
//       );
//     }
//   }
// );


// 解决重复点击路由tab报错的问题
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};
export default router;
