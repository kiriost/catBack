<template>
  <div>
    <div class="listName">书籍排行</div>
    <div class="functionArea">
      <mu-text-field hintText="请输入书籍名或作者名" v-model="searchTxt" class="searchTxted"/>
      <mu-raised-button label="查询" class="demo-raised-button" backgroundColor="#00bfa5" @click="getOnRackItem(bookIdList, current, searchTxt)"/>
      <mu-select-field v-model="selectList" style="float: right; margin-right: 20px">
		    <mu-menu-item v-for="text,index in listContent" :key="index" :value="index" :title="text" />
		  </mu-select-field>
    </div>
    <div class="Booktable">
		  <mu-table :fixedFooter="false" :fixedHeader="true" :height="height"
		    :enableSelectAll="false" :multiSelectable="false"
		    :selectable="false" :showCheckbox="false">
		    <mu-thead slot="header">
		      <mu-tr>
		        <mu-th tooltip="书名">书名</mu-th>
		        <mu-th tooltip="作者">作者</mu-th>
		        <mu-th tooltip="封面">封面</mu-th>
		        <mu-th tooltip="类型">类型</mu-th>
		        <mu-th tooltip="简介">简介</mu-th>
		        <mu-th tooltip="操作">操作</mu-th>
		      </mu-tr>
		    </mu-thead>
		    <mu-tbody>

		    	<mu-tr v-for="item,index in tableDataTop"  :key="index" :selected="item.selected">
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
		        <mu-td>
              <button class="bookListButton" @click="underRack(index)">下架</button>
            </mu-td>
		      </mu-tr>
		      <!-- 推荐上架的第一本书 -->

		      <mu-tr v-for="item,index in tableDataList"  :key="index" :selected="item.selected">
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
		        <mu-td>
              <button class="bookListButton" @click="underRack(index)">下架</button> 
            </mu-td>
		      </mu-tr>
		      <!-- 推荐书的列表 -->

		      <mu-tr v-for="item,index in tableData"  :key="index" :selected="item.selected">
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
		        <mu-td>
              <button class="bookListButton" @click="onRack(index)">上架</button>
            </mu-td>
		      </mu-tr>
		      <!-- 书库里面未上架的书籍 -->

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
      
      tableDataTop: [{author: '1'}],
      //上架的第一本书
      tableDataList: [{author: '2'}],
      //上架的书籍列表
      tableData: [{author: '3'}],
      height: '500px',
      //表格高度
      total: 50,
      //总页数
      current: 1,
      //目前页数
      controPageKind: 1,
      //控制翻页的种类，1全部，2未上架，3已上架，4查询
      selectList: 0,
      //榜单的序列号
      listContent: ['新书立捧', '新书上架', '免费书籍', '精品书籍', '热门书籍'],
      bookIdList: ''
    }
  },
  mounted () {
  	this.getOnRack(this.selectList)
    //this.reqComment(this.current, '')
  },
  methods: {
  	getOnRack (index) {
  		axios({
        method: 'POST',
        url: 'http://localhost:3001/api/getOnRack',
        data: {
          index: index
        }
      })
      .then((response) => {
        console.log(response.data)
        response = response.data.rackData
        let strBookId = '('
        if(index != 0){
        	strBookId += response.top_book.id.toString()
        	strBookId += ','
        }
      	for(var i = 0; i < response.book_items.length; i++){
      		strBookId += response.book_items[i].id.toString() 
      		if (i < response.book_items.length - 1){
      			strBookId += ','
      		}
      		//console.log(strBookId)
      	}
      	strBookId += ')'
      	this.bookIdList = strBookId
      	console.log(strBookId)
      	this.getOnRackItem(strBookId, this.current, '')
      })
  	},
  	getOnRackItem (strBookId, pageNumber, searchTxt) {
  		axios({
  			method: 'POST',
  			url: 'http://localhost:3001/api/getOnRackItem',
  			data: {
  				strBookId: strBookId,
  				pageNumber: pageNumber,
  				searchTxt: searchTxt
  			}
  		})
  		.then((response) => {
  			console.log(response.data)
  			response = response.data.rackData
  			//console.log(response.rackData[0])
  			//console.log(response.rackData.slice(1))
  			this.tableDataTop = [response.rackData[0]]
  			this.tableDataList = response.rackData.slice(1)
  			this.tableData = response.tableData
  		})
  	},
    handleClick (newIndex) {
      //处理翻页
      this.getOnRack(this.bookIdList, newIndex, '')
    },

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