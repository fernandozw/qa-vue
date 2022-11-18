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
        <!--根据列进行排序,超过长度用省略号表示-->
        <el-table-column
          v-if="col.prop === 'id' || col.prop === 'scene_id'"
          :prop="col.prop"
          :label="col.label"
          :key="index"
          align="center"
          show-overflow-tooltip
          fixed
          width="80px"
        >
        </el-table-column>
        <el-table-column
          v-else-if="col.prop === 'scene_name'"
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
          width="80px"
          fixed="right"
        >
        </el-table-column>
        <!--操作选项-->
        <el-table-column
          v-else-if="col.type === 'action'"
          :label="col.label"
          :key="index"
          align="center"
          fixed="right"
          width="80px"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click="lookClick(tabData[scope.$index].id)"
              >查看
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          v-else
          :prop="col.prop"
          :label="col.label"
          :key="index"
          align="center"
          width="150px"
          show-overflow-tooltip
        >
        </el-table-column>
      </template>
    </el-table>
    <el-dialog
      title="查看"
      :visible.sync="dialogVisible"
      width="85%"
      id="resultTab"
    >
      <el-card class="box-card">
        <div slot="header" class="clearfix" style="text-align:center;">
          <h1>
            {{ sceneResultDetail.scene_type + '场景' }}
          </h1>
        </div>
        <el-row :gutter="20">
          <el-col :span="2">
            <span>场&nbsp;&nbsp;景&nbsp;&nbsp;id:</span>
          </el-col>
          <el-col :span="4">
            <el-input
              v-model="sceneResultDetail.id"
              placeholder="场景id"
            ></el-input>
          </el-col>
          <el-col :span="2">
            <span>场景名称:</span>
          </el-col>
          <el-col :span="6">
            <el-input
              v-model="sceneResultDetail.scene_name"
              placeholder="场景名称"
            ></el-input>
          </el-col>
          <el-col :span="2">
            <span>所属项目: </span>
          </el-col>
          <el-col :span="4">
            <el-input
              v-model="sceneResultDetail.project_name"
              placeholder="所属项目"
            >
            </el-input>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 10px">
          <el-col :span="2">
            <span>项目版本: </span>
          </el-col>
          <el-col :span="4">
            <el-input
              v-model="sceneResultDetail.project_version"
              placeholder="项目版本"
            >
            </el-input>
          </el-col>
          <el-col :span="2">
            <span>所属业务: </span>
          </el-col>
          <el-col :span="4">
            <el-input
              v-model="sceneResultDetail.business_name"
              placeholder="所属业务"
            >
            </el-input>
          </el-col>
          <el-col :span="2">
            <span>场景类型: </span>
          </el-col>
          <el-col :span="4">
            <el-input
              v-model="sceneResultDetail.scene_type"
              placeholder="场景类型"
            >
            </el-input>
          </el-col>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix" style="text-align:center;">
          <h1>{{ sceneResultDetail.scene_type }}用例表</h1>
        </div>
        <el-table
          :data="resultData"
          border
          style="width: 100%"
          :row-class-name="resultRowClassName"
        >
          <el-table-column label="所属项目" align="center">
            <template slot-scope="scope">
              <el-input
                v-model="resultData[scope.$index].project_name"
                placeholder="所属项目"
              >
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="所属业务" align="center">
            <template slot-scope="scope">
              <el-input
                v-model="resultData[scope.$index].business_name"
                placeholder="所属业务"
              >
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="用例" align="center" width="500px">
            <template slot-scope="scope">
              <el-input
                v-model="resultData[scope.$index].case_value"
                placeholder="用例"
              >
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="执行状态" align="center" width="120px">
            <template slot-scope="scope">
              <el-button
                v-if="resultData[scope.$index].status === '成功'"
                round
                type="success"
                @click="
                  $refs.resultDialog.lookClick(
                    resultData[scope.$index].case_result_id
                  )
                "
              >
                {{ resultData[scope.$index].status }}
              </el-button>
              <el-button
                v-else-if="resultData[scope.$index].status === '失败'"
                round
                type="info"
                @click="
                  $refs.resultDialog.lookClick(
                    resultData[scope.$index].case_result_id
                  )
                "
              >
                {{ resultData[scope.$index].status }}
              </el-button>
              <el-button
                v-else-if="resultData[scope.$index].status === '未执行'"
                round
              >
                {{ resultData[scope.$index].status }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="dialogVisible = false"
          >关 闭</el-button
        >
      </span>
    </el-dialog>
    <case-result-dialog ref="resultDialog"> </case-result-dialog>
  </div>
</template>

<script>
import CaseResultDialog from '../CaseTemplate/CaseResultDialog';

export default {
  // 模板名称
  name: 'SceneResultTable',
  components: { caseResultDialog: CaseResultDialog },

  // 模板动态参数(tabData:表格的列数据;tabHeader:表头;tabHeight:表格的固定高度,值由引用组件传入)
  props: {
    tabData: null,
    tabHeader: null,
    tabHeight: null
  },
  data() {
    return {
      dialogVisible: false,
      sceneResultDetail: {},
      resultData: []
    };
  },
  methods: {
    // 设置tab行的颜色
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return 'warning-row';
      } else {
        return 'success-row';
      }
    },

    // 设置结果详情行的颜色
    resultRowClassName({ row }) {
      if (row.status === '失败') {
        return 'error-row';
      } else if (row.status === '未执行') {
        return 'warn-row';
      } else {
        return 'normal-row';
      }
    },
    lookClick(id) {
      this.dialogVisible = true;
      let editUrl = String.format(
        '{0}/sceneInterface/sceneResultInfo?id={1}',
        this.GLOBAL.MONITOR_URL,
        id
      );
      this.axios
        .get(editUrl)
        .then(response => {
          this.sceneResultDetail = response.data.sceneResultInfo;
          this.resultData = response.data.sceneResultInfo.case_info_list;
          return response;
        })
        .catch(response => {
          return response;
        });
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

.el-table >>> .error-row {
  background: orangered;
}

.el-table >>> .warn-row {
  background: moccasin;
}

.el-table >>> .normal-row {
  background: white;
}

/deep/ #resultTab .el-table tbody tr:hover td {
  background-color: skyblue !important;
}

.el-row {
  line-height: 40px;
  margin-top: 0px;
}
</style>
