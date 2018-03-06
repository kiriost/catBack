<template>
  <div>
    <div class="listName">读者信息</div>
    <div class="functionArea">
      <mu-text-field hintText="请输入读者名" v-model="searchTxt" class="searchTxted"/>
      <mu-raised-button label="查询" class="demo-raised-button" backgroundColor="#00bfa5" @click="reqUser(current, searchTxt)"/>
      <mu-raised-button label="全部" class="demo-raised-button"  backgroundColor="#ff9800" @click="allInfo()"/>
    </div>
    <div class="Booktable">
      <mu-table :fixedFooter="false" :fixedHeader="true" :height="height"
        :enableSelectAll="false" :multiSelectable="false"
        :selectable="false" :showCheckbox="false">
        <mu-thead slot="header">
          <mu-tr>
            <mu-th tooltip="ID">ID</mu-th>
            <mu-th tooltip="昵称">昵称</mu-th>
            <mu-th tooltip="手机">手机</mu-th>   
            <mu-th tooltip="余额">余额</mu-th> 
            <mu-th tooltip="推荐票">推荐票</mu-th>   
            <mu-th tooltip="钻石票">钻石票</mu-th>
            <mu-th tooltip="订阅">订阅</mu-th>
            <mu-th tooltip="删除">删除</mu-th>
          </mu-tr>
        </mu-thead>
        <mu-tbody>
          <mu-tr v-for="item,index in tableData"  :key="index" :selected="item.selected">
            <mu-td>{{item.id}}</mu-td>
            <mu-td style="white-space: normal;">{{item.user_name}}</mu-td>
            <mu-td style="white-space: normal;">{{item.phone}}</mu-td>
            <mu-td>{{item.balance}}</mu-td>
            <mu-td style="white-space: normal;">{{item.recommend_ticket_num}}</mu-td>
            <mu-td style="white-space: normal; overflow:hidden">{{item.diamond_ticket_num}}</mu-td>
            <mu-td style="white-space: normal;">
              <button class="comment"  backgroundColor="#ff9800" @click="searchSubscribe(index)">查看</button>
            </mu-td>
            <mu-td style="white-space: normal;">
              <button class="comment"  backgroundColor="#ff9800" @click="deleteUser(index)">删除</button>
            </mu-td>
          </mu-tr>
        </mu-tbody>
      </mu-table>
      <mu-pagination :total="total" :current="current" @pageChange="handleClick" style="padding-bottom: 20px;">
      </mu-pagination>
    </div>
    <mu-dialog :open="dialogSubscribe" title="追书" @close="dialogSubscribe = false">
        <mu-list>
          <mu-list-item :title="item.book_name" v-for="item, index in listData">
            <div slot="right" style="font-size: 10px;">{{item.author}}</div>
          </mu-list-item>
        </mu-list>
        <mu-pagination :total="listTotal" :current="listCurrent" @pageChange="listHandleClick" style="padding-bottom: 20px;">
        </mu-pagination>
      <mu-flat-button slot="actions" @click="dialogSubscribe = false" primary label="返回"/>
    </mu-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      searchTxt: '',
      //查询内容
      tableData: [''],
      height: '500px',
      //表格高度
      total: 50,
      //总页数
      current: 1,
      //目前页数
      controPageKind: 1,
      //控制翻页的种类，1全部，2未上架，3已上架，4查询
      dialogSubscribe: false,
      //控制订阅的显示
      listData: [],
      //订阅书籍的列表
      listTotal: 10,
      //列表总页数
      listCurrent: 1,
      //列表当前页数
      userId: ''
      //当前查看的用户id
    }
  },
  mounted () {
    this.reqUser(this.current, '')
  },
  methods: {
    handleClick (newIndex) {
      //处理翻页
      this.reqUser(newIndex, this.searchTxt)
    },
    reqUser(page, searchTxt){
      //请求读者信息
      this.controPageKind = 1
      let pageNumber = (page -1) * 10
      axios({
        method: 'POST',
        url: './api/reqUser',
        data: {
          pageNumber: pageNumber,
          searchTxt: searchTxt
        }
      })
      .then((response) => {
        //console.log(response.data)
        response = response.data
        this.tableData = response.tableData
        this.total = response.allPageNum[0].allNumber
      })
    },
    allInfo () {
      //全部信息
      this.searchTxt = ''
      this.current = 1
      this.reqUser(1, '')
    },
    reqUserSubscribe(page, userId) {
      //请求订阅信息
      let pageNumber = (page -1) * 10
      axios({
        method: 'POST',
        url: './api/reqUserSubscribe',
        data: {
          pageNumber: pageNumber,
          userId: userId
        }
      })
      .then((response) => {
        //console.log(response.data)
        response = response.data
        this.listData = response.tableData
        this.listTotal = response.allPageNum[0].allNumber
      })
    },
    searchSubscribe(index) {
      //查看订阅信息
      this.userId = this.tableData[index].id
      this.dialogSubscribe = true
      this.listCurrent = 1
      this.reqUserSubscribe(this.listCurrent, this.userId)
    },
    deleteUser(index) {
      //删除用户
      if(confirm('确认删除此用户？')){
        this.userId = this.tableData[index].id
        axios({
          method: 'POST',
          url: './api/deleteUser',
          data: {
            id: this.userId
          }
        })
        .then((response) => {
          console.log(response.data)
          response = response.data
          if(response.statue){
            this.reqUser(this.current, '')
          }
        })
      }

    },
    listHandleClick(newIndex) {
      //订阅列表的翻页
      this.reqUserSubscribe(newIndex, this.userId)
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