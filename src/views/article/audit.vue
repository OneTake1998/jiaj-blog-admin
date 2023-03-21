<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="70%"
    :before-close="handleClose"
  >
    <el-form
      ref="formData"
      :model="formData"
      :rules="rules"
      label-width="100px"
      label-position="right"
    >
      <el-form-item label="标题：" prop="title">
        <el-input
          v-model="formData.title"
          maxlength="50"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="标签：" prop="labelIds">
        <el-cascader
          v-model="formData.labelIds"
          :options="labelOptions"
          style="display: block"
          :props="{
            multiple: true,
            emitPath: false,
            children: 'labelList',
            value: 'id',
            label: 'name',
          }"
          clearable
        />
      </el-form-item>
      <el-form-item label="主图：" prop="imageUrl">
        <el-upload
          class="avatar-uploader"
          action=""
          accept="image/*"
          :show-file-list="false"
          :http-request="uploadMainImg"
        >
          <img
            v-if="formData.imageUrl"
            :src="formData.imageUrl"
            class="avatar"
          >
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-form-item>
      <el-form-item label="是否公开：" prop="ispublic">
        <el-radio-group v-model="formData.ispublic">
          <el-radio :label="1">公开</el-radio>
          <el-radio :label="0">不公开</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="简介：" prop="summary">
        <el-input v-model="formData.summary" type="textarea" />
      </el-form-item>
      <el-form-item label="内容：" prop="content">
        <mavonEditor
          ref="md"
          v-model="formData.mdContent"
          :autofocus="false"
          @change="getMdHtml"
          @imgAdd="uploadContentImg"
          @imgDel="delConentImg"
        />
      </el-form-item>
      <el-form-item v-if="isEdit" align="center">
        <el-button type="warning" @click="handleSave()">保存</el-button>
        <el-button type="success" @click="handleRelease()">发布</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import api from '@/api/article'
import categoryApi from '@/api/category'
import commonApi from '@/api/common'
// 引入 user cookie
import { getUserInfo } from '@/utils/user'
// 引入 mavonEditor 组件和样式, 一定不要少了大括号
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

export default {
  // 注册为子组件
  components: { mavonEditor },

  props: {
    id: null, // 文章id
    isEdit: {
      // 是否编辑
      type: Boolean,
      default: true
    },
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
    remoteClose: Function // 用于关闭窗口
  },

  data() {
    const validateLable = (rule, value, callback) => {
      if (value && value.length > 5) {
        this.disabled = true // 禁止选择
        callback(new Error('最多可选5个标签'))
      } else {
        this.disabled = false // 可以选择
        callback() // 校验通过，直接放行
      }
    }

    const validateContent = (rule, value, callback) => {
      if (this.formData.mdContent && this.formData.htmlContent) {
        callback() // 校验通过，直接放行
      } else {
        callback(new Error('请输入文章内容'))
      }
    }
    return {
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        labelIds: [
          { required: true, message: '请选择标签', trigger: 'blur' },
          { validator: validateLable, trigger: 'change' }
        ],
        ispublic: [
          { required: true, message: '请选择是否公开', trigger: 'change' }
        ],
        // summary: [{ required: true, message: '请输入简介', trigger: 'blur' }],
        content: [
          { required: true, validator: validateContent, trigger: 'change' }
        ]
      },
      formData: {}, // 查询到的文章详情
      labelOptions: [] // 渲染分类标签级联下拉框
    }
  },

  watch: {
    // 监听
    visible(val) {
      // 监听visible的变化,将改变之后的值作为参数传入
      if (val) {
        this.getLabelOptions()
        // val 为true，且有文章ID，则打开窗口，打开之后查询文章详情
        if (this.id != null) this.getArticleById()
      }
    }
  },

  methods: {
    // 关闭窗口
    handleClose() {
      // 触发父组件关闭窗口
      this.remoteClose()
      //   清除数据
      this.formData = {}
    },
    // 保存到草稿箱 status:1 草稿 status:2 发布
    _editOrRelease(status) {
      // 验证数据
      this.$refs.formData.validate((valid) => {
        if (valid) {
          this.formData.status = status
          // 修改
          if (this.id != null) {
            // console.log(this.formData);
            api.editArticle(this.formData).then((response) => {
              // 处理响应结果提示
              this.$message({
                type: response.code === 20000 ? 'success' : 'error',
                message: response.message
              })

              // 关闭弹窗
              this.handleClose()
            })
          } else {
            // 新增
            const userInfo = JSON.parse(getUserInfo())
            this.formData.userId = userInfo.id
            this.formData.userImage = userInfo.imageUrl
            this.formData.nickName = userInfo.nickName
            console.log(this.formData)
            api.addArticle(this.formData).then((response) => {
              // 处理响应结果提示
              this.$message({
                type: response.code === 20000 ? 'success' : 'error',
                message: response.message
              })

              // 关闭弹窗
              this.handleClose()
            })
          }
        } else {
          return false
        }
      })
    },
    // 发布文章
    handleRelease() {
      this._editOrRelease(2)
    },
    // 保存文章
    handleSave() {
      this._editOrRelease(1)
    },

    // 查询文章详情
    async getArticleById() {
      const { data } = await api.getById(this.id)
      this.formData = data
    },

    // 获取全部标签
    async getLabelOptions() {
      const { data } = await categoryApi.getCategoryAndLabel()
      //  console.log(data);
      this.labelOptions = data
      console.log('this.labelOptions', this.labelOptions)
    },
    // 上传主图片
    uploadMainImg(file) {
      // 封装上传图片的表单对象
      const data = new FormData()
      data.append('file', file.file)
      commonApi
        .uploadImg(data)
        .then((response) => {
          if (response.code === 20000) {
            // 删除原图片
            this.deleteImg()
            // 回显上传后的图片
            this.formData.imageUrl = response.data
          }
        })
        .catch(() => {
          this.$message.error('上传图片失败')
        })
    },

    // 删除图片
    deleteImg() {
      if (this.formData.imageUrl) {
        // 如果有原图地址，则删除它，
        commonApi.deleteImg(this.formData.imageUrl)
      }
    },
    // mdContent md内容，htmlContent 转成html的内容
    getMdHtml(mdContent, htmlContent) {
      // console.log('mdContent', mdContent)
      // console.log('htmlContent', htmlContent)
      this.formData.mdContent = mdContent
      this.formData.htmlContent = htmlContent
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
    }
  }
}
</script>
<style lang="scss" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
