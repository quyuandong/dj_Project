<template>
  <el-form
    ref="addFocusform"
    :model="addFocusform"
    label-width="80px"
    style="margin:20px;width:60%;min-width:600px;"
    :rules="rules"
  >
    <el-form-item label="标题:" prop="title">
      <el-input v-model="addFocusform.title"></el-input>
    </el-form-item>
    <el-form-item label="链接:" prop="url">
      <el-input v-model="addFocusform.url"></el-input>
    </el-form-item>
    <el-form-item label="排序:" prop="sort">
      <el-input v-model="addFocusform.sort"></el-input>
    </el-form-item>

    <el-form-item label="状态:" prop="status">
      <el-select v-model="addFocusform.status" placeholder="默认启用">
        <el-option label="启用" value="1"></el-option>
        <el-option label="禁止" value="0"></el-option>
      </el-select>
    </el-form-item>

    <!-- 图片上传 -->
    <el-form-item label="图片:" prop="pic">
      <el-input v-if="false" v-model="addFocusform.pic" />
      <el-upload
        ref="upload"
        class="avatar-uploader"
        action="/api/focus/add"
        :file-list="addFocusform.fileList"
        list-type="picture-card"
        :auto-upload="false"
        multipart
        :http-request="httpRequest"
        :on-change="imgChange"
        :before-upload="beforeUpload"
        :data="addFocusform"
      >
        <img v-if="addFocusform.pic" :src="addFocusform.pic" class="avatar" alt />
        <i v-else class="el-icon-plus avatar-uploader-icon" />
      </el-upload>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="commitSave">确认</el-button>
      <el-button @click.native.prevent>取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { add_Focus } from "../../api/api";
export default {
  data() {
    return {
      //   表单验证
      rules: {
        title: [{ required: true, message: "给个标题嘛~", trigger: "blur" }],
        url: [{ required: true, message: "这个必须有", trigger: "blur" }],
        status: [{ required: true, message: "这个可以有", trigger: "blur" }],
        pic: [{ required: true, message: "请上传图片", trigger: "blur" }],
        sort: [
          { required: true, message: "排序用数字区别，如 1", trigger: "blur" }
        ]
      },
      addFocusform: {
        title: "",
        url: "",
        status: "",
        sort: "",
        pic: "",
        fileList: []
      }
    };
  },
  methods: {
    imgChange(file, fileList) {
      this.addFocusform.pic = URL.createObjectURL(file.raw);
      if (file.name) {
        this.upload_flag = true;
      }
    },
    beforeUpload(file) {
      console.log(file);
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        this.$message.error("上传图片大小不能超过 5MB!");
      }
      return isLt5M;
    },
    //触发 httpRequest 事件
    commitSave() {
      // 点确定时触发事件
      this.$refs.upload.submit();
    },
    httpRequest(param) {
      // param是自带参数。 this.$refs.upload.submit() 会自动调用httpRequest方法.在里面取得file
      this.$refs["addFocusform"].validate(valid => {
        if (valid) {
          var fileObj = param.file; // 相当于input里取得的files
          var fd = new FormData(); // FormData 对象
            fd.append("fileList",fileObj)
          fd.append("pic", this.addFocusform.pic); // 文件对象
          // 其他参数
          fd.append("title", this.addFocusform.title);
          fd.append("sort", this.addFocusform.sort);
          fd.append("status", this.addFocusform.status);
          fd.append("url", this.addFocusform.url);
          add_Focus(fd)
            .then(rsp => {
              // 直接提交给后台。
              this.$message({
                type: "success",
                message: "操作成功"
              });
              this.$router.push({ path: "/focus_list" });
            })
            .catch(error => {
              console.log("!!!!!!!!!!!!!!!!!!!!!!!");
            });
        } else {
          console.log("error httpRequest submit!!");
          return false;
        }
      });
    }
  }
};
</script>
<style>
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
.avatar-uploader-icon .el-upload--picture-card {
  font-size: 28px;
  color: #8c939d;
  width: 200px;
  height: 200px;
  line-height: 200px;
  text-align: center;
}
.avatar {
  width: 200px;
  height: 200px;
  display: block;
}
</style>