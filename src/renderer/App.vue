<style lang="scss">
    html, body {
        height: 100%;
        background-color: transparent !important;
        overflow: hidden;
        -webkit-user-select: none;

        .layout {
            height: 100%;

            &-view {
                margin-top: 40px;
                height: 100%;
            }

            .scrollable {
                &:hover {
                    &::-webkit-scrollbar {
                        width: 4px !important;
                    }
                }
            }

            ::-webkit-scrollbar {
                width: 0;
            }

            ::-webkit-scrollbar:horizontal {
                height: 0;
            }

            ::-webkit-scrollbar-track {
                background-color: #efefef;
            }

            ::-webkit-scrollbar-thumb {
                border-radius: 2px;
                opacity: .35;
                background-color: #ccc;
            }
        }
    }
</style>

<template>
    <div class="layout">
        <header-bar v-if="route.name !== 'index'"></header-bar>
        <router-view :class="{'layout-view':route.name !== 'index'}"></router-view>
    </div>
</template>

<script>
export default {
  data() {
    return {
      route: {},
      config: {
        innerHeight: 0,
        innerWidth: 0
      }
    };
  },
  mounted() {
    this.route = this.$route;
    this.$Message.config({
      top: 50,
      duration: 3
    });
    this.config.innerWidth = window.innerWidth;
    this.config.innerHeight = window.innerHeight;
  },
  updated() {
    this.route = this.$route;
  }
};
</script>
