<template>
  <el-container class="home-container">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '200px'">
      <div class="toggle-button" v-if="!isCollapse">电商后台管理系统</div>
      <!-- 侧边栏菜单区 -->
      <el-menu
        @open="handleOpen"
        @close="handleClose"
        background-color="#333744"
        text-color="#fff"
        active-text-color="#409eff"
        :unique-opened="true"
        :collapse-transition="false"
        :collapse="isCollapse"
        router
        :default-active="$route.path"
      >
        <!-- 一级菜单 -->
        <el-submenu
          :index="item.order + ''"
          v-for="item in menuList"
          :key="item.id"
        >
          <!-- 一级菜单的模板区 -->
          <template slot="title">
            <!-- 图标 -->
            <i
              :class="iconsObj[item.id]"
              :style="{ fontSize: isCollapse ? '24px' : '16px' }"
            ></i>
            <!-- 文本 -->
            <span>{{ item.authName }}</span>
          </template>
          <!-- 二级菜单 -->
          <el-menu-item
            :index="'/' + subItem.path"
            v-for="subItem in item.children"
            :key="subItem.id"
            @click="saveNavState(subItem)"
          >
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-menu"></i>
              <!-- 文本 -->
              <span>{{ subItem.authName }}</span>
            </template>
          </el-menu-item>
          <!-- <el-menu-item index="1-4-2">选项2</el-menu-item> -->
        </el-submenu>
      </el-menu>
    </el-aside>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 头部区域 -->
      <el-header>
        <!-- 折叠按钮 -->
        <div class="fold-button">
          <i
            :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
            @click="foldClick"
          ></i>
        </div>
        <div>
          <!-- 颜色选择 -->
          <el-color-picker
            color-format="rgb"
            v-model="color"
            size="mini"
            @change="colorChange"
          >
          </el-color-picker>
          <!-- 消息列表 -->
          <el-popover placement="top" width="400" trigger="hover">
            <el-table :data="gridData">
              <el-table-column
                property="name"
                label="标题内容"
              ></el-table-column>
              <el-table-column property="date" label="时间"></el-table-column>
            </el-table>
            <p :style="{ textAlign: 'right', padding: '0', margin: '0' }">
              <el-button class="view-all" type="text" @click="messageList"
                >查看全部</el-button
              >
            </p>
            <el-badge is-dot class="item" slot="reference"
              ><i class="el-icon-bell"></i
            ></el-badge>
          </el-popover>
          <!-- 用户头像 -->
          <img src="../assets/image/Avatar.png" alt="" />
          <!-- 用户下拉框 -->
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              admin<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="1">首页</el-dropdown-item>
              <el-dropdown-item command="2">个人信息</el-dropdown-item>
              <!-- <el-dropdown-item disabled>双皮奶</el-dropdown-item> -->
              <el-dropdown-item command="3" divided>退出系统</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <!-- <el-button type="info" size="mini" > 退出 </el-button> -->
      </el-header>
      <!-- 标签栏 -->
      <div class="tabList">
        <el-card shadow="never"
          ><el-tag ref="goHomeRef" effect="plain" @click="goHome">首页</el-tag>
          <el-tabs
            v-model="editableTabsValue"
            type="card"
            closable
            @tab-remove="removeTab"
            @tab-click="clickTab"
          >
            <el-tab-pane
              v-for="item in this.$store.state.editableTabs"
              :key="item.name"
              :label="item.title"
              :name="item.name"
            >
            </el-tab-pane> </el-tabs
        ></el-card>
      </div>
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {
      editableTabsValue: 'welcome',
      editableTabs: [
        // {
        //   title: '首页',
        //   name: 'welcome',
        //   // path: 'welcome',
        // },
        // {
        //   title: '角色列表',
        //   name: 'roles',
        //   // path: 'roles',
        // },
      ],
      // tabIndex: 2,

      // 标签列表
      tagList: [
        // { name: '标签一', path: 'roles' },
        // { name: '标签二', path: 'rights' },
        // { name: '标签三', path: 'users' },
      ],
      // // path路径
      // isActivePath: '',
      // 消息列表
      gridData: [
        {
          date: '2016-05-02',
          name: '测试1',
        },
        {
          date: '2016-05-04',
          name: '测试2',
        },
      ],
      // 左侧菜单数据
      menuList: [],
      // 一级标题图标
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao',
      },
      // 是否折叠菜单
      isCollapse: false,
      color: 'rgb(64,158,255)',
    }
  },
  created() {
    if (window.sessionStorage.getItem('tableTabs')) {
      const tableList = JSON.parse(window.sessionStorage.getItem('tableTabs'))
      // 获取当前路由名字
      // this.isActivePath = window.sessionStorage.getItem('activePath')
      // 获取缓存中的tab列表
      this.$store.state.editableTabs = tableList
      // 设置当前路由路径
      this.editableTabsValue = this.$route.path.replace('/', '')
    }

    this.getMenuList()
    // 写入token
    this.$store.commit({
      type: 'updateToken',
      token: window.sessionStorage.getItem('token'),
    })
    // console.log(tableList)
    // //
    // if (tableList.length === 0) {
    //   this.$router.push('/welcome')
    // }
  },
  mounted() {
    if (this.$route.path === '/welcome') {
      this.$refs.goHomeRef.$el.style.color = '#409eff'
      this.$refs.goHomeRef.$el.style.border = '1px solid #409eff'
      // this.isActivePath = ''
    }
  },
  methods: {
    removeTab(targetName) {
      const tabs = this.$store.state.editableTabs
      let activeName = this.editableTabsValue
      console.log(activeName)
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            const nextTab = tabs[index + 1] || tabs[index - 1]
            console.log('=====')
            if (nextTab) {
              console.log('nextTab')
              activeName = nextTab.name
            } else {
              console.log('没有nextTab')
            }
          }
        })
        this.editableTabsValue = activeName
        this.$store.state.editableTabs = tabs.filter(
          (tab) => tab.name !== targetName
        )
        console.log(this.$store.state.editableTabs)
        window.sessionStorage.setItem(
          'tableTabs',
          JSON.stringify(this.$store.state.editableTabs)
        )
        // console.log(this.isActivePath)
        // console.log(this.$store.state.editableTabs.length)
        if (this.$store.state.editableTabs.length === 0) {
          // this.goHome()
          this.$refs.goHomeRef.$el.style.color = '#409eff'
          this.$refs.goHomeRef.$el.style.border = '1px solid #409eff'
          // this.isActivePath = ''
          this.$router.push('/welcome')
          console.log('走1')
        } else {
          // this.isActivePath = `/${activeName}`
          this.$router.push(`/${this.editableTabsValue}`)
          console.log('走2')
          // console.log(this.editableTabsValue)
          // console.log(this.$store.state.editableTabs)
        }
        // console.log(activeName)
        // console.log(this.isActivePath)
        // console.log(this.editableTabsValue)
      }
    },
    clickTab(targetName) {
      console.log(targetName)
      console.log(this.editableTabsValue)
      console.log(this.$route.path)
      // if (this.$route.path.replace('/', '') !== targetName.name) {
      // this.isActivePath = `/${targetName.name}`
      this.$router.push(`/${targetName.name}`)
      window.sessionStorage.setItem('activePath', `/${targetName.name}`)
      // }
      console.log(targetName)
      console.log(targetName.active)
      if (targetName.active) {
        this.$refs.goHomeRef.$el.style.color = '#ccc'
        this.$refs.goHomeRef.$el.style.border = '1px solid #eee'
      }
      console.log(this.$refs.goHomeRef)
    },
    // 颜色
    colorChange(newColor) {
      const a = newColor.replace(/\s/g, '').slice(4, -1).split(',')
      console.log(a)
      console.log(newColor)
      // (0.2126*R + 0.7152*G + 0.0722*B)
      const b = `${
        0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[0] > 255 / 2
          ? '#000'
          : '#fff'
      }`
      console.log(b)
      // console.log(document.body.style.getPropertyValue('--color').trim());
      document.body.style.setProperty('--themeBgColor', newColor)
      document.body.style.setProperty('--themeColor', b)
      // console.log(document.body.style.getPropertyValue('--color').trim());
      // window.less
      //   .modifyVars({
      //     '@bgThemeColor': e,
      //   })
      //   .then(() => {
      //     console.log('成功')
      //   })
    },
    // 当前用户下拉列表的点击事件
    handleCommand(command) {
      console.log(command)
      switch (command) {
        case '1':
          console.log('这是1')
          break
        case '2':
          console.log('这是2')
          break
        case '3':
          console.log('这是3')
          this.logout()
          break
        default:
          console.log('默认')
          break
      }
      // this.$message('click on item ' + command)
    },
    // 折叠按钮
    foldClick() {
      this.isCollapse = !this.isCollapse
    },
    // 退出
    logout() {
      //   清空token
      window.sessionStorage.clear()
      //   跳转到登录页
      this.$router.push({ name: 'login' })
    },
    // 获取所有的菜单
    async getMenuList() {
      const { data: res } = await this.$http.getMenuList()
      console.log(res.data)
      if (res.meta.status === 200) {
        this.menuList = res.data
      }
    },
    // 查看全部-消息中心
    messageList() {
      console.log('消息中心')
      // if (this.$route.path !== '/message') {
      const item = this.$store.state.editableTabs.findIndex(
        (item) => item.name === 'message'
      )
      if (item === -1) {
        this.$store.state.editableTabs.push({
          title: '消息列表',
          name: 'message',
        })
      }
      // tabs选中 name 值
      this.editableTabsValue = 'message'
      this.$router.push('/message')
      // this.isActivePath = ''
      this.$refs.goHomeRef.$el.style.color = '#ccc'
      this.$refs.goHomeRef.$el.style.border = '1px solid #eee'
      // 将tableTabs写入缓存
      window.sessionStorage.setItem(
        'tableTabs',
        JSON.stringify(this.$store.state.editableTabs)
      )
      // 将activePath写入缓存
      window.sessionStorage.setItem('activePath', '/message')
      // }
    },
    test(e) {
      console.log(e)
    },
    // 获取当前路由并存入缓存
    saveNavState(activePath) {
      const item = this.$store.state.editableTabs.findIndex(
        (item) => item.name === activePath.path
      )
      if (item === -1) {
        this.$store.state.editableTabs.push({
          title: activePath.authName,
          name: activePath.path,
        })
      }
      this.$refs.goHomeRef.$el.style.color = '#ccc'
      this.$refs.goHomeRef.$el.style.border = '1px solid #eee'
      // tabs选中 name 值
      this.editableTabsValue = activePath.path
      // this.isActivePath = `/${activePath.path}`
      // 将tableTabs写入缓存
      window.sessionStorage.setItem(
        'tableTabs',
        JSON.stringify(this.$store.state.editableTabs)
      )
      // 将activePath写入缓存
      window.sessionStorage.setItem('activePath', `/${activePath.path}`)
    },
    // 首页
    goHome() {
      console.log(this.$route.path)
      if (this.$route.path !== '/welcome') {
        this.$router.push({ name: 'welcome' })
        // this.isActivePath = ''
        this.editableTabsValue = ''
        this.$refs.goHomeRef.$el.style.color = '#409eff'
        this.$refs.goHomeRef.$el.style.border = '1px solid #409eff'
        window.sessionStorage.removeItem('activePath')
      }
    },
    // 删除标签
    tagClose(tag) {
      this.tagList.splice(this.tagList.indexOf(tag), 1)
      console.log(tag)
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    },
  },
}
</script>

<style lang="less" scoped>
.iconfont {
  margin-right: 8px;
}
.activeTagBorder {
  background-color: #fff;
  border-color: #b3d8ff;
  color: #409eff;
}
// 当前用户下拉列表
.el-dropdown-menu__item {
  line-height: 24px;
  font-size: 12px;
}
.home-container {
  height: 100%;
  background-color: #eaedf1;
  // 侧边栏
  .el-aside {
    background-color: rgb(32, 34, 42) !important;
    // 侧边栏边框样式
    /deep/.el-menu {
      border-right: none;
      .el-submenu {
        .el-submenu__title {
          color: rgba(255, 255, 255, 0.7) !important;
          background-color: rgb(32, 34, 42) !important;
          &:hover {
            color: #fff !important;
            background-color: rgba(0, 0, 0, 0.5) !important;
          }
        }
      }
      .el-menu-item {
        color: rgba(255, 255, 255, 0.7) !important;
        background-color: rgb(32, 34, 42) !important;
        &:hover {
          color: #fff !important;
          background-color: rgba(0, 0, 0, 0.5) !important;
        }
      }
      .el-menu-item.is-active {
        background-color: rgba(0, 0, 0, 0.8) !important;
        color: #fff !important;
        position: relative;
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background-color: #409eff;
        }
      }
    }
    // 侧边栏折叠按钮
    .toggle-button {
      font-size: 18px;
      text-align: center;
      color: rgba(255, 255, 255, 0.7);
      cursor: default;
      height: 56px;
      line-height: 56px;
      // box-shadow: 0 1px 2px 0 rgba(0,0,0,.15);
    }
  }

  // 页面主体区域
  .el-container {
    // 头部区域
    .el-header {
      background-color: #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      // justify-content: flex-end;
      // 折叠按钮
      .fold-button {
        .el-icon-s-fold,
        .el-icon-s-unfold {
          font-size: 24px;
          cursor: pointer;
        }
      }
      > div {
        display: flex;
        align-items: center;
        // 用户头像
        img {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          padding: 3px;
          border: 1px solid rgba(0, 0, 0, 0.2);
          margin: 0 10px 0 70px;
          box-sizing: border-box;
        }
        // 消息中心
        .el-badge {
          margin: 0 10px;
        }
        span {
          color: #606266 !important;
          font-size: 14px;
          // padding-left: 10px;
          i {
            font-size: 14px !important;
          }
        }
        //
        /deep/.view-all {
          color: #606266 !important;
          float: right;
        }
        // 用户下拉框
        .el-dropdown-link {
          cursor: pointer;
          color: #409eff;
        }
        .el-icon-arrow-down {
          font-size: 12px;
        }
      }
    }
    // 标签栏
    .tabList {
      padding: 10px;
      /deep/.el-card {
        .el-card__body {
          padding: 5px 0;
          display: flex;
        }
      }
      // height: 40px;
      // margin: 5px 0;
      // background-color: #fff;
      // box-sizing: border-box;
      // display: flex;
      // align-items: center;
      /deep/.el-tabs {
        height: 100%;
        display: flex;
        align-items: center;
        > .el-tabs__header {
          border: none;
          margin: 0;
          .el-tabs__nav-wrap {
            margin-bottom: 0;
          }
          .el-tabs__nav {
            border: none;
            .el-tabs__item {
              height: 30px;
              line-height: 30px;
              border: 1px solid #eee;
              border-radius: 3px;
              margin: 0 5px;
              color: #ccc;
            }
            .is-active {
              color: #409eff;
              border: 1px solid #409eff;
            }
          }
        }
      }
      // display: flex;
      // align-items: center;
      // padding-left: 10px;
      // 首页标签
      .el-tag {
        height: 30px;
        line-height: 30px;
        border: none;
        // border: 1px solid #409eff;
        border: 1px solid #eee;
        color: #ccc;
        padding: 0 20px;
        font-size: 14px;
        margin-left: 10px;
        cursor: pointer;
      }
    }
    // 右侧内容主体
    .el-main {
      background-color: #eaedf1;
      padding: 10px;
    }
  }
}
</style>
