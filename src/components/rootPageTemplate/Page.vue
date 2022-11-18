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
      <el-form-item label="业务名称">
        <el-input
          v-model="searchForm.pageName"
          placeholder="输入业务名称"
          clearable
        ></el-input>
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
        <el-button type="primary" @click="getPageList('search')"
          >查询</el-button
        >
        <el-button type="success" @click="clickAddBtn">新增</el-button>
        <el-button type="info" @click="getPageList('reset')">重置</el-button>
      </el-form-item>
    </el-form>
    <page-dialog
      v-if="dialogVisible"
      :visible="dialogVisible"
      :page-id="pageId"
      :type="dialogVisibleType"
      @listenToChildEvent="callbackFunc"
    ></page-dialog>
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
        prop="pageName"
        label="业务名称"
        show-overflow-tooltip
        width="350"
      >
      </el-table-column>
      <el-table-column prop="addTime" label="创建时间" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作" width="350" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            @click="pageDetail(tableData[scope.$index].id, 'edit')"
            >编辑
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="deletePage(tableData[scope.$index].id)"
            >删除
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="pageDetail(tableData[scope.$index].id, 'copy')"
            >复制
          </el-button>
          <el-tooltip
            class="item"
            effect="dark"
            content="此操作将永久删除该业务,及其关联的所有用例、元素、步骤、校验图片,请谨慎!"
            placement="top"
          >
            <el-button
              type="text"
              size="mini"
              @click="deleteAll(tableData[scope.$index].id)"
              >全量删除
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="getPageList('search')"
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
import PageDialog from '../WebUiTestTemplate/PageDialog';

export default {
  name: 'Page',
  components: {
    pageDialog: PageDialog
  },
  data() {
    return {
      dialogVisibleType: 1,
      pageId: null,
      dialogVisible: false,
      searchForm: {
        id: '',
        pageName: '',
        startTime: [],
        updateTime: []
      },
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
    getPageList(model) {
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
      let url = String.format('{0}/page/pages', this.GLOBAL.WEBUI_URL);
      this.searchForm['pageNum'] = this.currentPage;
      this.axios
        .post(url, JSON.stringify(this.searchForm), config)
        .then(response => {
          this.tableData = response.data.data.pages;
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
        this.getPageList('normal');
      }
    },
    // 点击新增按钮
    clickAddBtn() {
      this.dialogVisibleType = 1;
      this.dialogVisible = true;
    },
    // 页面详情
    pageDetail(id, model) {
      if (model === 'edit') {
        this.dialogVisibleType = 2;
      } else if (model === 'copy') {
        this.dialogVisibleType = 3;
      }
      this.pageId = id;
      this.dialogVisible = true;
    },
    // 删除页面
    deletePage(id) {
      this.$confirm(
        String.format('此操作将永久删除该页面(id:{0}), 是否继续?', id),
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
        let url = String.format('{0}/page/delete', this.GLOBAL.WEBUI_URL);
        const param = { id: id };
        this.axios
          .post(url, JSON.stringify(param), config)
          .then(response => {
            if (response.data.code === '1000') {
              this.Message.success(response.data.msg);
              this.getPageList('normal');
            } else {
              this.Message.error(response.data.msg);
              this.getPageList('normal');
            }
            return response;
          })
          .catch(response => {
            return response;
          });
      });
    },

    // 删除页面及其关联的case、step、element
    deleteAll(id) {
      this.$confirm(
        String.format(
          '此操作将永久删除该页面(id:{0})及其关联的所有用例、元素、步骤, 是否继续?',
          id
        ),
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
        let url = String.format('{0}/page/deleteAll', this.GLOBAL.WEBUI_URL);
        const param = { id: id };
        this.axios
          .post(url, JSON.stringify(param), config)
          .then(response => {
            if (response.data.code === '1000') {
              this.Message.success(response.data.msg);
              this.getPageList('normal');
            } else {
              this.Message.error(response.data.msg);
              this.getPageList('normal');
            }
            return response;
          })
          .catch(response => {
            return response;
          });
      });
    },

    // 重置查询条件表单
    resetSearchForm() {
      this.searchForm = {
        id: '',
        pageName: '',
        startTime: '',
        updateTime: ''
      };
    }
  },
  beforeMount() {
    this.getPageList();
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
