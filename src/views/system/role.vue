<template>
	<section class="app-container">
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters" @submit.native.prevent>
				<el-form-item>
					<el-input v-model="filters.name" placeholder="角色名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getRoles">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
                <el-form-item>
                    <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
                </el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table v-loading="loading" :data="roles" highlight-current-row @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="name" label="角色名称">
			</el-table-column>
			<el-table-column prop="created_at" label="创建时间">
			</el-table-column>
			<el-table-column prop="updated_at" label="修改时间">
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--页码-->
    <el-pagination background layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="text-align:center;margin-top:10px">
    </el-pagination>

		<!--编辑界面-->
		<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="50%">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="角色名称" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>

                <el-form-item label="权限" prop="rolePermissions">
                    <el-tree
                    ref="tree"
                    class="el-form-permisson-item"
                    :props="props"
                    :data="permissions"
                    node-key="key"
                    default-expand-all
                    show-checkbox
                    @check-change="handleCheckChange">
                    </el-tree>
                </el-form-item>

			</el-form>
			<div slot="footer" class="dialog-footer">
			 <el-button @click.native="dialogFormVisible=false">取消</el-button>
			    <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">添加</el-button>
                <el-button v-else type="primary" @click="updateData">修改</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
import { asyncRouterMap } from '@/router/index.js'
import {
  getRoleListPage,
  removeRole,
  batchRemoveRole,
  editRole,
  addRole
} from '@/api/role-table'

export default {
  data() {
    return {
      loading: true,
      // 权限
      permissions: asyncRouterMap,
      props: {
        label: 'name',
        children: 'children'
      },
      defaultId: 0,
      rolePermissions: [],

      dialogStatus: '',
      textMap: {
        update: '编辑角色',
        create: '创建角色'
      },
      dialogFormVisible: false,
      filters: {
        name: ''
      },
      roles: [],
      total: 0,
      page: 1,
      sels: [], // 列表选中列
      editFormRules: {
        name: [{ required: true, message: '请输入权限名称', trigger: 'blur' }]
      },
      // 编辑界面数据
      editForm: {
        name: ''
      },

      addFormVisible: false, // 新增界面是否显示
      addFormRules: {
        name: [{ required: true, message: '请输入权限名称', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 权限选择
    rolePermissionsChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate)
      if (checked) {
        console.log('add:' + data.key)
        var exists = this.rolePermissions.indexOf(data.key)

        if (exists <= -1) {
          this.rolePermissions.push(data.key)
        }
      } else {
        console.log('del:' + data.key)
        var index = this.rolePermissions.indexOf(data.key)
        if (index > -1) {
          this.rolePermissions.splice(index, 1)
        }
      }
    },
    handleCheckChange(data, checked, indeterminate) {
      this.rolePermissionsChange(data, checked, indeterminate)
    },
    // 获取用户列表
    handleCurrentChange(val) {
      this.page = val
      this.getRoles()
    },
    getRoles() {
      const para = {
        page: this.page,
        name: this.filters.name
      }

      getRoleListPage(para).then(res => {
        this.total = res.total
        this.roles = res.roles
        this.loading = false
      }).catch(() => { this.loading = false })
    },
    // 删除
    handleDel(index, row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      })
        .then(() => {
          const para = { id: row.id }
          removeRole(para).then(res => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getRoles()
          })
        })
        .catch(() => {})
    },
    // 显示编辑界面
    handleEdit(index, row) {
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.editForm = Object.assign({}, row)

      this.defaultId = row.id
      var defaultPermissions = JSON.parse(row.permission)

      var that = this
      setTimeout(function() { that.$refs.tree.setCheckedKeys(defaultPermissions) }, 50)
    },
    // 显示新增界面
    handleAdd() {
      this.defaultId = 0
      var that = this
      setTimeout(function() { that.$refs.tree.setCheckedKeys([]) }, 50)
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.editForm = {
        name: ''
      }
    },
    // 编辑
    updateData() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {})
            .then(() => {
              const para = {
                id: this.defaultId,
                name: this.editForm.name,
                rolePermissions: this.rolePermissions
              }
              editRole(para).then(res => {
                this.$message({
                  message: '提交成功',
                  type: 'success'
                })
                this.$refs['editForm'].resetFields()
                this.dialogFormVisible = false
                this.getRoles()
              })
            })
            .catch(e => {
              // 打印一下错误
              console.log(e)
            })
        }
      })
    },
    // 新增
    createData: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {})
            .then(() => {
              this.editForm.id = (parseInt(Math.random() * 100)).toString() // mock a id
              const para = {
                name: this.editForm.name,
                rolePermissions: this.rolePermissions
              }
              addRole(para).then(res => {
                this.$message({
                  message: '提交成功',
                  type: 'success'
                })
                this.$refs['editForm'].resetFields()
                this.dialogFormVisible = false
                this.getRoles()
              })
            })
            .catch(e => {
              // 打印一下错误
              console.log(e)
            })
        }
      })
    },
    // 全选单选多选
    selsChange(sels) {
      this.sels = sels
    },
    // 批量删除
    batchRemove() {
      var ids = this.sels.map(item => item.id).toString()
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      })
        .then(() => {
          const para = { ids: ids }
          batchRemoveRole(para).then(res => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getRoles()
          })
        })
        .catch(() => {})
    }
  },
  mounted() {
    this.getRoles()
    console.log(this.permissions)
  }
}
</script>

<style scoped>
.el-form-permisson-item{
  max-height: 300px;
  overflow-y: scroll;
}
</style>