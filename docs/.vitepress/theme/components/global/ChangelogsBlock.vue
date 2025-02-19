<template>
  <div class="changelogs vp-raw" flex="~ col" gap="8">
    <div v-for="item in page.changelogs" :key="item.date" flex gap="8">
      <div>
        <h2 v-if="item.data?.version">{{ item.data.title }}</h2>
        <img v-if="item.data?.preview" :src="item.data?.preview" />
        <div v-html="item.content" />
        <wb-button
          v-if="item.data?.version"
          href="https://github.com/Kythuen/white-block/releases"
          target="__blank"
          tag="a"
          type="base"
          size="sm"
          theme="default"
          shape="round"
        >
          {{ item.data.version }}
        </wb-button>
      </div>
      <div
        :id="item.date"
        class="hidden !lg:block"
        w="52"
        h="10"
        text="md right $wb-color-text-secondly"
        font="leading-10"
        shrink="0"
      >
        <div>{{ item.date }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useData } from 'vitepress'

const { page }: any = useData()
</script>
