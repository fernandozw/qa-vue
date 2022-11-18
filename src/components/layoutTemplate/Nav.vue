<template>
  <div>
    <template v-for="navMenu in navMenus">
      <!-- 最后一级菜单,通过path值高亮并绑定当前活动的页面 -->
      <el-menu-item
        v-if="!navMenu.childs && navMenu.entity && !navMenu.linkUrl"
        :key="navMenu.entity.id"
        :data="navMenu"
        :index="navMenu.entity.path"
      >
        <i :class="navMenu.entity.icon"></i>
        <span slot="title">{{ navMenu.entity.title }}</span>
      </el-menu-item>
      <!--判断当前菜单栏是否为外部链接-->
      <span
        v-else-if="!navMenu.childs && navMenu.entity && navMenu.linkUrl"
        :key="navMenu.linkUrl"
      >
        <a
          slot="title"
          :href="navMenu.linkUrl"
          target="_blank"
          style="text-decoration:none;"
        >
          <el-menu-item
            :key="navMenu.entity.id"
            :data="navMenu"
            :index="navMenu.entity.path"
          >
            <i :class="navMenu.entity.icon"></i>
            <span>{{ navMenu.entity.title }}</span>
          </el-menu-item>
        </a>
      </span>
      <!-- 此菜单下还有子菜单,不要取path的值作为index,作为父菜单时没有path属性 -->
      <el-submenu
        v-if="navMenu.childs && navMenu.entity"
        :key="navMenu.entity.id"
        :data="navMenu"
        :index="navMenu.entity.index"
      >
        <template slot="title">
          <i :class="navMenu.entity.icon"></i>
          <span> {{ navMenu.entity.title }}</span>
        </template>
        <!-- 递归调用模板 -->
        <NavMenu :navMenus="navMenu.childs"></NavMenu>
      </el-submenu>
    </template>
  </div>
</template>

<script>
export default {
  name: 'NavMenu',
  props: ['navMenus'],
  data() {
    return {
      param: ''
    };
  },
  methods: {}
};
</script>

<style scoped></style>
