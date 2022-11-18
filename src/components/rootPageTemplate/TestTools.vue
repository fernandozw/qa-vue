<template>
  <div>
    <el-tabs v-model="activeName" type="border-card" @tab-click="switchTab">
      <el-tab-pane name="translate">
        <span slot="label"><i class="el-icon-date"></i>翻译校验</span>
        <translate ref="translate"></translate>
      </el-tab-pane>
      <el-tab-pane name="getLongText">
        <span slot="label"><i class="el-icon-date"></i>长度校验</span>
        <get-long-text ref="getLongText"></get-long-text>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Translate from '../TestToolTemplate/Translate';
import GetLongText from '../TestToolTemplate/GetLongText';

export default {
  name: 'TestTools',
  components: {
    translate: Translate,
    getLongText: GetLongText
  },
  data() {
    return {
      activeName: 'translate'
    };
  },
  methods: {
    switchTab() {
      if (this.activeName === 'translate') {
        this.$refs.translate.getTranslate();
      } else if (this.activeName === 'getLongText') {
        this.$refs.getLongText.getLongText();
      }
    }
  }
};
</script>
<style scoped></style>
