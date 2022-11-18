<template>
  <div>
    <div id="reportContent"></div>
  </div>
</template>

<script>
import { getReport } from '../../api/tianwang/executeCase';

export default {
  name: 'TianWangReport',
  data() {
    return {
      reportContent: ''
    };
  },
  watch: {
    reportContent: function() {
      let report = document.getElementById('reportContent');
      report.innerHTML = this.reportContent;
    }
  },
  mounted() {
    let _this = this;
    getReport()
      .then(response => {
        _this.reportContent = response;
        return response;
      })
      .catch(error => {
        return error;
      });
  }
};
</script>

<style scoped></style>
