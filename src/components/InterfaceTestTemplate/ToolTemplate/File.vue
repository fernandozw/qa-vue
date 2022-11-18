<template>
  <div>
    <el-upload
      ref="upload"
      :auto-upload="true"
      :action="uploadUrl"
      :on-success="uploadSuccess"
      class="upload-demo"
      :show-file-list="false"
      multiple
      style="margin-left: 1px;margin-bottom: 5px;width:200px"
    >
      <el-button slot="trigger" size="small" type="success"
        >上传文件
      </el-button>
    </el-upload>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>文件列表</span>
        <span style="font-size: 6px"
          ><font color="#ff4500"
            >(目录:/usr/local/zhuwei/pyvenv/files/)</font
          ></span
        >
        <el-button
          :disabled="fileList.length > 0 ? false : true"
          style="float: right;margin-right: 20px"
          size="mini"
          type="warning"
          @click="deleteFile"
          >删 除
        </el-button>
      </div>
      <el-checkbox-group v-model="checked">
        <el-checkbox
          v-for="fileName in fileList"
          :key="fileName"
          :label="fileName"
          >{{ fileName }}
        </el-checkbox>
      </el-checkbox-group>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'File',
  data() {
    return {
      // 上传的url地址
      uploadUrl: this.GLOBAL.MONITOR_URL + '/smartToolsInterface/upload',
      checked: [],
      fileList: [],
      nameList: []
    };
  },
  methods: {
    reset() {
      this.checked = [];
      this.getFileList();
    },
    uploadSuccess(response) {
      console.log(response.code);
      if (response.code === '200') {
        this.$message.success(response.msg);
      } else {
        this.$message.error(response.msg);
      }
      this.getFileList();
    },
    deleteFile() {
      if (this.checked.length > 0) {
        this.$confirm('此操作将永久删除选中的文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let url = String.format(
            '{0}/smartToolsInterface/delete',
            this.GLOBAL.MONITOR_URL
          );
          // 指定参数格式
          let config = {
            headers: {
              'Content-Type': 'application/json;charset=UTF-8'
            }
          };
          let params = {
            file_list: this.checked.join(',')
          };
          this.axios
            .post(url, JSON.stringify(params), config)
            .then(response => {
              if (response.data.code === '200') {
                this.$message.success(response.data.msg);
              } else {
                this.$message.error(response.data.msg);
              }
              this.getFileList();
              this.checked = [];

              return response;
            })
            .catch(response => {
              return response;
            });
        });
      } else {
        this.$message.error('请选择要删除的文件！');
      }
    },
    getFileList() {
      let url = String.format(
        '{0}/smartToolsInterface/list',
        this.GLOBAL.MONITOR_URL
      );
      this.axios
        .get(url)
        .then(response => {
          this.fileList = response.data.list;
          return response;
        })
        .catch(response => {
          return response;
        });
    }
  }
};
</script>

<style scoped></style>
