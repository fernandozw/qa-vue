'use strict';
const merge = require('webpack-merge');
const devEnv = require('./dev.env');

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  BASE_URL: '"http://10.130.136.98:17777"',
  MONITOR_URL: '"http://10.128.244.176:1117"',
  CAS_URL: '"https://test-sso.iqiyi.com/cas"',
  CAS_LOGOUT_URL: '"https://test-sso.iqiyi.com/cas/logout"',
  SELF_DOMAIN_NAME: '"http://10.130.136.98:18880"',
});
