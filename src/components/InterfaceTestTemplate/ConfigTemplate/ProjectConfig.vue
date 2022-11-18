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
          v-model="conditionDict.project_name"
          size="mini"
          placeholder="输入项目名称"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          size="mini"
          round
          @click="getListByCondition('search')"
          >查询
        </el-button>
        <el-button
          type="success"
          round
          size="mini"
          @click="addProjectDialog = true"
          >新增
        </el-button>
        <el-button type="info" round size="mini" @click="reset"
          >重置
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
        prop="project_name"
        label="名称"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="add_time"
        label="创建时间"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="update_time"
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
      :visible.sync="addProjectDialog"
      :before-close="closeAddDialog"
      title="新增"
      width="70%"
    >
      <el-card>
        <el-form ref="addForm" :model="addForm" :rules="rules" :inline="true">
          <el-form-item label="项目名称" prop="project_name">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              v-model="addForm.project_name"
              placeholder="请输入项目名称"
              size="mini"
              clearable
              style="width:350px"
            />
          </el-form-item>
          <el-form-item
            label="项目版本列表"
            prop="project_versions"
            style="float:right;"
          >
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              v-model="addForm.project_versions"
              placeholder="请输入项目版本列表,以逗号分割(例如:4.2.0,4.3.0)"
              size="mini"
              clearable
              style="width:350px"
            />
          </el-form-item>
        </el-form>
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
      width="70%"
    >
      <el-card>
        <el-form
          ref="editForm"
          :model="editForm"
          :rules="editRules"
          :inline="true"
        >
          <el-form-item label="项目名称" prop="project_name">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              v-model="editForm.project_name"
              placeholder="请输入项目名称"
              size="mini"
              clearable
              style="width:350px"
            />
          </el-form-item>
          <el-form-item
            label="项目版本列表"
            prop="project_versions"
            style="float:right;"
          >
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              v-model="editForm.project_versions"
              placeholder="请输入项目版本列表,以逗号分割(例如:4.2.0,4.3.0)"
              size="mini"
              clearable
              style="width:350px"
            />
          </el-form-item>
        </el-form>
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
export default {
  name: 'ProjectConfig',
  data() {
    return {
      editForm: {},
      addForm: { project_name: '', project_versions: '' },
      addProjectDialog: false,
      editProjectDialog: false,
      currentPage: 1,
      conditionDict: { id: '', project_name: '' },
      pageSize: 10,
      pageSizes: [5, 10, 20],
      total: 0,
      tableData: [],
      rules: {
        project_name: [{ required: true, message: '项目名称不能为空' }]
      },
      editRules: {
        project_name: [{ required: true, message: '项目名称不能为空' }],
        project_versions: [{ required: false }]
      }
    };
  },
  // beforeMount() {
  //   this.getListByCondition();
  // },
  methods: {
    // 重置搜索
    reset() {
      this.conditionDict = { id: '', project_name: '' };
      this.pageSize = 10;
      this.pageSizes = [5, 10, 20];
      this.currentPage = 1;
      this.getListByCondition('search');
    },
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
          let url = String.format(
            '{0}/projectInterface/addProject',
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
    },
    // 根据项目id获取项目
    getProject(projectId) {
      this.editProjectDialog = true;
      let url = String.format(
        '{0}/projectInterface/projectInfo',
        this.GLOBAL.MONITOR_URL
      );
      // 指定参数格式
      let config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      };
      let params = {
        id: projectId
      };
      this.axios
        .post(url, JSON.stringify(params), config)
        .then(response => {
          this.editForm = response.data.project_info;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 根据项目id删除项目
    async deleteProject(projectId) {
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
        let url = String.format(
          '{0}/projectInterface/removeProject',
          this.GLOBAL.MONITOR_URL
        );
        // 指定参数格式
        let config = {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        };
        let params = {
          id: projectId
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
    // 编辑项目
    editProject(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let url = String.format(
            '{0}/projectInterface/editProject',
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
    },
    // 获取列表
    getListByCondition(type) {
      if (type === 'search') {
        this.currentPage = 1;
      }
      let url = String.format(
        '{0}/projectInterface/searchProject',
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
          this.tableData = response.data.projectInfo.tableData;
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
