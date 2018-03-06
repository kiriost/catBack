<template>
<div>
  <h4 class="pageTitle">书籍详情</h4>
  <el-upload
    class="avatar-uploader"
    action="https://jsonplaceholder.typicode.com/posts/"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload">
    <img v-if="imageUrl" :src="imageUrl" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
  <!-- <span class="hintTitle">书名</span> -->
  <mu-text-field hintText="请输入书名" v-model="book_name"/><br/>
  <!-- <span class="hintTitle">作者</span> -->
  <mu-text-field hintText="请输入作者" v-model="author"/><br/>
  <!-- <span class="hintTitle">简介</span> -->
  <mu-text-field hintText="请输入书籍简介" multiLine :rows="3" :rowsMax="6" v-model="describe"/><br/>
  <mu-select-field v-model="thisBookType" :labelFocusClass="['label-foucs']" label="选择书籍类型">
    <mu-menu-item v-for="text,index in bookType" :key="index" :value="index" :title="text" />
  </mu-select-field>
  <br/>
  <mu-raised-button label="上传" class="demo-raised-button detailsButton" @click="useBookDetails()" primary/>
  <mu-raised-button label="查看章节" class="demo-raised-button detailsButton" @click="goChapter()" primary/>
</div>
</template>

<script>
export default {
  data () {
    const bookType = ['仙剑', '玄幻', '悬疑', '奇幻',
                      '军事', '历史', '竞技', '科幻',
                      '校园', '社会', '其它']
    return {
      thisBookType: 0,
      //选择的书籍类型
      bookType,
      imageUrl: 'http://read.beluga.ai/api/static/images/cover/cover-2.jpeg',
      //上传图像的url
      bookId: 0,
      //书籍的id
      book_name: '',
      author: '',
      describe: ''
    }
  },
  mounted () {
    this.bookId = parseInt(this.$route.params.bookId)
    if(this.bookId != 0){
      this.reqBookDetails(this.bookId)
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    reqBookDetails(bookId) {
      //请求书籍详情页面信息
      console.log(bookId)
      axios({
        method: 'POST',
        url: './api/reqBookDetails',
        data: {
          id: bookId
        }
      })
      .then((response) => {
        console.log(response.data)
        response = response.data.resultData[0]
        this.book_name = response.book_name
        this.author = response.author
        this.describe = response.book_describe
        this.imageUrl = 'http://read.beluga.ai/api/static/images/cover/'+response.cover
        this.thisBookType = response.book_type
      })
    },
    updateBookDetails(info, bookId) {
      //更新书籍详情信息
      axios({
        method: 'POST',
        url: './api/updateBookDetails',
        data: {
          id: bookId,
          info: info
        }
      })
      .then((response) => {
        //console.log(response.data)
        response = response.data
        if(response.statue){
          alert('更新成功')
        }
      })
    },
    insertBookDetails(info) {
      //插入书籍详情信息
      axios({
        method: 'POST',
        url: './api/insertBookDetails',
        data: {
          info: info
        }
      })
      .then((response) => {
        console.log(response.data)
        response = response.data
        this.bookId = response.id
        alert('上传' + this.book_name +'成功')
        this.$router.push('/bookDetails/'+response.id)
      })
    },
    useBookDetails() {
      //点击上传按钮
      if(this.imageUrl && this.book_name && this.author && this.describe){
        let info = {}
        info.book_name = this.book_name
        info.author = this.author
        info.describe = this.describe
        info.cover = this.imageUrl.split('/').pop()
        info.book_type = this.thisBookType
        if(this.bookId == 0){
          //插入信息
          this.insertBookDetails(info)
        }else{
          //更新信息
          this.updateBookDetails(info, this.bookId)
        }
      }else{
        alert('请填写完整信息后上传')
      }
    },
    goChapter() {
      //前往章节列表
      if(this.bookId){
        this.$router.push('/bookUpload/'+this.bookId)
      }else{
        alert('请先创建书籍')
      }
      
    }
  }
}
</script>

<style>
  .hintTitle{
    padding-right: 40px;
  }
  .pageTitle{
    text-align: left;
    padding: 20px;
    font-size: 18px;  
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 108px;
    height: 148px;
    display: block;
  }
  .detailsButton{
    margin: 20px;
  }
</style>