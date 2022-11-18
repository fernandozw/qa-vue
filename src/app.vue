<template>
  <div id="app">
    <el-container id="app-container">
      <el-header id="app-header">
        <rheader></rheader>
      </el-header>
      <el-container id="app-content">
        <el-aside class="app-content-left" width="12.5%">
          <el-menu
            :default-active="$route.path"
            class="el-menu-demo mainContainer-aside-menu"
            background-color="#222d32"
            text-color="#fff"
            active-text-color="#ffd04b"
            router
          >
            <!--递归调用菜单组件-->
            <rnav :navMenus="menuData"></rnav>
          </el-menu>
        </el-aside>
        <el-main class="app-content-right">
          <div class="app-content-right-tabs">
            <el-tabs
              v-model="activeIndex"
              type="card"
              closable
              @tab-click="tabClick"
              v-if="options.length"
              @tab-remove="tabRemove"
            >
              <el-tab-pane
                v-for="item in options"
                :key="item.name"
                :label="item.title"
                :name="item.route"
              >
              </el-tab-pane>
            </el-tabs>
          </div>
          <!-- 需要缓存的视图组件 -->
          <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
          </keep-alive>
          <!--<router-view></router-view>-->
        </el-main>
      </el-container>
      <el-footer id="app-footer">
        <rfooter></rfooter>
      </el-footer>
    </el-container>
  </div>
</template>

<style>
@import 'css/app.css';
</style>

<script>
import Header from '@/components/layoutTemplate/Header';
import Nav from '@/components/layoutTemplate/Nav';
import Main from '@/components/layoutTemplate/Main';
import Footer from '@/components/layoutTemplate/Footer';
import menuData from '@/config/menuConfig';
// import DragAndDrop from '@/components/publicTemplate/DragAndDrop'
import { pagePath, pageName } from '@/config/pageConfig';

export default {
  name: 'App',
  components: {
    rheader: Header,
    rnav: Nav,
    rmain: Main,
    rfooter: Footer
    // 'dragAndDrop': DragAndDrop
  },
  data() {
    return {
      menuData: menuData,
      screenHeight: 0
    };
  },
  methods: {
    // 页面高度自适应 改为由CSS控制
    initPage() {
      // 获取屏幕可视区域的宽、高
      const vw = Math.max(
        document.documentElement.clientWidth || 0,
        window.innerWidth || 0
      );
      const vh = Math.max(
        document.documentElement.clientHeight || 0,
        window.innerHeight || 0,
        100
      );
      document.getElementById('app-container').style.height = vh + 'px';
      document.getElementById('app-container').style.minWidth = vw - 200 + 'px';
    },
    // tab切换时，动态的切换路由
    tabClick() {
      let path = this.activeIndex.slice(1);
      this.$router.push({ path: pagePath[path] });
    },
    // 删除tab
    tabRemove(targetName) {
      this.$store.commit('delete_tabs', targetName);
      if (this.activeIndex === targetName) {
        // 设置当前激活的路由
        if (this.options && this.options.length >= 1) {
          let currentTab = this.options[this.options.length - 1].route;
          this.$store.commit('set_active_index', currentTab);
          this.$router.push({
            path: pagePath[this.activeIndex.slice(1)]
          });
        } else {
          // 锁定的首页
          this.$store.commit('add_tabs', {
            route: '/case',
            name: 'Case',
            title: pageName['Case']
          });
          this.$store.commit(
            'set_active_index',
            this.options[this.options.length - 1].route
          );
          this.$router.push({
            path: pagePath[this.activeIndex.slice(1)]
          });
        }
      }
    }
  },
  computed: {
    options() {
      return this.$store.state.options;
    },
    activeIndex: {
      get() {
        return this.$store.state.activeIndex;
      },
      set(val) {
        this.$store.commit('set_active_index', val);
      }
    }
  },
  watch: {
    $route(to) {
      let flag = false;
      for (let option of this.options) {
        if (option.name === to.name) {
          flag = true;
          this.$store.commit(
            'set_active_index',
            '/' + to.path.split('/')[to.path.split('/').length - 1]
          );
          break;
        }
      }
      if (!flag) {
        if (to.name != null) {
          this.$store.commit('add_tabs', {
            route: '/' + to.path.split('/')[to.path.split('/').length - 1],
            name: to.name,
            title: pageName[to.name]
          });
          this.$store.commit(
            'set_active_index',
            '/' + to.path.split('/')[to.path.split('/').length - 1]
          );
        }
      }
    }
  },
  head: {
    link: [{ rel: 'icon', href: '/static/favicon.ico', type: 'image/x-icon' }]
  },
  mounted() {
    this.initPage();
    window.onresize = () => {
      this.initPage();
    };

    window.onload = () => {
      this.initPage();
    };
  }
};
</script>
