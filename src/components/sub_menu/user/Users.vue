<template>
  <div class="users">
    <el-card class="users-card">
      <el-form
        ref="searchForm"
        :model="queryInfo"
        label-position="left"
        label-width="60px"
      >
        <el-form-item label="用户名">
          <el-input
            v-model="queryInfo.query"
            size="small"
            placeholder="请输入需要搜索的用户"
          ></el-input>
        </el-form-item>
        <el-form-item label-width="10px">
          <el-button size="small" type="primary" @click="querySearch"
            >查询</el-button
          >
          <el-button size="small" type="success" @click="testst"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
      <!-- 添加用户 -->
      <div class="add-user">
        <el-button
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="addUser('dialogFormRef')"
          >添加用户</el-button
        >
      </div>
      <el-table border :data="userList" stripe style="width: 100%">
        <el-table-column type="index" label="序号" width="50" align="center">
        </el-table-column>
        <el-table-column prop="username" label="用户名" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="联系电话" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="role_name" label="权限角色"> </el-table-column>
        <el-table-column prop="mg_state" label="用户状态">
          <template #default="{ row }">
            <el-switch
              v-model="row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="userStateChange(row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130" align="center">
          <template v-slot:default="{ row }">
            <el-link
              class="el-icon-edit"
              type="primary"
              @click="updateUser(row)"
              >编辑</el-link
            >
            <el-link
              class="el-icon-delete"
              type="danger"
              @click="removeUser(row.id)"
              >删除</el-link
            >
          </template>
          <!-- <template slot-scope="scope">
            <el-link
              class="el-icon-edit"
              type="primary"
              @click="updateUser(scope.row)"
              >编辑</el-link
            >
            <el-link
              class="el-icon-delete"
              type="danger"
              @click="deleteUser(scope.row)"
              >删除</el-link
            >
          </template> -->
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogFormVisible"
      @close="closeDialog"
    >
      <el-form :model="form" :rules="dialogFormRules" ref="dialogFormRef">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="用户名称"
              :label-width="formLabelWidth"
              prop="username"
            >
              <el-input
                :disabled="this.isDisabledForm"
                v-model="form.username"
                autocomplete="off"
              ></el-input> </el-form-item
          ></el-col>
          <el-col :span="12">
            <el-form-item
              label="用户密码"
              :label-width="formLabelWidth"
              prop="password"
              v-if="!this.isDisabledForm"
            >
              <el-input
                type="password"
                show-password
                v-model="form.password"
                autocomplete="off"
                :disabled="this.isDisabledForm"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="权限角色"
              :label-width="formLabelWidth"
              prop="role_name"
              v-else
            >
              <el-input
                v-model="form.role_name"
                autocomplete="off"
                :disabled="this.isDisabledForm"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="邮箱"
              :label-width="formLabelWidth"
              prop="email"
            >
              <el-input v-model="form.email" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="手机号"
              :label-width="formLabelWidth"
              prop="mobile"
            >
              <el-input v-model="form.mobile" autocomplete="off"></el-input>
            </el-form-item> </el-col
        ></el-row>
        <el-form-item class="form-buttons">
          <el-button
            type="primary"
            size="small"
            @click="addDialogForm"
            :loading="false"
            v-if="!this.isDisabledForm"
            >确定</el-button
          >
          <el-button
            type="primary"
            size="small"
            @click="updateDialogForm"
            :loading="false"
            v-else
            >修改</el-button
          >
          <el-button
            type="danger"
            size="small"
            @click="cancelDialogForm"
            :loading="false"
            >取消</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
// import DataList from './equipmentadmin/dataList'
// import Add from './equipmentadmin/add'
export default {
  // components: {
  //   DataList,
  //   Add,
  // },
  // 用户列表
  name: 'users',
  data() {
    const phone = /^1(3([0-35-9]\d|4[1-8])|4[14-9]\d|5([0125689]\d|7[1-79])|66\d|7[2-35-8]\d|8\d{2}|9[13589]\d)\d{7}$/
    const isPhone = (rule, value, callback) => {
      console.log(phone)
      console.log(value)
      if (!phone.test(value) && value) {
        return callback(new Error('请输入正确的电话号码'))
      } else {
        callback()
      }
    }
    return {
      // 搜索Form
      searchForm: {
        name: '',
      },
      // 用户列表
      userList: [],
      // 分页
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 12,
      },
      // 用户列表总的数据条数
      total: 1,
      // 添加用户表单
      form: {
        username: '',
        mobile: '',
        email: '',
        role_name: '',
        mg_state: '',
      },
      // 添加用户表单弹窗显示隐藏
      dialogFormVisible: false,
      // 用户弹窗title
      dialogTitle: '',
      // 用户弹窗label的宽度
      formLabelWidth: '80px',
      // 判断是否禁用表单输入
      isDisabledForm: false,
      // 验证规则
      dialogFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 14,
            message: '长度在 6 到 14 个字符',
            trigger: 'blur',
          },
        ],
        mobile: [{ validator: isPhone, trigger: ['blur', 'change'] }],
        email: [
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change'],
          },
        ],
      },
      // activeName: 'first',
      // editableTabs: [
      //   // {
      //   //   title: '添加',
      //   //   name: 'second',
      //   //   content: 'Tab 1 content',
      //   // },
      // ],
    }
  },
  created() {
    this.getUserList()
  },
  mounted() {},
  methods: {
    // 搜索查询
    querySearch() {
      console.log(this.queryInfo)
      this.getUserList()
    },
    // 重置搜索
    testst() {
      this.queryInfo = {
        query: '',
        pagenum: 1,
        pagesize: 10,
      }
      this.getUserList()
    },
    // 用户状态-开关
    async userStateChange(row) {
      console.log(row)
      const { data: res } = await this.$http.updateUserState(row)
      console.log(res)
      if (res.meta.status !== 200) {
        row.mg_state = !row.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功')
    },
    // 新增-确定
    addDialogForm() {
      console.log(this.$refs)
      this.$nextTick(() => {
        console.log(this.$refs)
        this.$refs.dialogFormRef.validate(async (validate) => {
          console.log(validate)
          console.log(this.form)
          if (!validate) return false
          // if (validate) {
          this.dialogFormVisible = false
          const { data: res } = await this.$http.addUsers(this.form)
          // console.log(res)
          if (res.meta.status !== 201) {
            return this.$message.error('添加用户失败')
          } else {
            this.$message.success('添加成功')
            this.getUserList()
          }
          // }
        })
      })
    },
    // 修改-提交
    updateDialogForm() {
      this.$nextTick(() => {
        console.log(this.$refs)
        this.$refs.dialogFormRef.validate(async (validate) => {
          if (!validate) return false
          this.dialogFormVisible = false
          const { data: res } = await this.$http.updateUserInfoById(this.form)
          console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error('修改用户数据失败')
          } else {
            this.$message.success('修改成功')
            this.getUserList()
          }
        })
      })
    },
    // 取消
    cancelDialogForm() {
      this.dialogFormVisible = false
    },
    // 关闭dialog弹窗的回调
    closeDialog() {
      this.$nextTick((item) => {
        console.log(this.$refs)
        this.$refs.dialogFormRef.clearValidate()
        // this.$refs.dialogFormRef.resetFields()
        this.isDisabledForm = false
      })
      // this.$refs.dialogFormRef.resetFields()
    },
    // 添加用户-打开弹窗
    addUser() {
      console.log(this.$refs)
      this.form = {}
      this.dialogFormVisible = true
      this.dialogTitle = '添加用户'
    },
    // // 查看用户数据
    // viewUser(row) {
    //   console.log(row);
    //   this.form = row
    //   console.log(this.dialogFormVisible)
    //   this.dialogFormVisible = true
    //   this.isDisabledForm = false
    //   this.dialogTitle = '查看用户'
    // },
    // 修改用户数据
    async updateUser(row) {
      this.isDisabledForm = true
      this.dialogFormVisible = true
      this.dialogTitle = '修改数据'
      console.log(row)
      const { data: res } = await this.$http.getUserInfoById(row.id)
      console.log(res)
      if (res.meta.status !== 200) return (this.form = row)
      this.form = res.data
      this.form.role_name = row.role_name
      console.log(this.dialogFormVisible)
    },
    // 删除用户数据
    removeUser(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const { data: res } = await this.$http.removeUserInfoById(id)
          if (res.meta.status !== 200) {
            return this.$message.error('删除操作有误，请刷新后再试')
          } else {
            this.$message.success('删除用户数据成功')
            this.getUserList()
          }
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
      console.log(id)
      // const { data: res } = await this.$http.deleteUserInfoById(id)
      // if (res.meta.status !== 200) {
      //   return this.$message.error('删除操作有误，请刷新后再试')
      // }
    },
    // 获取用户列表
    async getUserList() {
      const { data: res } = await this.$http.getUsers(this.queryInfo)
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.total = res.data.total
      this.userList = res.data.users
      this.$message.success(res.meta.msg)
    },
    // 分页
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
      console.log(`每页 ${newSize} 条`)
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
      console.log(`当前页: ${newPage}`)
    },
    // handleClick(tab, event) {
    //   console.log(tab, event)
    // },
    // addcon(val) {
    //   console.log(val)
    //   if (val) {
    //     this.editableTabs.push({
    //       title: '添加',
    //       name: 'second',
    //     })
    //     this.activeName = 'second'
    //   }
    // },
    // removeTab(targetName) {
    //   console.log(targetName)
    //   const tabs = this.editableTabs
    //   let activeName = this.activeName
    //   if (activeName === targetName) {
    //     tabs.forEach((tab, index) => {
    //       if (tab.name === targetName) {
    //         const nextTab = tabs[index + 1] || tabs[index - 1]
    //         if (nextTab) {
    //           activeName = nextTab.name
    //         }
    //       }
    //     })
    //   }
    //   this.activeName = 'first'
    //   // this.activeName = activeName
    //   this.editableTabs = tabs.filter((tab) => tab.name !== targetName)
    // },
  },
}
</script>

<style lang="less" scoped>
.users {
  /deep/.users-card {
    .el-card__body {
      padding: 10px 20px;
      .el-form {
        display: flex;
        .el-form-item {
          margin-bottom: 0;
        }
      }
      .add-user {
        width: auto;
        box-sizing: border-box;
        padding: 10px 0;
      }
      .el-table {
        // min-height: 400px;
        .cell {
          display: flex;
          justify-content: space-around;
        }
      }
      .el-pagination {
        text-align: right;
        padding-top: 10px;
      }
    }
  }
  .el-dialog__wrapper {
    .el-dialog {
      .el-dialog__body {
        .el-form {
          .form-buttons {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 0;
          }
        }
      }
    }
  }
}
</style>
