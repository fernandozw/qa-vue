<template>
  <div>
    <div>
      <el-row style="margin-top: -10px">
        <el-col :span="3">
          <span>所属项目</span>
        </el-col>
        <el-col :span="4" :pull="1">
          <el-select
            v-model="projectId"
            filterable
            placeholder="请选择"
            clearable
            size="mini"
            @change="getConditions"
          >
            <el-option
              v-for="item in projectList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <span>项目版本</span>
        </el-col>
        <el-col :span="3" :pull="1">
          <el-select
            v-model="projectVersion"
            filterable
            placeholder="请选择"
            clearable
            size="mini"
            @focus="checkParent"
          >
            <el-option
              v-for="item in versionList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <span>所属业务</span>
        </el-col>
        <el-col :span="4" :pull="1">
          <el-select
            v-model="businessId"
            filterable
            placeholder="请选择"
            clearable
            size="mini"
            @focus="checkParent"
          >
            <el-option
              v-for="item in businessList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="2">
          <span>类&nbsp;&nbsp;&nbsp;型</span>
        </el-col>
        <el-col :span="2">
          <el-select
            v-model="caseType"
            filterable
            placeholder="请选择"
            clearable
            size="mini"
            style="width: 100px"
          >
            <el-option
              v-for="item in caseTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row style="margin-top: 0px">
        <el-col :span="2">
          <span>接&nbsp;&nbsp;&nbsp;口</span>
        </el-col>
        <el-col :span="8">
          <el-select
            v-model="urlId"
            filterable
            placeholder="请选择"
            clearable
            size="mini"
            @focus="checkParent"
            style="width:320px"
          >
            <el-option
              v-for="item in urlList"
              :key="item.value"
              :label="item.label + ':' + urlDict[item.value]"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="2">
          <span>日&nbsp;&nbsp;&nbsp;期</span>
        </el-col>
        <el-col :span="6">
          <el-date-picker
            v-model="timeRange"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
            size="mini"
          >
          </el-date-picker>
        </el-col>
        <el-col :span="4" :push="3">
          <el-button type="primary" round @click="getValue" size="mini"
            >查询
          </el-button>
          <el-button type="info" round @click="reset" size="mini"
            >重置
          </el-button>
        </el-col>
      </el-row>
    </div>

    <div
      id="trendChart"
      style="border-style: solid;border-width: 1px;margin-bottom: 20px;background-color: #fff;border-color:#ebeef5;margin-top: 30px;"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'CaseTrendChart',
  data() {
    return {
      caseTypeList: [],
      caseType: '',
      projectList: [],
      projectId: '',
      versionList: [],
      projectVersion: '',
      businessList: [],
      businessId: '',
      urlList: [],
      urlDict: {},
      urlId: '',
      timeRange: [],
      pickerOptions: this.GLOBAL.pickerOptions,
      chart: {
        credits: { text: '' },
        yAxis: {
          title: {
            text: '成功、失败数（条）：成功率（%）'
          }
        },
        // 整个趋势图的标题
        title: {
          text: '用例趋势图'
        },
        // 横坐标:日期
        xAxis: {
          categories: []
        },
        plotOptions: {
          series: {
            stacking: 'normal'
          }
        },
        labels: {
          items: [
            {
              html: '成功/失败占比',
              style: {
                left: '0px',
                top: '-40px',
                color:
                  (this.Highcharts.theme && this.Highcharts.theme.textColor) ||
                  'black'
              }
            }
          ]
        },
        series: [
          {
            type: 'column',
            name: '成功',
            tooltip: {
              valueSuffix: ' 条'
            },
            data: []
          },
          {
            type: 'column',
            name: '失败',
            tooltip: {
              valueSuffix: ' 条'
            },
            data: []
          },
          {
            type: 'spline',
            name: '成功率',
            tooltip: {
              valueSuffix: ' %'
            },
            data: [],
            marker: {
              lineWidth: 2,
              lineColor: this.Highcharts.getOptions().colors[3],
              fillColor: 'white'
            }
          },
          {
            type: 'pie',
            name: '数量',
            data: [
              ['成功', 0],
              ['失败', 0]
            ],
            center: [20, 10],
            size: 100,
            showInLegend: false,
            dataLabels: {
              enabled: false
            }
          }
        ]
      }
    };
  },
  methods: {
    // 重置查询条件
    reset() {
      this.initConditions();
      this.getConditions();
      this.getValue();
    },
    // 供切换tab查询
    searchForTab() {
      this.getConditionsForTab();
      this.getValue();
    },
    // 初始化查询条件
    initConditions() {
      this.projectId = '';
      this.projectVersion = '';
      this.businessId = '';
      this.urlId = '';
      this.caseType = '';
      this.timeRange = [];
    },
    // 检查所属项目是否选中
    checkParent() {
      if (this.projectId === '' || this.projectId === undefined) {
        this.$message({
          type: 'error',
          message: '请先选择所属项目!'
        });
      }
    },
    // 获取列表页查询条件下拉列表
    getConditions() {
      this.businessId = '';
      this.projectVersion = '';
      this.urlId = '';
      let url = String.format(
        '{0}/caseInterface/caseConditions?project_id={1}',
        this.GLOBAL.MONITOR_URL,
        this.projectId
      );
      this.axios
        .get(url)
        .then(response => {
          this.projectList = response.data.data.projectList;
          this.versionList = response.data.data.versionList;
          this.businessList = response.data.data.businessList;
          this.urlList = response.data.data.interfaceList;
          this.urlDict = response.data.data.interfaceDict;
          this.caseTypeList = response.data.data.caseTypeList;
          this.useTimeList = response.data.data.useTimeList;
          this.statusList = response.data.data.statusList;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 切换tab时获取下拉列表
    getConditionsForTab() {
      let url = String.format(
        '{0}/caseInterface/caseConditions?project_id={1}',
        this.GLOBAL.MONITOR_URL,
        this.projectId
      );
      this.axios
        .get(url)
        .then(response => {
          this.projectList = response.data.data.projectList;
          this.versionList = response.data.data.versionList;
          this.businessList = response.data.data.businessList;
          this.urlList = response.data.data.interfaceList;
          this.urlDict = response.data.data.interfaceDict;
          this.caseTypeList = response.data.data.caseTypeList;
          this.useTimeList = response.data.data.useTimeList;
          this.statusList = response.data.data.statusList;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    getValue() {
      const loading = this.$loading({
        lock: true,
        text: '拼命加载中，请稍后~~~',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      let startTime = '';
      let endTime = '';
      if (this.timeRange != null && this.timeRange.length > 0) {
        startTime = this.timeRange[0];
        endTime = this.timeRange[1];
      }
      // 指定参数格式
      let config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      };
      let url = String.format(
        '{0}/caseInterface/caseResultPic',
        this.GLOBAL.MONITOR_URL
      );
      // let url = String.format('{0}/caseInterface/caseResultPic', 'http://127.0.0.1:5000')
      let conditions = {
        start_date: startTime,
        end_date: endTime,
        case_type: this.caseType,
        status: this.status,
        project_id: this.projectId,
        project_version: this.projectVersion,
        business_id: this.businessId,
        url_id: this.urlId
      };
      this.axios
        .post(url, JSON.stringify(conditions), config)
        .then(response => {
          this.chart.xAxis.categories = response.data.date_list;
          this.chart.series[0].data = response.data.success_data;
          this.chart.series[1].data = response.data.fail_data;
          this.chart.series[2].data = response.data.success_rate;
          this.chart.series[3].data = response.data.pie_data;
          this.Highcharts.chart('trendChart', this.chart);
          loading.close();
          return response;
        })
        .catch(response => {
          loading.close();
          return response;
        });
    }
  }
  // ,
  // beforeMount() {
  //   this.getConditions();
  //   this.getValue();
  // }
};
</script>

<style scoped>
.el-row {
  line-height: 40px;
  margin-top: 0px;
}
</style>
