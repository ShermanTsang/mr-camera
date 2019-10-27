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

    .batch-add-panel {

        &-input {
            font-size: .9rem;
        }

        &-option {
            margin: 10px 0;
            padding: 10px 0;
            border-top: 1px solid #efefef;
            border-bottom: 1px solid #efefef;
        }

        &-preview {
            margin: 10px;
            &-info{
                text-align: center;
                margin: 10px 0;
                color: $theme-color;
            }
            span {
                margin: 4px;
                font-size: .9rem;
                border: 1px solid #ddd;
                padding: 4px 8px;
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
                        {{data.currentAlbum.name}}
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
                        :selectedItem="data.currentPhoto"
                        @click-take-photo-btn="checkPhoto"
                        @add-default-item="addPhotoItem"
                        @confirm="confirmResult">
                </camera>
            </div>
        </Col>
        <Col span="8">
            <div class="panel-container">
                <panel class="panel-body">
                    <title-board>
                        相片列表
                        <span slot="right">
                            <Button icon="md-add" size="small" @click="addPhotoItem('')">拍摄对象</Button>
                            <Button icon="ios-add-circle-outline" size="small"
                                    @click="status.addBatchPhotoItemPanel = true">批量添加</Button>
                        </span>
                    </title-board>
                    <Alert v-if="data.photoList.length < 1" show-icon>
                        暂无拍摄对象
                        <Icon type="ios-bulb-outline" slot="icon"></Icon>
                        <template slot="desc">
                            请先添加拍摄对象
                        </template>
                    </Alert>
                    <div class="panel-content scrollable">
                        <Tabs v-model="status.tabType">
                            <TabPane :label="`待拍摄 ${photoNotSavedList.length}`" name="notSaved"></TabPane>
                            <TabPane :label="`相册中 ${params.page.total}`" name="saved"></TabPane>
                        </Tabs>
                        <spin fix v-if="status.loadingPhotoList"></spin>
                        <template v-else>
                            <image-card v-for="item in status.tabType === 'saved' ? photoSavedList : photoNotSavedList"
                                        :key="item.id"
                                        :id="item.id"
                                        :name.sync="item.name"
                                        :path="item.path ? item.path : item.base64"
                                        :active="item.id === data.currentPhoto.id"
                                        @on-focus="data.oldPhotoName = item.name"
                                        @on-blur="modifyItemName"
                                        @click.native="selectPhotoItem(item)">
                                <div slot="status">
                                    <Tag color="primary" v-if="item.saveStatus === 1">图库中</Tag>
                                    <Tag @click.native="deletePhotoItem(item)">删除</Tag>
                                    <Tag v-if="item.saveStatus === 0 && item.shotStatus === 1"
                                         @click.native="savePhotoItem(item)">保存
                                    </Tag>
                                    <Tag v-if="item.saveStatus === 1 && item.updateStatus === 1 && item.shotStatus === 1"
                                         @click.native="updatePhotoItem(item)">保存更新
                                    </Tag>
                                </div>
                            </image-card>
                        </template>
                        <div class="page-control" v-if="status.tabType === 'saved'">
                            <Page :current.sync="params.page.current" :total="params.page.total"
                                  :page-size="params.page.pageSize" simple show-sizer
                                  @on-change="queryPhotoList"/>
                        </div>
                    </div>
                </panel>
            </div>
        </Col>
        <Modal v-model="status.addBatchPhotoItemPanel" width="600" title="批量添加拍摄对象" ok-text="创建"
               @on-ok="addBatchPhotoItem" class="batch-add-panel">
            <div class="batch-add-panel-input">
                <Input v-model="data.batchInput" type="textarea" :autosize="{minRows: 4,maxRows: 10}"
                       placeholder="在这里粘贴要批量添加的对象名单，一次最多只能添加100个。"/>
            </div>
            <div class="batch-add-panel-option">
                <CheckboxGroup v-model="config.batchDivider">
                    <checkbox label="\n\r">以行分割</checkbox>
                    <checkbox label=",">以逗号分割</checkbox>
                    <checkbox label="|">以|号分割</checkbox>
                    <checkbox label="\s ">以空格分割</checkbox>
                </CheckboxGroup>
            </div>
            <div class="batch-add-panel-preview">
                <div class="batch-add-panel-preview-info">
                    {{batchItemList.length > 1 ? `已检测到 ${batchItemList.length}个 对象` : '这里将显示监测到的对象' }}
                </div>
                <span v-if="batchItemList.length > 1" v-for="item in batchItemList" :key="item">{{item}}</span>
            </div>
        </Modal>
    </Row>
</template>

<script>
export default {
  name: 'workspace',
  data() {
    return {
      status: {
        loadingPhotoList: false,
        addBatchPhotoItemPanel: false,
        tabType: 'todo'
      },
      data: {
        currentAlbum: {},
        currentPhoto: {},
        oldPhotoName: '',
        photoList: [],
        batchInput: ''
      },
      config: {
        batchDivider: [',']
      },
      params: {
        keyword: '',
        limit: 20,
        page: {
          current: 1,
          total: 0,
          pageSize: 15
        }
      }
    }
  },
  computed: {
    photoNotSavedList() {
      const photoNotSavedList = this.data.photoList.filter((item) => {
        return item.saveStatus === 0
      })
      const sortByTimeDesc = (item1, item2) => {
        return item1.time < item2.time ? -1 : 1
      }
      return photoNotSavedList.sort(sortByTimeDesc)
    },
    photoSavedList() {
      const photoSavedList = this.data.photoList.filter((item) => {
        return item.saveStatus === 1
      })
      const sortByTimeDesc = (item1, item2) => {
        return item1.time < item2.time ? -1 : 1
      }
      return photoSavedList.sort(sortByTimeDesc)
    },
    batchItemList() {
      const divider = this.config.batchDivider.join('')
      const batchInput = this.data.batchInput
      return batchInput.split(new RegExp('[' + divider + ']'), 100)
    }
  },
  methods: {
    back() {
      const notSavedList = this.getNotSavedList()
      const notUpdatedList = this.getNotUpdatedList()
      if (notSavedList.length > 0 || notUpdatedList.length > 0) {
        this.$Modal.confirm({
          title: `当前 新增${notSavedList.length}张相片、修改${notUpdatedList.length}张相片 还未保存！`,
          content: '直接返回将丢弃这些已拍摄的图片。',
          okText: '全部保存',
          onOk: () => {
            this.saveAllItem()
            this.updateAllItem()
            this.$router.back()
          },
          onCancel: () => {
            this.$Message.info('已取消返回')
          }
        })
      } else {
        this.$router.push({name: 'home', query: {'albumId': this.data.currentAlbum.id}})
      }
    },
    redirectPage(pageName) {
      this.$router.push({name: pageName, params: {albumItem: this.data.currentAlbum}})
    },
    checkPhoto() {
      const {shotStatus} = this.data.currentPhoto
      if (shotStatus === 1) {
        this.$Modal.confirm({
          title: '当前对象已拍摄过，确定重拍？',
          content: '重新拍摄将覆盖上次拍摄结果',
          onOk: () => {
            this.$refs.camera.runCamera()
            this.$refs.camera.status.isOverwritten = true
          },
          onCancel: () => {
            this.$Message.info('已取消覆盖拍摄，将保留上次拍摄结果')
          }
        })
        return false
      }
      this.$refs.camera.runCamera()
    },
    addPhotoItem(name) {
      const newPhoto = {
        scheme: 'photoList',
        album: this.data.currentAlbum.id,
        id: this.$getId(),
        name: name,
        photo: '',
        path: '',
        width: '',
        height: '',
        format: '',
        time: '',
        size: '',
        shotStatus: 0,
        saveStatus: 0,
        updateStatus: 0
      }
      this.data.photoList.push(newPhoto)
      this.selectPhotoItem(newPhoto)
      this.status.tabType = 'notSaved'
    },
    addBatchPhotoItem() {
      const batchInput = this.data.batchInput
      const batchItemList = this.batchItemList
      if (batchInput.length < 1) {
        this.$Message.error('批量添加的内容不能为空')
        return false
      }
      batchItemList.forEach(itemName => {
        this.addPhotoItem(itemName)
      })
      this.$Message.success(`已成功批量添加了 ${batchItemList.length}个 拍摄对象！`)
      this.data.batchInput = ''
    },
    selectPhotoItem(photoItem) {
      this.data.currentPhoto = photoItem
    },
    getValidFileName(name) {
      const {id, format} = this.data.currentPhoto
      const regex = /[<>:'|*？/\\]/g
      const validName = this.data.currentPhoto.name = name.replace(regex, '').trim()
      const testPath = this.$path.join(this.data.currentAlbum.directoryPath, `${validName}.${format}`)
      if (regex.test(name)) {
        this.$Message.warning('文件名不能包含非法字符！已自动去除。')
      }
      if (this.$fs.existsSync(testPath)) {
        this.$Message.warning('文件名不能重复！已自动处理。')
        const uniqueName = `${validName} - ${id}`
        this.data.currentPhoto.name = uniqueName
        return uniqueName
      }
      return validName
    },
    modifyItemName() {
      if (this.data.oldPhotoName === this.data.currentPhoto.name) { return false }
      const {id, name, path, saveStatus, format} = this.data.currentPhoto
      const newName = this.getValidFileName(name)
      const newPath = this.$path.join(this.$path.dirname(path), `${newName}.${format}`)
      if (saveStatus === 0) {
        this.$db.update({
          scheme: 'photoList',
          album: this.data.currentAlbum.id,
          id
        }, {$set: {name: newName}}, {}, (err, docs) => {
          if (err) {
            console.log(err)
          }
        })
      } else {
        this.$db.update({
          scheme: 'photoList',
          album: this.data.currentAlbum.id,
          id
        }, {$set: {name: newName, path: newPath}}, {}, (err, docs) => {
          if (err) {
            console.log(err)
          }
          this.$fs.rename(path, newPath, (err) => {
            if (err) {
              console.log(err)
            }
            this.$set(this.data.currentPhoto, 'path', newPath)
          })
        })
      }
    },
    queryPhotoList() {
      this.status.loadingPhotoList = true
      const {current, pageSize} = this.params.page
      const {id} = this.data.currentAlbum
      const skipNum = (current - 1) * pageSize
      const photoNotSavedList = this.data.photoList.filter(item => {
        return item.saveStatus === 0
      })
      this.$db.count({scheme: 'photoList', album: id}, (err, count) => {
        if (err) {
          console.log(err)
        }
        this.data.currentAlbum.total = this.params.page.total = count
      })
      this.$db.find({
        scheme: 'photoList',
        album: id
      }).sort({time: -1}).skip(skipNum).limit(pageSize).exec((err, docs) => {
        if (err) {
          console.log(err)
        }
        this.data.photoList = photoNotSavedList.length < docs.length ? photoNotSavedList.concat(docs) : docs.concat(photoNotSavedList) || []
        this.status.loadingPhotoList = false
      })
    },
    getPhotoIndex(photoId = null) {
      const id = photoId === null ? this.data.currentPhoto.id : photoId
      return this.data.photoList.findIndex(item => {
        return item.id === id
      })
    },
    getNotSavedList() {
      const {id} = this.data.currentAlbum
      return this.data.photoList.filter(item => {
        return item.album === id && item.saveStatus === 0 && item.base64 !== ''
      })
    },
    getNotUpdatedList() {
      const {id} = this.data.currentAlbum
      return this.data.photoList.filter(item => {
        return item.album === id && item.updateStatus === 1 && item.base64 !== ''
      })
    },
    confirmResult(item) {
      let index = this.getPhotoIndex()
      if (index === -1) {
        this.addPhotoItem()
        index = this.data.photoList.length - 1
      }
      this.data.photoList.splice(index, 1, item)
      this.$refs.camera.status.workPanel = false
    },
    savePhotoItem(item = {}) {
      const index = this.getPhotoIndex(item.id)
      const newPhotoItem = this.data.photoList[index]
      const storePath = this.$path.join(this.data.currentAlbum.directoryPath, `${newPhotoItem.name || `未命名 ${newPhotoItem.id}`}.${newPhotoItem.format}`)
      this.$set(newPhotoItem, 'saveStatus', 1)
      this.$set(newPhotoItem, 'path', storePath)
      const base64Data = newPhotoItem.base64.replace(/^data:image\/\w+;base64,/, '')
      const dataBuffer = Buffer.alloc(newPhotoItem.size, base64Data, 'base64')
      this.$fs.writeFile(storePath, dataBuffer, (err) => {
        if (err) {
          console.log(err)
          this.$Message.success('拍摄结果保存失败！')
        } else {
          this.$set(newPhotoItem, 'base64', '')
          this.$db.insert(newPhotoItem, () => {
            this.$Message.success('拍摄结果保存成功！')
            this.queryPhotoList()
          })
        }
      })
    },
    updatePhotoItem(photoItem = {}) {
      const index = this.getPhotoIndex(photoItem.id)
      this.$set(this.data.photoList[index], 'updateStatus', 0)
      const targetPhoto = this.data.photoList[index]
      this.$db.update({
        scheme: targetPhoto.scheme,
        id: targetPhoto.id
      }, {$set: {photo: targetPhoto.photo}}, {}, () => {
        this.$Message.success('拍摄结果修改成功！')
      })
    },
    saveAllItem() {
      const notSavedList = this.getNotSavedList()
      notSavedList.forEach(item => {
        item.saveStatus = 1
        this.savePhotoItem(item)
      })
    },
    updateAllItem() {
      const notUpdatedList = this.getNotUpdatedList()
      notUpdatedList.map(item => {
        item.updateStatus = 0
        this.updatePhotoItem(item)
        return item
      })
    },
    deletePhotoItem(photoItem) {
      const index = this.getPhotoIndex(photoItem.id)
      this.$db.remove({scheme: 'photoList', album: this.data.currentAlbum.id, id: photoItem.id}, () => {
        this.$Message.success('拍摄对象删除成功！')
      })
      this.data.photoList.splice(index, 1)
      this.data.currentPhoto = {}
    }
  },
  mounted() {
    this.data.currentAlbum = this.$route.params.albumItem || {}
    this.queryPhotoList()
  }
}
</script>
