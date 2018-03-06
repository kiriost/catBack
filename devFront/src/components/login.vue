<template>
  <div class="layout">
    <div class="header">
      <div class="logo">
        猫阅读后台登陆
      </div>
    </div>
    <div class="content">
      <div class="body">
        <div style="padding-top:80px;">
          <mu-text-field label="账号" labelFloat v-model="admin_no"/><br/>
          <mu-text-field label="密码" hintText="请输入密码" type="password" labelFloa v-model="admin_pw"/><br/>
          <mu-raised-button label="登 陆" class="demo-raised-button" primary style="margin-top: 40px;" @click="login" :to="link"/><br/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      link: '/bookList',
      admin_no: '',
      admin_pw: ''
    }
  },
  mounted(){
    this.sessionSetter('login', 'error')
    this.sessionSetter('manage', 'error')
  },
  methods: {
    login() {
      //登陆
      if(this.admin_no == 'admin' && this.admin_pw == '123456'){
        this.sessionSetter('login', 'haveLogin')
        this.$router.push('/bookList')
      }else{
        alert('账户或密码错误')
      }
    },
    handleTabChange (val) {
      this.activeTab = val
    },
    sessionGetter(key){
      //取缓存内容
      const prefix = 'html5_test_'
      return sessionStorage.getItem(prefix + key);
    },
    sessionSetter(key, val){
      //设置缓存
      const prefix = 'html5_test_'
      sessionStorage.setItem(prefix + key, val)
    }
  }
}
</script>
<style scoped>
.layout{
  background-color: rgb(236, 236, 236);
}

.header{
  background-color: #009688;
}

.logo{
  font-size: 24px;
  color: white;
  display: inline-block;
  padding: 10px 20px;
}

.nav{
  display: inline-block;
  width: calc(100% - 150px);
  margin: 0 auto;
}

.tab{
  margin: 0 auto;
  width: 400px;
  background-color: rgba(0, 0, 0, 0);
}

.content{
  width: 90%;
  margin: 0 auto;
}

.breadcrumb{
  margin: 10px 0;
}

.body{
  background-color: white;
  border-radius: 5px;
  min-height: 500px;
}

.footer{
  padding: 20px 0;
  text-align: center;
}
</style>