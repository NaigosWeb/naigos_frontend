<script setup lang="ts">
import PCActionRowComp from "@/components/PixelConfusion/PCActionRowComp.vue";
import PCIterationCardComp from "@/components/PixelConfusion/PCIterationCardComp.vue";
import PCParamsCardComp from "@/components/PixelConfusion/PCParamsCardComp.vue";
import PCPreviewStageComp from "@/components/PixelConfusion/PCPreviewStageComp.vue";
import PCSourceCardComp from "@/components/PixelConfusion/PCSourceCardComp.vue";
</script>

<template>
  <div class="pc_workspace">
    <PCSourceCardComp/>
    <div class="pc_workspace_body">
      <aside class="pc_rail">
        <PCIterationCardComp/>
        <PCParamsCardComp/>
        <div class="pc_rail_spacer"/>
        <PCActionRowComp/>
      </aside>
      <PCPreviewStageComp/>
    </div>
  </div>
</template>

<style scoped lang="sass">
.pc_workspace
  display: flex
  flex-direction: column
  gap: 12px
  min-height: 0
.pc_workspace_body
  flex: 1
  min-height: 0
  display: grid
  grid-template-columns: 336px minmax(0, 1fr)
  gap: 16px
  align-items: stretch
.pc_rail
  min-width: 0
  min-height: 0
  display: flex
  flex-direction: column
  gap: 12px
.pc_rail_spacer
  flex: 1
  min-height: 0
@media (min-width: 1081px)
  // The desktop window keeps the stage at a fixed height and scrolls the
  // result grids inside it; the web page mirrors that on wide screens.
  .pc_workspace
    height: min(1180px, max(720px, calc(100vh - 107px)))
@media (max-width: 1080px)
  .pc_workspace
    height: auto
  .pc_workspace_body
    grid-template-columns: minmax(0, 1fr)
  .pc_rail
    gap: 12px
  .pc_rail_spacer
    display: none
</style>
