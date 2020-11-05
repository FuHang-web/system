/** 
 * api接口的统一出口
 */
// 文章模块接口
import article from '@/request/api/article';
import users from '@/request/api/users';
import rights from '@/request/api/rights'
// 其他模块的接口……

// 导出接口
export default {
    ...article,
    ...users,
    ...rights
    // ……
}
