<template>
  <div>
    <el-form
      ref="form"
      :model="form"
      label-width="40px"
      @submit.prevent="onSubmit"
      style="margin:20px;width:85%;min-width:600px;"
    >
      <el-form-item label="描述">
        <el-input v-model="form.description"></el-input>
      </el-form-item>
      <el-form-item label="内容">
        <quill-editor class="editor" v-model="form.content"></quill-editor>
      </el-form-item>

      <el-form-item class="btn">
        <el-button type="primary" @click="onSubmit()">立即创建</el-button>
        <el-button @click="clearValidate()">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { CommentAdd } from "../../api/api";
export default {
  data() {
    return {
      form: {
        description: "",
        content: ""
      }
    };
  },
  methods: {
    onSubmit() {
      // console.log(this.form);
      CommentAdd(this.form).then(res => {
        if (res) {
          // console.log(res);
          this.$message({
            message: "添加成功",
            type: "success"
          });
          this.$router.push('/CommentList')
        }
      });
    },
    clearValidate(){
      this.form = {
        description:'',
        content:''
      }
    }
  }
};
</script>
<style scoped>
.editor {
  width: 100%;
  height: 220px;
}
.btn {
  margin-top: 143px;
}
</style>