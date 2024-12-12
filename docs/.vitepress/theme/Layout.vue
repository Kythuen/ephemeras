<template>
  <Layout>
    <template #home-content>
      <div class="landing">
        <FrameworksSection />
      </div>
    </template>
  </Layout>
</template>

<script setup lang="ts">
import { Layout } from '@white-block/vitepress'
import FrameworksSection from './components/landing/3. frameworks-section/FrameworksSection.vue'

defineOptions({ name: 'EphemerasLayout' })
</script>
