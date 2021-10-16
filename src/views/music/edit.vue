<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="500px"
    :before-close="handleClose"
  >
    <el-form
      ref="formData"
      :rules="rules"
      :model="formData"
      label-width="100px"
      label-position="right"
      style="width: 400px"
      status-icon
    >
      <el-form-item label="音乐文件：" prop="url">
        <el-upload
          class="avatar-uploader"
          action=""
          accept="audio/*"
          :show-file-list="false"
          :http-request="uploadMusic"
        >
          <el-button
            :loading="loading"
            size="small"
            type="primary"
          >点击上传</el-button>
          <div slot="tip" class="el-upload__tip">
            {{ formData.name || "只能上传音频文件" }}
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item label="排序：" prop="sort">
        <el-input-number
          v-model="formData.sort"
          :min="1"
          :max="10000"
          style="width: 300px"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          :loading="loading"
          size="mini"
          @click="submitForm('formData')"
        >确定</el-button>
        <el-button size="mini" @click="handleClose">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import commonApi from '@/api/common'

export default {
  props: {
    title: {
      // 弹窗的标题
      type: String,
      default: ''
    },
    visible: {
      // 弹出窗口，true弹出
      type: Boolean,
      default: false
    },
    formData: {
      // 提交表单数据
      type: Object,
      default: Function
    },
    remoteClose: {
      // 用于关闭窗口
      type: Function,
      default: null
    }
  },

  data() {
    const validateNull = (rule, value, callback) => {
      if (value === null) {
        callback(new Error('请选择音乐文件'))
      } else {
        callback() // 校验通过，直接放行
      }
    }
    return {
      loading: false,
      rules: {
        url: [
          // prop值
          {
            required: true,
            message: '请选择音乐文件',
            trigger: 'change',
            validator: validateNull
          }
        ],
        sort: [{ required: true, message: '请输入排序号', trigger: 'blur' }]
      }
    }
  },

  methods: {
    // 关闭窗口
    handleClose() {
      // 将表单清空
      this.$refs['formData'].resetFields()
      // 注意不可以通过  this.visible = false来关闭，因为它是父组件的属性
      this.remoteClose()
    },
    test() {
      console.log('test调用：', this.formData)
    },
    // 提交表单数据
    submitForm(formName) {
      console.log('validate前：', this.formData)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 校验通过，提交表单数据

          this.submitData()
        } else {
          // console.log('error submit!!');
          return false
        }
      })
    },
    // 上传音乐文件
    uploadMusic(file) {
      this.loading = true
      const data = new FormData()
      data.append('file', file.file)
      console.log(file.file)
      commonApi.addMusicFile(data).then((response) => {
        // 删除原音乐
        this.deleteMusic()
        // 回显
        this.formData.name = file.file.name
        this.formData.url = response.data
        // 停止加载
        this.loading = false
      })
    },
    // 删除音乐文件
    deleteMusic() {
      if (this.formData.url != null) {
        commonApi
          .deleteMusicFile(this.formData.url)
          .then((response) => console.log('delete success'))
      }
    },
    submitData() {
      console.log('表单：', this.formData)
      if (this.formData.id) {
        // 编辑
        commonApi.updateMusic(this.formData).then((response) => {
          response.code === 20000
            ? this.$message.success('修改成功')
            : this.$message.error('修改失败')
        })
        this.handleClose()
      } else {
        // 新增
        commonApi.addMusic(this.formData).then((response) => {
          response.code === 20000
            ? this.$message.success('新增成功')
            : this.$message.error('新增失败')
          this.handleClose()
        })
      }
    }
  }
}
</script>
