<template>
    <div class="track__container">
        <div
            @mousemove="handleMouseMove"
            ref="trackLine"
            @mouseleave="isShowPopup = false"
            @mousedown="handleDrag"
            @mouseup="handleMouseUp"
            @click.stop="handleClick"
            class="track"
        >
            <div class="track__popup" v-if="isShowPopup">
                {{ trackTimeMark }}
            </div>
            <div class="track__line"></div>
        </div>

        <audio ref="audioSource" :src="formatSrc(currentTrack?.src)"/>

        <div class="track__footer">
            <div class="track__controls">
                <button class="track__control" @click="prevTrack">
                    <TrackSkip/>
                </button>
                <button class="track__control" @click="togglePlayback">
                    <PauseIcon v-if="trackPauseState"/>
                    <PlayIcon v-else/>
                </button>
                <button class="track__control track__control--next" @click="skipTrack">
                    <TrackSkip/>
                </button>
            </div>
            <div class="track__left">
                <div class="track__info">
                    <span class="track__author">{{ currentTrack?.author }}</span>
                    <span class="track__title">{{ currentTrack?.title }}</span>
                </div>
                <div>
                    <div class="track__volume-container" v-click-outside="handleClickOutside">
                        <button class="track__volume-btn" @click="isShowVolumeControl = !isShowVolumeControl">
                            <VolumeIcon/>
                        </button>
                        <VolumeControl class="track__volume" v-model="trackVolume"/>
                    </div>
                    <div class="track__time">
                        {{ currentTime }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {computed, defineEmits, onMounted, onUnmounted, ref, watch} from "vue";
import TrackSkip from "../assets/icons/TrackSkip.vue";
import PlayIcon from "../assets/icons/PlayIcon.vue";
import PauseIcon from "../assets/icons/PauseIcon.vue";
import {formatNum} from "../helpers";
import {useStore} from "vuex";
import VolumeControl from "./VolumeControl.vue";
import VolumeIcon from "../assets/icons/VolumeIcon.vue";
import Track from "../dtos/TrackDto";


const audioSource = ref<HTMLAudioElement | any>();
const isPlaying = ref<boolean>(false);
const trackTicker = ref<any>();
const trackWidth = ref<string>("0%");
const isShowPopup = ref<boolean>(false);
const trackLine = ref<HTMLElement | any>();
const isTracking = ref<boolean>(false);
const trackVolume = ref<number>(1);
const trackTimeMark = ref<string>("");
const store = useStore();
const isShowVolumeControl = ref<boolean>(false);
const currentTime = ref<string>("");
const popupX = ref<string>("0");
const BASE_URL: string = import.meta.env.VITE_APP_BASE_API_URL

const emits = defineEmits<{
    (e: "nextTrack", modelValue: Track | any): void;
    (e: "prevTrack", modelValue: Track | any): void;
}>();


const volumeControlVisibility = computed((): string => isShowVolumeControl.value ? 'flex' : 'none')
const currentTrack = computed((): any => store.getters.activeTrack);
const trackPauseState = computed((): boolean => store.getters.isTrackPaused);

onMounted((): void => {
    document.addEventListener("keydown", toggleOnSpace);
});
onUnmounted((): void => {
    document.removeEventListener("keydown", toggleOnSpace);
});

const formatSrc = (src: string): string => {
    return `${BASE_URL}/${src}`
}
const calcDesiredPlayTime = (offset: number): any => {
    const track: HTMLAudioElement = audioSource.value;
    const duration: number = track.duration
    const elWidth: number = trackLine.value.clientWidth;
    const percents: number = (offset / elWidth) * 100;
    const desiredPlayTime: number = (duration / 100) * percents;
    return {
        desiredPlayTime,
        percents
    }
}

const calcTimeValues = (): any => {
    const track: HTMLAudioElement = audioSource?.value
    let currentMinutes: number = Math.floor(track.currentTime / 60);
    let currentSeconds: number = Math.floor(track.currentTime - currentMinutes * 60);
    let durationMinutes: number = Math.floor(track.duration / 60);
    let durationSeconds: number = Math.floor(track.duration - durationMinutes * 60);
    return {
        currentSeconds: formatNum(currentSeconds),
        currentMinutes: formatNum(currentMinutes),
        durationMinutes: formatNum(durationMinutes),
        durationSeconds: formatNum(durationSeconds)
    }
}
watch(trackPauseState, () => {
    if (trackPauseState.value) {
        audioSource.value?.play();
    } else {
        audioSource.value?.pause();
    }
})

watch(trackVolume, () => {
    const track: HTMLAudioElement = audioSource.value;
    track.volume = trackVolume.value;
});

watch(currentTrack, (): void => {
    audioSource.value?.addEventListener("loadeddata", () => {
        const track: HTMLAudioElement = audioSource?.value
        track.pause();
        clearInterval(trackTicker.value);
        isPlaying.value = true;
        store.dispatch('setTrackPauseState', isPlaying.value)
        trackTicker.value = setInterval(updateState);
        track.play()
        track.addEventListener("ended", skipTrack);
    });
});

const skipTrack = (): void => {
    if (!audioSource.value.duration)
        return
    emits("nextTrack", currentTrack.value);
    audioSource?.value?.removeEventListener("ended", skipTrack);
};

const prevTrack = () => {
    if (!audioSource.value.duration)
        return
    emits("prevTrack", currentTrack.value);
    audioSource?.value?.removeEventListener("ended", skipTrack);
};


const slider = (evt: MouseEvent) => {
    let x: number = evt.pageX;
    const offset: number = x - trackLine.value.offsetLeft;
    const {percents} = calcDesiredPlayTime(offset);
    trackWidth.value = `${percents}%`;
};


const toggleOnSpace = (evt: KeyboardEvent) => {
    if (evt.code === "Space" && currentTrack.value) {
        togglePlayback();
    }
};


const handleMouseMove = (event: MouseEvent): void => {
    const track = audioSource.value;
    const duration = track?.duration;
    if (!duration) {
        return
    }
    const offsetX = event.offsetX;
    popupX.value = `${offsetX - 10}px`;
    const {desiredPlayTime} = calcDesiredPlayTime(offsetX)
    let currentMinutes = Math.floor(desiredPlayTime / 60);
    let currentSeconds = Math.floor(desiredPlayTime - currentMinutes * 60);
    trackTimeMark.value = `${formatNum(currentMinutes)}:${formatNum(
        currentSeconds
    )}`;
    isShowPopup.value = true;
};


const handleMouseUp = (evt: MouseEvent) => {
    const x = evt.pageX;
    const track = audioSource.value;
    const offset = x - trackLine.value.offsetLeft;
    const {desiredPlayTime} = calcDesiredPlayTime(offset)
    isTracking.value = false;
    track.currentTime = desiredPlayTime;
    document.removeEventListener("mousemove", slider);
    document.removeEventListener("mouseup", handleMouseUp);
};


const handleDrag = (event: MouseEvent): void => {
    const track = audioSource.value;
    const duration = track?.duration;
    if (!duration) return

    const offsetX = event.offsetX;
    const {percents, desiredPlayTime} = calcDesiredPlayTime(offsetX)

    trackWidth.value = `${percents}%`;
    isTracking.value = true;

    document.addEventListener("mousemove", slider);
    document.addEventListener("mouseup", handleMouseUp);

    track.currentTime = desiredPlayTime;
};

const handleClick = (event: MouseEvent): void => {
    const track = audioSource.value;
    const duration = audioSource.value?.duration;
    if (!duration) return

    const offsetX = event.offsetX;
    const {percents, desiredPlayTime} = calcDesiredPlayTime(offsetX)

    trackWidth.value = `${percents}%`;
    isShowPopup.value = false;
    track.currentTime = desiredPlayTime;
};

const handleClickOutside = (): void => {
    isShowVolumeControl.value = false;
}


const togglePlayback = (): void => {
    if (!audioSource.value.duration)
        return
    switch (isPlaying.value) {
        case true:
            audioSource.value?.pause();
            clearInterval(trackTicker.value);
            break;
        case false:
            audioSource.value?.play();
            trackTicker.value = setInterval(updateState);
            break;
    }

    isPlaying.value = !isPlaying.value;
    store.dispatch('setTrackPauseState', isPlaying.value)
};

const updateState = (): void => {
    const track = audioSource.value;
    if (track) {
        if (!isTracking.value) {
            const duration = track?.duration;
            const curTime = track?.currentTime;
            const percents = (curTime / duration) * 100;
            trackWidth.value = `${percents}%`;
        }
        const {currentMinutes, currentSeconds, durationMinutes, durationSeconds} = calcTimeValues()
        currentTime.value = `${currentMinutes}:${currentSeconds} / ${durationMinutes}:${durationSeconds}`;
        store.dispatch("setTrackElapsesTime", currentTime.value);
    }
};
</script>

<style lang="scss" scoped>
.track {
    display: flex;
    width: 100%;
    height: 12px;
    background: grey;
    transition: all 0.3s;
    cursor: pointer;
    user-select: none;

    &__container {
        position: fixed;
        bottom: 0;
        width: 100%;
        z-index: 9999;
    }

    &__left {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        @media screen and (max-width: 640px) {
            width: auto;
        }
    }

    &__info {
        display: flex;
        flex-direction: column;
        @media screen and (max-width: 640px) {
            margin-right: 1rem;
        }
    }

    &__time {
        color: var(--color-text-base);
        @media screen and (max-width: 640px) {
            display: none;
        }
    }

    &__author {
        font-size: 14px;
        font-weight: 700;
        color: var(--color-text-base);
    }

    &__title {
        color: var(--color-text-secondary);
    }

    &__footer {
        display: flex;
        padding: 1.2rem;
        align-items: center;
        background-color: var(--color-card);
        @media screen and (max-width: 640px) {
            justify-content: space-between;
        }
    }

    &__line {
        height: 100%;
        width: v-bind(trackWidth);
        background-color: var(--coffee);
        position: relative;
    }

    &__controls {
        display: flex;
        margin-right: 1rem;
    }

    &__control {
        width: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        border: none;
        height: 40px;
        cursor: pointer;

        svg {
            fill: var(--coffee);
        }

        &:not(:last-child) {
            margin-right: 1rem;
        }
    }

    &__control--next {
        transform: rotate(180deg);
    }

    &__volume {
        margin-bottom: 0.25rem;
        @media screen and (max-width: 640px) {
            display: v-bind(volumeControlVisibility);
            height: 150px;
            position: absolute;
            top: -150px;
            right: -50px;
            @-moz-document url-prefix() {
                right: -65px;
                top: -165px;
            }
            transform: rotate(90deg);
        }
    }

    &__volume-btn {
        display: none;
        background: transparent;
        height: 25px;
        width: 25px;
        border: none;

        svg {
            fill: var(--coffee);
        }

        @media screen and (max-width: 640px) {
            display: block;
        }
    }

    &__volume-container {
        z-index: 999;
        position: relative;
    }

    &__popup {
        position: absolute;
        top: -45px;
        left: v-bind(popupX);
        background-color: var(--coffee);
        color: var(--color-text-base);
        border-radius: var(--radius-sm);
        padding: 10px;
    }
}
</style>
