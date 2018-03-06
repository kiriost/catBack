<template>
	<div>
		<div class="listName">书籍列表</div>
		<div class="functionArea">
			<mu-text-field hintText="请输入书籍名或作者名" v-model="searchTxt" class="searchTxted"/>
			<mu-raised-button label="查询" class="demo-raised-button" backgroundColor="#00bfa5" @click="searchBookInfo(searchTxt, current)"/>
			<mu-raised-button label="已上架" class="demo-raised-button"  backgroundColor="#ffca28" @click="distinctBookInfo(1, current)"/>
			<mu-raised-button label="未上架" class="demo-raised-button"  backgroundColor="#ffc107" @click="distinctBookInfo(0, current)"/>
			<mu-raised-button label="全部" class="demo-raised-button"  backgroundColor="#ff9800" @click="reqAllBookInfo(current)"/>
			<mu-raised-button label="上传书籍" class="demo-raised-button"  backgroundColor="#ff5722" @click="$router.push('/bookDetails/0')"/>
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
		        <mu-th tooltip="封面">封面</mu-th>
		        <mu-th tooltip="类型">类型</mu-th>
		        <mu-th tooltip="简介">简介</mu-th>
		        <mu-th tooltip="状态">状态</mu-th>
		        <mu-th tooltip="操作">操作</mu-th>
            <mu-th tooltip="删除">删除</mu-th>
		      </mu-tr>
		    </mu-thead>
		    <mu-tbody>
		      <mu-tr v-for="item,index in tableData"  :key="index" :selected="item.selected">
		        <mu-td>{{index + 1}}</mu-td>
		        <mu-td style="white-space: normal;"><a :href="'#/bookDetails/'+item.id">{{item.book_name}}</a></mu-td>
		        <mu-td style="white-space: normal;">{{item.author}}</mu-td>
		        <mu-td><img style="width: 40px; vertical-align: middle;" :src="'http://read.beluga.ai/api/static/images/cover/' + item.cover"></mu-td>
		        <mu-td>{{bookType[item.book_type]}}</mu-td>
		        <mu-td style="overflow: hidden;">
              <el-tooltip placement="top">
                <div slot="content" style="width: 260px;">{{item.book_describe}}</div>
                <p style="color: #ff4081">查看内容</p>
              </el-tooltip>
            </mu-td>
		        <mu-td>{{item.is_show ? '已上架' : '未上架'}}</mu-td>
		        <mu-td>
              <button class="bookListButton" @click="changeShow(index)">{{item.is_show ? '下架' : '上架'}}</button>
            </mu-td>
            <mu-td>
              <button class="bookListButton" @click="deleteBook(index)">删除</button>
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
  	this.reqAllBookInfo(this.current)
  },
  watch: {
  	controPageKind: function(val) {
  		//每次种类改变页码变为1
  		this.current = 1
  		//console.log('种类', val, this.current)

  	}
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