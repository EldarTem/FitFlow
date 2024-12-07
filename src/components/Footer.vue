<!-- src/components/Footer.vue -->
<template>
  <el-footer height="60px" class="footer">
    <p>© 2023 FitFlow. Все права защищены.</p>
  </el-footer>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Footer",
});
</script>

<style scoped>
.footer {
  text-align: center;
  color: #909399;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  border-top: 1px solid #ebeef5;
}
</style>
