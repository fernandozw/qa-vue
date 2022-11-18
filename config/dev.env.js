'use strict';
const merge = require('webpack-merge');
const devEnv = require('./dev.env');

// module.exports = {
//   NODE_ENV: '"development"',
//   BASE_URL: '"http://127.0.0.1:8081/qa_backend"',
//   MONITOR_URL: '"http://127.0.0.1:5000/interface"',
//   CAS_LOGOUT_URL: '"https://ec.qiyuesuo.me/wui/index.html"',
//   CAS_LOGIN_URL: '"https://ec.qiyuesuo.me/workflow/qiyuesuo/integration/gettoken.jsp"',
//   SERVER_LOGIN_URL: '"http://qa.qiyuesuo.test/interface/login/getToken"',
//   SELF_DOMAIN_NAME: '"http://qa.qiyuesuo.test/"'
// };

module.exports = {
  NODE_ENV: '"development"',
  TW_URL:'"http://localhost:7880"',
  BASE_URL: '"http://localhost:9999/qa_backend"',
  WEBUI_URL:'"http://localhost:9998/webui"',
  // MONITOR_URL: '"http://localhost:5000/interface"',
  MONITOR_URL: '"http://127.0.0.1:5000/interface"',
  CAS_LOGOUT_URL: '"https://ec.qiyuesuo.me/wui/index.html"',
  CAS_LOGIN_URL: '"https://ec.qiyuesuo.me/workflow/qiyuesuo/integration/gettoken.jsp"',
  SERVER_LOGIN_URL: '"http://localhost:5000/interface/login/getToken"',
  SELF_DOMAIN_NAME: '"http://localhost:8080"',
  COOKIE_PATH:'"/"',
  COOKIE_DOMAIN:'"localhost"',
  RANCHER_URL:'"http://0.0.0.0:8080"',
  ENGINE_URL: '"http://localhost:9001"'
};



