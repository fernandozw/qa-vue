<template>
  <div>
    <el-tabs v-model="activeName" type="border-card" @tab-click="switchTab">
      <el-tab-pane name="preCase">
        <span slot="label"><i class="el-icon-date"></i>前置用例</span>
        <preCaseList ref="preCaseList"></preCaseList>
      </el-tab-pane>
      <el-tab-pane name="case">
        <span slot="label"><i class="el-icon-date"></i>正式用例</span>
        <caseList ref="caseList"></caseList>
      </el-tab-pane>
      <el-tab-pane name="result">
        <span slot="label"><i class="el-icon-date"></i>测试结果</span>
        <caseResultList ref="resultList"></caseResultList>
      </el-tab-pane>
      <el-tab-pane name="pic">
        <span slot="label"><i class="el-icon-date"></i>趋势图</span>
        <caseTrendChart ref="pic"></caseTrendChart>
      </el-tab-pane>
      <el-tab-pane name="paramPool">
        <span slot="label"><i class="el-icon-date"></i>参数池</span>
        <param-pool-config ref="interface"></param-pool-config>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import PreCaseList from '../InterfaceTestTemplate/CaseTemplate/CasePreList';
import CaseList from '../InterfaceTestTemplate/CaseTemplate/CaseList';
import CaseResultList from '../InterfaceTestTemplate/CaseTemplate/CaseResultList';
import CaseTrendChart from '../InterfaceTestTemplate/CaseTemplate/CaseTrendChart';
import ParamPoolConfig from '../InterfaceTestTemplate/CaseTemplate/ParamPoolConfig';

export default {
  components: {
    preCaseList: PreCaseList,
    caseList: CaseList,
    caseResultList: CaseResultList,
    caseTrendChart: CaseTrendChart,
    paramPoolConfig: ParamPoolConfig
  },
  data() {
    return {
      activeName: 'preCase'
    };
  },
  methods: {
    switchTab() {
      if (this.activeName === 'preCase') {
        this.$refs.preCaseList.searchForTab();
      } else if (this.activeName === 'case') {
        this.$refs.caseList.searchForTab();
      } else if (this.activeName === 'result') {
        this.$refs.resultList.searchForTab();
      } else if (this.activeName === 'pic') {
        this.$refs.pic.searchForTab();
      } else if (this.activeName === 'paramPool') {
        this.$refs.interface.reset();
      }
    }
  }
};
</script>

<style scoped></style>
