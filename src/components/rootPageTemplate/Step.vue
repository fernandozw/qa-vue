<template>
  <div>
    <el-form :inline="true" :model="searchForm" size="mini">
      <el-form-item label="id">
        <el-input
          v-model="searchForm.ids"
          placeholder="支持多个id查询,以','分割"
          clearable
          style="width: 180px"
        ></el-input>
      </el-form-item>
      <el-form-item label="步骤名称">
        <el-input
          v-model="searchForm.stepName"
          placeholder="输入步骤名称"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="所属元素">
        <el-select
          v-model="searchForm.elementId"
          filterable
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="item in elementList"
            :key="item.id"
            :label="'「' + item.id + '」' + item.elementName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否启用">
        <el-select
          v-model="searchForm.status"
          filterable
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="searchForm.startTime"
          type="datetimerange"
          align="right"
          start-placeholder="起始时间"
          end-placeholder="截止时间"
          :default-time="['00:00:00', '23:59:59']"
          style="width: 360px;"
          value-format="yyyy-MM-dd HH:mm:ss"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="更新时间">
        <el-date-picker
          v-model="searchForm.updateTime"
          type="datetimerange"
          align="right"
          start-placeholder="起始时间"
          end-placeholder="截止时间"
          :default-time="['00:00:00', '23:59:59']"
          style="width: 360px;"
          value-format="yyyy-MM-dd HH:mm:ss"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item style="float: right;margin-right: 60px">
        <el-button type="primary" @click="getStepList('search')"
          >查询
        </el-button>
        <el-button type="success" @click="clickAddBtn">新增</el-button>
        <el-button type="info" @click="getStepList('reset')">重置</el-button>
      </el-form-item>
    </el-form>
    <step-dialog
      v-if="dialogVisible"
      :visible="dialogVisible"
      :step-id="stepId"
      :type="dialogVisibleType"
      @listenToChildEvent="callbackFunc"
    ></step-dialog>
    <el-table
      :data="tableData"
      style="width: 100%"
      size="mini"
      border
      :cell-style="{ 'text-align': 'center' }"
      :header-cell-style="{ 'text-align': 'center' }"
      :row-class-name="tableRowClassName"
    >
      <el-table-column
        fixed="left"
        prop="id"
        label="id"
        width="100"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="stepName"
        label="步骤名称"
        width="250"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="elementId"
        label="所属元素"
        width="180"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>
            「{{ tableData[scope.$index].elementId }}」{{
              tableData[scope.$index].elementName
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="action"
        label="操作类型"
        width="180"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="actionValue"
        label="随操作值"
        width="180"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="function"
        label="外部函数"
        width="180"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="status"
        label="是否启用"
        width="180"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{ statusMap[tableData[scope.$index].status] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="verifyAction"
        label="校验类型"
        width="180"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="verifyValue"
        label="随校验值"
        width="180"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="paramKey"
        label="保存参数"
        width="180"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="addTime"
        label="创建时间"
        width="250"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="更新时间"
        width="250"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column label="操作" width="250" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            @click="stepDetail(tableData[scope.$index].id, 'edit')"
            >编辑
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="deleteStep(tableData[scope.$index].id)"
            >删除
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="stepDetail(tableData[scope.$index].id, 'copy')"
            >复制
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="getStepList('search')"
      :current-page.sync="currentPage"
      :page-size="pageSize"
      layout="total,slot, prev, pager, next, jumper"
      :total="total"
      style="margin-top: 10px"
      size="mini"
    >
      <span>{{ pageSize }}条/页</span>
    </el-pagination>
  </div>
</template>

<script>
import StepDialog from '../WebUiTestTemplate/StepDialog';

export default {
  name: 'Step',
  components: {
    StepDialog: StepDialog
  },
  data() {
    return {
      dialogVisibleType: 1,
      stepId: null,
      dialogVisible: false,
      searchForm: {
        ids: '',
        stepName: '',
        elementId: '',
        status: '',
        startTime: [],
        updateTime: []
      },
      statusList: [],
      statusMap: [],
      elementList: [],
      // elementMap: {},
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0
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
    // 获取步骤列表
    getStepList(model) {
      // 重置
      if (model === 'reset') {
        this.currentPage = 1;
        this.resetSearchForm();
        // 新增、编辑、删除
      } else if (model === 'normal') {
        this.currentPage = 1;
      }
      // 指定参数格式
      let config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      };
      let url = String.format('{0}/step/steps', this.GLOBAL.WEBUI_URL);
      this.searchForm['pageNum'] = this.currentPage;
      this.axios
        .post(url, JSON.stringify(this.searchForm), config)
        .then(response => {
          this.tableData = response.data.data.steps;
          this.total = response.data.data.total;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 用于子组件的回调函数
    callbackFunc(fresh) {
      this.dialogVisible = false;
      if (fresh) {
        this.getStepList('normal');
      }
    },
    // 点击新增按钮
    clickAddBtn() {
      this.dialogVisibleType = 1;
      this.dialogVisible = true;
    },
    // 步骤详情
    stepDetail(id, model) {
      if (model === 'edit') {
        this.dialogVisibleType = 2;
      } else if (model === 'copy') {
        this.dialogVisibleType = 3;
      }
      this.stepId = id;
      this.dialogVisible = true;
    },
    // 删除步骤
    deleteStep(id) {
      this.$confirm(
        String.format('此操作将永久删除该步骤(id:{0}), 是否继续?', id),
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        // 指定参数格式
        let config = {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        };
        let url = String.format('{0}/step/delete', this.GLOBAL.WEBUI_URL);
        const param = { id: id };
        this.axios
          .post(url, JSON.stringify(param), config)
          .then(response => {
            if (response.data.code === '1000') {
              this.Message.success(response.data.msg);
              this.getStepList('normal');
            } else {
              this.Message.error(response.data.msg);
              this.getStepList('normal');
            }
            return response;
          })
          .catch(response => {
            return response;
          });
      });
    },
    // 获取查询条件
    getConditions() {
      let url = String.format(
        '{0}/step/getSearchCondition',
        this.GLOBAL.WEBUI_URL
      );
      this.axios
        .get(url)
        .then(response => {
          this.statusList = response.data.data.statusList;
          this.statusMap = response.data.data.statusMap;
          this.elementList = response.data.data.elementList;
          // this.elementMap = response.data.data.elementMap;

          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 重置查询条件表单
    resetSearchForm() {
      this.searchForm = {
        ids: '',
        stepName: '',
        elementId: '',
        status: '',
        startTime: [],
        updateTime: []
      };
    }
  },
  beforeMount() {
    this.getConditions();
    this.getStepList();
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
