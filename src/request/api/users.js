import base from './base'; // 导入接口域名列表
import axios from '@/request/http'; // 导入http中创建的axios实例
import qs from 'qs'; // 根据需求是否导入qs模块

const users = {
  // 获取用户数据列表
  getUsers(data) {
    console.log(data);
    return axios.get(`${base.sq}/users`, {
      params: data
    });
  },
  // 添加用户
  addUsers(data) {
    console.log(data);
    return axios.post(`${base.sq}/users`, qs.stringify(data));
  },
  // 修改用户状态
  updateUserState(data) {
    console.log(data);
    return axios.put(`${base.sq}/users/${data.id}/state/${data.mg_state}`);
  },
  // 根据 ID 查询用户信息
  getUserInfoById(id) {
    return axios.get(`${base.sq}/users/${id}`);
  },
  // 根据 ID 修改用户信息
  updateUserInfoById(data) {
    console.log(data);
    return axios.put(`${base.sq}/users/${data.id}`, data);
  },
  // 根据 ID 删除用户信息
  removeUserInfoById(id) {
    return axios.delete(`${base.sq}/users/${id}`);
  },
  // 获取角色列表数据
  getRolesListData() {
    return axios.get(`${base.sq}/roles`);
  },
  // 分配用户角色
  allotUserRoles(userId, rolesId) {
    return axios.put(`${base.sq}/users/${userId}/role`, {
      rid: rolesId
    });
  }
}

export default users
