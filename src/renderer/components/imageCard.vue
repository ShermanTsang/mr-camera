<style scoped rel="stylesheet/scss" lang="scss">
    .image-card-container {
        display: block;
        border-bottom: 1px solid #eee;
        background-color: #ffffff;
        margin: 4px 0;
        cursor: default;
        overflow: hidden;
        transition: all .2s ease-in-out;
        .image-card-body {
            height: 60px;
            display: flex;
            flex-flow: nowrap row;
            align-items: center;
            position: relative;
            .image-card-image {
                width: 60px;
                height: 60px;
                overflow: hidden;
                text-align: center;
                background-position: center !important;
                background-size:cover !important;
            }
            .image-card-content {
                margin-left: 10px;
                .image-name {
                    font-size: .95rem;
                    /deep/ input {
                        border: none;
                        border-bottom: 1px dashed #ccc;
                        background: transparent;
                    }
                }
                .image-info {
                    font-size: .9rem;
                    color: #999;
                }
            }
            .image-card-status {
                position: absolute;
                right: 10px;
                top: 20px;
            }
        }
        &:hover {
            border-color: #ffffff;
            box-shadow: 0 0 8px $theme-color;
            cursor: pointer;
        }
    }

    .image-card-active {
        box-shadow: 0 0 4px orange;
        background-color: rgba(255, 165, 0, 0.05);
    }
</style>

<template>
    <div class="image-card-container" :class="{'image-card-active':this.active}">
        <div class="image-card-body">
            <div class="image-card-image" :style="{background:'url('+path+')'}">
                <Poptip v-if="path !== ''" trigger="hover" :transfer="true" style="width: 100%;height: 100%;">
                    <div slot="content">
                        <img :src="path"
                             :style="{minHeight: '100px',maxHeight: '180px',boxShadow: '0 0 10px rgba(0,0,0,.2)',borderRadius: '2px'}">
                    </div>
                </Poptip>
                <Icon v-else type="ios-image-outline" size="64" color="#ccc"></Icon>
            </div>
            <div class="image-card-content">
                <div class="image-name">
                    <Input @on-focus="$emit('on-focus')" @on-blur="$emit('on-blur')" v-model="currentName" :placeholder="`未命名对象 #${id}`"/>
                </div>
                <div class="image-info">
                    <slot name="info"></slot>
                </div>
            </div>
            <div class="image-card-status">
                <slot name="status"></slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'image-card',
  props: {
    id: {
      default: 0
    },
    active: {
      default: false
    },
    path: {
      default: ''
    },
    name: {
      default: ''
    }
  },
  data() {
    return {
      image: '',
      currentName: ''
    };
  },
  methods: {
    handleClick() {
      if (this.showLarge !== undefined) {
        this.showLargeViaModal();
      }
    },
    imageError() {
      this.image = require('../assets/images/imagePlaceholder.png');
    },
    showLargeViaModal() {
      this.$Modal.confirm({
        title: '查看大图',
        cancelText: '关闭',
        okText: '保存到本地',
        width: 800,
        closable: true,
        render: (h) => {
          return [
            h('ui-image', {
              props: {
                url: this.url
              },
              style: {
                maxWidth: '100%',
                display: 'block',
                margin: '0 auto'
              }
            }), h('div', {
              style: {
                color: '#999',
                textAlign: 'center',
                fontSize: '.9rem',
                letterSpacing: '1px',
                margin: '10px auto'
              }
            }, '按Esc键可快速关闭')
          ];
        }
      });
    }
  },
  mounted() {
    this.currentName = this.name;
  },
  watch: {
    name(value) {
      this.currentName = value;
    },
    currentName(value) {
      this.$emit('update:name', value);
    }
  }
};
</script>
