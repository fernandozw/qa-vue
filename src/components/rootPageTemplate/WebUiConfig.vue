<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>浏览器配置</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-switch
            style="display: block"
            v-model="status"
            active-color="#13ce66"
            inactive-color="gray"
            active-text="无头模式"
            inactive-text="界面模式"
            @change="updateBrowserValue"
          >
          </el-switch>
        </el-col>
        <el-col :span="8">
          <el-switch
            style="display: block"
            v-model="languageStatus"
            active-color="#13ce66"
            inactive-color="gray"
            active-text="中文"
            inactive-text="英文"
            @change="updateLanguageValue"
          >
          </el-switch>
        </el-col>
        <el-col :span="8">
          <div>
            <el-input
              placeholder="例如:1920,900"
              v-model="windowSize"
              style="width: 250px"
              size="mini"
              @change="updateWindowSize"
            >
              <template slot="prepend">浏览器尺寸</template>
            </el-input>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>调试模式</span>
      </div>
      <el-switch
        style="display: block"
        v-model="debugStatus"
        active-color="#13ce66"
        inactive-color="gray"
        active-text="开启"
        inactive-text="关闭"
        @change="updateDebugHub"
      >
      </el-switch>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'WebUiConfig',
  data() {
    return {
      clientIp: '',
      browserValue: '1',
      status: true,
      languageStatus: true,
      languageValue: '1',
      debugStatus: false,
      windowSize: ''
    };
  },
  methods: {
    getWindowSize() {
      let url = String.format(
        '{0}/config/getWindowSize',
        this.GLOBAL.WEBUI_URL
      );
      this.axios
        .get(url)
        .then(response => {
          this.windowSize = response.data.data.windowSize;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    updateWindowSize() {
      let config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      };
      let url = String.format(
        '{0}/config/updateWindowSize',
        this.GLOBAL.WEBUI_URL
      );
      this.axios
        .post(url, JSON.stringify({ windowSize: this.windowSize }), config)
        .then(response => {
          this.getWindowSize();
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    getBrowserValue() {
      let url = String.format('{0}/config/getConfig', this.GLOBAL.WEBUI_URL);
      this.axios
        .get(url)
        .then(response => {
          this.browserValue = response.data.data.headless;
          this.status = this.browserValue === '1';
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    getDebugValue() {
      let url = String.format('{0}/debugCase/getStatus', this.GLOBAL.WEBUI_URL);
      this.axios
        .get(url)
        .then(response => {
          this.debugStatus = response.data.data.status;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    updateDebugHub() {
      let config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      };
      let url = String.format(
        '{0}/debugCase/updateDebugHub',
        this.GLOBAL.WEBUI_URL
      );

      this.axios
        .post(
          url,
          JSON.stringify({ status: this.debugStatus ? '1' : '0' }),
          config
        )
        .then(response => {
          this.getDebugValue();
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    getLanguageValue() {
      let url = String.format('{0}/config/getLanguage', this.GLOBAL.WEBUI_URL);
      this.axios
        .get(url)
        .then(response => {
          this.languageValue = response.data.data.language;
          this.languageStatus = this.languageValue === '1';
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    updateBrowserValue() {
      let config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      };
      this.browserValue = this.status ? '1' : '0';
      let url = String.format('{0}/config/updateConfig', this.GLOBAL.WEBUI_URL);
      this.axios
        .post(url, JSON.stringify({ headless: this.browserValue }), config)
        .then(response => {
          this.getBrowserValue();
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    updateLanguageValue() {
      let config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      };
      this.languageValue = this.languageStatus ? '1' : '0';
      let url = String.format(
        '{0}/config/updateLanguage',
        this.GLOBAL.WEBUI_URL
      );
      this.axios
        .post(url, JSON.stringify({ language: this.languageValue }), config)
        .then(response => {
          this.getLanguageValue();
          return response;
        })
        .catch(response => {
          return response;
        });
    }
  },

  beforeMount() {
    this.getBrowserValue();
    this.getLanguageValue();
    this.getDebugValue();
    this.getWindowSize();
  }
};
</script>

<style scoped></style>
