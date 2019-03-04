<style scoped lang="scss">
    .header {
        display: flex;
        flex-flow: nowrap row;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #eee;
        padding: 0 10px;

        &-item {
            letter-spacing: 1px;
            font-size: 1rem;
        }
    }

    .panel-container {
        .panel-body {
            height: 100vh;
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
    <Row>
        <Col span="16">
            <div class="header">
                <div class="header-item">
                    <title-board>
                        {{data.album.name}}
                    </title-board>
                </div>
                <div class="header-item">
                    <action-button-container>
                        <action-button-item @click="back()">
                            <Icon type="ios-arrow-dropleft" size="28" color="#999"/>
                            返回
                        </action-button-item>
                    </action-button-container>
                </div>
            </div>
            <div class="panel-container">
                <camera ref="camera"
                        :object="data.object"
                        @click-take-photo-btn="checkObject"
                        @confirm="confirmResult">
                </camera>
            </div>
        </Col>
        <Col span="8">
            <div class="panel-container">
                <panel class="panel-body">
                    <title-board>
                        相片列表
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
                                    <Tag v-if="item.saveStatus === 1 && item.updateStatus === 1 && item.shotStatus === 1"
                                         @click.native="updateObjectItem(item)">保存更新
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
        album: {},
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
      const notSavedList = this.getNotSavedList();
      const notUpdatedList = this.getNotUpdatedList();
      if (notSavedList.length > 0 || notUpdatedList.length > 0) {
        this.$Modal.confirm({
          title: `当前 新增${notSavedList.length}张相片、修改${notUpdatedList.length}张相片 还未保存！`,
          content: '直接返回将丢弃这些已拍摄的图片。',
          okText: '全部保存',
          onOk: () => {
            this.saveAllObject();
            this.updateAllObject();
            this.$router.back();
          },
          onCancel: () => {
            this.$Message.info('已取消返回');
          }
        });
      } else {
        this.$router.push({name: 'home', query: {'albumId': this.data.album.id}});
      }
    },
    redirectPage(pageName) {
      this.$router.push({name: pageName, params: {albumItem: this.data.album}});
    },
    checkObject() {
      const {shotStatus} = this.data.object;
      if (shotStatus === 1) {
        this.$Modal.confirm({
          title: '当前对象已拍摄过，确定重拍？',
          content: '重新拍摄将覆盖上次拍摄结果',
          onOk: () => {
            this.$refs.camera.runCamera();
            this.$refs.camera.status.isOverwritten = true;
          },
          onCancel: () => {
            this.$Message.info('已取消覆盖拍摄，将保留上次拍摄结果');
          }
        });
        return false;
      }
      this.$refs.camera.runCamera();
    },
    addObjectItem() {
      const newObject = {
        scheme: 'photoList',
        album: this.data.album.id,
        id: this.$getId(),
        name: '',
        photo: '',
        width: '',
        height: '',
        format: '',
        time: '',
        shotStatus: 0,
        saveStatus: 0,
        updateStatus: 0
      };
      this.data.photoList.push(newObject);
      this.$Message.success('新拍摄对象添加成功！');
      this.selectObjectItem(newObject);
    },
    selectObjectItem(objectItem) {
      this.data.object = objectItem;
    },
    modifyItemName(name) {
      const {id} = this.data.object;
      this.$db.update({
        scheme: 'photoList',
        album: this.data.album.id,
        id
      }, {$set: {name: name}}, {}, (err, count) => {
        if (err) {
          console.log(err);
        }
      });
    },
    queryPhotoList() {
      this.status.loadingObjectList = true;
      this.$db.find({scheme: 'photoList', album: this.data.album.id}, (err, docs) => {
        if (err) {
          console.log(err);
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
    getNotSavedList() {
      const {id} = this.data.album;
      return this.data.photoList.filter(item => {
        return item.album === id && item.saveStatus === 0 && item.photo !== '';
      });
    },
    getNotUpdatedList() {
      const {id} = this.data.album;
      return this.data.photoList.filter(item => {
        return item.album === id && item.updateStatus === 1 && item.photo !== '';
      });
    },
    confirmResult(result) {
      const {photo, isOverwritten, height, width, format} = result;
      let index = this.getObjectIndex();
      if (index === -1) {
        this.addObjectItem();
        index = this.data.photoList.length - 1;
      }
      this.$set(this.data.photoList[index], 'photo', photo);
      this.$set(this.data.photoList[index], 'height', height);
      this.$set(this.data.photoList[index], 'width', width);
      this.$set(this.data.photoList[index], 'format', format);
      this.$set(this.data.photoList[index], 'time', this.$moment().format('YYYY-MM-DD HH:mm:ss'));
      this.$set(this.data.photoList[index], 'shotStatus', 1);
      this.$set(this.data.photoList[index], 'updateStatus', isOverwritten ? 1 : 0);
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
    updateObjectItem(objectItem = {}) {
      const index = this.getObjectIndex(objectItem.id);
      this.$set(this.data.photoList[index], 'updateStatus', 0);
      const targetObject = this.data.photoList[index];
      this.$db.update({
        scheme: targetObject.scheme,
        id: targetObject.id
      }, {$set: {photo: targetObject.photo}}, {}, () => {
        this.$Message.success('拍摄结果修改成功！');
      });
    },
    saveAllObject() {
      const notSavedList = this.getNotSavedList();
      const saveList = notSavedList.map(item => {
        item.saveStatus = 1;
        return item;
      });
      this.$db.insert(saveList);
    },
    updateAllObject() {
      const notUpdatedList = this.getNotUpdatedList();
      notUpdatedList.map(item => {
        item.updateStatus = 0;
        this.updateObjectItem(item);
        return item;
      });
    },
    deleteObjectItem(objectItem) {
      const index = this.getObjectIndex(objectItem.id);
      this.$db.remove({scheme: 'photoList', album: this.data.album.id, id: objectItem.id}, () => {
        this.$Message.success('拍摄对象删除成功！');
      });
      this.data.photoList.splice(index, 1);
    }
  },
  mounted() {
    this.data.album = this.$route.params.albumItem || {};
    this.queryPhotoList();
  }
};
</script>
