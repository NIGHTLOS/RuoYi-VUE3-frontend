<template>
  <div>
    <h2>全省样品检测统计</h2>

    <!-- 图表容器 -->
    <div style="display: flex; justify-content: space-between; gap: 20px;">
      <!-- 全省总体情况饼状图（原右下角饼状图） -->
      <div ref="provincePieChart" style="width: 48%; height: 400px;"></div>

      <!-- 柱状图 -->
      <div ref="barChart" style="width: 48%; height: 400px;"></div>
    </div>

    <!-- 城市选择框和日期选择器 -->
    <div style="display: flex; justify-content: space-between; margin-top: 20px;">
      <div style="display: flex; gap: 10px;">
        <!-- 城市选择框 -->
        <el-select v-model="selectedCity" placeholder="请选择城市" style="width: 150px;" @change="updateCityChart">
          <el-option
              v-for="city in cities"
              :key="city"
              :label="city"
              :value="city"
          ></el-option>
        </el-select>

        <!-- 日期选择器 -->
        <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 250px;"
            @change="handleDateChange"
        >
        </el-date-picker>
        <el-button type="primary" @click="fetchSampleDataWithDate">查询</el-button>
      </div>
    </div>

    <!-- 城市诊断比例和全省总体情况 -->
    <div style="display: flex; justify-content: space-between; gap: 20px; margin-top: 20px;">
      <!-- 城市诊断比例饼状图 -->
      <div ref="cityPieChart" style="width: 48%; height: 400px;"></div>

      <!-- 不同城市样本比例饼状图（原左上角饼状图） -->
      <div ref="pieChart" style="width: 48%; height: 400px;"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import { getBsSampleCount } from "@/api/sample/sampleManage"; // 引入获取统计数据的函数

export default {
  name: "Index",
  data() {
    return {
      sampleData: [],  // 存储后端返回的统计数据
      selectedCity: '', // 当前选中的城市
      dateRange: '', // 日期范围选择
      cities: [
        '南昌市',
        '九江市',
        '上饶市',
        '抚州市',
        '宜春市',
        '吉安市',
        '赣州市',
        '景德镇市'
      ],
      cityDiagnosisData: {},
      provinceDiagnosisData: {
        diagnosed: 0,
        undiagnosed: 0,
        unuploaded: 0
      },
      citySampleTotals: {}, // 初始化为空对象
      citySampleIndex: {}
    };
  },

  mounted() {
    this.fetchSampleData();
    this.selectedCity = this.cities[0]; // 默认选择第一个城市

    // 每 10 秒刷新一次数据
    this.refreshInterval = setInterval(() => {
      this.fetchSampleData();
    }, 10000);
  },
  beforeDestroy() {
    // 组件销毁时清除--------------------------------------定时器，避免内存泄漏
    clearInterval(this.refreshInterval);
  },

  methods: {
    // 获取后端数据
    async fetchSampleData() {
      try {
        const response = await getBsSampleCount();  // 调用获取数据的 API
        console.log("后端返回的数据:", response.data);  // 打印返回的数据，检查其结构

        if (Array.isArray(response.data)) {
          // 筛选出省总数据以外的城市数据
          this.sampleData = response.data.filter(item => item.dept_name !== "江西省");

          // 处理数据
          this.cityDiagnosisData = {};
          this.citySampleTotals = {};

          this.sampleData.forEach(item => {
            const totalDetected = item.sample_count_50 + item.sample_count_not_50;
            this.cityDiagnosisData[item.dept_name] = {
              diagnosed: item.sample_count_50,
              undiagnosed: item.sample_count_not_50,
              unuploaded: Math.max(0, totalDetected - totalDetected) // 初始设置为0，后续更新
            };
            this.citySampleTotals[item.dept_name] = totalDetected;
          });

          // 更新未上传样本数量
          this.sampleData.forEach(item => {
            const totalDetected = item.sample_count_50 + item.sample_count_not_50;
            this.cityDiagnosisData[item.dept_name].unuploaded = Math.max(0, this.citySampleTotals[item.dept_name] - totalDetected);
          });

          console.log("处理后的 cityDiagnosisData:", this.cityDiagnosisData); // 添加调试信息
          console.log("处理后的 citySampleTotals:", this.citySampleTotals); // 添加调试信息

          this.calculateProvinceData(); // 计算全省总体数据
          this.updateCityChart();
          this.initProvinceChart();
          this.initCharts(); // 数据获取成功后初始化图表
        } else {
          console.error("返回数据不是预期的格式");
          this.sampleData = [];  // 若格式不正确，则设置为空数组
        }
      } catch (error) {
        console.error("获取数据失败:", error);
      }
    },

    // 根据日期范围获取后端数据
    async fetchSampleDataWithDate() {
      if (!this.dateRange || !this.dateRange.length) {
        alert('请选择日期范围');
        return;
      }

      try {
        const startDate = this.dateRange[0].toISOString().split('T')[0];
        const endDate = this.dateRange[1].toISOString().split('T')[0];
        const response = await getBsSampleCount(startDate, endDate);  // 调用获取数据的 API 并传递日期范围
        console.log("后端返回的数据:", response.data);  // 打印返回的数据，检查其结构

        if (Array.isArray(response.data)) {
          // 筛选出省总数据以外的城市数据
          this.sampleData = response.data.filter(item => item.dept_name !== "江西省");

          // 处理数据
          this.cityDiagnosisData = {};
          this.citySampleTotals = {};

          this.sampleData.forEach(item => {
            const totalDetected = item.sample_count_50 + item.sample_count_not_50;
            this.cityDiagnosisData[item.dept_name] = {
              diagnosed: item.sample_count_50,
              undiagnosed: item.sample_count_not_50,
              unuploaded: Math.max(0, totalDetected - totalDetected) // 初始设置为0，后续更新
            };
            this.citySampleTotals[item.dept_name] = totalDetected;
          });

          // 更新未上传样本数量
          this.sampleData.forEach(item => {
            const totalDetected = item.sample_count_50 + item.sample_count_not_50;
            this.cityDiagnosisData[item.dept_name].unuploaded = Math.max(0, this.citySampleTotals[item.dept_name] - totalDetected);
          });

          this.calculateProvinceData(); // 计算全省总体数据
          this.updateCityChart();
          this.initProvinceChart();
          this.initCharts(); // 数据获取成功后初始化图表
        } else {
          console.error("返回数据不是预期的格式");
          this.sampleData = [];  // 若格式不正确，则设置为空数组
        }
      } catch (error) {
        console.error("获取数据失败:", error);
      }
    },

    // 初始化图表
    initCharts() {
      if (!this.sampleData.length) return;

      // 处理数据
      const labels = this.cities; // 使用固定的城市顺序
      const values = this.cities.map(city => {
        const total = this.cityDiagnosisData[city]?.diagnosed + this.cityDiagnosisData[city]?.undiagnosed + this.cityDiagnosisData[city]?.unuploaded ?? 0;
        const diagnosed = this.cityDiagnosisData[city]?.diagnosed ?? 0;
        const completionRate = (diagnosed / total) * 100;
        return Math.min(completionRate, 100).toFixed(2); // 确保完成率不超过 100%
      });

      const pieData = this.cities.map(city => ({
        name: city,
        value: this.cityDiagnosisData[city]?.diagnosed + this.cityDiagnosisData[city]?.undiagnosed + this.cityDiagnosisData[city]?.unuploaded ?? 0
      }));

      // 饼状图（原左上角饼状图，现在放在右下角）
      const pieChart = echarts.init(this.$refs.pieChart);
      pieChart.setOption({
        title: { text: "不同城市样本比例", left: "center" },
        tooltip: { trigger: "item" },
        legend: {
          orient: "vertical",
          left: "left",
          formatter: (name) => {
            const total = pieData.reduce((sum, item) => sum + item.value, 0);
            const percentage = ((pieData.find(item => item.name === name)?.value / total) * 100).toFixed(2);
            return `${name}: ${percentage}%`;
          }
        },
        series: [{
          name: "样本数量",
          type: "pie",
          radius: "50%",
          data: pieData  // 使用 pieData 来填充饼状图
        }]
      });

      // 柱状图
      const barChart = echarts.init(this.$refs.barChart);
      barChart.setOption({
        title: { text: "不同城市样本诊断完成率", left: "center" },
        tooltip: {
          trigger: "axis",
          formatter: (params) => {
            const city = params[0].name;
            const diagnosed = this.cityDiagnosisData[city]?.diagnosed ?? 0;
            const total = this.cityDiagnosisData[city]?.diagnosed + this.cityDiagnosisData[city]?.undiagnosed + this.cityDiagnosisData[city]?.unuploaded ?? 0;
            return `${city}<br/>完成率: ${params[0].value}%<br/>已诊断: ${diagnosed}<br/>总数: ${total}`;
          }
        },
        xAxis: { type: "category", data: labels },  // X轴为城市名称
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: '{value}%' // Y轴显示百分比
          },
          max: 100 // Y轴最大值为 100%
        },
        series: [{
          name: "完成率",
          type: "bar",
          data: values,  // 使用完成率百分比填充柱状图
          label: {
            show: true,
            position: 'top', // 显示在柱子上方
            formatter: (params) => {
              return `${params.value}%`; // 显示完成率百分比
            }
          }
        }]
      });
    },

    // 计算全省总体数据
    calculateProvinceData() {
      this.provinceDiagnosisData = this.cities.reduce((acc, city) => {
        acc.diagnosed += this.cityDiagnosisData[city]?.diagnosed ?? 0;
        acc.undiagnosed += this.cityDiagnosisData[city]?.undiagnosed ?? 0;
        acc.unuploaded += this.cityDiagnosisData[city]?.unuploaded ?? 0;
        return acc;
      }, { diagnosed: 0, undiagnosed: 0, unuploaded: 0 });

      console.log("计算得到的全省总体数据:", this.provinceDiagnosisData); // 添加调试信息
    },

    // 更新城市诊断比例饼状图
    updateCityChart() {
      const cityData = this.cityDiagnosisData[this.selectedCity];
      const cityTotal = (cityData?.diagnosed ?? 0) + (cityData?.undiagnosed ?? 0) + (cityData?.unuploaded ?? 0);
      const cityPieChart = echarts.init(this.$refs.cityPieChart);
      cityPieChart.setOption({
        title: { text: `${this.selectedCity}诊断比例`, left: "center" },
        tooltip: { trigger: "item" },
        legend: {
          orient: "vertical",
          left: "left",
          formatter: (name) => {
            const chineseToEnglishMap = {
              '已诊断': 'diagnosed',
              '未诊断': 'undiagnosed',
              '未上传': 'unuploaded'
            };
            const englishKey = chineseToEnglishMap[name] || name;
            const value = cityData?.[englishKey] ?? 0;
            const percentage = ((value / cityTotal) * 100).toFixed(2);
            return `${name}: ${percentage}%`;
          }
        },
        series: [{
          name: "诊断数量",
          type: "pie",
          radius: "50%",
          data: [
            { name: '已诊断', value: cityData?.diagnosed ?? 0 },
            { name: '未诊断', value: cityData?.undiagnosed ?? 0 },
            { name: '未上传', value: cityData?.unuploaded ?? 0 }
          ]
        }]
      });

      console.log("更新城市诊断比例饼状图的数据:", cityData); // 添加调试信息
    },

    // 初始化全省总体情况饼状图（原右下角饼状图，现在放在左上角）
    initProvinceChart() {
      const provinceTotal = (this.provinceDiagnosisData?.diagnosed ?? 0) + (this.provinceDiagnosisData?.undiagnosed ?? 0) + (this.provinceDiagnosisData?.unuploaded ?? 0);
      const provincePieChart = echarts.init(this.$refs.provincePieChart);
      provincePieChart.setOption({
        title: { text: '江西省总体诊断比例', left: "center" },
        tooltip: { trigger: "item" },
        legend: {
          orient: "vertical",
          left: "left",
          formatter: (name) => {
            const chineseToEnglishMap = {
              '已诊断': 'diagnosed',
              '未诊断': 'undiagnosed',
              '未上传': 'unuploaded'
            };
            const englishKey = chineseToEnglishMap[name] || name;
            const value = this.provinceDiagnosisData?.[englishKey] ?? 0;
            const percentage = ((value / provinceTotal) * 100).toFixed(2);
            console.log(name, this.provinceDiagnosisData?.["未诊断".toLowerCase()], provinceTotal);
            return `${name}: ${percentage}%`;
          }
        },
        series: [{
          name: "诊断数量",
          type: "pie",
          radius: "50%",
          data: [
            { name: '已诊断', value: this.provinceDiagnosisData?.diagnosed ?? 0 },
            { name: '未诊断', value: this.provinceDiagnosisData?.undiagnosed ?? 0 },
            { name: '未上传', value: this.provinceDiagnosisData?.unuploaded ?? 0 }
          ]
        }]
      });
    },

    // 处理日期变化
    handleDateChange(value) {
      console.log("选择的日期范围:", value);
    }
  }
};
</script>

<style scoped>
h2 {
  text-align: center;
}

/* 确保 el-select 和 el-option 中的文本完整显示 */
.el-select .el-input__inner {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: clip;
}

.el-select-dropdown .el-select-dropdown__item {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: clip;
}
</style>



