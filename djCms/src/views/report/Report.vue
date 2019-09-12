<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.username" @input='changeUsers'   placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="findUsers">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd()">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table
      :data="users"
      highlight-current-row
      v-loading="listLoading"
      @selection-change="selsChange"
      style="width: 100%;"
      border
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="username" label="用户名" width="120"  align="center">
      </el-table-column>



      <el-table-column align="center" label="状态">
        <template scope = "scope">
          <el-button size="small" @click="changeStatus(scope.$index, scope.row)" :type="users[scope.$index].status == 1 ? 'success':'info'">{{users[scope.$index].status == 1?"已审核":'未审核'}}</el-button>
        </template>
      </el-table-column>


      <el-table-column
        prop="add_time"
        label="时间"
        sortable
        :formatter="dateFormat"
        width="250"
        align="center"
      ></el-table-column>
      <el-table-column prop="reason" label="理由" width="200" align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="300">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">查看详情</el-button>
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
    <el-dialog title="编辑汇报列表" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" readonly auto-complete="off"></el-input>
        </el-form-item>
        <!-- 使用element-ui的radio组件，当label的值等于v-model的值时，radio就会默认选中此项，但是当v-model的值是动态时，你会发现根本选中不了 -->
        <el-form-item label="状态">
          <el-radio-group readonly v-model="editForm.status">
            <el-radio class="radio" v-if="editForm.status==1" :label="editForm.status">已审核</el-radio>
            <el-radio class="radio" v-else :label="editForm.status">未审核</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="添加时间">
          <el-input type="textarea" readonly v-model="editForm.add_time" :formatter="dateFormat"></el-input>
        </el-form-item>
        <el-form-item label="原因">
          <el-input type="textarea" readonly v-model="editForm.reason"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">确定</el-button>
      </div>
    </el-dialog>

    <!--新增界面-->
    <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" auto-complete="off"></el-input>
        </el-form-item>
        <!--<el-form-item label="状态">-->
          <!--<el-radio-group v-model="addForm.status">-->
            <!--<el-radio class="radio" :label="1">通过</el-radio>-->
            <!--<el-radio class="radio" :label="0">未审核</el-radio>-->
          <!--</el-radio-group>-->
        <!--</el-form-item>-->

        <el-form-item label="状态">
          <el-radio-group v-model="addForm.status">
            <el-radio class="radio" :label="1">通过</el-radio>
            <el-radio class="radio" :label="0">未审核</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="原因">
          <el-input type="textarea" v-model="addForm.reason"></el-input>
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
import util from "../../common/js/util";
//import NProgress from 'nprogress'
import { getReportList, getReportDel, addReport,changeStatus,batchRemove
} from "../../api/api";

export default {
  data() {
    return {
      filters: {
        name: ""
      },
      users: [],
        filters: {
            username: ''
        },
        //分页
        total: 0,
        pageSize:5,
        currentPage: 1,
      listLoading: false,
      sels: [], //列表选中列
      //编辑界面是否显示
      editFormVisible: false,
      editLoading: false,
      editFormRules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }]
      },
      //编辑界面数据
      editForm: {
        //   这个地方可以绑定的数据库中 id
        username: "",
        status: "",
        add_time: "",
        reason: ""
      },
      //新增界面是否显示
      addFormVisible: false,
      addLoading: false,
      addFormRules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }]
      },
      //新增界面数据
      addForm: {
        username: "",
        status: 0,
        reason: ""
      },
      Report: "Report"
    };
  },
  methods: {

      //更改状态
      changeStatus(index, row){
          let a = {
              collectionName:'Report',
              id:row._id
          };
          changeStatus(a).then(res=>{
              this.getReport()
          })
      },

      //每页大小发生改变
      handleSizeChange(val) {
          this.pageSize = val;
          this.currentPage = 1;
          this. getReport();
      },

      //当前页发生改变时
      handleCurrentChange(val) {
          this.currentPage = val;
          this. getReport();
      },

      //查找信息
      findUsers(){
          this. getReport();
      },

      //监听当前文本的变化
      changeUsers(){
          if(this.filters.username == ""){
              this. getReport();
          }
      },

    //获取用户列表
    getReport() {
        let para = {
            username:this.filters.username,
            pageSize:this.pageSize,
            currentPage: this.currentPage,
            sort_attr:'add_time',
            sort_value:-1
        };
      getReportList(para)
        .then(res => {
          this.users = res.data.news;
          this.total = res.data.count;
          this.listLoading = false;
        })
        .catch(err => {
          console.log("err");
        });
    },
    //删除
    handleDel: function(index, row) {
      // index  每行的行数 row对象 这条的数据
      console.log(index, row);
      console.log(this.Report);

      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      }).then(() => {
        this.listLoading = true;
        //NProgress.start();
        let para = { id: row._id, collection: this.Report };
        getReportDel(para).then(res => {
          this.listLoading = false;
          this.$message({
            message: "删除成功",
            type: "success"
          });
          // 删除成功后 调接口 打印汇报总列表
          this.getReport();
        });
      });

    },

    //显示编辑界面
    handleEdit: function(index, row) {
      console.log(index);

      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
      //   console.log(Object.assign({}, row));
    },

    //显示新增界面
    handleAdd: function() {
      //   console.log("add");
      this.addFormVisible = true;
      this.addForm={
          username: "",
          status: 0,
          reason: ""
        }
    },
    //编辑
    editSubmit: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            //NProgress.start();
            let para = Object.assign({}, this.editForm);
            para.birth =
              !para.birth || para.birth == ""
                ? ""
                : util.formatDate.format(new Date(para.birth), "yyyy-MM-dd");
            editUser(para).then(res => {
              this.editLoading = false;
              //NProgress.done();
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.$refs["editForm"].resetFields();
              this.editFormVisible = false;
              this.getUsers();
            });
          });
        }
      });
    },
    //新增
    addSubmit: function() {

      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            // console.log("hello");

            this.addLoading = true;

            addReport(this.addForm).then(res => {
              this.addLoading = false;
              //NProgress.done();
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.$refs["addForm"].resetFields();
              this.addFormVisible = false;
              this.getReport();
            });
          });
        }
      });
    },
    selsChange: function(sels) {
      this.sels = sels;
    },


    //批量删除
      batchRemoves: function () {
          let collection = "Report";
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
                  this.getReport();
              });
          }).catch(() => {

          });
      },


      //   格式化时间
    dateFormat: function(row, column) {
      var t = new Date(row.add_time); //row 表示一行数据, updateTime 表示要格式化的字段名称
      //   console.log(row.add_time);
      return (
        t.getFullYear() +
        "-" +
        (t.getMonth() + 1) +
        "-" +
        t.getDate() +
        " " +
        t.getHours() +
        ":" +
        t.getMinutes() +
        ":" +
        t.getSeconds()
      );
    }
  },

    //获取数据
  mounted() {
    this.getReport();
    //
  }
};
</script>



