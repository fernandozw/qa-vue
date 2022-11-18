<template>
  <div>
    <div style="margin-bottom: 5px">
      <el-row :gutter="20" style="margin-top: -10px">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <span class="demonstration">批量维护失败原因 :</span>
            <el-cascader
              expand-trigger="hover"
              :options="options"
              v-model="selectedOptions"
              @change="saveMultiReason"
              placeholder="选择失败原因"
              size="small"
            >
            </el-cascader>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <span class="demonstration">用例集名称 :</span>
            <el-select
              v-model="collectionName"
              filterable
              placeholder="选择用例集名称"
              size="small"
              @change="childMethod"
            >
              <el-option
                v-for="item in collections"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-table
      :data="tabData"
      style="width: 100%;margin-top: -20px"
      border
      :height="tabHeight"
      @selection-change="handleSelectionChange"
      size="mini"
      :row-class-name="tableRowClassName"
    >
      <!--使用默认的唯一索引index,作为key的唯一值-->
      <el-table-column type="selection" width="55" align="center">
      </el-table-column>
      <template v-for="(col, index) in tabHeader">
        <el-table-column
          v-if="col.type === 'normal' && col.prop != 'response'"
          :prop="col.prop"
          :label="col.label"
          :key="index"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          v-if="col.type === 'sort' && col.prop != 'response'"
          :prop="col.prop"
          :label="col.label"
          :key="index"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <!--key是必须的且写在真实的html元素上,否则es6检查会报错-->
        <el-table-column
          v-if="col.type === 'normal' && col.prop === 'response'"
          :prop="col.prop"
          :label="col.label"
          :key="index"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope1">
            <el-button
              type="success"
              size="mini"
              @click="lookDetail(tabData[scope1.$index][col.prop])"
              >查看详情</el-button
            >
          </template>
        </el-table-column>
        <!--根据列进行排序,超过长度用省略号表示-->
        <el-table-column
          v-if="col.type === 'sort' && col.prop === 'response'"
          :prop="col.prop"
          :label="col.label"
          :key="index"
          align="center"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope2">
            <el-button
              type="success"
              size="mini"
              @click="lookDetail(tabData[scope2.$index][col.prop])"
              >查看详情</el-button
            >
          </template>
        </el-table-column>
        <!--含有下拉选项-->
        <el-table-column
          v-if="col.type === 'dropdown'"
          :prop="col.prop"
          :label="col.label"
          :key="index"
          align="center"
        >
          <!--作用域插槽,存储全局data的值-->
          <template slot-scope="dropDownData">
            <el-select
              v-model="tabData[dropDownData.$index][col.prop]"
              filterable
              placeholder="请选择"
              allow-create
              @change="saveDropDownData(tabData[dropDownData.$index], col.prop)"
              size="mini"
            >
              <el-option
                v-for="item in dropDown[col.prop].options"
                :key="item.value"
                :value="item.value"
              >
                <span
                  style="float: bottom; color:blueviolet; font-size: 13px"
                  >{{ item.value }}</span
                >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <el-dialog title="提示信息" :visible.sync="dialogVisible" width="30%">
      <span>请勾选需要维护的行！！！</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog title="字段详情" :visible.sync="detailVisible" width="60%">
      <el-card shadow="never" style="border-color: #8c939d">
        <pre>
         {{ cellValue }}
        </pre>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="detailVisible = false" size="small"
          >关 闭</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  // 模板名称
  name: 'DropDownTableTemplate',
  // 模板动态参数(tabData:表格的列数据;tabHeader:表头;tabHeight:表格的固定高度,值由引用组件传入,dropDown:下拉列表)
  props: {
    tabData: null,
    tabHeader: null,
    tabHeight: null,
    dropDown: null,
    options: null,
    begin: null,
    end: null,
    envValue: null,
    collections: null
  },
  data() {
    return {
      // 详情框
      detailVisible: false,
      // 提示框
      dialogVisible: false,
      // 单元格内容
      cellValue: null,
      // 选中的下拉框的值
      selectedOptions: [],
      // 被选中的行
      multipleSelection: [],
      // 用例集名称
      collectionName: 'all'
    };
  },
  methods: {
    // 父组件方法
    childMethod() {
      let url = String.format(
        '{0}/interface_automation/failed_cases?begin_date={1}&end_date={2}&page=1&collection_name={3}&env={4}',
        this.GLOBAL.BASE_URL,
        this.begin,
        this.end,
        this.collectionName,
        this.envValue
      );
      this.$emit('useFatherMothod', url);
    },
    // 设置行的颜色
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return 'warning-row';
      } else {
        return 'success-row';
      }
    },
    // 判断是否为json字符串
    isJson: function(str) {
      if (typeof str === 'string') {
        try {
          JSON.parse(str);
          return true;
        } catch (e) {
          return false;
        }
      }
    },
    // 显示字段详情
    lookDetail: function(value) {
      this.detailVisible = true;
      if (this.isJson(value)) {
        this.cellValue = JSON.parse(value);
      } else {
        this.cellValue = value;
      }
    },
    // 设置table的行高
    setLineHeight: function() {
      return 'padding:0';
    },
    // 获取被选中的行
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 批量维护失败原因
    saveMultiReason: function() {
      // 用例id集
      let ids = [];
      // 获取用例id集
      this.multipleSelection.map(item => {
        ids.push(item.caseId);
      });
      // 指定参数格式
      let config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      };
      // 请求的url地址
      let url = this.dropDown[this.selectedOptions[0]].url;
      // 未勾选复选框时弹出对话框
      if (ids.length < 1) {
        this.dialogVisible = true;
        this.selectedOptions = [];
      } else {
        // 构造请求参数
        let param = {};
        // 用例id集处理成以','分割的字符串
        param['ids'] = ids.join(',');
        // 需要更新的动态字段
        param[this.selectedOptions[0]] = this.selectedOptions[1];
        // 发送请求并返回结果
        this.axios
          .post(url, JSON.stringify(param), config)
          .then(response => {
            this.searchList();
            return response;
          })
          .catch(response => {
            return response;
          });
      }
      // 批量更新单个单元格下拉框的值
      this.multipleSelection.map(item => {
        item[this.selectedOptions[0]] = this.selectedOptions[1];
      });
    },
    // 保存单个下拉框的值
    saveDropDownData: function(obj, key) {
      // 指定参数格式
      let config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      };
      let param = {};
      param['ids'] = obj.caseId;
      param[key] = obj[key];
      this.axios
        .post(this.dropDown[key].url, JSON.stringify(param), config)
        .then(response => {
          this.searchList();
          return response;
        })
        .catch(response => {
          return response;
        });
    }
  }
};
</script>
<!-- element-ui中table表头错位问题-->
<style scoped>
body .el-table th.gutter {
  display: table-cell !important;
}

body .el-table colgroup.gutter {
  display: table-cell !important;
}

.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
