<template>
  <div>
    <el-row :gutter="40">
      <el-col :span="6">
        <div class="search">
          版本id
        </div>
        <el-input size="mini" v-model="id" clearable></el-input>
      </el-col>
      <el-col :span="6">
        <div class="search">版本名称</div>
        <el-input size="mini" v-model="versionName" clearable></el-input>
      </el-col>
      <el-col :span="6">
        <div class="search">所属项目</div>
        <el-select size="mini" v-model="projectId" clearable>
          <el-option
            v-for="item in projectList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" size="mini" round>查询</el-button>
        <el-button type="success" size="mini" round>新增</el-button>
      </el-col>
    </el-row>
    <el-table
      :data="tableData"
      :row-class-name="tableRowClassName"
      :header-cell-style="getHeaderClass"
      border
      style="width: 100%;margin-top: 10px"
      size="mini"
    >
      <el-table-column
        fixed
        prop="id"
        label="id"
        align="center"
        show-overflow-tooltip
        width="100px"
      />
      <el-table-column
        fixed
        prop="version_name"
        label="版本名称"
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
          <el-button type="text" size="small">编辑</el-button>

          <el-button type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page.sync="currentPage"
      :page-size="pageSize"
      :total="total"
      layout="total,slot, prev, pager, next, jumper"
      style="margin-top: 10px"
      @size-change="handleSizeChange"
      @current-change="getListByCondition"
    >
      <span>{{ pageSize }}条/页</span>
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'VersionConfig',
  data() {
    return {
      id: '',
      versionName: '',
      projectId: '',
      projectList: [],
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0
    };
  },
  methods: {
    // 获取列表
    getListByCondition(type) {
      if (type === 'search') {
        this.currentPage = 1;
      }
      let url = String.format(
        '{0}/projectInterface/searchHost',
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
.search {
  float: left;
  margin-top: 5px;
  margin-bottom: 5px;
}

.el-col .el-input {
  float: left;
  width: 70%;
}

.el-col .el-select {
  float: left;
  width: 70%;
}
</style>
