<template>
  <div max-w="lg:384" m="x-auto" p="y-16 x-4 md:x-8" flex="~ col" gap="6">
    <div>
      <wb-input
        w="full"
        max-w="full md:88"
        flex="1"
        size="lg"
        placeholder="Search a package"
      >
        <template #prefix>
          <i class="i-tdesign:search" />
        </template>
      </wb-input>
    </div>
    <div
      grid="~ cols-12"
      gap="6"
      @click="clickDelegate($event, 'pkg-item', toPage)"
    >
      <div
        v-for="item in packages"
        :key="item.name"
        :data-value="`/${item.link}`"
        p="4"
        rounded="1.5"
        ring="1 $wb-color-border-soft"
        bg="hover:$wb-color-container"
        grid="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3"
        flex="~ col"
        gap="3"
        cursor="pointer"
        class="pkg-item"
      >
        <div flex items="center" gap="3">
          <div w="8" h="8" rounded="1">
            <img h="full" :src="withBase(`/logos/${item.link}.svg`)" alt="" />
          </div>
          <div text="lg" color="$wb-color-text-main">{{ item.name }}</div>
        </div>
        <div color="$wb-color-text-disabled">
          {{ item.description || 'Not Found' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { withBase, useData, useRouter } from 'vitepress'
import { clickDelegate } from 'white-block'

const { isDark, lang } = useData()

const localePrefix = computed(() =>
  lang.value === 'en' ? '' : `/${lang.value}`
)
// TODO: locales
async function getPackageList() {
  const result: any = []
  // @ts-ignore
  const pkgs: Record<string, any> = import.meta.glob(
    '../../../../../packages/**/package.json'
  )
  for (const pkg in pkgs) {
    const link = pkg.match(/packages\/(.*)\/package\.json/)?.[1]
    /* @vite-ignore */
    const { name, description } = await import(pkg)
    result.push({
      name,
      link,
      description
    })
  }
  return result.filter(i => i.link !== 'core')
}
const packages = await getPackageList()

const router = useRouter()
function toPage(dataset: Record<string, string>) {
  const { value } = dataset
  router.go(withBase(value))
}
</script>
