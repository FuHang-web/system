<template>
  <div class="roles">
    <el-card class="box-card">
      <el-button type="primary" size="small" @click="addRoles"
        >添加角色</el-button
      >
      <el-table :data="rolesList" border>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template #default="{ row }">
            <el-row
              :class="['bottomBorder', i1 === 0 ? 'topBorder' : '']"
              v-for="(item1, i1) in row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightsById(row, item1.id)">{{
                  item1.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染耳机和三级权限 -->
              <el-col :span="19">
                <!-- 通过 for 循环 嵌套渲染二级权限 -->
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  :class="[i2 === 0 ? '' : 'topBorder']"
                >
                  <!-- 二级标签 -->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightsById(row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级标签 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightsById(row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column
          type="index"
          width="60px"
          align="center"
          label="#"
        ></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column
          label="操作"
          width="150"
          class="operating"
          align="center"
        >
          <template #default="{ row }">
            <el-link
              :underline="false"
              type="primary"
              icon="el-icon-edit"
              @click="alterRoles(row)"
              >编辑</el-link
            >
            <el-link
              :underline="false"
              type="danger"
              icon="el-icon-delete"
              @click="removeRoles(row)"
              >删除</el-link
            >
            <el-link
              :underline="false"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightsDialog(row)"
              >分配权限</el-link
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加、编辑的dialog对话框 -->
    <el-dialog
      :title="addOrAlter === 0 ? '添加角色' : '修改角色信息'"
      :visible.sync="addOrAlterDialog"
      width="25%"
      class="addOrAlterDialogStyle"
      @close="closeAddOrAlterDialog"
    >
      <el-form
        ref="addOrAlterFormRef"
        :model="addOrAlterForm"
        label-width="80px"
      >
        <el-form-item
          label="角色名称"
          prop="roleName"
          :rules="formRules.required"
        >
          <el-input
            size="small"
            clearable
            v-model="addOrAlterForm.roleName"
            placeholder="请输入需要添加的角色名"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2 }"
            size="small"
            v-model="addOrAlterForm.roleDesc"
            placeholder="请输入关于此角色的描述（可选）"
          ></el-input>
        </el-form-item>
        <el-form-item class="formButtonStyle">
          <el-button
            size="small"
            type="info"
            @click="addUsersRoles"
            v-if="addOrAlter === 0"
            >确 定</el-button
          >
          <el-button size="small" type="info" @click="alterUsersRoles" v-else
            >修 改</el-button
          >
          <el-button size="small" @click="addOrAlterDialog = false"
            >取 消</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 展开分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="dialogShowRights"
      width="50%"
      class="dialogStyle"
      @close="setRightDialogClosed"
    >
      <el-tree
        ref="treeRef"
        :data="rightsList"
        :props="defaultProps"
        show-checkbox
        node-key="id"
        auto-expand-parent
        :default-expanded-keys="defKeys"
        :default-checked-keys="defKeys"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="info" @click="allotRights"
          >确 定</el-button
        >
        <el-button size="small" @click="cancelShowDialog">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'roles',
  data() {
    return {
      formRules: this.$store.state.formRules,
      // 判断当前打开弹窗是新增还是编辑
      addOrAlter: 0,
      //
      addOrAlterForm: {
        roleName: '',
        roleDesc: '',
      },
      // 角色数据列表
      rolesList: [],
      // 控制dialog弹窗的显示隐藏
      dialogShowRights: false,
      // 控制添加、编辑的dialog对话框显示隐藏
      addOrAlterDialog: false,
      // 所有权限的数据列表
      rightsList: [],
      // 树形控件的属性绑定对象
      defaultProps: {
        children: 'children',
        label: 'authName',
      },
      // 默认选中的节点Id值数组
      defKeys: [],
      // roleId
      roleId: '',
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    //
    // 关闭添加、编辑角色的dialog弹窗
    closeAddOrAlterDialog() {
      this.$refs.addOrAlterFormRef.clearValidate()
      this.addOrAlterForm = {
        roleName: '',
        roleDesc: '',
      }
    },
    // 添加角色-确定提交
    async addUsersRoles() {
      console.log(this.addOrAlterForm)
      this.$refs.addOrAlterFormRef.validate(async (validate) => {
        if (!validate) {
          return false
        }
        const { data: res } = await this.$http.addUsersRoles(
          this.addOrAlterForm
        )
        if (res.meta.status !== 201) {
          return this.$message.error('创建角色失败')
        }
        this.$message.success('创建角色成功')
        this.addOrAlterDialog = false
        this.getRolesList()
      })

      // console.log(res)
    },
    // 修改角色-修改提交
    async alterUsersRoles() {
      console.log(this.addOrAlterForm)
      this.$refs.addOrAlterFormRef.validate(async (validate) => {
        if (!validate) {
          return false
        }
        const { data: res } = await this.$http.putUsersRoles(
          this.addOrAlterForm
        )
        if (res.meta.status !== 200) {
          return this.$message.error('修改角色信息失败')
        }
        this.$message.success('修改角色信息成功')
        this.addOrAlterDialog = false
        this.getRolesList()
      })
      // console.log(res)
    },
    // 点击添加角色按钮
    addRoles() {
      console.log('添加')
      this.addOrAlterDialog = true
      this.addOrAlter = 0
    },
    // 点击编辑角色按钮
    alterRoles(row) {
      this.addOrAlterForm = Object.assign({}, row)
      this.addOrAlterDialog = true
      this.addOrAlter = 1
    },
    // 删除单个角色
    async removeRoles(row) {
      console.log(row.id)
      const removeResult = await this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch((err) => err)
      console.log(removeResult)
      if (removeResult !== 'confirm') {
        return this.$message.info('取消删除')
      }
      const { data: res } = await this.$http.removeUsersRoles(row.id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败，请稍后再试')
      }
      this.getRolesList()
      this.$message.success('删除成功')
    },
    // 获取角色数据列表
    async getRolesList() {
      const { data: res } = await this.$http.getRolesList()
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色数据失败')
      }
      this.rolesList = res.data
      console.log(res)
    },
    // 根据Id删除对应的权限
    async removeRightsById(role, rightsId) {
      const confirmResult = await this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch((err) => err)
      console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消删除')
      }
      const { data: res } = await this.$http.deleteRoleRights(role, rightsId)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败，请稍后再试')
      }
      role.children = res.data
      this.$message.success('删除成功')
    },
    // 展示分配权限的对话框
    async showSetRightsDialog(role) {
      this.roleId = role.id
      // this.defKeys.length = 0;
      const { data: res } = await this.$http.getRightsList('tree')
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败')
      }
      this.rightsList = res.data
      console.log(role)
      console.time()
      this.getLeafKeys(role, this.defKeys)
      console.timeEnd()
      this.dialogShowRights = true
    },
    // 递归获取三级节点的id值 并存入 defKeys 数组中
    getLeafKeys(node, arr) {
      if (!node.children) {
        // console.log(node)
        return arr.push(node.id)
      }
      for (let i = 0, len = node.children.length; i < len; i++) {
        this.getLeafKeys(node.children[i], arr)
      }
      // node.children.forEach((item) => {
      //   this.getLeafKeys(item, arr)
      // })
    },
    // 关闭 Dialog 弹窗的触发事件
    setRightDialogClosed() {
      this.defKeys.length = 0
    },
    // 取消
    cancelShowDialog() {
      this.dialogShowRights = false
    },
    // 确定-分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]
      console.log(keys)
      const keysStr = keys.join(',')
      const { data: res } = await this.$http.postAllotRights(
        this.roleId,
        keysStr
      )
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      this.getRolesList()
      this.dialogShowRights = false
    },
  },
}
</script>

<style lang="less" scoped>
.roles {
  button {
    &:hover {
      background-color: var(--themeBgColor) !important;
      border-color: var(--themeBgColor) !important;
      color: var(--themeColor) !important;
    }
    &.el-button--primary {
      background-color: var(--themeBgColor);
      border-color: var(--themeBgColor);
      color: var(--themeColor);
      margin-bottom: 20px;
    }
    &.el-button--info {
      background-color: var(--themeColor);
      border-color: var(--themeBgColor);
      color: var(--themeBgColor);
    }
  }
  a {
    // background-color: var(--themeBgColor);
    // border-color: var(--themeBgColor);
    color: var(--themeBgColor);
    // &:hover {
    //   background-color: var(--themeHoverColor) !important;
    //   // border-color: var(--themeHoverColor) !important;
    // }
    // 删除
    &.el-link--danger {
      // background-color: var(--deleteBgColor);
      // border-color: var(--deleteBgColor);
      color: var(--deleteBgColor);
    }
    // 设置
    &.el-link--warning {
      // background-color: var(--setUpBgColor);
      // border-color: var(--setUpBgColor);
      color: var(--setUpBgColor);
    }
  }
  /deep/.box-card {
    .el-table__body-wrapper {
      .el-table__body {
        tbody {
          .el-table__row {
            :last-child {
              .cell {
                display: flex;
                justify-content: space-around;
                flex-wrap: wrap;
              }
            }
          }
        }
      }
    }
  }
  /deep/.addOrAlterDialogStyle {
    .el-dialog__header {
      .el-dialog__title {
        // color: var(--themeBgColor);
        font-family: 微软雅黑;
      }
    }
    .el-dialog__body {
      padding: 20px;
      .el-form {
        .formButtonStyle {
          margin-bottom: 0;
          text-align: right;
        }
      }
    }
  }
  .el-tag {
    margin: 7px;
  }
  .topBorder {
    border-top: 1px solid #eee;
  }
  .bottomBorder {
    border-bottom: 1px solid #eee;
  }
  .el-table__expanded-cell {
    .el-row {
      display: flex;
      align-items: center;
    }
  }
  .el-dialog__wrapper {
    box-sizing: border-box;
  }
}
</style>
