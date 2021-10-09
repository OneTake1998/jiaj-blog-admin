<template>
  <div class="app-container">
    <!-- 条件查询 -->
    <el-form :inline="true" size="mini">
      <el-form-item>
        <el-button
          icon="el-icon-circle-plus-outline"
          type="primary"
          @click="openView()"
          >新增</el-button
        >
      </el-form-item>
    </el-form>

    <!-- stripe 带斑马纹 -->
    <el-table :data="list" stripe border style="width: 100%">
      <el-table-column
        align="center"
        type="index"
        label="序号"
        width="60"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="name"
        label="音乐名称"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="sort"
        label="排序"
      ></el-table-column>
      <el-table-column align="left" label="操作" width="210">
        <template slot-scope="scope">
          <el-button type="primary" @click="openView(scope.row.id)" size="mini"
            >编辑</el-button
          >
          <el-button
            v-if="scope.row.status !== 0"
            type="danger"
            @click="handleDelete(scope.row.id)"
            size="mini"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <edit
      :title="edit.title"
      :visible="edit.visible"
      :formData="edit.formData"
      :remoteClose="remoteClose"
    />
  </div>
</template>
<script>
import commnApi from "@/api/common";
import edit from "./edit.vue";
export default {
  name: "Music",
  components: {
    edit,
  },
  data() {
    return {
      list: [],
      edit: {
        title: "",
        visible: false,
        formData: {},
      },
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    //获取页面数据
    fetchData() {
      commnApi.getMusicList().then((response) => {
        this.list = response.data;
      });
    },
    //打开视图
    openView(val) {
      if (val != null) {
        //编辑
        this.edit.title = "编辑";
        commnApi.queryMusic(val).then((response) => {
          console.log(response);
          this.edit.formData = response.data;
        });
        this.edit.visible = true;
      } else {
        //   新增
        this.edit.title = "新增";
        this.edit.formData = {};
        this.edit.visible = true;
      }
    },
    //删除音乐
    handleDelete(val) {
      this.$confirm("确认删除这条记录吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        commnApi
          .deleteMusic(val)
          .then((response) =>
            response.code == 20000
              ? this.$message.success("删除成功")
              : this.$message.error("删除失败")
          );
        this.fetchData();
      });
    },
    // 子组件会触发此事件方法来关闭窗口
    remoteClose() {
      this.edit.formData = {};
      this.edit.visible = false;
      this.fetchData();
    },
  },
};
</script>

<style>
</style>