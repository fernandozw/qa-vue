<script src="../../../build/webpack.prod.conf.js"></script>
<template>
  <div>
    <el-tabs type="border-card" v-model="activeName" @tab-click="listPackage">
      <el-tab-pane label="导出" name="export">
        <div>
          <el-container>
            <el-header height="100px">
              <el-steps :active="stepActive" align-center>
                <el-step
                  title="步骤1"
                  description="选择需要导出的环境"
                  icon="el-icon-edit"
                ></el-step>
                <el-step
                  title="步骤2"
                  description="导出中..."
                  icon="el-icon-upload"
                ></el-step>
                <el-step
                  title="步骤3"
                  description="导出完成!"
                  icon="el-icon-picture"
                ></el-step>
              </el-steps>
            </el-header>
            <el-main v-if="stepActive === 1" v-loading="envLoading">
              <el-row>
                <el-col :span="10"><span>请选择环境类型：</span></el-col>
                <el-col :span="14">
                  <el-select
                    v-model="envTypeValue"
                    filterable
                    allow-create
                    default-first-option
                    placeholder="请选择环境类型"
                    @change="selectEnvType"
                  >
                    <el-option
                      v-for="item in envTypeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  <span>请选择指定环境：</span>
                </el-col>
                <el-col :span="14">
                  <el-select
                    v-model="envValue"
                    filterable
                    allow-create
                    default-first-option
                    placeholder="请选择指定环境"
                    :disabled="envDisable"
                    style="width: 60%"
                    @change="selecEnv"
                  >
                    <el-option
                      v-for="item in envOptions"
                      :key="item.id"
                      :label="item.des + ' | ' + item.port"
                      :value="item.id"
                      :disabled="envDisable"
                    >
                      <label style="float: left">{{ item.des }}</label>
                      <label style="float: right; color: #8492a6">
                        port: {{ item.port }}</label
                      >
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  <span>请选择指定项目：</span>
                </el-col>
                <el-col :span="14">
                  <el-select
                    v-model="projectValue"
                    filterable
                    allow-create
                    default-first-option
                    style="width: 60%"
                    placeholder="请选择指定项目"
                    :disabled="projectDisable"
                  >
                    <el-option
                      v-for="item in projectOptions"
                      :key="item.projectid"
                      :label="item.projectName + ' | ' + item.projectid"
                      :value="item.projectid"
                      :disabled="projectDisable"
                    >
                      <label style="float: left"> {{ item.projectName }}</label>
                      <label style="float: right; color: #8492a6">
                        项目ID： {{ item.projectid }}</label
                      >
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
            </el-main>
            <el-main v-if="stepActive === 2" v-loading="envLoading">
              <el-row>
                <el-col
                  :span="24"
                  style="display: flex;justify-content: center;align-items: center"
                >
                  <el-table :data="tableData" style="margin: 20px 80px">
                    <el-table-column prop="envType" label="环境类型">
                    </el-table-column>
                    <el-table-column prop="env" label="环境域名">
                    </el-table-column>
                    <el-table-column
                      prop="project"
                      label="项目详情"
                      style="white-space: pre-line"
                    >
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
              <el-dialog center :visible.sync="dialogVisible">
                <loadingSvg></loadingSvg>
                <el-row>
                  <el-col
                    :span="22"
                    style="text-align: center;margin: 50px 20px 50px 20px"
                  >
                    <el-progress
                      :percentage="percentage"
                      :color="customColors"
                    ></el-progress>
                    <div style="text-align: center;margin: 15px 0">
                      导出中，进度...
                    </div>
                  </el-col>
                </el-row>
              </el-dialog>
            </el-main>
            <el-main v-if="stepActive === 3">
              <div
                style="align-items: center;display: flex;flex-direction: column"
              >
                <el-image style="width: 300px" :src="pic"></el-image>
                <span style="margin: 50px">导出成功 !</span>
                <el-button type="success" @click="goUpload">前往导入</el-button>
              </div>
            </el-main>
            <el-footer>
              <el-button-group>
                <el-button
                  v-if="stepActive > 1"
                  type="primary"
                  round
                  size="small"
                  :disabled="goBackButtonDisable"
                  @click="goBack"
                  >上一步</el-button
                >
                <el-button
                  v-if="stepActive < 3"
                  type="primary"
                  round
                  size="small"
                  :disabled="buttonDisable"
                  @click="goNext"
                  >下一步</el-button
                >
              </el-button-group>
            </el-footer>
          </el-container>
        </div>
      </el-tab-pane>
      <el-tab-pane label="导入" name="upload">
        <div>
          <el-container>
            <el-header height="100px">
              <el-steps :active="uploadStep" align-center>
                <el-step
                  title="步骤1"
                  description="选择需要导入的包"
                  icon="el-icon-edit"
                ></el-step>
                <el-step
                  title="步骤2"
                  description="选择需要导入的环境"
                  icon="el-icon-upload"
                ></el-step>
                <el-step
                  title="步骤3"
                  description="导入完成"
                  icon="el-icon-picture"
                ></el-step>
              </el-steps>
            </el-header>
            <el-main v-if="uploadStep === 1" v-loading="envLoading">
              <div style="font-size: large;margin: 25px 80px">
                请选择需要导入的包：
              </div>
              <div style="margin: 10px 50px;min-height: 300px">
                <el-row type="flex" v-if="packageList">
                  <el-col
                    :span="8"
                    v-for="(item, index) in packageList"
                    :key="index"
                  >
                    <el-card shadow="always" style="margin: 5px">
                      <el-row :gutter="20">
                        <el-col :span="12">
                          <div class="card-env-title">环境分类</div>
                        </el-col>
                        <el-col :span="8">
                          <div class="card-env-content">{{ item.envType }}</div>
                        </el-col>
                      </el-row>
                      <el-row :gutter="20">
                        <el-col :span="12">
                          <div class="card-env-title">项目 ID</div>
                        </el-col>
                        <el-col :span="8">
                          <div class="card-env-content">
                            {{ item.projectId }}
                          </div>
                        </el-col>
                      </el-row>
                      <el-row :gutter="20" v-if="item.dockerPort">
                        <el-col :span="12">
                          <div class="card-env-title">原Docker端口号</div>
                        </el-col>
                        <el-col :span="8">
                          <div class="card-env-content">
                            {{ item.dockerPort }}
                          </div>
                        </el-col>
                      </el-row>
                      <el-checkbox
                        style="float: right;margin-bottom: 10px"
                        :key="index"
                        @change="checked => handleCheckbox(checked, index)"
                        :disabled="checkboxDisable && selectEnv !== index"
                        :checked="selectEnv === index"
                      ></el-checkbox>
                    </el-card>
                  </el-col>
                </el-row>
              </div>
            </el-main>
            <el-main v-if="uploadStep === 2" v-loading="envLoading">
              <el-row>
                <el-col :span="10"><span>请选择环境类型：</span></el-col>
                <el-col :span="14">
                  <el-select
                    v-model="envTypeValue"
                    filterable
                    allow-create
                    default-first-option
                    placeholder="请选择环境类型"
                    @change="selectEnvType"
                  >
                    <el-option
                      v-for="item in envTypeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  <span>请选择指定环境：</span>
                </el-col>
                <el-col :span="14">
                  <el-select
                    v-model="envValue"
                    filterable
                    allow-create
                    default-first-option
                    placeholder="请选择指定环境"
                    :disabled="envDisable"
                    style="width: 60%"
                    @change="selecEnv"
                  >
                    <el-option
                      v-for="item in envOptions"
                      :key="item.id"
                      :label="item.des + ' | ' + item.port"
                      :value="item.id"
                      :disabled="envDisable"
                    >
                      <label style="float: left">{{ item.des }}</label>
                      <label style="float: right; color: #8492a6">
                        port: {{ item.port }}</label
                      >
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
              <el-dialog center :visible.sync="dialogVisible">
                <loadingSvg></loadingSvg>
                <el-row>
                  <el-col
                    :span="22"
                    style="text-align: center;margin: 50px 20px 50px 20px"
                  >
                    <el-progress
                      :percentage="percentage"
                      :color="customColors"
                    ></el-progress>
                    <div style="text-align: center;margin: 15px 0">
                      导入中，进度...
                    </div>
                  </el-col>
                </el-row>
              </el-dialog>
            </el-main>
            <el-main v-if="uploadStep === 3">
              <div
                style="align-items: center;display: flex;flex-direction: column"
              >
                <el-image style="width: 300px" :src="pic"></el-image>
                <span style="margin: 50px"
                  ><div v-if="envTypeValue">
                    环境类型：{{ envTypeValue }} 项目ID：
                    {{ selectedProjectId }}
                  </div>
                  导入成功 !</span
                >
              </div>
            </el-main>
            <el-footer>
              <el-button-group>
                <el-button
                  v-if="uploadStep > 1"
                  type="primary"
                  round
                  size="small"
                  :disabled="goBackButtonDisable"
                  @click="uploadGoBack"
                  >上一步</el-button
                >
                <el-button
                  v-if="uploadStep < 3"
                  type="primary"
                  round
                  size="small"
                  :disabled="uploadButtonDisable"
                  @click="uploadGoNext"
                  >下一步</el-button
                >
              </el-button-group>
            </el-footer>
          </el-container>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getRancherEnv, getServiceHost } from '../../api/dataTrans/rancher';
import {
  exportApi,
  getProjectInfo,
  packageList,
  uploadApi
} from '../../api/dataTrans/data';
import LoadingSvg from '@/components/publicTemplate/LoadingSvg.vue';

export default {
  name: 'DataTrans',
  components: {
    loadingSvg: LoadingSvg
  },
  data() {
    return {
      activeName: 'export',
      pic:
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fbpic.588ku.com%2Felement_origin_min_pic%2F16%2F11%2F23%2F213e7941e6e2e53b5bc90527759e3997.jpg&refer=http%3A%2F%2Fbpic.588ku.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1666318954&t=d094c502fffb80604071d7bcc306c23e',
      envTypeOptions: [
        {
          value: 'DOCKER',
          label: 'DOCKER'
        },
        {
          value: 'TEST',
          label: 'TEST'
        },
        {
          value: 'PREVIEW',
          label: 'PREVIEW'
        }
      ],
      envOptions: [],
      projectOptions: [],
      selectEnv: -1,
      packageList: [],
      envValue: null,
      commonEnvValue: null,
      envTypeValue: null,
      projectValue: null,
      buttonDisable: true,
      checkboxDisable: false,
      uploadButtonDisable: true,
      goBackButtonDisable: false,
      envDisable: true,
      projectDisable: true,
      stepActive: 1,
      uploadStep: 1,
      envLoading: false,
      dialogVisible: false,
      tableData: [],
      filePath: null,
      selectedProjectId: null,
      percentage: 0,
      customColors: [
        { color: '#f56c6c', percentage: 20 },
        { color: '#e6a23c', percentage: 40 },
        { color: '#5cb87a', percentage: 60 },
        { color: '#1989fa', percentage: 80 },
        { color: '#6f7ad3', percentage: 100 }
      ]
    };
  },
  mounted() {
    clearInterval(progressMount);
    let progressMount = setInterval(() => {
      this.percentageAdd();
    }, Math.random() * 2000);
  },
  methods: {
    handleCheckbox(val, index) {
      if (val) {
        this.selectEnv = index;
        this.checkboxDisable = true;
      } else {
        this.selectEnv = -1;
        this.checkboxDisable = false;
      }
    },
    percentageAdd() {
      if (this.percentage > 0 && this.percentage <= 90) {
        this.percentage += 1;
      }
    },
    selectEnvType() {
      this.envValue = null;
      this.projectValue = null;
      switch (this.envTypeValue) {
        case 'DOCKER':
          this.envLoading = true;
          getRancherEnv().then(response => {
            console.log(response);
            let dockerList = response.data
              .filter(
                item =>
                  item.name.indexOf('ta-') !== -1 &&
                  item.healthState !== 'unhealthy'
              )
              .map(item => {
                return {
                  name: item.name,
                  des: item.description,
                  port: item.dockerCompose.match(/- (\S*):8996/)[1],
                  commonPort: item.dockerCompose.match(/- (\S*):8992/)[1],
                  id: item.id
                };
              });
            this.envLoading = false;
            if (dockerList) {
              this.envOptions = dockerList.sort(item => item.port);
            }
          });
          break;
        case 'TEST':
          this.envValue = 'ta-test.thinkingdata.cn';
          this.envLoading = true;
          getProjectInfo(
            `http://47.100.51.77:8996`,
            'pangshengfang',
            'aiggie01'
          ).then(response => {
            this.envLoading = false;
            if (response) {
              // eslint-disable-next-line no-eval
              this.projectOptions = eval(response).sort(item => item.projectid);
            }
          });
          break;
        case 'PREVIEW':
          this.envValue = 'ta-preview.thinkingdata.cn';
          getProjectInfo(
            `http://39.100.208.209:8996`,
            'pangshengfang',
            'aiggie01'
          ).then(response => {
            this.envLoading = false;
            if (response) {
              // eslint-disable-next-line no-eval
              this.projectOptions = eval(response).sort(item => item.projectid);
            }
          });
          break;
      }
    },
    goUpload(event) {
      this.activeName = 'upload';
      this.listPackage(event);
    },
    selecEnv(value) {
      this.projectValue = null;
      if (value) {
        this.envLoading = true;
        getServiceHost(value).then(response => {
          let host = response.data[0].publicEndpoints[0].ipAddress;
          let port = this.envOptions.filter(item => item.id === value)[0].port;
          let commonPort = this.envOptions.filter(item => item.id === value)[0]
            .commonPort;
          this.envValue = `http://${host}:${port}`;
          this.commonEnvValue = `http://${host}:${commonPort}`;
          getProjectInfo(
            `http://${host}:${port}`,
            'root',
            'thinkingdata2018'
          ).then(response => {
            this.envLoading = false;
            if (response) {
              // eslint-disable-next-line no-eval
              this.projectOptions = eval(response).sort(item => item.projectid);
            }
          });
        });
      }
    },
    async goNext(event) {
      if (this.stepActive === 2) {
        this.dialogVisible = true;
        const {
          envTypeValue: envType,
          projectValue: projectId,
          commonEnvValue: url
        } = this;
        this.percentage = 1;
        await exportApi({ envType, projectId, url });
        this.percentage = 100;
        this.dialogVisible = false;
        this.stepActive++;
      } else {
        this.stepActive++;
      }
    },
    goBack(event) {
      if (this.stepActive > 1) {
        this.stepActive--;
      }
    },
    uploadGoBack(event) {
      if (this.uploadStep > 1) {
        this.uploadStep--;
      }
    },
    async uploadGoNext(event) {
      if (this.uploadStep === 1) {
        this.envTypeValue = null;
        this.envOptions = [];
        this.envValue = null;
      } else if (this.uploadStep === 2) {
        this.dialogVisible = true;
        const {
          envTypeValue: envType,
          selectedProjectId: projectId,
          commonEnvValue: url,
          filePath: filePath
        } = this;
        this.percentage = 1;
        await uploadApi({ envType, projectId, url, filePath });
        this.percentage = 100;
        this.dialogVisible = false;
      }
      this.uploadStep++;
    },
    listPackage(event) {
      this.envTypeValue = null;
      this.envOptions = [];
      this.envValue = null;
      packageList().then(response => {
        let data = response.data;
        if (data) {
          this.packageList = data.map(item => {
            return this.transToPackage(item);
          });
        }
      });
    },
    transToPackage(data) {
      return {
        envType: data.from + '环境',
        projectId: data.projectId,
        dockerPort: data.dockerPort,
        path: data.path
      };
    }
  },
  watch: {
    selectEnv() {
      this.uploadButtonDisable = this.selectEnv < 0;
      if (this.selectEnv >= 0) {
        this.filePath = this.packageList[this.selectEnv].path;
        this.selectedProjectId = this.packageList[this.selectEnv].projectId;
      }
    },
    projectValue() {
      this.buttonDisable =
        this.envTypeValue == null ||
        this.envValue == null ||
        this.projectValue == null;
    },
    envTypeValue() {
      this.envDisable = this.envTypeValue !== 'DOCKER';
    },
    envValue() {
      this.projectDisable = this.envValue == null;
    },
    stepActive() {
      if (this.stepActive === 1) {
        this.percentage = 0;
        this.tableData = null;
      } else if (this.stepActive === 2) {
        this.tableData = [
          {
            envType: this.envTypeValue,
            env: this.envValue,
            project:
              '项目ID：' +
              this.projectValue +
              '\n项目名：' +
              this.projectOptions.filter(
                item => item.projectid === this.projectValue
              )[0].projectName
          }
        ];
      }
    },
    percentage() {
      this.goBackButtonDisable = this.percentage > 0 && this.percentage < 100;
    }
  }
};
</script>

<style scoped>
span {
  position: relative;
  padding: 0px 30px 0px 15px;
  transform: translateY(70%);
  line-height: 100%;
  float: right;
  flex: 1;
}

.el-row {
  padding: 10px;
}

.el-footer .el-button {
  position: relative;
  left: 85%;
}

label {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 400px;
}
</style>
<style>
.el-table .cell {
  white-space: pre-line;
}
.el-button-group {
  display: flex;
}

.card-env-title {
  font-size: small;
  margin: 5px;
}

.card-env-content {
  font-size: smaller;
  margin: 5px;
  color: blue;
}
</style>
