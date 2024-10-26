import {ElMessage} from "element-plus";
import {h} from "vue";

export const showMessageNotific = (color: string, text: string) => {
    ElMessage({
        message: h('p', {style: 'line-height: 1; font-size: 14px'}, [
            h('span', {style: `color: ${color}`}, text)
        ])
    });
}