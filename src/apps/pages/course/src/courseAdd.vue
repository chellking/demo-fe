<template>
  <ifbp-page>
    <!-- 节点title -->
    <ifbp-breadcrumb name="课程新增"></ifbp-breadcrumb>
    <!-- 主体区域 -->
    <ifbp-main-area type="detail">
      <ifbp-panel-group>
        <!-- 主表编辑页签 -->
        <ifbp-panel id="courseInfo" title="课程信息" :main-title="true">
          <!-- UI模板组件 --> <!-- funnode参数指定平台UI模板定义值 nexuskey参数指定平台UI模板定义值 -->
          <ifbp-template 
            ref="courseInfoRef"
            tpl-id="courseInfoId"
            :funnode="courseInfoFunnode"
            :nexuskey="courseInfoNexuskey"
            :tpl-data="courseInfoData"
            :editable="true"
            show-type="form">
          </ifbp-template>
        </ifbp-panel>
        <!-- 子表页签 -->
        <ifbp-panel id="courseForm" title="课表">
          <ifbp-template
            ref="courseFormRef"
            tpl-id="courseFormId"
            :funnode="courseFormFunnode"
            :nexuskey="courseFormNexuskey"
            :tpl-data="courseFormData"
            :editable="true"
            show-type="form">
          </ifbp-template>
        </ifbp-panel>
      </ifbp-panel-group>
    </ifbp-main-area>
    <!-- 尾部菜单-保存按钮 -->
    <ifbp-footer>
      <el-button type="default" @click="backInfo">取消</el-button>
      <el-button class="fr" type="primary" @click="addCourse">保存</el-button>
    </ifbp-footer>
  </ifbp-page>
</template>
<script>

  export default {
    data() {//页面初始化
      return {
        // 主表所需参数
        courseInfoFunnode: "TRAIN_COURSE", //funnode参数指定平台UI模板定义值
        courseInfoNexuskey: "CourseMaster",//funnode参数指定平台UI模板定义值
        courseInfoData: {},
        // 子表所需参数
        courseFormFunnode: "TRAIN_COURSE",//funnode参数指定平台UI模板定义值
        courseFormNexuskey: "coursedetail",//funnode参数指定平台UI模板定义值
        courseFormData: {}
      }
    },
   
    methods: {
      // 保存按钮操作
      addCourse() {
        this.$refs.courseInfoRef.validate(valid => {
          if (valid) {
            let data = this.$refs.courseInfoRef.getFormData();
            data.course = [this.$refs.courseFormRef.getFormData()];
            this.$http({
              url: "/ifbp-demo-web/course/create",//后台业务实现接口-新增
              method: "post",
              data: data,
              headers: {
                "Content-Type": "application/json"
              },
              dataType: "application/json"
            })
            .then(res => {
              if (res.data.success) {
                this.$message({
                  message: "添加成功",
                  type: 'success'
                });
                this.$refs.courseInfoRef.clearEdit();
                this.$refs.courseFormRef.clearEdit();
                this.$context.destroyCurrentTile();
                this.$router.push('/course');
              } else {
                this.$message({
                  message: res.data.error.errorMessage,
                  type: "error"
                });
              }
            })
            .catch(() => {
            });
          } else {
            this.$message("校验未通过");
          }
        });
      },

      /**
       *  一些控制页面状态的方法
       *  都在按钮上绑着
       **/
      // 返回list页面
      backInfo() {
        // 清空路由上下文的栈,使返回页面的面包屑没有异常
        this.$context.destroyCurrentTile();
        this.$router.push('/course');
      }
    }
  }
</script>