<template>
  <div class="app-container">
    <!-- 个人信息 -->
    <el-row class="main-top">
      <div class="avatar">
        <el-tooltip content="点击上传头像" effect="light">
          <el-upload
            accept="image/*"
            action=""
            :show-file-list="false"
            :http-request="uploadMainImg"
          >
            <el-avatar :size="120" :src="this.userInfo.imageUrl">{{
              userInfo.nickName
            }}</el-avatar>
          </el-upload>
        </el-tooltip>
      </div>
      <div class="info">
        <div>
          <span class="meta-block">&nbsp;&nbsp;&nbsp;昵称：</span>
          <span class="name">{{ userInfo.nickName }}</span>
        </div>
        <div>
          <span class="meta-block">用户名：</span>
          <span class="name">{{ userInfo.username }}</span>
        </div>
      </div>
    </el-row>
    <el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="修改个人资料" name="user">
          <user-edit
            :loading="loading"
            :formData="userInfo"
            @submitForm="submitUserForm"
          />
        </el-tab-pane>
        <el-tab-pane label="修改密码" name="password">
          <user-password
            :loading="loading"
            :formData="passwordData"
            @submitForm="submitPasswordForm"
          />
        </el-tab-pane>
      </el-tabs>
    </el-row>
  </div>
</template>

<script>
import UserEdit from "@/components/user/Edit";
import UserPassword from "@/components/user/Password";
import commonApi from "@/api/common";
import { updateUserInfo, updatePassword } from "@/api/user";
import { getUserInfo, setUserInfo } from "@/utils/user";
export default {
  name: "User",
  components: {
    UserEdit,
    UserPassword,
  },
  data() {
    return {
      activeName: "user",
      loading: false,
      userInfo: {
        imageUrl: "",
      },
      passwordData: {
        // 修改密码表单
        userId: null,
      },
    };
  },
  mounted() {
    this.userInfo = JSON.parse(getUserInfo());
    this.passwordData.userId = this.userInfo.id;
  },
  methods: {
    // 切换标签页
    handleClick(tab, event) {
      //   console.log(tab, event);
    },

    // 上传头像
    uploadMainImg(file) {
      // 封装上传头像表单数据
      const data = new FormData();
      data.append("file", file.file);
      commonApi
        .uploadImg(data)
        .then((response) => {
          console.log(response);
          if (response.code === 20000) {
            // 删除原图片
            this.deleteImg();
            // 回显上传后的图片
            this.userInfo.imageUrl = response.data;
            // 将用户头像url更新到数据库中
            updateUserInfo(this.userInfo);
            this.$message.success("修改成功");
          }
        })
        .catch(() => {
          this.$message.error("上传头像失败");
        });
    },

    // 删除头像, 上传成功后删除原来的头像
    deleteImg() {
      if (this.userInfo.imageUrl) {
        // 如果有原图地址，则删除它，
        commonApi.deleteImg(this.userInfo.imageUrl);
      }
    },

    // 提交修改个人资料
    async submitUserForm() {
      this.loading = true;
      // 提交修改的个人信息
      // this.userInfo
      const { code, message } = await updateUserInfo(this.userInfo);
      if (code === 20000) {
        this.$message.success("修改成功");
        setUserInfo(this.userInfo);
      } else {
        this.$message.error(message);
      }
      this.loading = false;
    },

    // 修改密码
    async submitPasswordForm() {
      console.log(this.passwordData);
      // 确认中
      this.loading = true;
      console.log(this.passwordData);
      await updatePassword(this.passwordData)
        .then((response) => {
          //     // 清空修改密码表单
          //   this.passwordData.oldPassword = {};
          this.$message.success("修改成功");
          this.loading = false;
          //   this.$store.dispatch("user/logout");
        })
        .catch((error) => {
          this.$message.error(error.message);
        });
      this.loading = false;
    },
    //
  },
};
</script>

<style>
</style>