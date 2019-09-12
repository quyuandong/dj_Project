<template>
  <section>
  <el-table :data="tableData" border
    style="width: 100%;margin-top: 20px;"
    @selection-change="selsChange"
    :row-class-name="tableRowClassName">
    
    <el-table-column align="center" type="selection" width="55">
    </el-table-column>
    <el-table-column  align="center"
      type="index"
      width="50">
    </el-table-column>
    <el-table-column align="center"
      prop="username"
      label="用户名"
      width="180">
    </el-table-column>

    <el-table-column align="center" label="状态">
      <template scope = "scope">
        <el-button size="small" @click="changeStatus(scope.$index, scope.row)" :type="tableData[scope.$index].status == 1 ? 'success':'info'">{{tableData[scope.$index].status == 1?"已审核":'未审核'}}</el-button>
      </template>
    </el-table-column>

    <el-table-column align="center"
      prop="add_time"
      label="时间"
      width="280"
      :formatter="dateFormat"
    >
    </el-table-column>
    <el-table-column align="center"
      prop="reason"
      label="原因">
    </el-table-column>
    <el-table-column align="center" label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          type="primary"
          @click="open(scope.row,scope.$index)">查看</el-button>
      </template>
    </el-table-column>
  </el-table>


  <!--查看界面-->
  <el-dialog title="详情" :visible.sync="findFormVisible" >
    <el-form :model="oneTableDate" label-width="70px">
      <el-form-item label="用户名" prop="description">
        <el-input v-model="oneTableDate.username" readonly auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group readonly v-model="oneTableDate.status">
          <el-radio class="radio" v-if="oneTableDate.status==1" :label="oneTableDate.status">已审核</el-radio>
          <el-radio class="radio" v-else :label="oneTableDate.status">未审核</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="原因" prop="content">
        <el-input v-model="oneTableDate.reason" readonly auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="添加时间" prop="add_time">
        <el-input v-model="oneTableDate.add_time" value-format="yyyy-MM-dd" readonly auto-complete="off"></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click.native="findFormVisible = false">取消</el-button>
    </div>
  </el-dialog>

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

  </section>
</template>

<style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>

<script>
import {getSummaryList,changeStatus,batchRemove} from '../../api/api'
  export default {
    data() {
      return {
        tableData: [],  //所有用户信息
        findFormVisible:false,  //消息框是否显示
          oneTableDate:{},
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

        //格式化时间
        dateFormat:function(row,column){
            var t=new Date(row.add_time);//row 表示一行数据, updateTime 表示要格式化的字段名称
            return t.getFullYear()+"-"+(t.getMonth()+1)+"-"+t.getDate()+" "+t.getHours()+":"+t.getMinutes()+":"+t.getSeconds();
        },

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

        //获取用户数据
        getData(){
            let para = {
                pageSize:this.pageSize,
                currentPage: this.currentPage,
                sort_attr:'add_time',
                sort_value:-1
            };
            this.listLoading = true;
            getSummaryList(para).then(res=>{
                 console.log(res);
                this.tableData = res.news;
                this.total = res.count;
                this.listLoading = false;
            })
        },

        //颜色显示
        tableRowClassName({row, rowIndex}) {
        if (rowIndex === 1) {
          return 'warning-row';
        } else if (rowIndex === 3) {
          return 'success-row';
        }
        return '';
      },

        //更改状态
        changeStatus(index, row){
            let a = {
                collectionName:'Summary',
                id:row._id
            };
            changeStatus(a).then(res=>{
                this.getData()
            })
        },


        //打开查看页面
        open(row,index) {
            this.oneTableDate = row;
            this.findFormVisible = "true";
      },

        //批量获取数据
        selsChange: function (sels) {
            this.sels = sels;
        },


        //批量删除
        batchRemoves: function () {
            let collection = "Summary";
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
        }

    },
      
   
  }
</script>