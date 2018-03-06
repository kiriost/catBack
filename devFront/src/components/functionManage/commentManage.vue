<template>
  <div>
    <div class="listName">评论管理</div>
    <div class="functionArea">
      <mu-text-field hintText="请输入书籍名或作者名" v-model="searchTxt" class="searchTxted"/>
      <mu-raised-button label="查询" class="demo-raised-button" backgroundColor="#00bfa5" @click="reqComment(current, searchTxt)"/>
      <mu-raised-button label="全部" class="demo-raised-button"  backgroundColor="#ff9800" @click="allInfo()"/>
    </div>
    <div class="Booktable">
      <mu-table :fixedFooter="false" :fixedHeader="true" :height="height"
        :enableSelectAll="false" :multiSelectable="false"
        :selectable="false" :showCheckbox="false">
        <mu-thead slot="header">
          <mu-tr>
            <mu-th tooltip="ID">ID</mu-th>
            <mu-th tooltip="书名">书名</mu-th>
            <mu-th tooltip="作者">作者</mu-th>   
            <mu-th tooltip="类型">类型</mu-th> 
            <mu-th tooltip="评论">评论</mu-th>   
            <mu-th tooltip="用户">用户</mu-th>
            <mu-th tooltip="置顶">置顶</mu-th>
            <mu-th tooltip="删除">删除</mu-th>
          </mu-tr>
        </mu-thead>
        <mu-tbody>
          <mu-tr v-for="item,index in tableData"  :key="index" :selected="item.selected">
            <mu-td>{{index + 1}}</mu-td>
            <mu-td style="white-space: normal;">{{item.book_name}}</mu-td>
            <mu-td style="white-space: normal;">{{item.author}}</mu-td>
            <mu-td>{{bookType[item.book_type]}}</mu-td>
            <mu-td style="white-space: normal;">{{item.user_name}}</mu-td>
            <mu-td style="overflow: hidden;">
              <el-tooltip placement="top">
                <div slot="content" style="width: 260px;">{{item.comment_content}}</div>
                <p style="color: #ff4081">查看评论</p>
              </el-tooltip>
            </mu-td>
            <mu-td style="white-space: normal;">
              <button class="comment"  backgroundColor="#ff9800" @click="makeTop(index)">{{item.comment_type == 1 ? '取消' : '置顶'}}</button>
            </mu-td>
            <mu-td style="white-space: normal;">
              <button class="comment"  backgroundColor="#ff9800" @click="deleteComment(index)">删除</button>
            </mu-td>
          </mu-tr>
        </mu-tbody>
      </mu-table>
      <mu-pagination :total="total" :current="current" @pageChange="handleClick" style="padding-bottom: 20px;">
      </mu-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    const bookType = ['仙剑', '玄幻', '悬疑', '奇幻',
                      '军事', '历史', '竞技', '科幻',
                      '校园', '社会', '其它']
    return {
      bookType,
      searchTxt: '',
      //查询内容
      tableData: [''],
      height: '500px',
      //表格高度
      total: 50,
      //总页数
      current: 1,
      //目前页数
      controPageKind: 1
      //控制翻页的种类，1全部，2未上架，3已上架，4查询
    }
  },
  mounted () {
    this.reqComment(this.current, '')
  },
  methods: {
    handleClick (newIndex) {
      //处理翻页
      this.reqComment(newIndex, this.searchTxt)
    },
    reqComment(page, searchTxt){
      //请求评论信息
      this.controPageKind = 1
      let pageNumber = (page -1) * 10
      axios({
        method: 'POST',
        url: './api/reqComment',
        data: {
          pageNumber: pageNumber,
          searchTxt: searchTxt
        }
      })
      .then((response) => {
        console.log(response.data.tableData)
        response = response.data
        this.tableData = response.tableData
        this.total = response.allPageNum[0].allNumber
      })
    },
    allInfo () {
      //全部信息
      this.searchTxt = ''
      this.current = 1
      this.reqComment(1, '')
    },
    makeTop (index) {
      //置顶评论
      let commentId = this.tableData[index].id
      let type = this.tableData[index].comment_type
      if(type == 1){
        type = 0
      }else{
        type = 1
      }
      axios({
        method: 'POST',
        url: './api/updateTop',
        data: {
          id: commentId,
          type: type
        }
      })
      .then((response) => {
        response = response.data
        //console.log(response)
        if(response.statue) {
          if(this.tableData[index].comment_type == 1){
            this.tableData[index].comment_type = 0
          }else{
            this.tableData[index].comment_type = 1
          }
        }else{
          alert('置顶操作失败')
        }
      })
    },
    deleteComment (index) {
      //删除评论
      let commentId = this.tableData[index].id
      if(confirm('确定删除评论？')){
        axios({
          method: 'POST',
          url: './api/deleteComment',
          data: {
            id: commentId
          }
        })
        .then((response) => {
          response = response.data
          if(response.statue){
            this.reqComment(this.current, this.searchTxt)
          }else{
            alert('删除操作失败')
          }
        })
      }

    }
  }
}
</script>

<style lang="css">
.demo-table-settings{
  width: 200px;
  overflow: hidden;
  margin: 20px auto 0px;
}
.installcomment_type{
  /*上下架按钮样式*/
}
.listName{
  padding: 18px;
  text-align: left;
  font-size: 18px;

}
.functionArea{
  padding: 0 0 18px 18px;
  text-align: left;
}
.searchTxted{
  margin-right: 10px;
  width: 30%;
}
.functionArea .demo-raised-button{
  width: 10%;
  margin: 0 0.5%;
}
.Booktable{
  padding: 0 24px;
}
.mu-td, .mu-th{
  height: 100%;
  padding: 10px 0;
}
.comment{
  border-radius: 4px;
  width: 35px;
  border: none;
  height: 30px;
  font-size: 12px;
  padding: 5px;
  background-color: #ff9800;
  color: #FFF;
}
</style>