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
        <el-col :span="3" :push="1">
          <span>所属项目</span>
        </el-col>
        <el-col :span="6">
          <el-select
            v-model="projectId"
            clearable
            placeholder="请选择"
            filterable
            size="mini"
            @change="getConditions"
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
      <el-row :gutter="20" style="margin-top: 0px">
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
              :key="item.label"
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
              :key="item.label"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
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
      </el-row>
      <el-row :gutter="20">
        <el-col :span="16" style="float: right">
          <el-button type="primary" @click="search" round size="mini"
            >查询
          </el-button>
          <el-button type="success " @click="openAddDialog" round size="mini"
            >新增
          </el-button>
          <el-button type="info" @click="reset" round size="mini"
            >重置
          </el-button>
          <el-button type="danger" @click="useBatchCopy" round size="mini"
            >批量复制
          </el-button>
          <el-button @click="useBatchUpdate" round size="mini"
            >批量更新
          </el-button>
          <el-tooltip
            class="item"
            effect="dark"
            content="执行前请确认已配置好场景对应项目版本的参数池！"
            placement="top"
          >
            <el-button
              type="warning"
              @click="batchDeleteAndExecute('execute')"
              round
              size="mini"
              >批量执行
            </el-button>
          </el-tooltip>
          <el-button
            type="batchDelete"
            @click="batchDeleteAndExecute('delete')"
            size="mini"
            round
            >批量删除
          </el-button>
        </el-col>
      </el-row>
    </div>
    <div style="margin-top: 20px">
      <sceneCaseSetTab
        :tableData="tableData"
        :tabHeader="tableHeader"
        @getSceneList="getSceneList"
      ></sceneCaseSetTab>
    </div>
    <el-dialog
      title="新增"
      :visible.sync="dialogVisible"
      width="90%"
      @close="clearAddPage"
    >
      <el-card class="box-card">
        <div slot="header" class="clearfix" style="text-align:center;">
          <h1>正式场景</h1>
        </div>
        <el-row :gutter="30">
          <el-col :span="2">
            <span>场景名称: <span style="color:red">*</span></span>
          </el-col>
          <el-col :span="4">
            <el-input
              v-model="addSceneName"
              clearable
              placeholder="必填项:场景名称"
            ></el-input>
          </el-col>
          <el-col :span="2">
            <span>所属项目: <span style="color:red">*</span></span>
          </el-col>
          <el-col :span="4">
            <el-select
              v-model="addProjectId"
              placeholder="必填项:请选择"
              clearable
              filterable
              @change="getConditionsForAdd"
            >
              <el-option
                v-for="item in addProjectList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="2">
            <span>项目版本:</span>
          </el-col>
          <el-col :span="4">
            <el-select
              v-model="addProjectVersion"
              placeholder="请选择"
              clearable
              filterable
              @focus="checkParentForAdd"
            >
              <el-option
                v-for="item in addVersionList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="2">
            <span>所属业务: <span style="color:red">*</span></span>
          </el-col>
          <el-col :span="4">
            <el-select
              v-model="addBusinessId"
              placeholder="必填项:请选择"
              clearable
              filterable
              @focus="checkParentForAdd"
            >
              <el-option
                v-for="item in addBusinessList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="2">
            <span>创建人: <span style="color:red">*</span></span>
          </el-col>
          <el-col :span="4">
            <el-input
              v-model="addCreatePerson"
              clearable
              placeholder="必填项:创建人"
            ></el-input>
          </el-col>
          <el-col :span="3">
            <span>host替换: <span style="color:red">*</span></span>
          </el-col>
          <el-col :span="2" :pull="1">
            <el-checkbox
              v-model="addReplaceChecked"
              @change="handleAddReplaceCheck"
              >{{ addReplaceChecked ? '是' : '否' }}
            </el-checkbox>
          </el-col>
          <el-col :span="2" :pull="1">
            <span>源host:</span>
          </el-col>
          <el-col :span="11" :pull="2">
            <el-select
              v-model="sourceHost"
              multiple
              placeholder="请选择"
              style="width:450px"
            >
              <el-option
                v-for="item in hostList"
                :key="item.value"
                :label="item.label + ':' + item.address"
                :value="item.value + ''"
              >
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="2">
            <span>目标host:</span>
          </el-col>
          <el-col :span="11">
            <el-select
              v-model="targetHost"
              multiple
              placeholder="请选择"
              style="width:450px"
            >
              <el-option
                v-for="item in hostList"
                :key="item.value"
                :label="item.label + ':' + item.address"
                :value="item.value + ''"
              >
              </el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix" style="text-align:center;">
          <h1>正式用例表</h1>
        </div>
        <el-table :data="tabData" border stripe style="width: 100%">
          <el-table-column label="所属项目" align="center" width="220px">
            <template slot-scope="scope">
              <span style="color:red">*</span>
              <el-select
                style="width: 180px;"
                v-model="tabData[scope.$index].projectId"
                @change="getConditionsForAddCase(scope.$index)"
                placeholder="必填项:请选择"
                clearable
                filterable
              >
                <el-option
                  v-for="item in tabData[scope.$index].projectList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="所属业务" align="center" width="220px">
            <template slot-scope="scope">
              <span style="color:red">*</span>
              <el-select
                v-model="tabData[scope.$index].businessId"
                @change="getCaseList(scope.$index)"
                placeholder="必填项:请选择"
                clearable
                filterable
                style="width:180px;"
                @focus="checkParentForAddCase('business', scope.$index)"
              >
                <el-option
                  v-for="item in tabData[scope.$index].businessList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="用例" align="center">
            <template slot-scope="scope">
              <span style="color:red">*</span>
              <el-select
                style="width: 590px"
                v-model="tabData[scope.$index].caseId"
                placeholder="必填项:请选择"
                clearable
                filterable
                @focus="checkParentForAddCase('case', scope.$index)"
              >
                <el-option
                  v-for="item in tabData[scope.$index].caseList"
                  :key="item.id"
                  :label="
                    '[' +
                      item.project_version +
                      ']' +
                      '[' +
                      item.id +
                      ']' +
                      item.case_name +
                      ':' +
                      item.url
                  "
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="150px">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="handleAdd(scope.$index)"
                >插入
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
                >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addScene">保 存</el-button>
      </span>
    </el-dialog>
    <el-pagination
      @current-change="getSceneList"
      :current-page.sync="currentPage"
      :page-size="pageSize"
      layout="total,slot, prev, pager, next, jumper"
      :total="total"
      style="margin-top: 10px"
      size="mini"
    >
      <span>{{ pageSize }}条/页</span>
    </el-pagination>
    <scene-case-set-batch-update
      ref="batchUpdate"
      @search="search"
    ></scene-case-set-batch-update>
    <scene-case-set-batch-copy
      ref="batchCopy"
      @search="search"
    ></scene-case-set-batch-copy>
  </div>
</template>

<script>
import SceneCaseSetTab from '../SceneTemplate/SceneCaseSetTable';
import SceneCaseSetBatchUpdate from '../SceneTemplate/SceneCaseSetBatchUpdate';
import SceneCaseSetBatchCopy from './SceneCaseSetBatchCopy';

import cookies from 'vue-cookies';

export default {
  name: 'SceneCaseSetList',
  components: {
    sceneCaseSetTab: SceneCaseSetTab,
    sceneCaseSetBatchUpdate: SceneCaseSetBatchUpdate,
    sceneCaseSetBatchCopy: SceneCaseSetBatchCopy
  },
  data() {
    return {
      // 源host
      sourceHost: [],
      // 目标host
      targetHost: [],
      // host下拉列表
      hostList: [],
      tableData: [],
      projectList: [],
      projectId: '',
      businessList: [],
      businessId: '',
      createPerson: '',
      versionList: [],
      projectVersion: '',
      dialogVisible: false,
      sceneDetail: {},
      dialogList: [],
      total: 0,
      pageSize: 0,
      currentPage: 1,
      sceneId: '',
      sceneName: '',
      sceneType: 0,
      addReplaceChecked: false,
      addSceneName: '',
      addProjectList: [],
      addProjectId: '',
      addVersionList: [],
      addProjectVersion: '',
      addBusinessList: [],
      addBusinessId: '',
      addCreatePerson:
        cookies.get('username') === null ? '' : cookies.get('username'),
      addIsReplaceHost: 0,
      addReplaceHostConfig: '',
      tableHeader: [],
      tabData: [
        {
          projectId: '',
          projectList: [],
          businessId: '',
          businessList: '',
          caseId: '',
          caseList: []
        }
      ]
    };
  },
  methods: {
    // 调用批量复制中的方法
    useBatchCopy() {
      this.$refs.batchCopy.openCopyDialog();
    },
    // 调用批量更新中的方法
    useBatchUpdate() {
      this.$refs.batchUpdate.openBatchUpdateDialog();
    },
    // 批量删除和批量执行
    batchDeleteAndExecute(type) {
      if (this.projectId === '' || this.projectVersion === '') {
        this.$message({
          type: 'error',
          message: '所属项目、项目版本字段不能为空!'
        });
      } else {
        let boxMsg =
          type === 'delete'
            ? '此操作将永久删除当前条件下的所有场景, 是否继续?'
            : '此操作将批量执行当前条件下的所有场景, 是否继续?';
        let loadText =
          type === 'delete'
            ? '批量删除场景中,请稍后～～～(10秒后自动关闭！)'
            : '批量执行场景中,请喝杯茶再来吧～～～(1分钟后自动关闭！)';
        let loadTime = type === 'delete' ? 10000 : 60000;
        let url =
          type === 'delete'
            ? String.format(
                '{0}/sceneInterface/batchRemoveScene',
                this.GLOBAL.MONITOR_URL
              )
            : String.format(
                '{0}/executeInterface/batchExecuteScene',
                this.GLOBAL.MONITOR_URL
              );
        let cancelMsg = type === 'delete' ? '已取消删除!' : '已取消执行!';
        this.$confirm(boxMsg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            const loading = this.$loading({
              lock: true,
              text: loadText,
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            setTimeout(() => {
              loading.close();
            }, loadTime);
            // 指定参数格式
            let config = {
              headers: {
                'Content-Type': 'application/json;charset=UTF-8'
              }
            };
            let conditions = {
              id: this.sceneId,
              scene_name: this.sceneName,
              scene_type: this.sceneType,
              project_id: this.projectId,
              project_version: this.projectVersion,
              business_id: this.businessId,
              create_person: this.createPerson
            };
            this.axios
              .post(url, JSON.stringify(conditions), config)
              .then(response => {
                if (response.data.code === '200') {
                  loading.close();
                  this.$message.success(response.data.msg);
                } else {
                  loading.close();
                  this.Message.error(response.data.msg);
                }
                this.search();
                return response;
              })
              .catch(response => {
                this.search();
                return response;
              });
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: cancelMsg
            });
          });
      }
    },
    // 校验输入、选项框是否为空
    isEmpty(obj) {
      if (obj === undefined || obj === '') {
        return true;
      } else {
        return false;
      }
    },
    // 判断数组必填字段是否为空
    listIsEmpty(list) {
      let result = false;
      for (let item in list) {
        if (
          this.isEmpty(list[item]['projectId']) ||
          this.isEmpty(list[item]['businessId']) ||
          this.isEmpty(list[item]['caseId'])
        ) {
          result = true;
          break;
        }
      }
      return result;
    },
    // 处理新增弹窗host替换状态
    handleAddReplaceCheck() {
      if (this.addReplaceChecked) {
        this.addIsReplaceHost = 1;
      } else {
        this.addIsReplaceHost = 0;
      }
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
    // 重置查询条件
    reset() {
      this.initConditions();
      this.getConditions();
      this.getSceneList();
    },
    // tab切换查询
    searchForTab() {
      this.getConditionsForTab();
      this.getSceneList();
    },
    // 初始化查询条件
    initConditions() {
      this.sceneId = '';
      this.sceneName = '';
      this.projectId = '';
      this.businessId = '';
      this.projectVersion = '';
      this.currentPage = 1;
    },
    // 获取查询条件
    getConditions() {
      this.businessId = '';
      this.projectVersion = '';
      let url = String.format(
        '{0}/sceneInterface/sceneConditions?project_id={1}',
        this.GLOBAL.MONITOR_URL,
        this.projectId
      );
      this.axios
        .get(url)
        .then(response => {
          this.projectList = response.data.data.projectList;
          this.businessList = response.data.data.businessList;
          this.versionList = response.data.data.versionList;
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
          this.businessList = response.data.data.businessList;
          this.versionList = response.data.date.versionList;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 检查所属项目是否选中
    checkParentForAdd() {
      if (this.addProjectId === '' || this.addProjectId === undefined) {
        this.$message({
          type: 'error',
          message: '请先选择所属项目!'
        });
      }
    },
    // 获取新增页面下拉列表
    getConditionsForAdd() {
      this.addBusinessId = '';
      this.addCreatePerson =
        cookies.get('username') === null ? '' : cookies.get('username');
      this.addProjectVersion = '';
      let url = String.format(
        '{0}/sceneInterface/sceneConditions?project_id={1}',
        this.GLOBAL.MONITOR_URL,
        this.addProjectId
      );
      this.axios
        .get(url)
        .then(response => {
          this.addProjectList = response.data.data.projectList;
          this.addVersionList = response.data.data.versionList;
          this.addBusinessList = response.data.data.businessList;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 新增case检查所属项目、所属业务是否选中
    checkParentForAddCase(mark, index) {
      if (mark === 'case') {
        if (
          this.tabData[index].projectId === '' ||
          this.tabData[index].businessId === ''
        ) {
          this.$message({
            type: 'error',
            message: '请先选择所属项目、所属业务!'
          });
        }
      } else if (mark === 'business') {
        if (this.tabData[index].projectId === '') {
          this.$message({
            type: 'error',
            message: '请先选择所属项目!'
          });
        }
      }
    },
    // 获取新增页面用例条件下拉列表
    getConditionsForAddCase(index) {
      this.tabData[index].businessId = '';
      this.tabData[index].caseId = '';
      this.tabData[index].caseList = [];
      let url = String.format(
        '{0}/sceneInterface/sceneConditions?project_id={1}',
        this.GLOBAL.MONITOR_URL,
        this.tabData[index].projectId
      );
      this.axios
        .get(url)
        .then(response => {
          this.tabData[index].projectList = response.data.data.projectList;
          this.tabData[index].businessList = response.data.data.businessList;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 获取用例列表
    getCaseList(index) {
      this.tabData[index].caseId = '';
      this.tabData[index].caseList = [];
      // 指定参数格式
      let config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      };
      let url = String.format(
        '{0}/sceneInterface/searchCaseByConditions',
        this.GLOBAL.MONITOR_URL
      );
      if (
        this.tabData[index].project_id !== '' &&
        this.tabData[index].businessId !== '' &&
        this.sceneType !== ''
      ) {
        let conditions = {
          project_id: this.tabData[index].project_id,
          business_id: this.tabData[index].businessId,
          case_type: this.sceneType
        };
        this.axios
          .post(url, JSON.stringify(conditions), config)
          .then(response => {
            this.tabData[index].caseList = response.data.caseList;
            return response;
          })
          .catch(response => {
            return response;
          });
      } else {
        this.tabData[index].caseList = [];
      }
    },
    getSceneList() {
      // 指定参数格式
      let config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      };
      let url = String.format(
        '{0}/sceneInterface/searchScene',
        this.GLOBAL.MONITOR_URL
      );
      let conditions = {
        id: this.sceneId,
        scene_name: this.sceneName,
        scene_type: this.sceneType,
        project_id: this.projectId,
        project_version: this.projectVersion,
        business_id: this.businessId,
        create_person: this.createPerson,
        page_index: this.currentPage
      };
      this.axios
        .post(url, JSON.stringify(conditions), config)
        .then(response => {
          this.total = response.data.total;
          this.pageSize = response.data.pageSize;
          let sceneInfo = response.data.sceneInfo;
          this.tableHeader = sceneInfo.tableHeader;
          this.tableData = sceneInfo.tableData;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 获取host下拉列表
    getHostList() {
      let url = String.format(
        '{0}/hostInterface/getHostList',
        this.GLOBAL.MONITOR_URL
      );
      this.axios
        .get(url)
        .then(response => {
          this.hostList = response.data.hostList;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 打开新增弹窗
    openAddDialog() {
      // 获取host下拉列表
      this.getHostList();
      // 获取新增下拉选项
      this.getConditionsForAdd();
      let url = String.format(
        '{0}/projectInterface/projectListConditions',
        this.GLOBAL.MONITOR_URL
      );
      this.axios
        .get(url)
        .then(response => {
          this.tabData[0].projectList = response.data.project_list;
          return response;
        })
        .catch(response => {
          return response;
        });
      this.dialogVisible = true;
    },
    // 处理源host与目标host
    handleHost() {
      let result = {};
      let sourceLength = this.sourceHost.length;
      let targetLength = this.targetHost.length;
      let smallList = [];
      let bigList = [];
      if (sourceLength < targetLength || sourceLength === targetLength) {
        smallList = this.sourceHost;
        bigList = this.targetHost;
      } else {
        smallList = this.targetHost;
        bigList = this.sourceHost;
      }
      for (let i = 0; i < smallList.length; i++) {
        let key = String(smallList[i]);
        let value = bigList[i];
        result[key] = value;
      }
      return JSON.stringify(result);
    },
    // 新增场景
    addScene() {
      if (
        this.isEmpty(this.addSceneName) ||
        this.isEmpty(this.addProjectId) ||
        this.isEmpty(this.addCreatePerson) ||
        this.listIsEmpty(this.tabData) ||
        this.isEmpty(this.addBusinessId)
      ) {
        this.Message.error('警告:请填写必填项！');
      } else if (
        // this.addReplaceChecked && this.addReplaceHostConfig === ''
        this.addReplaceChecked &&
        (this.sourceHost.length === 0 || this.targetHost.length === 0)
      ) {
        // this.Message.error('警告:勾选替换host后,必须输入host替换配置信息！');
        this.Message.error(
          '警告:勾选替换host后,「源host」「目标host」不能为空！'
        );
      } else {
        if (
          this.addReplaceChecked &&
          this.sourceHost.length !== this.targetHost.length
        ) {
          this.Message.error(
            '警告:勾选替换host后,「源host」「目标host」包含的host数量必须一致！'
          );
        } else {
          this.addReplaceHostConfig = this.handleHost();
          let caseIds = [];
          for (let item in this.tabData) {
            let caseId = this.tabData[item].caseId;
            caseIds.push(caseId);
          }
          // 指定参数格式
          let config = {
            headers: {
              'Content-Type': 'application/json;charset=UTF-8'
            }
          };
          let url = String.format(
            '{0}/sceneInterface/addScene',
            this.GLOBAL.MONITOR_URL
          );
          let sceneEntity = {
            case_ids: caseIds.join(','),
            scene_name: this.addSceneName,
            scene_type: this.sceneType,
            project_id: this.addProjectId,
            project_version: this.addProjectVersion,
            business_id: this.addBusinessId,
            create_person: this.addCreatePerson,
            is_replace_host: this.addIsReplaceHost,
            replace_host_config: this.addReplaceHostConfig
          };
          this.axios
            .post(url, JSON.stringify(sceneEntity), config)
            .then(response => {
              let responseCode = response.data.code;
              if (responseCode === '200') {
                this.Message.success(response.data.msg);
                this.dialogVisible = false;
              } else {
                this.Message.error(response.data.msg);
              }

              this.search();
              return response;
            })
            .catch(response => {
              this.search();
              return response;
            });
        }
      }
    },
    search() {
      this.currentPage = 1;
      this.getSceneList();
    },
    handleAdd(index) {
      this.tabData.splice(index, 0, {
        projectId: '',
        projectList: [],
        businessId: '',
        businessList: [],
        caseId: '',
        caseList: []
      });
      // 数组元素互换位置
      let tempOption = this.tabData[index + 1];
      this.$set(this.tabData, index + 1, this.tabData[index]);
      this.$set(this.tabData, index, tempOption);
      this.tabData[index + 1].projectList = this.tabData[index].projectList;
    },
    handleDelete(index) {
      if (index === 0) {
        this.Message.error({
          message: '警告：请勿删除第一行！',
          center: true
        });
      } else {
        this.tabData.splice(index, 1);
      }
    },
    clearAddPage() {
      this.tabData = [
        {
          projectId: '',
          projectList: [],
          businessId: '',
          businessList: [],
          caseId: '',
          caseList: []
        }
      ];
      this.addSceneName = '';
      this.addProjectId = '';
      this.addBusinessId = '';
      this.addCreatePerson = '';
      this.addIsReplaceHost = 0;
      this.addReplaceHostConfig = '';
      this.addReplaceChecked = false;
      this.sourceHost = [];
      this.targetHost = [];
      this.hostList = [];
    }
  }
  // ,
  // beforeMount() {
  //   this.getConditions();
  //   this.getSceneList();
  // }
};
</script>

<style scoped>
.el-button--batchDelete.is-active,
.el-button--batchDeleten:active {
  background: #20b2aa;
  border-color: #20b2aa;
  color: #fff;
}

.el-button--batchDelete:focus,
.el-button--batchDelete:hover {
  background: #48d1cc;
  border-color: #48d1cc;
  color: #fff;
}

.el-button--batchDelete {
  color: #fff;
  background-color: #20b2aa;
  border-color: #20b2aa;
}

.el-row {
  line-height: 40px;
  margin-top: 10px;
}
</style>
