<template>
  <div>
    <el-form :model="conditionDict" :inline="true" class="demo-form-inline">
      <el-form-item label="项目id:">
        <el-input
          v-model="conditionDict.id"
          size="mini"
          placeholder="请输入项目id"
          clearable
        />
      </el-form-item>
      <el-form-item label="项目名称:">
        <el-input
          v-model="conditionDict.name"
          size="mini"
          placeholder="输入项目名称"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          size="mini"
          @click="getListByCondition('search')"
          >查询</el-button
        >
        <el-button
          type="success"
          round
          size="mini"
          @click="addProjectDialog = true"
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
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        fixed
        prop="name"
        label="名称"
        align="center"
        show-overflow-tooltip
      />
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
      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="getProject(scope.row.id)"
            >编辑
          </el-button>

          <el-button
            type="text"
            size="small"
            @click="deleteProject(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column></el-table
    >
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
      :visible.sync="addProjectDialog"
      :before-close="closeAddDialog"
      title="新增"
      width="60%"
    >
      <el-card>
        <el-form ref="addForm" :model="addForm" :rules="rules" :inline="true">
          <el-form-item label="项目名称" prop="name">
            <el-input
              v-model="addForm.name"
              placeholder="请输入项目名称"
              size="mini"
              clearable
            /> </el-form-item
        ></el-form>
      </el-card>

      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeAddDialog">取 消</el-button>
        <el-button size="mini" type="primary" @click="addProject('addForm')"
          >保 存
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="editProjectDialog"
      :before-close="closeEditDialog"
      title="编辑"
      width="60%"
    >
      <el-card>
        <el-form
          ref="editForm"
          :model="editForm"
          :rules="editRules"
          :inline="true"
        >
          <el-form-item label="项目名称" prop="name">
            <el-input
              v-model="editForm.name"
              placeholder="请输入项目名称"
              size="mini"
              clearable
            /> </el-form-item
        ></el-form>
      </el-card>

      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeEditDialog">取 消</el-button>
        <el-button size="mini" type="primary" @click="editProject('editForm')"
          >保 存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { project } from '../../api/common/createdata';
import { doRequest } from '../../api/common/request';

export default {
  name: 'ProjectConfig',
  data() {
    return {
      editForm: {},
      addForm: {},
      addProjectDialog: false,
      editProjectDialog: false,
      currentPage: 1,
      conditionDict: {},
      pageSize: 10,
      pageSizes: [5, 10, 20],
      total: 0,
      tableData: [],
      rules: {
        name: [{ required: true, message: '项目名称不能为空' }]
      },
      editRules: {
        name: [{ required: true, message: '项目名称不能为空' }]
      }
    };
  },
  beforeMount() {
    this.getListByCondition();
  },
  methods: {
    // 关闭项目新增弹窗
    closeAddDialog() {
      this.addProjectDialog = false;
      this.$refs['addForm'].resetFields();
    },
    // 关闭项目编辑弹窗
    closeEditDialog() {
      this.editProjectDialog = false;
      this.$refs['editForm'].resetFields();
    },
    // 新增项目
    addProject(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const paramDict = project.add;
          paramDict.param = { ...paramDict.param, ...this.addForm };
          doRequest(this.GLOBAL.BASE_URL, paramDict).then(response => {
            if (response.code === '1000') {
              this.closeAddDialog();
              this.$message.success('新增成功！');
              this.getListByCondition('search');
            } else {
              this.$message.error(response.msg);
            }
          });
        }
      });
    },
    // 根据项目id获取项目
    getProject(id) {
      this.editProjectDialog = true;
      const paramDict = project.getProject;
      paramDict.param.id = id;
      doRequest(this.GLOBAL.BASE_URL, paramDict).then(response => {
        this.editForm = response.data;
      });
    },
    // 根据项目id删除项目
    async deleteProject(id) {
      const result = await this.$confirm(
        '此操作将永久删除该项目, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err);
      if (result === 'confirm') {
        const paramDict = project.delete;
        const idDict = { id: id };
        paramDict.param = { ...paramDict.param, ...idDict };
        doRequest(this.GLOBAL.BASE_URL, paramDict).then(response => {
          if (response.code === '1000') {
            this.$message.success(response.msg);
            this.getListByCondition('search');
          } else {
            this.$message.error(response.msg);
          }
        });
      }
    },
    // 编辑项目
    editProject(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const paramDict = project.update;
          paramDict.param = { ...paramDict.param, ...this.editForm };
          doRequest(this.GLOBAL.BASE_URL, paramDict).then(response => {
            if (response.code === '1000') {
              this.closeEditDialog();
              this.$message.success('编辑成功！');
              this.getListByCondition('search');
            } else {
              this.$message.error(response.msg);
            }
          });
        }
      });
    },
    // 获取列表
    getListByCondition(type) {
      if (type === 'search') {
        this.currentPage = 1;
      }
      const paramDict = JSON.parse(JSON.stringify(project.projectList));
      this.conditionDict['pageSize'] = this.pageSize;
      this.conditionDict['pageNum'] = this.currentPage;
      paramDict.param = { ...paramDict.param, ...this.conditionDict };
      doRequest(this.GLOBAL.BASE_URL, paramDict).then(response => {
        this.tableData = response.data.projectList;
        this.total = response.data.total;
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
