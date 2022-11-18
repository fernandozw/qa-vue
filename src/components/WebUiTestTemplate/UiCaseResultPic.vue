<template>
  <div>
    <el-form :inline="true" :model="searchForm" size="mini">
      <el-form-item label="所属业务">
        <el-select
          v-model="searchForm.pageId"
          filterable
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="item in pageList"
            :key="item.id"
            :label="'「' + item.id + '」' + item.pageName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用例id">
        <el-input
          v-model="searchForm.caseId"
          placeholder="输入用例id"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="用例名称">
        <el-input
          v-model="searchForm.caseName"
          placeholder="输入用例名称"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="执行时间">
        <el-date-picker
          v-model="searchForm.addTime"
          type="daterange"
          align="right"
          start-placeholder="起始时间"
          end-placeholder="截止时间"
          style="width: 360px;"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item style="float: right;margin-right: 60px">
        <el-button type="primary" @click="getResultPic()">查询 </el-button>
        <el-button type="info" @click="reset()">重置</el-button>
      </el-form-item>
    </el-form>
    <div id="resultChart"></div>
  </div>
</template>

<script>
export default {
  name: 'UiCaseResultPic',
  data() {
    return {
      pageList: [],
      searchForm: {
        pageId: '',
        caseId: '',
        caseName: '',
        addTime: []
      },

      resultChart: {
        credits: {
          enabled: true,
          href: 'http://www.thinkingdata.cn',
          text: '数数科技'
        },
        yAxis: {
          title: {
            text: '运行总数、成功、失败数（条）'
          }
        },
        title: {
          text: '运行状况混合图表'
        },
        xAxis: {
          categories: []
        },
        labels: {},
        series: []
      }
    };
  },
  methods: {
    // 获取结果图表
    getResultPic() {
      this.initChart();
      // 指定参数格式
      let config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      };
      let url = String.format('{0}/result/getResultPic', this.GLOBAL.WEBUI_URL);
      this.searchForm['pageNum'] = this.currentPage;
      this.axios
        .post(url, JSON.stringify(this.searchForm), config)
        .then(response => {
          this.resultChart.xAxis.categories = response.data.data.categories;
          this.resultChart.series.push({
            type: 'column',
            data: response.data.data.allColumn,
            name: '运行总数',
            color: '#B3D9D9'
          });
          this.resultChart.series.push({
            type: 'spline',
            data: response.data.data.successSpline,
            name: '成功数量',
            color: '#53FF53'
          });
          this.resultChart.series.push({
            type: 'spline',
            data: response.data.data.failSpline,
            name: '失败数量',
            color: '#ff7575'
          });
          let piePic = {
            type: 'pie',
            name: '百分比',
            tooltip: {
              pointFormat: '{series.name}: <b>{point.percentage:.2f}%</b>'
            },
            data: [
              {
                name: '成功',
                y: response.data.data.successTotal,
                color: '#53FF53'
              },
              {
                name: '失败',
                y: response.data.data.failTotal,
                color: '#ff7575'
              }
            ],
            center: [25, 50],
            size: 100,
            showInLegend: false,
            dataLabels: {
              enabled: false
            }
          };
          let pieTitle = {
            items: [
              {
                html: '成功、失败占比',
                style: {
                  left: '0px',
                  top: '5px',
                  color:
                    (this.Highcharts.theme &&
                      this.Highcharts.theme.textColor) ||
                    'black'
                }
              }
            ]
          };
          if (
            response.data.data.successTotal + response.data.data.failTotal >
            0
          ) {
            this.resultChart.labels = pieTitle;
            this.resultChart.series.push(piePic);
          }
          this.Highcharts.chart('resultChart', this.resultChart);
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    initChart() {
      this.resultChart = {
        credits: {
          enabled: true,
          href: 'http://www.thinkingdata.cn',
          text: '数数科技'
        },
        yAxis: {
          title: {
            text: '运行总数、成功、失败数（条）'
          }
        },
        title: {
          text: '运行状况混合图表'
        },
        xAxis: {
          categories: []
        },
        labels: {},
        series: []
      };
    },
    reset() {
      this.searchForm.pageId = '';
      this.searchForm.caseId = '';
      this.searchForm.caseName = '';

      let end = this.formatDate(new Date());
      let start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
      start = this.formatDate(start);
      this.searchForm.addTime = [start, end];
      this.getResultPic();
    },

    formatDate(currentDate) {
      let seperator1 = '-';
      let year = currentDate.getFullYear();
      let month = currentDate.getMonth() + 1;
      let strDate = currentDate.getDate();
      if (month >= 1 && month <= 9) {
        month = '0' + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate;
      }
      let currentdate = year + seperator1 + month + seperator1 + strDate;
      return currentdate;
    },
    // 获取查询条件
    getConditions() {
      let url = String.format(
        '{0}/result/getSearchCondition',
        this.GLOBAL.WEBUI_URL
      );
      this.axios
        .get(url)
        .then(response => {
          this.pageList = response.data.data.pageList;
          return response;
        })
        .catch(response => {
          return response;
        });
    }
  },
  beforeMount() {
    let end = this.formatDate(new Date());
    let start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
    start = this.formatDate(start);
    this.searchForm.addTime = [start, end];
    this.getConditions();
  },
  mounted() {
    this.getResultPic();
  },
  watch: {
    'searchForm.addTime': {
      handler(newValue, oldValue) {
        if (newValue === '' || newValue === null || newValue.length < 2) {
          let end = this.formatDate(new Date());
          let start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
          start = this.formatDate(start);
          this.searchForm.addTime = [start, end];
        }
      },
      immediate: true,
      deep: true
    }
  }
};
</script>

<style scoped></style>
