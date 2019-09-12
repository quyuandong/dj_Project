<template>
  <div class="con">
    <vue-particles color="#E04524" shapeType="circle" linesWidth="2" class="test"></vue-particles>
    <span>-</span>
    <el-form
      :model="ruleForm"
      :rules="rules2"
      ref="ruleForm"
      label-position="left"
      label-width="2px"
      class="demo-ruleForm login-container"
    >
      <h3 class="title">党建e家后台管理系统</h3>

      <el-form-item prop="email">
        <el-input type="text" v-model="ruleForm.email" auto-complete="off" placeholder="请输入email账号"></el-input>
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          type="password"
          v-model="ruleForm.password"
          auto-complete="off"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>

      <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
      <el-form-item style="width:100%;">
        <el-button
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleLogin"
          :loading="logining"
        >登录</el-button>

        <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { requestLogin } from "../api/api";

export default {
  data() {
    return {
      logining: false,
      ruleForm: {
        email: "123456@qq.com",
        password: "123456"
      },
      rules2: {
        email: [
          {
            type: "email",
            required: true,
            message: "邮箱格式不正确",
            trigger: "change"
          }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 6, max: 30, message: "长度在 6 到 30 个字符", trigger: "blur" }
        ]
      },
      checked: true
    };
  },
  methods: {
    //  重置密码
    handleReset2() {
      this.$refs.ruleForm.resetFields();
    },

    //登录
    handleLogin() {
      let _this = this;
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          _this.logining = true;
          let loginParams = {
            email: this.ruleForm.email,
            password: this.ruleForm.password
          };

          requestLogin(loginParams)
            .then(date => {
              console.log(date);
              _this.logining = false;
              _this.$message({
                message: "登录成功",
                type: "success"
              });
              localStorage.setItem("dj_login", date.token);
              _this.$router.push({ path: "/main" });
            })
            .catch(err => {
              _this.$message({
                message: "用户名或密码错误",
                type: "error"
              });
              _this.logining = false;
            });
        } else {
          _this.$message({
            message: "信息校验失败",
            type: "warning"
          });
          return false;
        }
      });
    }

    // 进行登录
    // handleLogin(){
    //     //取消错误提醒
    //     this.errors = {};
    //      console.log("-----");
    //
    //     //发送请求
    //     this.$axios.post("http://127.0.0.1:3000/api/mpage/login",{
    //         email: this.ruleForm.email,
    //         password: this.ruleForm.password
    //     })
    //     .then(res=>{
    //         console.log(res);
    //         this.$message({
    //             message: "登录成功",
    //             type: 'success'
    //         });
    //         localStorage.setItem("dj_login",res.data.token);
    //         this.$router.push({ path: '/table' });
    //     })
    //     .catch(error=>{
    //         this.$message({
    //             message: "用户名或密码错误",
    //             type: 'error'
    //         });
    //     });
    // },
  }
};
</script>

<style lang="scss" scoped>
.test {
  position: absolute;
  padding-top: -500 px;
  margin-top: -500 px;
  width: 100%;
}
/* .con{
  position: absolute;
  width: 100%;
  height: 300px;
} */
.login-container {
  /* height: 600px; */
  /* position: absolute; */
  /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
  .title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
  .remember {
    margin: 0px 0px 35px 0px;
  }
}
</style>