<template>
  <div class="bs-sample-count">
    <el-card>
      <div slot="header" class="clearfix">
        <span>按标本类型统计样本数量</span>
      </div>
      <el-table :data="sampleCountData" style="width: 100%">
        <el-table-column label="标本类型" prop="sampleType"></el-table-column>
        <el-table-column label="样本数量" prop="sampleCount"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getBsSampleCount } from '@/api/sample/sampleManage'; // 导入API请求函数

export default {
  data() {
    return {
      sampleCountData: [] // 存储统计结果的数据
    };
  },
  created() {
    this.fetchSampleCount(); // 页面加载时获取统计数据
  },
  methods: {
    // 获取按标本类型统计的样本数量
    fetchSampleCount() {
      getBsSampleCount()
          .then(response => {
            this.sampleCountData = response.data; // 将数据赋值给表格
          })
          .catch(error => {
            this.$message.error('获取统计数据失败！');
          });
    }
  }
};
</script>

<style scoped>
.bs-sample-count {
  padding: 20px;
}
</style>
