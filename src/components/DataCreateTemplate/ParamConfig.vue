<template>
  <div>
    <el-table
      :data="paramData.paramList"
      :row-class-name="tableRowClassName"
      :header-cell-style="getHeaderClass"
      style="width: 100%"
      size="mini"
      border
    >
      <el-table-column property="id" label="id" width="80" align="center" />
      <el-table-column
        property="paramType"
        label="参数类型"
        width="200"
        align="center"
      />
      <!--<el-table-column property="methodId" label="方法id"></el-table-column>-->
      <el-table-column property="paramName" label="参数名称" align="center">
        <template slot-scope="scope">
          <span style="color:red"><strong>* </strong></span
          ><el-input
            v-model="scope.row.paramName"
            style="width: 90%;"
            size="mini"
            clearable
          />
        </template>
      </el-table-column>
      <el-table-column property="paramValue" label="默认值" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.paramValue" size="mini" clearable />
        </template>
      </el-table-column>
      <el-table-column
        property="paramMark"
        label="提示(placeholder)"
        align="center"
      >
        <template slot-scope="scope">
          <span style="color:red"><strong>* </strong></span
          ><el-input
            v-model="scope.row.paramMark"
            size="mini"
            style="width: 90%;"
            clearable
          />
        </template>
      </el-table-column>
      <el-table-column
        property="paramWidget"
        label="控件类型"
        align="center"
        clearable
      >
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.paramWidget"
            placeholder="请选择控件类型"
            size="mini"
            clearable
          >
            <el-option
              v-for="item in widgetList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { widgetList } from '../../api/common/createdata';

export default {
  name: 'ParamConfig',
  props: { paramData: { type: Object, default: null } },
  data() {
    return {
      widgetList: widgetList
    };
  },
  methods: {
    // 控制表格头部颜色
    getHeaderClass({ rowIndex }) {
      if (rowIndex === 0) {
        return 'background:deepskyblue';
      } else {
        return '';
      }
    },
    // 设置行的颜色
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return 'warning-row';
      } else {
        return 'success-row';
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

.scriptDialog {
  margin-top: -70px !important;
}
</style>
