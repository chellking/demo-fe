<template>
  <ifbp-page type="detail">
    <ifbp-breadcrumb>典型页面</ifbp-breadcrumb>
    <ifbp-button-area>
        <el-button type="primary" @click="addtypicalDemo" slot="left">新增</el-button>
        <el-button  @click="multiDeleteDialgShow" v-show="showDeleteButton" slot="left">删除</el-button>
        <ifbp-search 
          :template-code="searchCode"
          @search="handleSearch">
        </ifbp-search>
    </ifbp-button-area>
    <ifbp-main-area type="list">
      <ifbp-template ref="typicalDemoTableRef"
                    tpl-id="typicalDemoTableId"
                    :funnode="typicalDemoTableFunnode"
                    :nexuskey="typicalDemoTableNexuskey"
                    :tpl-data="typicalDemoTableData"
                    show-type="table"
                    :tplResetFun="typicalDemoTableResetFun"
                    @selection-change="customerSelectionChange"
                    @edit-table-click="typicalDemoTableEditClick"
                    @delete-table-click="typicalDemoTableDeleteClick">
      </ifbp-template>
      <!--分页组件-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalElements"
        >
      </el-pagination>
    </ifbp-main-area>
  </ifbp-page>
</template>