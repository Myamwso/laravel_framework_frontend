import request from '@/utils/request'

export function getLogListPage(params) {
  return request({
    url: '/system/log',
    method: 'get',
    params: params
  })
}
