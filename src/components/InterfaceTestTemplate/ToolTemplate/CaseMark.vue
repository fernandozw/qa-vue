<template>
  <div>
    <el-button type="danger" size="mini" @click="replaceMark"
      >动态参数替换</el-button
    >
    <el-form ref="markForm" :model="markForm" :inline="true">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item
            label="动态参数旧-新Map:(key为旧占位符,value为新占位符)"
          >
            <code-mirror
              v-model="markForm.replace_dict"
              :options="cmOptions"
              class="codemirror"
              style="width: 550px;height: 100%;"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="参数前缀:(key为旧占位符,value为参数前缀)">
            <code-mirror
              v-model="markForm.pre_fix_dict"
              :options="cmOptions"
              class="codemirror"
              style="width: 550px;height: 100%;"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="参数后缀:(key为旧占位符,value为参数后缀)">
            <code-mirror
              v-model="markForm.after_fix_dict"
              :options="cmOptions"
              class="codemirror"
              style="width: 550px;height: 100%;"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { codemirror } from 'vue-codemirror';
import 'codemirror/mode/javascript/javascript'; // 这js模式必须引入的
import 'codemirror/addon/selection/active-line'; // 光标行背景高亮，配置里面也需要styleActiveLine设置为true
import 'codemirror/keymap/sublime'; // sublime编辑器效果
import 'codemirror/mode/css/css';
import 'codemirror/theme/monokai.css'; // 编辑器主题样式，配置里面theme需要设置monokai
export default {
  name: 'CaseMark',
  components: {
    codeMirror: codemirror
  },
  data() {
    return {
      cmOptions: {
        tabSize: 2,
        mode: 'application/json',
        theme: 'monokai',
        lineNumbers: true,
        line: true,
        // 代码折叠
        gutters: ['CodeMirror-foldgutter'],
        // 软换行
        lineWrapping: true,
        // 光标背景高亮
        styleActiveLine: true
      },

      markForm: {
        replace_dict: '',
        pre_fix_dict: '',
        after_fix_dict: ''
      }
    };
  },
  methods: {
    reset() {
      this.markForm = {
        replace_dict: '',
        pre_fix_dict: '',
        after_fix_dict: ''
      };
    },
    replaceMark() {
      if (
        this.isJSON(this.markForm.replace_dict) &&
        this.isJSON(this.markForm.pre_fix_dict) &&
        this.isJSON(this.markForm.after_fix_dict)
      ) {
        this.$confirm(
          '此操作将永久替换引用了这些key的参数和请求头, 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          let url = String.format(
            '{0}/smartToolsInterface/replaceMark',
            this.GLOBAL.MONITOR_URL
          );
          // 指定参数格式
          let config = {
            headers: {
              'Content-Type': 'application/json;charset=UTF-8'
            }
          };
          this.axios
            .post(url, JSON.stringify(this.markForm), config)
            .then(response => {
              if (response.data.code === '200') {
                this.$message.success(response.data.msg);
              } else {
                this.$message.error(response.data.msg);
              }
              return response;
            })
            .catch(response => {
              return response;
            });
        });
      } else {
        this.$message({
          type: 'error',
          message: '文本内容必须为Json!'
        });
      }
    },

    isJSON(str) {
      if (typeof str === 'string') {
        try {
          let obj = JSON.parse(str);
          if (typeof obj === 'object' && obj) {
            return true;
          } else {
            return false;
          }
        } catch (e) {
          return false;
        }
      }
    }
  }
};
</script>

<style scoped></style>
