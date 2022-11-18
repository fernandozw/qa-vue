<template>
  <div>
    <el-table
      :data="tabData"
      style="width: 100%;margin-top: -10px"
      border
      size="mini"
      :row-class-name="tableRowClassName"
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
          fixed="right"
          width="100px"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click="$refs.resultDialog.lookClick(tabData[scope.$index].id)"
              >查看
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="col.prop === 'id' || col.prop === 'case_id'"
          :prop="col.prop"
          :label="col.label"
          :key="index"
          align="center"
          show-overflow-tooltip
          width="80px"
          fixed="left"
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
          v-else-if="col.prop === 'status'"
          :prop="col.prop"
          :label="col.label"
          :key="index"
          align="center"
          show-overflow-tooltip
          width="100px"
          fixed="right"
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
    <case-result-dialog ref="resultDialog"> </case-result-dialog>
  </div>
</template>

<script>
import CaseResultDialog from './CaseResultDialog';

export default {
  // 模板名称
  name: 'CaseResultTable',
  components: { caseResultDialog: CaseResultDialog },

  // 模板动态参数(tabData:表格的列数据;tabHeader:表头;tabHeight:表格的固定高度,值由引用组件传入)
  props: {
    tabData: null,
    tabHeader: null,
    tabHeight: null
  },
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
<style scoped>
.el-table >>> .warning-row {
  background: oldlace;
}

.el-table >>> .success-row {
  background: #f0f9eb;
}

.el-row {
  line-height: 40px;
  margin-top: 10px;
}
</style>
