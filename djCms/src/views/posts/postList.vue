<template>
  <section>
      <el-table
        :data="tableData"
        border  stripe v-loading="listLoading"
        style="width: 100%;margin-top: 20px;"
        @selection-change="selsChange"
        highlight-current-row>
        <el-table-column align="center"
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column align="center"
          type="index"
          width="50">
        </el-table-column>
        <el-table-column align="center"
          prop="username"
          label="用户名"
          width="180">
        </el-table-column>
        <el-table-column align="center"
          prop="content"
          label="内容">
        </el-table-column>
        <el-table-column align="center"
          prop="follow"
          label="跟帖">
        </el-table-column>
        <el-table-column align="center"
          :formatter="dateFormat"
          prop="add_time"
          label="时间"
          width="280"
        >
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row,scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>


    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>

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

  </section>
</template>



<script>
import {getPostList,deletePost,batchRemove} from '../../api/api'
  export default {

    data() {
      return {
        tableData: [],
          sels: [],//列表选中列
          listLoading:false,
          //分页
          total: 0,
          pageSize:5,
          currentPage: 1,
      }
    },
    created(){
        this.getData()
    },
    methods: {

        //每页大小发生改变
        handleSizeChange(val) {
            this.pageSize = val;
            this.currentPage = 1;
            this.getData();
        },

        //当前页发生改变时
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getData();
        },


        //格式化时间
        dateFormat:function(row,column){
            var t=new Date(row.add_time);//row 表示一行数据, updateTime 表示要格式化的字段名称
            return t.getFullYear()+"-"+(t.getMonth()+1)+"-"+t.getDate()+" "+t.getHours()+":"+t.getMinutes()+":"+t.getSeconds();
        },


        handleDelete: function(row, index) {
             console.log(row);
            this.$confirm("确认删除该记录吗?", "提示", {
                type: "warning"
            })
            .then(() => {
                this.listLoading = true;
                let para = { id: row._id ,collection:"Post"};
                deletePost(para).then(res => {
                    this.listLoading = false;
                    this.$message({
                        message: "删除成功",
                        type: "success"
                    });
                    this.getData();
                });
            })
            .catch(() => {});
        },

        //批量获取数据
        selsChange: function (sels) {
            this.sels = sels;
        },


        //批量删除
        batchRemove: function () {
            let collection = "Post";
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
                    this.getData();
                });
            }).catch(() => {

            });
        },


        //获取用户列表
      getData(){
          let para = {
              pageSize:this.pageSize,
              currentPage: this.currentPage,
              sort_attr:'add_time',
              sort_value:-1
          };
          this.listLoading = true;
          getPostList(para).then(res=>{
              this.tableData = res.news;
              this.total = res.count;
              this.listLoading = false;
          })
      },
      
    },
  }
</script>

<style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>