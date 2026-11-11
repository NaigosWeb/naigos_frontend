<script setup lang="ts">
import PCActionRowComp from "@/components/PixelConfusion/PCActionRowComp.vue";
import PCParamsCardComp from "@/components/PixelConfusion/PCParamsCardComp.vue";
import PCPreviewStageComp from "@/components/PixelConfusion/PCPreviewStageComp.vue";
import PCSourceCardComp from "@/components/PixelConfusion/PCSourceCardComp.vue";
</script>

<template>
  <div class="pc_workspace">
    <aside class="pc_rail">
      <PCSourceCardComp/>
      <PCParamsCardComp/>
      <div class="pc_rail_spacer"/>
      <PCActionRowComp/>
    </aside>
    <PCPreviewStageComp/>
  </div>
</template>

<style scoped lang="sass">
.pc_workspace
  display: grid
  grid-template-columns: 336px minmax(0, 1fr)
  gap: 16px
  align-items: stretch
.pc_rail
  min-width: 0
  display: flex
  flex-direction: column
  gap: 12px
.pc_rail_spacer
  flex: 1
  min-height: 0
@media (max-width: 1080px)
  .pc_workspace
    grid-template-columns: minmax(0, 1fr)
  .pc_rail
    gap: 12px
  .pc_rail_spacer
    display: none
</style>
