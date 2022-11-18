<template>
  <div
    v-loading="loading"
    element-loading-text="加载中,请喝口水再来吧~~~(30秒后自动关闭)"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <div>
      <el-form style="margin-bottom: 20px" :inline="true">
        <el-form-item label="语言"
          ><el-select
            size="mini"
            v-model="language"
            filterable
            placeholder="请选择语言"
          >
            <el-option
              v-for="item in languageTabList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option> </el-select
        ></el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="getTranslate"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <table-template
      :tab-header="tableHeader"
      :tab-data="tableData"
      :tab-height="750"
    ></table-template>
  </div>
</template>

<script>
import TableTemplate from '../publicTemplate/TableTemplate';

export default {
  name: 'Translate',
  components: {
    tableTemplate: TableTemplate
  },
  data() {
    return {
      loading: false,
      tableHeader: [],
      tableData: [],
      language: '',
      languageTabList: [
        { label: '全部', value: '' },
        { label: '中文', value: 'zh' },
        { label: '英文', value: 'en' },
        { label: '日文', value: 'ja' }
      ]
    };
  },
  methods: {
    getTranslate() {
      this.loading = true;
      this.tableHeader = [];
      this.tableData = [];
      let url = String.format(
        '{0}/translate?language={1}',
        'http://47.100.78.246:19996',
        this.language
      );
      this.axios
        .get(url)
        .then(response => {
          this.tableHeader = response.data.tableHeader;
          this.tableData = response.data.tableData;
          this.loading = false;
          return response;
        })
        .catch(response => {
          return response;
        });
      setTimeout(() => {
        if (this.loading) {
          this.loading = false;
          this.$message.error(
            '接口返回超时了,你可以继续等待或者重新请求～～～'
          );
        }
      }, 30000);
    }
  },
  beforeMount() {
    this.getTranslate();
  }
};
</script>

<style scoped></style>
