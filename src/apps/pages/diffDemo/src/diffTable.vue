<template>
  <div class="main-panel">
    <!-- 节点title -->
    <div class="title-container">
      <h2 class="name">数据差异化展示 - table</h2>
    </div>
    <!-- 按钮区域 -->
    <div class="operator-container">
      <div class="fl">
        <el-button type="primary" @click="checkDiffForm">check diff form</el-button>
      </div>
    </div>

    <!-- 主体区域 -->
    <div class="list-main-container clearfix">
      <!-- UI模板组件 -->
      <ifbp-template ref="diffDemoTableRef"
        tpl-id="typicalDemoTableId"
        :funnode="diffDemoTableFunnode"
        :nexuskey="diffDemoTableNexuskey"
        :tpl-data="diffDemoTableData"
        :tpl-reset-fun="diffDemoTableResetFun"
        show-type="table">
      </ifbp-template>
    </div>
  </div>
</template>
<script>
import MockData from './mockData';
export default {
  data() {
    return {
      // UI模板传入参数
      diffDemoTableFunnode: 'CJGL',
      diffDemoTableNexuskey: 'DIFF_DEMO',
      diffDemoTableData: {},
      diffDemoTableResetFun($node) {
        // set tableDiff 为 true, 展示差异化数据
        var $tableDom = $node.find('el-table');
        $tableDom.attr(':table-diff', 'true');
        return $node[0].outerHTML;
      }
    };
  },
  mounted() {
    this.request();
  },
  methods: {
    // 请求数据
    request() {
      // 获取旧数据和新数据
      const oldValue = MockData.oldTableValue;
      const newValue = MockData.newTableValue;
      // 比对数据
      const diffData = this.$diff.getCompareData(oldValue, newValue, 'id');
      this.$refs.diffDemoTableRef.setData('diffData', diffData);
      // console.log(JSON.stringify(diffData));
      // set 数据
      this.$nextTick(() => {
        if(this.$refs.diffDemoTableRef) {
          this.$refs.diffDemoTableRef.setTableData(diffData);
        } else {
          this.$set(this.diffDemoTableData, 'uitemplateTableData', diffData);
        }
      });
    },

    // 跳转到 diff form 页面
    checkDiffForm() {
      this.$router.push('/diffDemo/form');
    }
  }
};
</script>
<style>

</style>
