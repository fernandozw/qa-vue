<template>
  <div>
    <el-dialog
      title="内置参数说明"
      :visible.sync="dialogVisible"
      width="60%"
      class="notice-dialog"
      @close="close"
    >
      <div>
        <span
          ><span style="color: #FF0000; "
            ><i
              >注意:变量名为固定,变量值为自动生成,引用时固定格式:${变量名}</i
            ></span
          ></span
        >
        <el-table
          :data="noticeDetail"
          border
          style="width: 100%;margin-top: 10px"
          :row-class-name="tableRowClassName"
          size="mini"
        >
          <el-table-column label="变量名" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="text">{{
                noticeDetail[scope.$index].key
              }}</el-button>
              <el-tooltip content="点击复制变量名" placement="top">
                <i
                  class="el-icon-document-copy"
                  @click="clickCopy(noticeDetail[scope.$index].key)"
                />
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="value" label="变量值" align="center">
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="info" @click="close">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'NoticeDialog',
  props: {
    notice: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      dialogVisible: true,
      noticeDetail: []
    };
  },
  methods: {
    clickCopy(value) {
      const save = function(e) {
        e.clipboardData.setData('text/plain', '${' + value + '}');
        e.preventDefault(); // 阻止默认行为
      };
      const once = {
        once: true
      };
      document.addEventListener('copy', save, once); // 添加一个copy事件,当触发时执行一次,执行完删除
      document.execCommand('copy'); // 执行copy方法
      this.$message({ message: '复制成功', type: 'success' });
    },
    // 设置行的颜色
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return 'warning-row';
      } else {
        return 'success-row';
      }
    },
    // 关闭dialog弹框
    close() {
      this.$emit('listenToChildEvent', false);
    },
    detail() {
      let url = String.format('{0}/step/noticeList', this.GLOBAL.WEBUI_URL);
      this.axios
        .get(url)
        .then(response => {
          this.noticeDetail = response.data.data;
          return response;
        })
        .catch(response => {
          return response;
        });
    }
  },
  created() {
    this.dialogVisible = this.notice;
    this.detail();
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
</style>
