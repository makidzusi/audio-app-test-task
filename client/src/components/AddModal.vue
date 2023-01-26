<template>
    <div class="modal" @click="handleClose">
        <div class="modal__content" @click.stop>
            <h2 class="modal__title">Add track</h2>
            <form @submit.prevent="handleSubmit" class="modal__form">
                <label class="modal__item">
                    <span class="modal__item-title">Author</span>
                    <BaseInput placeholder="Author" v-model="data.author"/>
                </label>
                <label class="modal__item">
                    <span class="modal__item-title">Title</span>
                    <BaseInput placeholder="Title" v-model="data.title"/>
                </label>
                <label class="modal__item">
                    <span class="modal__item-title">File</span>
                    <BaseButton node-type="div" class="modal__btn">
                        Upload
                    </BaseButton>
                    <input id="file" class="modal__input-file" accept=".mp3" @change="handleFile" type="file">
                </label>
                <span class="modal__filename" v-if="data.file">{{ data?.file?.name }}</span>
                <BaseButton type="submit">Save</BaseButton>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref, defineEmits} from 'vue'
import store from "../store";
import BaseInput from "./BaseInput.vue";
import BaseButton from "./BaseButton/BaseButton";

const data = ref<{
    file: File | null,
    author: string,
    title: string,
}>({
    file: null,
    author: '',
    title: '',
})

const emits = defineEmits<{
    (e: 'close'): void,
    (e: 'success'): void
}>()

const handleClose = () => {
    emits('close')
}

const handleFile = (evt: Event) => {
    const target = evt.currentTarget as HTMLInputElement
    if (target?.files) {
        data.value.file = target?.files[0]
    }
}

const handleSubmit = () => {
    const fd: FormData = new FormData()
    for (let [key, value] of Object.entries(data.value)) {
        if (!value) {
            return
        }
        fd.append(key, value)
    }
    store.dispatch('saveTrack', fd).then(() => {
        emits('success')
    }).catch(() => {
        emits('close')
    })
}
</script>

<style scoped lang="scss">
.modal {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(12, 15, 19, 0.6);

    &__item-title {
        margin-bottom: 0.25rem;
        display: block;
        color: var(--color-text-base)
    }

    &__title {
        color: var(--color-text-base);
        margin-bottom: 1rem;
    }

    &__filename {
        margin-top: 0.25rem;
        margin-bottom: 1rem;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        color: var(--color-text-secondary);
    }

    &__input-file {
        display: none;
    }

    &__content {
        border-radius: var(--radius-md);
        padding: 1rem;
        background-color: var(--color-card);
        width: 500px;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 500px;
    }

    &__btn {
        padding: 0.5rem;
    }

    &__item {
        display: flex;
        flex-direction: column;

        &:not(:last-child) {
            margin-bottom: 1rem;
        }
    }


    &__form {
        display: flex;
        flex-direction: column;
    }
}
</style>
