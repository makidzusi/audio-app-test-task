<template>
    <div class="navbar">
        <h1 class="navbar__title">My best audioplayer</h1>
        <ThemeSwitcher/>
    </div>
</template>

<script setup lang="ts">
import ThemeSwitcher from './ThemeSwitcher.vue';
</script>

<style scoped lang="scss">
.navbar {
    display: flex;
    justify-content: space-between;
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
    background-color: var(--color-card);
    align-items: center;
    padding: 1rem;

    &__title {
        color: var(--color-text-base)
    }
}
</style>
