<template>
    <div class="track-list">
        <template v-if="trackList?.length">
            <template v-for="(track, idx) in props.trackList" :key="`track-${idx}`">
                <TrackComponent class="track-list__item" :track="track"/>
            </template>
        </template>
        <h2 class="track-list__notracks" v-else>Трэков нет...</h2>
    </div>
</template>

<script setup lang="ts">
import {defineProps} from "vue";
import TrackComponent from "./TrackComponent.vue";
import Track from '../dtos/TrackDto'

const props = defineProps({
    trackList: {
        type: Array<Track>
    },
});
</script>

<style scoped lang="scss">
.track-list {
    padding: 1rem;
    border-radius: var(--radius-sm);
    box-shadow: 4px 4px 24px rgb(101 108 111 / 30%);
    background-color: var(--color-card);

    &__item {
        &:not(:last-child) {
            margin-bottom: 0.3rem;
        }
    }
    &__notracks {
        color: var(--color-text-base);
    }
}
</style>
