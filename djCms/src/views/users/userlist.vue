<template>
  <section>
    <!--头部工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.username" @input='changeUsers'  placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"  v-on:click="findUsers">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">添加用户</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdds">批量导入用户信息</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--显示用户信息-->
    <el-table :data="tableData" border  stripe highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
      <el-table-column type="selection" align="center" width="55"></el-table-column>

      <el-table-column type="index" align="center" ></el-table-column>

      <el-table-column prop="username" align="center"  label="姓名"></el-table-column>

      <el-table-column prop="document" align="center" label="证件" ></el-table-column>

      <el-table-column prop="tel" align="center" label="电话" ></el-table-column>

      <el-table-column prop="integral" align="center" label="积分" width="180"></el-table-column>
      <el-table-column  align="center" label="操作">
        <template slot-scope="scope">
          <el-button :type="tableData[scope.$index].status == 1 ? 'primary' : 'danger'" size="mini" @click="handleEdit(scope.$index, scope.row)">{{tableData[scope.$index].status == 1 ? '启用' : '禁用'}}</el-button>
          <el-button size="mini" type="danger" @click="reset(scope.$index, scope.row)">密码重置</el-button>

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

    <!--新增用户界面-->
    <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="80px"  ref="addForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="证件号" prop="document">
          <el-input v-model="addForm.document" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="tel">
          <el-input v-model="addForm.tel" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="积分" prop="integral">
          <el-input  v-model="addForm.integral"></el-input>
        </el-form-item>

        <el-form-item label="状态">
          <el-radio-group v-model="addForm.status">
            <el-radio class="radio" :label="1">通过</el-radio>
            <el-radio class="radio" :label="0">未审核</el-radio>
          </el-radio-group>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>



  </section>
</template>

<script>
import {getUserList,changeStatus,resetPassword,batchRemove,addUsers} from "@/api/api"
export default {
  data() {
      return{

        tableData: [],
          sels: [],//列表选中列
          listLoading :false,
          filters: {
              username: ''
          },


          //分页
          total: 0,
          pageSize:5,
          currentPage: 1,

          addFormVisible: false,
          addLoading: false,
          //新增界面数据
          addForm: {
              username:"",
              document:"",
              tel:"",
              integral:"",
              status:0,
          },
      }
    },


  created() {
    this.getList();
  },
  methods:{

      handleEdit(index,row){
        let a = {
          collectionName:'User',
          id:row._id
        };

        changeStatus(a).then(res=>{
          this.getList()
        })
      },
      //重置密码
      reset(index,row){

          resetPassword(row).then(res=>{
              this.$message({
                  type:"success",
                  message:"密码重置成功"
              })
          }).catch(error =>{
              this.$message({
                  type:"error",
                  message:"密码重置失败"
              })
          } )
      },

      //每页大小发生改变
      handleSizeChange(val) {
          this.pageSize = val;
          this.currentPage = 1;
          this.getList();
      },

      //当前页发生改变时
      handleCurrentChange(val) {
          this.currentPage = val;
          this.getList();
      },

      //查找信息
      findUsers(){
          this.getList();
      },

      //监听当前文本的变化
      changeUsers(){
          if(this.filters.username == ""){
              this.getList();
          }
      },

      //获取用户列表
      getList(){
          this.listLoading = true;
          let para = {
              username:this.filters.username,
              pageSize:this.pageSize,
              currentPage: this.currentPage,
              sort_attr:'add_time',
              sort_value:-1
          };
        getUserList(para).then(res=>{
            this.tableData = res.news;
            this.total = res.count;
            this.listLoading = false;
        })
      },

      //添加用户信息
      handleAdd(){
          this.addFormVisible = true;
      },

      //提交按钮提交信息
      addSubmit(){
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.addLoading = true;

              addUsers(this.addForm).then((res) => {
                  this.$message({
                      message: '添加成功',
                      type: 'success'
                  });
                  this.addFormVisible = false;
                  this.$refs['addForm'].resetFields();
                  this.addLoading = false;
                  this.getList();
              });
          });
      },

      //批量获取数据
      selsChange: function (sels) {
          this.sels = sels;
      },

      //批量删除
      batchRemoves: function () {
          let collection = "User";
          let ids = this.sels.map(item => item._id);
          this.$confirm('确认删除选中记录吗？', '提示', {
              type: 'warning'
          }).then(() => {
              this.listLoading = true;
              let para = { collection,ids: ids };

              batchRemove(para).then((res) => {
                  this.listLoading = false;
                  this.$message({
                      message: '删除成功',
                      type: 'success'
                  });
                  this.getList();
              });
          }).catch(() => {

          });
      }

  }
};
</script>

