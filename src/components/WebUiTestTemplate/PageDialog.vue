<template>
  <div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="80%"
      class="page-dialog"
      @close="close"
      id="pageDialog"
    >
      <div>
        <el-card class="box-card">
          <el-form :inline="true" :model="pageDetail" size="mini">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="业务名称:">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4 }"
                    placeholder="必填项:请输入内容"
                    v-model="pageDetail.pageName"
                    clearable
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
        <el-button size="mini" type="primary" @click="savePage">
          {{ btnText }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'PageDialog',
  props: {
    pageId: {
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
      pageDetail: {
        pageName: ''
      }
    };
  },
  methods: {
    // 新增、编辑、复制页面
    savePage() {
      let url = String.format(
        this.type === 2 ? '{0}/page/update' : '{0}/page/add',
        this.GLOBAL.WEBUI_URL
      );
      // 指定参数格式
      let config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      };
      if (this.type !== 2) {
        this.pageDetail.id = null;
      }
      this.axios
        .post(url, JSON.stringify(this.pageDetail), config)
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
    // 页面详情
    detail() {
      let url = String.format(
        '{0}/page/getPageById?id={1}',
        this.GLOBAL.WEBUI_URL,
        this.pageId
      );
      this.axios
        .get(url)
        .then(response => {
          this.pageDetail = response.data.data;
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
        return '编辑' + '（页面ID：' + this.pageId + '）';
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

    if (this.type === 2 || this.type === 3) {
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
</style>
