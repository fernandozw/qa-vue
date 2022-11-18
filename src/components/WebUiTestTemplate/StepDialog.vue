<template>
  <div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="80%"
      class="step-dialog"
      @close="close"
      id="stepDialog"
    >
      <div>
        <el-button
          type="text"
          size="mini"
          @click="clickNotice"
          style="margin-top: 0px"
          >内置参数说明
        </el-button>
        <el-card class="box-card">
          <el-form :inline="true" :model="stepDetail" size="mini">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="步骤名称:">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4 }"
                    placeholder="必填项:请输入内容"
                    v-model="stepDetail.stepName"
                    clearable
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="所属业务:">
                  <el-select
                    v-model="stepDetail.pageId"
                    placeholder="必填项:请选择"
                    clearable
                    filterable
                    @change="changeForPage(stepDetail.pageId)"
                  >
                    <el-option
                      v-for="item in pageList"
                      :key="item.id"
                      :label="item.pageName"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="所属元素:">
                  <el-select
                    v-model="stepDetail.elementId"
                    placeholder="必填项:请选择"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="item in elementList"
                      :key="item.id"
                      :label="item.elementName"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="操作类型:">
                  <el-select
                    v-model="stepDetail.action"
                    filterable
                    placeholder="选择操作类型"
                    clearable
                    @change="changeAction"
                  >
                    <el-option
                      v-for="item in actionList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                      <span style="float: left">{{ item.label }}</span>
                      <span
                        style="float: right; color: #8492a6; font-size: 13px"
                        >{{ item.value }}</span
                      >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="外部函数:">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4 }"
                    placeholder="请输入内容"
                    v-model="stepDetail.function"
                    clearable
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="随操作值:">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4 }"
                    placeholder="请输入内容"
                    v-model="stepDetail.actionValue"
                    clearable
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="校验类型:">
                  <el-select
                    v-model="stepDetail.verifyAction"
                    filterable
                    placeholder="选择校验类型"
                    clearable
                    @change="changeVerifyAction"
                  >
                    <el-option
                      v-for="item in verifyList"
                      :key="item.id"
                      :label="item.label"
                      :value="item.value"
                    >
                      <span style="float: left">{{ item.label }}</span>
                      <span
                        style="float: right; color: #8492a6; font-size: 13px"
                        >{{ item.value }}</span
                      >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否启用:">
                  <el-select
                    v-model="stepDetail.status"
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
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="随校验值:">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4 }"
                    placeholder="请输入内容"
                    v-model="stepDetail.verifyValue"
                    clearable
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="保存参数:">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4 }"
                    placeholder="请输入内容"
                    v-model="stepDetail.paramKey"
                    clearable
                    :disabled="stepDetail.action !== 'sendKeys' ? true : false"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="info" @click="close">取 消</el-button>
        <el-button size="mini" type="primary" @click="saveStep">
          {{ btnText }}
        </el-button>
      </span>
    </el-dialog>
    <notice-dialog
      v-if="noticeVisible"
      :notice="noticeVisible"
      @listenToChildEvent="callbackFunc"
    ></notice-dialog>
  </div>
</template>

<script>
import NoticeDialog from '../WebUiTestTemplate/NoticeDialog';

export default {
  name: 'StepDialog',
  components: {
    noticeDialog: NoticeDialog
  },
  props: {
    stepId: {
      type: Number,
      default: null
    },
    type: {
      type: Number,
      default: 1 // 1 新增 2 编辑 3 新增
    },
    visible: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      noticeVisible: false,
      dialogVisible: true,
      stepDetail: {
        stepName: '',
        elementId: '',
        action: '',
        actionValue: '',
        function: '',
        status: '',
        verifyAction: '',
        verifyValue: '',
        paramKey: ''
      },
      actionList: [],
      actionParamMap: {},
      pageList: [],
      verifyList: [],
      verifyMap: {},
      statusList: [],
      statusMap: {},
      elementList: []
    };
  },
  methods: {
    // 点击内置参数
    clickNotice() {
      this.noticeVisible = true;
    },
    // 内置参数弹窗的回调
    callbackFunc() {
      this.noticeVisible = false;
    },
    // 校验类型变化时
    changeVerifyAction() {
      this.stepDetail.verifyValue = '';
    },
    // 操作变化时
    changeAction() {
      this.stepDetail.actionValue = '';
      this.stepDetail.paramKey = '';
    },
    // 新增、编辑、复制步骤
    saveStep() {
      let url = String.format(
        this.type === 2 ? '{0}/step/update' : '{0}/step/add',
        this.GLOBAL.WEBUI_URL
      );
      // 指定参数格式
      let config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      };
      this.axios
        .post(url, JSON.stringify(this.stepDetail), config)
        .then(response => {
          let responseCode = response.data.code;
          if (responseCode === '1000') {
            this.Message.success(response.data.msg);
            // 调用父组件的查询方法
            this.$emit('listenToChildEvent', true);
          } else {
            this.Message.error(response.data.msg);
          }
          return response;
        })
        .catch(response => {
          // 调用父组件的查询方法
          // this.$emit('listenToChildEvent', true);
          return response;
        });
    },
    // 页面变化时
    changeForPage(pageId) {
      this.stepDetail.elementId = '';
      this.elementList = [];
      let url = String.format(
        '{0}//element/getElementByPageId?pageId={1}',
        this.GLOBAL.WEBUI_URL,
        pageId
      );
      this.axios
        .get(url)
        .then(response => {
          this.elementList = response.data.data;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 关闭dialog弹框
    close() {
      this.$emit('listenToChildEvent', false);
    },
    // 获取查询条件
    getConditions() {
      let url = String.format(
        '{0}/step/getSearchCondition',
        this.GLOBAL.WEBUI_URL
      );
      this.axios
        .get(url)
        .then(response => {
          this.actionList = response.data.data.actionList;
          this.actionParamMap = response.data.data.actionParamMap;
          this.pageList = response.data.data.pageList;
          this.verifyList = response.data.data.verifyList;
          this.verifyMap = response.data.data.verifyMap;
          this.statusList = response.data.data.statusList;
          this.statusMap = response.data.data.statusMap;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 步骤详情
    detail() {
      let url = String.format(
        '{0}/step/getStepDetailById?id={1}',
        this.GLOBAL.WEBUI_URL,
        this.stepId
      );
      this.axios
        .get(url)
        .then(response => {
          this.stepDetail = response.data.data.step;
          this.elementList = response.data.data.elementList;
          this.getConditions();
          return response;
        })
        .catch(response => {
          return response;
        });
    }
  },
  computed: {
    dialogTitle() {
      if (this.type === 2) {
        return '编辑' + '（步骤ID：' + this.stepId + '）';
      } else if (this.type === 3) {
        return '复制';
      }
      return '新增';
    },
    btnText() {
      if (this.type === 3) {
        return '复 制';
      }
      return '保 存';
    },
    typeText() {
      if (this.type === 2) {
        return '编辑';
      } else if (this.type === 3) {
        return '复制';
      }
      return '新增';
    }
  },
  created() {
    this.dialogVisible = this.visible;
    if (this.type === 1) {
      this.getConditions();
    } else if (this.type === 2 || this.type === 3) {
      this.detail();
    }
    // if (this.type === 1) {
    //   this.getConditions();
    // } else if (this.type === 2 || this.type === 3) {
    //   this.init();
    // }
  }
};
</script>

<style scoped>
/deep/ .el-textarea {
  width: 400px !important;
}
/deep/ #elementDialog .el-select {
  width: 300px !important;
}
</style>
