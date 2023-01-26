<template>
    <BaseInput :icon="true" placeholder="Введите название трэка.." v-model="trackName">
        <SearchIcon/>
    </BaseInput>
</template>

<script setup lang="ts">
import SearchIcon from "./icons/SearchIcon.vue";
import {defineEmits, ref, watch} from "vue";
import BaseInput from "../BaseInput.vue";

const trackName = ref<string>("");

const emits = defineEmits<{
    (e: "update:modelValue", modelValue: string): void;
}>();

watch(trackName, (): void => {
    emits("update:modelValue", trackName.value);
});
</script>
