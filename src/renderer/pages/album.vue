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

    .photo-item {
        overflow: hidden;
        position: relative;
        display: inline-block;
        margin: 10px;
        box-shadow: 0 0 8px rgba(177, 177, 177, .5);
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
            .photo-item-action {
                margin-top: 10px;
                transition: all .2s ease-in-out;
                transform: translateY(30px);
                cursor: pointer;
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                align-items: center;
                i {
                    &:hover {
                        color: $theme-color;
                        transform: scale(1.2);
                    }
                }
            }
        }
        &:hover {
            box-shadow: 0 0 4px $theme-color;
            .photo-item-info {
                height: 70px;
                .photo-item-action {
                    transform: translateY(0);
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
                </div>
            </div>
        </panel>
        <Row :gutter="10">
            <Col span="24">
                <div class="panel-container">
                    <panel class="panel-body">
                        <title-board>
                            图库
                            <div slot="right" style="width: 200px;">

                            </div>
                        </title-board>
                        <div v-for="item in data.photoList" :key="item.id" class="photo-item"
                             :style="{width:config.photoItemSep + 'px',height:config.photoItemSep + 'px'}">
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
                    </panel>
                </div>
            </Col>
        </Row>
    </div>
</template>

<script>
export default {
  name: 'camera-gallery',
  data() {
    return {
      status: {
        loadingPhotoList: false
      },
      data: {
        project: {},
        photoList: []
      },
      config: {
        photoItemSep: 180,
        pageControl: {
          defaultPageSize: 15,
          totalCount: 0,
          offset: 0
        }
      },
      params: {
        keyword: '',
        avatar: '',
        limit: 20
      }
    };
  },
  methods: {
    back() {
      this.$router.push({name: 'home'});
    },
    searchByObjectNameOrId(keyword) {
      const pattern = new RegExp(keyword);
      this.data.photoList = this.data.photoList.filter(item => {
        return pattern.test(item.name) || pattern.test(item.id);
      });
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
      this.$db.update({scheme: 'photoList', project: this.data.project.id, id}, { $set: { isCollected: true } }, {}, (error, count) => {
        if (error) { console.log(error); }
        this.$Message.success(`收藏成功！`);
      });
    },
    downloadPhotoItem(photoItem) {

    }
  },
  mounted() {
    this.data.project = this.$route.params.projectItem || {};
    this.$db.find({scheme: 'photoList', project: this.data.project.id}, (error, docs) => {
      if (error) {
        console.log(error);
      }
      this.data.photoList = docs;
      console.log(docs);
    });
  },
  watch: {
    'params.keyword'(keyword) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.searchByObjectName(keyword);
      }, 800);
    }
  }
};
</script>
