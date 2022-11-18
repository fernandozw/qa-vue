<template>
  <div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="80%"
      class="element-dialog"
      @close="close"
      id="elementDialog"
    >
      <div>
        <el-card class="box-card">
          <el-form :inline="true" :model="elementDetail" size="mini">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="元素名称:">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4 }"
                    placeholder="必填项:请输入内容"
                    v-model="elementDetail.elementName"
                    clearable
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="iframe:">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4 }"
                    placeholder="必填项:请输入内容"
                    v-model="elementDetail.iframe"
                    clearable
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="定位方式:">
                  <el-select
                    v-model="elementDetail.locateType"
                    filterable
                    placeholder="选择定位方式"
                    clearable
                  >
                    <el-option
                      v-for="item in locateList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="关键字:">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4 }"
                    placeholder="必填项:请输入内容"
                    v-model="elementDetail.keyword"
                    clearable
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="所属业务:">
                  <el-select
                    v-model="elementDetail.pageId"
                    filterable
                    placeholder="选择所属业务"
                    clearable
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
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="info" @click="close">取 消</el-button>
        <el-button size="mini" type="primary" @click="saveElement">
          {{ btnText }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ElementDialog',
  props: {
    elementId: {
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
      dialogVisible: true,
      elementDetail: {
        elementName: '',
        iframe: '',
        locateType: '',
        keyword: '',
        pageId: ''
      },
      locateList: [],
      pageList: []
    };
  },
  methods: {
    // 新增、编辑、复制元素
    saveElement() {
      let url = String.format(
        this.type === 2 ? '{0}/element/update' : '{0}/element/add',
        this.GLOBAL.WEBUI_URL
      );
      // 指定参数格式
      let config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      };
      this.axios
        .post(url, JSON.stringify(this.elementDetail), config)
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
    // 获取查询条件
    getConditions() {
      let url = String.format(
        '{0}/element/getSearchCondition',
        this.GLOBAL.WEBUI_URL
      );
      this.axios
        .get(url)
        .then(response => {
          this.locateList = response.data.data.locateList;
          this.pageList = response.data.data.pageList;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 元素详情
    detail() {
      let url = String.format(
        '{0}/element/getElementById?id={1}',
        this.GLOBAL.WEBUI_URL,
        this.elementId
      );
      this.axios
        .get(url)
        .then(response => {
          this.elementDetail = response.data.data;
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
        return '编辑' + '（元素ID：' + this.elementId + '）';
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
