<template>
  <section>
    <!--工具条-->
    <!-- <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getFocus">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>-->

    <!--列表-->
    <el-table :data="list" align="center"  border  stripe highlight-current-row  style="width: 100%;">
      <el-table-column type="selection" width="60"></el-table-column>
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="pic" label="缩略图" width="210"  align="center">
        <template scope="scope">
          <el-image style="width: 100px; height: 100px" :src="scope.row.pic"></el-image>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="sort" label="排序" width="60" sortable></el-table-column> -->
      <el-table-column prop="url" label="链接" width="150"  align="center"></el-table-column>

      <el-table-column prop="status" label="状态" width="100" align="center" >
        <template scope="scope">
          <el-button
                  type="success"
                  v-if="scope.row.status==1"
                  @click="StatusChange(scope.$index,scope.row._id)"
          >已启用</el-button>
          <el-button
                  type="info"
                  v-if="scope.row.status==0"
                  @click="StatusChange(scope.$index,scope.row._id)"
          >已禁止</el-button>
        </template>
      </el-table-column>

      <el-table-column prop="title" label="标题" width="240"  align="center"></el-table-column>
      <el-table-column prop="do" label="操作" min-width="180"  align="center">
        <template scope="scope">
          <el-button size="small" @click="toEdit(scope.$index,scope.row)">编辑</el-button>
          <el-button type="danger" @click="doDel(scope.$index,scope.row)" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑弹框 -->
    <el-dialog title="编辑轮播图" :visible.sync="everyisEdit" :close-on-click-modal="false">
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
          <el-input value="图片示例，点击添加图片" />
          <el-upload
                  ref="upload"
                  name="uploadBtn"
                  class="avatar-uploader"
                  action="/api/focus/edit"
                  :file-list="addFocusform.fileList"
                  list-type="picture"
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
          <el-button @click.native="everyisEdit = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </section>
</template>


<script>
    import {
        getFocusList,
        doEditFocus,
        doDelFocus,
        changeFocusStatus
    } from "../../api/api";
    //import NProgress from 'nprogress'
    export default {
        data() {
            return {
                imgurl: "",
                //   表单验证
                rules: {
                    title: [{ required: true, message: "给个标题嘛~", trigger: "blur" }],
                    url: [{ required: true, message: "这个必须有", trigger: "blur" }],
                    pic: [{ required: true, message: "请上传图片", trigger: "blur" }],
                    sort: [
                        { required: true, message: "排序用数字区别，如 1", trigger: "blur" }
                    ]
                },
                addFocusform: {
                    _id: "",
                    title: "",
                    url: "",
                    status: "",
                    sort: "",
                    pic: ""
                },
                everyisEdit: false,
                filters: {
                    name: ""
                },
                loading: false,
                list: [],
                ed: { _id: "" }
            };
        },
        methods: {
            StatusChange(index, id) {
                changeFocusStatus(id).then(ref => {
                    this.$message({
                        type: "success",
                        message: "更改成功！"
                    });
                    getFocusList()
                    .then(res => {
                        console.log(res.data);
                        this.list = res.data;
                        this.loading = false;
                    })
                    .catch(err => {
                        this.loading = false;
                    });
                });
            },
            doDel(index, row) {
                this.$confirm("确认删除该轮播图？", "提示", { type: "warning" }).then(
                        () => {
                            this.ed = Object.assign({}, row);
                            doDelFocus(this.ed._id).then(ref => {
                                this.loading = true;
                                getFocusList()
                                .then(res => {
                                    console.log(res.data);
                                    this.list = res.data;
                                    this.loading = false;
                                })
                                .catch(err => {
                                    this.loading = false;
                                });
                            });
                        }
                );
            },
            toEdit(index, row) {
                this.everyisEdit = true;
                this.addFocusform = Object.assign({}, row);
            },
            //获取用户列表
            getFocus: function() {
                this.loading = true;
                getFocusList()
                .then(res => {
                    // console.log(res.data);
                    this.list = res.data;
                    console.log(this.list);
                    this.loading = false;
                })
                .catch(err => {
                    this.loading = false;
                });
            },
            imgChange(file, fileList) {
                this.addFocusform.pic = URL.createObjectURL(file.raw);
            },
            beforeUpload(file) {
                const isIMAGE = file.type === "image/jpeg" || "image/jpg" || "image/png";
                const isLt5M = file.size / 1024 / 1024 < 5;
                if (!isIMAGE) {
                    this.$message.error("上传文件只能是图片格式!");
                }
                if (!isLt5M) {
                    this.$message.error("上传图片大小不能超过 5MB!");
                }
                return isIMAGE && isLt5M;
            },
            // 点确定时触发事件
            //触发 httpRequest 事件
            commitSave() {
                this.$refs.upload.submit();
            },
            httpRequest(param) {
                // param是自带参数。 this.$refs.upload.submit() 会自动调用httpRequest方法.在里面取得file
                this.$refs["addFocusform"].validate(valid => {
                    if (valid) {
                        var fileObj = param.file; // 相当于input里取得的files
                        var fd = new FormData(); // FormData 对象
                        fd.append("file", fileObj); // 文件对象
                        // 其他参数
                        fd.append("id", this.addFocusform._id);
                        fd.append("pic", this.addFocusform.pic);
                        fd.append("title", this.addFocusform.title);
                        fd.append("sort", this.addFocusform.sort);
                        fd.append("status", this.addFocusform.status);
                        fd.append("url", this.addFocusform.url);
                        doEditFocus(fd)
                        .then(rsp => {
                            // 直接提交给后台。
                            this.$message({
                                type: "success",
                                message: "操作成功"
                            });
                            this.everyisEdit = false;
                            this.getFocus();
                        })
                        .catch(error => {
                            this.everyisEdit = false;
                            console.log("!!!!!!!!!!!!!!!!!!!!!!!");
                        });
                    } else {
                        this.everyisEdit = false;
                        console.log("error httpRequest submit!!");
                        return false;
                    }
                });
            }
        },
        mounted() {
            this.getFocus();
        }
    };
</script>

<style scoped>
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
    width: 178px;
    height: 178px;
    display: block;
  }
</style>