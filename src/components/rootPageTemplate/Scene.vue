<template>
  <div>
    <el-tabs type="border-card" v-model="activeName" @tab-click="switchTab">
      <el-tab-pane name="scene">
        <span slot="label"><i class="el-icon-date"></i>前置场景</span>
        <scene-pre-case-set-list ref="sceneList"></scene-pre-case-set-list>
      </el-tab-pane>
      <el-tab-pane name="sceneCaseSetList">
        <span slot="label"><i class="el-icon-date"></i>正式场景</span>
        <sceneCaseSetList ref="sceneCaseSetList"></sceneCaseSetList>
      </el-tab-pane>
      <el-tab-pane name="sceneResult">
        <span slot="label"><i class="el-icon-date"></i>测试结果</span>
        <sceneResultList ref="sceneResult"></sceneResultList>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ScenePreCaseSetList from '../InterfaceTestTemplate/SceneTemplate/ScenePreCaseSetList';
import SceneResultList from '../InterfaceTestTemplate/SceneTemplate/SceneResultList';
import SceneCaseSetList from '../InterfaceTestTemplate/SceneTemplate/SceneCaseSetList';

export default {
  components: {
    scenePreCaseSetList: ScenePreCaseSetList,
    sceneCaseSetList: SceneCaseSetList,
    sceneResultList: SceneResultList
  },
  data() {
    return {
      activeName: 'scene'
    };
  },
  methods: {
    switchTab() {
      if (this.activeName === 'scene') {
        this.$refs.sceneList.searchForTab();
      } else if (this.activeName === 'sceneCaseSetList') {
        this.$refs.sceneCaseSetList.searchForTab();
      } else if (this.activeName === 'sceneResult') {
        this.$refs.sceneResult.searchForTab();
      }
    }
  },
  mounted() {
    this.$refs.sceneList.searchForTab();
  }
};
</script>

<style scoped></style>
