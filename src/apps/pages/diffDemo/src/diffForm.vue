<template>
  <div class="main-panel">
    <!--节点title-->
    <div class="title-container">
      <h2 class="name">数据差异化展示 - form</h2>
    </div>
    <!-- 按钮区域 -->
    <div class="operator-container">
      <div class="fl">
        <el-button type="primary" @click="checkDiffTable">check diff Table</el-button>
      </div>
    </div>
    <!-- 主体区域 -->
    <div class="detail-main-container clearfix">
      <div class="tips">发生差异的字段, 将添加名为 ifbp-tooltip-diff 的 class</div>
      <ifbp-template ref="diffDemoRef"
        tplId="diffDemoId"
        :funnode="diffDemoFunnode"
        :nexuskey="diffDemoNexuskey"
        show-type="form"
        :tpl-reset-fun="diffDemoResetFun"
        :tplData="diffDemoData"
        :editable="diffDemoEdit">
      </ifbp-template>
    </div>
  </div>
</template>
<script>
import MockData from './mockData';
export default {
  data() {
    var vm = this;
    return {
      // UI模板所需参数
      diffDemoFunnode: 'CJGL',
      diffDemoNexuskey: 'DIFF_DEMO',
      diffDemoData: {},
      // 编辑态为 false 才会展示差异化数据
      diffDemoEdit: false,
      diffDemoResetFun($node) {
        // 为 form item 设置 diff 属性
        this.setFormDiffProps($node);
        return $node[0].outerHTML;
      }
    };
  },
  mounted() {
    this.request();
  },
  methods: {
    // 获取数据
    request() {
      // 获取旧数据和新数据
      const oldValue = MockData.oldFormValue;
      const newValue = MockData.newFormValue;
      // 比对数据
      const diffData = this.$diff.getCompareData(oldValue, newValue, 'id');
      // console.log(JSON.stringify(diffData));
      // 把比对结果绑定在 diffDemoData 对象上
      // this.$set(this.diffDemoData, 'diffData', diffData);
      this.$refs.diffDemoRef.setData('diffData', diffData);
      // set 新数据
      this.$nextTick(() => {
        if (this.$refs.diffDemoRef) {
          this.$refs.diffDemoRef.setFormData(newValue);
        } else {
          this.$set(this.diffDemoData, 'uitemplateFormData', newValue);
        }
      });
    },

    // 跳转到 diff table 页面
    checkDiffTable() {
      this.$router.push('/diffDemo/table');
    }
  }
};
</script>
<style scoped>
  .tips {
    margin: 20px;
  }
</style>
