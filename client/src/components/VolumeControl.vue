<template>
    <div class="track__volume-wrapper">
        <input
            class="track__volume"
            v-model="trackVolume"
            :step="STEP"
            max="1"
            type="range"
            @wheel.stop.prevent="handleScroll"
        />
        <div class="track__volume-line"></div>
        <div class="track__volume-line track__volume-progress"></div>
    </div>
</template>

<script setup lang="ts">
import {computed, ref, defineEmits, watch} from 'vue'

const STEP: number = 0.05;
const trackVolume = ref<number>(1)
const emits = defineEmits<{
    (e: 'update:modelValue', modelValue: number): void
}>()

watch(trackVolume, () => {
    emits('update:modelValue', trackVolume.value)
})


const handleScroll = (evt: WheelEvent) => {
    if (evt.deltaY === 100) {
        if (trackVolume.value - STEP >= 0)
            trackVolume.value -= 0.05;
    } else if (trackVolume.value + STEP <= 1) {
        trackVolume.value += 0.05
    }
}

const trackVolumeInPercents = computed((): string => {
    return `${trackVolume.value * 100}%`
})

</script>

<style lang="scss">
.track {
    &__volume-wrapper {
        position: relative;
        display: flex;
        align-items: center;
    }


    &__volume {
        user-select: none;
        cursor: pointer;
        appearance: none;
        background: transparent;
        z-index: 10;

        &::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 18px;
            height: 18px;
            border-radius: var(--radius-sm);
            background-color: var(--coffee);
            overflow: visible;
            cursor: pointer;
        }

        ::-moz-range-thumb {
            -moz-appearance: none;
            width: 18px;
            height: 18px;
            border-radius: var(--radius-sm);
            background-color: var(--coffee);
            overflow: visible;
            outline: none;
            border: none;
            cursor: pointer;
        }
    }

    &__volume-line {
        position: absolute;
        width: 100%;
        background: grey;
        height: 2px;
        border-radius: var(--radius-sm);
        z-index: 0;
    }

    &__volume-progress {
        width: v-bind(trackVolumeInPercents);
        background: var(--coffee);
        z-index: 5;
    }
}
</style>
