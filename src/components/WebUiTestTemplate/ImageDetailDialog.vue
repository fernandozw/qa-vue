<template>
  <div>
    <el-dialog
      title=""
      :visible.sync="dialogVisible"
      width="40%"
      class="image-dialog"
      @close="close"
    >
      <div slot="title">
        <el-button
          v-if="isSetImage"
          type="success"
          icon="el-icon-check"
          circle
          size="mini"
        ></el-button>
        <el-button
          v-else
          type="danger"
          icon="el-icon-close"
          circle
          size="mini"
        ></el-button>
        <el-button type="text" size="small"
          >查看图片({{ compareType }})</el-button
        >
      </div>

      <el-upload
        :disabled="disableDeleteBtn"
        ref="upload"
        action=""
        :auto-upload="false"
        :limit="imageNum"
        :on-exceed="masterFileMax"
        :on-preview="previewImage"
        :file-list="fileList"
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
        <el-button size="mini" type="info" @click="close">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ImageDetailDialog',
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
      // 隐藏删除按钮
      disableDeleteBtn: true,
      dialogImage: null,
      // 原始图片列表
      fileList: [],
      showImageDialog: false, // 控制浏览图片的对话框显示隐藏
      dialogVisible: false,
      imageDetail: { stepId: null, completeImage: null, partImage: null },
      isSetImage: false,
      imageNum: 1
    };
  },
  methods: {
    // 关闭dialog弹框
    close() {
      this.$emit('listenToChildEvent', false);
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

    // 获取图片
    detail() {
      let url = String.format(
        '{0}/expectImage/getImage?stepId={1}',
        this.GLOBAL.WEBUI_URL,
        this.stepId
      );
      this.axios
        .get(url)
        .then(response => {
          if (response.data.data != null) {
            this.isSetImage = true;
            if (response.data.data.partImage !== null) {
              this.imgToUrl(response.data.data.partImage);
            }
            if (response.data.data.completeImage !== null) {
              this.imgToUrl(response.data.data.completeImage);
            }
          }
          return response;
        })
        .catch(response => {
          return response;
        });
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
    imgToUrl(imgFile) {
      let img = this.base64ImgToFile(imgFile);
      let imgUrl =
        window.webkitURL.createObjectURL(img) ||
        window.URL.createObjectURL(img);
      let imgObj = { name: 'img', url: imgUrl };
      this.fileList.push(imgObj);
    },
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
    } else if (this.compareType === 'assertCompleteAndPartialImage') {
      this.imageNum = 2;
    }
    this.detail();
  }
};
</script>

<style scoped></style>
