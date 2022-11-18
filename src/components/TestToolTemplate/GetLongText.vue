<template>
  <div
    v-loading="loading"
    element-loading-text="加载中,请喝口水再来吧~~~(30秒后自动关闭)"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <table-template
      :tab-header="tableHeader"
      :tab-data="tableData"
      :tab-height="tabHeight"
    ></table-template>
  </div>
</template>

<script>
import TableTemplate from '../publicTemplate/TableTemplate';

export default {
  name: 'GetLongText',
  components: {
    tableTemplate: TableTemplate
  },
  data() {
    return {
      loading: false,
      tableHeader: [],
      tableData: [],
      tabHeight: 750
    };
  },
  methods: {
    getLongText() {
      this.loading = true;
      this.tableHeader = [];
      this.tableData = [];
      let url = String.format('{0}/getlongtext', 'http://47.100.78.246:19996');
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
  }
};
</script>

<style scoped></style>
