<template>
  <div>
    <div>
      <el-row style="margin-top: -10px" :gutter="40">
        <el-col :span="2">
          <span>场景id</span>
        </el-col>
        <el-col :span="4">
          <el-input
            placeholder="输入场景id"
            v-model="sceneId"
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
            placeholder="输入场景名称"
            v-model="sceneName"
            clearable
            size="mini"
          >
          </el-input>
        </el-col>
        <el-col :span="3">
          <span>所属项目</span>
        </el-col>
        <el-col :span="6" :pull="1">
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
      </el-row>
    </div>
    <div>
      <el-row :gutter="20">
        <el-col :span="2">
          <span>项目版本</span>
        </el-col>
        <el-col :span="4">
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
        <el-col :span="2">
          <span>所属业务</span>
        </el-col>
        <el-col :span="4">
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
          <span>耗&nbsp;&nbsp;&nbsp;时</span>
        </el-col>
        <el-col :span="4">
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
        <el-col :span="2">
          <span>状&nbsp;&nbsp;&nbsp;态</span>
        </el-col>
        <el-col :span="4">
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
      </el-row>
      <el-row :gutter="40">
        <el-col :span="3">
          <span>场景类型</span>
        </el-col>
        <el-col :span="6" :pull="1">
          <el-select
            v-model="sceneType"
            filterable
            placeholder="请选择"
            clearable
            size="mini"
          >
            <el-option
              v-for="item in sceneTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="2" :pull="1">
          <span>日&nbsp;&nbsp;&nbsp;期</span>
        </el-col>
        <el-col :span="6" :pull="1">
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
        <el-col :span="4" :push="3">
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
      <sceneResultTable
        :tabData="tableData"
        :tabHeader="tableHeader"
        size="mini"
      ></sceneResultTable>
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
import SceneResultTable from '../SceneTemplate/SceneResultTable';

export default {
  name: 'SceneResultList',
  components: { sceneResultTable: SceneResultTable },
  data() {
    return {
      sceneTypeList: [],
      projectList: [],
      projectId: '',
      versionList: [],
      projectVersion: '',
      businessList: [],
      businessId: [],
      useTimeList: [],
      statusList: [],
      total: 0,
      pageSize: 0,
      currentPage: 1,
      dialogVisible: false,
      sceneId: '',
      sceneName: '',
      sceneType: '',
      useTime: '',
      status: '',
      timeRange: [],
      endTime: '',
      tableHeader: [],
      tableData: [],
      pickerOptions2: this.GLOBAL.pickerOptions1
    };
  },
  methods: {
    // 检查所属项目是否选中
    checkParent() {
      if (this.projectId === '' || this.projectId === undefined) {
        this.$message({
          type: 'error',
          message: '请先选择所属项目!'
        });
      }
    },
    // 重置查询条件
    reset() {
      this.initConditions();
      this.getConditions();
      this.getResultList();
    },
    // tab切换查询
    searchForTab() {
      this.getConditionsForTab();
      this.getResultList();
    },
    // 初始化查询条件
    initConditions() {
      this.sceneId = '';
      this.sceneName = '';
      this.projectId = '';
      this.businessId = '';
      this.projectVersion = '';
      this.sceneType = '';
      this.status = '';
      this.useTime = '';
      this.currentPage = 1;
    },
    // 获取查询条件
    getConditions() {
      this.businessId = '';
      let url = String.format(
        '{0}/sceneInterface/sceneConditions?project_id={1}',
        this.GLOBAL.MONITOR_URL,
        this.projectId
      );
      this.axios
        .get(url)
        .then(response => {
          this.projectList = response.data.data.projectList;
          this.versionList = response.data.data.versionList;
          this.businessList = response.data.data.businessList;
          this.sceneTypeList = response.data.data.sceneTypeList;
          this.useTimeList = response.data.data.useTimeList;
          this.statusList = response.data.data.statusList;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // tab获取查询条件
    getConditionsForTab() {
      let url = String.format(
        '{0}/sceneInterface/sceneConditions?project_id={1}',
        this.GLOBAL.MONITOR_URL,
        this.projectId
      );
      this.axios
        .get(url)
        .then(response => {
          this.projectList = response.data.data.projectList;
          this.versionList = response.data.data.versionList;
          this.businessList = response.data.data.businessList;
          this.sceneTypeList = response.data.data.sceneTypeList;
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
        '{0}/sceneInterface/searchSceneResult',
        this.GLOBAL.MONITOR_URL
      );
      // 查询条件
      let conditions = {
        scene_id: this.sceneId,
        scene_name: this.sceneName,
        scene_type: this.sceneType,
        use_time: this.useTime,
        status: this.status,
        project_id: this.projectId,
        project_version: this.projectVersion,
        business_id: this.businessId,
        start_time: startTime,
        end_time: endTime,
        page_index: this.currentPage
      };
      this.axios
        .post(url, JSON.stringify(conditions), config)
        .then(response => {
          this.total = response.data.total;
          this.pageSize = response.data.pageSize;
          let sceneInfo = response.data.resultInfo;
          this.tableHeader = sceneInfo.tableHeader;
          this.tableData = sceneInfo.tableData;
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
  margin-top: 0px;
}
</style>
