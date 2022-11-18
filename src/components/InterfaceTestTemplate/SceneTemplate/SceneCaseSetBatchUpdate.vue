<template>
  <div>
    <el-dialog
      title="批量更新"
      :visible.sync="copyVisible"
      width="80%"
      @close="clearCopyPage"
    >
      <el-card class="box-card">
        <el-form ref="copyForm" :model="copyForm" :rules="rules" :inline="true">
          <el-row :gutter="40">
            <el-col :span="12">
              <el-form-item label="所属项目" prop="project_id">
                <el-select
                  v-model="copyForm.project_id"
                  clearable
                  placeholder="请选择"
                  filterable
                  size="mini"
                  @change="getConditionsForCopy"
                  style="width:200px"
                >
                  <el-option
                    v-for="item in copyProjectList"
                    :key="item.label"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="源版本" prop="source_version">
                <el-select
                  v-model="copyForm.source_version"
                  clearable
                  placeholder="请选择"
                  filterable
                  size="mini"
                  @change="$forceUpdate()"
                  @focus="checkParentForCopy"
                  style="width:200px"
                >
                  <el-option
                    v-for="item in copyVersionList"
                    :key="item.label"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <div style="text-align: center">
            <font color="#ff4500">
              注意事项:「所属项目」「源版本」字段是批量更新场景功能确定源版本(基准版本)的前提条件,请认真选择!
            </font>
          </div>
          <el-divider></el-divider>
          <el-row :gutter="40">
            <el-col :span="12">
              <el-form-item label="名称前缀" prop="pre_fix">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  placeholder="请输入"
                  v-model="copyForm.pre_fix"
                  clearable
                  @change="$forceUpdate()"
                  size="mini"
                  style="width:200px"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="创建人" prop="create_person">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  placeholder="必填项:创建人"
                  v-model="copyForm.create_person"
                  clearable
                  @change="$forceUpdate()"
                  size="mini"
                  style="width:200px"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="40">
            <el-col :span="8">
              <el-form-item label="目标版本" prop="project_version">
                <el-select
                  v-model="copyForm.project_version"
                  clearable
                  placeholder="请选择"
                  filterable
                  size="mini"
                  @change="$forceUpdate()"
                  @focus="checkParentForCopy"
                  style="width:150px"
                >
                  <el-option
                    v-for="item in copyVersionList"
                    :key="item.label"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="3" :pull="1">
              <span>host替换</span>
            </el-col>
            <el-col :span="1" :pull="2">
              <el-checkbox
                v-model="copyReplaceChecked"
                @change="handleCopyReplaceCheck"
                >{{ copyReplaceChecked ? '是' : '否' }}
              </el-checkbox>
            </el-col>
            <!--<el-col :span="3" :pull="1">-->
            <!--<span>替换配置: </span>-->
            <!--</el-col>-->
            <!--<el-col :span="8" :pull="2">-->
            <!--<el-input-->
            <!--type="textarea"-->
            <!--:autosize="{ minRows: 2, maxRows: 3 }"-->
            <!--placeholder='必须为Json格式,注意,python中的Json格式的key一定要使用双引号,固定格式:{"1":"4","2":"5","3":"6"},key为旧host的id,value为新host的id,多个key-value代表需要替换多个host'-->
            <!--v-model="copyForm.replace_host_config"-->
            <!--clearable-->
            <!--@change="$forceUpdate()"-->
            <!--size="mini"-->
            <!--style="width:350px"-->
            <!--&gt;-->
            <!--</el-input>-->
            <!--</el-col>-->
            <el-col :span="2" :pull="1">
              <span>源host</span>
            </el-col>
            <el-col :span="10" :pull="1">
              <el-select
                v-model="sourceHost"
                multiple
                placeholder="请选择"
                style="width:450px"
              >
                <el-option
                  v-for="item in hostList"
                  :key="item.value"
                  :label="item.label + ':' + item.address"
                  :value="item.value + ''"
                >
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <el-col :span="3">
              <span>目标host</span>
            </el-col>
            <el-col :span="10" :pull="1">
              <el-select
                v-model="targetHost"
                multiple
                placeholder="请选择"
                style="width:450px"
              >
                <el-option
                  v-for="item in hostList"
                  :key="item.value"
                  :label="item.label + ':' + item.address"
                  :value="item.value + ''"
                >
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <div style="text-align: center;margin-top: 20px">
            <font color="#ff4500">
              注意事项:「名称前缀」「创建人」「目标版本」「host替换」「源host」「目标host」字段是批量更新场景功能目标版本(更新后的版本)的基本信息,请认真填写!
            </font>
          </div>
        </el-form>
      </el-card>

      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="clearCopyPage">取 消</el-button>
        <el-button
          size="mini"
          type="primary"
          @click="batchUpdateScene('copyForm')"
          >确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import cookies from 'vue-cookies';

export default {
  name: 'SceneCaseSetBatchUpdate',
  data() {
    return {
      // 源host
      sourceHost: [],
      // 目标host
      targetHost: [],
      // host下拉列表
      hostList: [],
      copyProjectList: [],
      copyVersionList: [],
      copyForm: {
        pre_fix: '',
        scene_type: 0,
        project_id: '',
        source_version: '',
        project_version: '',
        create_person:
          cookies.get('username') === null ? '' : cookies.get('username'),
        is_replace_host: 1,
        replace_host_config: ''
      },
      copyReplaceChecked: true,
      rules: {
        source_version: [{ required: true, message: '源版本不能为空' }],
        project_id: [{ required: true, message: '所属项目不能为空' }],
        create_person: [{ required: true, message: '创建人不能为空' }]
      },
      copyVisible: false
    };
  },
  methods: {
    // 获取host下拉列表
    getHostList() {
      let url = String.format(
        '{0}/hostInterface/getHostList',
        this.GLOBAL.MONITOR_URL
      );
      this.axios
        .get(url)
        .then(response => {
          this.hostList = response.data.hostList;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 处理源host与目标host
    handleHost() {
      let result = {};
      let sourceLength = this.sourceHost.length;
      let targetLength = this.targetHost.length;
      let smallList = [];
      let bigList = [];
      if (sourceLength < targetLength || sourceLength === targetLength) {
        smallList = this.sourceHost;
        bigList = this.targetHost;
      } else {
        smallList = this.targetHost;
        bigList = this.sourceHost;
      }
      for (let i = 0; i < smallList.length; i++) {
        let key = String(smallList[i]);
        let value = bigList[i];
        result[key] = value;
      }
      return JSON.stringify(result);
    },
    // 批量更新场景
    batchUpdateScene(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (
            // this.copyReplaceChecked &&
            // this.copyForm.replace_host_config === ''
            this.copyReplaceChecked &&
            (this.sourceHost.length === 0 || this.targetHost.length === 0)
          ) {
            this.$message.error(
              // '警告:勾选替换host后,必须输入host替换配置信息！'
              '警告:勾选替换host后,「源host」「目标host」不能为空！'
            );
          } else {
            if (
              this.copyReplaceChecked &&
              this.sourceHost.length !== this.targetHost.length
            ) {
              this.Message.error(
                '警告:勾选替换host后,「源host」「目标host」包含的host数量必须一致！'
              );
            } else {
              this.copyForm.replace_host_config = this.handleHost();
              const loading = this.$loading({
                lock: true,
                text: '拼命更新中,请喝口水再来吧!(1分钟后自动关闭)',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
              });
              setTimeout(() => {
                loading.close();
                this.clearCopyPage();
              }, 60000);
              let url = String.format(
                '{0}/sceneInterface/batchEditScene',
                this.GLOBAL.MONITOR_URL
              );
              // 指定参数格式
              let config = {
                headers: {
                  'Content-Type': 'application/json;charset=UTF-8'
                }
              };
              this.axios
                .post(url, JSON.stringify(this.copyForm), config)
                .then(response => {
                  if (response.data.code === '200') {
                    this.clearCopyPage();
                    this.$message.success(response.data.msg);
                  } else {
                    this.$message.error(response.msg);
                  }
                  this.$emit('search');
                  loading.close();
                  return response;
                })
                .catch(response => {
                  loading.close();
                  return response;
                });
            }
          }
        }
      });
    },
    // 打开批量更新弹窗
    openBatchUpdateDialog() {
      this.getHostList();
      this.copyVisible = true;
      let url = String.format(
        '{0}/sceneInterface/sceneConditions?project_id={1}',
        this.GLOBAL.MONITOR_URL,
        this.copyForm.project_id
      );
      this.axios
        .get(url)
        .then(response => {
          this.copyProjectList = response.data.data.projectList;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 获取批量更新弹窗的查询条件
    getConditionsForCopy() {
      this.copyForm.source_version = '';
      this.copyForm.project_version = '';
      let url = String.format(
        '{0}/sceneInterface/sceneConditions?project_id={1}',
        this.GLOBAL.MONITOR_URL,
        this.copyForm.project_id
      );
      this.axios
        .get(url)
        .then(response => {
          this.copyProjectList = response.data.data.projectList;
          this.copyVersionList = response.data.data.versionList;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 校验所属项目是否被选中
    checkParentForCopy() {
      if (this.copyForm.project_id === '') {
        this.$message({
          type: 'error',
          message: '请先选择所属项目!'
        });
      }
    },
    // 关闭批量更新弹窗
    clearCopyPage() {
      this.copyVisible = false;
      this.$refs['copyForm'].resetFields();
      this.copyReplaceChecked = true;
      this.sourceHost = [];
      this.targetHost = [];
      this.host = [];
    },
    // 处理批量复制弹窗host替换状态
    handleCopyReplaceCheck() {
      if (this.copyReplaceChecked) {
        this.copyForm.is_replace_host = 1;
      } else {
        this.copyForm.is_replace_host = 0;
      }
    }
  }
};
</script>

<style scoped>
.el-row {
  line-height: 40px;
  margin-top: 10px;
}
</style>
