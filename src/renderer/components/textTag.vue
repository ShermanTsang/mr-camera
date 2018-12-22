<style scoped rel="stylesheet/scss" lang="scss">
    .tag-container {
        display: inline-block;
        color: #666;
        font-size: .9rem;
        letter-spacing: 1px;
        padding: 2px 6px;
        border-radius: 2px;
        transition: all 100ms ease-in-out;
        cursor: pointer;
        &:hover {
            border-color: #ffffff;
            background-color: $theme-color;
            color: #ffffff;
        }
    }
</style>

<template>
    <div class="tag-container" @click="click">
        <Icon :type="icon" size="20"></Icon> <slot></slot>
    </div>
</template>

<script>
export default {
  name: 'textTag',
  props: {
    icon: {
      default: ''
    }
  },
  data() {
    return {};
  },
  methods: {
    click() {
      this.$emit('click');
    }
  },
  mounted() {
  }
};
</script>
