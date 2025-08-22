import type { AdminHeader } from '@/types/factory'
import type { MenuItem } from '@/types/components/header'
import { defineAsyncComponent } from 'vue';

//获得资源服务地址
const FileUploadUrl: string = (import.meta.env.VITE_FILE_UPLOAD_URL as string)
  .startsWith("http") ? import.meta.env.VITE_FILE_UPLOAD_URL : window.location.protocol + "//" + window.location.host + "/api" + import.meta.env.VITE_FILE_UPLOAD_URL;

let VITE_APP_LOGO

try {
  VITE_APP_LOGO = defineAsyncComponent(() =>
    import(`@/components/icon/${import.meta.env.VITE_APP_LOGO}.vue`)
  )
} catch {
  VITE_APP_LOGO = null
}

// 主菜单配置（用于Header组件）
export const defaultMenuItems: MenuItem[] = [
  {
    id: "home",
    label: "首页",
    href: "/",
    icon: null,
  },
  {
    id: "detection",
    label: "实时检测",
    href: "/detection",
    icon: null,
  },
  {
    id: "history",
    label: "历史记录",
    href: "/history",
    icon: null,
  },
  {
    id: "statistics",
    label: "统计分析",
    href: "/statistics",
    icon: null,
  },
  {
    id: "admin",
    label: "menu.admin",
    href: "/admin",
    icon: null,
  },
];

// 管理后台菜单配置
export const adminMenuItems: AdminHeader[] = [
  {
    id: '1',
    title: '仪表板',
    icon: 'Odometer',
    path: '/admin/dashboard',
  },
  {
    id: '3',
    title: '用户管理',
    icon: 'User',
    path: '/admin/userManage',
  },
  {
    id: '2',
    title: '警告管理',
    icon: 'Warning',
    path: '/admin/warnings',
  },
  {
    id: '4',
    title: '内容管理',
    icon: 'Document',
    path: '/admin/content',
    hide: true,
    children: [
      { id: '4-1', title: '文章管理', icon: 'EditPen', path: '/admin/content/articles' },
      { id: '4-2', title: '分类管理', icon: 'Collection', path: '/admin/content/categories' }
    ]
  },
  {
    id: '5',
    title: '订单管理',
    icon: 'ShoppingCart',
    path: '/admin/orders',
    hide: true,
    children: [
      { id: '5-1', title: '订单列表', icon: 'List', path: '/admin/orders/list' },
      { id: '5-2', title: '退款管理', icon: 'RefreshLeft', path: '/admin/orders/refunds' }
    ]
  },
  {
    id: '8',
    title: '财务管理',
    icon: 'Money',
    path: '/admin/finance',
    hide: true,
    children: [
      { id: '8-1', title: '收支明细', icon: 'Wallet', path: '/admin/finance/transactions' },
      { id: '8-2', title: '财务报表', icon: 'DataAnalysis', path: '/admin/finance/reports' }
    ]
  },
  {
    id: '9',
    title: '数据导出',
    icon: 'Download',
    path: '/admin/export',
  },
  {
    id: '10',
    title: '系统设置',
    icon: 'Setting',
    path: '/admin/settings',
    hide: true
  },
]

const serverConfig = {
  baseURL: '/api', // 请求基础地址,可根据环境自定义

  useTokenAuthorization: false, // 是否开启 token 认证

  FileUploadUrl,

  VITE_APP_TITLE: import.meta.env.VITE_APP_TITLE,

  VITE_APP_LOGO: VITE_APP_LOGO ? VITE_APP_LOGO : () => null,

  VITE_APP_VERSION: import.meta.env.VITE_APP_VERSION,

  SERVER_PATH: import.meta.env.VITE_SERVER_PATH || '/api',

  WEBSOCKET_PATH: import.meta.env.VITE_WEBSOCKET_PATH || '/api',
}
export default serverConfig
