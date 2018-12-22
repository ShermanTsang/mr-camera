<style scoped rel="stylesheet/scss" lang="scss">
</style>

<template>
    <img
            v-if="image"
            :src="getImage()"
            :key="image"
            :width="width"
            :height="height"
            :style="{'margin':margin,'padding':padding}"
            @click="handleClick"
            onerror="imageError()">
</template>

<script>
export default {
  name: 'pic',
  props: {
    src: {
      default: null
    },
    url: {
      default: null
    },
    width: {
      default: ''
    },
    height: {
      default: ''
    },
    margin: {
      default: ''
    },
    padding: {
      default: ''
    },
    showLarge: {
      default: undefined
    }
  },
  data() {
    return {
      image: ''
    };
  },
  mounted() {
    this.image = this.getImage();
  },
  watch: {
    url(value) {
      this.image = value;
    }
  },
  methods: {
    getImage() {
      const url = this.url || '';
      const src = this.src || '';
      if (url) {
        if (url.indexOf('://') > -1) {
          return url;
        }
        // return this.Api.Resource.baseUrl + url;
      }
      if (src) {
        try {
          return require('../assets/images/' + src);
        } catch (e) {
          console.log('Image resource \'' + src + '\' is not found !');
          return require('../assets/images/imagePlaceholder.png');
        }
      }
    },
    handleClick() {
      this.$emit('click');
      if (this.showLarge !== undefined) {
        this.showLargeViaModal();
      }
    },
    imageError() {
      this.image = require('../assets/images/imagePlaceholder.png');
    },
    downloadImage() {
      const downloadTarget = document.createElement('a');
      downloadTarget.href = this.url;
      downloadTarget.target = '_blank';
      downloadTarget.download = `图片(${Date.now().toString(36)}) - 相机先生`;
      downloadTarget.click();
    },
    showLargeViaModal() {
      this.$Modal.confirm({
        title: '查看大图',
        cancelText: '关闭',
        okText: '保存到本地',
        width: 800,
        onOk: () => {
          this.downloadImage();
        },
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
  }
};
</script>
