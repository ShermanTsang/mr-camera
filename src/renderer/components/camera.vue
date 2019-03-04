<style scoped rel="stylesheet/scss" lang="scss">
    .camera-container {
        position: relative;
        margin: 0 auto;
        width: 100%;

        #camera-video {
            display: block;
            margin: 20px auto;
        }

        .camera-countdown {
            position: absolute;
            right: 100px;
            bottom: 20px;
            z-index: 998;
            color: rgba(255, 255, 255, .5);
            font-size: 3rem;
            font-weight: 500;
            text-shadow: 1px 1px 8px rgba(0, 0, 0, .5);
        }

        .camera-tool {
            position: absolute;
            bottom: 20px;
            width: 100%;
            display: flex;
            flex-flow: nowrap row;
            align-content: center;
            align-items: center;
            justify-content: center;
            height: 40px;
            margin-top: -5px;
            z-index: 999;

            .camera-tool-item {
                cursor: pointer;
                padding: 16px;
                transition: all 400ms ease-in-out;
                border-radius: 50%;

                &:hover {
                    background-color: rgba(255, 255, 255, .5);
                    box-shadow: 0 0 10px rgba(0, 0, 0, .8) inset;
                }
            }
        }
    }

    .camera-result {
        width: 100%;
        height: 400px;
        overflow: hidden;

        .camera-preview-image {
            max-height: 95%;
            display: block;
            margin: 10px auto;
            box-shadow: 0 0 8px #2494F2;
        }
    }

    .camera-mode {
        display: flex;
        flex-flow: row nowrap;

        &-item {
            flex: 1 0;
            padding: 10px;
            height: 80px;
            border: 1px solid #efefef;
            letter-spacing: 1px;
            transition: all .2s ease-in-out;
            cursor: pointer;

            &-name {
                font-size: 1rem;
                margin-bottom: 5px;
                color: #666;
            }

            &-text {
                font-size: .85rem;
                color: #999;
            }

            &:hover {
                .camera-mode-item-name {
                    color: $theme-color;
                }
            }
        }

        &-item-active {
            background: #F0FAFF;
        }
    }
</style>

<template>
    <div>
        <div class="camera-container">
            <video id="camera-video"
                   :style="{width:camera.videoContainerWidth  + 'px',height:camera.videoContainerHeight + 'px'}">
            </video>
            <div class="camera-tool">
                <div class="camera-tool-item" @click="clickTakePhotoBtn()">
                    <Icon type="md-camera" size="40" color="rgba(255,255,255,.8)"/>
                </div>
            </div>
            <div class="camera-countdown" v-if="config.countdown > 0">
                {{status.countdown === 0 ? '':status.countdown}}
            </div>
            <slot></slot>
        </div>
        <div class="camera-mode">
            <div class="camera-mode-item">
                <div class="camera-mode-item-name">拍照模式</div>
                <div class="camera-mode-item-text">
                    <RadioGroup v-model="config.mode" type="button">
                        <Radio label="preview">拍后预览</Radio>
                        <Radio label="cropper">拍后裁剪</Radio>
                        <Radio label="direct">直接拍摄</Radio>
                    </RadioGroup>
                </div>
            </div>
            <div class="camera-mode-item">
                <div class="camera-mode-item-name">照片格式</div>
                <div class="camera-mode-item-text">
                    <RadioGroup v-model="config.format" type="button">
                        <Radio label="png">PNG</Radio>
                        <Radio label="jpeg">JPG</Radio>
                        <Radio label="gif">GIF</Radio>
                    </RadioGroup>
                </div>
            </div>
            <div class="camera-mode-item"
                 :class="{'camera-mode-item-active':config.countdown > 0}">
                <div class="camera-mode-item-name">拍照倒计时
                    <small>{{config.countdown > 0 ? ` - ${config.countdown}秒`:' - 关闭'}}</small>
                </div>
                <div class="camera-mode-item-text">
                    <Slider v-model="config.countdown" :step="1" :min="0" :max="30"></Slider>
                </div>
            </div>
        </div>
        <Modal title="拍照结果处理" v-model="status.workPanel" class-name="vertical-center-modal"
               :width="camera.videoContainerWidth + 100 + 'px'">
            <div class="camera-result">
                <canvas id="camera-origin-canvas" style="display: none;" :width="camera.videoWidth"
                        :height="camera.videoHeight"></canvas>
                <canvas id="camera-resize-canvas" style="display: none"></canvas>
                <vueCropper
                        ref="cropper"
                        v-if="photo.capture !== null && status.step === 'cropper' && config.mode === 'cropper'"
                        :img="photo.capture"
                        :can-move="true"
                        :autoCrop="true"
                        :autoCropWidth="camera.boxWidth"
                        :autoCropHeight="camera.boxHeight"
                        :outputSize="1"
                        :format="camera.format">
                </vueCropper>
                <img id="result-image"
                     :src="photo.result"
                     v-if="photo.result !== null && status.step === 'confirm'"
                     class="camera-preview-image">
            </div>
            <div slot="footer" style="text-align: center">
                <Button v-if="status.step === 'cropper'" type="err" @click="status.workPanel = false"
                        icon="md-trash">重新拍摄
                </Button>
                <Button v-if="status.step === 'confirm' && config.mode === 'cropper'" type="warning"
                        icon="md-arrow-round-back" @click="redoCopper()">
                    重新裁剪
                </Button>
                <Button v-if="status.step === 'cropper' && config.mode === 'cropper'" type="info"
                        icon="ios-refresh-circle-outline"
                        @click="$refs.cropper.rotateRight()">
                    旋转图像
                </Button>
                <Dropdown @on-click="download">
                    <Button type="success" icon="md-download">导出图片
                        <Icon v-if="status.step === 'confirm'" type="ios-arrow-down"></Icon>
                    </Button>
                    <DropdownMenu slot="list">
                        <DropdownItem name="capturePhoto" v-if="config.mode === 'cropper'">导出原拍摄图</DropdownItem>
                        <DropdownItem name="resultPhotoPNG" v-if="status.step === 'confirm'">导出裁剪图</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Button v-if="status.step === 'cropper' && config.mode === 'cropper'" type="primary"
                        icon="md-checkmark"
                        @click="captureCropper()">
                    确认裁剪
                </Button>
                <Button type="primary" icon="md-checkmark" @click="confirmResult()"
                        v-if="status.step === 'confirm' || config.mode === 'preview'">
                    确认结果
                </Button>
            </div>
        </Modal>
    </div>
</template>

<script>
export default {
  name: 'camera',
  props: {
    object: {
      default: null
    }
  },
  data() {
    return {
      status: {
        workPanel: false,
        step: 'cropper',
        countdown: 0,
        timer: null,
        isOverwritten: false
      },
      config: {
        mode: 'preview',
        format: 'jpeg',
        countdown: 0
      },
      data: {
        object: {}
      },
      camera: {
        videoWidth: 1920,
        videoHeight: 1080,
        videoContainerWidth: 960,
        videoContainerHeight: 540,
        boxWidth: 307,
        boxHeight: 378
      },
      photo: {
        capture: null,
        result: null
      }
    };
  },
  methods: {
    clickTakePhotoBtn() {
      this.clearCamera();
      if (this.object.id === undefined) {
        this.$Message.info('请先在右侧选择/创建拍摄对象');
        return false;
      }
      const {countdown} = this.config;
      this.status.countdown = countdown;
      this.$emit('click-take-photo-btn');
    },
    runCamera() {
      const {mode, countdown} = this.config;
      if (countdown > 0) {
        this.countdownSecond();
      }
      setTimeout(() => {
        this.captureCamera();
        if (mode === 'cropper' || mode === 'preview') {
          this.status.workPanel = true;
        } else if (mode === 'direct') {
          this.confirmResult();
        }
      }, countdown > 0 ? countdown * 1000 : 0);
    },
    captureCamera() {
      const {videoContainerWidth, videoContainerHeight} = this.camera;
      const videoContent = document.getElementById('camera-video');
      const canvasOrigin = document.getElementById('camera-origin-canvas');
      const contextOrigin = canvasOrigin.getContext('2d');
      canvasOrigin.width = videoContainerWidth;
      canvasOrigin.height = videoContainerHeight;
      contextOrigin.drawImage(videoContent, 0, 0, videoContainerWidth, videoContainerHeight);
      this.photo.capture = canvasOrigin.toDataURL(`image/${this.config.format}`);
      if (this.config.mode !== 'cropper') {
        setTimeout(() => {
          this.photo.result = canvasOrigin.toDataURL(`image/${this.config.format}`);
          this.status.step = 'confirm';
        }, 200);
      }
    },
    captureCropper() {
      this.$refs.cropper.getCropData((data) => {
        this.photo.result = data;
      });
      this.status.step = 'confirm';
    },
    confirmResult() {
      let img = new Image();
      img.src = this.photo.result;
      img.onload = () => {
        const result = {
          photo: this.config.mode === 'cropper' ? this.photo.result : this.photo.capture,
          isOverwritten: this.status.isOverwritten,
          width: img.width,
          height: img.height,
          format: this.config.format
        };
        this.$emit('confirm', result);
      };
    },
    clearCamera() {
      this.photo.capture = null;
      this.photo.result = null;
      this.status.step = 'cropper';
      this.status.isOverwritten = false;
      clearInterval(this.status.timer);
    },
    redoCopper() {
      this.photo.result = null;
      this.status.step = 'cropper';
    },
    download(option) {
      let downloadImage = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
      let imageBlob = this.base64ToBlob(option === 'capturePhoto' ? this.photo.capture : this.photo.result);
      downloadImage.href = URL.createObjectURL(imageBlob);
      downloadImage.download = `${Date.now().toString(36)}`;
      let event = document.createEvent('MouseEvents');
      event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      downloadImage.dispatchEvent(event, {bubbles: true, cancelable: true, view: window});
    },
    base64ToBlob(code) {
      let parts = code.split(';base64,');
      let contentType = parts[0].split(':')[1];
      let raw = window.atob(parts[1]);
      let rawLength = raw.length;
      let uInt8Array = new Uint8Array(rawLength);
      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }
      return new Blob([uInt8Array], {type: contentType});
    },
    countdownSecond() {
      this.status.timer = setInterval(() => {
        if (this.status.countdown > 0) {
          this.status.countdown--;
        }
      }, 1000);
    },
    startCamera() {
      if (navigator.getUserMedia) {
        navigator.mediaDevices.getUserMedia({
          video: {
            width: this.camera.videoWidth,
            height: this.camera.videoHeight
          }
        }).then(stream => {
          this.camera.mediaStreamTrack = stream;
          const video = document.getElementById('camera-video');
          video.src = (window.URL || window.webkitURL).createObjectURL(stream);
          video.play();
        }).catch(err => {
          console.log(err);
        });
      } else {
        alert('没有监测到您的相机哟');
      }
    },
    stopCamera() {
      this.camera.mediaStreamTrack.getTracks().forEach(track => {
        track.stop();
      });
    }
  },
  mounted() {
    this.startCamera();
  },
  beforeDestroy() {
    this.stopCamera();
  },
  watch: {
    'status.workPanel'(status) {
      if (status === false) {
        this.clearCamera();
      }
    }
  }
};
</script>
