<style scoped rel="stylesheet/scss" lang="scss">
    .action-button-item {

            position: relative;
            cursor: pointer;
            font-size: .9rem;
            letter-spacing: 1px;
            border-top: 2px solid #efefef;
            border-bottom: 2px solid #efefef;
            border-left: 1px solid #efefef;
            padding: 4px 10px;
            transition: all .1S ease-in-out;
            text-align: center;
            color: #666;

            &:last-child {
                border-right: 1px solid #efefef;
            }

            &-title {
                border-top: 1px solid #efefef;
                margin-top: 10px;
                padding-top: 10px;
            }

            &-count {
                position: absolute;
                top: -10px;
                right: -10px;
                width: 30px;
                height: 20px;
                border-radius: 2px;
                background-color: red;
                color: #ffffff;
                padding: 0 5px;
                text-align: center;
                line-height: 20px;
                overflow: hidden;
                font-size: .9rem;
            }

            &:hover {
                box-shadow: inset 0 0 12px rgba(0, 0, 0, 0.2);
            }
    }
</style>

<template>
    <div class="action-button-item" @click="click">
        <slot></slot>
    </div>
</template>

<script>
export default {
  name: 'action-button-item',
  methods: {
    click() {
      this.$emit('click')
    }
  }
}
</script>
