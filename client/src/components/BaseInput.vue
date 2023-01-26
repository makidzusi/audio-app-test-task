<template>
    <div class="input">
        <input v-model="inputText" :placeholder="props.placeholder" class="input__input">
        <div class="input__icon" v-if="props.icon">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import {defineProps, defineEmits, ref, watch} from "vue";

const inputText = ref<string>('')

const props = defineProps({
    placeholder: {
        type: String,
        required: false
    },
    icon: {
        type: Boolean,
        default: false
    }
})

const emits = defineEmits<{
    (e: "update:modelValue", modelValue: string): void;
}>();

watch(inputText, (): void => {
    emits('update:modelValue', inputText.value)
})

</script>

<style scoped lang="scss">
.input {
    display: flex;
    position: relative;
    align-items: center;
    border: 1px solid rgb(101 108 111 / 30%);
    border-radius: var(--radius-sm);
    background-color: var(--color-input);
    box-shadow: 4px 4px 24px rgb(101 108 111 / 30%);

    &__input {
        border: none;
        width: 100%;
        color: var(--color-text-base);
        background: transparent;
        padding: 10px 50px 10px 10px;

        &::placeholder {
            color: var(--color-text-secondary);
        }

        &:focus {
            border: none;
            outline: none;
        }
    }

    &__icon {
        cursor: pointer;
        background: transparent;
        border: none;
        position: absolute;
        right: 5px;

        :deep(svg) {
            fill: var(--color-text-base);
        }
    }
}
</style>
