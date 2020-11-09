<template>
  <div class="roles">
    <el-card class="box-card">
      <el-button size="small">添加角色</el-button>
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
            <el-link :underline="false" type="primary" icon="el-icon-edit"
              >编辑</el-link
            >
            <el-link :underline="false" type="danger" icon="el-icon-delete"
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
        <el-button @click="cancelShowDialog">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'roles',
  data() {
    return {
      // 角色数据列表
      rolesList: [],
      // 控制dialog弹窗的显示隐藏
      dialogShowRights: false,
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
    &.el-button--default {
      background-color: var(--themeBgColor);
      border-color: var(--themeBgColor);
      color: var(--themeColor);
      margin-bottom: 20px;
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
