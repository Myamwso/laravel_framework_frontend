import Vue from 'vue'
import Router from 'vue-router'

// const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/Layout/Layout'
/* LayoutDevDev */
import LayoutDev from '../views/dev-tools/LayoutDev'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  {
    path: '/',
    redirect: '/welcome/welcome'
  },
  {
    path: '/welcome',
    component: Layout,
    name: '首页',
    meta: { title: '首页', icon: 'dashboard' },
    children: [
      {
        path: 'welcome',
        name: 'welcome',
        component: () => import('@/views/common/welcome'),
        meta: { title: '首页', icon: 'dashboard' }
      }
    ]
  },
  { path: '/login', component: () => import('@/views/login'), name: '登录NxAdmin', hidden: true },
  // 锁屏
  {
    path: '/lock',
    hidden: true,
    name: '锁屏页',
    component: () => import('@/views/common/lock')
  },
  { path: '/401', component: () => import('@/views/error-page/401'), name: 'page401', hidden: true, meta: { title: 'page401', noCache: true }},
  { path: '/404', component: () => import('@/views/error-page/404'), name: 'page404', hidden: true, meta: { title: 'page404', noCache: true }}
]

export default new Router({
  mode: 'history', // 后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
export const asyncRouterMap = [
  {
    path: '/system',
    component: Layout,
    redirect: 'noredirect',
    name: '系统管理',
    key: 'system', // 权限判断使用
    meta: {
      title: '系统管理',
      icon: 'tree'
    },
    children: [{
      path: 'permission',
      component: () => import('@/views/system/permission'),
      name: '权限列表',
      key: 'system_permission',
      meta: {
        title: '权限列表',
        icon: 'lock'
      }
    }, {
      path: 'role',
      component: () => import('@/views/system/role'),
      name: '角色列表',
      key: 'system_role',
      meta: {
        title: '角色列表',
        icon: 'table'
      },
      children: [{
        path: 'listpage',
        hidden: true,
        name: '查看列表',
        key: 'system_role_listpage',
        children: [{
          path: 'total',
          hidden: true,
          name: '全部角色',
          key: 'system_role_total'
        }]
      }, {
        path: 'add',
        hidden: true,
        name: '添加',
        key: 'system_role_add'
      }, {
        path: 'edit',
        hidden: true,
        name: '编辑',
        key: 'system_role_edit'
      }, {
        path: 'remove',
        hidden: true,
        name: '删除',
        key: 'system_role_remove'
      }, {
        path: 'batchRemove',
        hidden: true,
        name: '批量删除',
        key: 'system_role_batchRemove'
      }]
    }, {
      path: 'user',
      component: () => import('@/views/system/user'),
      name: '用户列表',
      key: 'system_user',
      meta: {
        title: '用户列表',
        icon: 'peoples'
      },
      children: [{
        path: 'listpage',
        hidden: true,
        name: '查看列表',
        key: 'system_user_listpage'
      }, {
        path: 'add',
        hidden: true,
        name: '添加',
        key: 'system_user_add'
      }, {
        path: 'edit',
        hidden: true,
        name: '编辑',
        key: 'system_user_edit'
      }, {
        path: 'remove',
        hidden: true,
        name: '删除',
        key: 'system_user_remove'
      }, {
        path: 'batchRemove',
        hidden: true,
        name: '批量删除',
        key: 'system_user_batchRemove'
      }]
    }, {
      path: 'log',
      component: () => import('@/views/system/log'),
      name: '操作日志',
      key: 'system_log',
      meta: {
        title: '操作日志',
        icon: 'form'
      }
    }]
  },
  // 开发者参考页面
  {
    path: '/dev-tools',
    component: Layout,
    redirect: 'noredirect',
    name: '开发组件',
    key: 'dev-tools',
    meta: {
      title: '开发组件',
      icon: ''
    },
    children: [
      {
        path: '/dev-tools/dashboard', // 三级目录时，二级目录需要补充根路径
        component: LayoutDev,
        redirect: 'noredirect',
        name: '报表概况',
        key: 'dev-tools_dashboard',
        is_show_children: true,
        meta: {
          title: '报表概况',
          icon: 'dashboard'
        },
        children: [
          {
            path: 'dashboard',
            name: '报表',
            key: 'dev-tools_dashboard_index',
            component: () => import('@/views/dev-tools/dashboard/dashboard')
          }
        ]
      },
      {
        path: '/dev-tools/error', // 三级目录时，二级目录需要补充根路径
        component: LayoutDev,
        redirect: 'noredirect',
        name: '错误页面',
        key: 'dev-tools_error',
        is_show_children: true,
        meta: {
          title: '错误页面',
          icon: '404'
        },
        children: [
          { path: '401', component: () => import('@/views/dev-tools/error-page/401'), name: '401页面', key: 'dev-tools_error_page401' },
          { path: '404', component: () => import('@/views/dev-tools/error-page/404'), name: '404页面', key: 'dev-tools_error_page404' }
        ]
      },
      // 图表
      {
        path: '/dev-tools/charts',
        component: LayoutDev,
        redirect: 'noredirect',
        is_show_children: true,
        name: '图表',
        key: 'dev-tools_charts',
        meta: { title: '图表', icon: 'chart' },
        children: [
          {
            path: 'DiscountFigure',
            name: '折线图',
            key: 'dev-tools_charts_DiscountFigure',
            component: () => import('@/views/dev-tools/charts/DiscountFigure')
          },
          {
            path: 'columnar',
            name: '柱状图',
            key: 'dev-tools_charts_columnar',
            component: () => import('@/views/dev-tools/charts/columnar')
          },
          {
            path: 'barGraph',
            name: '条形图',
            key: 'dev-tools_charts_barGraph',
            component: () => import('@/views/dev-tools/charts/barGraph')
          },
          {
            path: 'pieChart',
            name: '饼图',
            key: 'dev-tools_charts_pieChart',
            component: () => import('@/views/dev-tools/charts/pieChart')
          },
          {
            path: 'ringChart',
            name: '环图',
            key: 'dev-tools_charts_ringChart',
            component: () => import('@/views/dev-tools/charts/ringChart')
          },
          {
            path: 'waterfallCharts',
            name: '瀑布图',
            key: 'dev-tools_charts_waterfallCharts',
            component: () => import('@/views/dev-tools/charts/waterfallCharts')
          },
          {
            path: 'funnelCharts',
            name: '漏斗图',
            key: 'dev-tools_charts_funnelCharts',
            component: () => import('@/views/dev-tools/charts/funnelCharts')
          },
          {
            path: 'radarCharts',
            name: '雷达图',
            key: 'dev-tools_charts_radarCharts',
            component: () => import('@/views/dev-tools/charts/radarCharts')
          },
          {
            path: 'sankeyChart',
            name: '桑基图',
            key: 'dev-tools_charts_sankeyChart',
            component: () => import('@/views/dev-tools/charts/sankeyChart')
          },
          {
            path: 'heatmapChart',
            name: '热力图',
            key: 'dev-tools_charts_heatmapChart',
            component: () => import('@/views/dev-tools/charts/heatmapChart')
          },
          {
            path: 'scatterChart',
            name: '散力图',
            key: 'dev-tools_charts_scatterChart',
            component: () => import('@/views/dev-tools/charts/scatterChart')
          },
          {
            path: 'candleChart',
            name: 'K线图',
            key: 'dev-tools_charts_candleChart',
            component: () => import('@/views/dev-tools/charts/candleChart')
          },
          {
            path: 'gaugeChart',
            name: '仪表图',
            key: 'dev-tools_charts_gaugeChart',
            component: () => import('@/views/dev-tools/charts/gaugeChart')
          },
          {
            path: 'treeChart',
            name: '树图',
            key: 'dev-tools_charts_treeChart',
            component: () => import('@/views/dev-tools/charts/treeChart')
          }
        ]
      },
      // pdf说明
      {
        path: '/pdf-test',
        component: LayoutDev,
        redirect: 'noredirect',
        is_show_children: true,
        name: 'pdf插件',
        key: 'dev-tools_pdf',
        meta: { title: 'pdf插件', icon: 'pdf' },
        children: [{
          path: 'pdf',
          name: 'pdf',
          key: 'dev-tools_pdf_index',
          component: () => import('@/views/dev-tools/pdf-test/index')
        }]
      },
      // 地图
      {
        path: '/dev-tools/map',
        component: LayoutDev,
        redirect: 'noredirect',
        is_show_children: true,
        name: '百度地图',
        key: 'dev-tools_baidumap',
        meta: { title: '百度地图', icon: 'pointMap' },
        children: [
          {
            path: 'pointMap',
            name: '点聚合地图',
            key: 'dev-tools_baidumap_pointMap',
            component: () => import('@/views/dev-tools/map/pointMap')
          },
          {
            path: 'cityLlistMap',
            name: '城市列表地图',
            key: 'dev-tools_baidumap_cityLlistMap',
            component: () => import('@/views/dev-tools/map/cityLlistMap')
          },
          {
            path: 'roadBookMap',
            name: '路书地图',
            key: 'dev-tools_baidumap_roadBookMap',
            component: () => import('@/views/dev-tools/map/roadBookMap')
          },
          {
            path: 'gpsMap',
            name: 'gps定位',
            key: 'dev-tools_baidumap_gpsMap',
            component: () => import('@/views/dev-tools/map/gpsMap')
          }
        ]
      },
      // 第三方官网
      {
        path: '/dev-tools/myiframe',
        component: LayoutDev,
        redirect: 'noredirect',
        is_show_children: true,
        name: 'iframe加载页面',
        key: 'dev-tools_myiframe',
        meta: { title: 'iframe', icon: 'people' },
        children: [
          {
            path: ':routerPath',
            name: 'iframe',
            key: 'dev-tools_myiframe_index',
            component: () => import('@/components/nx-iframe')
          }
        ]
      },
      {
        path: '/dev-tools/wel',
        component: LayoutDev,
        redirect: 'noredirect',
        is_show_children: true,
        name: '动态文字',
        key: 'dev-tools_wel',
        meta: { title: 'wel', icon: 'wel' },
        children: [
          {
            path: 'wel',
            name: 'wel',
            key: 'dev-tools_wel_index',
            component: () => import('@/views/dev-tools/page/wel')
          }
        ]
      },
      // 表情包
      {
        path: '/dev-tools/emoji',
        component: LayoutDev,
        redirect: 'noredirect',
        is_show_children: true,
        name: 'emoji表情包',
        key: 'dev-tools_emoji',
        meta: { title: 'emoji', icon: 'emoji' },
        children: [
          {
            path: 'emoji',
            name: 'emoji',
            key: 'dev-tools_emoji_index',
            component: () => import('@/views/dev-tools/githubemoji')
          }
        ]
      },
      // 树形组件
      {
        path: '/dev-tools/treeMen',
        component: LayoutDev,
        redirect: 'noredirect',
        is_show_children: true,
        name: 'treeMen',
        key: 'dev-tools_treeMen',
        meta: {
          title: '树形菜单',
          icon: 'TreeMean'
        },
        children: [
          {
            path: 'treeMen',
            name: 'treeMen-demo',
            key: 'dev-tools_treeMen_index',
            component: () => import('@/views/dev-tools/tree/treeMen')
          }
        ]
      },
      // 图标组件
      {
        path: '/dev-tools/icons',
        component: LayoutDev,
        redirect: 'noredirect',
        is_show_children: true,
        name: '图标组件',
        key: 'dev-tools_icons',
        meta: {
          title: '图标组件',
          icon: 'icon'
        },
        children: [
          {
            path: 'iconIndex',
            name: 'svg图标',
            key: 'dev-tools_icons_index',
            component: () => import('@/views/dev-tools/icons/svg-icons/iconIndex')
          },
          {
            path: 'font-awesome',
            name: '字体图标',
            key: 'dev-tools_icons_font-awesome',
            component: () => import('@/views/dev-tools/icons/font-awesome/')
          },
          {
            path: 'AliIcons',
            name: '阿里图标',
            key: 'dev-tools_icons_aliIcons',
            component: () => import('@/views/dev-tools/icons/AliIcons/')
          }
        ]
      },
      // 实战
      {
        path: '/dev-tools/vue-actual',
        component: LayoutDev,
        redirect: 'noredirect',
        is_show_children: true,
        name: 'vue实战',
        key: 'dev-tools_vue',
        meta: {
          title: 'vue实战',
          icon: 'shizhan'
        },
        children: [
          {
            path: 'Pos',
            name: 'Pos',
            key: 'dev-tools_vue_pos',
            component: () => import('@/views/dev-tools/vue-actual/Pos')
          }
        ]
      },
      // 组件
      {
        path: '/dev-tools/components',
        component: LayoutDev,
        redirect: 'noredirect',
        is_show_children: true,
        name: '组件',
        key: 'dev-tools_components',
        meta: {
          title: '组件',
          icon: 'component'
        },
        children: [
          {
            path: 'dragKanban',
            name: '可拖拽看板',
            key: 'dev-tools_components_dragKanban',
            component: () => import('@/views/dev-tools/components/dragKanban')
          },
          {
            path: 'markdown',
            name: 'markdown',
            key: 'dev-tools_components_markdown',
            component: () => import('@/views/dev-tools/components/markdown')
          },
          {
            path: 'backToTop',
            name: '返回顶部',
            key: 'dev-tools_components_backToTop',
            component: () => import('@/views/dev-tools/components/backToTop')
          },
          {
            path: 'clipboard',
            name: '复制',
            key: 'dev-tools_components_clipboard',
            component: () => import('@/views/dev-tools/clipboard/index')
          },
          {
            path: 'mixin',
            name: 'componentMixin',
            key: 'dev-tools_components_componentMixin',
            component: () => import('@/views/dev-tools/components-demo/mixin')
          },
          {
            path: 'index',
            name: 'HightLight',
            key: 'dev-tools_components_HightLight',
            component: () => import('@/views/dev-tools/components/index')
          },
          {
            path: 'countup',
            name: 'countup',
            key: 'dev-tools_components_countup',
            component: () => import('@/views/dev-tools/components/countup/')
          }
        ]
      },
      // 表格
      {
        path: '/dev-tools/Tabs',
        component: LayoutDev,
        redirect: 'noredirect',
        is_show_children: true,
        name: '选项卡',
        key: 'dev-tools_tabs',
        meta: { title: 'Tabs', icon: 'tab' },
        children: [
          {
            path: 'Tabs',
            name: 'table选项卡',
            key: 'dev-tools_tabs_index',
            component: () => import('@/views/dev-tools/table/Tabs')
          }
        ]
      },
      // 滚动定位
      {
        path: '/dev-tools/better-scroll',
        component: LayoutDev,
        redirect: 'noredirect',
        is_show_children: true,
        name: '滚动',
        key: 'dev-tools_to',
        meta: { title: 'better-scroll', icon: 'better-scroll' },
        children: [
          {
            path: 'to',
            name: '滚动定位',
            key: 'dev-tools_to_index',
            component: () => import('@/views/dev-tools/better-scroll/to')
          }
        ]
      },
      // 表单
      {
        path: '/dev-tools/form',
        component: LayoutDev,
        redirect: 'noredirect',
        is_show_children: true,
        name: '表单',
        key: 'dev-tools_form',
        meta: {
          title: '表单',
          icon: 'form'
        },
        children: [
          {
            path: 'BaseForm',
            name: 'from表单',
            key: 'dev-tools_form_BaseForm',
            component: () => import('@/views/dev-tools/form/BaseForm')
          },
          {
            path: 'VueEditor',
            name: '文本编辑',
            key: 'dev-tools_form_VueEditor',
            component: () => import('@/views/dev-tools/form/VueEditor')
          },
          {
            path: 'Upload',
            name: '文件上传',
            key: 'dev-tools_form_Upload',
            component: () => import('@/views/dev-tools/form/Upload')
          }
        ]
      },
      // 右菜单
      {
        path: '/dev-tools/contextmenu',
        component: LayoutDev,
        redirect: 'noredirect',
        is_show_children: true,
        name: '右键菜单',
        key: 'dev-tools_contextmenu',
        meta: {
          title: '右键菜单',
          icon: 'right-mean'
        },
        children: [
          {
            path: 'simple',
            name: '基础',
            key: 'dev-tools_contextmenu_simple',
            component: () => import('@/views/dev-tools/contextmenu/simple')
          },
          {
            path: 'divier',
            name: '分割线',
            key: 'dev-tools_contextmenu_divier',
            component: () => import('@/views/dev-tools/contextmenu/divier')
          },
          {
            path: 'group',
            name: '按钮组',
            key: 'dev-tools_contextmenu_group',
            component: () => import('@/views/dev-tools/contextmenu/group')
          },
          {
            path: 'submenu',
            name: '子菜单',
            key: 'dev-tools_contextmenu_submenu',
            component: () => import('@/views/dev-tools/contextmenu/submenu')
          },
          {
            path: 'disabled',
            name: '禁用',
            key: 'dev-tools_contextmenu_disabled',
            component: () => import('@/views/dev-tools/contextmenu/disabled')
          },
          {
            path: 'custom-trigger',
            name: '自定义事件',
            key: 'dev-tools_contextmenu_customtrigger',
            component: () => import('@/views/dev-tools/contextmenu/custom-trigger')
          }
        ]
      },
      // 表格
      {
        path: '/dev-tools/table',
        component: LayoutDev,
        redirect: 'noredirect',
        is_show_children: true,
        name: '表格',
        key: 'dev-tools_table',
        meta: {
          title: '表格',
          icon: 'table'
        },
        children: [
          {
            path: 'complex-table',
            name: '综合Table',
            key: 'dev-tools_table_complexTable',
            component: () => import('@/views/dev-tools/table/complex-table')
          },
          {
            path: 'TreeTable',
            name: '树形表格',
            key: 'dev-tools_table_treeTable',
            component: () => import('@/views/dev-tools/table/tree-table/index')
          }
        ]
      },
      //
      {
        path: '/dev-tools/excel',
        component: LayoutDev,
        redirect: 'noredirect',
        is_show_children: true,
        name: 'excel',
        key: 'dev-tools_excel',
        meta: {
          title: 'excel',
          icon: 'excel'
        },
        children: [
          {
            path: 'exportExcel',
            name: '导出',
            key: 'dev-tools_excel_exportExcel',
            component: () => import('@/views/dev-tools/excel/exportExcel')
          },
          {
            path: 'selectExcel',
            name: '查看',
            key: 'dev-tools_excel_selectExcel',
            component: () => import('@/views/dev-tools/excel/selectExcel')
          },
          {
            path: 'uploadExcel',
            name: '导入',
            key: 'dev-tools_excel_uploadExcel',
            component: () => import('@/views/dev-tools/excel/uploadExcel')
          }
        ]
      },
      {
        path: '/dev-tools/zip',
        component: LayoutDev,
        redirect: 'noredirect',
        is_show_children: true,
        name: 'zip压缩解压',
        key: 'dev-tools_zip',
        meta: {
          title: 'zip压缩解压',
          icon: 'zip'
        },
        children: [
          {
            path: 'index',
            name: 'zip',
            key: 'dev-tools_zip_index',
            component: () => import('@/views/dev-tools/zip/index')
          }
        ]
      },
      {
        path: '/dev-tools/i18n-demo',
        component: LayoutDev,
        redirect: 'noredirect',
        is_show_children: true,
        name: '语音包插件',
        key: 'dev-tools_indexLang',
        meta: {
          title: '语音包插件'
        },
        children: [
          {
            path: 'indexLang',
            name: 'indexLang',
            key: 'dev-tools_indexLang_index',
            component: () => import('@/views/dev-tools/i18n-demo/indexLang')
          }
        ]
      }]
  }
]
