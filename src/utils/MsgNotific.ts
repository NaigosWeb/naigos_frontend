import {ElMessage} from "element-plus";
import {h} from "vue";

export const showMessageNotice = (color: string, text: string) => {
    ElMessage({
        message: h('p', {style: 'line-height: 1; font-size: 14px'}, [
            h('span', {style: `color: ${color}`}, text)
        ])
    });
}
export const showExceptionNotice = () => {
    ElMessage({
        message: h('p', {style: 'line-height: 1; font-size: 14px'}, [
            h('span', {style: 'color: red'}, '未知异常或网络异常！')
        ])
    })
}