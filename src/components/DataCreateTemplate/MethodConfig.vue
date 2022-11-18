<template>
  <div>
    <el-card class="box-card">
      <el-table
        :data="methodData.methodList"
        :row-class-name="tableRowClassName"
        :header-cell-style="getHeaderClass"
        :empty-text="emptyText"
        border
        style="width: 100%"
        size="mini"
      >
        <el-table-column prop="id" label="id" width="80" align="center" />
        <el-table-column prop="methodName" label="方法名称" align="center" />
        <el-table-column label="方法标签" prop="methodLabel" align="center">
          <template slot-scope="scope">
            <span style="color:red"><strong>* </strong></span
            ><el-input
              v-model="scope.row.methodLabel"
              size="mini"
              style="width:90%"
              clearable
            />
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="250" align="center">
          <template slot-scope="scope">
            <el-button
              :disabled="
                scope.row.existParam === 1 && methodData.action === 'edit'
                  ? false
                  : true
              "
              type="text"
              size="small"
              @click="getParamData(scope.row)"
              >配置参数</el-button
            >
            <template>
              <el-button
                v-if="scope.row.existParam === 0"
                type="info"
                icon="el-icon-minus"
                circle
                disabled
                size="mini"
              />
              <el-button
                v-else-if="
                  scope.row.existParam === 1 && scope.row.setParam === 0
                "
                type="danger"
                disabled
                icon="el-icon-close"
                circle
                size="mini"
              />
              <el-button
                v-else-if="
                  scope.row.existParam === 1 && scope.row.setParam === 1
                "
                type="success"
                icon="el-icon-check"
                circle
                disabled
                size="mini"
              />
            </template>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-drawer
      ref="paramConfig"
      :title="paramData.action === 'add' ? '新增参数' : '修改参数'"
      :visible.sync="paramDialog"
      :append-to-body="true"
      direction="rtl"
      size="70%"
      ><el-card class="box-card" style="margin-left: 10px;margin-right: 10px"
        ><param-config :param-data="paramData" />
        <div style="margin-top: 15px;margin-bottom:10px;float: right">
          <el-button size="mini" @click="paramDialog = false">取 消</el-button>
          <el-button
            v-if="paramData.action === 'add'"
            :disabled="paramData.paramList.length === 0 ? true : false"
            size="mini"
            type="success"
            @click="addParamConfig(paramData.paramList)"
            >保 存
          </el-button>
          <el-button
            v-if="paramData.action === 'edit'"
            :disabled="paramData.paramList.length === 0 ? true : false"
            size="mini"
            type="primary"
            @click="editParamConfig(paramData.paramList)"
            >保 存
          </el-button>
        </div></el-card
      >
    </el-drawer>
  </div></template
>

<script>
import ParamConfig from './ParamConfig.vue';
import { param } from '../../api/common/createdata';
import { doRequest } from '../../api/common/request';

export default {
  name: 'MethodConfig',
  components: { paramConfig: ParamConfig },
  props: {
    methodData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      paramData: {},
      emptyText: '',
      paramDialog: false
    };
  },
  methods: {
    // 校验配置参数的必填参数
    checkParam(source) {
      let result = true;
      for (const item in source) {
        if (
          source[item]['paramName'].trim() !== '' &&
          source[item]['paramMark'].trim() !== ''
        ) {
          result = true;
        } else {
          result = false;
          break;
        }
      }
      return result;
    },
    // 新增参数配置
    addParamConfig(paramList) {
      if (!this.checkParam(paramList)) {
        this.$message.error('请填写必填项!');
      } else {
        const paramDict = param.add;
        paramDict.param = paramList;
        doRequest(this.GLOBAL.BASE_URL, paramDict).then(response => {
          if (response.code === '1000') {
            this.paramDialog = false;
            this.$message.success(response.msg);
            this.$emit('fatherMethod');
            this.$emit('getMethodDetail');
          } else {
            this.$message.error(response.msg);
            this.$emit('getMethodDetail');
          }
        });
      }
    },
    // 修改参数配置
    editParamConfig(paramList) {
      if (!this.checkParam(paramList)) {
        this.$message.error('请填写必填项!');
      } else {
        const paramDict = param.update;
        paramDict.param = paramList;
        doRequest(this.GLOBAL.BASE_URL, paramDict).then(response => {
          if (response.code === '1000') {
            this.paramDialog = false;
            this.$message.success(response.msg);
            this.$emit('fatherMethod');
            this.$emit('getMethodDetail');
          } else {
            this.$message.error(response.msg);
            this.$emit('getMethodDetail');
          }
        });
      }
    },
    // 获取参数详情
    getParamData(method) {
      this.paramDialog = true;
      const paramDict = param.getParams;
      paramDict.param = { ...paramDict.param, ...method };
      doRequest(this.GLOBAL.BASE_URL, paramDict).then(response => {
        this.emptyText = response.msg;
        console.log(this.emptyText);
        this.paramData = response.data;
        const h = this.$createElement;
        this.$notify({
          title: '提示',
          message: h('i', { style: 'color: teal' }, response.msg)
        });
      });
    },
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
