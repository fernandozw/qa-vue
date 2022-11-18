<template>
  <div>
    <el-form
      :model="condition"
      :inline="true"
      class="demo-form-inline"
      size="mini"
    >
      <el-form-item label="数据源名称:">
        <el-input
          v-model="condition.name"
          size="mini"
          placeholder="请输入数据源名称"
          clearable
        />
      </el-form-item>
      <el-form-item label="数据源类型:">
        <el-select
          v-model="condition.type"
          placeholder="请选择"
          clearable
          size="mini"
        >
          <el-option
            v-for="item in typeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" round @click="getList"
          >查询
        </el-button>
        <el-button
          type="success"
          round
          size="mini"
          @click="dialogVisible = true"
          >新增
        </el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="20">
      <el-col v-for="item in dataSourceList" :key="item.index" :span="12">
        <el-card class="box-card" style="margin-bottom: 10px">
          <div slot="header" class="clearfix">
            <span>数据源名称:{{ item.name }}</span>
            <el-button
              style="float: right;margin-left: 20px"
              type="text"
              size="small"
              @click="deleteDataSource(item.id)"
              >删除
            </el-button>
            <el-button
              style="float: right"
              type="text"
              size="small"
              @click="getDetail(item.id)"
              >编辑</el-button
            >
          </div>
          <div
            v-for="element in Object.keys(item)"
            :key="element.index"
            class="text item"
          >
            {{ cardContent(element, item[element]) }}
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog
      :visible.sync="dialogVisible"
      :before-close="closeAddDialog"
      title="新增"
      width="40%"
    >
      <el-card class="box-card">
        <el-form
          ref="dataSourceForm"
          :model="dataSourceForm"
          :rules="addRules"
          label-position="left"
          label-width="100px"
        >
          <el-form-item label="名称:" prop="name">
            <el-input v-model="dataSourceForm.name" clearable size="mini" />
          </el-form-item>
          <el-form-item label="类型:" prop="type">
            <el-select
              v-model="dataSourceForm.type"
              placeholder="请选择"
              clearable
              size="mini"
            >
              <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="url:" prop="url">
            <el-input v-model="dataSourceForm.url" clearable size="mini" />
          </el-form-item>
          <el-form-item label="端口号:" prop="port">
            <el-input v-model="dataSourceForm.port" clearable size="mini" />
          </el-form-item>
          <el-form-item label="用户名:" prop="user">
            <el-input v-model="dataSourceForm.user" clearable size="mini" />
          </el-form-item>
          <el-form-item label="密码:" prop="password">
            <el-input v-model="dataSourceForm.password" clearable size="mini" />
          </el-form-item>
          <el-form-item label="table列表:" prop="tables">
            <el-input v-model="dataSourceForm.tables" clearable size="mini" />
          </el-form-item>
        </el-form>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeAddDialog">取 消</el-button>
        <el-button
          type="primary"
          size="mini"
          @click="addDataSource('dataSourceForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogVisibleEdit"
      :before-close="closeEditDialog"
      title="编辑"
      width="40%"
    >
      <el-card class="box-card">
        <el-form
          ref="dataSourceFormEdit"
          :model="dataSourceFormEdit"
          :rules="editRules"
          label-position="left"
          label-width="100px"
        >
          <el-form-item label="名称:" prop="name">
            <el-input v-model="dataSourceFormEdit.name" clearable size="mini" />
          </el-form-item>
          <el-form-item label="类型:" prop="type">
            <el-select
              v-model="dataSourceFormEdit.type"
              placeholder="请选择"
              clearable
              size="mini"
            >
              <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="url:" prop="url">
            <el-input v-model="dataSourceFormEdit.url" clearable size="mini" />
          </el-form-item>
          <el-form-item label="端口号:" prop="port">
            <el-input v-model="dataSourceFormEdit.port" clearable size="mini" />
          </el-form-item>
          <el-form-item label="用户名:" prop="user">
            <el-input v-model="dataSourceFormEdit.user" clearable size="mini" />
          </el-form-item>
          <el-form-item label="密码:" prop="password">
            <el-input
              v-model="dataSourceFormEdit.password"
              clearable
              size="mini"
            />
          </el-form-item>
          <el-form-item label="table列表:" prop="tables">
            <el-input
              v-model="dataSourceFormEdit.tables"
              clearable
              size="mini"
            />
          </el-form-item>
        </el-form>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeEditDialog">取 消</el-button>
        <el-button
          type="primary"
          size="mini"
          @click="editDataSource('dataSourceFormEdit')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { dataSource } from '../../api/common/createdata';
import { doRequest } from '../../api/common/request';

export default {
  name: 'DataSource',
  data() {
    return {
      typeList: [],
      dataSourceList: [],
      condition: {},
      dialogVisible: false,
      dialogVisibleEdit: false,
      dataSourceForm: {},
      dataSourceFormEdit: {},
      addRules: {
        name: [{ required: true, message: '名称不能为空', trigger: 'change' }],
        type: [{ required: true, message: '类型不能为空', trigger: 'change' }],
        url: [{ required: true, message: 'url不能为空', trigger: 'change' }],
        port: [
          { required: true, message: '端口号不能为空', trigger: 'change' }
        ],
        user: [
          { required: true, message: '用户名不能为空', trigger: 'change' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'change' }
        ],
        tables: [
          { required: true, message: 'table列表不能为空', trigger: 'change' }
        ]
      },
      editRules: {
        name: [{ required: true, message: '名称不能为空', trigger: 'change' }],
        type: [{ required: true, message: '类型不能为空', trigger: 'change' }],
        url: [{ required: true, message: 'url不能为空', trigger: 'change' }],
        port: [
          { required: true, message: '端口号不能为空', trigger: 'change' }
        ],
        user: [
          { required: true, message: '用户名不能为空', trigger: 'change' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'change' }
        ],
        tables: [
          { required: true, message: 'table列表不能为空', trigger: 'change' }
        ]
      }
    };
  },
  methods: {
    deleteDataSource(id) {
      const paramDict = dataSource.delete;
      const dict = { id: id };
      paramDict.param = { ...paramDict.param, ...dict };
      doRequest(this.GLOBAL.BASE_URL, paramDict).then(response => {
        if (response.code === '1000') {
          paramDict.param = dict;
          this.$message.success('删除成功！');
          this.getList();
        } else {
          this.$message.error(response.msg);
        }
      });
    },
    getDetail(id) {
      const paramDict = dataSource.detail;
      const dict = { id: id };
      paramDict.param = { ...paramDict.param, ...dict };
      doRequest(this.GLOBAL.BASE_URL, paramDict).then(response => {
        this.dataSourceFormEdit = response.data;
        paramDict.param = dict;
      });
      this.dialogVisibleEdit = true;
    },
    cardContent(key, value) {
      let content = '';
      if (key === 'name') {
        content = '名称:  ' + value;
      } else if (key === 'type') {
        content = '类型:  ' + value;
      } else if (key === 'url') {
        content = 'url:  ' + value;
      } else if (key === 'port') {
        content = 'port:  ' + value;
      } else if (key === 'user') {
        content = '用户名:  ' + value;
      } else if (key === 'password') {
        content = '密码:  ' + value;
      } else if (key === 'tables') {
        content = 'table列表:  ' + value;
      }
      return content;
    },
    getList() {
      const paramDict = dataSource.list;
      paramDict.param = { ...paramDict.param, ...this.condition };
      doRequest(this.GLOBAL.BASE_URL, paramDict).then(response => {
        this.dataSourceList = response.data.dataSourceList;
        paramDict.param = dataSource.list.param;
      });
    },
    closeAddDialog() {
      this.dialogVisible = false;
      this.dataSourceForm = {};
      this.$refs['dataSourceForm'].resetFields();
    },
    closeEditDialog() {
      this.dialogVisibleEdit = false;
      this.dataSourceFormEdit = {};
      this.$refs['dataSourceFormEdit'].resetFields();
    },
    // 新增数据源
    addDataSource(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const paramDict = dataSource.add;
          paramDict.param = { ...paramDict.param, ...this.dataSourceForm };
          doRequest(this.GLOBAL.BASE_URL, paramDict).then(response => {
            if (response.code === '1000') {
              this.closeAddDialog();
              paramDict.param = dataSource.add.param;
              this.$message.success('新增成功！');
              this.getList();
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
    // 编辑数据源
    editDataSource(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const paramDict = dataSource.update;
          paramDict.param = { ...paramDict.param, ...this.dataSourceFormEdit };
          doRequest(this.GLOBAL.BASE_URL, paramDict).then(response => {
            if (response.code === '1000') {
              this.closeEditDialog();
              paramDict.param = dataSource.update.param;
              this.$message.success('更新成功！');
              this.getList();
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
    getTypeList() {
      const paramDict = dataSource.typeList;
      doRequest(this.GLOBAL.BASE_URL, paramDict).then(response => {
        this.typeList = response.data.typeList;
      });
    },
    init() {
      this.getTypeList();
      this.getList();
    }
  }
};
</script>

<style scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 5px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}

.clearfix:after {
  clear: both;
}

.box-card {
  width: 520px;
}
</style>
