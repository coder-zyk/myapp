<script setup lang="ts">
import { User, ChatDotRound, Reading, Setting } from '@element-plus/icons-vue';
import router from '@renderer/router';
import { DefineComponent, reactive, ref } from 'vue';
import { UpdatePassWord } from '@renderer/api/index';
import { getLocalStorage } from '@renderer/util/storage';
import { ElMessage } from 'element-plus';
const userInfo = getLocalStorage('userInfo');
/**当前活跃的菜单索引 */
const activeIndex = ref(1);
type Menu = {
  id: number;
  title: string;
  icon: DefineComponent;
  path: string;
};
const menus: Menu[] = [
  {
    id: 1,
    title: '用户',
    icon: User,
    path: '/'
  },
  {
    id: 2,
    title: '学习',
    icon: Reading,
    path: '/subject/math'
  },
  {
    id: 3,
    title: '聊天',
    icon: ChatDotRound,
    path: '/chat'
  }
];
function clickHandle(item: Menu) {
  activeIndex.value = item.id;
  router.push(item.path);
}
const showSetting = ref<boolean>(false);
function checkUpdate() {
  showSetting.value = false;
  window.electron.ipcRenderer.send('check-update');
}
const showPassWord = ref<boolean>(false);
const passWordRef = ref();
const passWordModel = reactive({
  oldPassWord: '',
  newPassWord: '',
  confirmPassWord: ''
});
function changePassWord() {
  Object.assign(passWordModel, {
    oldPassWord: '',
    newPassWord: '',
    confirmPassWord: ''
  });
  showPassWord.value = true;
}
function updatePassWord() {
  passWordRef.value
    .validate()
    .then(() => {
      UpdatePassWord({
        userName: userInfo.userName,
        oldPassWord: passWordModel.oldPassWord,
        newPassWord: passWordModel.newPassWord
      }).then((res) => {
        ElMessage.success(res.message);
      });
    })
    .catch(() => {});
}
const validatePass = (_rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入密码'));
  } else if (value === passWordModel.oldPassWord) {
    callback(new Error('新密码不能与旧密码相同'));
  } else {
    callback();
  }
};
const validateConFirm = (_rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'));
  } else if (value !== passWordModel.newPassWord) {
    callback(new Error('两次输入密码不同\uff0c请重新输入'));
  } else {
    callback();
  }
};
const rules = {
  oldPassWord: [{ required: true, trigger: 'blur', message: '请输入密码' }],
  newPassWord: [{ validator: validatePass, trigger: 'blur' }],
  confirmPassWord: [{ validator: validateConFirm, trigger: 'blur' }]
};
</script>
<template>
  <div class="dv-navbar">
    <div class="top">
      <div
        v-for="item in menus"
        :key="item.id"
        :class="`dv-navbar-item ${activeIndex == item.id ? 'active' : ''}`"
        @click="clickHandle(item)"
      >
        <el-icon :size="26"><component :is="item.icon" /></el-icon>
      </div>
    </div>
    <div class="bottom">
      <div class="setting">
        <el-popover
          v-model:visible="showSetting"
          :teleported="false"
          popper-style="padding:10px;min-width:100px"
          placement="top-start"
          :width="100"
          trigger="click"
        >
          <template #reference>
            <el-icon :size="26"><component :is="Setting" /></el-icon>
          </template>
          <div class="content">
            <div class="content-item" @click="changePassWord">修改密码</div>
            <div class="content-item" @click="checkUpdate">检查更新</div>
          </div>
        </el-popover>
        <el-dialog v-model="showPassWord" title="修改密码" width="300px">
          <el-form
            ref="passWordRef"
            :model="passWordModel"
            status-icon
            :rules="rules"
            label-width="90px"
          >
            <el-form-item label="旧密码" prop="oldPassWord">
              <el-input v-model="passWordModel.oldPassWord" type="password" autocomplete="off" />
            </el-form-item>
            <el-form-item label="新密码" prop="newPassWord">
              <el-input v-model="passWordModel.newPassWord" type="password" autocomplete="off" />
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassWord">
              <el-input
                v-model="passWordModel.confirmPassWord"
                type="password"
                autocomplete="off"
              />
            </el-form-item>
          </el-form>
          <template #footer>
            <el-button @click="showPassWord = false">取消</el-button>
            <el-button type="primary" @click="updatePassWord"> 确定 </el-button>
          </template>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.dv-navbar {
  width: 100%;
  background-color: #f2f2f2;
  display: grid;
  align-content: space-between;
  .top {
    .dv-navbar-item {
      padding: 7px 7px;
      height: 26px;
      cursor: pointer;
      border-radius: 5px;
      & + .dv-navbar-item {
        margin-top: 10px;
      }
      &:hover {
        background-color: #e3e3e3;
      }
      &.active {
        background-color: #e3e3e3;
      }
    }
  }
  .bottom {
    .setting {
      text-align: center;
      &:hover {
        cursor: pointer;
        color: #529bd9;
      }
      .content {
        font-size: 16px;
        .content-item {
          cursor: pointer;
          &:hover {
            background-color: #e3e3e3;
          }
          & + .content-item {
            margin-top: 5px;
          }
        }
      }
    }
  }
}
</style>
