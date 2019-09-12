<template>
    <section>

        <el-form :model="addForm" label-width="100px" :rules="addFormRules" style="margin-top: 25px" ref="addForm">

            <el-tabs type="border-card">

                <el-tab-pane label="基本设置">
                    <el-form-item label="新闻标题">
                        <el-input v-model="addForm.title" auto-complete="off"></el-input>
                    </el-form-item>

                    <el-form-item label="新闻作者">
                        <el-input v-model="addForm.autor" auto-complete="off"></el-input>
                    </el-form-item>

                    <el-form-item label="新闻类型" >
                        <el-input v-model="addForm.type" auto-complete="off"></el-input>
                    </el-form-item>

                    <el-form-item label="新闻分类">

                        <el-input v-model="addForm.articlecate" auto-complete="off"></el-input>
                        <!--<el-upload-->
                                <!--action="https://jsonplaceholder.typicode.com/posts/"-->
                                <!--list-type="picture-card"-->
                                <!--limit="1"-->
                                <!--:on-preview="handlePictureCardPreview"-->
                                <!--:on-remove="handleRemove">-->
                            <!--<i class="el-icon-plus"></i>-->
                        <!--</el-upload>-->
                        <!--<el-dialog :visible.sync="dialogVisible">-->
                            <!--<img width="100%" :src="dialogImageUrl" alt="">-->
                        <!--</el-dialog>-->

                    </el-form-item>

                </el-tab-pane>

                <el-tab-pane label="内容设置">
                    <el-form-item label="新闻内容" class="beditor">

                        <quill-editor class="editor" v-model="addForm.content" auto-complete="off"></quill-editor>
                    </el-form-item>
                </el-tab-pane>

                <el-tab-pane label="SEO设置">
                    <el-form-item label="新闻关键字">
                        <el-input v-model="addForm.keywords" ></el-input>
                    </el-form-item>
                    <el-form-item label="新闻描述">
                        <el-input type="textarea" v-model="addForm.description"></el-input>
                    </el-form-item>
                </el-tab-pane>

                <el-col align="center"  class="toolbar">
                    <el-button width="100px"  @click="resetForm()">重置</el-button>
                    <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
                </el-col>
            </el-tabs>

        </el-form>
        <!--tab选项卡-->


    </section>
</template>






<script>
    import { getNewsListPage, deleteNew, batchRemoveUser,  addNews } from '../../api/api';

    export default {
        data() {
            return {
                dialogImageUrl: '', //上传图片路径
                dialogVisible: false,   //是否显示上传的图片
                addLoading:false,
                addFormRules: {
                    title: [
                        { required: true, message: '请输入新闻标题', trigger: 'blur' }
                    ]
                },
                //新增界面数据
                addForm: {
                    "title": "",
                    "autor": "",
                    "description": "",
                    "content": "",
                    "keywords": "",
                    "type": "",
                    "articlecate": "",
                }
            }
        },
        created(){

        },
        methods: {


            getCateList(){

            },

            //上传图片
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },

            //重置表单
            resetForm(){
                this.addForm = {
                    "title": "",
                    "autor": "",
                    "description": "",
                    "content": "",
                    "keywords": "",
                    "type": "",
                    "articlecate": "",
                }
            },



            //新增
            addSubmit: function () {

                this.$refs.addForm.validate((valid) => {
                    if (valid) {

                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            // let para = Object.assign({}, this.addForm);

                            addNews(this.addForm).then((res) => {
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.resetForm();
                                this.$router.push({ path: '/newsList' });
                            });
                        });
                    }
                });
            },

        },
    }

</script>

<style scoped>
    .beditor{
        height: 400px;
    }
    .editor{
        height: 300px;
    }
</style>