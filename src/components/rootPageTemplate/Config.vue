<template>
  <div>
    <el-tabs v-model="activeName" type="border-card" @tab-click="switchTab">
      <el-tab-pane name="project">
        <span slot="label"><i class="el-icon-date"></i>项目配置</span>
        <project-config ref="project"></project-config>
      </el-tab-pane>
      <!--<el-tab-pane name="version">-->
      <!--<span slot="label"><i class="el-icon-date"></i>版本配置</span>-->
      <!--<version-config ref="version"></version-config>-->
      <!--</el-tab-pane>-->
      <el-tab-pane name="business">
        <span slot="label"><i class="el-icon-date"></i>业务配置</span>
        <business-config ref="business"></business-config>
      </el-tab-pane>
      <el-tab-pane name="host">
        <span slot="label"><i class="el-icon-date"></i>host配置</span>
        <host-config ref="host"></host-config>
      </el-tab-pane>
      <el-tab-pane name="interface">
        <span slot="label"><i class="el-icon-date"></i>接口配置</span>
        <interface-config ref="interface"></interface-config>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ProjectConfig from '../InterfaceTestTemplate/ConfigTemplate/ProjectConfig';
import BusinessConfig from '../InterfaceTestTemplate/ConfigTemplate/BusinessConfig';
import HostConfig from '../InterfaceTestTemplate/ConfigTemplate/HostConfig';
import InterfaceConfig from '../InterfaceTestTemplate/ConfigTemplate/InterfaceConfig';
// import VersionConfig from '../InterfaceTestTemplate/ConfigTemplate/VersionConfig';

export default {
  name: 'Config',
  components: {
    projectConfig: ProjectConfig,
    // versionConfig: VersionConfig,
    businessConfig: BusinessConfig,
    hostConfig: HostConfig,
    interfaceConfig: InterfaceConfig
  },
  data() {
    return {
      activeName: 'project'
    };
  },
  methods: {
    switchTab() {
      if (this.activeName === 'project') {
        this.$refs.project.reset();
      } else if (this.activeName === 'business') {
        this.$refs.business.reset();
      } else if (this.activeName === 'host') {
        this.$refs.host.reset();
      } else if (this.activeName === 'interface') {
        this.$refs.interface.reset();
      }
    }
  },
  mounted() {
    this.$refs.project.reset();
  }
};
</script>

<style scoped></style>
