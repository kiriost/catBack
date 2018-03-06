<template>
	<div>
		<div class="listName">书籍列表</div>
		<div class="functionArea">
		</div>
		<div class="Booktable">
		  <mu-table :fixedFooter="false" :fixedHeader="true" :height="height"
		    :enableSelectAll="false" :multiSelectable="false"
		    :selectable="false" :showCheckbox="false">
		    <mu-thead slot="header">
		      <mu-tr>
		        <mu-th tooltip="时间">时间</mu-th>
		        <mu-th tooltip="DAU">DAU</mu-th>
		        <mu-th tooltip="PV">PV</mu-th>
		        <mu-th tooltip="新增订阅">新增订阅</mu-th>
		        <mu-th tooltip="充值量">充值量</mu-th>
		        <mu-th tooltip="购买金额">购买金额</mu-th>
		        <mu-th tooltip="总时长">总时长</mu-th>
		      </mu-tr>
		    </mu-thead>
		    <mu-tbody>
		      <mu-tr v-for="item,index in tableData"  :key="index" :selected="item.selected">
		      	<mu-td>{{item.time}}</mu-td>
		        <mu-td>{{item.dau}}</mu-td>
		        <mu-td>{{item.pv}}</mu-td>
		        <mu-td>{{item.dingyue}}</mu-td>
		        <mu-td>{{item.chongzhi}}</mu-td>
		        <mu-td>{{item.moneyBuy}}</mu-td>
		        <mu-td>{{item.allTime}}</mu-td>
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
      tableData: [{
      	time: '2018/3/3',
      	dau: 32,
      	pv: 21,
      	dingyue: 1,
      	chongzhi: 0,
      	moneyBuy: 0,
      	allTime: 632
      },
      {
      	time: '2018/3/4',
      	dau: 51,
      	pv: 14,
      	dingyue: 1,
      	chongzhi: 0,
      	moneyBuy: 0,
      	allTime: 669
      },
      {
      	time: '2018/3/5',
      	dau: 12,
      	pv: 21,
      	dingyue: 1,
      	chongzhi: 0,
      	moneyBuy: 0,
      	allTime: 753
      },
      {
      	time: '2018/3/6',
      	dau: 22,
      	pv: 11,
      	dingyue: 1,
      	chongzhi: 3,
      	moneyBuy: 60,
      	allTime: 542
      },
      {
      	time: '2018/3/7',
      	dau: 48,
      	pv: 70,
      	dingyue: 1,
      	chongzhi: 0,
      	moneyBuy: 0,
      	allTime: 451
      }
      ],
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
  	//this.reqAllBookInfo(this.current)
  },
  methods: {
    handleClick (newIndex) {
    	//处理翻页
    	switch (this.controPageKind){
    		case 1:
    			this.reqAllBookInfo(newIndex);
    			break;
    		case 2:
    			this.distinctBookInfo(0, newIndex);
    			break;
    		case 3:
    			this.distinctBookInfo(1, newIndex);
    			break;
    		case 4:
    			this.searchBookInfo(this.searchTxt, newIndex);
    			break;
    		default:
    			console.log('出错')
    	}
    },
    reqAllBookInfo(page){
    	//请求全部书籍信息
    	this.controPageKind = 1
    	let pageNumber = (page -1) * 10
	  	axios({
	  		method: 'POST',
	  		url: './api/getBookInfo',
	  		data: {
	  			pageNumber: pageNumber
	  		}
	  	})
	  	.then((response) => {
	  		//console.log(response.data)
	  		response = response.data
	  		this.tableData = response.tableData
	  		this.total = response.allPageNum[0].allNumber
	  	})
    },
    distinctBookInfo(status, page){
    	//上架和下架的书籍分开显示
    	if(!status){
    		this.controPageKind = 2
    	}else{
    		this.controPageKind = 3
    	}
    	let pageNumber = (page -1) * 10
    	axios({
    		method: 'POST',
    		url: './api/distinctBookInfo',
    		data: {
    			is_show: status,
    			pageNumber: pageNumber
    		}
    	})
    	.then((response) => {
    		//console.log(response.data)
    		response = response.data
	  		this.tableData = response.tableData
	  		this.total = response.allPageNum[0].allNumber
    	})
    },
    searchBookInfo(field, page){
    	//按书名或作者搜索书籍
    	this.controPageKind = 4
    	let pageNumber = (page -1) * 10
    	axios({
    		method: 'POST',
    		url: './api/searchBookInfo',
    		data: {
    			field: field,
    			pageNumber: pageNumber
    		}
    	})
    	.then((response) => {
    		//console.log(response.data)
    		response = response.data
	  		this.tableData = response.tableData
	  		this.total = response.allPageNum[0].allNumber
    	})
    },
    changeShow(index){
    	//改变书籍的上架情况
    	//console.log(bookId)
    	let bookId = this.tableData[index].id
    	let is_show = this.tableData[index].is_show
    	if (is_show == 1){
    		is_show = 0
    	}else{
    		is_show = 1
    	}
    	axios({
    		method: 'POST',
    		url: './api/changeShow',
    		data: {
    			id: bookId,
    			is_show: is_show
    		}
    	})
    	.then((response) => {
    		response = response.data
    		//console.log(response.statue)
    		if(response.statue){
    			this.tableData[index].is_show = !this.tableData[index].is_show
    		}else{
    			alert('改变上架状态失败')
    		}
    	})

    },
    deleteBook(index) {
      //删除书籍
      if(confirm('即将删除书籍'+this.tableData[index].book_name+'及其所有章节，确认继续操作？')){
        axios({
          method: 'POST',
          url: './api/deleteBook',
          data: {
            id: this.tableData[index].id
          }
        })
        .then((response) => {
          response = response.data
          //console.log(response.statue)
          if(response.statue){
            alert('删除书籍'+this.tableData[index].book_name+'成功')
            this.reqAllBookInfo(this.current)
          }else{
            alert('删除书籍'+this.tableData[index].book_name+'失败')
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
.bookListButton{
  border-radius: 4px;
  width: 45px;
  border: none;
  font-size: 12px;
  padding: 5px;
  background-color: #00bfa5;
  color: #FFF;
}
</style>