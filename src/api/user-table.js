import request from '@/utils/request'

export function getUserListPage(params) {
  return request({
    url: '/system/user/listpage',
    method: 'get',
    params: params
  })
}
export function removeUser(params) {
  return request({
    url: '/system/user/remove',
    method: 'get',
    params: params
  })
}
export function batchRemoveUser(params) {
  return request({
    url: '/system/user/batchRemove',
    method: 'get',
    params: params
  })
}
export function editUser(params) {
  return request({
    url: '/system/user/edit',
    method: 'post',
    params: params
  })
}
export function addUser(params) {
  return request({
    url: '/system/user/add',
    method: 'post',
    params: params
  })
}
