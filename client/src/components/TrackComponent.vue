<template>
    <div class="track" @click="chooseTrack">
        <div class="track__info">
            <button class="track__play-btn">
                <PlayIcon v-if="!isTrackActive"/>
                <div v-else class="track__pulse"></div>
            </button>
            <div class="track__data">
                <span>{{ track?.author }}</span>
                <span>&nbsp;—&nbsp;</span>
                <span>{{ track?.title }}</span>
            </div>
        </div>
        <div>
            <span class="track__time" v-if="elapsedTrackTime">{{ elapsedTrackTime }}</span>
            <span class="track__time" v-else>{{ trackPlayTime }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref, computed, nextTick} from "vue";
import {useStore} from 'vuex'
import PlayIcon from '../assets/icons/PlayIcon.vue'
import {formatNum} from "../helpers";
import Track from "../dtos/TrackDto";

const store = useStore()
const BASE_URL: string = import.meta.env.VITE_APP_BASE_API_URL

const audioSource: HTMLAudioElement = new Audio();

const props = defineProps({
    track: {
        type: Object as any,
    },
});

const isTrackActive = computed((): boolean => {
    return currentTrack.value?._id === props.track?._id
})

const isTrackPaused = computed((): boolean => store.getters.isTrackPaused)

const elapsedTrackTime = computed((): string | boolean => {
    if (isTrackActive.value) {
        return store.getters.elapsedTrackTime
    }
    return false
})

const currentTrack = computed((): Track | null => store.getters.activeTrack)

const chooseTrack = (): void => {
    if (isTrackActive.value) {
        store.dispatch('setTrackPauseState', !isTrackPaused.value)
        return
    }
    store.dispatch('setActiveTrack', props.track);
}


const trackPlayTime = ref<string>('0')

nextTick((): void => {
    audioSource.addEventListener('loadedmetadata', onMetaDataLoaded)
    audioSource.src = `${BASE_URL}/${props.track.src}`
})

const onMetaDataLoaded = (event: any): void => {
    const duration: number = event.target.duration;

    let durationMinutes: number = Math.floor(duration / 60);
    let durationSeconds: number = Math.floor(duration - durationMinutes * 60);

    trackPlayTime.value = `${formatNum(durationMinutes)}:${formatNum(durationSeconds)}`;
    audioSource.removeEventListener('loadedmetadata', onMetaDataLoaded);
}

</script>

<style lang="scss" scoped>
.track {
    width: 100%;
    display: flex;
    padding: 0.25rem 1rem;
    justify-content: space-between;
    align-items: center;
    color: var(--color-text-base);
    cursor: pointer;
    border-radius: var(--radius-sm);

    &:hover {
        opacity: 0.5;
        background-color: var(--color-input);
    }

    &__info {
        display: flex;
        align-items: center;
    }

    &__data {
        @media screen and (max-width: 640px) {
            display: flex;
            flex-direction: column;
            span:first-child {
                font-weight: 700;
            }
            span:nth-child(2) {
                display: none;
            }
        }
    }

    &__play-btn {
        height: 30px;
        width: 30px;
        background: transparent;
        border: none;
        cursor: pointer;
        margin-right: 1rem;

        svg {
            fill: var(--coffee)
        }
    }

    &__pulse {
        animation: pulse 2s infinite;
        width: 25px;
        height: 25px;
        background-color: var(--coffee);
        border-radius: var(--radius-full);
    }

    &__track-time {
        color: var(--color-text-secondary);
    }
}

@keyframes pulse {
    0% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(255, 121, 63, 0.7);
    }

    70% {
        transform: scale(1);
        box-shadow: 0 0 0 10px rgba(255, 121, 63, 0);
    }

    100% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(255, 121, 63, 0);
    }
}
</style>
