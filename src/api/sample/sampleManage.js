import request from '@/utils/request'

// 查询标本信息，用来存储标本信息的列表
export function listSampleManage(query) {
  return request({
    url: '/sample/sampleManage/list',
    method: 'get',
    params: query
  })
}

// 查询标本信息，用来存储标本信息的详细
export function getSampleManage(sampleId) {
  return request({
    url: '/sample/sampleManage/' + sampleId,
    method: 'get'
  })
}

// 新增标本信息，用来存储标本信息的
export function addSampleManage(data) {
  return request({
    url: '/sample/sampleManage',
    method: 'post',
    data: data
  })
}

// 修改标本信息，用来存储标本信息的
export function updateSampleManage(data) {
  return request({
    url: '/sample/sampleManage',
    method: 'put',
    data: data
  })
}

// 删除标本信息，用来存储标本信息的
export function delSampleManage(sampleId) {
  return request({
    url: '/sample/sampleManage/' + sampleId,
    method: 'delete'
  })
}

//  按标本类型统计的样本数量
export function getBsSampleCount() {
  return request({
    url: '/sample/sampleManage/countByType', // 后端接口
    method: 'get'
  });
}

