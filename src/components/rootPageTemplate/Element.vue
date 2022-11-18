<template>
  <div>
    <el-form :inline="true" :model="searchForm" size="mini">
      <el-form-item label="id">
        <el-input
          v-model="searchForm.id"
          placeholder="输入id"
          clearable
          style="width: 100px"
        ></el-input>
      </el-form-item>
      <el-form-item label="元素名称">
        <el-input
          v-model="searchForm.elementName"
          placeholder="输入元素名称"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="iframe">
        <el-input
          v-model="searchForm.iframe"
          placeholder="输入iframe"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="定位方式">
        <el-select
          v-model="searchForm.locateType"
          filterable
          placeholder="选择定位方式"
          clearable
        >
          <el-option
            v-for="item in locateList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关键字">
        <el-input
          v-model="searchForm.keyword"
          placeholder="输入关键字"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="所属业务">
        <el-select
          v-model="searchForm.pageId"
          filterable
          placeholder="选择所属业务"
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
        <el-button type="primary" @click="getElementList('search')"
          >查询
        </el-button>
        <el-button type="success" @click="clickAddBtn">新增</el-button>
        <el-button type="info" @click="getElementList('reset')">重置</el-button>
      </el-form-item>
    </el-form>
    <element-dialog
      v-if="dialogVisible"
      :visible="dialogVisible"
      :element-id="elementId"
      :type="dialogVisibleType"
      @listenToChildEvent="callbackFunc"
    ></element-dialog>
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
        prop="elementName"
        label="元素名称"
        width="250"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="pageId"
        label="所属业务"
        width="180"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>
            「{{ tableData[scope.$index].pageId }}」{{
              tableData[scope.$index].pageName
            }}
          </span>
        </template>
      </el-table-column>

      <el-table-column
        prop="iframe"
        label="iframe"
        width="180"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="locateType"
        label="定位方式"
        width="180"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="keyword"
        label="关键字"
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
            @click="elementDetail(tableData[scope.$index].id, 'edit')"
            >编辑
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="deleteElement(tableData[scope.$index].id)"
            >删除
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="elementDetail(tableData[scope.$index].id, 'copy')"
            >复制
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="getElementList('search')"
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
import ElementDialog from '../WebUiTestTemplate/ElementDialog';

export default {
  name: 'Element',
  components: {
    elementDialog: ElementDialog
  },
  data() {
    return {
      dialogVisibleType: 1,
      elementId: null,
      dialogVisible: false,
      searchForm: {
        id: '',
        elementName: '',
        iframe: '',
        locateType: '',
        keyword: '',
        pageId: '',
        startTime: [],
        updateTime: []
      },
      locateList: [],
      pageList: [],
      // pageMap: {},
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
    // 获取元素列表
    getElementList(model) {
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
      let url = String.format('{0}/element/elements', this.GLOBAL.WEBUI_URL);
      this.searchForm['pageNum'] = this.currentPage;
      this.axios
        .post(url, JSON.stringify(this.searchForm), config)
        .then(response => {
          this.tableData = response.data.data.elements;
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
        this.getElementList('normal');
      }
    },
    // 点击新增按钮
    clickAddBtn() {
      this.dialogVisibleType = 1;
      this.dialogVisible = true;
    },
    // 元素详情
    elementDetail(id, model) {
      if (model === 'edit') {
        this.dialogVisibleType = 2;
      } else if (model === 'copy') {
        this.dialogVisibleType = 3;
      }
      this.elementId = id;
      this.dialogVisible = true;
    },
    // 删除元素
    deleteElement(id) {
      this.$confirm(
        String.format('此操作将永久删除该元素(id:{0}), 是否继续?', id),
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
        let url = String.format('{0}/element/delete', this.GLOBAL.WEBUI_URL);
        const param = { id: id };
        this.axios
          .post(url, JSON.stringify(param), config)
          .then(response => {
            if (response.data.code === '1000') {
              this.Message.success(response.data.msg);
              this.getElementList('normal');
            } else {
              this.Message.error(response.data.msg);
              this.getElementList('normal');
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
        '{0}/element/getSearchCondition',
        this.GLOBAL.WEBUI_URL
      );
      this.axios
        .get(url)
        .then(response => {
          this.locateList = response.data.data.locateList;
          this.pageList = response.data.data.pageList;
          // this.pageMap = response.data.data.pageMap;

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
        elementName: '',
        iframe: '',
        locateType: '',
        keyword: '',
        pageId: '',
        startTime: '',
        updateTime: ''
      };
    }
  },
  beforeMount() {
    this.getConditions();
    this.getElementList();
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
