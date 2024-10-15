<script setup lang="ts">

</script>

<template>
  <div class="message_board">
    <h3>留言板</h3>
    <hr class="hr"/>
  </div>
</template>

<style scoped lang="sass">
.message_board:hover
  background-color: #ffffff95
.message_board
  overflow: auto
  min-height: 300px
  max-height: 300px
  width: 47%
  background-color: #ffffff70
  border-radius: 10px
  padding: 5px
  transition: .5s ease
  .hr
    box-shadow: #57505d50 0 0 5px
  h3
    margin: 0
    padding: 1%
    text-align: center
    color: #57505d
</style>