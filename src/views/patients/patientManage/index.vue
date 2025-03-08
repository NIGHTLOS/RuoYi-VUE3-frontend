<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" v-show="showSearch" label-width="90px">
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="唯一标识码" prop="patientUuid">
            <el-input v-model="queryParams.patientUuid" placeholder="请输入通用唯一标识码" clearable @keyup.enter="handleQuery"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="病理号" prop="patientMrid">
            <el-input v-model="queryParams.patientMrid" placeholder="请输入患者病理号" clearable @keyup.enter="handleQuery"/>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="患者姓名" prop="patientName">
            <el-input v-model="queryParams.patientName" placeholder="请输入患者姓名" clearable @keyup.enter="handleQuery"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="手机号" prop="phonenumber">
            <el-input v-model="queryParams.phonenumber" placeholder="请输入患者手机号" clearable @keyup.enter="handleQuery"/>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="年龄" prop="age">
            <el-input v-model="queryParams.age" placeholder="请输入患者年龄" clearable @keyup.enter="handleQuery"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="出生日期" prop="birthday">
            <el-date-picker v-model="queryParams.birthday" type="date" value-format="YYYY-MM-DD" placeholder="请选择出生日期" clearable/>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="性别" prop="patientGender">
            <el-input v-model="queryParams.patientGender" placeholder="请输入患者性别" clearable @keyup.enter="handleQuery"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="身份证号" prop="patientIdCard">
            <el-input v-model="queryParams.patientIdCard" placeholder="请输入身份证号" clearable @keyup.enter="handleQuery"/>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="机构ID" prop="belongDept">
            <el-input v-model="queryParams.belongDept" placeholder="请输入所属机构ID" clearable @keyup.enter="handleQuery"/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['patients:patientManage:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['patients:patientManage:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['patients:patientManage:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['patients:patientManage:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="patientManageList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="患者自增标号" align="center" prop="patientId" />
      <el-table-column label="通用唯一标识码" align="center" prop="patientUuid" />
      <el-table-column label="患者病理号" align="center" prop="patientMrid" />
      <el-table-column label="患者姓名" align="center" prop="patientName" />
      <el-table-column label="患者手机号" align="center" prop="phonenumber" />
      <el-table-column label="患者年龄" align="center" prop="age" />
      <el-table-column label="患者出生日期" align="center" prop="birthday" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.birthday, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="患者性别" align="center" prop="patientGender" />
      <el-table-column label="患者身份证号" align="center" prop="patientIdCard" />
      <el-table-column label="患者历史病历" align="center" prop="patientMedicalRecords" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="所属机构ID" align="center" prop="belongDept" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['patients:patientManage:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['patients:patientManage:remove']">删除</el-button>
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

    <!-- 添加或修改患者信息对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="patientManageRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="通用唯一标识码" prop="patientUuid">
          <el-input v-model="form.patientUuid" placeholder="请输入通用唯一标识码" />
        </el-form-item>
        <el-form-item label="患者病理号" prop="patientMrid">
          <el-input v-model="form.patientMrid" placeholder="请输入患者病理号" />
        </el-form-item>
        <el-form-item label="患者姓名" prop="patientName">
          <el-input v-model="form.patientName" placeholder="请输入患者姓名" />
        </el-form-item>
        <el-form-item label="患者手机号" prop="phonenumber">
          <el-input v-model="form.phonenumber" placeholder="请输入患者手机号" />
        </el-form-item>
        <el-form-item label="患者年龄" prop="age">
          <el-input v-model="form.age" placeholder="请输入患者年龄" />
        </el-form-item>
        <el-form-item label="患者出生日期" prop="birthday">
          <el-date-picker clearable
            v-model="form.birthday"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择患者出生日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="患者性别" prop="patientGender">
          <el-input v-model="form.patientGender" placeholder="请输入患者性别" />
        </el-form-item>
        <el-form-item label="患者身份证号" prop="patientIdCard">
          <el-input v-model="form.patientIdCard" placeholder="请输入患者身份证号" />
        </el-form-item>
        <el-form-item label="患者历史病历" prop="patientMedicalRecords">
          <el-input v-model="form.patientMedicalRecords" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="删除标志" prop="delFlag">
          <el-input v-model="form.delFlag" placeholder="请输入删除标志" />
        </el-form-item>
        <el-form-item label="所属机构ID" prop="belongDept">
          <el-input v-model="form.belongDept" placeholder="请输入所属机构ID" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="PatientManage">
import { listPatientManage, getPatientManage, delPatientManage, addPatientManage, updatePatientManage } from "@/api/patients/patientManage";

const { proxy } = getCurrentInstance();

const patientManageList = ref([]);
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
    patientUuid: null,
    patientMrid: null,
    patientName: null,
    phonenumber: null,
    age: null,
    birthday: null,
    patientGender: null,
    patientIdCard: null,
    patientMedicalRecords: null,
    belongDept: null,
  },
  rules: {
    patientUuid: [
      { required: true, message: "通用唯一标识码不能为空", trigger: "blur" }
    ],
    patientName: [
      { required: true, message: "患者姓名不能为空", trigger: "blur" }
    ],
    patientIdCard: [
      { required: true, message: "患者身份证号不能为空", trigger: "blur" }
    ],
    delFlag: [
      { required: true, message: "删除标志不能为空", trigger: "blur" }
    ],
    createBy: [
      { required: true, message: "创建者账号不能为空", trigger: "blur" }
    ],
    createTime: [
      { required: true, message: "创建时间不能为空", trigger: "blur" }
    ],
    belongDept: [
      { required: true, message: "所属机构ID不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询患者信息列表 */
function getList() {
  loading.value = true;
  listPatientManage(queryParams.value).then(response => {
    patientManageList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    patientId: null,
    patientUuid: null,
    patientMrid: null,
    patientName: null,
    phonenumber: null,
    age: null,
    birthday: null,
    patientGender: null,
    patientIdCard: null,
    patientMedicalRecords: null,
    remark: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    belongDept: null,
    updateBy: null,
    updateTime: null
  };
  proxy.resetForm("patientManageRef");
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
  ids.value = selection.map(item => item.patientId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加患者信息";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _patientId = row.patientId || ids.value
  getPatientManage(_patientId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改患者信息";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["patientManageRef"].validate(valid => {
    if (valid) {
      if (form.value.patientId != null) {
        updatePatientManage(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addPatientManage(form.value).then(response => {
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
  const _patientIds = row.patientId || ids.value;
  proxy.$modal.confirm('是否确认删除患者信息编号为"' + _patientIds + '"的数据项？').then(function() {
    return delPatientManage(_patientIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('patients/patientManage/export', {
    ...queryParams.value
  }, `patientManage_${new Date().getTime()}.xlsx`)
}

getList();
</script>
