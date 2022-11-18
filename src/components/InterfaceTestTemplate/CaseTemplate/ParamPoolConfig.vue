<template>
  <div>
    <el-form :model="conditionDict" :inline="true" class="demo-form-inline">
      <el-row>
        <el-form-item label="参数池id:">
          <el-input
            v-model="conditionDict.id"
            size="mini"
            placeholder="请输入参数池id"
            clearable
          />
        </el-form-item>
        <el-form-item label="参数池名称:">
          <el-input
            v-model="conditionDict.pool_name"
            size="mini"
            placeholder="请输入参数池名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="所属项目:">
          <el-select
            v-model="conditionDict.project_id"
            clearable
            placeholder="请选择"
            filterable
            size="mini"
            @change="changeProject(conditionDict.project_id, 'list')"
          >
            <el-option
              v-for="item in projectList"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-row style="margin-top: -20px;">
        <el-form-item label="项目版本:">
          <el-select
            v-model="conditionDict.project_version"
            clearable
            placeholder="请选择"
            filterable
            size="mini"
            @focus="checkParent('list')"
          >
            <el-option
              v-for="item in versionList"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            round
            size="mini"
            @click="getListByCondition('search')"
            >查询
          </el-button>
          <el-button type="success" round size="mini" @click="openAddDialog"
            >新增
          </el-button>
          <el-button type="info" round size="mini" @click="reset"
            >重置
          </el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <el-table
      :data="tableData"
      :row-class-name="tableRowClassName"
      :header-cell-style="getHeaderClass"
      border
      style="width: 100%"
      size="mini"
    >
      <el-table-column
        fixed
        prop="id"
        label="id"
        align="center"
        width="100px"
        show-overflow-tooltip
      />
      <el-table-column
        prop="pool_name"
        label="名称"
        align="center"
        width="300px"
        show-overflow-tooltip
      />
      <el-table-column
        prop="project"
        label="所属项目"
        align="center"
        width="200px"
        show-overflow-tooltip
      />
      <el-table-column
        prop="project_version"
        label="项目版本"
        align="center"
        width="200px"
        show-overflow-tooltip
      />
      <el-table-column
        prop="add_time"
        label="创建时间"
        align="center"
        width="200px"
        show-overflow-tooltip
      />
      <el-table-column
        prop="update_time"
        label="更新时间"
        align="center"
        width="200px"
        show-overflow-tooltip
      />
      <el-table-column
        fixed="right"
        label="操作"
        align="center"
        min-width="200px"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="getPool(scope.row.id)"
            >编辑
          </el-button>

          <el-button type="text" size="small" @click="deletePool(scope.row.id)"
            >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page.sync="currentPage"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      style="margin-top: 10px"
      @size-change="handleSizeChange"
      @current-change="getListByCondition"
    />
    <el-dialog
      :visible.sync="addPoolDialog"
      :before-close="closeAddDialog"
      title="新增"
      width="90%"
    >
      <el-card>
        <el-form ref="addForm" :model="addForm" :rules="rules" :inline="true">
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="名称:" prop="pool_name">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  v-model="addForm.pool_name"
                  placeholder="请输入名称"
                  size="mini"
                  clearable
                  @change="$forceUpdate()"
                  style="width:200px"
                />
              </el-form-item>
            </el-col>
            <el-col :span="7" :pull="1">
              <el-form-item label="所属项目:" prop="project_id">
                <el-select
                  v-model="addForm.project_id"
                  clearable
                  placeholder="请选择"
                  filterable
                  size="mini"
                  @change="changeProject(addForm.project_id, 'add')"
                >
                  <el-option
                    v-for="item in addProjectList"
                    :key="item.label"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" :pull="1">
              <el-form-item label="项目版本:" prop="project_version">
                <el-select
                  v-model="addForm.project_version"
                  clearable
                  placeholder="请选择"
                  filterable
                  size="mini"
                  @focus="checkParent('add')"
                  @change="$forceUpdate()"
                >
                  <el-option
                    v-for="item in addVersionList"
                    :key="item.label"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="3" :pull="1">
              <el-form-item>
                <el-button type="text" @click="clickInit('add')"
                  >初始化常量
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item
                label="常量:(必须为Json格式,不能为嵌套Json和List)"
                prop="constant"
              >
                <code-mirror
                  v-model="addForm.constant"
                  :options="cmOptions"
                  class="codemirror"
                  style="width: 600px;height: 100%;"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="动态函数:(标准的python3无参函数,依赖在函数内部引入)"
                prop="inner_func"
              >
                <code-mirror
                  v-model="addForm.inner_func"
                  :options="cmOptions"
                  class="codemirror"
                  style="width: 600px;height: 100%;"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>

      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeAddDialog">取 消</el-button>
        <el-button size="mini" type="primary" @click="addPool('addForm')"
          >保 存
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="editPoolDialog"
      :before-close="closeEditDialog"
      :title="'编辑(id:' + editForm.id + ')'"
      width="90%"
    >
      <el-card>
        <el-form
          ref="editForm"
          :model="editForm"
          :rules="editRules"
          :inline="true"
        >
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="名称:" prop="pool_name">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  v-model="editForm.pool_name"
                  placeholder="请输入名称"
                  size="mini"
                  clearable
                  @change="$forceUpdate()"
                  style="width:200px"
                />
              </el-form-item>
            </el-col>
            <el-col :span="7" :pull="1">
              <el-form-item label="所属项目:" prop="project_id">
                <el-select
                  v-model="editForm.project_id"
                  clearable
                  placeholder="请选择"
                  filterable
                  size="mini"
                  @change="changeProject(editForm.project_id, 'edit')"
                >
                  <el-option
                    v-for="item in editProjectList"
                    :key="item.label"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" :pull="1">
              <el-form-item label="项目版本:" prop="project_version">
                <el-select
                  v-model="editForm.project_version"
                  clearable
                  placeholder="请选择"
                  filterable
                  size="mini"
                  @focus="checkParent('edit')"
                  @change="$forceUpdate()"
                >
                  <el-option
                    v-for="item in editVersionList"
                    :key="item.label"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="3" :pull="1">
              <el-form-item>
                <el-button type="text" @click="clickInit('edit')"
                  >初始化常量
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item
                label="常量:(必须为Json格式,不能为嵌套Json和List)"
                prop="constant"
              >
                <code-mirror
                  v-model="editForm.constant"
                  :options="cmOptions"
                  class="codemirror"
                  style="width: 600px;height: 100%;"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="动态函数:(标准的python3无参函数,依赖在函数内部引入)"
                prop="inner_func"
              >
                <code-mirror
                  v-model="editForm.inner_func"
                  :options="cmOptions"
                  class="codemirror"
                  style="width: 600px;height: 100%;"
                  placeholder="shuru"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>

      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeEditDialog">取 消</el-button>
        <el-button size="mini" type="primary" @click="editPool('editForm')"
          >保 存
        </el-button>
      </div>
    </el-dialog>
    <el-drawer
      title="初始化常量"
      :before-close="cancelForm"
      :visible.sync="initDataDialog"
      direction="rtl"
      custom-class="demo-drawer"
      size="40%"
    >
      <el-card>
        <div class="demo-drawer__content">
          <el-form
            :model="initDataForm"
            label-position="right"
            label-width="100px"
            :rules="initRules"
            ref="initData"
          >
            <el-form-item label="前台host" prop="host">
              <el-select
                v-model="initDataForm.host"
                filterable
                allow-create
                clearable
                placeholder="请输入前台host地址,例如:https://privapp.qiyuesuo.me"
                size="mini"
                style="width:400px"
              >
                <el-option
                  v-for="item in hostList"
                  :key="item.value"
                  :label="item.label + ':' + item.address"
                  :value="item.address"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="登录token" prop="token">
              <el-input
                style="width:400px"
                v-model="initDataForm.token"
                size="mini"
                clearable
                placeholder="请输入登录获取的token,例如:695d370b-cb54-400a-8678-0baed9029272"
              ></el-input>
            </el-form-item>
          </el-form>
          <div
            class="demo-drawer__footer"
            style="float: right;margin-bottom: 20px"
          >
            <el-button @click="cancelForm" size="mini">取 消</el-button>
            <el-button size="mini" type="primary" @click="initData('initData')"
              >确 定
            </el-button>
          </div>
        </div>
      </el-card>
      <div style="margin-top: 20px;margin-left: 20px;margin-right: 20px">
        <font color="red">{{ help }}</font>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { codemirror } from 'vue-codemirror';
import 'codemirror/mode/javascript/javascript'; // 这js模式必须引入的
import 'codemirror/addon/selection/active-line'; // 光标行背景高亮，配置里面也需要styleActiveLine设置为true
import 'codemirror/keymap/sublime'; // sublime编辑器效果
import 'codemirror/mode/css/css';
import 'codemirror/theme/monokai.css'; // 编辑器主题样式，配置里面theme需要设置monokai

export default {
  name: 'ParamPoolConfig',
  components: {
    codeMirror: codemirror
  },
  data() {
    return {
      help:
        '注意事项：用于获取token的账号必须是认证通过的,并且个人信息必须完善,如果个人信息不全,生成数据不会报错,' +
        '但是会导致初始化的信息不全(为什么不用账号密码直接调用登录接口获取token:由于系统风控的原因,' +
        '偶尔会出现验证码,会导致一直无法登录成功。)另外，各个版本的生成基础数据的接口也不一样,此生成基本数据功能目前是兼容到了4.2.5--4.3.0的所有版本,' +
        '版本差异如下:4.2.7、4.2.8没有ofd合同功能,当生成的某些数据为空时,就是对这个版本的某些接口没有做到兼容。',
      initType: 'add',
      hostList: [],
      initDataDialog: false,
      initDataForm: {
        token: '',
        host: ''
      },
      cmOptions: {
        tabSize: 2,
        mode: 'application/json',
        theme: 'monokai',
        lineNumbers: true,
        line: true,
        // 代码折叠
        gutters: ['CodeMirror-foldgutter'],
        // 软换行
        lineWrapping: true,
        // 光标背景高亮
        styleActiveLine: true
      },
      addForm: {
        project_id: '',
        project_version: '',
        pool_name: '',
        inner_func: '',
        constant: ''
      },
      editForm: {
        id: '',
        project_id: '',
        project_version: '',
        pool_name: '',
        inner_func: '',
        constant: ''
      },
      addPoolDialog: false,
      editPoolDialog: false,
      currentPage: 1,
      projectList: [],
      versionList: [],
      addProjectList: [],
      editProjectList: [],
      addVersionList: [],
      editVersionList: [],
      conditionDict: {
        id: '',
        pool_name: '',
        project_id: '',
        project_version: ''
      },
      pageSize: 10,
      pageSizes: [5, 10, 20],
      total: 0,
      tableData: [],
      rules: {
        pool_name: [{ required: true, message: '参数池名称不能为空' }],
        project_id: [{ required: true, message: '所属项目不能为空' }],
        project_version: [{ required: true, message: '项目版本不能为空' }]
      },
      editRules: {
        pool_name: [{ required: true, message: '参数池名称不能为空' }],
        project_id: [{ required: true, message: '所属项目不能为空' }],
        project_version: [{ required: true, message: '项目版本不能为空' }]
      },
      initRules: {
        host: [{ required: true, message: 'host不能为空' }],
        token: [{ required: true, message: 'token不能为空' }]
      }
    };
  },
  methods: {
    // 打开新增弹窗
    openAddDialog() {
      this.addPoolDialog = true;
      this.getConditions('add');
    },
    // 检查上级是否选中
    checkParent(type) {
      if (type === 'list' && this.conditionDict.project_id === '') {
        this.$message({
          type: 'error',
          message: '请先选择所属项目!'
        });
      } else if (type === 'add' && this.addForm.project_id === '') {
        this.$message({
          type: 'error',
          message: '请先选择所属项目!'
        });
      } else if (type === 'edit' && this.editForm.project_id === '') {
        this.$message({
          type: 'error',
          message: '请先选择所属项目!'
        });
      }
    },
    // 切换项目
    changeProject(projectId, type) {
      if (type === 'add') {
        this.addForm.project_version = '';
      } else if (type === 'edit') {
        this.editForm.project_version = '';
      } else if (type === 'list') {
        this.conditionDict.project_version = '';
      }
      let url = String.format(
        '{0}/projectInterface/projectVersions?project_id={1}',
        this.GLOBAL.MONITOR_URL,
        projectId
      );
      this.axios
        .get(url)
        .then(response => {
          if (type === 'list') {
            this.versionList = response.data.version_list;
          } else if (type === 'add') {
            this.addVersionList = response.data.version_list;
          } else if (type === 'edit') {
            this.editVersionList = response.data.version_list;
          }

          return response;
        })
        .catch(response => {
          return response;
        });
      this.$forceUpdate();
    },
    // 获取项目下拉查询条件
    getConditions(type) {
      let url = String.format(
        '{0}/projectInterface/projectListConditions',
        this.GLOBAL.MONITOR_URL
      );
      this.axios
        .get(url)
        .then(response => {
          if (type === 'list') {
            this.projectList = response.data.project_list;
          } else if (type === 'add') {
            this.addProjectList = response.data.project_list;
          } else if (type === 'edit') {
            this.editProjectList = response.data.project_list;
          }

          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 重置搜索
    reset() {
      this.conditionDict = {
        id: '',
        pool_name: '',
        project_id: '',
        project_version: ''
      };
      this.versionList = [];
      this.pageSize = 10;
      this.pageSizes = [5, 10, 20];
      this.currentPage = 1;
      this.getConditions('list');
      this.getListByCondition('search');
    },
    // 关闭参数池新增弹窗
    closeAddDialog() {
      this.addPoolDialog = false;
      this.addProjectList = [];
      this.$refs['addForm'].resetFields();
    },
    // 关闭参数池编辑弹窗
    closeEditDialog() {
      this.editPoolDialog = false;
      this.editProjectList = [];
      this.$refs['editForm'].resetFields();
    },
    // 新增参数池
    addPool(formName) {
      if (!this.GLOBAL.checkJson(this.addForm.constant)) {
        this.$message.error('常量必须为Json格式!');
      } else {
        this.$refs[formName].validate(valid => {
          if (valid) {
            let url = String.format(
              '{0}/paramPoolInterface/addParamPool',
              this.GLOBAL.MONITOR_URL
            );
            // 指定参数格式
            let config = {
              headers: {
                'Content-Type': 'application/json;charset=UTF-8'
              }
            };
            this.axios
              .post(url, JSON.stringify(this.addForm), config)
              .then(response => {
                if (response.data.code === '200') {
                  this.closeAddDialog();
                  this.$message.success('新增成功！');
                  this.getListByCondition('search');
                } else {
                  this.$message.error(response.msg);
                }
                return response;
              })
              .catch(response => {
                return response;
              });
          }
        });
      }
    },
    // 根据参数池id获取参数池
    getPool(poolId) {
      this.editPoolDialog = true;
      this.getConditions('edit');
      let url = String.format(
        '{0}/paramPoolInterface/paramPoolInfo',
        this.GLOBAL.MONITOR_URL
      );
      // 指定参数格式
      let config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      };
      let params = {
        id: poolId
      };
      this.axios
        .post(url, JSON.stringify(params), config)
        .then(response => {
          this.editForm = response.data.paramPool;
          this.editVersionList = response.data.versionList;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 根据业务id删除参数池
    async deletePool(poolId) {
      const result = await this.$confirm(
        '此操作将永久删除该参数池, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err);
      if (result === 'confirm') {
        let url = String.format(
          '{0}/paramPoolInterface/removeParamPool',
          this.GLOBAL.MONITOR_URL
        );
        // 指定参数格式
        let config = {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        };
        let params = {
          id: poolId
        };
        this.axios
          .post(url, JSON.stringify(params), config)
          .then(response => {
            if (response.data.code === '200') {
              this.$message.success('删除成功！');
              this.getListByCondition('search');
            } else {
              this.$message.error(response.msg);
            }
            return response;
          })
          .catch(response => {
            return response;
          });
      }
    },
    // 编辑参数池
    editPool(formName) {
      if (!this.GLOBAL.checkJson(this.editForm.constant)) {
        this.$message.error('常量必须为Json格式!');
      } else {
        this.$refs[formName].validate(valid => {
          if (valid) {
            let url = String.format(
              '{0}/paramPoolInterface/editParamPool',
              this.GLOBAL.MONITOR_URL
            );
            // 指定参数格式
            let config = {
              headers: {
                'Content-Type': 'application/json;charset=UTF-8'
              }
            };
            this.axios
              .post(url, JSON.stringify(this.editForm), config)
              .then(response => {
                if (response.data.code === '200') {
                  this.closeEditDialog();
                  this.$message.success('更新成功！');
                  this.getListByCondition('search');
                } else {
                  this.$message.error(response.msg);
                }
                return response;
              })
              .catch(response => {
                return response;
              });
          }
        });
      }
    },
    // 获取列表
    getListByCondition(type) {
      if (type === 'search') {
        this.currentPage = 1;
      }
      let url = String.format(
        '{0}/paramPoolInterface/searchParamPool',
        this.GLOBAL.MONITOR_URL
      );
      // 指定参数格式
      let config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      };
      this.conditionDict['pageSize'] = this.pageSize;
      this.conditionDict['page_index'] = this.currentPage;
      this.axios
        .post(url, JSON.stringify(this.conditionDict), config)
        .then(response => {
          this.tableData = response.data.paramPoolList.tableData;
          this.total = response.data.total;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 当每页的条数改变时
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getListByCondition();
    },
    // 设置行的颜色
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return 'warning-row';
      } else {
        return 'success-row';
      }
    },
    // 控制表格头部颜色
    getHeaderClass({ rowIndex }) {
      if (rowIndex === 0) {
        return 'background:deepskyblue';
      } else {
        return '';
      }
    },
    // 初始化数据
    initData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: '初始化常量中,请喝口茶再来吧～～～(30秒后自动关闭！)',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          setTimeout(() => {
            loading.close();
            this.initDataDialog = false;
          }, 30000);
          // 指定参数格式
          let config = {
            headers: {
              'Content-Type': 'application/json;charset=UTF-8'
            }
          };
          let url = String.format(
            '{0}/initDataInterface/initBaseData',
            this.GLOBAL.MONITOR_URL
          );
          let conditions = {
            host: this.initDataForm.host,
            token: this.initDataForm.token,
            project_version:
              this.initType === 'add'
                ? this.addForm.project_version
                : this.editForm.project_version
          };
          this.axios
            .post(url, JSON.stringify(conditions), config)
            .then(response => {
              if (response.data.code === '200') {
                loading.close();
                if (this.initType === 'add') {
                  this.addForm.constant = JSON.stringify(
                    response.data.data,
                    null,
                    4
                  );
                } else if (this.initType === 'edit') {
                  this.editForm.constant = JSON.stringify(
                    response.data.data,
                    null,
                    4
                  );
                }
                this.$message.success(response.data.msg);
              } else {
                loading.close();
                this.Message.error(response.data.msg);
              }
              return response;
            })
            .catch(response => {
              return response;
            });
        }
      });
    },
    // 关闭初始化常量弹窗
    cancelForm() {
      this.initDataDialog = false;
      this.$refs['initData'].resetFields();
    },
    // 点击初始化常量按钮
    clickInit(type) {
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
      let version = '';
      if (type === 'add') {
        version = this.addForm.project_version;
      } else if (type === 'edit') {
        version = this.editForm.project_version;
      }
      if (version === '') {
        this.$message.error('初始化常量时,项目版本不能为空!');
      } else {
        this.initType = type;
        this.initDataDialog = true;
      }
    }
  }
};
</script>

<style scoped>
body .el-table th.gutter {
  display: table-cell !important;
}

body .el-table colgroup.gutter {
  display: table-cell !important;
}

.el-table >>> .warning-row {
  background: oldlace;
}

.el-table >>> .success-row {
  background: #f0f9eb;
}

td:not(.is-hidden):last-child {
  right: -1px;
}

.el-table__header tr,
.el-table__header th {
  padding: 0;
  height: 40px;
}

.el-row {
  line-height: 40px;
  margin-top: 10px;
}
</style>
