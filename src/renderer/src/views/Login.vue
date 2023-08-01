<script setup lang="ts">
import { Login } from '@renderer/api/index';
import router from '@renderer/router';
import { setSessionStorage } from '@renderer/util/storage';
import { ElLoading, ElMessage } from 'element-plus';
import { reactive, ref } from 'vue';

const loginInfo = reactive({
  userName: '',
  passWord: ''
});
function login() {
  formRef.value
    .validate()
    .then(() => {
      const loading = ElLoading.service({
        fullscreen: true,
        text: '登陆中'
      });
      Login(loginInfo)
        .then((res) => {
          if (res.code == 1) {
            setSessionStorage('user', (res.data as { id: number; userName: string }[])[0]);
            router.push('/');
          } else {
            ElMessage.error(res.message);
          }
        })
        .finally(() => {
          loading.close();
        });
    })
    .catch(() => {});
}
const formRef = ref();
const rules = {
  userName: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  passWord: [{ required: true, message: '请输入密码', trigger: 'blur' }]
};
function exit() {
  window.electron.ipcRenderer.send('exit');
}
</script>
<template>
  <div class="dv-login">
    <el-form ref="formRef" :model="loginInfo" :rules="rules">
      <el-form-item label="账号:" prop="userName">
        <el-input v-model="loginInfo.userName"></el-input>
      </el-form-item>
      <el-form-item label="密码:" prop="passWord">
        <el-input v-model="loginInfo.passWord" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">登陆</el-button>
        <el-button @click="exit">退出</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<style scoped lang="scss">
.dv-login {
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
