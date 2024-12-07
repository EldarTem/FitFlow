<!-- src/App.vue -->
<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
});
</script>

<style>
body,
html,
#app {
  font-family: "Roboto", sans-serif;
  height: 100%;
  margin: 0;
}

.el-container {
  min-height: 100vh;
}

.el-main {
  padding: 20px;
}
</style>
