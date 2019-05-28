<template>
  <div>
    <!-- UI模板组件 -->
    <ifbp-template ref="dialogTableRef"
      :funnode="funnode"
      :nexuskey="nexuskey"
      :tpl-data="tplTableData"
      show-type="table"
      @selection-change="handleSelectionChange"
    >
    </ifbp-template>
    <div slot="footer" class="custom-dialog-footer">
      <el-button @click="dialogCancel">取 消</el-button>
      <el-button type="primary" @click="dialogConfirm">确 定</el-button>
    </div>
  </div>
</template>
<script>
import detailMock from '../mock/detail.mock.js';
export default {
  name: 'elCustomRefDialog',
  props: [ 'refCode', 'field', 'templateValue', 'isMutiSelect', 'queryParams' ],
  data() {
    return {
      // UI 模板相关
      funnode: 'CXMB',
      nexuskey: 'TEST_CUSTOM_REF',
      tplTableData: {},
      selectedData: []
    };
  },
  methods: {
    handleSelectionChange(data) {
      this.selectedData = data;
    },
    dialogConfirm() {
      console.log(JSON.stringify(this.selectedData));
      this.$emit('customRefConfirm', this.selectedData);
    },
    dialogCancel() {
      this.$emit('customRefCancel');
    },
    getTableTplData() {
      this.$http({
        url: '/testAPI/testCustomRefDialog',
        ifbpNotUseCache: true,
        type: 'post'
      }).then(res => {
        this.$nextTick(() => {
          if (this.$refs.dialogTableRef) {
            this.$refs.dialogTableRef.setTableData(res.data.data);
          } else {
            this.$set(this.dialogTableRef, 'customRef_t', res.data.data);
          }
        });
      });
    },
    showProps() {
      console.log('refCode: ', JSON.stringify(this.refCode));
      console.log('field: ', JSON.stringify(this.field));
      console.log('templateValue: ', JSON.stringify(this.templateValue));
      console.log('isMutiSelect: ', JSON.stringify(this.isMutiSelect));
      console.log('queryParams: ', JSON.stringify(this.queryParams));
    }
  },
  created() {
    this.getTableTplData();
    this.showProps();
  }
};
/* eslint-enable */
</script>

<style scoped>
  .custom-dialog-footer {
    text-align: right;
    margin-top: 10px;
  }
</style>
