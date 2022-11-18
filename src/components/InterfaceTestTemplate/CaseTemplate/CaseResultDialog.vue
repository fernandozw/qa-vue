<template>
  <div>
    <el-dialog
      :title="'查看(结果id：' + caseResultDetail.id + ')'"
      :visible.sync="dialogVisible"
      width="80%"
    >
      <div>
        <el-card class="box-card">
          <el-row :gutter="20">
            <el-col :span="4">
              <span>用例id:</span>
            </el-col>
            <el-col :span="8" :pull="2">
              <el-input v-model="caseResultDetail.case_id"></el-input>
            </el-col>
            <el-col :span="4">
              <span>用例名称:</span>
            </el-col>
            <el-col :span="8" :pull="2">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
                v-model="caseResultDetail.case_name"
              >
              </el-input>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="4">
              <span>所属项目:</span>
            </el-col>
            <el-col :span="8" :pull="2">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
                v-model="caseResultDetail.project"
              >
              </el-input>
            </el-col>
            <el-col :span="4">
              <span>项目版本:</span>
            </el-col>
            <el-col :span="8" :pull="2">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
                v-model="caseResultDetail.project_version"
              >
              </el-input>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="4">
              <span>所属业务:</span>
            </el-col>
            <el-col :span="8" :pull="2">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
                v-model="caseResultDetail.business"
              >
              </el-input>
            </el-col>
            <el-col :span="4">
              <span>host地址:</span>
            </el-col>
            <el-col :span="8" :pull="2">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
                v-model="caseResultDetail.host"
              >
              </el-input>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="4">
              <span>url地址:</span>
            </el-col>
            <el-col :span="8" :pull="2">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
                v-model="caseResultDetail.url"
              >
              </el-input>
            </el-col>
            <el-col :span="4">
              <span>请求头部:</span>
            </el-col>
            <el-col :span="8" :pull="2">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
                v-model="caseResultDetail.header"
              >
              </el-input>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="4">
              <span>请求参数:</span>
            </el-col>
            <el-col :span="8" :pull="2">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
                v-model="caseResultDetail.param"
              >
              </el-input>
            </el-col>
            <el-col :span="4">
              <span>返回校验:</span>
            </el-col>
            <el-col :span="8" :pull="2">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
                v-model="caseResultDetail.check_nodes"
              >
              </el-input>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="4">
              <span>请求类型:</span>
            </el-col>
            <el-col :span="8" :pull="2">
              <el-input v-model="caseResultDetail.request_type"></el-input>
            </el-col>
            <el-col :span="4">
              <span>用例类型:</span>
            </el-col>
            <el-col :span="8" :pull="2">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
                v-model="caseResultDetail.case_type"
              >
              </el-input>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="4">
              <span>返回结果:</span>
            </el-col>
            <el-col :span="8" :pull="2">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
                v-model="caseResultDetail.response"
              >
              </el-input>
            </el-col>
            <el-col :span="4">
              <span>执行状态:</span>
            </el-col>
            <el-col :span="8" :pull="2">
              <el-input v-model="caseResultDetail.status"></el-input>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="4">
              <span>失败原因:</span>
            </el-col>
            <el-col :span="8" :pull="2">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
                v-model="caseResultDetail.fail_reason"
              >
              </el-input>
            </el-col>
            <el-col :span="4">
              <span>请求耗时:</span>
            </el-col>
            <el-col :span="8" :pull="2">
              <el-input v-model="caseResultDetail.use_time"></el-input>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="4">
              <span>创建时间:</span>
            </el-col>
            <el-col :span="8" :pull="2">
              <el-input v-model="caseResultDetail.add_time"></el-input>
            </el-col>
          </el-row>
        </el-card>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="closeDialog"
          >关 闭</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'CaseResultDialog',
  props: {},
  data() {
    return {
      dialogVisible: false,
      caseResultDetail: {}
    };
  },
  methods: {
    // 关闭弹窗
    closeDialog() {
      this.caseResultDetail = {};
      this.dialogVisible = false;
    },
    // 父级点击查看按钮
    lookClick(id) {
      this.dialogVisible = true;
      let editUrl = String.format(
        '{0}/caseInterface/caseResultInfo?id={1}',
        this.GLOBAL.MONITOR_URL,
        id
      );
      this.axios
        .get(editUrl)
        .then(response => {
          this.caseResultDetail = response.data.caseResultInfo;
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
.el-row {
  line-height: 40px;
  margin-top: 10px;
}
</style>
