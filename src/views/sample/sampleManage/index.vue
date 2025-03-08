<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="160px">
  <el-row :gutter="20">
    <!-- 左侧列 -->
    <el-col :span="12">
      <el-form-item label="通用唯一识别码" prop="sampleUuid">
        <el-input
          v-model="queryParams.sampleUuid"
          placeholder="请输入通用唯一识别码"
          clearable
          @keyup.enter="handleQuery"
          style="width: 80%;"
        />
      </el-form-item>
      <el-form-item label="样本编号，外显" prop="sampleMrid">
        <el-input
          v-model="queryParams.sampleMrid"
          placeholder="请输入样本编号，外显"
          clearable
          @keyup.enter="handleQuery"
          style="width: 80%;"
        />
      </el-form-item>
      <el-form-item label="患者身份证号" prop="patientIdCard">
        <el-input
          v-model="queryParams.patientIdCard"
          placeholder="请输入患者身份证号"
          clearable
          @keyup.enter="handleQuery"
          style="width: 80%;"
        />
      </el-form-item>
      <el-form-item label="送检机构id" prop="deptId">
        <el-select
          v-model="queryParams.deptId"
          placeholder="请选择送检机构id"
          clearable
          @keyup.enter="handleQuery"
          style="width: 80%;">
          <el-option v-for="item in department" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="标本的采样时间" prop="sampleSampleDate">
        <el-date-picker
          v-model="queryParams.sampleSampleDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择标本的采样时间"
          style="width: 80%;"
        />
      </el-form-item>
      <el-form-item label="上传者id" prop="uploadId">
        <el-input
          v-model="queryParams.uploadId"
          placeholder="请输入上传者id"
          clearable
          @keyup.enter="handleQuery"
          style="width: 80%;"
        />
      </el-form-item>
      <el-form-item label="诊断结果, 0-阴, 1-阳" prop="wsiClassificationRecommend">
        
        <el-select
          v-model="queryParams.wsiClassificationRecommend"
          placeholder="请选择AI推荐诊断结果"
          clearable
          @keyup.enter="handleQuery"
          style="width: 80%;">
          <el-option v-for="item in diagnostic_results" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
    </el-col>

    <!-- 右侧列 -->
    <el-col :span="12">
      <el-form-item label="标本的送检时间" prop="sampleSendDate">
        <el-date-picker
          v-model="queryParams.sampleSendDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择标本的送检时间"
          style="width: 80%;"
        />
      </el-form-item>
      <el-form-item label="诊断者id" prop="diagnoseId">
        <el-input
          v-model="queryParams.diagnoseId"
          placeholder="请输入诊断者id"
          clearable
          @keyup.enter="handleQuery"
          style="width: 80%;"
        />
      </el-form-item>
      <el-form-item label="复核者id" prop="reviewId">
        <el-input
          v-model="queryParams.reviewId"
          placeholder="请输入复核者id"
          clearable
          @keyup.enter="handleQuery"
          style="width: 80%;"
        />
      </el-form-item>
      <el-form-item label="样本图像的路径" prop="sampleImgPath">
        <el-input
          v-model="queryParams.sampleImgPath"
          placeholder="请输入样本图像的路径"
          clearable
          @keyup.enter="handleQuery"
          style="width: 80%;"
        />
      </el-form-item>
      <el-form-item label="AI推荐诊断结果路径" prop="wsiClassificationPath">
        <el-input
          v-model="queryParams.wsiClassificationPath"
          placeholder="请输入AI推荐诊断结果路径"
          clearable
          @keyup.enter="handleQuery"
          style="width: 80%;"
        />
      </el-form-item>
      <el-form-item label="医生诊断结果路径" prop="diagnosePath">
        <el-input
          v-model="queryParams.diagnosePath"
          placeholder="请输入医生诊断结果路径"
          clearable
          @keyup.enter="handleQuery"
          style="width: 80%;"
        />
      </el-form-item>
      <el-form-item label="报告路径" prop="reportPath">
        <el-input
          v-model="queryParams.reportPath"
          placeholder="请输入报告路径"
          clearable
          @keyup.enter="handleQuery"
          style="width: 80%;"
        />
      </el-form-item>
    </el-col>
  </el-row>

  <!-- 操作按钮 -->
  <el-row type="flex" justify="end" style="margin-top: 10px;">
    <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
    <el-button icon="Refresh" @click="resetQuery">重置</el-button>
  </el-row>
</el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['sample:sampleManage:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['sample:sampleManage:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['sample:sampleManage:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['sample:sampleManage:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="sampleManageList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="样本的自增主键" align="center" prop="sampleId" />
      <el-table-column label="通用唯一识别码" align="center" prop="sampleUuid" />
      <el-table-column label="样本编号，外显" align="center" prop="sampleMrid" />
      <el-table-column label="样本检测类型" align="center" prop="sampleType" />
      <el-table-column label="扫描设备类型" align="center" prop="scanDeviceType" />
      <el-table-column label="患者身份证号" align="center" prop="patientIdCard" />
      <el-table-column label="送检机构id" align="center" prop="deptId" />
      <el-table-column label="标本的采样时间" align="center" prop="sampleSampleDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.sampleSampleDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标本的送检时间" align="center" prop="sampleSendDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.sampleSendDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="样本组织类型" align="center" prop="samplePathologyType" />
      <el-table-column label="标本将要出具的报告类型，如tct报告" align="center" prop="reportType" />
      <el-table-column label="样本状态标志位" align="center" prop="sampleStatus" />
      <el-table-column label="上传者id" align="center" prop="uploadId" />
      <el-table-column label="诊断者id" align="center" prop="diagnoseId" />
      <el-table-column label="复核者id" align="center" prop="reviewId" />
      <el-table-column label="样本图像的路径" align="center" prop="sampleImgPath" />
      <el-table-column label="AI推荐诊断结果, 0-阴性, 1-阳性" align="center" prop="wsiClassificationRecommend" />
      <el-table-column label="AI推荐诊断结果路径" align="center" prop="wsiClassificationPath" />
      <el-table-column label="医生诊断结果路径" align="center" prop="diagnosePath" />
      <el-table-column label="报告路径" align="center" prop="reportPath" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['sample:sampleManage:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['sample:sampleManage:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

  <!-- 添加或修改标本信息，用来存储标本信息的对话框 -->
  <el-dialog :title="title" v-model="open" width="800px" append-to-body>
    <el-form ref="sampleManageRef" :model="form" :rules="rules" label-width="160px">
      <!-- 使用栅格系统 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="通用唯一识别码" prop="sampleUuid">
            <el-input v-model="form.sampleUuid" placeholder="请输入通用唯一识别码" style="width: 100%;" />
          </el-form-item>
          <el-form-item label="样本编号，外显" prop="sampleMrid">
            <el-input v-model="form.sampleMrid" placeholder="请输入样本编号，外显" style="width: 100%;" />
          </el-form-item>
          <el-form-item label="患者身份证号" prop="patientIdCard">
            <el-input v-model="form.patientIdCard" placeholder="请输入患者身份证号" style="width: 100%;" />
          </el-form-item>
          <el-form-item label="送检机构id" prop="deptId">
            <!--<el-input v-model="form.deptId" placeholder="请输入送检机构id" style="width: 100%;" />-->
            <el-select v-model="form.deptId" placeholder="请选择送检机构id" style="width: 100%;">
              <el-option v-for="item in department" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="标本的采样时间" prop="sampleSampleDate">
            <el-date-picker clearable
              v-model="form.sampleSampleDate"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="请选择标本的采样时间"
              style="width: 100%;">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="上传者id" prop="uploadId">
            <el-input v-model="form.uploadId" placeholder="请输入上传者id" style="width: 100%;" />
          </el-form-item>
          <el-form-item label="诊断结果, 0-阴, 1-阳" prop="wsiClassificationRecommend">
            
            <el-select v-model="form.wsiClassificationRecommend" placeholder="请选择AI推荐诊断结果" style="width: 100%;">
              <el-option v-for="item in diagnostic_results" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="AI推荐诊断结果路径" prop="wsiClassificationPath">
            <el-input v-model="form.wsiClassificationPath" placeholder="请输入AI推荐诊断结果路径" style="width: 100%;" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="标本的送检时间" prop="sampleSendDate">
            <el-date-picker clearable
              v-model="form.sampleSendDate"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="请选择标本的送检时间"
              style="width: 100%;">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="诊断者id" prop="diagnoseId">
            <el-input v-model="form.diagnoseId" placeholder="请输入诊断者id" style="width: 100%;" />
          </el-form-item>
          <el-form-item label="复核者id" prop="reviewId">
            <el-input v-model="form.reviewId" placeholder="请输入复核者id" style="width: 100%;" />
          </el-form-item>
          <el-form-item label="样本图像的路径" prop="sampleImgPath">
            <el-input v-model="form.sampleImgPath" placeholder="请输入样本图像的路径" style="width: 100%;" />
          </el-form-item>
          <el-form-item label="医生诊断结果路径" prop="diagnosePath">
            <el-input v-model="form.diagnosePath" placeholder="请输入医生诊断结果路径" style="width: 100%;" />
          </el-form-item>
          <el-form-item label="报告路径" prop="reportPath">
            <el-input v-model="form.reportPath" placeholder="请输入报告路径" style="width: 100%;" />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" placeholder="请输入备注" style="width: 100%;" />
          </el-form-item>
          <el-form-item label="删除标志" prop="delFlag">
            <el-input v-model="form.delFlag" placeholder="请输入删除标志" style="width: 100%;" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer" style="text-align: center;">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </template>
  </el-dialog>
  </div>
</template>

<script setup name="SampleManage">
import { listSampleManage, getSampleManage, delSampleManage, addSampleManage, updateSampleManage } from "@/api/sample/sampleManage";
import useUserStore from '@/store/modules/user';

const { proxy } = getCurrentInstance();

const { sample_detection, sample_tissue, sample_report, scan_device, patient_gecder, department, diagnostic_results}
  = proxy.useDict('sample_detection', 'sample_tissue', 'sample_report', 'scan_device', 'patient_gecder', 'department', 'diagnostic_results');

const sampleManageList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    sampleUuid: null,
    sampleMrid: null,
    sampleType: null,
    scanDeviceType: null,
    patientIdCard: null,
    deptId: null,
    sampleSampleDate: null,
    sampleSendDate: null,
    samplePathologyType: null,
    reportType: null,
    sampleStatus: null,
    uploadId: null,
    diagnoseId: null,
    reviewId: null,
    sampleImgPath: null,
    wsiClassificationRecommend: null,
    wsiClassificationPath: null,
    diagnosePath: null,
    reportPath: null,
  },
  rules: {
    sampleUuid: [
      { required: true, message: "通用唯一识别码不能为空", trigger: "blur" }
    ],
    sampleMrid: [
      { required: true, message: "样本编号，外显不能为空", trigger: "blur" }
    ],
    sampleType: [
      { required: true, message: "样本检测类型不能为空", trigger: "change" }
    ],
    scanDeviceType: [
      { required: true, message: "扫描设备类型不能为空", trigger: "change" }
    ],
    patientIdCard: [
      { required: true, message: "患者身份证号不能为空", trigger: "blur" }
    ],
    deptId: [
      { required: true, message: "送检机构id不能为空", trigger: "blur" }
    ],
    samplePathologyType: [
      { required: true, message: "样本组织类型不能为空", trigger: "change" }
    ],
    reportType: [
      { required: true, message: "标本将要出具的报告类型，如tct报告不能为空", trigger: "change" }
    ],
    sampleStatus: [
      { required: true, message: "样本状态标志位不能为空", trigger: "change" }
    ],
    uploadId: [
      { required: true, message: "上传者id不能为空", trigger: "blur" }
    ],
    createBy: [
      { required: true, message: "创建者账号不能为空", trigger: "blur" }
    ],
    createTime: [
      { required: true, message: "创建本条记录的时间不能为空", trigger: "blur" }
    ],
    delFlag: [
      { required: true, message: "删除标志不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询标本信息，用来存储标本信息的列表 */
function getList() {
  loading.value = true;
  listSampleManage(queryParams.value).then(response => {
    sampleManageList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

//获取当前登录用户id
const userStore = useUserStore();
//form.value.uploadId = userStore.id;
//console.log('Current User ID:', userStore.id);

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    sampleId: null,
    sampleUuid: null,
    sampleMrid: null,
    sampleType: null,
    scanDeviceType: null,
    patientIdCard: null,
    deptId: null,
    sampleSampleDate: null,
    sampleSendDate: null,
    samplePathologyType: null,
    reportType: null,
    sampleStatus: null,
    uploadId: userStore.id,
    diagnoseId: null,
    reviewId: null,
    sampleImgPath: null,
    wsiClassificationRecommend: null,
    wsiClassificationPath: null,
    diagnosePath: null,
    reportPath: null,
    remark: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    delFlag: null
  };
  proxy.resetForm("sampleManageRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.sampleId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加标本信息，用来存储标本信息的";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _sampleId = row.sampleId || ids.value
  getSampleManage(_sampleId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改标本信息，用来存储标本信息的";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["sampleManageRef"].validate(valid => {
    if (valid) {
      if (form.value.sampleId != null) {
        updateSampleManage(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addSampleManage(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _sampleIds = row.sampleId || ids.value;
  proxy.$modal.confirm('是否确认删除标本信息，用来存储标本信息的编号为"' + _sampleIds + '"的数据项？').then(function() {
    return delSampleManage(_sampleIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('sample/sampleManage/export', {
    ...queryParams.value
  }, `sampleManage_${new Date().getTime()}.xlsx`)
}

getList();
</script>

<style scoped>
.app-container {
  padding: 20px;
}

.el-form {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
}

.el-form-item {
  margin-bottom: 10px !important;
  margin-right: 0 !important;
  min-width: 300px;
}

.mb8 {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 10px;
}

.el-col {
  margin-bottom: 10px;
}

.dialog-footer {
  padding-top: 20px;
  text-align: right;
}

.el-table {
  margin-top: 15px;
}

.pagination-container {
  margin-top: 20px;
}
</style>