<!-- src/layouts/MainLayout.vue -->
<template>
  <el-container>
    <el-header height="60px" class="header">
      <Header />
    </el-header>
    <el-main>
      <router-view />
    </el-main>
    <el-footer height="60px" class="footer">
      <Footer />
    </el-footer>
  </el-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

export default defineComponent({
  name: "MainLayout",
  components: {
    Header,
    Footer,
  },
});
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  padding: 0 20px;
  background-color: #fff;
  border-bottom: 1px solid #ebeef5;
}
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
