<template>
  <div>
    <el-dialog
      title=""
      :visible.sync="dialogVisible"
      width="50%"
      class="image-dialog"
      @close="close"
    >
      <div slot="title">
        <el-button type="text" size="small"
          >设置图片({{ compareType }})
        </el-button>
      </div>
      <el-upload
        ref="upload"
        action=""
        :auto-upload="false"
        :limit="imageNum"
        :on-change="beforeAvatarUpload"
        :on-exceed="masterFileMax"
        :on-preview="previewImage"
        :on-remove="removeImage"
        list-type="picture-card"
        multiple
      >
        <i class="el-icon-plus"></i>
        <div slot="tip" class="form-tips" style="margin-top: 10px">
          <el-tag type="warning" v-if="imageNum === 1"
            >单张图片大小不能超过10MB!
          </el-tag>
          <el-tag type="warning" v-else-if="imageNum === 2"
            >局部与完整混合对比模式下需要上传2张图片，第一张为局部图片，第二张为完整图片，单张图片大小不能超过
            10MB!
          </el-tag>
        </div>
      </el-upload>
      <el-dialog
        :visible.sync="showImageDialog"
        append-to-body
        class="small-big-dialog"
        width="90%"
        style="margin-left: 0px;margin-right: 0px;"
      >
        <el-image :src="dialogImage" style="width: 100%"></el-image>
      </el-dialog>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="success" @click="saveImage"
          >保 存</el-button
        >

        <el-button size="mini" type="info" @click="close">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { imageToBase64 } from '../../config/fileHandler/imgUrlToStr';

export default {
  name: 'ExpectImageDialog',
  props: {
    expectImage: {
      type: Boolean,
      default: false
    },
    // 步骤id
    stepId: {
      type: Number,
      default: null
    },
    // 对比方式
    compareType: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      dialogImage: null,
      // 原始图片列表
      fileList: [],
      // 控制浏览图片的对话框显示隐藏
      showImageDialog: false,
      dialogVisible: false,
      imageDetail: { stepId: null, completeImage: null, partImage: null },
      imageNum: 1
    };
  },
  methods: {
    // 关闭dialog弹框
    close() {
      this.$emit('listenToChildEvent', false);
    },
    // 上传图片，添加到图片列表
    beforeAvatarUpload(file, fileList) {
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        this.$message.error('单张图片大小不能超过 10MB!');
      } else {
        this.fileList = fileList;
      }
    },

    // 图片浏览
    previewImage(file) {
      this.dialogImage = file.url;
      this.showImageDialog = true;
    },
    // 限制多少张图片
    masterFileMax(files, fileList) {
      this.$message.warning(`请最多上传 ${this.imageNum} 个文件。`);
    },
    // 上传图片
    uploadImage(imageDetail) {
      let url = String.format(
        '{0}/expectImage/setExpectImage',
        this.GLOBAL.WEBUI_URL
      );
      // 指定参数格式
      let config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      };
      this.axios
        .post(
          url,
          JSON.stringify({
            imageDetail: this.imageDetail,
            compareType: this.compareType
          }),
          config
        )
        .then(response => {
          let responseCode = response.data.code;
          if (responseCode === '1000') {
            this.close();
            this.Message.success(response.data.msg);
          } else {
            this.Message.error(response.data.msg);
          }
          return response;
        })
        .catch(response => {
          return response;
        });
    },

    // 保存照片
    async saveImage() {
      if (this.compareType === 'assertCompleteImage') {
        // 完整图片对比
        if (this.fileList.length < 1) {
          this.$message.warning('请上传完整对比的图片!');
        } else {
          this.imageDetail = {
            stepId: this.stepId,
            completeImage: await imageToBase64(this.fileList[0].url),
            partImage: null
          };
          await this.uploadImage(this.imageDetail);
        }
      } else if (this.compareType === 'assertPartialImage') {
        // 局部图片对比
        if (this.fileList.length < 1) {
          this.$message.warning('请上传局部对比的图片!');
        } else {
          this.imageDetail = {
            stepId: this.stepId,
            completeImage: null,
            partImage: await imageToBase64(this.fileList[0].url)
          };
          await this.uploadImage(this.imageDetail);
        }
      } else if (this.compareType === 'assertCompleteOrPartialImage') {
        // 局部图片和完整图片对比

        if (this.fileList.length < 2) {
          this.$message.warning('请上传局部对比和完整对比的图片!');
        } else {
          this.imageDetail = {
            stepId: this.stepId,
            completeImage: await imageToBase64(this.fileList[1].url),
            partImage: await imageToBase64(this.fileList[0].url)
          };
          this.uploadImage(this.imageDetail);
        }
      }
    },
    // 删除照片
    removeImage(file, fileList) {
      this.fileList = fileList;
    },
    // 检查是否超过限制
    checkLimit() {
      const limit = this.imageNum;
      const uploadDom = this.$refs['upload'];
      if (this.fileList.length === limit) {
        uploadDom.$children[1].$el.style.display = 'none';
      } else {
        uploadDom.$children[1].$el.style.display = '';
      }
    },
    // 图片转换成url
    // imgToUrl(imgFile) {
    //   let img = this.base64ImgToFile(imgFile);
    //   let imgUrl =
    //     window.webkitURL.createObjectURL(img) ||
    //     window.URL.createObjectURL(img);
    //   let imgObj = { name: 'img', url: imgUrl };
    //   this.fileUrlList.push(imgObj);
    // },
    // base64字符串转换成图片
    base64ImgToFile(base64Str, filename = 'file') {
      const arr = base64Str.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const suffix = mime.split('/')[1];
      const bStr = atob(arr[1]);
      let n = bStr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bStr.charCodeAt(n);
      }
      return new File([u8arr], `${filename}.${suffix}`, {
        type: mime
      });
    }
  },

  watch: {
    // 监听初始时图片列表长度, 与limit相等则隐藏按钮
    fileList: {
      handler() {
        this.checkLimit();
      }
    }
  },
  created() {
    this.dialogVisible = this.expectImage;
    if (
      this.compareType === 'assertCompleteImage' ||
      this.compareType === 'assertPartialImage'
    ) {
      this.imageNum = 1;
    } else if (this.compareType === 'assertCompleteOrPartialImage') {
      this.imageNum = 2;
    }
    // this.detail();
  }
};
</script>

<style scoped></style>
