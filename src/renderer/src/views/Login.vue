<script setup lang="ts">
import { Login } from '@renderer/api/index';
import { setLocalStorage } from '@renderer/util/storage';
import { ElLoading, ElMessage } from 'element-plus';
import { computed, reactive } from 'vue';
const loginInfo = reactive({
  userName: '',
  passWord: ''
});
const disabledLogin = computed(() => {
  if (loginInfo.passWord && loginInfo.userName) return false;
  else return true;
});
function login() {
  const loading = ElLoading.service({
    fullscreen: true,
    text: '登陆中'
  });
  Login(loginInfo)
    .then((res) => {
      if (res.code == 1) {
        setLocalStorage('userInfo', (res.data as { id: number; userName: string }[])[0]);
        window.electron.ipcRenderer.send('login');
      } else {
        ElMessage.error(res.message);
      }
    })
    .finally(() => {
      loading.close();
    });
}
function exit() {
  window.electron.ipcRenderer.send('exit');
}
</script>
<template>
  <div class="dv-login">
    <div class="logininfo">
      <el-input
        v-model="loginInfo.userName"
        clearable
        placeholder="请输入账号"
        maxlength="16"
        size="large"
        class="username"
      ></el-input>
      <el-input
        v-model="loginInfo.passWord"
        type="password"
        placeholder="请输入密码"
        maxlength="16"
        clearable
        size="large"
        class="password"
        unselectable="on"
      ></el-input>
      <div class="button">
        <el-button type="primary" :disabled="disabledLogin" class="button-item" @click="login"
          >登陆</el-button
        >
        <el-button class="button-item" type="danger" @click="exit">退出</el-button>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.dv-login {
  -webkit-app-region: drag;
  height: 100vh;
  padding: 0px 35px;
  align-items: center;
  justify-content: center;
  background: linear-gradient(#407aaa, #fff, #407aaa);
  font-size: 16px;
  display: grid;
  .logininfo {
    -webkit-app-region: no-drag;
    font-size: 16px;
    font-weight: 700;
    .username {
      width: 250px;
      margin-bottom: 20px;
    }
    .password {
      width: 250px;
      margin-bottom: 20px;
    }
    :deep(.el-input__wrapper) {
      position: relative;
      padding: 1px 40px;
      .el-input__suffix {
        position: absolute;
        right: 15px;
      }
      input {
        width: calc(100% - 40px);
        text-align: center;
        font-size: 18px;
        font-weight: 700;
      }
    }
    .button {
      text-align: center;
      .button-item {
        width: 119px;
      }
    }
  }
}
</style>
