import request from '@/utils/request'

export function login(user_name, password) {
  return request({
    url: '/system/user/login',
    method: 'post',
    data: {
      user_name,
      password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/system/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/system/user/logout',
    method: 'post'
  })
}
