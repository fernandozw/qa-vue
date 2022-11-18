<template>
  <div>
    <el-table
      :data="tabData"
      style="width: 100%"
      border
      :max-height="tabHeight"
      size="small"
      :row-class-name="tableRowClassName"
    >
      <!--使用默认的唯一索引index,作为key的唯一值-->
      <template v-for="(col, index) in tabHeader">
        <!--key是必须的且写在真实的html元素上,否则es6检查会报错-->
        <el-table-column
          v-if="col.type === 'normal'"
          :prop="col.prop"
          :label="col.label"
          :key="index"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <!--根据列进行排序,超过长度用省略号表示-->
        <el-table-column
          v-if="col.type === 'sort'"
          :prop="col.prop"
          sortable
          :label="col.label"
          :key="index"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
      </template>
    </el-table>
  </div>
</template>
<script>
export default {
  // 模板名称
  name: 'tablePub',
  // 模板动态参数(tabData:表格的列数据;tabHeader:表头;tabHeight:表格的固定高度,值由引用组件传入)
  props: { tabData: null, tabHeader: null, tabHeight: null },
  data() {
    return {};
  },
  methods: {
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
<!-- element-ui中table表头错位问题-->
<style>
body .el-table th.gutter {
  display: table-cell !important;
}

body .el-table colgroup.gutter {
  display: table-cell !important;
}

.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
