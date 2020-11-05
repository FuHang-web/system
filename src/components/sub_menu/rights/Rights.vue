<template>
  <div class="rights">
    <el-card class="box-card">
      <el-table :data="authorityList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#" width="50"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column label="权限等级">
          <template #default="{ row }">
            <el-tag
              :type="
                row.level === '0'
                  ? ''
                  : row.level === '1'
                  ? 'success'
                  : 'warning'
              "
              >{{
                row.level === '0' ? '一级' : row.level === '1' ? '二级' : '三级'
              }}</el-tag
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'rights',
  data() {
    return {
      authorityList: [],
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    async getRightsList() {
      const { data: res } = await this.$http.getRightsList('list')
      console.log(res)
      if (res.meta.status !== 200) {
        return false
      }
      this.authorityList = res.data
    },
  },
}
</script>

<style lang="less" scoped>
.rights {
  /deep/.el-card {
  }
}
</style>
