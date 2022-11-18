/* eslint-disable no-new */
/* eslint-disable */
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    isCollapse: false
  },
  mutations: {
    changeCollapse(state) {
      // if (state.isCollapse) {
      //   state.isCollapse = false
      // } else {
      //   state.isCollapse = true
      // }
      state.isCollapse = !state.isCollapse;
    }
  },
  cookies: {token: null}
});

export default {
  BASE_URL: process.env.BASE_URL, // 读取根目录configurl
  WEBUI_URL:process.env.WEBUI_URL,
  MONITOR_URL: process.env.MONITOR_URL, // 读取根目录config中接口自动化的url
  SELF_DOMAIN_NAME: process.env.SELF_DOMAIN_NAME,
  CAS_LOGOUT_URL: process.env.CAS_LOGOUT_URL,
  CAS_LOGIN_URL: process.env.CAS_LOGIN_URL,
  SERVER_LOGIN_URL: process.env.SERVER_LOGIN_URL,
  COOKIE_PATH: process.env.COOKIE_PATH,
  COOKIE_DOMAIN: process.env.COOKIE_DOMAIN,
  TOKEN: 'token',
  USERNAME: 'username',
  // 判断是否为json
  checkJson(str) {
    if (typeof str === 'string') {
      try {
        let obj = JSON.parse(str);
        if (typeof obj === 'object' && obj) {
          return true;
        } else {
          return false;
        }
      } catch (e) {
        return false;
      }
    }
  },
  pickerOptions1: {
    // disabledDate(time) {
    //   return time.getTime() > Date.now()
    // },
    shortcuts: [
      {
        text: '今天',
        onClick(picker) {
          picker.$emit('pick', new Date());
        }
      },
      {
        text: '昨天',
        onClick(picker) {
          const date = new Date();
          date.setTime(date.getTime() - 3600 * 1000 * 24);
          picker.$emit('pick', date);
        }
      },
      {
        text: '一周前',
        onClick(picker) {
          const date = new Date();
          date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
          picker.$emit('pick', date);
        }
      },
      {
        text: '一月前',
        onClick(picker) {
          const date = new Date();
          date.setTime(date.getTime() - 3600 * 1000 * 24 * 30);
          picker.$emit('pick', date);
        }
      }
    ]
  },
  storeForALl: store,
  sleep: function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  // string_format: function (args) {
  //   if (args.length === 0) {
  //     return null;
  //   }
  //
  //   let str = args[0];
  //   for (let i = 1; i < args.length; i++) {
  //     let re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
  //     str = str.replace(re, args[i]);
  //   }
  //   return str;
  // },
  // 时间控件
  pickerOptions: {
    shortcuts: [
      {
        text: '最近一周',
        onClick(picker) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
          picker.$emit('pick', [start, end]);
        }
      },
      {
        text: '最近一个月',
        onClick(picker) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
          picker.$emit('pick', [start, end]);
        }
      },
      {
        text: '最近三个月',
        onClick(picker) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
          picker.$emit('pick', [start, end]);
        }
      }
    ]
  },
  // 日期控件
  pickerOptionsDay: {
    // disabledDate(time) {
    //   return time.getTime() > Date.now();
    // },
    shortcuts: [
      {
        text: '今天',
        onClick(picker) {
          picker.$emit('pick', new Date());
        }
      },
      {
        text: '昨天',
        onClick(picker) {
          const date = new Date();
          date.setTime(date.getTime() - 3600 * 1000 * 24);
          picker.$emit('pick', date);
        }
      },
      {
        text: '一周前',
        onClick(picker) {
          const date = new Date();
          date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
          picker.$emit('pick', date);
        }
      }
    ]
  }
};
