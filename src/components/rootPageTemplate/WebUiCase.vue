<template>
  <div>
    <el-form :inline="true" :model="searchForm" size="mini">
      <el-form-item label="id">
        <el-input
          v-model="searchForm.id"
          placeholder="输入id"
          clearable
          style="width: 100px"
        ></el-input>
      </el-form-item>
      <el-form-item label="用例名称">
        <el-input
          v-model="searchForm.caseName"
          placeholder="输入用例名称"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="所属业务:">
        <el-select
          v-model="searchForm.pageId"
          placeholder="必填项:请选择"
          clearable
          filterable
        >
          <el-option
            v-for="item in pageList"
            :key="item.id"
            :label="'「' + item.id + '」' + item.pageName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="页面类型">
        <el-select
          v-model="searchForm.pageType"
          filterable
          placeholder="选择页面类型"
          clearable
        >
          <el-option
            v-for="item in pageTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="手机类型">
        <el-select
          v-model="searchForm.phoneType"
          filterable
          placeholder="选择手机类型"
          clearable
        >
          <el-option
            v-for="item in phoneTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="浏览器类型">
        <el-select
          v-model="searchForm.browserType"
          filterable
          placeholder="选择浏览器类型"
          clearable
        >
          <el-option
            v-for="item in browserTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否可用">
        <el-select
          v-model="searchForm.canUse"
          filterable
          placeholder="选择是否可用"
          clearable
        >
          <el-option
            v-for="item in canUseList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="运行状态">
        <el-select
          v-model="searchForm.status"
          filterable
          placeholder="选择运行状态"
          clearable
        >
          <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="searchForm.startTime"
          type="datetimerange"
          align="right"
          start-placeholder="起始时间"
          end-placeholder="截止时间"
          :default-time="['00:00:00', '23:59:59']"
          style="width: 360px;"
          value-format="yyyy-MM-dd HH:mm:ss"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="更新时间">
        <el-date-picker
          v-model="searchForm.updateTime"
          type="datetimerange"
          align="right"
          start-placeholder="起始时间"
          end-placeholder="截止时间"
          :default-time="['00:00:00', '23:59:59']"
          style="width: 360px;"
          value-format="yyyy-MM-dd HH:mm:ss"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item style="float: right;margin-right: 60px">
        <el-button type="primary" @click="getCaseList('search')"
          >查询
        </el-button>
        <el-button type="success" @click="clickAddBtn">新增</el-button>
        <el-button type="info" @click="getCaseList('reset')">重置</el-button>
        <el-upload
          class="upload-demo"
          :on-change="handleChange"
          :show-file-list="false"
          :auto-upload="false"
          action=""
        >
          <el-button size="mini" type="warning" style="margin-bottom:15px;"
            >导入
          </el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <web-ui-case-dialog
      v-if="dialogVisible"
      :visible="dialogVisible"
      :case-id="caseId"
      :type="dialogVisibleType"
      @listenToChildEvent="callbackFunc"
    ></web-ui-case-dialog>

    <el-table
      :data="tableData"
      style="width: 100%"
      size="mini"
      border
      :cell-style="{ 'text-align': 'center' }"
      :header-cell-style="{ 'text-align': 'center' }"
      :row-class-name="tableRowClassName"
    >
      <el-table-column
        fixed="left"
        prop="id"
        label="id"
        width="100"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="caseName"
        label="用例名称"
        width="250"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="url"
        label="url地址"
        width="280"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="pageId"
        label="所属业务"
        width="180"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>
            「{{ tableData[scope.$index].pageId }}」{{
              tableData[scope.$index].pageName
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="pageType"
        label="页面类型"
        width="180"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="phoneType"
        label="手机类型"
        width="180"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="browserType"
        label="浏览器类型"
        width="180"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column label="是否可用" width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ canUseMap[tableData[scope.$index].canUse] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="运行状态" width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ statusMap[tableData[scope.$index].status] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="addTime"
        label="创建时间"
        width="250"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="更新时间"
        width="250"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column label="操作" width="250" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            @click="debugCase(tableData[scope.$index].id)"
            >调试
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="execCase(tableData[scope.$index].id)"
            >执行
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="caseDetail(tableData[scope.$index].id, 'edit')"
            >编辑
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="deleteCase(tableData[scope.$index].id)"
            >删除
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="caseDetail(tableData[scope.$index].id, 'copy')"
            >复制
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="getCaseList('search')"
      :current-page.sync="currentPage"
      :page-size="pageSize"
      layout="total,slot, prev, pager, next, jumper"
      :total="total"
      style="margin-top: 10px"
      size="mini"
    >
      <span>{{ pageSize }}条/页</span>
    </el-pagination>
  </div>
</template>

<script>
import WebUiCaseDialog from '../WebUiTestTemplate/WebUiCaseDialog';

export default {
  name: 'WebUiCase',
  components: {
    webUiCaseDialog: WebUiCaseDialog
  },
  data() {
    return {
      ip: '',
      dialogVisibleType: 1,
      caseId: null,
      dialogVisible: false,
      searchForm: {
        id: '',
        caseName: '',
        pageId: '',
        pageType: '',
        phoneType: '',
        browserType: '',
        canUse: '',
        status: '',
        startTime: [],
        updateTime: []
      },
      pageList: [],
      pageTypeList: [],
      phoneTypeList: [],
      browserTypeList: [],
      canUseList: [],
      canUseMap: {},
      statusList: [],
      statusMap: {},
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0
    };
  },
  methods: {
    handleChange(file) {
      this.fileContent = file;
      const fileName = file.name;
      const fileType = fileName.substring(fileName.lastIndexOf('.') + 1);
      if (this.fileContent) {
        if (fileType === 'side') {
          let reader = new FileReader();
          reader.readAsText(file.raw, 'UTF-8');
          let that = this;
          reader.onload = function(e) {
            that.insertCaseByIde(e.target.result);
          };
        } else {
          this.$message({
            type: 'warning',
            message: '文件格式错误，请重新上传！'
          });
        }
      } else {
        this.$message({
          type: 'warning',
          message: '请上传附件！'
        });
      }
    },
    // 导入selenium ide的脚本
    insertCaseByIde(param) {
      // 指定参数格式
      let config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      };
      let url = String.format(
        '{0}/case/insertCaseByIde',
        this.GLOBAL.WEBUI_URL
      );
      this.axios
        .post(url, param, config)
        .then(response => {
          if (response.data.code === '1000') {
            this.Message.success('导入成功!');
            this.getCaseList('normal');
          } else {
            this.Message.error('导入失败!');
            this.getCaseList('normal');
          }
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 设置行的颜色
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return 'warning-row';
      } else {
        return 'success-row';
      }
    },
    // 获取元素列表
    getCaseList(model) {
      // 重置
      if (model === 'reset') {
        this.currentPage = 1;
        this.resetSearchForm();
        // 新增、编辑、删除
      } else if (model === 'normal') {
        this.currentPage = 1;
      }
      // 指定参数格式
      let config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      };
      let url = String.format('{0}/case/cases', this.GLOBAL.WEBUI_URL);
      this.searchForm['pageNum'] = this.currentPage;
      this.axios
        .post(url, JSON.stringify(this.searchForm), config)
        .then(response => {
          this.tableData = response.data.data.cases;
          this.total = response.data.data.total;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 用于子组件的回调函数
    callbackFunc(fresh) {
      this.dialogVisible = false;
      if (fresh) {
        this.getCaseList('normal');
      }
    },
    // 点击新增按钮
    clickAddBtn() {
      this.dialogVisibleType = 1;
      this.dialogVisible = true;
    },
    // 用例详情
    caseDetail(id, model) {
      if (model === 'edit') {
        this.dialogVisibleType = 2;
      } else if (model === 'copy') {
        this.dialogVisibleType = 3;
      }
      this.caseId = id;
      this.dialogVisible = true;
    },
    // 删除用例
    deleteCase(id) {
      this.$confirm(
        String.format('此操作将永久删除该用例(id:{0}), 是否继续?', id),
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        // 指定参数格式
        let config = {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        };
        let url = String.format('{0}/case/delete', this.GLOBAL.WEBUI_URL);
        const param = { id: id };
        this.axios
          .post(url, JSON.stringify(param), config)
          .then(response => {
            if (response.data.code === '1000') {
              this.Message.success(response.data.msg);
              this.getCaseList('normal');
            } else {
              this.Message.error(response.data.msg);
              this.getCaseList('normal');
            }
            return response;
          })
          .catch(response => {
            return response;
          });
      });
    },
    // 获取查询条件
    getConditions() {
      let url = String.format(
        '{0}/case/getSearchCondition',
        this.GLOBAL.WEBUI_URL
      );
      this.axios
        .get(url)
        .then(response => {
          this.pageList = response.data.data.pageList;
          this.pageTypeList = response.data.data.pageTypeList;
          this.phoneTypeList = response.data.data.phoneTypeList;
          this.browserTypeList = response.data.data.browserTypeList;
          this.canUseList = response.data.data.canUseList;
          this.canUseMap = response.data.data.canUseMap;
          this.statusList = response.data.data.statusList;
          this.statusMap = response.data.data.statusMap;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 重置查询条件表单
    resetSearchForm() {
      this.searchForm = {
        id: '',
        caseName: '',
        pageId: '',
        pageType: '',
        phoneType: '',
        browserType: '',
        status: '',
        canUse: '',
        startTime: [],
        updateTime: []
      };
    },
    // 执行用例
    execCase(id) {
      // 指定参数格式
      let config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      };
      let url = String.format('{0}/case/execCase', this.GLOBAL.WEBUI_URL);
      const param = { id: id };
      this.axios
        .post(url, JSON.stringify(param), config)
        .then(response => {
          if (response.data.code === '1000') {
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
    debugCase(id) {
      let match = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\\.-]+)+[\w\-\\._~:/?#[\]@!\\$&'\\*\\+,;=.]+$/;
      this.$prompt(
        '<strong><i>1、<a href="http://47.100.78.246:9998/webui/config/downloadJar">下载调试模式脚本</a></i></strong>' +
          '<br/><strong><i><span>2、解压脚本,并执行startNode.sh文件(sh -x startNode.sh)</span></i></strong>' +
          '<br/><strong><i><span>3、设置浏览器ip隐藏策略(为了自动获取本地ip地址)：</span></i></strong>' +
          '<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>3.1、firefox:在浏览器地址栏中输入:about:config     搜索配置media.peerconnection.ice.obfuscate_host_addresses 并将值改为 false</span>' +
          '<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>3.2、chrome:在浏览器地址栏中输入:chrome://flags/     搜索配置#enable-webrtc-hide-local-ips-with-mdns 并将值改为 disabled</span>' +
          '<br/><strong><i><span>4、此弹窗输入node地址,点击执行(默认自动获取)</span></i></strong>',

        '操作步骤',
        {
          inputValue: this.ip,
          inputPlaceholder: 'node节点的url地址:http://ip地址:端口号/wd/hub',
          confirmButtonText: '执行',
          cancelButtonText: '取消',
          inputPattern: match,
          inputErrorMessage: 'url地址格式不正确',
          dangerouslyUseHTMLString: true
        }
      )
        .then(({ value }) => {
          // 指定参数格式
          let config = {
            headers: {
              'Content-Type': 'application/json;charset=UTF-8'
            }
          };
          let url = String.format(
            '{0}/debugCase/execCase',
            this.GLOBAL.WEBUI_URL
          );
          const param = { id: id, browserNode: value };
          this.axios
            .post(url, JSON.stringify(param), config)
            .then(response => {
              if (response.data.code === '1000') {
                this.Message.success(response.data.msg);
              } else {
                this.Message.error(response.data.msg);
              }
              return response;
            })
            .catch(response => {
              return response;
            });
        })
        .catch(error => {
          return error;
        });
    },
    // 获取用户本地ip
    getUserIP(onNewIP) {
      let MyPeerConnection =
        window.RTCPeerConnection ||
        window.mozRTCPeerConnection ||
        window.webkitRTCPeerConnection;
      let pc = new MyPeerConnection({
        iceServers: []
      });
      let noop = () => {};
      let localIPs = {};
      let ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g;
      let iterateIP = ip => {
        if (!localIPs[ip]) onNewIP(ip);
        localIPs[ip] = true;
      };
      pc.createDataChannel('');
      pc.createOffer()
        .then(sdp => {
          sdp.sdp.split('\n').forEach(function(line) {
            if (line.indexOf('candidate') < 0) return;
            line.match(ipRegex).forEach(iterateIP);
          });
          pc.setLocalDescription(sdp, noop, noop);
        })
        .catch(reason => {});
      pc.onicecandidate = ice => {
        if (
          !ice ||
          !ice.candidate ||
          !ice.candidate.candidate ||
          !ice.candidate.candidate.match(ipRegex)
        )
          return;
        ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
      };
    }
  },
  beforeMount() {
    this.getConditions();
    this.getCaseList();
    this.getUserIP(ip => {
      this.ip = String.format('http://{0}:7890/wd/hub', ip);
    });
  }
};
</script>

<style scoped>
.el-table >>> .warning-row {
  background: oldlace;
}

.el-table >>> .success-row {
  background: #f0f9eb;
}
</style>
