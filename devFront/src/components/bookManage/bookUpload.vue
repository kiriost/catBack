<template>
	<div>
		<div class="listName">章节列表</div>
		<div class="functionArea">
			<mu-text-field hintText="请输入章节名" v-model="searchTxt" class="searchTxt"/>
			<mu-raised-button label="查询" class="bookUploadButton" backgroundColor="#00bfa5" @click="searchBookInfo(searchTxt, current)"/>
			<mu-raised-button label="免费" class="bookUploadButton"  backgroundColor="#ffca28" @click="distinctChapterInfo(0, current, bookId)"/>
			<mu-raised-button label="付费" class="bookUploadButton"  backgroundColor="#ffc107" @click="distinctChapterInfo(1, current, bookId)"/>
			<mu-raised-button label="全部" class="bookUploadButton"  backgroundColor="#ff9800" @click="reqChapterInfo(1, '', bookId)"/>
			<mu-raised-button label="单章上传" class="bookUploadButton"  backgroundColor="#ff5722" @click="uploadChapter()"/>
      <mu-raised-button label="批量上传" class="bookUploadButton uploadManyButton"  backgroundColor="#ff5722">
        <input class="uploadManyInput" type="file" id="input" @change="uploadAll($event)">
      </mu-raised-button>
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
		        <mu-th tooltip="章节">章节</mu-th>
		        <mu-th tooltip="状态">状态</mu-th>
            <mu-th tooltip="定价">定价</mu-th>
		        <mu-th tooltip="操作">操作</mu-th>
            <mu-th tooltip="操作">删除</mu-th>
		      </mu-tr>
		    </mu-thead>
		    <mu-tbody>
		      <mu-tr v-for="item,index in tableData"  :key="index" :selected="item.selected">
		        <mu-td>{{index + 1}}</mu-td>
		        <mu-td style="white-space: normal;"><a :href="'#/bookDetails/'+item.book_id">{{item.book_name}}</a></mu-td>
		        <mu-td>{{item.author}}</mu-td>
		        <mu-td>{{bookType[item.book_type]}}</mu-td>
		        <mu-td style="white-space: normal;"><a :href="'#/chapterContant/'+item.book_id+'/'+item.chapter_id">第{{item.chapter_id}}章 {{item.chapter_name}}</a></mu-td>
		        <mu-td>{{item.chapter_type ? '付费' : '免费'}}</mu-td>
            <mu-td>
              <mu-text-field hintText="猫币" v-model="moneyNum[index]" style="font-size: 10px; width: 50px;" class="searchTxt" type="number" :disabled="item.chapter_type ? true : false"/>
            </mu-td>
		        <mu-td>
              <button class="comment" @click="setChapterMoney(index)">{{item.chapter_type ? '免费' : '付费'}}</button>
            </mu-td>
            <mu-td>
              <button class="comment" @click="deleteChapter(index)">删除</button>
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
      controPageKind: 1,
      //控制翻页的种类，1全部，2未上架，3已上架，4查询
      moneyNum: [],
      //单章付费
      bookId: 0
      //书籍的id
    }
  },
  mounted () {
    this.bookId = parseInt(this.$route.params.bookId)
  	this.reqChapterInfo(this.current, '', this.bookId)
    //console.log(this.bookId)
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
      this.moneyNum = []
    	switch (this.controPageKind){
        case 1:
          this.reqChapterInfo(newIndex, '', this.bookId);
          break;
        case 2:
          this.distinctChapterInfo(0, newIndex, this.bookId);
          break;
        case 3:
          this.distinctChapterInfo(1, newIndex, this.bookId);
          break;
        case 4:
          this.searchBookInfo(this.searchTxt, newIndex, this.bookId);
          break;
        default:
          console.log('出错')
      }
    },
    reqChapterInfo(page, searchTxt, bookId){
    	//请求章节信息
    	this.controPageKind = 1
    	let pageNumber = (page -1) * 10
	  	axios({
	  		method: 'POST',
	  		url: './api/reqChapterInfo',
	  		data: {
	  			pageNumber: pageNumber,
          searchTxt: searchTxt,
          bookId: bookId
	  		}
	  	})
	  	.then((response) => {
	  		//console.log(response.data)
	  		response = response.data
	  		
	  		this.total = response.allPageNum[0].allNumber
        for (var i = 0; i < response.tableData.length; i++){
          if(response.tableData[i].chapter_type){
            this.moneyNum[i] = response.tableData[i].chapter_money
          }else{
            this.moneyNum[i] = ''
          }
        }
        this.tableData = response.tableData
        //console.log(this.moneyNum)
	  	})
    },
    distinctChapterInfo(statue, page, bookId){
    	//付费和免费章节分开显示
    	if(!statue){
    		this.controPageKind = 2
    	}else{
    		this.controPageKind = 3
    	}
    	let pageNumber = (page -1) * 10
    	axios({
    		method: 'POST',
    		url: './api/distinctChapterInfo',
    		data: {
    			chapter_type: statue,
    			pageNumber: pageNumber,
          bookId: bookId
    		},
    	})
    	.then((response) => {
    		console.log(response.data)
    		response = response.data
	  		this.tableData = response.tableData
        for (var i = 0; i < response.tableData.length; i++){
          if(response.tableData[i].chapter_type){
            this.moneyNum[i] = response.tableData[i].chapter_money
          }else{
            this.moneyNum[i] = ''
          }
        }
	  		this.total = response.allPageNum[0].allNumber
    	})
    },
    searchBookInfo(field, page){
    	//按书名或作者搜索书籍
      this.controPageKind = 4
    	this.reqChapterInfo(page, field, this.bookId)
    },
    setChapterMoney(index) {
      //设置章节金额
      //console.log(index)
      if(this.tableData[index].chapter_type == 1){
        //付费变免费
        this.reqSetChapterMoney(0, 0, index)
        //alert('付费变免费')
      }else{
        //免费变付费
        if(this.moneyNum[index] != ''){
          let chapter_money = parseInt(this.moneyNum[index])
          this.reqSetChapterMoney(1, chapter_money, index)
        }else{
          alert('请输入金额')
        }
      }
    },
    reqSetChapterMoney(chapter_type, chapter_money, index) { 
      //请求设置章节价格
      axios({
        method: 'POST',
        url: './api/setChapterMoney',
        data: {
          chapter_type: chapter_type,
          chapter_money: chapter_money,
          id: this.tableData[index].allChapterId
        },
      })
      .then((response) => {
        console.log(response.data)
        response = response.data
        if(response.statue){
          if(this.tableData[index].chapter_type == 1){
            //付费变免费
            this.tableData[index].chapter_type = 0
            this.moneyNum[index] = ''
          }else{
            //免费变付费
            this.tableData[index].chapter_type = 1
          }
        }
      })
    },
    uploadChapter() {
      //上传章节
      if(this.bookId == 0) {
        alert('请先选择书籍')
      }else{
        this.$router.push('/chapterContant/' + this.bookId + '/0')
      }
    },
    deleteChapter(index) {
      //删除章节
      if(confirm('即将删除章节'+this.tableData[index].chapter_name+'，确认继续操作？')){
        axios({
          method: 'POST',
          url: './api/deleteChapter',
          data: {
            id: this.tableData[index].allChapterId
          }
        })
        .then((response) => {
          response = response.data
          //console.log(response.statue)
          if(response.statue){
            alert('删除章节'+this.tableData[index].chapter_name+'成功')
            this.reqChapterInfo(this.current, this.searchTxt, this.bookId)
          }else{
            alert('删除章节'+this.tableData[index].chapter_name+'失败')
          }
        })
      }
      
    },
    getNowTime() {
      //获取当前时间
      var date = new Date();
      var seperator1 = "-"
      var seperator2 = ":"
      var month = date.getMonth() + 1
      var strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = "0" + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate
      }
      var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
              + " " + date.getHours() + seperator2 + date.getMinutes()
              + seperator2 + date.getSeconds()
      return currentdate
    },
    uploadAll: function(e){
      //批量上传
      if(this.bookId != 0){
        let file = e.target.files[0]
        let reader = new FileReader()
        let resultInfo = []
        let _this = this
        let maxChapterId = 0
        if(this.tableData.length > 0){
          maxChapterId = this.tableData[this.tableData.length - 1].chapter_id
        }        
        reader.readAsText(file, "gb2312")
        reader.onload = function(file){
          let info = file.target.result
          let infoArray = info.split(/第\S*章\s/)
          //console.log('infoArray', infoArray)

          for(var i = 1; i < infoArray.length; i++)
          {
            let nowResult = []
            let title = infoArray[i].split('\n')[0]
            let content = infoArray[i].split(title)[1]
            nowResult.push(_this.bookId)
            nowResult.push(maxChapterId + i)
            nowResult.push(title)
            nowResult.push(content)
            nowResult.push(content.length)
            nowResult.push(_this.getNowTime())
            resultInfo.push(nowResult)
          }
          axios({
            method: 'POST',
            url: './api/insertManyChapter',
            data: {
              resultInfo: resultInfo
            }
          })
          .then((response) => {
            //console.log(response.data)
            response = response.data
            if(response.statue){
              _this.reqChapterInfo(_this.current, '', _this.bookId)
              alert(_this.tableData[0].book_name + resultInfo.length + '个章节批量上传成功')
            }
          })
        }
      }else{
        alert('请先选择书籍')
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
.installchapter_type{
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
.searchTxt{
	margin-right: 10px;
	width: 30%;
}
.functionArea .demo-raised-button{
	width: 10%;
	margin: 0 0.5%;
}
.comment{
  border-radius: 4px;
  width: 45px;
  border: none;
  font-size: 12px;
  padding: 5px;
  background-color: #ff9800;
  color: #FFF;
}
.bookUploadButton{
  width: 8%;
  margin-left: 1%;
}
.uploadManyButton{
  position: relative;
}
.uploadManyInput{
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}
</style>