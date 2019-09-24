import request from '@/utils/request'

export function getRoleTotal() {
  return request({
    url: '/system/role/total',
    method: 'get'
  })
}
export function getRoleListPage(params) {
  return request({
    url: '/system/role/listpage',
    method: 'get',
    params: params
  })
}
export function removeRole(params) {
  return request({
    url: '/system/role/remove',
    method: 'get',
    params: params
  })
}
export function batchRemoveRole(params) {
  return request({
    url: '/system/role/batchRemove',
    method: 'get',
    params: params
  })
}
export function editRole(params) {
  return request({
    url: '/system/role/edit',
    method: 'post',
    params: params
  })
}
export function addRole(params) {
  return request({
    url: '/system/role/add',
    method: 'post',
    params: params
  })
}
