<template>
  <div>
    <el-form :model="conditionDict" :inline="true" class="demo-form-inline">
      <el-form-item label="host id:">
        <el-input
          v-model="conditionDict.id"
          size="mini"
          placeholder="请输入host id"
          clearable
        />
      </el-form-item>
      <el-form-item label="host名称:">
        <el-input
          v-model="conditionDict.host_name"
          size="mini"
          placeholder="输入host名称"
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
          @click="addHostDialog = true"
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
        prop="host_name"
        label="host名称"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        fixed
        prop="host_address"
        label="host地址"
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
          <el-button type="text" size="small" @click="getHost(scope.row.id)"
            >编辑
          </el-button>

          <el-button type="text" size="small" @click="deleteHost(scope.row.id)"
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
      :visible.sync="addHostDialog"
      :before-close="closeAddDialog"
      title="新增"
      width="80%"
    >
      <el-card>
        <el-form ref="addForm" :model="addForm" :rules="rules" :inline="true">
          <el-row :gutter="40">
            <el-col :span="12">
              <el-form-item label="host名称" prop="host_name">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  v-model="addForm.host_name"
                  placeholder="请输入host名称"
                  size="mini"
                  clearable
                  @change="$forceUpdate()"
                  style="width:400px"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="host地址" prop="host_address">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  v-model="addForm.host_address"
                  placeholder="请输入host地址"
                  size="mini"
                  clearable
                  @change="$forceUpdate()"
                  style="width:400px"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-divider />
          <el-row :gutter="40">
            <el-col :span="4">
              <el-form-item label="头部加密" prop="header_sign">
                <el-checkbox
                  v-model="addHeaderChecked"
                  @change="handleAddHeaderCheck"
                  >{{ addHeaderChecked ? '是' : '否' }}
                </el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="配置信息" prop="header_config">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 4, maxRows: 8 }"
                  placeholder="请输入配置信息"
                  v-model="addForm.header_config"
                  clearable
                  @change="$forceUpdate()"
                  size="mini"
                  style="width:300px"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="加密算法" prop="header_method">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 4, maxRows: 8 }"
                  placeholder="请输入加密算法"
                  v-model="addForm.header_method"
                  clearable
                  @change="$forceUpdate()"
                  size="mini"
                  style="width:300px"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-divider />
          <el-row :gutter="40">
            <el-col :span="4">
              <el-form-item label="参数加密" prop="header_sign">
                <el-checkbox
                  v-model="addParamChecked"
                  @change="handleAddParamCheck"
                  >{{ addParamChecked ? '是' : '否' }}
                </el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="配置信息" prop="header_config">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 4, maxRows: 8 }"
                  placeholder="请输入配置信息"
                  v-model="addForm.param_config"
                  clearable
                  @change="$forceUpdate()"
                  size="mini"
                  style="width:300px"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="加密算法" prop="header_method">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 4, maxRows: 8 }"
                  placeholder="请输入加密算法"
                  v-model="addForm.param_method"
                  clearable
                  @change="$forceUpdate()"
                  size="mini"
                  style="width:300px"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>

      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeAddDialog">取 消</el-button>
        <el-button size="mini" type="primary" @click="addHost('addForm')"
          >保 存
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="editHostDialog"
      :before-close="closeEditDialog"
      title="编辑"
      width="80%"
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
              <el-form-item label="host名称" prop="host_name">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  v-model="editForm.host_name"
                  placeholder="请输入host名称"
                  size="mini"
                  clearable
                  @change="$forceUpdate()"
                  style="width:400px"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="host地址" prop="host_address">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  v-model="editForm.host_address"
                  placeholder="请输入host地址"
                  size="mini"
                  clearable
                  @change="$forceUpdate()"
                  style="width:400px"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-divider />
          <el-row :gutter="40">
            <el-col :span="4">
              <el-form-item label="头部加密" prop="header_sign">
                <el-checkbox
                  v-model="editHeaderChecked"
                  @change="handleEditHeaderCheck"
                  >{{ editHeaderChecked ? '是' : '否' }}
                </el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="配置信息" prop="header_config">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 4, maxRows: 8 }"
                  placeholder="请输入配置信息"
                  v-model="editForm.header_config"
                  clearable
                  @change="$forceUpdate()"
                  size="mini"
                  style="width:300px"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="加密算法" prop="header_method">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 4, maxRows: 8 }"
                  placeholder="请输入加密算法"
                  v-model="editForm.header_method"
                  clearable
                  @change="$forceUpdate()"
                  size="mini"
                  style="width:300px"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-divider />
          <el-row :gutter="40">
            <el-col :span="4">
              <el-form-item label="参数加密" prop="header_sign">
                <el-checkbox
                  v-model="editParamChecked"
                  @change="handleEditParamCheck"
                  >{{ editParamChecked ? '是' : '否' }}
                </el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="配置信息" prop="header_config">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 4, maxRows: 8 }"
                  placeholder="请输入配置信息"
                  v-model="editForm.param_config"
                  clearable
                  @change="$forceUpdate()"
                  size="mini"
                  style="width:300px"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="加密算法" prop="header_method">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 4, maxRows: 8 }"
                  placeholder="请输入加密算法"
                  v-model="editForm.param_method"
                  clearable
                  @change="$forceUpdate()"
                  size="mini"
                  style="width:300px"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>

      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeEditDialog">取 消</el-button>
        <el-button size="mini" type="primary" @click="editHost('editForm')"
          >保 存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'HostConfig',
  data() {
    return {
      addHeaderChecked: false,
      addParamChecked: false,
      editHeaderChecked: false,
      editParamChecked: false,
      editForm: {
        host_name: '',
        host_address: '',
        header_sign: 0,
        header_config: '',
        header_method: '',
        param_sign: 0,
        param_config: '',
        param_method: ''
      },
      addForm: {
        host_name: '',
        host_address: '',
        header_sign: 0,
        header_config: '',
        header_method: '',
        param_sign: 0,
        param_config: '',
        param_method: ''
      },
      addHostDialog: false,
      editHostDialog: false,
      currentPage: 1,
      conditionDict: { id: '', host_name: '', host_address: '' },
      pageSize: 10,
      pageSizes: [5, 10, 20],
      total: 0,
      tableData: [],
      rules: {
        host_name: [{ required: true, message: 'host名称不能为空' }],
        host_address: [{ required: true, message: 'host地址不能为空' }]
      },
      editRules: {
        host_name: [{ required: true, message: 'host名称不能为空' }],
        host_address: [{ required: true, message: 'host地址不能为空' }]
      }
    };
  },
  // beforeMount() {
  //   this.getListByCondition();
  // },
  methods: {
    // 处理编辑弹窗头部签名状态
    handleEditHeaderCheck() {
      if (this.editHeaderChecked) {
        this.editForm.header_sign = 1;
      } else {
        this.editForm.header_sign = 0;
      }
    },
    // 处理编辑弹窗参数签名状态
    handleEditParamCheck() {
      if (this.editParamChecked) {
        this.editForm.param_sign = 1;
      } else {
        this.editForm.param_sign = 0;
      }
    },
    // 处理新增弹窗头部签名状态
    handleAddHeaderCheck() {
      if (this.addHeaderChecked) {
        this.addForm.header_sign = 1;
      } else {
        this.addForm.header_sign = 0;
      }
    },
    // 处理新增弹窗参数签名状态
    handleAddParamCheck() {
      if (this.addParamChecked) {
        this.addForm.param_sign = 1;
      } else {
        this.addForm.param_sign = 0;
      }
    },
    // 重置搜索
    reset() {
      this.conditionDict = { id: '', host_name: '' };
      this.pageSize = 10;
      this.pageSizes = [5, 10, 20];
      this.currentPage = 1;
      this.getListByCondition('search');
    },
    // 关闭host新增弹窗
    closeAddDialog() {
      this.addHostDialog = false;
      this.addHeaderChecked = false;
      this.addParamChecked = false;
      this.$refs['addForm'].resetFields();
      this.addForm = {
        host_name: '',
        host_address: '',
        header_sign: 0,
        header_config: '',
        header_method: '',
        param_sign: 0,
        param_config: '',
        param_method: ''
      };
    },
    // 关闭host编辑弹窗
    closeEditDialog() {
      this.editHostDialog = false;
      this.$refs['editForm'].resetFields();
    },
    // 新增host
    addHost(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (
            (this.addHeaderChecked &&
              (this.addForm.header_config === '' ||
                this.addForm.header_method === '')) ||
            (this.addParamChecked &&
              (this.addForm.param_config === '' ||
                this.addForm.param_method === ''))
          ) {
            this.$message.error('勾选加密后,必须输入配置信息与加密方法！');
          } else {
            let url = String.format(
              '{0}/hostInterface/addHost',
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
        }
      });
    },
    // 根据host id获取host
    getHost(hostId) {
      this.editHostDialog = true;
      let url = String.format(
        '{0}/hostInterface/hostInfo',
        this.GLOBAL.MONITOR_URL
      );
      // 指定参数格式
      let config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      };
      let params = {
        id: hostId
      };
      this.axios
        .post(url, JSON.stringify(params), config)
        .then(response => {
          this.editForm = response.data.host_info;
          if (this.editForm.header_sign === 1) {
            this.editHeaderChecked = true;
          } else {
            this.editHeaderChecked = false;
          }
          if (this.editForm.param_sign === 1) {
            this.editParamChecked = true;
          } else {
            this.editParamChecked = false;
          }
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 根据host id删除host
    async deleteHost(hostId) {
      const result = await this.$confirm(
        '此操作将永久删除该host, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err);
      if (result === 'confirm') {
        let url = String.format(
          '{0}/hostInterface/removeHost',
          this.GLOBAL.MONITOR_URL
        );
        // 指定参数格式
        let config = {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        };
        let params = {
          id: hostId
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
    // 编辑host
    editHost(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (
            (this.editHeaderChecked &&
              (this.editForm.header_config === '' ||
                this.editForm.header_method === '')) ||
            (this.editParamChecked &&
              (this.editForm.param_config === '' ||
                this.editForm.param_method === ''))
          ) {
            this.$message.error('勾选加密后,必须输入配置信息与加密方法！');
          } else {
            let url = String.format(
              '{0}/hostInterface/editHost',
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
        }
      });
    },
    // 获取列表
    getListByCondition(type) {
      if (type === 'search') {
        this.currentPage = 1;
      }
      let url = String.format(
        '{0}/hostInterface/searchHost',
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
          this.tableData = response.data.hostInfo.tableData;
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
