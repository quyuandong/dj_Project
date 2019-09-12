<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.title" @input='changeNews'  placeholder="标题"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary"  v-on:click="findNews">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="news" border  stripe highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection" align="center" width="55">
            </el-table-column>
            <el-table-column type="index" align="center" label="ID" width="60">
            </el-table-column>
            <el-table-column prop="title" label="标题" align="center">
            </el-table-column>

            <el-table-column prop="add_time" :formatter="dateFormat" align="center" label="发布时间" width="250" sortable>
            </el-table-column>

            <el-table-column prop="type" align="center" label="新闻类别" width="100" >
            </el-table-column>

            <el-table-column label="操作" width="200" align="center">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>

                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>


        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="batchRemoves" :disabled="this.sels.length===0">批量删除</el-button>


            <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[5, 10, 15, 20]"
                    :page-size="5"
                    layout="total, sizes, prev, pager, next"
                    style="float:right;"
                    :total="total">
            </el-pagination>


        </el-col>


        <!--编辑界面-->
        <el-dialog title="编辑" :visible.sync="dialogFormVisible " >
            <el-form :model="editForm"  label-width="100px" :rules="editFormRules" ref="editForm">

                <el-tabs type="border-card">
                    <el-tab-pane label="基本设置">
                        <el-form-item label="新闻标题">
                            <el-input v-model="editForm.title" auto-complete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="新闻作者">
                            <el-input v-model="editForm.autor" auto-complete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="新闻类型" >
                            <el-input v-model="editForm.type" auto-complete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="新闻分类">
                            <el-input v-model="editForm.articlecate" auto-complete="off"></el-input>
                        </el-form-item>

                    </el-tab-pane>

                    <el-tab-pane label="内容设置">
                        <el-form-item label="新闻内容" class="beditor">
                            <quill-editor class="editor" v-model="editForm.content" auto-complete="off"></quill-editor>
                        </el-form-item>
                    </el-tab-pane>

                    <el-tab-pane label="SEO设置">
                        <el-form-item label="新闻关键字">
                            <el-input v-model="editForm.keywords" ></el-input>
                        </el-form-item>
                        <el-form-item label="新闻描述">
                            <el-input type="textarea" v-model="editForm.description"></el-input>
                        </el-form-item>
                    </el-tab-pane>

                    <el-col align="center"  class="toolbar">
                        <el-button width="100px"  @click="resetForm()">重置</el-button>
                        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
                    </el-col>
                </el-tabs>

            </el-form>
        </el-dialog>


    </section>
</template>

<script>
    import { getNewsListPage, deleteNew, batchRemove, editNews} from '../../api/api';

    export default {
        data() {
            return {
                filters: {
                    title: ''
                },
                news: [],
                listLoading: false,
                sels: [],//列表选中列

                editLoading: false,
                editFormRules: {
                    title: [
                        { required: true, message: '请输入新闻标题', trigger: 'blur' }
                    ]
                },
                //编辑界面数据
                editForm: {
                    "title": "",
                    "autor": "",
                    "description": "",
                    "content": "",
                    "keywords": "",
                    "type": "",
                    "articlecate": "",
                },
                editForm_reset:{},
                dialogFormVisible: false,

                //分页
                total: 0,
                pageSize:5,
                currentPage: 1,

            }
        },
        methods: {

            //每页大小发生改变
            handleSizeChange(val) {
                this.pageSize = val;
                this.currentPage = 1;
                this.getNews();
            },

            //当前页发生改变时
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getNews();
            },

            //查找信息
            findNews(){
                this.getNews();
            },

            //监听当前文本的变化
            changeNews(){
                if(this.filters.title == ""){
                    this.getNews();
                }
            },


            //格式化时间
            dateFormat:function(row,column){
                var t=new Date(row.add_time);//row 表示一行数据, updateTime 表示要格式化的字段名称
                return t.getFullYear()+"-"+(t.getMonth()+1)+"-"+t.getDate()+" "+t.getHours()+":"+t.getMinutes()+":"+t.getSeconds();
            },


            //获取用户列表
            getNews() {
                let para = {
                    title:this.filters.title,
                    pageSize:this.pageSize,
                    currentPage: this.currentPage,
                    sort_attr:'add_time',
                    sort_value:-1
                };
                this.listLoading = true;
                getNewsListPage(para).then((res) => {
                     console.log(res);
                    this.news = res.data.news;
                    this.total = res.data.count;
                    this.listLoading = false;
                });
            },


            //删除一条记录
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let para = { id: row._id };
                    deleteNew(para).then((res) => {
                        this.listLoading = false;
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getNews();
                    });
                }).catch(() => {

                });
            },
            //显示编辑界面
            handleEdit: function (index, row) {
                this.dialogFormVisible = true;
                this.editForm_reset = Object.assign({}, row);
                this.editForm = Object.assign({}, row);
            },

            //编辑
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            let para = Object.assign({}, this.editForm);
                            editNews(para).then((res) => {
                                this.editLoading = false;
                                this.$message({
                                    message: '修改成功',
                                    type: 'success'
                                });
                                this.$refs['editForm'].resetFields();
                                this.dialogFormVisible = false;
                                this.getNews();
                            });
                        });
                    }
                });
            },

            //重置编辑表单
            resetForm(){
                this.editForm = this.editForm_reset;
            },

            //批量获取数据
            selsChange: function (sels) {
                this.sels = sels;
            },

            //批量删除
            batchRemoves: function () {
                let collection = "New";
                let ids = this.sels.map(item => item._id);
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let para = { collection,ids: ids };
                    console.log('------------------------------------');
                    console.log(para);
                    batchRemove(para).then((res) => {
                        this.listLoading = false;
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getNews();
                    });
                }).catch(() => {

                });
            }

        },
        mounted() {
            this.getNews();
        }
    }

</script>

<style scoped>
    .beditor{
        height: 320px;
    }
    .editor{
        height: 200px;
    }
</style>