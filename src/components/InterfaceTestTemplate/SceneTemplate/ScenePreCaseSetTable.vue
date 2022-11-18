<template>
  <div>
    <el-table
      v-loading="loading"
      element-loading-text="拼命执行中,请稍等~~~"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="tableData"
      style="width: 100%;margin-top: -10px"
      border
      size="mini"
      :row-class-name="tableRowClassName"
    >
      <!--使用默认的唯一索引index,作为key的唯一值-->
      <template v-for="(col, index) in tabHeader">
        <!--key是必须的且写在真实的html元素上,否则es6检查会报错-->
        <el-table-column
          v-if="col.prop === 'case_ids'"
          :prop="col.prop"
          :label="col.label"
          :key="index"
          width="250px"
          align="center"
        >
          <template slot-scope="scope">
            <span
              >{{
                scope.row.case_ids.split(',').length > 5
                  ? scope.row.case_ids.slice(0, 12) + '...'
                  : scope.row.case_ids
              }}<el-button
                type="text"
                size="mini"
                @click="idsClick(scope.row.case_ids)"
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
          align="center"
          fixed
          width="100px"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          v-else-if="col.prop === 'scene_name'"
          :prop="col.prop"
          :label="col.label"
          :key="index"
          align="center"
          width="250px"
          show-overflow-tooltip
        >
        </el-table-column>
        <!--操作选项-->
        <el-table-column
          v-else-if="col.type === 'action'"
          :label="col.label"
          :key="index"
          align="center"
          show-overflow-tooltip
          width="170px"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="执行前请确认已配置好场景对应项目版本的参数池！"
              placement="top"
            >
              <el-button
                type="text"
                size="mini"
                @click="executeScene(tableData[scope.$index].id)"
                >执行
              </el-button>
            </el-tooltip>
            <el-button
              type="text"
              size="mini"
              @click="editClick(tableData[scope.$index].id, 0)"
              >编辑
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="deleteScene(tableData[scope.$index].id)"
              >删除
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="editClick(tableData[scope.$index].id, 1)"
              >复制
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
          width="150px"
        >
        </el-table-column>
      </template>
    </el-table>
    <el-dialog
      :title="
        actionType === 0 ? '编辑(场景id：' + sceneDetail.id + ')' : '复制'
      "
      :visible.sync="dialogVisible"
      width="90%"
      @close="clearEditPage"
    >
      <el-card class="box-card">
        <div slot="header" class="clearfix" style="text-align:center;">
          <h1>前置场景</h1>
        </div>
        <el-row :gutter="30">
          <el-col :span="2">
            <span>场景名称:<span style="color:red">*</span></span>
          </el-col>
          <el-col :span="4">
            <el-input
              v-model="sceneDetail.scene_name"
              clearable
              placeholder="必填项:场景名称"
            ></el-input>
          </el-col>
          <el-col :span="2">
            <span>所属项目:<span style="color:red">*</span></span>
          </el-col>
          <el-col :span="4">
            <el-select
              v-model="sceneDetail.project_id"
              placeholder="必填项:请选择"
              clearable
              filterable
              @change="getConditionsForEdit"
            >
              <el-option
                v-for="item in sceneDetail.project_list"
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
              placeholder="请选择"
              v-model="sceneDetail.project_version"
              filterable
              clearable
              @focus="checkParentForEdit"
            >
              <el-option
                v-for="item in sceneDetail.version_list"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="2">
            <span>所属业务:<span style="color:red">*</span></span>
          </el-col>
          <el-col :span="4">
            <el-select
              placeholder="必填项:请选择"
              v-model="sceneDetail.business_id"
              filterable
              clearable
              @focus="checkParentForEdit"
            >
              <el-option
                v-for="item in sceneDetail.business_list"
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
              v-model="sceneDetail.create_person"
              clearable
              placeholder="必填项:创建人"
            ></el-input>
          </el-col>
          <el-col :span="3">
            <span>host替换: <span style="color:red">*</span></span>
          </el-col>
          <el-col :span="2" :pull="1">
            <el-checkbox
              v-model="editReplaceChecked"
              @change="handleEditReplaceCheck"
              >{{ editReplaceChecked ? '是' : '否' }}
            </el-checkbox>
          </el-col>
          <!--<el-col :span="3" :pull="1">-->
          <!--<span>替换配置: </span>-->
          <!--</el-col>-->
          <!--<el-col :span="8" :pull="2">-->
          <!--<el-input-->
          <!--type="textarea"-->
          <!--:autosize="{ minRows: 2, maxRows: 3 }"-->
          <!--placeholder='必须为Json格式,注意,python中的Json格式的key一定要使用双引号,固定格式:{"1":4,"2":5,"3":6}, key为旧host的id,value为新host的id,多个key-value代表需要替换多个host'-->
          <!--v-model="sceneDetail.replace_host_config"-->
          <!--clearable-->
          <!--@change="$forceUpdate()"-->
          <!--size="mini"-->
          <!--style="width:400px"-->
          <!--&gt;-->
          <!--</el-input>-->
          <!--</el-col>-->
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
          <h1>前置用例表</h1>
        </div>
        <el-table :data="tabData" border stripe style="width: 100%">
          <el-table-column label="所属项目" align="center" width="220px">
            <template slot-scope="scope">
              <span style="color:red">*</span>
              <el-select
                v-model="tabData[scope.$index].project_id"
                @change="getConditionsForEditCase(scope.$index)"
                placeholder="必填项:请选择"
                clearable
                filterable
                style="width:180px;"
              >
                <el-option
                  v-for="item in tabData[scope.$index].project_list"
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
                v-model="tabData[scope.$index].business_id"
                @change="getCaseList(scope.$index, 'change')"
                placeholder="必填项:请选择"
                clearable
                filterable
                style="width:180px;"
                @focus="checkParentForEditCase('business', scope.$index)"
              >
                <el-option
                  v-for="item in tabData[scope.$index].business_list"
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
                v-model="tabData[scope.$index].id"
                placeholder="必填项:请选择"
                clearable
                filterable
                @focus="checkParentForEditCase('case', scope.$index)"
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
        <el-button type="primary" @click="saveScene">保 存</el-button>
      </span>
    </el-dialog>
    <el-dialog title="用例集列表" :visible.sync="tabDialog">
      <el-table
        :data="caseNameList"
        border
        size="mini"
        max-height="350px"
        :row-class-name="tableRowClassName"
      >
        <el-table-column
          property="id"
          label="用例id"
          width="100px"
          align="center"
        ></el-table-column>
        <el-table-column
          property="name"
          align="center"
          label="用例名称"
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
  name: 'ScenePreCaseSetTab',
  // 模板动态参数(tableData:表格的列数据;tabHeader:表头;tabHeight:表格的固定高度,值由引用组件传入)
  props: {
    tableData: null,
    tabHeader: null,
    tabHeight: null
  },
  data() {
    return {
      // 源host
      sourceHost: [],
      // 目标host
      targetHost: [],
      // host下拉列表
      hostList: [],
      tabDialog: false,
      caseNameList: [],
      editReplaceChecked: false,
      dialogVisible: false,
      sceneDetail: {
        id: '',
        scene_name: '',
        project_id: '',
        business_id: '',
        create_person: '',
        project_version: '',
        is_replace_host: 0,
        replace_host_config: ''
      },
      tabData: [],
      loading: false,
      sceneType: 1,
      actionType: 0
    };
  },
  methods: {
    // 设置行的颜色
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return 'warning-row';
      } else {
        return 'success-row';
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
          this.isEmpty(list[item]['project_id']) ||
          this.isEmpty(list[item]['business_id']) ||
          this.isEmpty(list[item]['id'])
        ) {
          result = true;
          break;
        }
      }
      return result;
    },
    // 处理host替换选中、取消状态
    handleEditReplaceCheck() {
      if (this.editReplaceChecked) {
        this.sceneDetail.is_replace_host = 1;
      } else {
        this.sceneDetail.is_replace_host = 0;
      }
    },

    // 检查所属项目是否选中
    checkParentForEdit() {
      if (
        this.sceneDetail.project_id === '' ||
        this.sceneDetail.project_id === undefined
      ) {
        this.$message({
          type: 'error',
          message: '请先选择所属项目!'
        });
      }
    },
    // 获取编辑页面下拉列表
    getConditionsForEdit() {
      this.sceneDetail.business_id = '';
      this.sceneDetail.project_version = '';
      let url = String.format(
        '{0}/sceneInterface/sceneConditions?project_id={1}',
        this.GLOBAL.MONITOR_URL,
        this.sceneDetail['project_id']
      );
      this.axios
        .get(url)
        .then(response => {
          this.sceneDetail.project_list = response.data.data.projectList;
          this.sceneDetail.version_list = response.data.data.versionList;
          this.sceneDetail.business_list = response.data.data.businessList;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 编辑case检查所属项目、所属业务是否选中
    checkParentForEditCase(mark, index) {
      if (mark === 'case') {
        if (
          this.tabData[index].project_id === '' ||
          this.tabData[index].business_id === ''
        ) {
          this.$message({
            type: 'error',
            message: '请先选择所属项目、所属业务!'
          });
        } else {
          this.getCaseList(index, 'focus');
        }
      } else if (mark === 'business') {
        if (this.tabData[index].project_id === '') {
          this.$message({
            type: 'error',
            message: '请先选择所属项目!'
          });
        }
      }
    },
    // 获取编辑页面用例条件下拉列表
    getConditionsForEditCase(index) {
      this.tabData[index].business_id = '';
      this.tabData[index].id = '';
      this.tabData[index].caseList = [];
      let url = String.format(
        '{0}/caseInterface/caseConditions?project_id={1}',
        this.GLOBAL.MONITOR_URL,
        this.tabData[index].project_id
      );
      this.axios
        .get(url)
        .then(response => {
          this.tabData[index].project_list = response.data.data.projectList;
          this.tabData[index].business_list = response.data.data.businessList;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 获取用例列表
    getCaseList(index, type) {
      if (type === 'change') {
        this.tabData[index].id = '';
      }
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
        this.tabData[index].business_id !== '' &&
        this.sceneType !== ''
      ) {
        let conditions = {
          project_id: this.tabData[index].project_id,
          business_id: this.tabData[index].business_id,
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
    // 根据场景id执行场景
    executeScene(id) {
      this.loading = true;
      // 指定参数格式
      let config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      };
      let url = String.format(
        '{0}/executeInterface/executeScene',
        this.GLOBAL.MONITOR_URL
      );
      let sceneEntity = {
        id: id
      };
      this.axios
        .post(url, JSON.stringify(sceneEntity), config)
        .then(response => {
          let responseCode = response.data.code;
          this.loading = false;
          if (responseCode === '200') {
            this.Message.success('执行成功！');
          } else {
            this.Message.error('执行失败！');
          }
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
    // 根据场景id编辑场景
    editClick(id, type) {
      // 获取host下拉列表
      this.getHostList();
      this.actionType = type;
      let editUrl = String.format(
        '{0}/sceneInterface/sceneInfo?id={1}',
        this.GLOBAL.MONITOR_URL,
        id
      );
      this.axios
        .get(editUrl)
        .then(response => {
          this.sceneDetail = response.data.scene_info;
          this.tabData = response.data.scene_info.case_info_list;
          if (this.sceneDetail.is_replace_host === 1) {
            this.editReplaceChecked = true;
          } else {
            this.editReplaceChecked = false;
          }
          this.sourceHost = Object.keys(
            JSON.parse(this.sceneDetail.replace_host_config)
          );
          this.targetHost = Object.values(
            JSON.parse(this.sceneDetail.replace_host_config)
          );
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
    // 保存场景
    saveScene() {
      if (
        this.isEmpty(this.sceneDetail.scene_name) ||
        this.isEmpty(this.sceneDetail.create_person) ||
        this.isEmpty(this.sceneDetail.project_id) ||
        this.isEmpty(this.sceneDetail.business_id) ||
        this.listIsEmpty(this.tabData)
      ) {
        this.Message.error('警告:请填写必填项！');
      } else if (
        this.editReplaceChecked &&
        (this.sourceHost.length === 0 || this.targetHost.length === 0)
      ) {
        this.Message.error(
          '警告:勾选替换host后,「源host」「目标host」不能为空！'
        );
      } else {
        if (
          this.editReplaceChecked &&
          this.sourceHost.length !== this.targetHost.length
        ) {
          this.Message.error(
            '警告:勾选替换host后,「源host」「目标host」包含的host数量必须一致！'
          );
        } else {
          this.sceneDetail.replace_host_config = this.handleHost();
          let caseIds = [];
          for (let item in this.tabData) {
            let caseId = this.tabData[item].id;
            caseIds.push(caseId);
          }
          // 指定参数格式
          let config = {
            headers: {
              'Content-Type': 'application/json;charset=UTF-8'
            }
          };
          let url =
            this.actionType === 0
              ? String.format(
                  '{0}/sceneInterface/editScene',
                  this.GLOBAL.MONITOR_URL
                )
              : String.format(
                  '{0}/sceneInterface/addScene',
                  this.GLOBAL.MONITOR_URL
                );
          let sceneEntity = {
            id: this.sceneDetail.id,
            case_ids: caseIds.join(','),
            scene_name: this.sceneDetail.scene_name,
            scene_type: this.sceneType,
            project_id: this.sceneDetail.project_id,
            create_person: this.sceneDetail.create_person,
            project_version: this.sceneDetail.project_version,
            business_id: this.sceneDetail.business_id,
            is_replace_host: this.sceneDetail.is_replace_host,
            replace_host_config: this.sceneDetail.replace_host_config
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
              // 调用父组件的方法,刷新页面
              this.$emit('getSceneList');
              return response;
            })
            .catch(response => {
              // 调用父组件的方法,刷新页面
              this.$emit('getSceneList');
              return response;
            });
        }
      }
    },
    // 根据用例id集查询用例集名称
    idsClick(caseIds) {
      this.tabDialog = true;
      let conditions = { ids: caseIds };
      let url = String.format(
        '{0}/sceneInterface/caseNameList',
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
          this.caseNameList = response.data.data.case_list;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 根据场景id删除场景
    deleteScene(id) {
      this.$confirm('此操作将永久删除该场景, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let sceneInfo = { id: id };
          let url = String.format(
            '{0}/sceneInterface/removeScene',
            this.GLOBAL.MONITOR_URL
          );
          // 指定参数格式
          let config = {
            headers: {
              'Content-Type': 'application/json;charset=UTF-8'
            }
          };
          this.axios
            .post(url, JSON.stringify(sceneInfo), config)
            .then(response => {
              let responseCode = response.data.code;
              if (responseCode === '200') {
                this.Message.success('删除成功！');
              } else {
                this.Message.error('删除失败！');
              }
              // 调用父组件的查询方法
              this.$emit('getSceneList');
              return response;
            })
            .catch(response => {
              // 调用父组件的方法,刷新页面
              this.$emit('getSceneList');
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
    // 在指定的行索引后添加用例行
    handleAdd(index) {
      this.tabData.splice(index, 0, {
        project_id: '',
        project_list: [],
        business_id: '',
        business_list: [],
        id: '',
        caseList: []
      });
      // 数组元素互换位置
      let tempOption = this.tabData[index + 1];
      this.$set(this.tabData, index + 1, this.tabData[index]);
      this.$set(this.tabData, index, tempOption);
      this.tabData[index + 1].project_list = this.tabData[index].project_list;
    },
    // 删除指定行索引的用例行
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
    clearEditPage() {
      this.tabData = [
        {
          project_id: '',
          project_list: [],
          business_id: '',
          business_list: [],
          id: '',
          caseList: []
        }
      ];
      this.sceneDetail.id = '';
      this.sceneDetail.scene_name = '';
      this.sceneDetail.project_id = '';
      this.sceneDetail.business_id = '';
      this.sceneDetail.create_person = '';
      this.sceneDetail.project_version = '';
      this.sceneDetail.is_replace_host = 0;
      this.sceneDetail.replace_host_config = '';
      this.sourceHost = [];
      this.targetHost = [];
      this.hostList = [];
    }
  }
};
</script>
<!-- element-ui中table表头错位问题-->
<style scoped>
.el-table >>> .warning-row {
  background: oldlace;
}

.el-table >>> .success-row {
  background: #f0f9eb;
}

.el-row {
  line-height: 40px;
  margin-top: 10px;
}
</style>
