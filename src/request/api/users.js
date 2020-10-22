import base from './base'; // 导入接口域名列表
import axios from '@/request/http'; // 导入http中创建的axios实例
import qs from 'qs'; // 根据需求是否导入qs模块

const users = {
    // 获取用户数据列表
    getUsers(data) {
        console.log(data);
        return axios.get(`${base.sq}/users`, { params: data });
    },
    // 添加用户
    addUsers(data) {
        console.log(data);
        return axios.post(`${base.sq}/users`, qs.stringify(data));
    },
}

export default users
