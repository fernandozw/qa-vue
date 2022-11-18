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
      width="100%"
    >
      <!--使用默认的唯一索引index,作为key的唯一值-->
      <template v-for="(col, index) in tabHeader">
        <!--key是必须的且写在真实的html元素上,否则es6检查会报错-->
        <!--操作选项-->
        <el-table-column
          v-if="col.prop === 'action'"
          :label="col.label"
          :key="index"
          align="center"
          show-overflow-tooltip
          width="200px"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="执行前请确认已配置好用例对应项目版本的参数池！"
              placement="top"
            >
              <el-button
                type="text"
                size="mini"
                @click="executeCase(tabData[scope.$index].id)"
                >执行
              </el-button>
            </el-tooltip>
            <el-button
              type="text"
              size="mini"
              @click="editClick(tabData[scope.$index].id)"
              >编辑
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="deleteCase(tabData[scope.$index].id)"
              >删除
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="copyCase(tabData[scope.$index].id)"
              >复制
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="col.prop === 'id'"
          :prop="col.prop"
          :label="col.label"
          :key="index"
          align="center"
          show-overflow-tooltip
          fixed="left"
          width="80px"
        >
        </el-table-column>
        <el-table-column
          v-else-if="
            col.prop === 'case_name' ||
              col.prop === 'host' ||
              col.prop === 'url'
          "
          :prop="col.prop"
          :label="col.label"
          :key="index"
          align="center"
          show-overflow-tooltip
          width="250px"
        >
        </el-table-column>
        <el-table-column
          v-else-if="col.prop === 'case_type'"
          :prop="col.prop"
          :label="col.label"
          :key="index"
          align="center"
          show-overflow-tooltip
          width="120px"
        >
        </el-table-column>
        <el-table-column
          v-else
          :prop="col.prop"
          :label="col.label"
          :key="index"
          align="center"
          show-overflow-tooltip
          width="200px"
        >
        </el-table-column>
      </template>
    </el-table>
    <case-dialog
      v-if="dialogVisible"
      :visible="dialogVisible"
      :case-id="editCaseId"
      :type="caseDialogType"
      @listenToChildEvent="callbackFunc"
    ></case-dialog>
  </div>
</template>

<script>
import CaseDialog from './CaseDialog';

export default {
  // 模板名称
  name: 'tablePub',
  components: { CaseDialog },
  // 模板动态参数(tabData:表格的列数据;tabHeader:表头;tabHeight:表格的固定高度,值由引用组件传入)
  props: {
    tabData: null,
    tabHeader: null
  },
  data() {
    return {
      dialogVisible: false,
      editCaseId: null,
      caseDialogType: 2,
      loading: false
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
    // 执行用例
    executeCase(id) {
      this.loading = true;
      // 指定参数格式
      let config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      };
      let url = String.format(
        '{0}/executeInterface/executeCase',
        this.GLOBAL.MONITOR_URL
      );
      let caseEntity = {
        id: id
      };
      this.axios
        .post(url, JSON.stringify(caseEntity), config)
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
    // 编辑用例
    editClick(id) {
      this.editCaseId = id;
      this.caseDialogType = 2;
      this.dialogVisible = true;
    },
    // 复制用例
    copyCase(id) {
      this.editCaseId = id;
      this.caseDialogType = 3;
      this.dialogVisible = true;
    },
    deleteCase(id) {
      this.$confirm('此操作将永久删除该用例, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let caseInfo = { id: id };
          let url = String.format(
            '{0}/caseInterface/removeCase',
            this.GLOBAL.MONITOR_URL
          );
          // 指定参数格式
          let config = {
            headers: {
              'Content-Type': 'application/json;charset=UTF-8'
            }
          };
          this.axios
            .post(url, JSON.stringify(caseInfo), config)
            .then(response => {
              let responseCode = response.data.code;
              if (responseCode === '200') {
                this.Message.success('删除成功！');
              } else {
                this.Message.error('删除失败！');
              }
              // 调用父组件的查询方法
              this.$emit('getCaseList');
              return response;
            })
            .catch(response => {
              // 调用父组件的查询方法
              this.$emit('getCaseList');
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
    callbackFunc(fresh) {
      this.dialogVisible = false;
      if (fresh) {
        this.$emit('getCaseList');
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
</style>
