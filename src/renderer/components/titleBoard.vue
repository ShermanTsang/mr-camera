<style scoped lang="scss">
    .title-board-container {
        cursor: default;
        position: relative;
        margin: 10px 20px;
        display: flex;
        flex-flow: nowrap row;
        align-items: center;
        justify-content: space-between;
        .title-board-left {
            font-size: 1.4rem;
            color: $theme-color;
            letter-spacing: 2px;
            padding-bottom: 5px;
        }
        .title-board-right {
            font-size:1rem;
        }
    }
</style>

<template>
    <div class="title-board-container">
        <div class="title-board-left" :class="{'title-board-center':center !== undefined}">
            # <slot></slot>
        </div>
        <div class="title-board-right">
            <slot name="right"></slot>
        </div>
    </div>
</template>

<script>
export default {
  name: 'title-board',
  props: {
    center: {
      default: undefined
    }
  },
  data() {
    return {
    };
  },
  methods: {
  },
  mounted() {
  }
};
</script>
