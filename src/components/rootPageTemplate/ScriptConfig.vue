<template>
  <div>
    <el-tabs
      v-model="activeName"
      type="border-card"
      style="margin-top: -10px"
      @tab-click="clickTab"
    >
      <el-tab-pane
        v-for="item in selectList"
        :key="item.value"
        :label="item.label"
      />
      <el-form
        :model="conditionDict"
        :inline="true"
        class="demo-form-inline"
        size="mini"
      >
        <el-form-item label="脚本id:">
          <el-input
            v-model="conditionDict.id"
            size="mini"
            placeholder="输入脚本id"
            clearable
          />
        </el-form-item>
        <el-form-item label="脚本名称:">
          <el-input
            v-model="conditionDict.name"
            size="mini"
            placeholder="输入脚本名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="脚本类型:">
          <el-select
            v-model="conditionDict.type"
            filterable
            placeholder="请选择"
            clearable
            size="mini"
          >
            <el-option
              v-for="item in typeList"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="配置状态:">
          <el-select
            v-model="conditionDict.isDone"
            filterable
            placeholder="请选择"
            clearable
            size="mini"
          >
            <el-option
              v-for="item in isDoneList"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属项目:">
          <el-select
            v-model="conditionDict.projectId"
            filterable
            placeholder="请选择"
            clearable
            size="mini"
            @input="onInput"
          >
            <el-option
              v-for="item in selectList"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="创建人:">
          <el-input
            v-model="conditionDict.owner"
            size="mini"
            placeholder="输入创建人名称"
            clearable
          />
        </el-form-item>
        <el-form-item style="float: right">
          <el-button
            type="primary"
            size="mini"
            round
            @click="getListByConditionForButton"
            >查询
          </el-button>
          <el-button type="success" round size="mini" @click="openAddDialog"
            >新增
          </el-button>
        </el-form-item>
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
          width="100"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="name"
          label="名称"
          width="100"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="projectId"
          label="所属项目"
          width="150"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{
              selectMap[scope.row.projectId]
                ? selectMap[scope.row.projectId]['label']
                : ''
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="content"
          label="脚本内容"
          width="350"
          align="center"
        >
          <template slot-scope="scope">
            <span
              >{{
                scope.row.content > 50
                  ? scope.row.content
                  : scope.row.content.slice(0, 50) + '...'
              }}<el-button
                v-if="scope.row.content.length > 50"
                type="text"
                size="mini"
                @click="contentClick(scope.row.content)"
                >查 看</el-button
              ></span
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          label="脚本类型"
          width="100"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="owner"
          label="责任人"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="isDone"
          label="配置状态"
          width="80"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ isDoneMap[scope.row.isDone]['label'] }}
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="updateTime"
          label="更新时间"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column fixed="right" label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="getMethodData(scope.row)"
              >配置方法
            </el-button>
            <el-button
              type="text"
              size="small"
              @click="openEditDialog(scope.row.id)"
              >编辑
            </el-button>
            <el-button
              :disabled="scope.row.isDone === 1 ? false : true"
              type="text"
              size="small"
              @click="getMethodForExecute(scope.row)"
              >执行
            </el-button>
            <el-button
              type="text"
              size="small"
              @click="deleteScript(scope.row.id)"
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
        :visible.sync="scriptDialog"
        :before-close="closeScriptDialog"
        title="脚本详情"
        width="70%"
        class="scriptDialog"
      >
        <el-card class="box-card" style="margin-top: -30px">
          <span id="cmDetail">
            <codemirror
              ref="cmEditor"
              v-model="codeMirrorDetail.code"
              :options="codeMirrorDetail.cmOptions"
              class="codemirror"
            />
          </span>
        </el-card>
        <div slot="footer" class="dialog-footer" style="margin-top: -30px">
          <el-button size="mini" type="primary" @click="closeScriptDialog"
            >确 定
          </el-button>
        </div>
      </el-dialog>
      <el-dialog
        :visible.sync="addScriptDialog"
        :before-close="closeAddDialog"
        title="新增"
        class="scriptDialog"
        width="90%"
        @opened="openEvent"
      >
        <el-form
          ref="addForm"
          :model="addForm"
          :rules="addRules"
          :inline="true"
        >
          <el-form-item label="脚本名称" prop="name">
            <el-input
              v-model="addForm.name"
              placeholder="请输入脚本名称"
              size="mini"
              clearable
              @input="onInput"
            />
          </el-form-item>
          <el-form-item label="所属项目" prop="projectId">
            <el-select
              v-model="addForm.projectId"
              placeholder="请选择所属项目"
              size="mini"
              clearable
              @input="onInput"
            >
              <el-option
                v-for="item in selectList"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="脚本类型" prop="type">
            <el-select
              v-model="addForm.type"
              placeholder="请选择脚本类型"
              size="mini"
              clearable
              @input="onInput"
            >
              <el-option
                v-for="item in typeList"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="责任人 " prop="owner">
            <el-input
              v-model="addForm.owner"
              placeholder="请输入责任人"
              size="mini"
              clearable
              @input="onInput"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="mini"
              @click="dataSourceDialog = true"
              >数据源
            </el-button>
          </el-form-item>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span style="color:red">* </span><span>脚本内容</span>
              <div id="cmAdd" style="margin-top: 10px">
                <codemirror
                  ref="cmEditor"
                  v-model="codeMirrorAdd.code"
                  :options="codeMirrorAdd.cmOptions"
                  class="codemirror"
                  @focus="addIsPass = false"
                />
              </div>
            </div>
            <el-button
              :disabled="compilerButton"
              size="mini"
              type="success"
              style="float: right;margin-top: -10px;margin-bottom: 10px"
              @click="compilerScript"
              >编 译
            </el-button>
          </el-card>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="closeAddDialog">取 消</el-button>
          <el-button
            :disabled="addIsPass ? false : true"
            size="mini"
            type="primary"
            @click="addScript('addForm')"
            >保 存
          </el-button>
        </div>
      </el-dialog>
      <el-dialog
        :visible.sync="editScriptDialog"
        :before-close="closeEditDialog"
        title="编辑"
        class="scriptDialog"
        width="90%"
        @opened="openEvent"
      >
        <el-form
          ref="editForm"
          :model="editForm"
          :rules="editRules"
          :inline="true"
        >
          <el-form-item label="脚本名称" prop="name">
            <el-input
              v-model="editForm.name"
              placeholder="请输入脚本名称"
              size="mini"
              clearable
            />
          </el-form-item>
          <el-form-item label="所属项目" prop="projectId">
            <el-select
              v-model="editForm.projectId"
              placeholder="请选择所属项目"
              size="mini"
              clearable
            >
              <el-option
                v-for="item in selectList"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="脚本类型" prop="type">
            <el-select
              v-model="editForm.type"
              placeholder="请选择脚本类型"
              size="mini"
              clearable
            >
              <el-option
                v-for="item in typeList"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="责任人 " prop="owner">
            <el-input
              v-model="editForm.owner"
              placeholder="请输入责任人"
              size="mini"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="mini"
              @click="dataSourceDialog = true"
              >数据源
            </el-button>
          </el-form-item>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span style="color:red">* </span><span>脚本内容</span>
              <div id="cmEdit" style="margin-top: 10px">
                <codemirror
                  ref="cmEditor"
                  v-model="codeMirrorEdit.code"
                  :options="codeMirrorEdit.cmOptions"
                  class="codemirror"
                  @focus="editIsPass = false"
                />
              </div>
            </div>
            <el-button
              :disabled="compilerButtonEdit"
              size="mini"
              type="success"
              style="float: right;margin-top: -10px;margin-bottom: 10px"
              @click="compilerScriptEdit"
              >编 译
            </el-button>
          </el-card>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="closeEditDialog">取 消</el-button>
          <el-button
            :disabled="editIsPass ? false : true"
            size="mini"
            type="primary"
            @click="editScript('editForm')"
            >保 存
          </el-button>
        </div>
      </el-dialog>
      <el-dialog
        :title="methodData.action === 'add' ? '新增配置' : '修改配置'"
        :visible.sync="configMethodDialog"
        :before-close="closeConfigMethodDialog"
        width="70%"
      >
        <method-config
          :method-data="methodData"
          :append-to-body="true"
          @fatherMethod="getListByConditionForChild"
          @getMethodDetail="getMethodDataForChild"
        />
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="closeConfigMethodDialog"
            >取 消
          </el-button>
          <el-button
            v-if="methodData.action === 'add'"
            size="mini"
            type="success"
            @click="addMethodConfig(methodData.methodList)"
            >保 存
          </el-button>
          <el-button
            v-else-if="methodData.action === 'edit'"
            size="mini"
            type="primary"
            @click="editMethodConfig(methodData.methodList)"
            >保 存
          </el-button>
          <el-button
            v-else-if="methodData.action === 'partEdit'"
            size="mini"
            type="primary"
            @click="editMethodConfig(methodData.methodList)"
            >保 存
          </el-button>
          <el-button
            v-else
            size="mini"
            type="success"
            @click="addMethodConfig(methodData.methodList)"
            >保 存
          </el-button>
        </div>
      </el-dialog>
      <el-dialog
        :visible.sync="executeDialog"
        :before-close="closeExecuteDialog"
        class="executeDialog"
        title="执行方法"
        width="60%"
      >
        <execute-method
          ref="executeMethod"
          :method-dict="executeMethodData"
          :scriptId="scriptId"
        />
        <div slot="footer" class="dialog-footer" style="margin-top: -30px">
          <el-button size="mini" type="warning" @click="closeExecuteDialog"
            >取 消
          </el-button>
        </div>
      </el-dialog>

      <el-dialog
        :visible.sync="dataSourceDialog"
        :before-close="closeDataSourceDialog"
        title="选择数据源"
        width="60%"
      >
        <el-form
          ref="dataSourceForm"
          :inline="true"
          :model="dataSourceForm"
          :rules="dataSourceRules"
          class="demo-form-inline"
        >
          <el-form-item label="类型" prop="type">
            <el-select
              v-model="dataSourceForm.type"
              validate-event="false"
              placeholder="请选择数据源"
              size="mini"
              clearable
              filterable
              @input="onInput"
              @change="getDataSourceByType(dataSourceForm.type)"
            >
              <el-option
                v-for="item in dataSourceTypeList"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item ref="dataSource" label="数据源" prop="dataSource">
            <el-select
              v-model="dataSourceForm.dataSource"
              placeholder="请选择数据源"
              size="mini"
              clearable
              filterable
              validate-event="false"
              @input="onInput"
              @change="getTableList(dataSourceForm.dataSource)"
            >
              <el-option
                v-for="item in dataSourceSelectList"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item ref="table" label="库" prop="table">
            <el-select
              v-model="dataSourceForm.table"
              placeholder="请选择库"
              size="mini"
              filterable
              clearable
              validate-event="false"
              @input="onInput"
            >
              <el-option
                v-for="item in tableList"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="margin-top: -30px">
          <el-button
            size="mini"
            type="success"
            @click="initDataSource('dataSourceForm')"
            >确 定
          </el-button>
        </div>
      </el-dialog>
    </el-tabs>
  </div>
</template>

<script>
import { script, method, dataSource } from '../../api/common/createdata';
import { doRequest } from '../../api/common/request';
import MethodConfig from '../DataCreateTemplate/MethodConfig';
import ExecuteMethod from '../DataCreateTemplate/ExecuteMethod';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/clike/clike';

export default {
  name: 'ScriptConfig',
  components: {
    methodConfig: MethodConfig,
    executeMethod: ExecuteMethod
  },
  data() {
    return {
      normalTemplate:
        'import java.sql.*;\n' +
        'import redis.clients.jedis.Jedis;\n' +
        '\n' +
        'public class CreateData {\n' +
        '\n' +
        '}\n',
      dataSourceForm: {},
      dataSourceTypeList: [],
      dataSourceDialog: false,
      dataSourceMap: {},
      tableList: [],
      dataSourceSelectList: [],
      activeName: '',
      addIsPass: false,
      editIsPass: false,
      editContentValue: '',
      compilerButtonEdit: false,
      editScriptDialog: false,
      editForm: {},
      compilerButton: true,
      codeMirrorAdd: {
        code: '',
        cmOptions: {
          tabSize: 2,
          mode: 'text/x-java',
          theme: 'dracula',
          lineNumbers: true,
          line: true,
          lineWrapping: true, // 代码折叠
          foldGutter: true,
          gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
          matchBrackets: true,
          autoCloseBrackets: true
        }
      },
      codeMirrorEdit: {
        code: '',
        cmOptions: {
          tabSize: 2,
          mode: 'text/x-java',
          theme: 'dracula',
          lineNumbers: true,
          line: true,
          lineWrapping: true, // 代码折叠
          foldGutter: true,
          gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
          matchBrackets: true,
          autoCloseBrackets: true
        }
      },
      codeMirrorDetail: {
        code: '',
        cmOptions: {
          tabSize: 2,
          mode: 'text/x-java',
          theme: 'dracula',
          lineNumbers: true,
          line: true,
          // 是否可编辑
          readOnly: 'true',
          // 代码折叠
          lineWrapping: true,
          foldGutter: true,
          gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
          matchBrackets: true,
          autoCloseBrackets: true
        }
      },
      scriptId: null,
      scriptForChild: '',
      executeMethodData: {},
      executeDialog: false,
      methodData: {},
      configMethodDialog: false,
      addForm: {},
      addScriptDialog: false,
      scriptDialog: false,
      contentValue: null,
      conditionDict: {},
      projectId: null,
      selectList: [],
      isDoneList: [],
      typeList: [],
      tableData: [],
      selectMap: {},
      isDoneMap: {},
      total: 0,
      currentPage: 1,
      pageSize: 10,
      pageSizes: [5, 10, 20],
      dataSourceRules: {
        type: [{ required: true, message: '数据源类型不能为空' }],
        dataSource: [{ required: true, message: '数据源不能为空' }],
        table: [{ required: true, message: '库不能为空' }]
      },
      addRules: {
        name: [
          { required: true, message: '脚本名称不能为空', trigger: 'change' }
        ],
        projectId: [
          { required: true, message: '所属项目不能为空', trigger: 'change' }
        ],
        type: [
          { required: true, message: '脚本类型不能为空', trigger: 'change' }
        ],
        owner: [
          { required: true, message: '责任人不能为空', trigger: 'change' }
        ]
      },
      editRules: {
        name: [
          { required: true, message: '脚本名称不能为空', trigger: 'change' }
        ],
        projectId: [
          { required: true, message: '所属项目不能为空', trigger: 'change' }
        ],
        owner: [
          { required: true, message: '责任人不能为空', trigger: 'change' }
        ],
        type: [
          { required: true, message: '脚本类型不能为空', trigger: 'change' }
        ]
      }
    };
  },
  // 监测新增脚本内容
  watch: {
    'codeMirrorAdd.code': {
      handler(newCode, oldCode) {
        if (newCode.replace(/[ ]/g, '').replace(/[\r\n]/g, '') === '') {
          this.compilerButton = true;
          this.addIsPass = false;
        } else {
          this.compilerButton = false;
        }
      },
      deep: true,
      immediate: true
    },
    'codeMirrorEdit.code': {
      handler(newCode, oldCode) {
        if (newCode.replace(/[ ]/g, '').replace(/[\r\n]/g, '') === '') {
          this.compilerButtonEdit = true;
          this.editIsPass = false;
        } else {
          this.compilerButtonEdit = false;
        }
      },
      deep: true,
      immediate: true
    },
    selectList: {
      handler(newList, oldList) {
        this.getListByCondition();
      }
      // ,
      // deep: true,
      // immediate: true
    }
  },
  methods: {
    clickTab() {
      this.conditionDict['projectId'] = this.selectList[this.activeName][
        'value'
      ];
      this.getListByCondition();
    },
    // 关闭数据源弹窗
    closeDataSourceDialog() {
      this.dataSourceDialog = false;
      this.$refs['dataSourceForm'].resetFields();
    },

    closeExecuteDialog() {
      this.executeDialog = false;
      this.$refs.executeMethod.init();
    },
    // 获取方法列表,供执行方法
    getMethodForExecute(script) {
      this.executeDialog = true;
      this.scriptId = script.id;
      const paramDict = method.getMethods;
      paramDict.param = { ...paramDict.param, ...script };
      doRequest(this.GLOBAL.BASE_URL, paramDict).then(response => {
        this.executeMethodData = response.data;
      });
    },
    // 校验配置方法的必填参数
    checkMethod(source) {
      let result = true;
      for (const item in source) {
        if (source[item]['methodLabel'].trim() === '') {
          result = false;
          break;
        }
      }
      return result;
    },
    // 新增方法配置
    addMethodConfig(methodList) {
      if (!this.checkMethod(methodList)) {
        this.$message.error('请填写必填项!');
      } else {
        const paramDict = method.add;
        paramDict.param = methodList;
        doRequest(this.GLOBAL.BASE_URL, paramDict).then(response => {
          if (response.code === '1000') {
            this.configMethodDialog = false;
            this.$message.success(response.msg);
            this.getListByConditionForChild();
          } else {
            this.$message.error(response.msg);
          }
        });
      }
    },
    // 修改方法配置
    editMethodConfig(methodList) {
      if (!this.checkMethod(methodList)) {
        this.$message.error('请填写必填项!');
      } else {
        const paramDict = method.update;
        paramDict.param = methodList;
        doRequest(this.GLOBAL.BASE_URL, paramDict).then(response => {
          if (response.code === '1000') {
            this.configMethodDialog = false;
            this.$message.success(response.msg);
            this.getListByConditionForChild();
          } else {
            this.$message.error(response.msg);
          }
        });
      }
    },
    // 获取方法详情
    getMethodData(script) {
      this.scriptForChild = script;
      this.configMethodDialog = true;
      const paramDict = method.getMethods;
      paramDict.param = { ...paramDict.param, ...script };
      doRequest(this.GLOBAL.BASE_URL, paramDict).then(response => {
        if (response.code === '1000') {
          this.methodData = response.data;
          const h = this.$createElement;
          this.$notify({
            title: '提示',
            message: h('i', { style: 'color: teal' }, response.msg)
          });
        } else {
          this.methodData.action = 'error';
          const h = this.$createElement;
          this.$notify({
            title: '提示',
            message: h('i', { style: 'color: red' }, response.msg)
          });
        }
      });
    },
    // 子组件获取方法详情
    getMethodDataForChild() {
      this.configMethodDialog = true;
      const paramDict = method.getMethods;
      paramDict.param = { ...paramDict.param, ...this.scriptForChild };
      doRequest(this.GLOBAL.BASE_URL, paramDict).then(response => {
        this.methodData = response.data;
        // const h = this.$createElement
        // this.$notify({
        //   title: '提示',
        //   message: h('i', { style: 'color: teal' }, response.msg)
        // })
      });
    },
    // 判断文本是否为空
    isEmpty(value) {
      if (value !== undefined) {
        const value1 = value.trim();
        if (value1 === '' || value1 === 'undefined') {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    },
    // 新增弹窗打开回调
    openEvent() {
      const paramDict = dataSource.typeList;
      doRequest(this.GLOBAL.BASE_URL, paramDict).then(response => {
        this.dataSourceTypeList = response.data.typeList;
      });
      this.$message.warning('请确保编译成功后再保存！');
    },
    // 新增编译脚本
    compilerScript() {
      const sourceScript = { script: this.codeMirrorAdd.code };
      const paramDict = script.formatScript;
      paramDict.param = { ...paramDict.param, ...sourceScript };
      doRequest(this.GLOBAL.BASE_URL, paramDict).then(response => {
        this.codeMirrorAdd.code = response.data.script;
        if (response.data.errorList.length > 0) {
          this.addIsPass = false;
          this.$notify.closeAll();
          let liItem = '';
          for (const item in response.data.errorList) {
            liItem = liItem + '<li>' + response.data.errorList[item] + '</li>';
          }
          this.$notify.error({
            title: '编译错误',
            dangerouslyUseHTMLString: true,
            message: '<ul>' + liItem + '</ul>',
            duration: 0
          });
        } else {
          this.addIsPass = true;
          this.$notify({
            title: '编译成功',
            message: '本次编译没有错误！',
            type: 'success'
          });
        }
      });
    },
    // 编辑编译脚本
    compilerScriptEdit() {
      const sourceScript = { script: this.codeMirrorEdit.code };
      const paramDict = script.formatScript;
      paramDict.param = { ...paramDict.param, ...sourceScript };
      doRequest(this.GLOBAL.BASE_URL, paramDict).then(response => {
        this.codeMirrorEdit.code = response.data.script;
        if (response.data.errorList.length > 0) {
          this.editIsPass = false;
          this.$notify.closeAll();
          let liItem = '';
          for (const item in response.data.errorList) {
            liItem = liItem + '<li>' + response.data.errorList[item] + '</li>';
          }
          this.$notify.error({
            title: '编译错误',
            dangerouslyUseHTMLString: true,
            message: '<ul>' + liItem + '</ul>',
            duration: 0
          });
        } else {
          this.editIsPass = true;
          this.$notify({
            title: '编译成功',
            message: '本次编译没有错误！',
            type: 'success'
          });
        }
      });
    },
    // 新增脚本
    addScript(formName) {
      this.$refs[formName].validate(valid => {
        this.addForm['content'] = this.codeMirrorAdd.code;
        if (valid && !this.isEmpty(this.addForm['content'])) {
          const paramDict = script.add;
          this.addForm['isDone'] = 0;
          paramDict.param = { ...paramDict.param, ...this.addForm };
          doRequest(this.GLOBAL.BASE_URL, paramDict).then(response => {
            if (response.code === '1000') {
              this.closeAddDialog();
              paramDict.param = script.add.param;
              this.$message.success('新增成功！');
              this.getListByCondition();
            } else {
              this.$message.error(response.msg);
            }
          });
        } else {
          this.$message.error('请填写必填项！');
          return false;
        }
      });
    },
    // mysql数据源
    dataSourceMysql(value, table) {
      const url =
        this.dataSourceMap[value]['url'] +
        ':' +
        this.dataSourceMap[value]['port'] +
        '/' +
        table;
      const user = this.dataSourceMap[value]['user'];
      const password = this.dataSourceMap[value]['password'];
      const connect =
        'Connection connection = DriverManager.getConnection("' +
        url +
        '","' +
        user +
        '","' +
        password +
        '");';
      const statement = ' statement = connection.createStatement();';
      const dataMethod =
        'private Statement mysql_' +
        table +
        '(){Statement statement = null;try{' +
        connect +
        statement +
        '}catch(Exception e){} return statement;}';
      return dataMethod;
    },
    // redis数据源
    dataSourceRedis(value, table) {
      const url = this.dataSourceMap[value]['url'];
      const port = this.dataSourceMap[value]['port'];
      const password = this.dataSourceMap[value]['password'];
      const client = 'Jedis jedis = new Jedis("' + url + '",' + port + ');';
      const setAuth = 'jedis.auth("' + password + '");';
      const selectDb = 'jedis.select(' + table + ');';
      const dataMethod =
        'private Jedis ' +
        this.dataSourceMap[value]['name'] +
        '_' +
        table +
        '(){' +
        client +
        setAuth +
        selectDb +
        'return jedis;}';
      return dataMethod;
    },
    // 处理数据源
    handleDataSource(type, value, table) {
      let method = '';
      if (type === 'mysql') {
        method = '\n' + this.dataSourceMysql(value, table);
      } else if (type === 'redis') {
        method = '\n' + this.dataSourceRedis(value, table);
      }
      return method;
    },
    // 插入方法
    insertMethod(method) {
      if (this.editScriptDialog) {
        this.codeMirrorEdit.code =
          this.codeMirrorEdit.code.slice(
            0,
            this.codeMirrorEdit.code.indexOf('{') + 1
          ) +
          method +
          this.codeMirrorEdit.code.slice(
            this.codeMirrorEdit.code.indexOf('{') + 1
          );
      } else if (this.addScriptDialog) {
        this.codeMirrorAdd.code =
          this.codeMirrorAdd.code.slice(
            0,
            this.codeMirrorAdd.code.indexOf('{') + 1
          ) +
          method +
          this.codeMirrorAdd.code.slice(
            this.codeMirrorAdd.code.indexOf('{') + 1
          );
      }
    },
    // 初始化数据源
    initDataSource(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.insertMethod(
            this.handleDataSource(
              this.dataSourceForm.type,
              this.dataSourceForm.dataSource,
              this.dataSourceForm.table
            )
          );
          this.closeDataSourceDialog();
        } else {
          this.$message.error('请填写必填项！');
          return false;
        }
      });
    },
    // 编辑脚本
    editScript(formName) {
      this.$refs[formName].validate(valid => {
        // this.editForm['content'] = this.codeMirrorEdit.code;
        if (valid && !this.isEmpty(this.editForm['content'])) {
          // if (this.editContentValue === this.codeMirrorEdit.code) {
          //   this.editForm['content'] = '';
          // } else {
          this.editForm['content'] = this.codeMirrorEdit.code;
          // }
          const paramDict = script.update;
          paramDict.param = { ...paramDict.param, ...this.editForm };
          doRequest(this.GLOBAL.BASE_URL, paramDict).then(response => {
            if (response.code === '1000') {
              this.closeEditDialog();
              paramDict.param = script.update.param;
              this.$message.success(response.msg);
              this.getListByCondition();
            } else {
              this.$message.error(response.msg);
            }
          });
        } else {
          this.$message.error('请填写必填项！');
          return false;
        }
      });
    },
    // 删除脚本
    async deleteScript(id) {
      const result = await this.$confirm(
        '此操作将永久删除该脚本, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err);
      if (result === 'confirm') {
        const paramDict = script.delete;
        const idDict = { id: id };
        paramDict.param = { ...paramDict.param, ...idDict };
        doRequest(this.GLOBAL.BASE_URL, paramDict).then(response => {
          if (response.code === '1000') {
            this.$message.success(response.msg);
            this.getListByCondition();
          } else {
            this.$message.error(response.msg);
          }
        });
      }
    },
    // 打开新增弹窗时的操作
    openAddDialog() {
      this.addForm = {
        name: null,
        projectId: this.selectList[this.activeName]['value'],
        type: null,
        owner: localStorage.getItem('name')
      };
      this.addScriptDialog = true;
      this.codeMirrorAdd.code = this.normalTemplate;
    },
    getDataSourceByType() {
      const paramDict = dataSource.dataSourceListForScript;
      const paramMap = { name: '', type: this.dataSourceForm.type };
      paramDict.param = { ...paramDict.param, ...paramMap };
      doRequest(this.GLOBAL.BASE_URL, paramDict).then(response => {
        this.dataSourceSelectList = response.data.selectList;
        this.dataSourceMap = response.data.dataSourceMap;
      });
    },
    getTableList(id) {
      const paramDict = dataSource.tableList;
      const idDict = { id: id };
      paramDict.param = { ...paramDict.param, ...idDict };
      doRequest(this.GLOBAL.BASE_URL, paramDict).then(response => {
        this.tableList = response.data.tableList;
      });
    },

    // 打开编辑弹窗时的操作
    openEditDialog(id) {
      const paramDict = script.getScriptById;
      const idDict = { id: id };
      paramDict.param = { ...paramDict.param, ...idDict };
      doRequest(this.GLOBAL.BASE_URL, paramDict).then(response => {
        this.editForm = response.data;
        this.codeMirrorEdit.code = response.data.content;
        this.editContentValue = JSON.parse(
          JSON.stringify(response.data)
        ).content;
      });
      this.editScriptDialog = true;
    },
    // 关闭脚本新增弹窗
    closeAddDialog() {
      this.addScriptDialog = false;
      this.codeMirrorAdd.code = '';
      this.$refs['addForm'].resetFields();
    },
    // 关闭配置方法弹窗时的操作
    closeConfigMethodDialog() {
      this.configMethodDialog = false;
      this.scriptForChild = '';
    },
    // 关闭脚本编辑弹窗
    closeEditDialog() {
      this.editScriptDialog = false;
      this.codeMirrorEdit.code = '';
      this.$refs['editForm'].resetFields();
    },
    // 关闭脚本详情弹窗
    closeScriptDialog() {
      this.scriptDialog = false;
      this.codeMirrorDetail.code = '';
    },
    // 获取项目下拉列表
    getSelectList() {
      const paramDict = script.selectList;
      doRequest(this.GLOBAL.BASE_URL, paramDict)
        .then(response => {
          this.selectList = response.data.selectList;
          this.isDoneList = response.data.isDoneList;
          this.isDoneMap = response.data.isDoneMap;
          this.selectMap = response.data.selectMap;
          this.typeList = response.data.typeList;
          return response;
        })
        .catch(error => {
          return error;
        });
    },
    // 根据查询条件获取脚本列表,供查询按钮使用
    async getListByConditionForButton() {
      const paramDict = JSON.parse(JSON.stringify(script.scriptList));
      this.conditionDict['pageSize'] = this.pageSize;
      this.conditionDict['pageNum'] = 1;
      this.currentPage = 1;
      paramDict.param = { ...paramDict.param, ...this.conditionDict };
      doRequest(this.GLOBAL.BASE_URL, paramDict).then(response => {
        this.tableData = response.data.scriptList;
        this.total = response.data.total;
      });
    },
    // 根据查询条件获取脚本列表
    getListByCondition() {
      const paramDict = JSON.parse(JSON.stringify(script.scriptList));
      this.conditionDict['pageSize'] = this.pageSize;
      this.conditionDict['pageNum'] = this.currentPage;
      this.conditionDict['projectId'] = this.selectList[this.activeName][
        'value'
      ];
      paramDict.param = { ...paramDict.param, ...this.conditionDict };
      doRequest(this.GLOBAL.BASE_URL, paramDict).then(response => {
        this.tableData = response.data.scriptList;
        this.total = response.data.total;
      });
    },
    // 根据查询条件获取脚本列表,提供给子组件使用
    getListByConditionForChild() {
      const paramDict = JSON.parse(JSON.stringify(script.scriptList));
      this.currentPage = 1;
      this.conditionDict = paramDict.param;
      this.conditionDict['projectId'] = this.selectList[this.activeName][
        'value'
      ];
      doRequest(this.GLOBAL.BASE_URL, paramDict).then(response => {
        this.tableData = response.data.scriptList;
        this.total = response.data.total;
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
    // 控制表格头部颜色
    getHeaderClass({ rowIndex }) {
      if (rowIndex === 0) {
        return 'background:deepskyblue';
      } else {
        return '';
      }
    },
    // 当每页的条数改变时
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getListByCondition();
    },
    // 查看脚本内容字段详情
    contentClick(value) {
      this.scriptDialog = true;
      const sourceScript = { script: value };
      const paramDict = script.formatScript;
      paramDict.param = { ...paramDict.param, ...sourceScript };
      doRequest(this.GLOBAL.BASE_URL, paramDict).then(response => {
        this.codeMirrorDetail.code = response.data.script;
      });
    },
    // 强制更新输入框
    onInput() {
      this.$forceUpdate();
    }
  },
  beforeMount() {
    this.getSelectList();
  }
};
</script>
<!-- element-ui中table表头错位问题-->
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

.scriptDialog {
  margin-top: -70px !important;
}

.executeDialog {
  height: calc(100vh) !important;
}

#cmDetail .CodeMirror {
  overscroll-y: scroll !important;
  height: auto !important;
}

#cmAdd .CodeMirror {
  overscroll-y: scroll !important;
  min-height: 400px !important;
  max-height: 1200px;
}

#cmEdit .CodeMirror {
  overscroll-y: scroll !important;
  min-height: 400px !important;
  max-height: 1200px;
}
</style>
