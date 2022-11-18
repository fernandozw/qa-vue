<template>
  <div>
    <el-tabs v-model="activeName" type="border-card" @tab-click="switchTab">
      <el-tab-pane name="uiCaseResultPic">
        <span slot="label"><i class="el-icon"></i>结果图表</span>
        <ui-case-result-pic ref="uiCaseResultPic"></ui-case-result-pic>
      </el-tab-pane>
      <el-tab-pane name="uiCaseResultList">
        <span slot="label"><i class="el-icon-date"></i>结果列表</span>
        <ui-case-result-list ref="uiCaseResultList"></ui-case-result-list>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import UiCaseResultList from '../WebUiTestTemplate/UiCaseResultList';
import UiCaseResultPic from '../WebUiTestTemplate/UiCaseResultPic';

export default {
  name: 'UiCaseResult',
  components: {
    uiCaseResultList: UiCaseResultList,
    uiCaseResultPic: UiCaseResultPic
  },
  data() {
    return {
      activeName: 'uiCaseResultPic'
    };
  },
  methods: {
    switchTab() {
      if (this.activeName === 'uiCaseResultList') {
        this.$refs.uiCaseResultList.getConditions();
        this.$refs.uiCaseResultList.getResultList('search');
      } else if (this.activeName === 'uiCaseResultPic') {
        this.$refs.uiCaseResultPic.getConditions();
        this.$refs.uiCaseResultPic.getResultPic();
      }
    }
  }
};
</script>

<style scoped></style>
