<template>
  <div class="app-container">

    <nx-tree-table :data="data" :columns="columns" border></nx-tree-table>

  </div>
</template>

<script>
import { asyncRouterMap } from '@/router/index.js'
import nxTreeTable from '@/components/nx-tree-table'

export default {
  name: 'treeTableDemo',
  components: { nxTreeTable },
  data() {
    return {
      columns: [
        {
          text: '权限名称',
          value: 'name',
          width: 200
        },
        {
          text: 'path',
          value: 'path'
        },
        {
          text: 'key',
          value: 'key'
        },
        {
          text: 'redirect',
          value: 'redirect'
        }
      ],
      data: [
      ]
    }
  },
  mounted: function() {
    console.log(asyncRouterMap)
    this.data = asyncRouterMap
  }
}
</script>
