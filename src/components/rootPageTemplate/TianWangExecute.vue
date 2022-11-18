<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane label="重跑天网">
        <div style="margin:10px">
          <div>
            <i class="el-icon-warning-outline">
              重跑仅使用上一次生成的case参数</i
            >
          </div>
          <el-form class="demo-form-inline">
            <el-form-item label="模型类型">
              <el-select v-model="modelType" placeholder="模型类型">
                <el-option
                  v-for="item in modelTypeOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="用例范围">
              <el-select v-model="markers" placeholder="用例范围">
                <el-option
                  v-for="item in markersOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button
                style="float: left"
                type="primary"
                @click="executeRobot"
                >执行
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="重新运行">
        <div style="margin:10px">
          <i class="el-icon-warning-outline">
            此操作会重新生成case参数，会与上次运行所用参数不同</i
          >
          <el-form class="demo-form-inline">
            <el-form-item label="模型类型">
              <el-select v-model="modelType" placeholder="模型类型">
                <el-option
                  v-for="item in modelTypeOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="用例范围">
              <el-select v-model="markers" placeholder="用例范围">
                <el-option
                  v-for="item in markersOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button style="float: left" type="primary" @click="executeRun"
                >执行
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {
  rebotCaseRequest,
  runCaseReuquest
} from '../../api/tianwang/executeCase';

export default {
  name: 'TianWangExecute',
  data() {
    return {
      markers: 'event_single_quota',
      modelType: 'event',
      modelTypeOption: [
        {
          value: 'event',
          label: '事件分析'
        },
        {
          value: 'retention',
          label: '留存分析',
          disabled: true
        },
        {
          value: 'funnel',
          label: '漏斗分析',
          disabled: true
        },
        {
          value: 'distribution',
          label: '分布分析',
          disabled: true
        },
        {
          value: 'path',
          label: '路径分析',
          disabled: true
        },
        {
          value: 'interval',
          label: '间隔分析',
          disabled: true
        },
        {
          value: 'user-prop',
          label: '属性分析',
          disabled: true
        }
      ],
      markersOption: [
        {
          value: 'event_all',
          label: '事件-全部标签类型'
        },
        {
          value: 'event_single_quota',
          label: '事件-单指标'
        },
        {
          value: 'event_split',
          label: '事件-多事件、属性拆分'
        }
      ]
    };
  },
  methods: {
    executeRobot() {
      rebotCaseRequest(this.markers, this.modelType)
        .then(response => {
          console.log(response);
          if (response.msg === 'Success') {
            this.$message({
              message: '正在重跑行动,请稍后查看。',
              type: 'success'
            });
          } else {
            this.$message({
              message: '执行失败！请联系春利小姐姐',
              type: 'error'
            });
          }
          return response;
        })
        .catch(error => {
          console.log(error);
          return error;
        });
    },
    executeRun() {
      runCaseReuquest(this.markers, this.modelType)
        .then(response => {
          console.log(response);
          if (response.msg === 'Success') {
            this.$message({
              message: '正在重新运行天网,请稍后查看。',
              type: 'success'
            });
          } else {
            this.$message({
              message: '运行失败！请联系春利小姐姐',
              type: 'error'
            });
          }
          return response;
        })
        .catch(error => {
          console.log(error);
          return error;
        });
    }
  }
};
</script>

<style scoped>
.text {
  font-size: 12px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}

.clearfix:after {
  clear: both;
}

.box-card {
  width: 480px;
  margin: 5px;
}

.el-icon-warning-outline {
  font-size: xx-small;
  margin-bottom: 30px;
  color: grey;
}
</style>
