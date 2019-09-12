<template>
  <section>
    <!--列表-->
    <el-table
      :data="users"
      highlight-current-row
      v-loading="listLoading"
      @selection-change="selsChange"
      style="width: 100%;margin-top: 20px;"
      border
      stripe
    >
      <el-table-column type="selection" width="45"></el-table-column>
      <el-table-column type="index" width="55"></el-table-column>
      <el-table-column prop="description" align="center" label="描述" width="300" sortable></el-table-column>
      <el-table-column align="center" label="状态" sortable>
        <template scope = "scope">
          <el-button size="small" @click="changeStatus(scope.$index, scope.row)" :type="users[scope.$index].status == 1 ? 'success':'info'">{{users[scope.$index].status == 1?"已启用":'未启用'}}</el-button>
        </template>
      </el-table-column>


      <el-table-column prop="add_time" label="时间" :formatter="dateFormat" align="center" width="180" sortable></el-table-column>
      <el-table-column label="操作" align="center" width="280">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="small" @click="Ckan(scope.$index, scope.row)">查看详情</el-button>
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

    <!-- 详情界面 -->
    <el-dialog title="详情" :visible.sync="findFormVisible" >
      <el-form :model="findForm" label-width="70px">
        <el-form-item label="描述" prop="description">
          <el-input v-model="findForm.description" readonly auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group readonly v-model="findForm.status">
            <el-radio class="radio" v-if="findForm.status==1" :label="findForm.status">已启用</el-radio>
            <el-radio class="radio" v-else :label="findForm.status">未启用</el-radio>
          </el-radio-group>
        </el-form-item>


        <el-form-item label="内容" prop="content">
          <el-input v-model="findForm.content" readonly auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="添加时间"  prop="add_time">
          <el-input v-model="findForm.add_time" :formatter="dateFormat" readonly auto-complete="off"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click.native="findFormVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <!--编辑界面-->
    <el-dialog title="编辑" :visible.sync="editFormVisible" >
      <el-form :model="editForm" label-width="60px" :rules="editFormRules"  ref="editForm">
        <el-form-item label="描述" prop="description">
          <el-input v-model="editForm.description" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="内容" class="beditor" prop="content">
          <quill-editor class="editor" v-model="editForm.content" auto-complete="off"></quill-editor>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>



  </section>
</template>

<script>
import { getCommentList,CommentDelete,CommentEdit,changeStatus ,batchRemove} from "../../api/api";
export default {
  data() {
    return {
      filters: {
        name: "",
      },
      users: [],
        //分页
        total: 0,
        pageSize:5,
        currentPage: 1,
      listLoading: false,
      sels: [], //列表选中列

      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      editFormRules: {
        // description: [{ required: true, message: "描述内容", trigger: "blur" }]
      },
      //编辑界面数据
      editForm: {
        description:'',
        content:'',
      },
/**-------------------------------------------------------- */
      findFormVisible: false, //详情界面是否显示
      findLoading: false,
      //详情界面数据
      findForm: {
        description:'',
        content:'',
      },
/**----------------------------------------------------------- */
    };
  },
  methods: {

      //每页大小发生改变
      handleSizeChange(val) {
          this.pageSize = val;
          this.currentPage = 1;
          this.getUsers();
      },

      //当前页发生改变时
      handleCurrentChange(val) {
          this.currentPage = val;
          this.getUsers();
      },

    //获取用户列表
    getUsers() {
      let para = {
          pageSize:this.pageSize,
          currentPage: this.currentPage,
          sort_attr:'add_time',
          sort_value:-1
      };
      this.listLoading = true;
      getCommentList(para).then(res => {
          this.users = res.data.news;
          this.total = res.data.count;
          this.listLoading = false;
      });
    },




    //删除
    handleDel: function(index, row) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = { id: row._id ,collection:"Comment"};
          CommentDelete(para).then(res => {
            this.listLoading = false;
            //NProgress.done();
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getUsers();
          });
        })
        .catch(() => {});
    },
    //显示编辑界面
    handleEdit: function(index, row) {
      // console.log(index);
      // console.log(row);
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    
    //编辑
    editSubmit: function() {
      this.$refs.editForm.validate(valid => {
        // console.log(valid);
        if (valid) {
          this.$confirm("确认更新吗？", "提示", {}).then(() => {
            this.editLoading = true;
            let para = Object.assign({}, this.editForm);


            console.log(para);

            CommentEdit(para).then(res => {
              this.editLoading = false;
              //NProgress.done();
              this.$message({
                message: "更新成功",
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

/**------------------------------------------------------------------------------------------ */

    //显示详情界面
    Ckan:function(index,row){
      this.findFormVisible = true;
      this.findForm = Object.assign({}, row);
    },

/**------------------------------------------------------------------------------------------ */
    //更改状态
    changeStatus(index, row){
      // console.log(index,row);
      let para = { id: row._id ,collectionName:"Comment"};
      changeStatus(para).then(res=>{
        this.listLoading = false;
        this.getUsers()
      })
    },

    selsChange: function(sels) {
      this.sels = sels;
    },



    //批量删除
      batchRemoves: function () {
          let collection = "Comment";
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
                  this.getUsers();
              });
          }).catch(() => {

          });
      },



    //时间格式化
    dateFormat:function(row,column){
        var t=new Date(row.add_time);//row 表示一行数据, updateTime 表示要格式化的字段名称
        return t.getFullYear()+"-"+(t.getMonth()+1)+"-"+t.getDate()+" "+t.getHours()+":"+t.getMinutes()+":"+t.getSeconds();
    },
  },
  mounted() {
    this.getUsers();
  }
};
</script>

<style scoped>
.beditor{
  height: 200px;
}
.editor{
  height: 100px;
}
</style>