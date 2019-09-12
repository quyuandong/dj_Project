import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router);

import Login from './views/Login.vue'
import Main from './views/Main.vue'

import NotFound from './views/404.vue'
import Home from './views/Home.vue'

import NewsList from './views/news/NewsList'
import NewsAdd from './views/news/NewsAdd'
import posts from './views/posts/postList.vue'
import summarys from './views/summarys/summaryList.vue'
import users from './views/users/userlist.vue'
import CommentList from './views/comments/CommentList.vue'
import CommentAdd from './views/comments/CommentAdd.vue'
import focus_list from './views/focus/list.vue'
import focus_add from './views/focus/add.vue'
import Report from './views/report/Report.vue'

//基础跳转的路由
const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/main',
            component: Home,
            name: '',
            hidden: true,
            redirect:"/main",
            children: [
                { path: '/main', component: Main, name: '' },
            ]
        },
        {
            path: '/login',
            component: Login,
            name: '',
            hidden: true
        },
        {
            path: '/404',
            component: NotFound,
            name: '',
            hidden: true
        },
        {
            path: '/users',
            component: Home,
            name: '用户管理',
            iconCls: 'el-icon-postcard',
            children: [
                { path: '/userlist', component: users, name: '用户列表' },
        
            ]
        },// 轮播图focus
        {
            path: '/',
            component: Home,
            name: '轮播图',
            iconCls: 'el-icon-picture-outline',
            children: [{
                path: '/focus_list',
                component: focus_list,
                name: '轮播图列表'
            }, {
                path: '/focus_add',
                component: focus_add,
                name: '添加轮播图'
            }]
        },
        {
            path: '/',
            component: Home,
            name: '党员互动',
            iconCls: 'el-icon-chat-dot-square',
            children: [
                { path: '/posts', component: posts, name: '帖子列表' }
            ]
        },
        {
            path: '/',
            component: Home,
            name: '民主评议',
            iconCls: 'el-icon-s-flag',
            children: [
                { path: '/CommentAdd', component: CommentAdd, name: '发起评议' },
                { path: '/CommentList', component: CommentList, name: '评议列表' }
            ]
        },
        {
            path: '/',
            component: Home,
            name: '心得总结',
            iconCls: 'el-icon-edit',
            children: [
                { path: '/summarys', component: summarys, name: '总结列表' }
            ]
        },
        {
            path: '/',
            component: Home,
            name: '思想汇报',
            iconCls: 'el-icon-notebook-2',
            children: [
                { path: '/report', component: Report, name: '汇报列表' },
            ]
        },
        
        {
            path: '/',
            component: Home,
            name: '新闻管理',
            iconCls: 'el-icon-tickets',
            children: [
                { path: '/newsList', component: NewsList, name: '新闻列表' },
                { path: '/newsAdd', component: NewsAdd, name: '添加新闻' }
            ]
        },
        {
            path: '*',
            hidden: true,
            redirect: { path: '/404' }
        }
    ]
    
});

//添加路由守卫
router.beforeEach((to, from, next) => {
    const isLogin = !!localStorage.dj_login;
    if (to.path == "/login" || to.path == "/register") {
        next();
    } else {
        isLogin ? next() : next('/login');
    }
});


export default router;