<template>
    <div>
        <label id="switch" class="switch">
            <input
                :checked="isLightTheme"
                @change="handleThemeChange"
                type="checkbox"
            />
            <span class="switch__slider switch__round"></span>
        </label>
    </div>
</template>

<script setup lang="ts">
import {ref} from "vue";

enum Themes {
    light = 'light',
    dark = 'dark'
}

const theme: string | null = localStorage.getItem("theme");
const body: HTMLBodyElement = document.body as HTMLBodyElement;

const isLightTheme = ref<boolean>(false);

const handleThemeChange = (): void => {
    if (body.classList.contains(Themes.dark)) {
        body.classList.replace(Themes.dark, Themes.light);
        localStorage.setItem("theme", Themes.light);
    } else {
        body.classList.replace(Themes.light, Themes.dark);
        localStorage.setItem("theme", Themes.dark);
    }
};

if (theme) {
    if (!body.classList.contains(theme)) {
        body.classList.replace(Themes.dark, theme);
    }
    if (theme === Themes.light) {
        isLightTheme.value = true;
    }
}
</script>

<style lang="scss" scoped>
.switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;

    input {
        opacity: 0;
        width: 0;
        height: 0;

        &:checked + .switch__slider {
            background-color: #2196f3;

            &:before {
                transform: translateX(24px);
                background: white url("../assets/sunny.png");
                background-repeat: no-repeat;
                background-position: center;
            }
        }
    }

    &__slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: 0.4s;
        border-radius: 34px;

        &:before {
            position: absolute;
            content: "";
            height: 40px;
            width: 40px;
            left: 0;
            top: 0;
            bottom: 0;
            margin: auto 0;
            transition: 0.4s;
            box-shadow: 0 0px 15px #2020203d;
            background: white url("../assets/night.png");
            background-repeat: no-repeat;
            background-position: center;
        }
    }

    &__round {
        border-radius: 34px;

        &:before {
            border-radius: var(--radius-full);
        }
    }
}

</style>
