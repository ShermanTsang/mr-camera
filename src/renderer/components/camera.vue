<style scoped rel="stylesheet/scss" lang="scss">
    .camera-container {
        position: relative;
        margin: 0 auto;
        width: 100%;

        #camera-video {
            display: block;
            margin: 20px auto;
            box-shadow: 0 0 6px $theme-color;
        }

        .camera-overlay {
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 998;
            display: flex;
            flex-flow: nowrap row;
            align-items: center;
            justify-content: center;

            .camera-overlay-frame {
                border: 3px solid rgba(255, 255, 255, .5);
            }
        }

        .camera-tool {
            position: absolute;
            bottom: 45px;
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
                padding: 5px;
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

        .camera-result-image {
            display: block;
            margin: 0 auto;
            box-shadow: 0 0 8px $theme-color;
        }
    }
</style>

<template>
    <div class="camera-container">
        <div class="camera-overlay">
            <div class="camera-overlay-frame"
                 :style="{width:camera.resultWidth + 'px',height:camera.resultHeight + 'px'}"></div>
        </div>
        <video id="camera-video"
               :style="{width:camera.videoContainerWidth + 'px',height:camera.videoContainerHeight + 'px'}">
        </video>
        <div class="camera-tool">
            <div class="camera-tool-item" @click="clickTakePhotoBtn()">
                <Icon type="md-camera" size="40" color="rgba(255,255,255,.8)"/>
            </div>
        </div>
        <slot></slot>
        <Modal title="拍照结果处理" v-model="status.workPanel" class-name="vertical-center-modal"
               :width="camera.videoContainerWidth + 60 + 'px'">
            <div class="camera-result">
                <canvas id="camera-canvas" style="display: none"></canvas>
                <vueCropper
                        ref="cropper"
                        v-if="camera.capturePhoto !== null && status.step === 'cropper'"
                        :img="camera.capturePhoto"
                        :can-move="true"
                        :autoCrop="true"
                        :autoCropWidth="camera.resultWidth"
                        :autoCropHeight="camera.resultHeight"
                        :outputSize="1"
                        :outputType="camera.outputType">
                </vueCropper>
                <img :src="camera.finalPhoto" v-if="camera.finalPhoto !== null && status.step === 'upload'"
                     class="camera-result-image">
            </div>
            <div slot="footer" style="text-align: center">
                <Button v-if="status.step === 'cropper'" type="error" @click="status.workPanel = false" icon="md-trash">
                    重新拍摄
                </Button>
                <Button v-if="status.step === 'upload'" type="warning" icon="md-arrow-round-back" @click="redoCopper()">
                    重新裁剪
                </Button>
                <Button v-if="status.step === 'cropper'" type="info" icon="ios-refresh-circle-outline"
                        @click="rotateCopper()">
                    旋转图像
                </Button>
                <Dropdown @on-click="download">
                    <Button type="success" icon="md-download">导出图片
                        <Icon v-if="status.step === 'upload'" type="ios-arrow-down"></Icon>
                    </Button>
                    <DropdownMenu slot="list">
                        <DropdownItem name="capturePhoto">导出原拍摄图</DropdownItem>
                        <DropdownItem name="finalPhotoPNG" v-if="status.step === 'upload'">导出裁剪图</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Button v-if="status.step === 'cropper'" type="primary" icon="md-resize" @click="confirmCropper()">
                    确认裁剪
                </Button>
                <Button type="primary" icon="md-checkmark" v-if="status.step === 'upload'" @click="resultConfirm">
                    保存结果
                </Button>
            </div>
        </Modal>
    </div>
</template>

<script>
export default {
  name: 'camera',
  props: {
    requireConfirm: {
      default: undefined
    }
  },
  data() {
    return {
      status: {
        workPanel: false,
        step: 'cropper'
      },
      camera: {
        mediaStreamTrack: null,
        capturePhoto: null,
        finalPhoto: null,
        videoWidth: 1920,
        videoHeight: 1080,
        videoContainerWidth: 192 * 4,
        videoContainerHeight: 108 * 4,
        resultWidth: 240,
        resultHeight: 360,
        outputType: 'jpg'
      }
    };
  },
  methods: {
    clickTakePhotoBtn() {
      this.$emit('click-take-photo-btn');
      if (this.requireConfirm === undefined) {
        this.takePhotoTrigger();
      }
    },
    takePhotoTrigger() {
      this.captureCamera();
      this.status.workPanel = true;
    },
    captureCamera() {
      const {videoContainerWidth, videoContainerHeight} = this.camera;
      let video = document.getElementById('camera-video');
      let canvas = document.getElementById('camera-canvas');
      let context = canvas.getContext('2d');
      canvas.width = videoContainerWidth;
      canvas.height = videoContainerHeight;
      context.drawImage(video, 0, 0, videoContainerWidth, videoContainerHeight);
      this.camera.capturePhoto = canvas.toDataURL('image/png');
    },
    clearCamera() {
      this.camera.capturePhoto = null;
      this.camera.finalPhoto = null;
      this.status.step = 'cropper';
    },
    redoCopper() {
      this.camera.finalPhoto = null;
      this.status.step = 'cropper';
    },
    rotateCopper() {
      this.$refs.cropper.rotateRight();
    },
    confirmCropper(fileType) {
      if (fileType === 'blob') {
        this.$refs.cropper.getCropBlob((data) => {
          this.camera.finalPhoto = data;
          this.status.step = 'upload';
        });
      } else {
        this.$refs.cropper.getCropData((data) => {
          this.camera.finalPhoto = data;
          this.status.step = 'upload';
        });
      }
    },
    download(option) {
      let saveLink = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
      saveLink.href = option === 'capturePhoto' ? this.camera.capturePhoto : this.camera.finalPhoto;
      saveLink.download = `${Date.now().toString(36)} - 相机先生`;
      let event = document.createEvent('MouseEvents');
      event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      saveLink.dispatchEvent(event);
    },
    resultConfirm() {
      const photo = this.camera.finalPhoto;
      this.$emit('result-confirm', photo);
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
        alert('没有相机');
      }
    },
    stopCamera() {
      this.camera.mediaStreamTrack.getTracks().forEach(track => {
        track.stop();
      });
    }
  },
  watch: {
    'status.workPanel'(status) {
      if (status === false) {
        this.clearCamera();
      }
    }
  },
  mounted() {
    this.startCamera();
  },
  beforeDestroy() {
    this.stopCamera();
  }
};
</script>
