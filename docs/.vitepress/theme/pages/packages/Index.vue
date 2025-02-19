<template>
  <div max-w="lg:360" m="x-auto" p="y-16 x-4 md:x-8" flex="~ col" gap="6">
    <div w="80%" m="x-auto" p="t-16" flex="~ col" items="center">
      <h2
        w="xl:200"
        m="t-0 b-2em"
        text="8 md:10 xl:12 center $wb-color-text-main"
        font="bold italic leading-[1.2]"
        gap="x-1em"
      >
        Powering your Application Development with Ephemeras
      </h2>
      <Net />
    </div>
    <div w="95% lg:80%" m="x-auto t-6" style="--wb-color-primary: #ffffff">
      <wb-input
        v-model="filterKeyword"
        w="full"
        size="lg"
        placeholder="Search a package"
        @change="filterPackages"
      >
        <template #suffix>
          <wb-button h="full" theme="contrast" @click="filterPackages">
            Search
          </wb-button>
        </template>
      </wb-input>
    </div>
    <div w="95% lg:80%" m="x-auto t-6">
      <div p="y-4" grid="~ cols-1 md:cols-2 lg:cols-3" gap="4">
        <BlurCard
          v-for="item in resolvePackages"
          :key="item.title"
          :data="item"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { withBase } from 'vitepress'
import { ref, shallowRef } from 'vue'
import Net from './Net.vue'

const PACKAGES = [
  {
    title: '@ephemeras/fs',
    desc: 'File system for ephemeras provide more convenient features.',
    link: withBase('/packages/fs'),
    authorLink: 'https://github.com/Kythuen',
    author: 'Kythuen',
    img: withBase('/assets/img/packages/fs.webp'),
    tags: ['Node.js', 'File System']
  },
  {
    title: '@ephemeras/linter',
    desc: 'Tool to quickly add code lint for your project.',
    link: withBase('/packages/linter'),
    authorLink: 'https://github.com/Kythuen',
    author: 'Kythuen',
    img: withBase('/assets/img/packages/linter.webp'),
    tags: ['Lint', 'Format']
  },
  {
    title: '@ephemeras/parser',
    desc: 'Parser template files with data.',
    link: withBase('/packages/parser/'),
    authorLink: 'https://github.com/Kythuen',
    author: 'Kythuen',
    img: withBase('/assets/img/packages/parser.webp'),
    tags: ['Templates', 'Parser']
  },
  {
    title: '@ephemeras/profile',
    desc: 'Profile manager for ephemeras',
    link: withBase('/packages/profile/'),
    authorLink: 'https://github.com/Kythuen',
    author: 'Kythuen',
    img: withBase('/assets/img/packages/profile.webp'),
    tags: ['Profile', 'Configs']
  },
  {
    title: '@ephemeras/readme',
    desc: 'Quickly create a nice readme file.',
    link: withBase('/packages/readme/'),
    authorLink: 'https://github.com/Kythuen',
    author: 'Kythuen',
    img: withBase('/assets/img/packages/readme.webp'),
    tags: ['README', 'GitHub']
  },
  {
    title: '@ephemeras/cli',
    desc: 'Create project with @ephemeras/templates.',
    link: withBase('/packages/readme/'),
    authorLink: 'https://github.com/Kythuen',
    author: 'Kythuen',
    img: withBase('/assets/img/packages/cli.webp'),
    tags: ['Project', 'Templates']
  }
]

const resolvePackages = shallowRef(PACKAGES)
const filterKeyword = ref('')
function filterPackages() {
  resolvePackages.value = PACKAGES.filter(i =>
    i.title.includes(filterKeyword.value)
  )
}
</script>
