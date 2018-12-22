<style scoped lang="scss">
    .album {
        display: flex;
        flex-flow: row nowrap;
        height: 100%;

        .album-left {
            height: 100%;
            flex-basis: 400px;
            border-right: 1px solid #eee;
            box-shadow: 5px 0 10px rgba(177, 177, 177, .2);

            .album-create-btn {
                cursor: pointer;
                padding: 5px 10px;
                border-radius: 20px;
                background: #ffffff;
                transition: background .1s ease-in-out;

                &:hover {
                    color: #ffffff;
                    background: #4e8cfe;
                    background: -webkit-gradient(linear, 0 100%, 0 0, from(#4e8cfe), to(#38b9fd));
                    background: -webkit-linear-gradient(90deg, #4e8cfe, #38b9fd);
                    background: linear-gradient(90deg, #4e8cfe, #38b9fd);
                }
            }

            .album-search {
                padding: 10px;
                outline: 0;
                border: none;
                border-top: 1px solid #efefef;
                width: 100%;
                font-size: 1rem;
                letter-spacing: 1px;
                box-shadow: inset 0 0 8px rgba(177, 177, 177, 0.2);

                &:focus {
                    box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.1);
                }
            }

            .album-list {
                height: 80%;
                overflow: auto;

                .album-item {
                    height: 120px;
                    padding: 0 10px;
                    display: flex;
                    flex-flow: column nowrap;
                    align-items: center;
                    justify-content: center;
                    border-bottom: 1px solid #efefef;
                    cursor: default;
                    line-height: 2;

                    &:first-child {
                        border-top: 1px solid #efefef;
                    }

                    &-name {
                        font-size: 1.2rem;
                    }

                    &-info {
                        line-height: 1.5;
                        font-size: .9rem;
                    }

                    &:hover {
                        box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.1);
                    }
                }

                .album-item-active {
                    color: #ffffff;
                    background: #4e8cfe;
                    background: -webkit-gradient(linear, 0 100%, 0 0, from(#4e8cfe), to(#38b9fd));
                    background: -webkit-linear-gradient(90deg, #4e8cfe, #38b9fd);
                    background: linear-gradient(90deg, #4e8cfe, #38b9fd);
                }
            }
        }

        .album-right {
            width: 100%;
            position: relative;
            display: flex;
            flex-flow: column nowrap;

            .album-header {
                width: 100%;
                padding: 10px 20px;
                border-bottom: 1px solid #efefef;
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                align-items: center;

                .album-name {
                    font-size: 1rem;
                }

                .album-action {
                    display: flex;
                    flex-flow: nowrap row;
                    justify-content: space-around;
                    align-items: center;

                    &-item {
                        position: relative;
                        cursor: pointer;
                        font-size: .9rem;
                        letter-spacing: 1px;
                        border-top: 2px solid #efefef;
                        border-bottom: 2px solid #efefef;
                        border-left: 1px solid #efefef;
                        padding: 4px 10px;
                        transition: all .1S ease-in-out;
                        text-align: center;
                        color: #666;

                        &:last-child {
                            border-right: 1px solid #efefef;
                        }

                        &-title {
                            border-top: 1px solid #efefef;
                            margin-top: 10px;
                            padding-top: 10px;
                        }

                        &-count {
                            position: absolute;
                            top: -10px;
                            right: -10px;
                            width: 30px;
                            height: 20px;
                            border-radius: 2px;
                            background-color: red;
                            color: #ffffff;
                            padding: 0 5px;
                            text-align: center;
                            line-height: 20px;
                            overflow: hidden;
                            font-size: .9rem;
                        }

                        &:hover {
                            letter-spacing: 2px;
                            box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1);
                        }
                    }
                }
            }

            .album-footer {
                display: flex;
                flex-flow: row nowrap;
                position: absolute;
                align-items: center;
                justify-content: space-between;
                bottom: 30px;
                width: 100%;
                padding: 10px 20px;
                background-color: rgba(255, 255, 255, .6);
                border-top: 2px solid #efefef;

                div {
                    width: 300px;
                }
            }

            .album-tip {
                height: 80%;
                display: flex;
                flex-flow: column nowrap;
                align-items: center;
                justify-content: center;
                font-size: 1.2rem;
                letter-spacing: 1px;

                input {
                    text-align: center;
                    margin: 10px;
                    border: 2px solid #efefef;
                    padding: 20px;
                    font-size: 1.2rem;
                    letter-spacing: 2px;
                    border-radius: 4px;
                    box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.1);
                }
            }

            .album-main {
                padding: 10px;

                .photo-item {
                    overflow: hidden;
                    position: relative;
                    display: inline-block;
                    margin: 4px;
                    box-shadow: 0 0 8px rgba(177, 177, 177, .5);

                    &-mask {
                        position: absolute;
                        width: 100%;
                        height: 50px;
                        z-index: 98;
                        bottom: 0;
                        background: linear-gradient(to top, rgba(0, 0, 0, 0.5) 0, transparent 100%);
                    }

                    &-image {
                        width: 100%;
                        height: 100%;

                        img {
                            object-fit: cover;
                            width: 100%;
                            height: 100%
                        }
                    }

                    &-info {
                        position: absolute;
                        width: 100%;
                        bottom: 0;
                        color: #ffffff;
                        text-align: center;
                        font-size: .9rem;
                        padding: 5px 10px;
                        height: 30px;
                        transition: all .1s ease-in-out;
                        z-index: 99;
                        letter-spacing: 1px;

                        .photo-item-action {
                            margin-top: 10px;
                            transition: all .2s ease-in-out;
                            transform: translateY(30px);
                            cursor: pointer;
                            display: flex;
                            flex-flow: row nowrap;
                            justify-content: space-around;
                            align-items: center;

                            i {
                                &:hover {
                                    color: #ccc;
                                    transform: scale(1.2);
                                }
                            }
                        }
                    }

                    &:hover {
                        box-shadow: 0 0 10px $theme-color;

                        .photo-item-mask {
                            height: 100%;
                        }

                        .photo-item-info {
                            height: 70px;

                            .photo-item-action {
                                transform: translateY(0);
                            }
                        }
                    }
                }
            }
        }
    }
</style>

<template>
    <div class="album">
        <div class="album-left">
            <title-board>
                相册
                <div slot="right">
                    <div class="album-create-btn" @click="createAlbumItem()">
                        <Icon type="ios-add"/>
                        新建
                    </div>
                </div>
            </title-board>
            <input type="text" class="album-search" placeholder="搜索相册" v-model="params.keyword">
            <div class="album-list scrollable">
                <div v-if="data.projectList.length === 0 && params.keyword === ''" class="album-item album-item-create"
                     @click="createAlbumItem()">
                    <Icon type="md-add" size="24"/>
                    创建第一个相册
                </div>
                <Spin v-if="status.loadingProjectList"></Spin>
                <template v-else>
                    <div class="album-item" :class="{'album-item-active':data.project.id === item.id}"
                         v-for="item in data.projectList" :key="item.id" @click="selectAlbumItem(item)">
                        <div class="album-item-name">
                            <Icon type="ios-lock-outline" v-show="item.password" size="20"/>
                            {{item.name}}
                        </div>
                        <div class="album-item-info">
                            {{item.description.substring(0,10)}}{{item.description.length > 10 ? '...':''}}
                        </div>
                    </div>
                </template>
            </div>
        </div>
        <div class="album-right">
            <template v-if="data.project === {}">
                <div class="album-tip">
                    <Icon type="md-images" size="60"/>
                    <br>
                    从左侧选择相册
                </div>
            </template>
            <template v-else-if="form.checkProjectPassword.password !== data.project.password">
                <div class="album-tip">
                    <Icon type="ios-lock-outline" size="60"/>
                    <br>
                    {{data.project.name}}
                    <br>
                    <input placeholder="请输入相册密码" v-model="form.checkProjectPassword.password" type="password"/>
                </div>
            </template>
            <template v-else>
                <div class="album-header">
                    <div class="album-name">
                        {{data.project.name}}
                    </div>
                    <div class="album-action" v-if="form.checkProjectPassword.password === data.project.password">
                        <div class="album-action-item" @click="redirectPage('workspace')">
                            <div class="action-menu-title">
                                <Icon type="ios-camera-outline" size="28" color="#999"/>
                                开始拍照
                            </div>
                        </div>
                        <div class="album-action-item" @click="editAlbumItem(data.project)">
                            <div class="action-menu-title">
                                <Icon type="ios-build-outline" size="28" color="#999"/>
                                设置
                            </div>
                        </div>
                        <div class="album-action-item" @click="deleteProjectItem(data.project)">
                            <div class="action-menu-title">
                                <Icon type="ios-trash-outline" size="28" color="#999"/>
                                删除
                            </div>
                        </div>
                    </div>
                </div>
                <div class="album-footer">
                    <div class="album-footer-left">123</div>
                    <div class="album-footer-right">
                        <Slider v-model="config.photoItemSep" :tip-format="formatSepText" :step="10" :min="140"
                                :max="280"></Slider>
                    </div>
                </div>
                <div class="album-main">
                    <div v-for="item in data.photoList" :key="item.id" class="photo-item"
                         :style="{width:config.photoItemSep + 'px',height:config.photoItemSep + 'px'}">
                        <div class="photo-item-mask"></div>
                        <div class="photo-item-image">
                            <img :src="item.photo">
                        </div>
                        <div class="photo-item-info">
                            {{item.name || '未命名'}}
                            <div class="photo-item-action">
                                <Icon size="26" type="md-trash" @click="deletePhotoItem(item)"/>
                                <Icon size="26" type="md-star" @click="collectPhotoItem(item)"/>
                                <Icon size="26" type="md-download" @click="downloadPhotoItem(item)"/>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
        <Modal v-model="status.createAlbumItem" width="600" title="新建相册" ok-text="创建"
               @on-ok="submitCreateProjectItem">
            <Form :model="form.createAlbumItem" label-position="top">
                <FormItem label="相册名称" required>
                    <Input v-model="form.createAlbumItem.name"></Input>
                </FormItem>
                <FormItem label="相册描述">
                    <Input v-model="form.createAlbumItem.description"></Input>
                </FormItem>
                <FormItem label="相册密码">
                    <Input v-model="form.createAlbumItem.password"></Input>
                </FormItem>
            </Form>
        </Modal>
        <Modal v-model="status.editAlbumItem" width="600" title="编辑相册" ok-text="保存" @on-ok="submitEditProjectItem">
            <Form :model="form.editAlbumItem" label-position="top">
                <FormItem label="相册名称" required>
                    <Input v-model="form.editAlbumItem.name"></Input>
                </FormItem>
                <FormItem label="相册描述">
                    <Input v-model="form.editAlbumItem.description"></Input>
                </FormItem>
                <FormItem label="相册密码">
                    <Input v-model="form.editAlbumItem.password"></Input>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {
      status: {
        loadingProjectList: false,
        createAlbumItem: false,
        editAlbumItem: false
      },
      config: {
        photoItemSep: 180
      },
      data: {
        project: {},
        projectCount: 0,
        projectList: [],
        photoList: []
      },
      form: {
        checkProjectPassword: {
          password: ''
        },
        createAlbumItem: {
          name: '',
          description: '',
          password: ''
        },
        editAlbumItem: {
          name: '',
          description: '',
          password: ''
        }
      },
      params: {
        keyword: ''
      },
      timer: null
    };
  },
  methods: {
    selectAlbumItem(albumItem) {
      this.data.project = albumItem;
      this.form.checkProjectPassword.password = '';
      this.data.photoList = this.queryPhotoList();
    },
    createAlbumItem() {
      this.status.createAlbumItem = true;
    },
    editAlbumItem(albumItem) {
      this.form.editAlbumItem = albumItem;
      this.status.editAlbumItem = true;
    },
    formatSepText(val) {
      return '图片宽度: ' + val + '像素';
    },
    deletePhotoItem(photoItem) {
      const {id} = photoItem;
      this.$db.remove({scheme: 'photoList', project: this.data.project.id, id}, {}, () => {
        this.data.photoList.splice(this.data.photoList.indexOf(photoItem), 1);
        this.$Message.success(`删除成功！`);
      });
    },
    collectPhotoItem(photoItem) {
      const {id} = photoItem;
      this.$db.update({
        scheme: 'photoList',
        project: this.data.project.id,
        id
      }, {$set: {isCollected: true}}, {}, (error, count) => {
        if (error) {
          console.log(error);
        }
        this.$Message.success(`收藏成功！`);
      });
    },
    downloadPhotoItem(photoItem) {

    },
    submitCreateProjectItem() {
      const {name, description, password} = this.form.createAlbumItem;
      const newProjectItem = {
        scheme: 'projectList',
        id: this.$getId().toString(),
        name,
        description,
        password
      };
      this.$db.insert(newProjectItem, () => {
        this.status.createAlbumItem = false;
        this.$Message.success(`新建相册"${name}"成功`);
        this.queryProjectList();
      });
    },
    submitEditProjectItem() {
      const {id, name, description, password} = this.form.editAlbumItem;
      this.$db.update({scheme: 'projectList', id}, {
        $set: {name, description, password}
      }, {}, () => {
        this.status.editAlbumItem = false;
        this.status.actionMenu = false;
        this.$Message.success(`相册"${name}"编辑成功`);
        this.queryProjectList();
      });
    },
    redirectPage(pageName) {
      this.$router.push({name: pageName, params: {projectItem: this.data.project}});
    },
    queryProjectCount(projectId) {
      return this.$db.count({scheme: 'photoList', project: projectId}, (error, count) => {
        if (error) {
          console.log(error);
        }
        return count;
      });
    },
    queryProjectList(currentPage = 0) {
      this.status.loadingProjectList = true;
      const {keyword} = this.params;
      const regex = new RegExp(keyword);
      this.$db.find({scheme: 'projectList', name: {$regex: regex}}, (error, docs) => {
        if (error) {
          console.log(error);
        }
        this.data.projectList = docs || [];
        this.status.loadingProjectList = false;
      });
    },
    queryPhotoList() {
      this.$db.find({scheme: 'photoList', project: this.data.project.id}, (error, docs) => {
        if (error) {
          console.log(error);
        }
        this.data.photoList = docs;
        console.log(docs);
      });
    },
    deleteProjectItem(projectItem) {
      const {id, name} = projectItem;
      this.$Modal.confirm({
        title: `确认删相册"${name}"？`,
        content: '相册中的所有图片也将被删除。',
        onOk: () => {
          this.$db.remove({scheme: 'projectList', id}, {}, () => {
            this.$db.remove({scheme: 'photoList', project: id}, {multi: true}, (error) => {
              if (error) {
                console.log(error);
              }
              this.data.projectList.splice(this.data.projectList.indexOf(projectItem), 1);
              this.$Message.success(`相册"${name}"删除成功！`);
              this.status.actionMenu = false;
            });
          });
        },
        onCancel: () => {
          this.$Message.info('已取消删除相册');
        }
      });
    },
    searchByProjectName(keyword) {
      this.params.keyword = keyword;
      this.queryProjectList();
    }
  },
  mounted() {
    this.queryProjectList();
  },
  watch: {
    'params.keyword'(keyword) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.searchByProjectName(keyword);
      }, 800);
    }
  }
};
</script>
