<style lang="scss" scoped>
    .index {
        height: 100%;
        overflow: hidden;

        &-background {
            position: fixed;
            width: 100%;
            top: 0;
            left: 0;
            filter: blur(4px);
            opacity: .95;
            transition: all .5s ease-in-out;
            animation: background 6s infinite alternate;

            img {
                background-position: center center;
                background-size: cover;
            }
        }

        &-container {
            display: flex;
            flex-flow: row nowrap;
            justify-content: center;
            align-content: center;
            -webkit-app-region: drag;
            background-color: rgba(0, 0, 0, .1);
            opacity: .9;
            height: 100%;

            .index-body {
                position: relative;
                height: 100%;
                width: 500px;
                display: flex;
                flex-flow: column nowrap;
                align-items: center;
                justify-content: center;
                background-color: #0093E9;
                box-shadow: 0 2px 30px rgba(0, 0, 0, .2);
                background-image: linear-gradient(160deg, #0093E9 0%, #80D0C7 100%);

                .index-title {
                    cursor: default;
                    font-size: 2.5rem;
                    font-weight: 500;
                    color: #ffffff;
                    letter-spacing: 4px;
                    text-align: center;
                    text-shadow: 1px 1px 1px rgba(0, 0, 0, .1);

                    .index-subtitle {
                        font-size: 1.4rem;
                    }
                }

                .index-statics {
                    margin: 20px 0;
                    padding: 10px 0;
                    color: #ffffff;
                    font-size: 1.2rem;
                    border-top: 1px solid #ffffff;
                    border-bottom: 1px solid #ffffff;
                    letter-spacing: 2px;

                    span {
                        font-weight: 600;
                        font-size: 2rem;
                    }
                }

                .index-enter {
                    margin: 20px 0;
                    -webkit-app-region: no-drag;
                }

                .index-button {
                    cursor: pointer;
                    width: 200px;
                    text-align: center;
                    border: 1px solid #efefef;
                    font-size: 1.1rem;
                    letter-spacing: 2px;
                    color: #ffffff;
                    padding: 10px 20px;
                    margin: 10px 0;
                    transition: all .2s ease-in-out;
                }

                .index-button-normal {
                    &:hover {
                        background-color: $theme-color;
                        border-color: transparent;
                    }
                }

                .index-button-close {
                    &:hover {
                        background-color: orangered;
                        border-color: transparent;
                    }
                }
            }
        }
    }

    @keyframes background {
        0% {
            transform: scale(1.1);
        }
        50% {
            transform: scale(1.3);
        }
        100% {
            transform: scale(1.6);
        }
    }
</style>

<template>
    <div class="index">
        <div class="index-background">
            <pic :src="getSlideImage()"></pic>
        </div>
        <div class="index-container">
            <div class="index-body">
                <div class="index-title">
                    相机先生
                    <div class="index-subtitle">Mr Camera</div>
                </div>
                <div class="index-statics" v-if="data.projectAmount > 0">
                    <span>{{data.projectAmount}}</span> 个相册
                    <span>{{data.photoAmount}}</span> 张照片
                </div>
                <div class="index-statics" v-else>
                    Nice to meet you !
                </div>
                <div class="index-enter">
                    <div @click="enter" class="index-button index-button-normal">进入</div>
                    <div @click="close" class="index-button index-button-close">退出</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'index',
  data() {
    return {
      status: {
        isCameraReady: false,
        slideNumber: 1
      },
      data: {
        photoAmount: 0,
        projectAmount: 0,
        slide: [
          {id: 1, text: ''},
          {id: 2, text: ''},
          {id: 3, text: ''},
          {id: 4, text: ''}
        ]
      }
    };
  },
  methods: {
    close() {
      this.$electron.remote.app.exit();
    },
    enter() {
      this.$router.push({name: 'home'});
    },
    checkCamera() {
      navigator.getUserMedia = navigator.getUserMedia ||
          navigator.webkitGetUserMedia ||
          navigator.mozGetUserMedia ||
          navigator.msGetUserMedia;
      if (navigator.getUserMedia) {
        this.status.isCameraReady = true;
        console.log(navigator.mediaDevices);
      } else {
        this.status.isCameraReady = false;
      }
    },
    getSlideImage() {
      return `slide${this.status.slideNumber}.jpg`;
    },
    switchSlide() {
      setInterval(() => {
        this.status.slideNumber = this.status.slideNumber === this.data.slide.length ? 1 : this.status.slideNumber + 1;
      }, 3000);
    },
    queryStatics() {
      this.$db.count({scheme: 'photoList'}, (error, count) => {
        if (error) {
          console.log(error);
        }
        this.data.photoAmount = count;
      });
      this.$db.count({scheme: 'projectList'}, (error, count) => {
        if (error) {
          console.log(error);
        }
        this.data.projectAmount = count;
      });
    }
  },
  mounted() {
    this.checkCamera();
    this.switchSlide();
    this.queryStatics();
  }
};
</script>
