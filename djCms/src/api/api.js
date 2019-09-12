import axios from '../http';

let base = 'http://127.0.0.1:3000/api';


/* ================================================================== */
// 公共方法
// 改变状态
// 引入改变状态的方法
export const changeStatus = params => { return axios.get(`${base}/mpage/changeStatus?collectionName=${params.collectionName}&id=${params.id}`)};

//批量删除方法
export const batchRemove = params => { return axios.get(`${base}/mpage/remove`, {params}); };

/* ----------------------------------------------------------------- */


/* ================================================================== */
//登录注册
//登录请求
export const requestLogin = (params) => { return axios.post(`${base}/mpage/login`, params).then(res => res.data); };
// 引入更改密码的方法
export const changePwd = params => { return axios.post(`${base}/mpage/changePwd`,params)};
/* ----------------------------------------------------------------- */

/* ================================================================== */
//新闻管理
//获取新闻列表getNewsListPage
export const getNewsListPage = params => { return axios.get(`${base}/news/list`, { params: params }); };
//删除一条列表
export const deleteNew = params => { return axios.get(`${base}/news/delete/${params.id}`); };
//添加新闻  addNews
export const addNews = params => { return axios.post(`${base}/news/add`,params); };
//编辑新闻
export const editNews = params => { return axios.post(`${base}/news/edit`,params); };

/* ----------------------------------------------------------------- */

/* ================================================================== */
//党员互动
// 获取帖子列表
export const getPostList = params => { return axios.get(`${base}/posts/list`,{ params: params }).then(res=>res.data)};
// 删除帖子
export const deletePost = (params) => { return axios.get(`${base}/mpage/delete?collection=${params.collection}&id=${params.id}`);};
/* ----------------------------------------------------------------- */


/* ================================================================== */
//心得总结
// 获取心得总结列表
export const getSummaryList = params => { return axios.get(`${base}/summarys/list`,{ params: params }).then(res=>res.data)};
/* ----------------------------------------------------------------- */


/* ================================================================== */
//用户管理

// 获取用户列表
export const getUserList = params => { return axios.get(`${base}/users/list`,{ params: params }).then(res=>res.data) };
//重置用户密码
export const resetPassword = params => { return axios.post(`${base}/users/reset`,params); };
//添加用户
export const addUsers = params => { return axios.post(`${base}/users/add`,params); };
/* ----------------------------------------------------------------- */


/* ================================================================== */
//民主评议

export const getCommentList = params => { return axios.get(`${base}/comments/list`,{ params: params }) };

export const CommentAdd = params => { return axios.post(`${base}/comments/add`,{description:params.description,content:params.content});};
export const CommentDelete = params => { return axios.get(`${base}/mpage/delete?collection=${params.collection}&id=${params.id}`);};
export const CommentEdit = params => { return axios.post(`${base}/comments/edit/${params._id}`,{description:params.description,content:params.content});};

/* ----------------------------------------------------------------- */



/* ================================================================== */
//思想汇报
export const getReportList = params => { return axios.get(`${base}/reports/list`, { params: params }); };
export const getReportDel = params => { return axios.get(`${base}/mpage/delete`, { params: params }); };
export const addReport = params => { return axios.post(`${base}/reports/add`,  params ); };

/* ----------------------------------------------------------------- */



/* ================================================================== */
//轮播图
export const getFocusList=()=>{return axios.get(`${base}/focus/list`)}
// 添加轮播图数据
export const add_Focus = params => { return axios.post(`${base}/focus/add`, params) };
// 编辑轮播图数据
export const doEditFocus = params => { return axios.post(`${base}/focus/edit` ,params)}
// 删除轮播图
export const doDelFocus = params => { return axios.get(`${base}/focus/del?id=${params}`) }
// 更改状态
    export const changeFocusStatus = params => { return axios.get(`${base}/focus/change?id=${params}`) }
/* ----------------------------------------------------------------- */
