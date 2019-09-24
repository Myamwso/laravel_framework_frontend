import axios from 'axios'

const base = ''

export const getUserList = params => { return axios.get(`${base}/system/user/list`, { params: params }) }

export const getUserListPage = params => { return axios.get(`${base}/system/user/listpage`, { params: params }) }

export const removeUser = params => { return axios.get(`${base}/system/user/remove`, { params: params }) }

export const batchRemoveUser = params => { return axios.get(`${base}/system/user/batchremove`, { params: params }) }

export const editUser = params => { return axios.get(`${base}/system/user/edit`, { params: params }) }

export const addUser = params => { return axios.get(`${base}/system/user/add`, { params: params }) }
