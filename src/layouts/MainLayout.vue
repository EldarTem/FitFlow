<!-- src/layouts/MainLayout.vue -->
<template>
  <el-container>
    <el-header height="60px">
      <Header />
    </el-header>
    <el-main>
      <router-view />
    </el-main>
    <el-footer height="60px">
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
