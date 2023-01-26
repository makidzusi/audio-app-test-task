export default {
    mounted(el: any, binding: any) {

        const clickOutside = ({target}: any) => {
            if (!(el == target || el.contains(target))) {
                binding.value()
            }
        }

        document.addEventListener('click', clickOutside)
        binding.onClickOutside = clickOutside
    },
    unmounted(el: HTMLElement, binding: any) {
        document.removeEventListener('click', binding.onClickOutside)
    }
}


