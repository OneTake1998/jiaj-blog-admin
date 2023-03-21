<template>
  <div class="app-container">
    <el-form ref="formData" :model="formData" label-width="100px" label-position="right">
      <el-form-item label="新浪：" prop="sinaUrl">
        <el-input v-model="formData.sinaUrl" maxlength="50" show-word-limit />
      </el-form-item>
      <el-form-item label="知乎：" prop="zhihuUrl">
        <el-input v-model="formData.zhihuUrl" maxlength="50" show-word-limit />
      </el-form-item>
      <el-form-item label="掘金：" prop="juejinUrl">
        <el-input v-model="formData.juejinUrl" maxlength="50" show-word-limit />
      </el-form-item>
      <el-form-item label="github：" prop="githubUrl">
        <el-input v-model="formData.githubUrl" maxlength="50" show-word-limit />
      </el-form-item>
      <el-form-item label="csdn：" prop="csdnUrl">
        <el-input v-model="formData.csdnUrl" maxlength="50" show-word-limit />
      </el-form-item>
      <el-form-item label="bilibili：" prop="bilibiliUrl">
        <el-input v-model="formData.bilibiliUrl" maxlength="50" show-word-limit />
      </el-form-item>
      <el-form-item label="简介：" prop="intro">
        <el-input v-model="formData.intro" type="textarea" />
      </el-form-item>
      <el-form-item label="简历：" prop="resume">
        <mavonEditor ref="md" v-model="formData.mdResume" :autofocus="false" @change="getMdHtml"
          @imgAdd="uploadContentImg" @imgDel="delConentImg" />
      </el-form-item>
      <el-form-item align="center">
        <el-button type="primary" @click="handleSave()">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import aboutApi from '@/api/about'
import commonApi from '@/api/common'
import { getUserInfo } from '@/utils/user'
export default {
  name: 'About',
  components: {
    mavonEditor
  },
  data() {
    return {
      formData: {
      }
    }
  },
  created() {
    //获取当前用户ID
    this.formData.uid = JSON.parse(getUserInfo()).id;
    aboutApi.getAbout(this.formData.uid).then((response) => {
      if (response.data != null) {
        this.formData = response.data
      }
    })
  },
  methods: {
    getMdHtml(mdContent, htmlContent) {
      this.formData.resume = htmlContent
      this.formData.mdResume = mdContent
    },
    // 上传内容图片（图片位置编号，File对象）
    uploadContentImg(pos, file) {
      // console.log('上传内容图片：', file)
      // 封装表单数据
      const fd = new FormData()
      fd.append('file', file)

      commonApi.uploadImg(fd).then((response) => {
        if (response.code === 20000) {
          // 上传成功，回显，
          this.$refs.md.$img2Url(pos, response.data)
        }
      })
    },

    delConentImg(urlAndFileArr) {
      const fileUrl = urlAndFileArr[0] // 图片url
      const file = urlAndFileArr[1] // File对象
      // console.log('删除内容图片', fileUrl, file)
      // 删除内容图片
      commonApi.deleteImg(fileUrl)
    },
    // 保存
    handleSave() {
      aboutApi.saveAbout(this.formData).then((response) => {
        // 处理响应结果提示
        this.$message({
          type: response.code === 20000 ? 'success' : 'error',
          message: response.message
        })
      })
    }
  }
}
</script>

<style></style>
