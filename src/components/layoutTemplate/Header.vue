<template>
  <el-row id="app-header">
    <el-col :span="3" class="header-left grid-content bg-purple">
      <div class="header-left-content">
        <a href="/" class="title">
          <img src="/static/favicon.ico" alt="favicon" />
          <!--<span>QaLab</span>-->
          QaPlatform
        </a>
      </div>
    </el-col>
    <el-col :offset="17" :span="4" class="header-right">
      <div class="header-right-content">
        <i class="el-icon-user"></i>
        <el-dropdown>
          <span class="el-dropdown-link header-right-content-username">
            {{ userName }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              ><a style="text-decoration: none;color: black" @click="logout"
                >退出登录</a
              >
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-col>
  </el-row>
</template>

<style>
@import '../../css/header.css';
</style>

<script>
import cookies from 'vue-cookies';

export default {
  data() {
    return {
      // 获取用户名称
      userName: cookies.get('username') ? cookies.get('username') : 'Missing'
    };
  },
  methods: {
    // 退出登录
    logout: function() {
      cookies.remove(
        'oaUserId',
        this.GLOBAL.COOKIE_PATH,
        this.GLOBAL.COOKIE_DOMAIN
      );
      cookies.remove(
        'username',
        this.GLOBAL.COOKIE_PATH,
        this.GLOBAL.COOKIE_DOMAIN
      );
      cookies.remove(
        'token',
        this.GLOBAL.COOKIE_PATH,
        this.GLOBAL.COOKIE_DOMAIN
      );
      cookies.remove(
        'mobile',
        this.GLOBAL.COOKIE_PATH,
        this.GLOBAL.COOKIE_DOMAIN
      );
      window.location.href = this.GLOBAL.CAS_LOGOUT_URL;
    }
  }
};
</script>
