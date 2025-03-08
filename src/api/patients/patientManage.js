import request from '@/utils/request'

// 查询患者信息列表
export function listPatientManage(query) {
  return request({
    url: '/patients/patientManage/list',
    method: 'get',
    params: query
  })
}

// 查询患者信息详细
export function getPatientManage(patientId) {
  return request({
    url: '/patients/patientManage/' + patientId,
    method: 'get'
  })
}

// 新增患者信息
export function addPatientManage(data) {
  return request({
    url: '/patients/patientManage',
    method: 'post',
    data: data
  })
}

// 修改患者信息
export function updatePatientManage(data) {
  return request({
    url: '/patients/patientManage',
    method: 'put',
    data: data
  })
}

// 删除患者信息
export function delPatientManage(patientId) {
  return request({
    url: '/patients/patientManage/' + patientId,
    method: 'delete'
  })
}
