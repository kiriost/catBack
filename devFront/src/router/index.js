import Vue from 'vue'
import Router from 'vue-router'
import rootView from '@/components/root'
import bookList from '@/components/bookManage/bookList'
import bookUpload from '@/components/bookManage/bookUpload'
import bookStatistic from '@/components/functionManage/bookStatistic'
import commentManage from '@/components/functionManage/commentManage'
import readerData from '@/components/readerManage/readerData'
import bookDetails from '@/components/bookManage/bookDetails'
import chapterContant from '@/components/bookManage/chapterContant'
import login from '@/components/login'
import sortManage from '@/components/functionManage/sortManage'
import dataShow from '@/components/dataManage/dataShow'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/',
      name: 'rootView',
      component: rootView,
      beforeEnter: (to, from, next) => {
        const prefix = 'html5_test_'
        var val = sessionStorage.getItem(prefix + 'login');
        if(val == 'haveLogin'){
          next()
        }else{
          next({path: '/login'})
        }
      },
      children: [{
      	path: 'bookList',
      	name: 'bookList',
      	component: bookList
      },
      {
      	path: 'bookUpload/:bookId',
      	name: 'bookUpload',
      	component: bookUpload
      },
      {
        path: 'bookDetails/:bookId',
        name: 'bookDetails',
        component: bookDetails
      },
      {
        path: 'chapterContant/:bookId/:chapterId',
        name: 'chapterContant',
        component: chapterContant
      },
      {
        path: 'bookStatistic',
        name: 'bookStatistic',
        component: bookStatistic
      },
      {
        path: 'commentManage',
        name: 'commentManage',
        component: commentManage
      },
      {
        path: 'readerData',
        name: 'readerData',
        component: readerData
      },
      {
        path: 'sortManage',
        name: 'sortManage',
        component: sortManage
      },
      {
        path: 'dataShow',
        name: 'dataShow',
        component: dataShow
      }
      ]
    }
  ]
})
