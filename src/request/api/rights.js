import base from './base'; // 导入接口域名列表
import axios from '@/request/http'; // 导入http中创建的axios实例
// import qs from 'qs'; // 根据需求是否导入qs模块

const rights = {
  // 获取 所有权限列表
  getRightsList(type) {
    return axios.get(`${base.sq}/rights/${type}`);
  },
  // 获取 角色列表
  getRolesList() {
    return axios.get(`${base.sq}/roles`);
  },
  // 获取 删除角色指定权限
  deleteRoleRights(role, id) {
    return axios.delete(`${base.sq}/roles/${role.id}/rights/${id}`);
  },
  // 获取 删除角色指定权限
  postAllotRights(roleId, rids) {
    return axios.post(`${base.sq}/roles/${roleId}/rights`, {
      rids
    });
  },
}

export default rights
