import {h} from "vue";
import './button.scss'

export default {
    props: {
        nodeType: {
            type: String,
            default: 'button'
        }
    },
    setup(props: any, {slots}: any) {
        return () => h(props.nodeType, {class: 'button'}, slots.default())
    }
}



