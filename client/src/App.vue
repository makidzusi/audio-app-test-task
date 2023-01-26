<template>
    <div class="container">
        <CurrentTrackComponent @prev-track="handlePrevTrack" @next-track="handleTrackEnd"/>
        <div class="container__inner">
            <NavBar class="container__nav"/>
            <div class="container__search">
                <SearchInput class="container__search-input" v-model="trackName"/>
                <BaseButton @click="isShowModal = true" class="container__button">Add track</BaseButton>
            </div>
            <TrackList class="container__list" :track-list="filteredTrackList"/>
        </div>
        <AddModal @success="getTracks" @close="isShowModal = false" v-if="isShowModal"/>
    </div>
</template>

<script setup lang="ts">
import SearchInput from "./components/SearchInput/index.vue";
import CurrentTrackComponent from "./components/CurrentTrackComponent.vue";
import TrackList from "./components/TrackList.vue";
import {computed, ref} from 'vue'
import Track from "./dtos/TrackDto";
import {useStore} from "vuex";
import NavBar from "./components/NavBar.vue";
import AddModal from "./components/AddModal.vue";
import BaseButton from "./components/BaseButton/BaseButton";

const store = useStore()
const trackList = ref<Track[]>([]);
const trackName = ref<string>('')
const isShowModal = ref<boolean>(false)


const filteredTrackList = computed((): Track[] => {
    return trackList.value.filter(track => {
        return track.title.includes(trackName.value)
    })
})

const getTracks = (): void => {
    isShowModal.value = false;
    store.dispatch('getTracks').then((res: Track[]) => {
        trackList.value = res
    }).catch((err: Error) => {
        console.log(err.message)
    })
}

getTracks()

const handlePrevTrack = (track: Track): void => {
    const currentTrackIndex: number = trackList.value.findIndex(el => el._id === track._id)
    if (currentTrackIndex > 0) {
        store.dispatch('setActiveTrack', trackList.value[currentTrackIndex - 1])
        return
    }
    store.dispatch('setActiveTrack', trackList.value[0])
}

const handleTrackEnd = (track: Track) => {
    const trackListLength: number = trackList.value.length - 1
    const currentTrackIndex: number = trackList.value.findIndex(el => el._id === track._id)
    if (currentTrackIndex < trackListLength) {
        store.dispatch('setActiveTrack', trackList.value[currentTrackIndex + 1])
        return
    }
    store.dispatch('setActiveTrack', trackList.value[0])
}

</script>

<style scoped lang="scss">
.container {
    background-color: var(--color-bg);
    min-height: 100vh;

    &__list {
        margin-top: 2rem;
    }

    &__inner {
        padding: 0 1rem 1rem 1rem;
        background-color: var(--color-bg);
        margin-bottom: 80px;
    }

    &__button {
        margin-left: 1rem;
    }

    &__search-input {
        flex-grow: 1;
    }

    &__search {
        display: flex;
    }

    &__nav {
        margin-bottom: 1rem;
    }
}
</style>

<style lang="scss">
@import './assets/themes.scss';

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: Roboto, sans-serif;
    transition: color 0.3s, background-color 0.3s, backgound 0.3s;
}
</style>
