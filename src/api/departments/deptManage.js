import request from '@/utils/request'

// 查询区域信息列表
export function listDeptManage(query) {
  return request({
    url: '/departments/deptManage/list',
    method: 'get',
    params: query
  })
}

// 查询区域信息详细
export function getDeptManage(deptId) {
  return request({
    url: '/departments/deptManage/' + deptId,
    method: 'get'
  })
}

// 新增区域信息
export function addDeptManage(data) {
  return request({
    url: '/departments/deptManage',
    method: 'post',
    data: data
  })
}

// 修改区域信息
export function updateDeptManage(data) {
  return request({
    url: '/departments/deptManage',
    method: 'put',
    data: data
  })
}

// 删除区域信息
export function delDeptManage(deptId) {
  return request({
    url: '/departments/deptManage/' + deptId,
    method: 'delete'
  })
}
