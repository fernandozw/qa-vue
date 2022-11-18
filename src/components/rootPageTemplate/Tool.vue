<template>
  <div>
    <el-tabs v-model="activeName" type="border-card" @tab-click="switchTab">
      <el-tab-pane name="file">
        <span slot="label"><i class="el-icon-date"></i>文件管理</span>
        <file-page ref="file"></file-page>
      </el-tab-pane>
      <el-tab-pane name="mark">
        <span slot="label"><i class="el-icon-date"></i>动态参数替换</span>
        <case-mark ref="mark"></case-mark>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import FilePage from '../InterfaceTestTemplate/ToolTemplate/File';
import CaseMark from '../InterfaceTestTemplate/ToolTemplate/CaseMark';

export default {
  name: 'Tool',
  components: {
    filePage: FilePage,
    caseMark: CaseMark
  },
  data() {
    return {
      activeName: 'file'
    };
  },
  methods: {
    switchTab() {
      if (this.activeName === 'file') {
        this.$refs.file.reset();
      } else if (this.activeName === 'mark') {
        this.$refs.mark.reset();
      }
    }
  },
  mounted() {
    this.$refs.file.reset();
  }
};
</script>

<style scoped></style>
