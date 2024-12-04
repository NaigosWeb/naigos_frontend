<script setup lang="ts">
import '@wangeditor/editor/dist/css/style.css'
import {Editor, Toolbar} from "@wangeditor/editor-for-vue";
import {onBeforeUnmount, onMounted, ref, shallowRef, watch} from "vue";

const editorRef = shallowRef()
const valueHtml = ref('<p>hello</p>')

const toolbarConfig = {}
const editorConfig = { placeholder: '请输入内容...' }

onMounted(() => {
  setTimeout(() => {
    valueHtml.value = '<h1>模拟 Ajax 异步设置内容</h1>'
  }, 1500)
})

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}
watch(() => valueHtml.value, (newVal) => {
  console.log(newVal);
})
</script>

<template>
  <div style="border: 1px solid #ccc; width: 1000px;">
    <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
    />
    <Editor
        style="height: 500px; overflow-y: hidden;"
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="handleCreated"
    />
  </div>
</template>

<style scoped lang="sass">

</style>