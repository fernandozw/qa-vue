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
        <span
          >jar包列表
          <span style="font-size: 6px"
            ><font color="#ff4500"
              >(目录:/usr/local/zhuwei/javaWorkspace/)</font
            ></span
          ></span
        >
        <el-button
          :disabled="jarList.length > 0 ? false : true"
          style="float: right;margin-right: 20px"
          size="mini"
          type="warning"
          @click="deleteJar"
          >删 除
        </el-button>
      </div>
      <el-checkbox-group v-model="checked">
        <el-checkbox v-for="jar in jarList" :key="jar" :label="jar">{{
          jar
        }}</el-checkbox>
      </el-checkbox-group>
    </el-card>
  </div>
</template>

<script>
import { jar } from '../../api/common/createdata';
import { doRequest } from '../../api/common/request';

export default {
  name: 'JarPackage',
  data() {
    return {
      // 上传的url地址
      uploadUrl: this.GLOBAL.BASE_URL + jar.upload.url,
      checked: [],
      jarList: [],
      fileList: []
    };
  },
  methods: {
    getJarList() {
      const paramDict = jar.list;
      doRequest(this.GLOBAL.BASE_URL, paramDict)
        .then(response => {
          this.jarList = response.data;
          return response;
        })
        .catch(error => {
          return error;
        });
    },
    uploadSuccess(response) {
      if (response.code === '1000') {
        this.$message.success(response.msg);
      } else {
        this.$message.error(response.msg);
      }
      this.getJarList();
    },
    deleteJar() {
      if (this.checked.length > 0) {
        this.$confirm('此操作将永久删除选中的文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const paramDict = jar.delete;
          const fileList = { fileList: this.checked };
          paramDict.param = { ...paramDict.param, ...fileList };
          doRequest(this.GLOBAL.BASE_URL, paramDict)
            .then(response => {
              this.$message.success(response.data.toString());
              this.checked = [];
              this.getJarList();
              return response;
            })
            .catch(error => {
              this.getJarList();
              return error;
            });
        });
      } else {
        this.$message.error('请选择要删除的jar包！');
      }
    }
  },
  beforeMount() {
    this.getJarList();
  }
};
</script>

<style scoped></style>
