<template>
	<div class="contant">
		<div class="contantName">章节内容</div>
		<el-input v-model="chapterName" placeholder="请输入章节标题" class="chapterName"></el-input>
		<el-input
		  type="textarea"
		  :rows="20"
		  placeholder="请输入章节内容"
		  v-model="chapterContant">
		</el-input>
		<mu-raised-button label="保存章节" class="demo-raised-button insertChapterContant" @click="saveContent()" primary/>
		<mu-raised-button label="书籍目录" class="demo-raised-button insertChapterContant" @click="$router.push('/bookUpload/' + bookId)" primary/>
	</div>
</template>

<script>
export default {
  data() {
    return {
    	chapterName: '',
      chapterContant: '',
      chapterId: '',
      bookId: ''
    }
  },
  mounted() {
  	this.bookId = parseInt(this.$route.params.bookId)
  	this.chapterId = parseInt(this.$route.params.chapterId)
  	//console.log(this.getNowTime(), this.bookId, this.chapterId)
  	if(!this.chapterId){
	  	this.redAndSetChapterId()
  	}else{
  		this.reqChapterContant()
  	}
  },
  methods: {
  	redAndSetChapterId(){
  		//请求并且设置章节id
  		axios({
	  		method: 'POST',
	  		url: './api/reqChapterId',
	  		data: {
	        bookId: this.bookId
	  		}
	  	})
	  	.then((response) => {
	  		//console.log(response.data)
	  		response = response.data
	  		if(response.chapter_id){
	  			this.chapterId = response.chapter_id + 1
	  		}else{
	  			this.chapterId = 1
	  		}
	  		console.log('chapter_id', this.chapterId)
	  	})
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
		insertChapterContant() {
			//上传章节内容
			if(this.chapterName && this.chapterContant){
				axios({
		  		method: 'POST',
		  		url: './api/insertChapterContant',
		  		data: {
		        bookId: this.bookId,
		        chapterId: this.chapterId,
		        chapterName: this.chapterName,
		        chapterContant: this.chapterContant,
		        wordNumber: this.chapterContant.length,
		        updateDate: this.getNowTime()
		  		}
		  	})
		  	.then((response) => {
		  		//console.log(response.data)
		  		response = response.data
		  		if(response.statue){
		  			alert('上传 第' + this.chapterId + '章 ' + this.chapterName + ' 成功')
		  			this.chapterId += 1
		  			this.chapterName = ''
		  			this.chapterContant = ''
		  		}
		  	})
			}else{
				alert('请输入完整内容')
			}
		},
		reqChapterContant() {
			//请求章节内容
			axios({
	  		method: 'POST',
	  		url: './api/reqChapterContant',
	  		data: {
	        bookId: this.bookId,
	        chapterId: this.chapterId,
	  		}
	  	})
	  	.then((response) => {
	  		//console.log(response.data)
	  		response = response.data.data
	  		if(response){
	  			this.chapterName = response.chapter_name
	  			this.chapterContant = response.chapter_content
	  		}else{
	  			alert('该章节不存在, 即将跳转上传章节页')
	  			this.$router.push('/chapterContant/' + this.bookId + '/0')
	  		}
	  	})
		},
		updateChapterContent() {
			//更新当前章节
			axios({
	  		method: 'POST',
	  		url: './api/updateChapterContent',
	  		data: {
	        bookId: this.bookId,
	        chapterId: this.chapterId,
	        chapterName: this.chapterName,
	        chapterContant: this.chapterContant,
	        wordNumber: this.chapterContant.length,
	        updateDate: this.getNowTime()
	  		}
	  	})
	  	.then((response) => {
	  		//console.log(response.data)
	  		response = response.data
	  		if(response.statue){
	  			alert('更新 第' + this.chapterId + '章 ' + this.chapterName + ' 成功')
	  		}
	  	})
		},
		saveContent() {
			//点击保存章节按钮
			if(parseInt(this.$route.params.chapterId) == 0){
				//添加章节时
				this.insertChapterContant()
			}else{
				//更新章节时
				this.updateChapterContent()
			}
		}
  }
}
</script>
<style>
	.contant{
		padding: 20px;
	}
	.chapterName{
		padding-bottom: 8px;
	}
	.contantName{
	text-align: left;
	font-size: 18px;
	padding-bottom: 12px;
	}
	.insertChapterContant{
		margin-top: 20px;
	}
</style>