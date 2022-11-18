<template>
  <el-card class="box-card">
    <div>
      <el-row style="margin-top: -10px" class="conditionBar" :gutter="40">
        <el-col :span="5">
          <span>任务名称:&nbsp;</span>
          <el-input
            placeholder="输入任务名称"
            v-model="taskId"
            clearable
            size="mini"
          >
          </el-input>
        </el-col>
        <el-col :span="5">
          <span>任务描述:&nbsp;</span>
          <el-input
            placeholder="输入任务描述"
            v-model="taskName"
            clearable
            size="mini"
          >
          </el-input>
        </el-col>
        <el-col :span="5">
          <span>状&nbsp;&nbsp;&nbsp;态:&nbsp;</span>
          <el-select
            v-model="taskStatus"
            filterable
            placeholder="请选择"
            clearable
            size="mini"
          >
            <el-option
              v-for="item in statusList"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <div>
            <el-button type="primary" round @click="search" size="mini"
              >查询
            </el-button>
            <el-button type="success" round @click="openAddDialog" size="mini"
              >新增
            </el-button>
            <el-button type="info" round @click="reset" size="mini"
              >重置
            </el-button>
          </div>
        </el-col>
      </el-row>
      <div>
        <taskTab
          :tabData="tableData"
          :tabHeader="tableHeader"
          @search="search"
        ></taskTab>
      </div>
      <el-dialog
        title="新增"
        :visible.sync="dialogVisible"
        width="80%"
        @close="clearData"
      >
        <div>
          <el-card class="box-card">
            <el-row :gutter="20">
              <el-col :span="4">
                <span>任务名称: <span style="color:red">*</span></span>
              </el-col>
              <el-col :span="8" :pull="2">
                <el-input
                  style="width: 400px"
                  placeholder="必填项:请输入内容"
                  v-model="taskDetail['id']"
                  clearable
                  required="true"
                >
                </el-input>
              </el-col>
              <el-col :span="4">
                <span>任务描述: <span style="color:red">*</span></span>
              </el-col>
              <el-col :span="8" :pull="2">
                <el-input
                  style="width: 400px"
                  placeholder="必填项:请输入内容"
                  v-model="taskDetail['job_name']"
                  clearable
                  required="true"
                  type="textarea"
                  :rows="3"
                >
                </el-input>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="4">
                <span>所属项目: </span>
              </el-col>
              <el-col :span="8" :pull="2">
                <el-select
                  style="width: 400px"
                  placeholder="必填项:请选择"
                  v-model="taskDetail['project_id']"
                  clearable
                  required="true"
                  @change="getConditionsForAdd"
                  class="taskDetail"
                >
                  <el-option
                    v-for="item in addProjectList"
                    :key="item.label"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="4">
                <span>所属业务: </span>
              </el-col>
              <el-col :span="8" :pull="2">
                <el-select
                  style="width: 400px"
                  placeholder="必填项:请选择"
                  v-model="taskDetail['business_id']"
                  clearable
                  required="true"
                  class="taskDetail"
                  @focus="checkParentForAdd('business')"
                  @change="changeBusinessId"
                >
                  <el-option
                    v-for="item in addBusinessList"
                    :key="item.label"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="4">
                <span>场景类型: </span>
              </el-col>
              <el-col :span="8" :pull="2">
                <el-select
                  style="width: 400px"
                  placeholder="必填项:请选择"
                  v-model="taskDetail['scene_type']"
                  clearable
                  required="true"
                  @change="changeSceneType"
                  class="taskDetail"
                  @focus="checkParentForAdd('scene_type')"
                >
                  <el-option
                    v-for="item in addSceneTypeList"
                    :key="item.label"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="4">
                <span>场景集:<span style="color:red">*</span></span>
              </el-col>
              <el-col :span="8" :pull="2">
                <el-select
                  style="width: 400px"
                  placeholder="必填项:请选择"
                  v-model="taskDetail['scene_list']"
                  multiple
                  collapse-tags
                  clearable
                  required="true"
                  filterable
                  class="taskDetail"
                  @focus="checkParentForAdd('scene')"
                >
                  <el-option
                    v-for="item in addSceneList"
                    :key="item.id"
                    :label="'【' + item.id + '】' + item.scene_name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="4">
                <span>执行计划:<span style="color:red">*</span></span>
              </el-col>
              <el-col :span="8" :pull="2">
                <el-input
                  style="width: 400px"
                  placeholder="必填项:cron表达式；【例:*/1 * * * *】"
                  v-model="taskDetail['job_schedule']"
                  clearable
                  required="true"
                >
                </el-input>
              </el-col>
              <el-col :span="4">
                <span>调用方法: <span style="color:red">*</span></span>
              </el-col>
              <el-col :span="8" :pull="2">
                <el-select
                  style="width: 400px"
                  placeholder="必填项:请选择"
                  v-model="taskDetail['job_method']"
                  clearable
                  required="true"
                  filterable
                  class="taskDetail"
                >
                  <el-option
                    v-for="item in addExecuteFunc"
                    :key="item.label"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
          </el-card>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addTask">保 存</el-button>
        </span>
      </el-dialog>
      <el-pagination
        @current-change="getTaskList"
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
  </el-card>
</template>

<script>
import TaskTab from '../InterfaceTestTemplate/TaskTemplate/TaskTable';

export default {
  name: 'Task',
  components: { taskTab: TaskTab },
  data() {
    return {
      addProjectList: [],
      addBusinessList: [],
      addSceneTypeList: [],
      addSceneList: [],
      addExecuteFunc: [],
      tableData: [],
      tableHeader: [],
      taskId: '',
      taskName: '',
      taskStatus: '',
      statusList: [],
      currentPage: 1,
      pageSize: 0,
      total: 0,
      taskDetail: {
        id: '',
        job_name: '',
        project_id: '',
        business_id: '',
        scene_type: '',
        scene_list: '',
        job_schedule: '',
        job_method: ''
      },
      dialogVisible: false
    };
  },
  methods: {
    // 打开新增弹窗
    openAddDialog() {
      this.dialogVisible = true;
      this.getConditionsForAdd();
      this.addSceneTypeList = [];
    },
    // 重置
    reset() {
      this.taskId = '';
      this.taskName = '';
      this.taskStatus = '';
      this.search();
    },
    // 清空数据
    clearData() {
      this.taskDetail = {
        id: '',
        job_name: '',
        project_id: '',
        business_id: '',
        scene_type: '',
        scene_list: '',
        job_schedule: '',
        job_method: ''
      };
      this.addProjectList = [];
      this.addBusinessList = [];
      this.addExecuteFunc = [];
      this.addSceneTypeList = [];
    },
    // 校验输入、选项框是否为空
    isEmpty(obj) {
      if (obj === '' || obj === undefined) {
        return true;
      } else {
        return false;
      }
    },
    // 所属业务改变
    changeBusinessId() {
      this.taskDetail['scene_list'] = [];
      this.taskDetail['scene_type'] = '';
      this.addSceneList = [];
    },
    // 场景类型改变
    changeSceneType() {
      this.taskDetail['scene_list'] = [];
      if (
        this.taskDetail['project_id'] !== '' &&
        this.taskDetail['business_id'] !== '' &&
        this.taskDetail['scene_type'] !== ''
      ) {
        // 指定参数格式
        let config = {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        };
        //  let url = String.format('{0}/jobInterface/addTask', 'http://127.0.0.1:5000')
        let url = String.format(
          '{0}/jobInterface/querySceneByConditions',
          this.GLOBAL.MONITOR_URL
        );
        let conditions = {
          project_id: this.taskDetail['project_id'],
          business_id: this.taskDetail['business_id'],
          scene_type: this.taskDetail['scene_type']
        };
        this.axios
          .post(url, JSON.stringify(conditions), config)
          .then(response => {
            this.addSceneList = response.data.sceneList;
          })
          .catch(response => {
            return response;
          });
      }
    },
    // 检查所属项目是否选中
    checkParentForAdd(item) {
      if (item === 'scene') {
        if (
          this.taskDetail['project_id'] === '' ||
          this.taskDetail['business_id'] === '' ||
          this.taskDetail['scene_type'] === ''
        ) {
          this.$message({
            type: 'error',
            message: '请先选择所属项目、所属业务、场景类型!'
          });
        }
      } else if (item === 'business') {
        if (this.taskDetail['project_id'] === '') {
          this.$message({
            type: 'error',
            message: '请先选择所属项目!'
          });
        }
      }
      // else if (item === 'scene_type') {
      //   if (
      //     this.taskDetail['project_id'] === '' ||
      //     this.taskDetail['business_id'] === ''
      //   ) {
      //     this.$message({
      //       type: 'error',
      //       message: '请先选择所属项目、所属业务!'
      //     });
      //   }
      // }
    },
    getConditionsForAdd() {
      this.taskDetail['business_id'] = '';
      this.taskDetail['scene_list'] = [];
      this.taskDetail['scene_type'] = '';
      this.addSceneTypeList = [];
      this.addSceneList = [];
      // 获取查询条件
      // let url = String.format('{0}/jobInterface/taskConditions', 'http://127.0.0.1:5000')
      let url = String.format(
        '{0}/jobInterface/taskConditions?project_id={1}',
        this.GLOBAL.MONITOR_URL,
        this.taskDetail['project_id']
      );
      this.axios
        .get(url)
        .then(response => {
          this.addProjectList = response.data.data.projectList;
          this.addExecuteFunc = response.data.data.executeFunc;
          this.addBusinessList = response.data.data.businessList;
          this.addSceneTypeList = response.data.data.sceneTypeList;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    getConditions() {
      // 获取查询条件
      // let url = String.format('{0}/jobInterface/taskConditions', 'http://127.0.0.1:5000')
      let url = String.format(
        '{0}/jobInterface/taskConditions?project_id={1}',
        this.GLOBAL.MONITOR_URL,
        ''
      );
      this.axios
        .get(url)
        .then(response => {
          this.statusList = response.data.data.statusList;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 新增保存job
    addTask() {
      if (
        this.isEmpty(this.taskDetail['id']) ||
        this.isEmpty(this.taskDetail['job_name']) ||
        this.isEmpty(this.taskDetail['job_method']) ||
        this.isEmpty(this.taskDetail['job_schedule']) ||
        this.isEmpty(this.taskDetail['scene_list'].join(','))
      ) {
        this.Message.error('警告:请填写必填项！');
      } else {
        // 指定参数格式
        let config = {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        };
        //  let url = String.format('{0}/jobInterface/addTask', 'http://127.0.0.1:5000')
        let url = String.format(
          '{0}/jobInterface/addTask',
          this.GLOBAL.MONITOR_URL
        );
        this.taskDetail['param'] = this.taskDetail['scene_list'].join(',');
        this.axios
          .post(url, JSON.stringify(this.taskDetail), config)
          .then(response => {
            let responseCode = response.data.code;
            if (responseCode === '200') {
              this.Message.success(response.data.msg);
              this.dialogVisible = false;
              // 刷新页面
              this.getTaskList();
            } else {
              this.Message.error(response.data.msg);
              // 刷新页面
              this.getTaskList();
            }
            return response;
          })
          .catch(response => {
            return response;
          });
      }
    },
    search() {
      this.getConditions();
      this.currentPage = 1;
      this.getTaskList();
    },
    // 获取任务列表
    getTaskList() {
      // 指定参数格式
      let config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      };
      // let url = String.format('{0}/jobInterface/taskList', 'http://127.0.0.1:5000')
      let url = String.format(
        '{0}/jobInterface/taskList',
        this.GLOBAL.MONITOR_URL
      );
      let conditions = {
        id: this.taskId,
        job_name: this.taskName,
        status: this.taskStatus,
        page_index: this.currentPage
      };
      this.axios
        .post(url, JSON.stringify(conditions), config)
        .then(response => {
          this.total = response.data.total;
          this.pageSize = response.data.pageSize;
          let jobInfo = response.data.jobInfo;
          this.tableHeader = jobInfo.tableHeader;
          this.tableData = jobInfo.tableData;
          return response;
        })
        .catch(response => {
          return response;
        });
    }
  },
  beforeMount() {
    this.getConditions();
    this.getTaskList();
  }
};
</script>

<style scoped>
.el-row {
  line-height: 60px;
  margin-top: 10px;
}

.taskDetail >>> .el-input__inner {
  height: 40px !important;
  width: 400px !important;
}

.conditionBar .el-col {
  display: flex;
}

.conditionBar .el-col span {
  white-space: nowrap;
}
</style>
