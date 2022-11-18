<template>
  <div
    v-loading="loading"
    element-loading-text="拼命执行中,请稍后～～～"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <el-card class="box-card" style="margin-top: -30px">
      <el-tag type="warning" size="small">选择方法</el-tag>
      <el-select
        v-model="methodValue"
        placeholder="请选择方法"
        size="mini"
        clearable
        @change="getParamList"
      >
        <el-option
          v-for="(item, index) in methodDict.methodList"
          :key="item.methodName"
          :label="item.methodLabel"
          :value="index + ':' + item.methodName"
        />
      </el-select>
      <el-button
        :disabled="methodValue !== '' && methodValue !== null ? false : true"
        type="primary"
        size="mini"
        @click="executeMethod"
        >执行
      </el-button>
    </el-card>
    <el-card class="box-card" shadow="always" color="#DCDFE6">
      <el-tag type="danger" size="small">请求参数</el-tag>
      <el-divider />
      <el-form
        ref="form"
        :model="paramDict"
        label-width="100px"
        size="mini"
        label-position="left"
      >
        <el-form-item
          v-for="(item, index) in paramList"
          :key="index"
          :label="item.paramName + ':'"
        >
          <el-col :span="11">
            <div v-if="item.paramWidget === 'yyyyMMdd'" class="block">
              <el-date-picker
                v-model="paramDict[index]"
                :placeholder="item.paramMark"
                :picker-options="pickerOptionsDay"
                align="right"
                type="date"
                value-format="yyyyMMdd"
                @input="change"
              />
            </div>
            <div v-else-if="item.paramWidget === 'yyyy-MM-dd'" class="block">
              <el-date-picker
                v-model="paramDict[index]"
                :placeholder="item.paramMark"
                :picker-options="pickerOptionsDay"
                align="right"
                type="date"
                value-format="yyyy-MM-dd"
                @input="change"
              />
            </div>
            <div
              v-else-if="item.paramWidget === 'yyyy-MM-dd HH:mm:ss'"
              class="block"
            >
              <el-date-picker
                v-model="paramDict[index]"
                :placeholder="item.paramMark"
                :picker-options="pickerOptions1"
                align="right"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                @input="change"
              />
            </div>
            <div v-else-if="item.paramWidget === 'yyyyMM'" class="block">
              <el-date-picker
                v-model="paramDict[index]"
                :placeholder="item.paramMark"
                align="right"
                type="month"
                value-format="yyyyMM"
                @input="change"
              />
            </div>
            <div v-else-if="item.paramWidget === 'yyyy'" class="block">
              <el-date-picker
                v-model="paramDict[index]"
                :placeholder="item.paramMark"
                align="right"
                type="year"
                value-format="yyyy"
                @input="change"
              />
            </div>
            <div v-else>
              <el-input
                v-model="paramDict[index]"
                :placeholder="item.paramMark"
                size="mini"
                clearable
                @input="change"
              />
            </div>
          </el-col>
          <el-col :span="11">
            <span style="margin-left: 5px"
              ><font color="#F56C6C">{{
                '参数类型: ' + item.paramType
              }}</font></span
            >
          </el-col>
        </el-form-item>
      </el-form>
      <el-divider />
      <el-tag type="success" size="small">返回结果</el-tag>
      <el-divider />
      <codemirror
        ref="cmEditor"
        v-model="codeMirror.code"
        :options="codeMirror.cmOptions"
        class="codemirror"
      />
    </el-card>
  </div>
</template>

<script>
import { param, execute } from '../../api/common/createdata';
import { doRequest } from '../../api/common/request';
import 'codemirror/mode/python/python';
import 'codemirror/theme/monokai.css';
import { pickerOptionsDay, pickerOptions1 } from '../../api/common/datetime';

export default {
  name: 'ExecuteMethod',
  props: {
    methodDict: { type: Object, default: null },
    scriptId: { type: Number, default: null }
  },
  data() {
    return {
      week: '',
      pickerOptionsDay: pickerOptionsDay,
      pickerOptions1: pickerOptions1,
      methodValue: null,
      paramList: [],
      paramDict: {},
      methodName: '',
      loading: false,
      codeMirror: {
        code: '',
        cmOptions: {
          tabSize: 4,
          mode: 'python',
          theme: 'monokai',
          lineNumbers: true,
          lineWrapping: true, // 自动换行
          line: true,
          // 是否可编辑
          readOnly: 'false'
        }
      }
    };
  },
  methods: {
    // 获取参数列表
    getParamList() {
      this.codeMirror.code = '';
      this.paramList = [];
      this.paramDict = {};
      const paramDict = JSON.parse(JSON.stringify(param.getParams));
      if (this.methodValue !== '' && this.methodValue !== null) {
        paramDict.param = this.methodDict.methodList[
          parseInt(this.methodValue.substring(0, this.methodValue.indexOf(':')))
        ];
        doRequest(this.GLOBAL.BASE_URL, paramDict).then(response => {
          this.paramList = response.data.paramList;
          this.methodName = response.data.methodName;
          this.handleValue();
        });
      } else {
        this.paramList = [];
      }
    },
    init() {
      this.paramList = [];
      this.methodValue = null;
      this.paramDict = {};
      this.codeMirror.code = '';
    },
    // 执行方法
    executeMethod() {
      this.loading = true;
      this.handleParam();
      this.paramDict.scriptId = this.scriptId;
      this.paramDict.method = this.methodName;
      this.paramDict.param = this.handleParam();
      const paramDict = JSON.parse(JSON.stringify(execute.execute));
      paramDict.param = { ...paramDict.param, ...this.paramDict };
      doRequest(this.GLOBAL.BASE_URL, paramDict).then(response => {
        if (response.code === '1000') {
          this.$message.success('执行成功!');
        } else {
          this.$message.error('执行失败!');
        }
        this.loading = false;
        this.codeMirror.code = JSON.stringify(response, null, 2);
      });
    },
    // 处理参数
    handleParam() {
      const list = [];
      for (const item in this.paramList) {
        const type = this.paramList[item]['paramType'];
        let sourceValue = this.paramDict[item];
        let targetValue = sourceValue;
        if (type === 'class java.lang.Integer') {
          targetValue = parseInt(sourceValue);
        } else if (type === 'interface java.util.List') {
          if (sourceValue.startsWith('[') && sourceValue.endsWith(']')) {
            sourceValue = sourceValue.substring(
              sourceValue.indexOf('[') + 1,
              sourceValue.lastIndexOf(']')
            );
          }
          targetValue = sourceValue.split(',');
        } else if (type === 'interface java.util.Map') {
          if (sourceValue.startsWith('[') && sourceValue.endsWith(']')) {
            sourceValue = JSON.parse(sourceValue);
          }
          targetValue = sourceValue.split(',');
        }
        list.push(targetValue);
      }
      return list;
    },
    // 处理默认值
    handleValue() {
      for (const item in this.paramList) {
        const defaultValue = this.paramList[item]['paramValue'];
        if (defaultValue !== '' && defaultValue !== null) {
          this.paramDict[item] = defaultValue;
        }
      }
    },
    // 强制刷新输入框
    change(e) {
      this.$forceUpdate();
    }
  }
};
</script>

<style scoped></style>
