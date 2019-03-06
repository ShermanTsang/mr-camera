<style lang="scss">
    html, body {
        height: 100%;
        background-color: transparent !important;
        overflow: hidden;
        -webkit-user-select: none;

        .layout {
            height: 100%;

            &-view {
                margin-top: 50px;
                height: 100%;
            }

            ::-webkit-scrollbar {
                width: 6px;

                &:horizontal {
                    height: 0;
                }

                &-track {
                    background-color: transparent;
                }

                &-thumb {
                    border-radius: 20px;
                    opacity: .35;
                    background-color: transparent;
                }
            }

            .scrollable {
                &:hover {
                    &::-webkit-scrollbar-thumb {
                        border: 1px solid rgba(0, 0, 0, .1);
                        background-color: rgba(177, 177, 177, .5);
                    }
                }
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
      top: 100,
      duration: 3
    });
    this.config.innerWidth = window.innerWidth;
    this.config.innerHeight = window.innerHeight;
    console.clear();
  },
  updated() {
    this.route = this.$route;
  }
};
</script>
