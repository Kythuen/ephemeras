<template>
  <a
    w="full"
    :href="data.link"
    bg="$wb-color-card"
    rounded="3"
    ring="px $wb-color-border"
    overflow="hidden"
  >
    <div relative h="16">
      <div
        relative
        w="full"
        h="full"
        overflow="hidden"
        flex
        items="center"
        justify="center"
      >
        <div absolute w="120" h="120" filter="blur-40 saturate-150">
          <img w="full" h="full" :src="data.img" />
          <div absolute inset="0" w="full" h="full" bg="#0000001a"></div>
        </div>
      </div>

      <div
        absolute
        bottom="-50%"
        right="5"
        w="16"
        h="16"
        bg="$wb-color-card"
        rounded="full"
        flex
        items="center"
        justify="center"
      >
        <img w="68%" :src="data.img" rounded="full" />
      </div>
    </div>
    <div p="4">
      <div flex="~ col" gap="2">
        <div text="lg #ffffff" font="bold">{{ data.title }}</div>
        <a
          :href="data.authorLink"
          un-text="xs $wb-color-blue"
          font="bold"
          style="width: fit-content"
        >
          @{{ data.author }}
        </a>
        <div h="12" text="sm $wb-color-text-secondly line-clamp-2">
          {{ data.desc }}
        </div>
      </div>
      <div text="xs" flex gap="2">
        <div
          v-for="item in data.tags"
          :key="data.title + item"
          p="0.5 x-1.5"
          bg="gray/15"
          rounded="0.5"
        >
          {{ item }}
        </div>
      </div>
    </div>
  </a>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

export type CardData = {
  title: string
  desc: string
  author: string
  link: string
  authorLink: string
  img: string
  tags: string[]
}
defineProps({
  data: {
    type: Object as PropType<CardData>,
    required: true
  }
})
</script>
