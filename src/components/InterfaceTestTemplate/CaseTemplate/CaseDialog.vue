<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    width="80%"
    class="case-dialog"
    @close="close"
  >
    <div>
      <el-card class="box-card">
        <el-row :gutter="20">
          <el-col :span="4">
            <span>用例名称: <span style="color:red">*</span></span>
          </el-col>
          <el-col :span="8" :pull="2">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              placeholder="必填项:请输入内容"
              v-model="caseDetail.case_name"
              clearable
            >
            </el-input>
          </el-col>
          <el-col :span="4">
            <span>用例类型: <span style="color:red">*</span></span>
          </el-col>
          <el-col :span="8" :pull="2">
            <el-select
              placeholder="必填项:请选择"
              v-model="caseDetail['case_type']"
              clearable
              filterable
              disabled
            >
              <el-option
                v-for="item in caseTypeList"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4">
            <span>所属项目: <span style="color:red">*</span></span>
          </el-col>
          <el-col :span="8" :pull="2">
            <el-select
              placeholder="必填项:请选择"
              v-model="caseDetail.project_id"
              clearable
              filterable
              @change="changeProjectFunc"
            >
              <el-option
                v-for="item in projectList"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <span>所属业务: <span style="color:red">*</span></span>
          </el-col>
          <el-col :span="8" :pull="2">
            <el-select
              placeholder="必填项:请选择"
              v-model="caseDetail.business_id"
              clearable
              filterable
              @change="changeBusinessFunc"
              @focus="checkParentForDialog('business')"
            >
              <el-option
                v-for="item in businessList"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="3">
            <span>host: <span style="color:red">*</span></span>
          </el-col>
          <el-col :span="8" :pull="1">
            <el-select
              placeholder="必填项:请选择"
              v-model="caseDetail.host_id"
              clearable
              filterable
            >
              <el-option
                v-for="item in hostList"
                :key="item.value"
                :label="item.label + ':' + item.address"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="1" :pull="1">
            <el-tooltip
              class="item"
              effect="dark"
              :content="
                hostDict[caseDetail.host_id] != undefined
                  ? hostDict[caseDetail.host_id]
                  : '未找到匹配的host'
              "
              placement="right-start"
            >
              <i class="el-icon-question" />
            </el-tooltip>
          </el-col>
          <el-col :span="3">
            <span>url: <span style="color:red">*</span></span>
          </el-col>
          <el-col :span="8" :pull="1">
            <el-select
              placeholder="必填项:请选择"
              v-model="caseDetail.url_id"
              clearable
              filterable
              @focus="checkParentForDialog('interface')"
              @change="changeUrlFunc"
            >
              <el-option
                v-for="item in urlList"
                :key="item.id"
                :label="item.interface_name + ':' + item.interface_url"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="1" :pull="1">
            <el-tooltip
              class="item"
              effect="dark"
              :content="
                urlDict[caseDetail.url_id] != undefined
                  ? urlDict[caseDetail.url_id]
                  : '未找到匹配的url'
              "
              placement="right-start"
            >
              <i class="el-icon-question" />
            </el-tooltip>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="3">
            <span>请求头部: <span style="color:red">*</span></span>
          </el-col>
          <el-col :span="8" :pull="1">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              placeholder="必填项:请输入内容"
              v-model="caseDetail.header"
              clearable
            >
            </el-input>
          </el-col>
          <el-col :span="1" :pull="1">
            <el-tooltip class="item" effect="dark" placement="right-start">
              <template slot="content">
                格式必须为json形式,否则校验不通过, 动态参数取值通过"${}"<br />
                的形式获取,示例({"Content-Type":"${contentType}")<br />
                目前内置的动态参数有:timeStampMs(毫秒时间戳)<br />
                、timeStampS(秒时间戳)、randomChnEncode<br />
                （随机三位中文encode编码）、当月第一天（monthStart）<br />
                randomChn(随机三位中文)、currentMonth(当前月份)、<br />
                monthEnd(当月最后一天)。当接口返回结果作为<br />
                参数使用,需要在「保存字段」配置要取值的节点和自定义的key
              </template>
              <i class="el-icon-question" />
            </el-tooltip>
          </el-col>
          <el-col :span="3">
            <span>请求参数:</span>
          </el-col>
          <el-col :span="8" :pull="1">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              placeholder="请输入内容"
              v-model="caseDetail.param"
              clearable
            >
            </el-input>
          </el-col>
          <el-col :span="1" :pull="1">
            <el-tooltip class="item" effect="dark" placement="right-start">
              <template slot="content">
                格式必须为json形式,否则校验不通过,动态参数取值通过"${}"的形式获取,<br />
                示例({"registerNo":"","openCompanyId":"${openCompanyId}"})<br />
                目前内置的动态参数有:timeStampMs(毫秒时间戳)<br />
                、timeStampS(秒时间戳)、randomChnEncode<br />
                （随机三位中文encode编码）、当月第一天（monthStart）<br />
                randomChn(随机三位中文)、currentMonth(当前月份)、<br />
                monthEnd(当月最后一天)。当接口返回结果作为<br />
                参数使用,需要在「保存字段」配置要取值的节点和自定义的key
              </template>
              <i class="el-icon-question" />
            </el-tooltip>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="3">
            <span>返回校验:</span>
          </el-col>
          <el-col :span="8" :pull="1">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              placeholder="请输入内容"
              v-model="caseDetail.check_nodes"
              clearable
            >
            </el-input>
          </el-col>
          <el-col :span="1" :pull="1">
            <el-tooltip class="item" effect="dark" placement="right-start">
              <template slot="content">
                &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;返回校验使用方法:<br />
                <br />
                1、&nbsp;Json全量校验:以”{”开头，”}”结尾。示例({“code”:200,”data”:[],”message”:”SUCCESS”})<br />
                <br />
                2、Json节点与期望结果校验:节点取值通过jsonPath(自行百度)方式取到目标节点，<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;以$开头,以||分割校验类型,多节点校验以”;”分割。示例($.code|=|200;$.data.[]|count|20)<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;支持的校验方式：=（等于）、!=（不等于）、than（大于）、less（小于）、contains（包含）、not<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;contains（不包含）、count（数量等于）、count
                than（数量大于）、count less（数量小于）<br />
                <br />
                3、非Json格式，返回结果与期望结果直接比对:以response(注意是小写)开头,以||分割校验类型，没有多节点的概念。<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;示例(response|=|hello
                world)。支持的校验方式：=（等于）、!=（不等于）、than（大于）、less（小于）、<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;contains（包含）、not
                contains（不包含）、count（数量等于）、<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;count than（数量大于）、count
                less（数量小于）
              </template>
              <i class="el-icon-question" />
            </el-tooltip>
          </el-col>
          <el-col :span="3">
            <span>保存字段:</span>
          </el-col>
          <el-col :span="8" :pull="1">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              placeholder="请输入内容"
              v-model="caseDetail.save_nodes"
              clearable
            >
            </el-input>
          </el-col>
          <el-col :span="1" :pull="1">
            <el-tooltip class="item" effect="dark" placement="right-start">
              <template slot="content">
                通过jsonPath(自行百度)的方式取到目标节点,以”:”分割<br />
                jsonPath节点与此节点存储时的key,多个取值以”;”分割。<br />
                示例($.data.orderNo:orderNo;$.data.price:price)
              </template>
              <i class="el-icon-question" />
            </el-tooltip>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4">
            <span>请求类型: <span style="color:red">*</span></span>
          </el-col>
          <el-col :span="8" :pull="2">
            <el-select
              placeholder="必填项:请选择"
              v-model="caseDetail['request_type']"
              clearable
              filterable
            >
              <el-option
                v-for="item in requestList"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <span>是否自动化: <span style="color:red">*</span></span>
          </el-col>
          <el-col :span="8" :pull="2">
            <el-select
              placeholder="必填项:请选择"
              v-model="caseDetail['auto']"
              clearable
              filterable
            >
              <el-option
                v-for="item in autoList"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4">
            <span>创建人: <span style="color:red">*</span></span>
          </el-col>
          <el-col :span="8" :pull="2">
            <el-input
              placeholder="请输入内容"
              v-model="caseDetail.create_person"
              clearable
            >
            </el-input>
          </el-col>
          <el-col :span="4">
            <span>项目版本: <span style="color:red">*</span></span>
          </el-col>
          <el-col :span="8" :pull="2">
            <el-select
              placeholder="请选择"
              v-model="caseDetail.project_version"
              clearable
              filterable
              @focus="checkParentForDialog('version')"
              @change="changeVersion"
            >
              <el-option
                v-for="item in versionList"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <span>前置场景: </span>
          </el-col>
          <el-col :span="8" :pull="2">
            <el-select
              placeholder="请选择"
              v-model="preSceneS"
              clearable
              filterable
              multiple
              @change="$forceUpdate()"
              style="width: 345px"
              :disabled="this.caseDetail.case_type === 1 ? true : false"
            >
              <el-option
                v-for="item in preSceneList"
                :key="item.value"
                :label="item.scene_name"
                :value="item.id + ''"
              >
              </el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-card>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="saveCase">
        {{ btnText }}
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import cookies from 'vue-cookies';

export default {
  name: 'CaseDialog',
  components: {},
  props: {
    caseId: {
      type: Number,
      default: null
    },
    type: {
      type: Number,
      default: 1 // 1 新增 2 编辑 3 新增
    },
    visible: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      preSceneS: [],
      dialogVisible: false,
      caseDetail: {
        id: '',
        request_type: '',
        case_name: '',
        url_id: '',
        host_id: '',
        case_type: 0,
        check_nodes: '',
        header: '{}',
        param: '{}',
        save_nodes: '',
        auto: '',
        business_id: '',
        project_version: '',
        create_person:
          cookies.get('username') === null ? '' : cookies.get('username'),
        project_id: '',
        pre_scene: ''
      },
      preSceneList: [],
      projectList: [],
      versionList: [],
      businessList: [],
      hostList: [],
      urlList: [],
      autoList: [],
      requestList: [],
      caseTypeList: [],
      urlDict: {},
      hostDict: {}
    };
  },
  computed: {
    dialogTitle() {
      if (this.type === 2) {
        return '编辑' + '（用例ID：' + this.caseId + '）';
      } else if (this.type === 3) {
        return '复制';
      }
      return '新增';
    },
    btnText() {
      if (this.type === 3) {
        return '复 制';
      }
      return '保 存';
    },
    typeText() {
      if (this.type === 2) {
        return '编辑';
      } else if (this.type === 3) {
        return '复制';
      }
      return '新增';
    }
  },
  created() {
    this.dialogVisible = this.visible;
    if (this.type === 1) {
      this.getConditions();
    } else if (this.type === 2 || this.type === 3) {
      this.init();
    }
  },
  methods: {
    // 版本改变获取前置场景列表
    changeVersion() {
      this.$forceUpdate();
      this.caseDetail.pre_scene = '';
      // 指定参数格式
      let config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      };
      //  let url = String.format('{0}/jobInterface/addTask', 'http://127.0.0.1:5000')
      let url = String.format(
        '{0}/sceneInterface/searchSceneForPreScene',
        this.GLOBAL.MONITOR_URL
      );
      let conditions = {
        project_id: this.caseDetail.project_id,
        project_version: this.caseDetail.project_version,
        scene_type: 1
      };
      this.axios
        .post(url, JSON.stringify(conditions), config)
        .then(response => {
          this.preSceneList = response.data.sceneList;
        })
        .catch(response => {
          return response;
        });
    },
    init() {
      let caseInfoUrl = String.format(
        '{0}/caseInterface/caseInfo?id={1}',
        this.GLOBAL.MONITOR_URL,
        this.caseId
      );
      this.axios
        .get(caseInfoUrl)
        .then(response => {
          this.caseDetail = response.data.case_info;
          if (this.type === 3) {
            this.caseDetail.id = null;
            this.caseDetail.create_person = cookies.get('username')
              ? cookies.get('username')
              : '';
          }
          this.urlList = response.data.interfaceList.interfaceList;
          this.preSceneList = response.data.preSceneList;
          this.preSceneS =
            this.caseDetail.pre_scene !== ''
              ? this.caseDetail.pre_scene.split(',')
              : [];
          this.getConditions();
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 编辑保存用例
    saveCase() {
      if (
        this.isEmpty(this.caseDetail['url_id']) ||
        this.isEmpty(this.caseDetail['case_name']) ||
        this.isEmpty(this.caseDetail['case_type']) ||
        this.isEmpty(this.caseDetail['auto']) ||
        this.isEmpty(this.caseDetail['request_type']) ||
        this.isEmpty(this.caseDetail['project_id']) ||
        this.isEmpty(this.caseDetail['business_id']) ||
        this.isEmpty(this.caseDetail['host_id']) ||
        this.isEmpty(this.caseDetail['create_person']) ||
        this.isEmpty(this.caseDetail['project_version'])
      ) {
        this.Message.error('警告:请填写必填项!');
      } else {
        if (
          !this.GLOBAL.checkJson(this.caseDetail.param) ||
          !this.GLOBAL.checkJson(this.caseDetail.header)
        ) {
          this.Message.error('请求头部、请求参数必须为JSON格式');
        } else {
          this.caseDetail.pre_scene = this.preSceneS.join(',');
          let url = String.format(
            this.caseDetail.id
              ? '{0}/caseInterface/editCase'
              : '{0}/caseInterface/addCase',
            this.GLOBAL.MONITOR_URL
          );
          // 指定参数格式
          let config = {
            headers: {
              'Content-Type': 'application/json;charset=UTF-8'
            }
          };
          this.axios
            .post(url, JSON.stringify(this.caseDetail), config)
            .then(response => {
              let responseCode = response.data.code;
              if (responseCode === '200') {
                this.Message.success(response.data.msg);
                // 调用父组件的查询方法
                this.$emit('listenToChildEvent', true);
              } else {
                this.Message.error(response.data.msg);
              }
              return response;
            })
            .catch(response => {
              // 调用父组件的查询方法
              // this.$emit('listenToChildEvent', true);
              return response;
            });
        }
      }
    },
    close() {
      this.$emit('listenToChildEvent', false);
    },
    changeProjectFunc() {
      this.caseDetail.business_id = '';
      this.caseDetail.url_id = '';
      this.caseDetail.project_version = '';
      this.caseDetail.pre_scene = '';
      this.businessList = [];
      this.urlList = [];
      this.versionList = [];
      this.preSceneList = [];
      this.getConditions();
    },
    // 检查上级是否选中
    checkParentForDialog(type) {
      if (type === 'business') {
        if (this.caseDetail.project_id === '') {
          this.$message({
            type: 'error',
            message: '请先选择所属项目!'
          });
        }
      }
      if (type === 'version') {
        if (this.caseDetail.project_id === '') {
          this.$message({
            type: 'error',
            message: '请先选择所属项目!'
          });
        }
      } else if (type === 'interface') {
        if (
          this.caseDetail.project_id === '' ||
          this.caseDetail.business_id === ''
        ) {
          this.$message({
            type: 'error',
            message: '请先选择所属项目、所属业务!'
          });
        }
      }
    },
    changeBusinessFunc() {
      this.caseDetail.url_id = '';
      this.urlList = [];
      this.$forceUpdate();
      if (
        this.caseDetail.project_id !== '' &&
        this.caseDetail.business_id !== ''
      ) {
        this.getUrlList();
      }
    },
    // 获取接口下拉列表
    getUrlList() {
      // 指定参数格式
      let config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      };
      let url = String.format(
        '{0}/caseInterface/getUrlByConditions',
        this.GLOBAL.MONITOR_URL
      );
      let conditions = {
        business_id: this.caseDetail.business_id,
        project_id: this.caseDetail.project_id
      };
      this.axios
        .post(url, JSON.stringify(conditions), config)
        .then(response => {
          this.urlList = response.data.interfaceList;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    changeUrlFunc() {
      this.$forceUpdate();
    },
    // 获取编辑页面下拉列表
    getConditions() {
      let url = String.format(
        '{0}/caseInterface/caseConditions?project_id={1}',
        this.GLOBAL.MONITOR_URL,
        this.caseDetail['project_id']
      );
      this.axios
        .get(url)
        .then(response => {
          this.projectList = response.data.data.projectList;
          this.versionList = response.data.data.versionList;
          this.businessList = response.data.data.businessList;
          this.caseTypeList = response.data.data.caseTypeList;
          this.hostList = response.data.data.hostList;
          this.requestList = response.data.data.requestTypeList;
          this.autoList = response.data.data.autoList;
          this.urlDict = response.data.data.interfaceDict;
          this.hostDict = response.data.data.hostDict;

          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 校验输入、选项框是否为空
    isEmpty(obj) {
      if (obj === undefined || obj === '') {
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>

<style scoped>
.case-dialog .el-row {
  line-height: 40px;
  margin-top: 10px;
}
/deep/.case-dialog .el-input__inner {
  width: 350px;
}
/deep/.case-dialog .el-textarea__inner {
  width: 350px;
}
</style>
