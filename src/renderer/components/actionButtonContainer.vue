<style scoped rel="stylesheet/scss" lang="scss">
    .action-button-container {
        display: flex;
        flex-flow: nowrap row;
        justify-content: space-around;
        align-items: center;
    }
</style>

<template>
    <div class="action-button-container">
        <slot></slot>
    </div>
</template>

<script>
export default {
  name: 'action-button-container'
};
</script>
