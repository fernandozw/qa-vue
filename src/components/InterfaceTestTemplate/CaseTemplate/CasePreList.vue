<template>
  <div>
    <div>
      <el-row style="margin-top: -10px;" :gutter="40">
        <el-col :span="2">
          <span>用例id</span>
        </el-col>
        <el-col :span="4">
          <el-input
            placeholder="输入用例id"
            v-model="caseId"
            clearable
            size="mini"
          >
          </el-input>
        </el-col>
        <el-col :span="2">
          <span>名&nbsp;&nbsp;&nbsp;称</span>
        </el-col>
        <el-col :span="6">
          <el-input
            placeholder="输入用例名称"
            v-model="caseName"
            clearable
            size="mini"
          >
          </el-input>
        </el-col>
        <el-col :span="3" :push="1">
          <span>所属项目</span>
        </el-col>
        <el-col :span="6">
          <el-select
            v-model="projectId"
            filterable
            placeholder="请选择"
            clearable
            size="mini"
            @change="getConditions()"
          >
            <el-option
              v-for="item in projectList"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row style="margin-top: -10px;" :gutter="40">
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
            @focus="checkParent('version')"
          >
            <el-option
              v-for="item in versionList"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3" :pull="1">
          <span>所属业务</span>
        </el-col>
        <el-col :span="4" :pull="2">
          <el-select
            v-model="businessId"
            filterable
            placeholder="请选择"
            clearable
            size="mini"
            @focus="checkParent('business')"
            @change="changeBusiness"
          >
            <el-option
              v-for="item in businessList"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="2" :pull="2">
          <span>接&nbsp;&nbsp;&nbsp;口</span>
        </el-col>
        <el-col :span="9" :pull="2">
          <el-select
            style="width:400px"
            v-model="urlId"
            filterable
            placeholder="请选择"
            clearable
            size="mini"
            @focus="checkParent('interface')"
          >
            <el-option
              v-for="item in urlList"
              :key="item.id"
              :label="item.interface_name + ':' + item.interface_url"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row style="margin-top: -10px" :gutter="40">
        <el-col :span="2">
          <span>创建人</span>
        </el-col>
        <el-col :span="4">
          <el-input
            placeholder="输入创建人"
            v-model="createPerson"
            clearable
            size="mini"
          >
          </el-input>
        </el-col>
        <el-col :span="6" style="float: right">
          <el-button type="primary" round @click="search" size="mini"
            >查询
          </el-button>
          <el-button type="success " round @click="openAddDialog" size="mini"
            >新增
          </el-button>
          <el-button type="info" round @click="reset" size="mini"
            >重置
          </el-button>
        </el-col>
      </el-row>
    </div>
    <div style="margin-top: 20px">
      <case-pre-table
        :tabData="tableData"
        :tabHeader="tableHeader"
        @getCaseList="getCaseList"
      ></case-pre-table>
    </div>
    <el-pagination
      @current-change="getCaseList"
      :current-page.sync="currentPage"
      :page-size="pageSize"
      layout="total,slot, prev, pager, next, jumper"
      :total="total"
      style="margin-top: 10px"
      size="mini"
    >
      <span>{{ pageSize }}条/页</span>
    </el-pagination>

    <case-pre-dialog
      v-if="dialogVisible"
      :visible="dialogVisible"
      @listenToChildEvent="callbackFunc"
    ></case-pre-dialog>
  </div>
</template>

<script>
import CasePreTable from '../CaseTemplate/CasePreTable';
import CasePreDialog from './CasePreDialog';

export default {
  name: 'CasePreList',
  components: { casePreDialog: CasePreDialog, casePreTable: CasePreTable },
  data() {
    return {
      projectId: '',
      projectList: [],
      projectVersion: '',
      versionList: [],
      businessId: '',
      businessList: [],
      urlId: '',
      urlList: [],
      createPerson: '',
      total: 0,
      pageSize: 0,
      currentPage: 1,
      dialogVisible: false,
      caseId: '',
      caseName: '',
      caseType: 1,
      tableHeader: [],
      tableData: [],
      addUrlDict: {},
      addHostDict: {}
    };
  },
  methods: {
    // 校验输入、选项框是否为空
    isEmpty(obj) {
      if (obj === undefined || obj === '') {
        return true;
      } else {
        return false;
      }
    },
    openAddDialog() {
      this.dialogVisible = true;
    },
    // 检查所属项目、所属业务是否选中
    checkParent(type) {
      if (type === 'business') {
        if (this.projectId === '') {
          this.$message({
            type: 'error',
            message: '请先选择所属项目!'
          });
        }
      } else if (type === 'version') {
        if (this.projectId === '') {
          this.$message({
            type: 'error',
            message: '请先选择所属项目!'
          });
        }
      } else if (type === 'interface') {
        if (this.projectId === '' || this.businessId === '') {
          this.$message({
            type: 'error',
            message: '请先选择所属项目、所属业务!'
          });
        }
      }
    },
    // 重置查询条件
    reset() {
      this.initConditions();
      this.getConditions();
      this.getCaseList();
    },
    // 供tab切换查询
    searchForTab() {
      this.getConditionsForTab();
      this.getCaseList();
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
      this.currentPage = 1;
    },
    // 所属业务改变
    changeBusiness() {
      this.urlId = '';
      this.urlList = [];
      if (this.projectId !== '' && this.businessId !== '') {
        this.getUrlList();
      }
    },
    // 获取接口下拉列表
    getUrlList() {
      // 指定参数格式
      let config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      };
      let url = String.format(
        '{0}/caseInterface/getUrlByConditions',
        this.GLOBAL.MONITOR_URL
      );
      let conditions = {
        business_id: this.businessId,
        project_id: this.projectId
      };
      this.axios
        .post(url, JSON.stringify(conditions), config)
        .then(response => {
          this.urlList = response.data.interfaceList;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 获取列表页查询条件下拉列表
    getConditions() {
      this.businessId = '';
      this.projectVersion = '';
      this.urlId = '';
      this.urlList = [];
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
          // this.caseTypeList = response.data.data.caseTypeList;
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
          // this.caseTypeList = response.data.data.caseTypeList;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    getCaseList() {
      // 指定参数格式
      let config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      };
      let url = String.format(
        '{0}/caseInterface/searchCase',
        this.GLOBAL.MONITOR_URL
      );
      let conditions = {
        id: this.caseId,
        case_name: this.caseName,
        case_type: this.caseType,
        page_index: this.currentPage,
        business_id: this.businessId,
        project_id: this.projectId,
        project_version: this.projectVersion,
        url_id: this.urlId,
        create_person: this.createPerson
      };
      this.axios
        .post(url, JSON.stringify(conditions), config)
        .then(response => {
          this.total = response.data.total;
          this.pageSize = response.data.pageSize;
          let caseInfo = response.data.caseInfo;
          this.tableHeader = caseInfo.tableHeader;
          this.tableData = caseInfo.tableData;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    search() {
      this.currentPage = 1;
      this.getCaseList();
    },
    callbackFunc(fresh) {
      this.dialogVisible = false;
      if (fresh) {
        this.getCaseList();
      }
    }
  },
  beforeMount() {
    this.getConditions();
    this.getCaseList();
  }
};
</script>

<style scoped>
.el-row {
  line-height: 40px;
  margin-top: 10px;
}
</style>
