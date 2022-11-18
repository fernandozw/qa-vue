<template>
  <div>
    <el-form :inline="true" :model="searchForm" size="mini">
      <el-form-item label="结果id">
        <el-input
          v-model="searchForm.id"
          placeholder="输入结果id"
          clearable
          style="width: 180px"
        ></el-input>
      </el-form-item>
      <el-form-item label="所属业务">
        <el-select
          v-model="searchForm.pageId"
          filterable
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="item in pageList"
            :key="item.id"
            :label="'「' + item.id + '」' + item.pageName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用例id">
        <el-input
          v-model="searchForm.caseId"
          placeholder="输入用例id"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="用例名称">
        <el-input
          v-model="searchForm.caseName"
          placeholder="输入用例名称"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="执行结果">
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
      <el-form-item label="执行时间">
        <el-date-picker
          v-model="searchForm.addTime"
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
        <el-button type="primary" @click="getResultList('search')"
          >查询
        </el-button>
        <el-button type="info" @click="getResultList('reset')">重置</el-button>
      </el-form-item>
    </el-form>

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
        label="结果id"
        width="100"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        fixed="left"
        prop="pageId"
        label="所属业务"
        width="250"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span v-if="tableData[scope.$index].pageId !== undefined">
            「{{ tableData[scope.$index].pageId }}」{{
              tableData[scope.$index].pageName
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="所属用例" width="250" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            @click="setCaseId(tableData[scope.$index].caseId)"
            >「{{ tableData[scope.$index].caseId }}」{{
              tableData[scope.$index].caseName
            }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="失败元素" width="250" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button
            v-if="tableData[scope.$index].elementId !== undefined"
            type="text"
            size="mini"
            @click="setElementId(tableData[scope.$index].elementId)"
            >「{{ tableData[scope.$index].elementId }}」{{
              tableData[scope.$index].elementName
            }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="失败步骤" width="250" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button
            v-if="tableData[scope.$index].failStepId !== undefined"
            type="text"
            size="mini"
            @click="setStepId(tableData[scope.$index].failStepId)"
            >「{{ tableData[scope.$index].failStepId }}」{{
              tableData[scope.$index].stepName
            }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="执行结果" width="180" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ statusMap[tableData[scope.$index].status] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="usetime"
        label="执行耗时"
        width="180"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="addTime"
        label="执行时间"
        width="250"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column label="操作" width="240" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            v-if="tableData[scope.$index].status === 2"
            @click="setFailReason(tableData[scope.$index].failReason)"
          >
            失败原因
          </el-button>
          <el-button
            type="text"
            size="mini"
            v-if="
              tableData[scope.$index].status === 2 &&
                tableData[scope.$index].elementId !== undefined &&
                tableData[scope.$index].failStepId !== undefined
            "
            @click="
              getFailImg(
                tableData[scope.$index].id,
                tableData[scope.$index].status
              )
            "
          >
            失败图片
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="getResultList('nextPage')"
      :current-page.sync="currentPage"
      :page-size="pageSize"
      layout="total,slot, prev, pager, next, jumper"
      :total="total"
      style="margin-top: 10px"
      size="mini"
    >
      <span>{{ pageSize }}条/页</span>
    </el-pagination>
    <el-dialog title="失败原因" :visible.sync="failReasonVisible" width="70%">
      <el-card class="box-card">
        <span>{{ failReason }}</span>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="" @click="failReasonVisible = false"
          >关 闭</el-button
        >
      </span>
    </el-dialog>
    <el-dialog title="失败图片" :visible.sync="failImgVisible" width="90%">
      <el-card class="box-card">
        <el-image :src="imgSrc" style="width: 100%"></el-image>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="" @click="failImgVisible = false"
          >关 闭</el-button
        >
      </span>
    </el-dialog>
    <web-ui-case-dialog
      v-if="caseDialogVisible"
      :visible="caseDialogVisible"
      :case-id="caseId"
      :type="caseDialogVisibleType"
      @listenToChildEvent="callbackFunc"
    ></web-ui-case-dialog>
    <step-dialog
      v-if="stepDialogVisible"
      :visible="stepDialogVisible"
      :step-id="stepId"
      :type="stepDialogVisibleType"
      @listenToChildEvent="callbackFuncStep"
    ></step-dialog>
    <element-dialog
      v-if="elementDialogVisible"
      :visible="elementDialogVisible"
      :element-id="elementId"
      :type="elementDialogVisibleType"
      @listenToChildEvent="callbackFuncElement"
    ></element-dialog>
  </div>
</template>

<script>
import WebUiCaseDialog from '../WebUiTestTemplate/WebUiCaseDialog';
import StepDialog from '../WebUiTestTemplate/StepDialog';
import ElementDialog from '../WebUiTestTemplate/ElementDialog';

export default {
  name: 'UiCaseResultList',
  components: {
    webUiCaseDialog: WebUiCaseDialog,
    StepDialog: StepDialog,
    ElementDialog: ElementDialog
  },
  data() {
    return {
      elementDialogVisibleType: 2,
      elementId: null,
      elementDialogVisible: false,

      stepDialogVisibleType: 2,
      stepId: null,
      stepDialogVisible: false,
      caseDialogVisibleType: 2,
      caseId: null,
      caseDialogVisible: false,
      failImgVisible: false,
      loading: true,
      imgSrc: '',
      failReasonVisible: false,
      failReason: '',
      searchForm: {
        id: '',
        pageId: '',
        caseId: '',
        caseName: '',
        status: '',
        addTime: []
      },
      pageList: [],
      statusList: [],
      statusMap: {},
      tableData: [],
      caneMap: {},
      currentPage: 1,
      pageSize: 10,
      total: 0
    };
  },
  methods: {
    // 设置元素详情的id
    setElementId(elementId) {
      this.elementId = elementId;
      this.elementDialogVisible = true;
    },
    // 用于用例子组件的回调函数
    callbackFuncElement() {
      this.elementDialogVisible = false;
    },
    // 设置步骤详情的id
    setStepId(caseId) {
      this.stepId = caseId;
      this.stepDialogVisible = true;
    },
    // 用于用例子组件的回调函数
    callbackFuncStep() {
      this.stepDialogVisible = false;
    },
    // 设置用例详情的id
    setCaseId(caseId) {
      this.caseId = caseId;
      this.caseDialogVisible = true;
    },
    // 用于用例子组件的回调函数
    callbackFunc() {
      this.caseDialogVisible = false;
    },
    // 设置行的颜色
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return 'warning-row';
      } else {
        return 'success-row';
      }
    },
    // 获取失败截图
    getFailImg(id, status) {
      this.failImgVisible = true;

      let url = String.format(
        '{0}/result/failImage?id={1}&status={2}',
        this.GLOBAL.WEBUI_URL,
        id,
        status
      );
      this.axios
        .get(url)
        .then(response => {
          this.imgSrc = response.data.failStepImage;

          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 设置失败原因
    setFailReason(value) {
      this.failReason = '';
      this.failReasonVisible = true;
      this.failReason = value;
    },
    // 获取结果列表
    getResultList(model) {
      // 重置
      if (model === 'reset') {
        this.currentPage = 1;
        this.resetSearchForm();
        // 查询
      } else if (model === 'search') {
        this.currentPage = 1;
      }
      // 指定参数格式
      let config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      };
      let url = String.format('{0}/result/resultList', this.GLOBAL.WEBUI_URL);
      this.searchForm['pageNum'] = this.currentPage;
      this.axios
        .post(url, JSON.stringify(this.searchForm), config)
        .then(response => {
          this.tableData = response.data.data.resultList;
          this.total = response.data.data.total;
          return response;
        })
        .catch(response => {
          return response;
        });
    },

    // 获取查询条件
    getConditions() {
      let url = String.format(
        '{0}/result/getSearchCondition',
        this.GLOBAL.WEBUI_URL
      );
      this.axios
        .get(url)
        .then(response => {
          this.pageList = response.data.data.pageList;
          this.statusList = response.data.data.statusList;
          this.statusMap = response.data.data.statusMap;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 重置查询条件表单
    resetSearchForm() {
      this.searchForm = {
        id: '',
        pageId: '',
        caseId: '',
        caseName: '',
        status: '',
        addTime: []
      };
    }
  }
  // beforeMount() {
  //   this.getConditions();
  //   this.getResultList();
  // }
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
