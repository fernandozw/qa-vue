<template>
  <div>
    <el-form :model="conditionDict" :inline="true" class="demo-form-inline">
      <el-row>
        <el-form-item label="接口id:">
          <el-input
            v-model="conditionDict.id"
            size="mini"
            placeholder="请输入接口id"
            clearable
          />
        </el-form-item>
        <el-form-item label="接口名称:">
          <el-input
            v-model="conditionDict.interface_name"
            size="mini"
            placeholder="请输入接口名称"
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
        </el-form-item>
        <el-form-item label="所属业务:">
          <el-select
            v-model="conditionDict.business_id"
            clearable
            placeholder="请选择"
            filterable
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
        </el-form-item>
      </el-row>
      <el-row style="margin-top: -20px;">
        <el-form-item label="接口url:">
          <el-input
            v-model="conditionDict.interface_url"
            size="mini"
            placeholder="请输入接口url"
            clearable
          />
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
        show-overflow-tooltip
      />
      <el-table-column
        fixed
        prop="interface_name"
        label="接口名称"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        fixed
        prop="interface_url"
        label="接口地址"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        fixed
        prop="project"
        label="所属项目"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        fixed
        prop="business"
        label="所属业务"
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
          <el-button
            type="text"
            size="small"
            @click="getInterface(scope.row.id)"
            >编辑
          </el-button>

          <el-button
            type="text"
            size="small"
            @click="deleteInterface(scope.row.id)"
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
      :visible.sync="addInterfaceDialog"
      :before-close="closeAddDialog"
      title="新增"
      width="70%"
    >
      <el-card>
        <el-form ref="addForm" :model="addForm" :rules="rules" :inline="true">
          <el-row :gutter="40">
            <el-col :span="12">
              <el-form-item label="接口名称" prop="interface_name">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  placeholder="必填项:请输入接口名称"
                  v-model="addForm.interface_name"
                  clearable
                  @change="$forceUpdate()"
                  size="mini"
                  style="width:350px"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="接口地址" prop="interface_url">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  placeholder="必填项:请输入接口地址"
                  v-model="addForm.interface_url"
                  clearable
                  @change="$forceUpdate()"
                  size="mini"
                  style="width:350px"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="40">
            <el-col :span="12">
              <el-form-item label="所属项目" prop="project_id">
                <el-select
                  v-model="addForm.project_id"
                  clearable
                  placeholder="请选择"
                  filterable
                  size="mini"
                  @change="getConditionsForAdd"
                  style="width:350px"
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
            <el-col :span="12">
              <el-form-item label="所属业务" prop="business_id">
                <el-select
                  v-model="addForm.business_id"
                  clearable
                  placeholder="请选择"
                  filterable
                  size="mini"
                  @change="$forceUpdate()"
                  @focus="checkParentForAdd"
                  style="width:350px"
                >
                  <el-option
                    v-for="item in addBusinessList"
                    :key="item.label"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>

      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeAddDialog">取 消</el-button>
        <el-button size="mini" type="primary" @click="addInterface('addForm')"
          >保 存
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="editInterfaceDialog"
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
          <el-row :gutter="40">
            <el-col :span="12">
              <el-form-item label="接口名称" prop="interface_name">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  placeholder="必填项:请输入接口名称"
                  v-model="editForm.interface_name"
                  clearable
                  @change="$forceUpdate()"
                  size="mini"
                  style="width:350px"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="接口地址" prop="interface_url">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  placeholder="必填项:请输入接口地址"
                  v-model="editForm.interface_url"
                  clearable
                  @change="$forceUpdate()"
                  size="mini"
                  style="width:350px"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="40">
            <el-col :span="12">
              <el-form-item label="所属项目" prop="project_id">
                <el-select
                  v-model="editForm.project_id"
                  clearable
                  placeholder="请选择"
                  filterable
                  size="mini"
                  @change="changeProjectForEdit"
                  style="width:350px"
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
            <el-col :span="12">
              <el-form-item label="所属业务" prop="business_id">
                <el-select
                  v-model="editForm.business_id"
                  clearable
                  placeholder="请选择"
                  filterable
                  size="mini"
                  @change="$forceUpdate()"
                  @focus="checkParentForEdit"
                  style="width:350px"
                >
                  <el-option
                    v-for="item in editBusinessList"
                    :key="item.label"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>

      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeEditDialog">取 消</el-button>
        <el-button size="mini" type="primary" @click="editInterface('editForm')"
          >保 存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'InterfaceConfig',
  data() {
    return {
      editForm: {},
      addForm: { interface_name: '', project_id: '', business_id: '' },
      addInterfaceDialog: false,
      editInterfaceDialog: false,
      currentPage: 1,
      projectList: [],
      businessList: [],
      addProjectList: [],
      addBusinessList: [],
      editBusinessList: [],
      editProjectList: [],
      conditionDict: {
        id: '',
        interface_name: '',
        project_id: '',
        business_id: '',
        interface_url: ''
      },
      pageSize: 10,
      pageSizes: [5, 10, 20],
      total: 0,
      tableData: [],
      rules: {
        interface_name: [{ required: true, message: '接口名称不能为空' }],
        interface_url: [{ required: true, message: '接口地址不能为空' }],
        project_id: [{ required: true, message: '所属项目不能为空' }],
        business_id: [{ required: true, message: '所属业务不能为空' }]
      },
      editRules: {
        interface_name: [{ required: true, message: '接口名称不能为空' }],
        interface_url: [{ required: true, message: '接口地址不能为空' }],
        project_id: [{ required: true, message: '所属项目不能为空' }],
        business_id: [{ required: true, message: '所属业务不能为空' }]
      }
    };
  },
  // beforeMount() {
  //   this.getListByCondition();
  // },
  methods: {
    // 打开新增弹窗
    openAddDialog() {
      this.addInterfaceDialog = true;
      this.getConditionsForAdd();
    },
    // 检查编辑弹窗所属项目是否选中
    checkParentForEdit() {
      if (
        this.editForm.project_id === '' ||
        this.editForm.project_id === undefined
      ) {
        this.$message({
          type: 'error',
          message: '请先选择所属项目!'
        });
      }
    },
    // 编辑获取项目下拉框
    getProjectForEdit() {
      this.editForm.business_id = '';
      let url = String.format(
        '{0}/infoInterface/infoConditions?project_id={1}',
        this.GLOBAL.MONITOR_URL,
        this.editForm.project_id
      );
      this.axios
        .get(url)
        .then(response => {
          this.editProjectList = response.data.data.projectList;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 编辑页面变更项目
    changeProjectForEdit() {
      this.editForm.business_id = '';
      let url = String.format(
        '{0}/infoInterface/infoConditions?project_id={1}',
        this.GLOBAL.MONITOR_URL,
        this.editForm.project_id
      );
      this.axios
        .get(url)
        .then(response => {
          this.editProjectList = response.data.data.projectList;
          this.editBusinessList = response.data.data.businessList;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 检查新增弹窗所属项目是否选中
    checkParentForAdd() {
      if (
        this.addForm.project_id === '' ||
        this.addForm.project_id === undefined
      ) {
        this.$message({
          type: 'error',
          message: '请先选择所属项目!'
        });
      }
    },
    // 获取新增查询条件
    getConditionsForAdd() {
      this.addForm.business_id = '';
      let url = String.format(
        '{0}/infoInterface/infoConditions?project_id={1}',
        this.GLOBAL.MONITOR_URL,
        this.addForm.project_id
      );
      this.axios
        .get(url)
        .then(response => {
          this.addProjectList = response.data.data.projectList;
          this.addBusinessList = response.data.data.businessList;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 检查所属项目是否选中
    checkParent() {
      if (
        this.conditionDict.project_id === '' ||
        this.conditionDict.project_id === undefined
      ) {
        this.$message({
          type: 'error',
          message: '请先选择所属项目!'
        });
      }
    },
    // 获取查询条件
    getConditions() {
      this.conditionDict.business_id = '';
      let url = String.format(
        '{0}/infoInterface/infoConditions?project_id={1}',
        this.GLOBAL.MONITOR_URL,
        this.conditionDict.project_id
      );
      this.axios
        .get(url)
        .then(response => {
          this.projectList = response.data.data.projectList;
          this.businessList = response.data.data.businessList;
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
        interface_name: '',
        project_id: '',
        business_id: '',
        interface_url: ''
      };
      this.pageSize = 10;
      this.pageSizes = [5, 10, 20];
      this.currentPage = 1;
      this.getConditions();
      this.getListByCondition('search');
    },
    // 关闭项目新增弹窗
    closeAddDialog() {
      this.addInterfaceDialog = false;
      this.$refs['addForm'].resetFields();
    },
    // 关闭项目编辑弹窗
    closeEditDialog() {
      this.editInterfaceDialog = false;
      this.$refs['editForm'].resetFields();
    },
    // 新增接口
    addInterface(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let url = String.format(
            '{0}/infoInterface/addInfo',
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
    // 根据接口id获取接口
    getInterface(interfaceId) {
      this.editInterfaceDialog = true;
      this.getProjectForEdit();
      let url = String.format(
        '{0}/infoInterface/interfaceInfo',
        this.GLOBAL.MONITOR_URL
      );
      // 指定参数格式
      let config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      };
      let params = {
        id: interfaceId
      };
      this.axios
        .post(url, JSON.stringify(params), config)
        .then(response => {
          this.editForm = response.data.interface_info;
          this.editBusinessList = response.data.business_list.business_list;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 根据接口id删除接口
    async deleteInterface(interfaceId) {
      const result = await this.$confirm(
        '此操作将永久删除该接口, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err);
      if (result === 'confirm') {
        let url = String.format(
          '{0}/infoInterface/removeInfo',
          this.GLOBAL.MONITOR_URL
        );
        // 指定参数格式
        let config = {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        };
        let params = {
          id: interfaceId
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
    // 编辑接口
    editInterface(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let url = String.format(
            '{0}/infoInterface/editInfo',
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
        '{0}/infoInterface/searchInfo',
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
          this.tableData = response.data.interfaceInfo.tableData;
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
