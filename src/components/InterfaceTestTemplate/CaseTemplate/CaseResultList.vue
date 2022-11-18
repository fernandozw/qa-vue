<template>
  <div>
    <div>
      <el-row style="margin-top: -10px" :gutter="40">
        <el-col :span="2">
          <span>用例id</span>
        </el-col>
        <el-col :span="3">
          <el-input placeholder="用例id" v-model="caseId" clearable size="mini">
          </el-input>
        </el-col>
        <el-col :span="2">
          <span>名&nbsp;&nbsp;&nbsp;称</span>
        </el-col>
        <el-col :span="4">
          <el-input
            placeholder="用例名称"
            v-model="caseName"
            clearable
            size="mini"
          >
          </el-input>
        </el-col>
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
        <el-col :span="3" :pull="1">
          <span>项目版本</span>
        </el-col>
        <el-col :span="3" :pull="2">
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
      </el-row>
      <el-row :gutter="40" style="margin-top: 0px">
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
        <el-col :span="2" :pull="1">
          <span>接&nbsp;&nbsp;&nbsp;口</span>
        </el-col>
        <el-col :span="10" :pull="1">
          <el-select
            v-model="urlId"
            filterable
            placeholder="请选择"
            clearable
            size="mini"
            @focus="checkParent"
            style="width:400px"
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
        <el-col :span="2" :pull="1">
          <span>类&nbsp;&nbsp;&nbsp;型</span>
        </el-col>
        <el-col :span="3" :pull="1">
          <el-select
            v-model="caseType"
            filterable
            placeholder="请选择"
            clearable
            size="mini"
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
      <el-row :gutter="40" style="margin-top: 0px;">
        <el-col :span="2">
          <span>状&nbsp;&nbsp;态</span>
        </el-col>
        <el-col :span="3" :pull="1">
          <el-select
            v-model="status"
            filterable
            placeholder="请选择"
            clearable
            size="mini"
          >
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="2" :pull="1">
          <span>耗&nbsp;&nbsp;时</span>
        </el-col>
        <el-col :span="3" :pull="2">
          <el-select
            v-model="useTime"
            filterable
            placeholder="请选择"
            clearable
            size="mini"
          >
            <el-option
              v-for="item in useTimeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="2" :pull="2">
          <span>日&nbsp;&nbsp;期</span>
        </el-col>
        <el-col :span="6" :pull="3">
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="timeRange"
            type="datetimerange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="mini"
          >
          </el-date-picker>
        </el-col>
        <el-col :span="4" :push="1">
          <el-button type="primary" round @click="search" size="mini"
            >查询
          </el-button>
          <el-button type="info" round @click="reset" size="mini"
            >重置
          </el-button>
        </el-col>
      </el-row>
    </div>
    <div style="margin-top: 20px">
      <caseResultTable
        :tabData="tableData"
        :tabHeader="tableHeader"
      ></caseResultTable>
    </div>
    <el-pagination
      @current-change="getResultList"
      :current-page.sync="currentPage"
      :page-size="pageSize"
      layout="total,slot, prev, pager, next, jumper"
      :total="total"
      style="margin-top: 10px"
      size="mini"
    >
      <span>{{ pageSize }}条/页</span>
    </el-pagination>
  </div>
</template>

<script>
import CaseResultTable from '../CaseTemplate/CaseResultTable';

export default {
  name: 'CaseResultList',
  components: { caseResultTable: CaseResultTable },
  data() {
    return {
      caseTypeList: [],
      projectList: [],
      versionList: [],
      businessList: [],
      urlList: [],
      urlDict: {},
      useTimeList: [],
      statusList: [],
      total: 0,
      pageSize: 0,
      currentPage: 1,
      dialogVisible: false,
      caseId: '',
      caseName: '',
      caseType: '',
      useTime: '',
      status: '',
      timeRange: [],
      endTime: '',
      tableHeader: [],
      tableData: [],
      pickerOptions2: this.GLOBAL.pickerOptions1,
      businessId: '',
      projectVersion: '',
      projectId: '',
      urlId: ''
    };
  },
  methods: {
    // 重置查询条件
    reset() {
      this.initConditions();
      this.getConditions();
      this.getResultList();
    },
    // 供切换tab查询
    searchForTab() {
      this.getConditionsForTab();
      this.getResultList();
    },
    // 初始化查询条件
    initConditions() {
      this.caseId = '';
      this.caseName = '';
      this.projectId = '';
      this.projectVersion = '';
      this.businessId = '';
      this.urlId = '';
      this.caseType = '';
      this.useTime = '';
      this.status = '';
      this.timeRange = [];
      this.currentPage = 1;
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
    search() {
      this.currentPage = 1;
      this.getResultList();
    },
    getResultList() {
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
        '{0}/caseInterface/searchCaseResult',
        this.GLOBAL.MONITOR_URL
      );
      // 查询条件
      let conditions = {
        case_id: this.caseId,
        case_name: this.caseName,
        project_id: this.projectId,
        project_version: this.projectVersion,
        case_type: this.caseType,
        business_id: this.businessId,
        url_id: this.urlId,
        use_time: this.useTime,
        status: this.status,
        start_time: startTime,
        end_time: endTime,
        page_index: this.currentPage
      };
      this.axios
        .post(url, JSON.stringify(conditions), config)
        .then(response => {
          this.total = response.data.total;
          this.pageSize = response.data.pageSize;
          let caseInfo = response.data.resultInfo;
          this.tableHeader = caseInfo.tableHeader;
          this.tableData = caseInfo.tableData;
          return response;
        })
        .catch(response => {
          return response;
        });
    }
  }
  // ,
  // beforeMount() {
  //   this.getConditions();
  //   this.getResultList();
  // }
};
</script>

<style scoped>
.el-row {
  line-height: 40px;
  margin-top: 10px;
}
</style>
