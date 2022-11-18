/* eslint-disable no-new */
/* eslint-disable */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/index.js';
import 'element-ui/lib/theme-chalk/index.css';
import 'vue-awesome/icons';
import store from '@/store/index';
import NormailizeCss from 'normalize.css';
import Icon from 'vue-awesome/components/Icon';
import Highcharts from 'highcharts/highstock';
import HighchartsNoData from 'highcharts/modules/no-data-to-display';
import VueCodemirror from 'vue-codemirror';
import 'codemirror/lib/codemirror.css';
import js_beautify from 'js-beautify';

HighchartsNoData(Highcharts);
import exporting from 'highcharts/modules/exporting';
import exportCsv from 'highcharts/modules/export-data';
import axios from 'axios';
import VueHead from 'vue-head';
import $ from 'jquery';
import moment from 'moment';
import macro from '@/config/macro';
import router from '@/router';
import App from '@/app';
import cookies from 'vue-cookies';
import './assets/icon/iconfont.css';

Object.defineProperty(Vue.prototype, '$moment', { value: moment });
Object.defineProperty(Vue.prototype, 'Highcharts', { value: Highcharts });
Object.defineProperty(Vue.prototype, 'GLOBAL', { value: macro });
Object.defineProperty(Vue.prototype, '$', { value: $ });
Object.defineProperty(Vue.prototype, 'Message', { value: ElementUI.Message });
Object.defineProperty(Vue.prototype, 'JsBeautify', {
  value: js_beautify.js_beautify
});
Vue.use(Highcharts);
exporting(Highcharts);
exportCsv(Highcharts);
Vue.use(ElementUI);
Vue.config.productionTip = false;
Vue.component('icon', Icon);
Vue.use(VueHead);
Vue.prototype.axios = axios;
Vue.use(VueCodemirror);

// axios全局请求拦截
axios.interceptors.request.use(
  config => {
    // 判断是否存在token，如果存在的话，则每个http header都加上token
    if (cookies.isKey('token')) {
      // 设置header
      config.headers.token = cookies.get('token');
    } else {
      // window.location.href = String.format(
      //   '{0}?targeturl={1}',
      //   'https://ec.qiyuesuo.me/workflow/qiyuesuo/integration/gettoken.jsp',
      //   'http://127.0.0.1:5000/interface/login/getToken'
      // );
      // window.location.href = String.format(
      //   '{0}?targeturl={1}',
      //   macro.CAS_LOGIN_URL,
      //   macro.SERVER_LOGIN_URL
      // );
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);
// axios全局响应拦截
axios.interceptors.response.use(
  function(response) {
    // 身份信息过期判断
    // if (
    //   cookies.isKey('username') === false &&
    //   cookies.isKey('token') === false
    // ) {
    //   // ElementUI.MessageBox.confirm('登录信息已过期,是否重新登录?', '警告', {
    //   //   confirmButtonText: '确定',
    //   //   cancelButtonText: '取消',
    //   //   type: 'error'
    //   // }).then(() => {
    //   window.location.href = String.format(
    //     '{0}?redirect={1}',
    //     macro.BASE_URL,
    //     window.location.href
    //   );
    //   // }).catch(() => {
    //   //   ElementUI.Message({
    //   //     type: 'success',
    //   //     message: '停留在原页面'
    //   //   });
    //   // });
    // }
    return response;
  },
  function(error) {
    return Promise.reject(error);
  }
);
Highcharts.setOptions({
  exporting: {
    buttons: {
      contextButton: {
        // 自定义导出菜单项目及顺序
        menuItems: [
          'printChart',
          'downloadJPEG',
          'downloadCSV',
          'downloadXLS',
          'downloadSVG'
        ]
      }
    }
  },
  lang: {
    noData: '暂无数据~~~',
    contextButtonTitle: '图表导出菜单',
    downloadJPEG: '下载 JPEG 图片',
    downloadPDF: '下载 PDF 文件',
    downloadPNG: '下载 PNG 文件',
    downloadSVG: '下载 SVG 文件',
    downloadCSV: '下载CSV文件',
    downloadXLS: '下载EXCEL文件',
    viewData: '查看表格数据',
    printChart: '打印图表'
  }
});

String.format = function() {
  if (arguments.length === 0) {
    return null;
  }

  let str = arguments[0];
  for (let i = 1; i < arguments.length; i++) {
    let re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
    str = str.replace(re, arguments[i]);
  }
  return str;
};
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
