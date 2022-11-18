<template>
  <div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="98%"
      class="uiCase-dialog"
      @close="close"
    >
      <div>
        <el-card class="box-card" id="uiCaseBase">
          <div slot="header" class="clearfix">
            <strong>基础信息 </strong>
          </div>
          <el-form :inline="true" :model="caseDetail" size="mini">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="用例名称:">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4 }"
                    placeholder="必填项:请输入内容"
                    v-model="caseDetail.caseName"
                    clearable
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="url:">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4 }"
                    placeholder="必填项:请输入内容"
                    v-model="caseDetail.url"
                    clearable
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="页面类型:">
                  <el-select
                    v-model="caseDetail.pageType"
                    filterable
                    placeholder="选择页面类型"
                    clearable
                  >
                    <el-option
                      v-for="item in pageTypeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="手机类型:">
                  <el-select
                    v-model="caseDetail.phoneType"
                    filterable
                    placeholder="选择手机类型"
                    clearable
                    :disabled="caseDetail.pageType === 'pc_web' ? true : false"
                  >
                    <el-option
                      v-for="item in phoneTypeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="浏览器类型:">
                  <el-select
                    v-model="caseDetail.browserType"
                    filterable
                    placeholder="选择浏览器类型"
                    clearable
                  >
                    <el-option
                      v-for="item in browserTypeList"
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
              <el-col :span="7">
                <el-form-item label="状态:">
                  <el-select
                    v-model="caseDetail.canUse"
                    filterable
                    placeholder="选择状态"
                    clearable
                  >
                    <el-option
                      v-for="item in canUseList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="校验操作:">
                  <el-select
                    v-model="caseDetail.verifyAction"
                    filterable
                    placeholder="选择校验操作"
                    clearable
                  >
                    <el-option
                      v-for="item in pageVerifyList"
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
              <el-col :span="9">
                <el-form-item label="校验值:">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4 }"
                    placeholder="请输入校验值"
                    v-model="caseDetail.verifyValue"
                    clearable
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="所属业务:">
                  <el-select
                    v-model="caseDetail.pageId"
                    placeholder="必填项:请选择"
                    clearable
                    filterable
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
              </el-col>
            </el-row>
          </el-form>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <strong>步骤信息</strong>
            <el-button
              type="text"
              size="mini"
              @click="clickNotice"
              style="float: right;"
              >内置参数说明
            </el-button>
          </div>
          <el-table
            :data="stepList"
            border
            stripe
            style="width: 98%;"
            size="mini"
          >
            <el-table-column
              label="所属业务"
              align="center"
              width="210px"
              fixed="left"
            >
              <template slot-scope="scope">
                <el-select
                  style="width: 180px;"
                  v-model="stepList[scope.$index].pageId"
                  placeholder="必填项:请选择"
                  clearable
                  filterable
                  @change="
                    changeforPageId(stepList[scope.$index].pageId, scope.$index)
                  "
                >
                  <el-option
                    v-for="item in pageList"
                    :key="item.id"
                    :label="'「' + item.id + '」' + item.pageName"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="步骤名称" align="center" width="240px">
              <template slot-scope="scope">
                <el-select
                  style="width: 210px;"
                  v-model="stepList[scope.$index].id"
                  placeholder="必填项:请选择"
                  clearable
                  filterable
                  @change="
                    changeforStep(stepList[scope.$index].id, scope.$index)
                  "
                  @focus="focusforStep(stepList[scope.$index].pageId)"
                >
                  <el-option
                    v-for="item in stepSelect"
                    :key="item.id"
                    :label="'「' + item.id + '」' + item.stepName"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="180px">
              <template slot-scope="scope">
                <el-select
                  v-model="stepList[scope.$index].action"
                  placeholder="请选择"
                  clearable
                  filterable
                  style="width:150px;"
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
              </template>
            </el-table-column>
            <el-table-column label="操作值" align="center" width="200px">
              <template slot-scope="scope">
                <el-input
                  v-model="stepList[scope.$index].actionValue"
                  placeholder="输入操作值"
                  clearable
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="校验类型" align="center" width="180px">
              <template slot-scope="scope">
                <el-select
                  v-model="stepList[scope.$index].verifyAction"
                  placeholder="请选择"
                  clearable
                  filterable
                  style="width:150px;"
                  @change="changeForVerifyAction(scope.$index)"
                >
                  <el-option
                    v-for="item in verifyList"
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
              </template>
            </el-table-column>
            <el-table-column label="校验值" align="center" width="200px">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="
                    clickImage(
                      stepList[scope.$index].id,
                      stepList[scope.$index].verifyAction
                    )
                  "
                  v-if="
                    imageList.indexOf(stepList[scope.$index].verifyAction) > -1
                  "
                  size="mini"
                  >设置图片</el-button
                >
                <el-button
                  type="text"
                  @click="
                    clickImageDetail(
                      stepList[scope.$index].id,
                      stepList[scope.$index].verifyAction
                    )
                  "
                  v-if="
                    imageList.indexOf(stepList[scope.$index].verifyAction) > -1
                  "
                  size="mini"
                  >查看图片</el-button
                >
                <el-input
                  v-else
                  v-model="stepList[scope.$index].verifyValue"
                  placeholder="输入校验值"
                  clearable
                  :disabled="!verifyMap[stepList[scope.$index].verifyAction]"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="外部函数" align="center" width="250PX">
              <template slot-scope="scope">
                <el-input
                  v-model="stepList[scope.$index].function"
                  placeholder="输入外部函数"
                  clearable
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="状态" align="center" width="150px">
              <template slot-scope="scope">
                <el-select
                  v-model="stepList[scope.$index].status"
                  placeholder="请选择"
                  clearable
                  filterable
                  style="width:120px;"
                >
                  <el-option
                    v-for="item in statusList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="保存参数" align="center" width="200PX">
              <template slot-scope="scope">
                <el-input
                  placeholder="输入保存参数的key"
                  v-model="stepList[scope.$index].paramKey"
                  clearable
                  :disabled="
                    stepList[scope.$index].action !== 'sendKeys' ? true : false
                  "
                >
                </el-input>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              fixed="right"
              width="250px"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="handleAdd(scope.$index)"
                  >插入
                </el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)"
                  >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="saveCase"
          >保 存
        </el-button>
        <el-button size="mini" type="info" @click="close">关 闭</el-button>
      </span>
    </el-dialog>
    <notice-dialog
      v-if="noticeVisible"
      :notice="noticeVisible"
      @listenToChildEvent="callbackFunc"
    ></notice-dialog>
    <expect-image-dialog
      v-if="imageVisible"
      :expectImage="imageVisible"
      :stepId="imageStepId"
      :compareType="compareType"
      @listenToChildEvent="callbackFuncForImage"
    ></expect-image-dialog>
    <image-detail-dialog
      v-if="imageDetailVisible"
      :expectImage="imageDetailVisible"
      :stepId="imageStepId"
      :compareType="compareType"
      @listenToChildEvent="callbackFuncForImageDetail"
    ></image-detail-dialog>
  </div>
</template>

<script>
import NoticeDialog from '../WebUiTestTemplate/NoticeDialog';
import ExpectImageDialog from '../WebUiTestTemplate/ExpectImageDialog';
import ImageImageDialog from '../WebUiTestTemplate/ImageDetailDialog';

export default {
  name: 'WebUiCaseDialog',
  components: {
    noticeDialog: NoticeDialog,
    expectImageDialog: ExpectImageDialog,
    imageDetailDialog: ImageImageDialog
  },
  props: {
    caseId: {
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
      imageStepId: null,
      compareType: '',
      imageList: [
        'assertCompleteOrPartialImage',
        'assertCompleteImage',
        'assertPartialImage'
      ],
      stepList: [
        {
          id: '',
          pageId: '',
          action: '',
          stepName: '',
          actionValue: '',
          function: '',
          status: '',
          verifyAction: '',
          verifyValue: '',
          paramKey: ''
        }
      ],
      actionList: [],
      actionParamMap: {},
      pageList: [],
      verifyList: [],
      statusList: [],
      dialogVisible: true,
      noticeVisible: false,
      imageVisible: false,
      imageDetailVisible: false,
      caseDetail: {
        caseName: '',
        url: '',
        pageId: '',
        pageType: '',
        phoneType: '',
        browserType: '',
        canUse: '',
        verifyAction: '',
        verifyValue: '',
        stepIds: ''
      },
      pageTypeList: [],
      phoneTypeList: [],
      browserTypeList: [],
      pageVerifyList: [],
      canUseList: [],
      stepSelect: [],
      verifyMap: {}
    };
  },
  methods: {
    // 点击内置参数
    clickNotice() {
      this.noticeVisible = true;
    },
    // 点击设置图片
    clickImage(stepId, type) {
      this.imageVisible = true;
      this.imageStepId = stepId;
      this.compareType = type;
    },
    // 点击设置图片
    clickImageDetail(stepId, type) {
      this.imageDetailVisible = true;
      this.imageStepId = stepId;
      this.compareType = type;
    },
    // 内置参数弹窗的回调
    callbackFunc() {
      this.noticeVisible = false;
    },
    // 设置期望图片弹窗的回调
    callbackFuncForImage() {
      this.imageVisible = false;
    },
    // 期望图片详情弹窗的回调
    callbackFuncForImageDetail() {
      this.imageDetailVisible = false;
    },
    // 校验类型改变时
    changeForVerifyAction(index) {
      this.stepList[index]['verifyValue'] = '';
    },
    changeforStep(id, index) {
      let url = String.format(
        '{0}/step/getStepDetailById?id={1}',
        this.GLOBAL.WEBUI_URL,
        id
      );
      this.axios
        .get(url)
        .then(response => {
          this.stepList.splice(index, 1, response.data.data.step);
          return response;
        })
        .catch(response => {
          return response;
        });
    },

    // 聚焦步骤时的事件
    focusforStep(pageId) {
      this.stepSelect = [];
      let url = String.format(
        '{0}/step/getStepListByPageId?pageId={1}',
        this.GLOBAL.WEBUI_URL,
        pageId
      );
      this.axios
        .get(url)
        .then(response => {
          this.stepSelect = response.data.data;
          return response;
        })
        .catch(response => {
          return response;
        });
    },

    // 根据页面id获取步骤列表
    changeforPageId(pageId, index) {
      this.stepList[index] = {
        id: '',
        pageId: pageId,
        action: '',
        stepName: '',
        actionValue: '',
        function: '',
        status: '',
        verifyAction: '',
        verifyValue: '',
        paramKey: ''
      };

      let url = String.format(
        '{0}/step/getStepListByPageId?pageId={1}',
        this.GLOBAL.WEBUI_URL,
        pageId
      );
      this.axios
        .get(url)
        .then(response => {
          this.stepSelect = response.data.data;
          return response;
        })
        .catch(response => {
          return response;
        });
    },

    // 获取全部的步骤
    allStep() {
      let url = String.format('{0}/step/getAllStep', this.GLOBAL.WEBUI_URL);
      this.axios
        .get(url)
        .then(response => {
          this.stepSelect = response.data.data;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 保存用例信息
    saveCase() {
      let url = String.format(
        this.type === 2 ? '{0}/case/update' : '{0}/case/add',
        this.GLOBAL.WEBUI_URL
      );
      // 指定参数格式
      let config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      };
      let stepIds = this.stepList
        .map((obj, index) => {
          return obj.id;
        })
        .join(',');
      this.caseDetail.stepIds = stepIds;
      let param = { uiCase: this.caseDetail, stepList: this.stepList };
      this.axios
        .post(url, JSON.stringify(param), config)
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
    // 关闭dialog弹框
    close() {
      this.$emit('listenToChildEvent', false);
    },
    // 获取步骤的查询条件
    getStepConditions() {
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
          this.statusList = response.data.data.statusList;
          this.verifyList = response.data.data.verifyList;
          this.verifyMap = response.data.data.verifyMap;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 获取查询条件
    getConditions() {
      let url = String.format(
        '{0}/case/getSearchCondition',
        this.GLOBAL.WEBUI_URL
      );
      this.axios
        .get(url)
        .then(response => {
          this.pageList = response.data.data.pageList;
          this.pageTypeList = response.data.data.pageTypeList;
          this.phoneTypeList = response.data.data.phoneTypeList;
          this.browserTypeList = response.data.data.browserTypeList;
          this.canUseList = response.data.data.canUseList;
          this.pageVerifyList = response.data.data.pageVerifyList;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 用例详情
    detail() {
      let url = String.format(
        '{0}/case/getCaseById?id={1}',
        this.GLOBAL.WEBUI_URL,
        this.caseId
      );
      this.axios
        .get(url)
        .then(response => {
          this.caseDetail = response.data.data.caseDetail;
          this.stepList =
            response.data.data.stepList.length > 0
              ? response.data.data.stepList
              : [
                  {
                    id: '',
                    pageId: '',
                    action: '',
                    stepName: '',
                    actionValue: '',
                    function: '',
                    status: '',
                    verifyAction: '',
                    verifyValue: ''
                  }
                ];
          this.getConditions();
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    handleAdd(index) {
      this.stepList.splice(index, 0, {
        pageId: '',
        action: '',
        stepName: ''
      });
      // 数组元素互换位置
      let tempOption = this.stepList[index + 1];
      this.$set(this.stepList, index + 1, this.stepList[index]);
      this.$set(this.stepList, index, tempOption);
    },
    handleDelete(index) {
      if (index === 0 && this.stepList.length === 1) {
        this.stepList = [
          {
            id: '',
            pageId: '',
            action: '',
            stepName: '',
            actionValue: '',
            function: '',
            status: '',
            verifyAction: '',
            verifyValue: ''
          }
        ];
      } else {
        this.stepList.splice(index, 1);
      }
    }
  },
  computed: {
    dialogTitle() {
      if (this.type === 2) {
        return '编辑' + '（用例ID：' + this.caseId + '）';
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
      this.getStepConditions();
    } else if (this.type === 2 || this.type === 3) {
      this.detail();
      this.getStepConditions();
      this.allStep();
    }
  }
};
</script>

<style scoped>
/deep/ .el-textarea {
  width: 400px !important;
}

/deep/ #uiCaseBase .el-select {
  width: 300px !important;
}
</style>
