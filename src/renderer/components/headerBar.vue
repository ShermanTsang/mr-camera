<style scoped lang="scss">
    header {
        overflow: hidden;

        .header-container {
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            justify-content: space-between;
            position: fixed;
            width: 100%;
            top: 0;
            height: 40px;
            z-index: 10000;
            margin-bottom: 10px;
            box-shadow: 0 4px 8px rgba(177, 177, 177, 0.2);
            border-bottom: 2px solid #eee;
            -webkit-app-region: drag;
            background: #ffffff;

            .header-band {
                letter-spacing: 1px;
                font-size: 1rem;
                color: #666;
            }

            .header-action-item {
                -webkit-app-region: no-drag !important;
                display: inline;
                height: 100%;
                padding: 10px;
                font-size: 1.2rem;
                transition: all 200ms ease-in;
                color: #999999;

                &:hover {
                    box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.4);
                }
            }
        }
    }

    .setting-container {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;

        .setting-item {
            cursor: pointer;
            display: flex;
            flex-flow: column nowrap;
            justify-content: center;
            align-items: center;
            padding: 20px;
            border-radius: 4px;

            &-icon {
                font-size: 2.5rem;
            }

            &-name {
                letter-spacing: 1px;
                font-size: .95rem;
                color: #666;
            }

            &:hover {
                background-color: rgba(177, 177, 177, .1);
            }
        }
    }
</style>

<template>
    <header>
        <Menu mode="horizontal" theme="dark" active-name="1" class="header-container">
            <div class="header-band">
                <div class="header-action-item" @click="status.setting = true">
                    <Icon type="md-menu"/>
                </div>
                相机先生
            </div>
            <div class="header-action">
                <div class="header-action-item" @click="windowsAction('min')">
                    <Icon type="md-remove"/>
                </div>
                <div class="header-action-item" @click="windowsAction('max')">
                    <Icon type="md-browsers"/>
                </div>
                <div class="header-action-item" @click="windowsAction('close')">
                    <Icon type="md-close"/>
                </div>
            </div>
        </Menu>
        <Modal v-model="status.setting" width="80%" title="控制面板" footer-hide>
            <div class="setting-container">
                <div class="setting-item" @click="$router.push({name: 'index'})">
                    <div class="setting-item-icon">
                        <Icon type="ios-home-outline"/>
                    </div>
                    <div class="setting-item-name">回欢迎页</div>
                </div>
                <div class="setting-item"
                     @click="$electron.ipcRenderer.send('createWebWindow', 'https://share-man.com','相机先生讨论区')">
                    <div class="setting-item-icon">
                        <Icon type="ios-chatboxes-outline"/>
                    </div>
                    <div class="setting-item-name">社区讨论</div>
                </div>
                <div class="setting-item">
                    <div class="setting-item-icon">
                        <Icon type="ios-heart-outline"/>
                    </div>
                    <div class="setting-item-name">赞助支持</div>
                </div>
                <div class="setting-item">
                    <div class="setting-item-icon">
                        <Icon type="ios-cloud-upload-outline"/>
                    </div>
                    <div class="setting-item-name">升级检测</div>
                </div>
                <div class="setting-item">
                    <div class="setting-item-icon">
                        <Icon type="ios-trash-outline"/>
                    </div>
                    <div class="setting-item-name">清空数据</div>
                </div>
            </div>
        </Modal>
    </header>
</template>

<script>
export default {
  name: 'header-bar',
  data() {
    return {
      status: {
        setting: false
      }
    };
  },
  methods: {
    windowsAction(type) {
      if (type === 'close') {
        this.$Modal.confirm({
          title: '确认退出相机先生？',
          content: 'R U confirm to exit Mr.Camera?',
          onOk: () => {
            this.$electron.ipcRenderer.send('close');
          },
          onCancel: () => {
            this.$Message.info('已取消退出');
          }
        });
        return false;
      }
      if (type === 'back') {
        this.$router.back(-1);
        return false;
      }
      this.$electron.ipcRenderer.send(type);
    }
  },
  mounted() {
  }
};
</script>
