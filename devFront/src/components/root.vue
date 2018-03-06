<template>
  <div class="layout">
    <div class="header">
      <div class="logo">
        猫阅读后台管理系统
      </div>
      <!-- <div class="nav">
        <mu-tabs :value="activeTab" @change="handleTabChange" class="tab">
          <mu-tab value="tab1" title="Nav One"/>
          <mu-tab value="tab2" title="Nav TwO"/>
          <mu-tab value="tab3" title="Nav Three"/>
        </mu-tabs>
      </div> -->
    </div>
    <div class="content">
      <div class="content-left">
        <mu-list @change="handleListChange" :value="activeList">
          <mu-list-item title="书籍管理" value="list1" toggleNested>
            <mu-icon slot="left" value="book" color="#009688"/>
            <mu-list-item title="书籍列表" value="list2" slot="nested" to='/bookList'>
              <!-- <mu-icon slot="left" value="book" /> -->
            </mu-list-item>
            <mu-list-item title="章节列表" value="list3" slot="nested" to='/bookUpload/0'>
              <!-- <mu-icon slot="left" value="book" /> -->
            </mu-list-item>
          </mu-list-item>
          <mu-list-item title="功能管理" value="list4" toggleNested :open="false">
            <mu-icon slot="left" value="functions" color="#009688" />
            <mu-list-item title="排行管理" value="list5" slot="nested" to='sortManage'>
              <!-- <mu-icon slot="left" value="book" /> -->
            </mu-list-item>
            <mu-list-item title="评论管理" value="list6" slot="nested" to='/commentManage'>
              <!-- <mu-icon slot="left" value="book" /> -->
           
            </mu-list-item>
            <mu-list-item title="书籍统计" value="list7" slot="nested" to='/bookStatistic'>
              <!-- <mu-icon slot="left" value="book" /> -->
            </mu-list-item>
          </mu-list-item>
          <mu-list-item title="读者管理" value="list8" toggleNested :open="false">
            <mu-icon slot="left" value="person" color="#009688" />
            <mu-list-item title="读者信息" value="list9" slot="nested" to='/readerData'>
              <!-- <mu-icon slot="left" value="book" /> -->
            </mu-list-item>
          </mu-list-item>
          <mu-list-item title="数据管理" value="list10" toggleNested :open="false">
            <mu-icon slot="left" value="data_usage" color="#009688" />
            <mu-list-item title="数据统计" value="list11" slot="nested" to="/dataShow">
              <!-- <mu-icon slot="left" value="book" /> -->
            </mu-list-item>
          </mu-list-item>
        </mu-list>
      </div>
      <div class="content-right">
        <div class="breadcrumb">

          <!-- <mu-breadcrumb>
            <mu-breadcrumb-item href="/">Home</mu-breadcrumb-item>
            <mu-breadcrumb-item href="/">VideoGame</mu-breadcrumb-item>
            <mu-breadcrumb-item>Download</mu-breadcrumb-item>
          </mu-breadcrumb> -->
        </div>
        <div class="body">
          <!-- <mu-sub-header>阳光</mu-sub-header>
          <mu-content-block>
            散落在指尖的阳光，我试着轻轻抓住光影的踪迹，它却在眉宇间投下一片淡淡的阴影。调皮的阳光掀动了四月的心帘，温暖如约的歌声渐起。似乎在诉说着，我也可以在漆黑的角落里，找到阴影背后的阳光，找到阳光与阴影奏出和谐的旋律。我要用一颗敏感赤诚的心迎接每一缕滑过指尖的阳光！
          </mu-content-block> -->
          <router-view/>
        </div>
      </div>
    </div>
    <div class="footer">
      猫阅读 ©2017 管理后台
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      activeTab: 'tab1',
      activeList: 'list2'
    }
  },
  methods: {
    handleTabChange (val) {
      this.activeTab = val
    },
    handleListChange (val) {
      this.activeList = val
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
  text-align: left;
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
  overflow: hidden;
}

.content-left{
  width: 20%;
  float: left;
  background-color: white;
  margin-bottom: -4000px;
  padding-bottom: 4000px;
}

.content-right{
  width: 80%;
  display: inline-block;
  float: right;
  padding: 10px 20px;
  background-color: rgba(0, 0, 0, 0)
}

.breadcrumb{
  margin: 10px 0;
}

.body{
  background-color: white;
  border-radius: 5px;
  min-height: 600px;
}

.footer{
  padding: 20px 0;
  text-align: center;
}
.noToggle{
  /*保证列表在同一水平线上*/
  padding-right: 48px;
}
</style>