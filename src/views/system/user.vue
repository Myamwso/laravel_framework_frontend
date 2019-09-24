<template>
	<section class="app-container">
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters" @submit.native.prevent>
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
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
		<el-table v-loading="loading" :data="users" highlight-current-row @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="name" label="姓名">
			</el-table-column>
            <el-table-column prop="user_name" label="用户名">
			</el-table-column>
            <el-table-column prop="status" label="状态" :formatter="formatStatus">
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
        <!--新增界面-->
		<el-dialog v-if="dialogStatus=='create'" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisibleAdd" :close-on-click-modal="false" width="50%">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>

        <el-form-item label="用户名" prop="user_name">
					<el-input v-model="addForm.user_name" auto-complete="off"></el-input>
				</el-form-item>

        <el-form-item label="密码" prop="password">
					<el-input v-model="addForm.password" type="password" auto-complete="off" placeholder="密码长度最少为8位数"></el-input>
				</el-form-item>

        <el-form-item label="重复密码" prop="re_password">
					<el-input v-model="addForm.re_password" type="password" auto-complete="off"></el-input>
				</el-form-item>

        <el-form-item label="角色" prop="roles">
            <el-checkbox-group 
                v-model="addForm.user_roles">
                <el-checkbox v-for="role in total_roles" :label="role.id" :key="role.id">{{role.name}}</el-checkbox>
            </el-checkbox-group>
        </el-form-item>

			</el-form>
			<div slot="footer" class="dialog-footer">
			 <el-button @click.native="dialogFormVisibleAdd=false">取消</el-button>
			    <el-button type="primary" @click="createData">添加</el-button>
			</div>
		</el-dialog>

		<!--编辑界面-->
		<el-dialog v-if="dialogStatus!='create'" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="50%">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>

        <el-form-item label="用户名" prop="user_name">
					<el-input v-model="editForm.user_name" auto-complete="off"></el-input>
				</el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="editForm.status" placeholder="请选择">
            <el-option
              v-for="item in userStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="密码" prop="password">
					<el-input v-model="editForm.password" type="password" auto-complete="off" placeholder="密码长度最少为8位数"></el-input>
				</el-form-item>

        <el-form-item label="重复密码" prop="re_password">
					<el-input v-model="editForm.re_password" type="password" auto-complete="off"></el-input>
				</el-form-item>

        <el-form-item label="角色" prop="roles">
            <el-checkbox-group 
                v-model="editForm.user_roles">
                <el-checkbox v-for="role in total_roles" :label="role.id" :key="role.id">{{role.name}}</el-checkbox>
            </el-checkbox-group>
        </el-form-item>

			</el-form>
			<div slot="footer" class="dialog-footer">
			 <el-button @click.native="dialogFormVisible=false">取消</el-button>
                <el-button type="primary" @click="updateData">修改</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
import {
  getUserListPage,
  removeUser,
  batchRemoveUser,
  editUser,
  addUser
} from '@/api/user-table'
import {
  getRoleTotal
} from '@/api/role-table'

export default {
  data() {
    return {
      loading: true,
      total_roles: [],
      dialogStatus: '',
      userStatus: [{
        value: 1,
        label: '正常'
      }, {
        value: 2,
        label: '锁定'
      }],
      textMap: {
        update: '编辑用户',
        create: '创建用户'
      },
      dialogFormVisibleAdd: false,
      dialogFormVisible: false,
      filters: {
        name: '',
        user_name: '',
        password: '',
        re_password: '',
        user_roles: []
      },
      users: [],
      total: 0,
      page: 1,
      sels: [], // 列表选中列

      // 编辑界面数据
      editForm: {
        name: '',
        user_name: '',
        status: 1,
        password: '',
        re_password: '',
        user_roles: []
      },
      editFormRules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        user_name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        user_roles: [{ required: true, message: '请选择角色', trigger: 'blur' }],
        password: [{ min: 8, message: '密码长度最少为8位数', trigger: 'blur' }]
      },

      addForm: {
        name: '',
        user_name: '',
        password: '',
        re_password: '',
        user_roles: []
      },
      addFormRules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        user_name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 8, message: '密码长度最少为8位数', trigger: 'blur' }],
        re_password: [{ required: true, message: '请输入重复密码', trigger: 'blur' }],
        user_roles: [{ required: true, message: '请选择角色', trigger: 'blur' }]
      }
    }
  },
  methods: {
    formatStatus(row, column) {
      return row.status === 1 ? '正常' : row.status === 2 ? '锁定' : '异常'
    },
    // 获取用户列表
    handleCurrentChange(val) {
      this.page = val
      this.getUsers()
    },
    getUsers() {
      const para = {
        page: this.page,
        name: this.filters.name
      }

      getUserListPage(para).then(res => {
        this.total = res.total
        this.users = res.users
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
          removeUser(para).then(res => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getUsers()
          })
        })
        .catch(() => {})
    },
    // 显示编辑界面
    handleEdit(index, row) {
      this.defaultId = row.id
      this.dialogStatus = 'update'
      this.dialogFormVisible = true

      this.editForm = {
        name: row.name,
        user_name: row.user_name,
        status: row.status,
        password: '',
        re_password: '',
        user_roles: JSON.parse(row.roles).map(Number)
      }
    },
    // 显示新增界面
    handleAdd() {
      this.defaultId = 0
      this.dialogStatus = 'create'
      this.dialogFormVisibleAdd = true
      this.addForm = {
        name: '',
        user_name: '',
        password: '',
        re_password: '',
        user_roles: []
      }
    },
    // 编辑
    updateData() {
      if (this.addForm.password !== '' && this.addForm.password !== this.addForm.re_password) {
        this.$message.error('俩次密码不一致')
        return false
      }
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {})
            .then(() => {
              const para = Object.assign({}, this.editForm)
              para.id = this.defaultId

              editUser(para).then(res => {
                this.$message({
                  message: '提交成功',
                  type: 'success'
                })
                this.$refs['editForm'].resetFields()
                this.dialogFormVisible = false
                this.getUsers()
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
      if (this.addForm.password !== this.addForm.re_password) {
        this.$message.error('俩次密码不一致')
        return false
      }
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {})
            .then(() => {
              this.addForm.id = (parseInt(Math.random() * 100)).toString() // mock a id
              const para = Object.assign({}, this.addForm)
              addUser(para).then(res => {
                this.$message({
                  message: '提交成功',
                  type: 'success'
                })
                this.$refs['addForm'].resetFields()
                this.dialogFormVisibleAdd = false
                this.getUsers()
              })
            })
            .catch(e => {
              // 打印一下错误
              this.dialogFormVisibleAdd = false
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
          batchRemoveUser(para).then(res => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getUsers()
          })
        })
        .catch(() => {})
    },
    getRoles() {
      getRoleTotal().then(res => {
        this.total_roles = res.roles
      })
    }
  },
  mounted() {
    this.getUsers()
    this.getRoles()
  }
}
</script>

<style scoped>
.el-form-permisson-item{
  max-height: 300px;
  overflow-y: scroll;
}
</style>