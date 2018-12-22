<style scoped lang="scss">
    .nav-container {
        display: flex;
        flex-flow: nowrap row;
        align-items: center;
        justify-content: space-between;
        .nav-item {
            letter-spacing: 1px;
            font-size: .9rem;
        }
    }

    .panel-container {
        .panel-body {
            height: calc(100vh - 140px);
            overflow: hidden;
            .panel-content {
                position: relative;
                padding: 5px;
                height: 80%;
                overflow: auto;
                .page-control {
                    margin: 20px auto;
                    text-align: center;
                }
            }
        }
    }
</style>

<template>
    <div>
        <panel margin="-10px 0 10px 0" padding="10px">
            <div class="nav-container">
                <div class="nav-item">
                    <text-tag icon="ios-arrow-dropleft" @click="back">返回</text-tag>
                </div>
                <div class="nav-item">
                    {{data.project.name}}
                </div>
                <div class="nav-item">
                    <text-tag icon="md-images" @click="redirectPage('album')">进入图库</text-tag>
                </div>
            </div>
        </panel>
        <Row :gutter="10">
            <Col span="16">
                <div class="panel-container">
                    <panel class="panel-body">
                        <camera ref="camera" requireConfirm
                                @click-take-photo-btn="clickTakePhotoBtn"
                                @result-confirm="confirmResult"></camera>
                    </panel>
                </div>
            </Col>
            <Col span="8">
                <div class="panel-container">
                    <panel class="panel-body">
                        <title-board>
                            拍摄对象列表
                            <span slot="right"><Button icon="md-add" size="small"
                                                       @click="addObjectItem">拍摄对象</Button></span>
                        </title-board>
                        <Alert v-if="data.photoList.length < 1" show-icon>
                            暂无拍摄对象
                            <Icon type="ios-bulb-outline" slot="icon"></Icon>
                            <template slot="desc">
                                请先添加拍摄对象
                            </template>
                        </Alert>
                        <div class="panel-content scrollable">
                            <spin fix v-if="status.loadingObjectList"></spin>
                            <div v-else>
                                <image-card v-for="item in data.photoList" :key="item.id"
                                            :id="item.id"
                                            :name.sync="item.name"
                                            :photo="item.photo"
                                            :active="item.id === data.object.id"
                                            @modify-name="modifyItemName"
                                            @click.native="selectObjectItem(item)">
                                    <div slot="status">
                                        <Tag color="primary" v-if="item.saveStatus === 1">图库中</Tag>
                                        <Tag @click.native="deleteObjectItem(item)">删除</Tag>
                                        <Tag v-if="item.saveStatus === 0 && item.shotStatus === 1"
                                             @click.native="saveObjectItem(item)">保存
                                        </Tag>
                                    </div>
                                </image-card>
                            </div>
                            <div class="page-control" v-if="data.photoList.length > 1">
                                <Page :total="config.pageControl.totalCount || 0"
                                      :page-size="config.pageControl.defaultPageSize || 0"
                                      @on-change="queryPhotoList" simple/>
                            </div>
                        </div>
                    </panel>
                </div>
            </Col>
        </Row>
    </div>
</template>

<script>
export default {
  name: 'workspace',
  data() {
    return {
      status: {
        loadingObjectList: false
      },
      data: {
        project: {},
        object: {},
        photoList: []
      },
      config: {
        pageControl: {
          defaultPageSize: 15,
          totalCount: 0,
          offset: 0
        }
      },
      params: {
        keyword: '',
        limit: 20
      }
    };
  },
  methods: {
    back() {
      const notUploadedList = this.getNotUploadedList();
      if (notUploadedList.length > 0) {
        this.$Modal.confirm({
          title: `当前还有 ${notUploadedList.length}张 已拍摄但未保存的图片`,
          content: '直接返回将丢弃这些已拍摄的图片。',
          okText: '全部保存',
          onOk: () => {
            this.saveAllObject();
            this.$router.back();
          },
          onCancel: () => {
            this.$Message.info('已取消返回');
          }
        });
      } else {
        this.$router.push({name: 'home'});
      }
    },
    redirectPage(pageName) {
      this.$router.push({name: pageName, params: {projectItem: this.data.project}});
    },
    clickTakePhotoBtn() {
      const {shotStatus} = this.data.object;
      if (shotStatus === 1) {
        this.$Modal.confirm({
          title: '当前对象已拍摄过，确定重拍？',
          content: '重新拍摄将覆盖上次拍摄结果',
          onOk: () => {
            this.$refs.camera.takePhotoTrigger();
          },
          onCancel: () => {
            this.$Message.info('已取消覆盖拍摄，将保留上次拍摄结果');
          }
        });
        return false;
      }
      this.$refs.camera.takePhotoTrigger();
    },
    addObjectItem() {
      this.data.photoList.push({
        scheme: 'photoList',
        project: this.data.project.id,
        id: this.$getId(),
        name: '',
        photo: '',
        time: '',
        shotStatus: 0,
        saveStatus: 0
      });
      this.$Message.success('新拍摄对象添加成功！');
    },
    selectObjectItem(objectItem) {
      this.data.object = objectItem;
    },
    modifyItemName(name) {
      const {id} = this.data.object;
      this.$db.update({scheme: 'photoList', project: this.data.project.id, id}, { $set: { name: name } }, {}, (error, count) => {
        if (error) { console.log(error); }
      });
    },
    queryPhotoList() {
      this.status.loadingObjectList = true;
      this.$db.find({scheme: 'photoList', project: this.data.project.id}, (error, docs) => {
        if (error) {
          console.log(error);
        }
        this.data.photoList = docs;
        this.status.loadingObjectList = false;
      });
    },
    getObjectIndex(objectId = null) {
      const id = objectId === null ? this.data.object.id : objectId;
      return this.data.photoList.findIndex(item => {
        return item.id === id;
      });
    },
    getNotUploadedList() {
      const {id} = this.data.project;
      return this.data.photoList.filter(item => {
        return item.project === id && item.saveStatus === 0 && item.photo !== '';
      });
    },
    confirmResult(photo) {
      let index = this.getObjectIndex();
      if (index === -1) {
        this.addObjectItem();
        index = this.data.photoList.length - 1;
      }
      this.$set(this.data.photoList[index], 'photo', photo);
      this.$set(this.data.photoList[index], 'shotStatus', 1);
      this.$refs.camera.status.workPanel = false;
    },
    saveObjectItem(objectItem = {}) {
      const index = this.getObjectIndex(objectItem.id);
      this.$set(this.data.photoList[index], 'saveStatus', 1);
      const newObject = this.data.photoList[index];
      this.$db.insert(newObject, () => {
        this.$Message.success('拍摄结果保存成功！');
      });
    },
    saveAllObject() {
      const notUploadedList = this.getNotUploadedList();
      const saveList = notUploadedList.map(item => {
        item.saveStatus = 1;
        return item;
      });
      this.$db.insert(saveList);
    },
    deleteObjectItem(objectItem) {
      const index = this.getObjectIndex(objectItem.id);
      this.$db.remove({scheme: 'photoList', project: this.data.project.id, id: objectItem.id}, () => {
        this.$Message.success('拍摄对象删除成功！');
      });
      this.data.photoList.splice(index, 1);
    }
  },
  mounted() {
    this.data.project = this.$route.params.projectItem || {};
    this.queryPhotoList();
  },
  watch: {
    'params.keyword'(keyword) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.searchByObjectNameOrId(keyword);
      }, 800);
    }
  }
};
</script>
