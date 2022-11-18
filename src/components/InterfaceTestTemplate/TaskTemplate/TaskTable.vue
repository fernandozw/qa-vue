<template>
  <div>
    <el-table
      v-loading="loading"
      element-loading-text="拼命执行中,请稍等~~~"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="tabData"
      style="width: 100%;margin-top: -10px"
      border
      size="mini"
      :row-class-name="tableRowClassName"
    >
      <!--使用默认的唯一索引index,作为key的唯一值-->
      <template v-for="(col, index) in tabHeader">
        <!--key是必须的且写在真实的html元素上,否则es6检查会报错-->
        <el-table-column
          v-if="col.prop === 'args'"
          :prop="col.prop"
          :label="col.label"
          :key="index"
          width="250px"
          align="center"
        >
          <template slot-scope="scope">
            <span
              >{{
                scope.row.args.split(',').length > 5
                  ? scope.row.args.slice(0, 12) + '...'
                  : scope.row.args
              }}<el-button
                type="text"
                size="mini"
                @click="idsClick(scope.row.args)"
                >查 看</el-button
              ></span
            >
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="col.prop === 'id'"
          :prop="col.prop"
          :label="col.label"
          :key="index"
          width="250px"
          align="center"
          fixed="left"
        >
        </el-table-column>
        <el-table-column
          v-else-if="col.prop === 'status'"
          :label="col.label"
          :key="index"
          align="center"
          show-overflow-tooltip
          width="100"
        >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{
              scope.row.status === 1 ? '运行中' : '已停用'
            }}</span>
          </template>
        </el-table-column>
        <!--操作选项-->
        <el-table-column
          v-else-if="col.type === 'action' && col.prop === 'action'"
          :label="col.label"
          :key="index"
          align="center"
          show-overflow-tooltip
          width="200px"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click="executeJob(tabData[scope.$index].args)"
              >执行
            </el-button>
            <el-button
              v-if="tabData[scope.$index].status === 1"
              type="text"
              size="mini"
              @click="pauseJob(tabData[scope.$index].id)"
              >停用
            </el-button>
            <el-button
              v-if="tabData[scope.$index].status === 0"
              type="text"
              size="mini"
              @click="resumeTask(tabData[scope.$index].id)"
              >启用
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="getJobDetail(tabData[scope.$index].id)"
              >编辑
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="removeTask(tabData[scope.$index].id)"
              >删除
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          v-else
          :prop="col.prop"
          :label="col.label"
          :key="index"
          align="center"
          show-overflow-tooltip
          width="250px"
        >
        </el-table-column>
      </template>
    </el-table>
    <el-dialog title="编辑" :visible.sync="editDialogVisible" width="80%">
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
                v-model="editTaskDetail['id']"
                clearable
                required="true"
                disabled
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
                v-model="editTaskDetail['job_name']"
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
                placeholder="必填项:请选择"
                v-model="editTaskDetail['project_id']"
                clearable
                required="true"
                @change="getConditionsForEdit"
                class="taskDetail"
                style="width: 400px"
              >
                <el-option
                  v-for="item in editProjectList"
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
                v-model="editTaskDetail['business_id']"
                clearable
                required="true"
                class="taskDetail"
                @focus="checkParentForEdit('business')"
                @change="changeBusinessId"
              >
                <el-option
                  v-for="item in editBusinessList"
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
                v-model="editTaskDetail['scene_type']"
                clearable
                required="true"
                @change="changeSceneType"
                class="taskDetail"
                @focus="checkParentForEdit('scene_type')"
              >
                <el-option
                  v-for="item in editSceneTypeList"
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
                v-model="editTaskDetail['scene_list']"
                multiple
                collapse-tags
                clearable
                required="true"
                filterable
                class="taskDetail"
                @focus="checkParentForEdit('scene')"
              >
                <el-option
                  v-for="item in editSceneList"
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
                v-model="editTaskDetail['job_schedule']"
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
                v-model="editTaskDetail['job_method']"
                clearable
                required="true"
                filterable
                class="taskDetail"
              >
                <el-option
                  v-for="item in editExecuteFunc"
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
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editTask">保 存</el-button>
      </span>
    </el-dialog>
    <el-dialog title="场景列表" :visible.sync="tabDialog">
      <el-table
        :data="sceneNameList"
        border
        size="mini"
        max-height="350px"
        :row-class-name="tableRowClassName"
      >
        <el-table-column
          property="id"
          label="场景id"
          width="100px"
          align="center"
        ></el-table-column>
        <el-table-column
          property="name"
          align="center"
          label="场景名称"
        ></el-table-column>
        <el-table-column
          property="status"
          label="状态"
          width="100px"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status === 0"
              type="danger"
              disabled
              icon="el-icon-close"
              circle
              size="mini"
            />
            <el-button
              v-else-if="scope.row.status === 1"
              type="success"
              icon="el-icon-check"
              circle
              disabled
              size="mini"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
export default {
  // 模板名称
  name: 'TaskTab',
  // 模板动态参数(tabData:表格的列数据;tabHeader:表头;tabHeight:表格的固定高度,值由引用组件传入)
  props: {
    tabData: null,
    tabHeader: null,
    tabHeight: null
  },
  data() {
    return {
      tabDialog: false,
      sceneNameList: [],
      editTaskDetail: {
        id: '',
        job_name: '',
        project_id: '',
        business_id: '',
        scene_type: '',
        scene_list: '',
        job_schedule: '',
        job_method: ''
      },
      editDialogVisible: false,
      editProjectList: [],
      editBusinessList: [],
      editExecuteFunc: [],
      editSceneTypeList: [],
      editSceneList: [],
      loading: false
    };
  },
  methods: {
    // 根据场景id集查询场景名称
    idsClick(sceneIds) {
      this.tabDialog = true;
      let conditions = { ids: sceneIds };
      let url = String.format(
        '{0}/jobInterface/sceneNameList',
        this.GLOBAL.MONITOR_URL
      );
      // 指定参数格式
      let config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      };
      this.axios
        .post(url, JSON.stringify(conditions), config)
        .then(response => {
          this.sceneNameList = response.data.data.scene_list;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 所属业务改变
    changeBusinessId() {
      this.editTaskDetail['scene_list'] = [];
      this.editTaskDetail['scene_type'] = '';
      this.editSceneList = [];
    },
    // 场景类型改变
    changeSceneType() {
      this.editTaskDetail['scene_list'] = [];
      if (
        this.editTaskDetail['project_id'] !== '' &&
        this.editTaskDetail['business_id'] !== '' &&
        this.editTaskDetail['scene_type'] !== ''
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
          project_id: this.editTaskDetail['project_id'],
          business_id: this.editTaskDetail['business_id'],
          scene_type: this.editTaskDetail['scene_type']
        };
        this.axios
          .post(url, JSON.stringify(conditions), config)
          .then(response => {
            this.editSceneList = response.data.sceneList;
          })
          .catch(response => {
            return response;
          });
      }
    },
    // 检查所属项目是否选中
    checkParentForEdit(item) {
      if (item === 'scene') {
        if (
          this.editTaskDetail['project_id'] === '' ||
          this.editTaskDetail['business_id'] === '' ||
          this.editTaskDetail['scene_type'] === ''
        ) {
          this.$message({
            type: 'error',
            message: '请先选择所属项目、所属业务、场景类型!'
          });
        }
      } else if (item === 'business') {
        if (this.editTaskDetail['project_id'] === '') {
          this.$message({
            type: 'error',
            message: '请先选择所属项目!'
          });
        }
      }
      // else if (item === 'scene_type') {
      //   if (
      //     this.editTaskDetail['project_id'] === '' ||
      //     this.editTaskDetail['business_id'] === ''
      //   ) {
      //     this.$message({
      //       type: 'error',
      //       message: '请先选择所属项目、所属业务!'
      //     });
      //   }
      // }
    },
    // 获取编辑页面查询条件
    getConditionsForEdit() {
      this.editTaskDetail['business_id'] = '';
      this.editTaskDetail['scene_list'] = [];
      this.editTaskDetail['scene_type'] = '';
      this.editSceneTypeList = [];
      this.editSceneList = [];
      // 获取查询条件
      // let url = String.format('{0}/jobInterface/taskConditions', 'http://127.0.0.1:5000')
      let url = String.format(
        '{0}/jobInterface/taskConditions?project_id={1}',
        this.GLOBAL.MONITOR_URL,
        this.editTaskDetail['project_id']
      );
      this.axios
        .get(url)
        .then(response => {
          this.editProjectList = response.data.data.projectList;
          this.editExecuteFunc = response.data.data.executeFunc;
          this.editBusinessList = response.data.data.businessList;
          this.editSceneTypeList = response.data.data.sceneTypeList;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 设置行的颜色
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return 'warning-row';
      } else {
        return 'success-row';
      }
    },
    // 根据jobId获取job详情
    getJobDetail(jobId) {
      this.editDialogVisible = true;
      // let editUrl = String.format('{0}/jobInterface/taskInfo?id={1}', 'http://127.0.0.1:5000', jobId)
      let editUrl = String.format(
        '{0}/jobInterface/taskInfo?id={1}',
        this.GLOBAL.MONITOR_URL,
        jobId
      );
      this.axios
        .get(editUrl)
        .then(response => {
          this.editSceneList = response.data.conditions.sceneList;
          this.editProjectList = response.data.conditions.projectList;
          this.editBusinessList = response.data.conditions.businessList;
          this.editSceneTypeList = response.data.conditions.sceneTypeList;
          this.editExecuteFunc = response.data.conditions.executeFunc;
          this.editTaskDetail = response.data.job_info;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 编辑保存job
    editTask() {
      if (
        this.isEmpty(this.editTaskDetail['id']) ||
        this.isEmpty(this.editTaskDetail['job_name']) ||
        this.isEmpty(this.editTaskDetail['job_method']) ||
        this.isEmpty(this.editTaskDetail['job_schedule']) ||
        this.isEmpty(this.editTaskDetail['scene_list'].join(','))
      ) {
        this.Message.error('警告:请填写必填项！');
      } else {
        let jobEntity = {
          id: this.editTaskDetail.id,
          job_name: this.editTaskDetail.job_name,
          job_method: this.editTaskDetail.job_method,
          job_des: this.editTaskDetail.job_des,
          job_schedule: this.editTaskDetail.job_schedule,
          job_type: this.editTaskDetail.job_type,
          param: this.editTaskDetail.scene_list.join(',')
        };
        // 指定参数格式
        let config = {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        };
        // let url = String.format('{0}/jobInterface/updateTask', 'http://127.0.0.1:5000')
        let url = String.format(
          '{0}/jobInterface/updateTask',
          this.GLOBAL.MONITOR_URL
        );
        this.axios
          .post(url, JSON.stringify(jobEntity), config)
          .then(response => {
            let responseCode = response.data.code;
            if (responseCode === '200') {
              this.$emit('search');
              this.Message.success('修改成功！');
              this.editDialogVisible = false;
            } else {
              this.Message.error('修改失败！');
              this.editDialogVisible = false;
              // 刷新页面
              this.$emit('search');
            }
            return response;
          })
          .catch(response => {
            return response;
          });
      }
    },
    // 删除job
    removeTask(jobId) {
      this.$confirm('此操作将永久删除该任务, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 指定参数格式
          let config = {
            headers: {
              'Content-Type': 'application/json;charset=UTF-8'
            }
          };
          // let url = String.format('{0}/jobInterface/removeTask', 'http://127.0.0.1:5000')
          let url = String.format(
            '{0}/jobInterface/removeTask',
            this.GLOBAL.MONITOR_URL
          );
          let conditions = {
            id: jobId.toString()
          };
          this.axios
            .post(url, JSON.stringify(conditions), config)
            .then(response => {
              let code = response.data.code;
              if (code === '200') {
                this.Message.success('删除成功！');
                this.$emit('search');
              } else {
                this.Message.error('删除失败！');
                this.$emit('search');
              }
              return response;
            })
            .catch(response => {
              return response;
            });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    // 手动执行任务
    executeJob(param) {
      this.loading = true;
      // 指定参数格式
      let config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      };
      // let url = String.format('{0}/jobInterface/executeTask', 'http://127.0.0.1:5000')
      let url = String.format(
        '{0}/jobInterface/executeTask',
        this.GLOBAL.MONITOR_URL
      );
      let conditions = {
        param: param.toString()
      };
      this.axios
        .post(url, JSON.stringify(conditions), config)
        .then(response => {
          let code = response.data.code;
          this.loading = false;
          if (code === '200') {
            this.$emit('search');

            this.Message.success('执行成功！');
          } else {
            this.$emit('search');

            this.Message.error('执行失败！');
          }
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 恢复job
    resumeTask(jobId) {
      // 指定参数格式
      let config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      };
      //  let url = String.format('{0}/jobInterface/resumeTask', 'http://127.0.0.1:5000')
      let url = String.format(
        '{0}/jobInterface/resumeTask',
        this.GLOBAL.MONITOR_URL
      );
      let conditions = {
        id: jobId.toString()
      };
      this.axios
        .post(url, JSON.stringify(conditions), config)
        .then(response => {
          let code = response.data.code;
          if (code === '200') {
            this.Message.success('启用成功！');
            this.$emit('search');
          } else {
            this.Message.error('启用失败！');
            this.$emit('search');
          }
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 暂停job
    pauseJob(jobId) {
      // 指定参数格式
      let config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      };
      // let url = String.format('{0}/jobInterface/pauseTask', 'http://127.0.0.1:5000')
      let url = String.format(
        '{0}/jobInterface/pauseTask',
        this.GLOBAL.MONITOR_URL
      );
      let conditions = {
        id: jobId.toString()
      };
      this.axios
        .post(url, JSON.stringify(conditions), config)
        .then(response => {
          let code = response.data.code;
          if (code === '200') {
            this.Message.success('暂停成功！');
            this.$emit('search');
          } else {
            this.Message.error('暂停失败！');
            this.$emit('search');
          }
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 校验输入、选项框是否为空
    isEmpty(obj) {
      if (obj === undefined || obj === '') {
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>
<style scoped>
.el-table >>> .warning-row {
  background: oldlace;
}

.el-table >>> .success-row {
  background: #f0f9eb;
}

.el-row {
  line-height: 60px;
  margin-top: 10px;
}

.editTaskDetail >>> .el-input__inner {
  height: 40px !important;
  width: 400px !important;
}
</style>
