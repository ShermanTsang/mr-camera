<style scoped rel="stylesheet/scss" lang="scss">
    .panel-container {
        box-shadow: 0 2px 6px rgba(177, 177, 177, .4);
        background-color: #ffffff;
        border-radius: 2px;
        cursor: default;
        padding: 20px;
    }

    .panel-container-center {
        margin: 0 auto;
    }

    .panel-container-hover {
        transition: all 100ms ease-in-out;

        &:hover {
            color: #ffffff !important;
            background: #4e8cfe;
            background: -webkit-gradient(linear, 0 100%, 0 0, from(#4e8cfe), to(#38b9fd));
            background: -webkit-linear-gradient(90deg, #4e8cfe, #38b9fd);
            background: linear-gradient(90deg, #4e8cfe, #38b9fd);
            background: -moz-linear-gradient(90deg, #4e8cfe, #38b9fd);
            background: -o-linear-gradient(90deg, #4e8cfe, #38b9fd);

            .ivu-divider-horizontal {
                color: #ffffff !important;
            }
        }
    }
</style>

<template>
    <div class="panel-container" :style="{width:width,padding:padding,margin:margin,display:display}"
         :class="{'panel-container-center':center !== undefined,'panel-container-hover':hover !== undefined}">
        <slot></slot>
    </div>
</template>

<script>
export default {
  name: 'panel',
  props: {
    center: {
      default: undefined
    },
    hover: {
      default: undefined
    },
    width: {
      default: '100%'
    },
    padding: {
      default: '20px'
    },
    margin: {
      default: ''
    },
    display: {
      default: 'block'
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
