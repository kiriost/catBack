<template>
  <div>
    <div class="listName">书籍统计</div>
    <div class="functionArea">
      <mu-text-field hintText="请输入书籍名或作者名" v-model="searchTxt" class="searchTxted"/>
      <mu-raised-button label="查询" class="demo-raised-button" backgroundColor="#00bfa5" @click="reqAllBookStatistic(current, searchTxt)"/>
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
            <mu-th tooltip="追书量">追书量</mu-th>
            <mu-th tooltip="">点击量</mu-th>
            <mu-th tooltip="打赏量">打赏量</mu-th>
            <mu-th tooltip="订阅量">订阅量</mu-th>
          </mu-tr>
        </mu-thead>
        <mu-tbody>
          <mu-tr v-for="item,index in tableData"  :key="index" :selected="item.selected">
            <mu-td>{{index + 1}}</mu-td>
            <mu-td style="white-space: normal;">{{item.book_name}}</mu-td>
            <mu-td style="white-space: normal;">{{item.author}}</mu-td>
            <mu-td>{{bookType[item.book_type]}}</mu-td>
            <mu-td style="white-space: normal;">{{item.chase_book_num}}</mu-td>
            <mu-td style="white-space: normal;">{{item.click_num}}</mu-td>
            <mu-td style="white-space: normal;">{{item.reward_num}}</mu-td>
            <mu-td style="white-space: normal;">{{item.subscriber_num}}</mu-td>
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
      tableData: [],
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
    this.reqAllBookStatistic(this.current, '')
  },
  methods: {
    handleClick (newIndex) {
      //处理翻页
      this.reqAllBookStatistic(newIndex, this.searchTxt)
    },
    reqAllBookStatistic(page, searchTxt){
      //请求全部书籍信息
      this.controPageKind = 1
      let pageNumber = (page -1) * 10
      axios({
        method: 'POST',
        url: './api/reqAllBookStatistic',
        data: {
          pageNumber: pageNumber,
          searchTxt: searchTxt
        }
      })
      .then((response) => {
        console.log(response.data)
        response = response.data
        this.tableData = response.tableData
        this.total = response.allPageNum[0].allNumber
      })
    },
    allInfo () {
      //全部信息
      this.searchTxt = ''
      this.current = 1
      this.reqAllBookStatistic(1, '')
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
.installis_show{
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
</style>