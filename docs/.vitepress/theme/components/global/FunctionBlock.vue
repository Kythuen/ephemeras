<template>
  <div class="function-block">
    <table>
      <colgroup>
        <col style="width: 20%" />
        <col style="width: 80%" />
      </colgroup>
      <tbody>
        <tr>
          <td>Description</td>
          <td>{{ options.desc }}</td>
        </tr>
        <tr>
          <td>Types</td>
          <td>
            <code>{{ options.type }}</code>
          </td>
        </tr>
        <tr>
          <td>Parameters</td>
          <td style="padding: 0">
            <table>
              <colgroup>
                <col style="width: 15%" />
                <col style="width: 85%" />
              </colgroup>
              <tbody>
                <tr v-for="item in options.params || []" :key="item.name">
                  <td>
                    <a v-if="item.url" :href="item.url" target="_blank">
                      {{ item.name }}
                    </a>
                    <span v-else>{{ item.name }}</span>
                  </td>
                  <td>{{ item.desc }}</td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td>Returns</td>
          <td>
            <span>
              {{ options.returns }}
            </span>
            <a
              v-if="options.resultType"
              m="l-1"
              :href="options.resultType.url"
              target="_blank"
            >
              <code>{{ options.resultType.name }}</code>
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'

defineOptions({ name: 'FunctionBlock' })

type Options = {
  desc: string
  type: string
  params: { name: string; desc: string; url?: string }[]
  returns: string
  resultType?: { name: string; url: string }
}
defineProps({
  options: {
    type: Object as PropType<Options>,
    required: true
  }
})
</script>

<style lang="less">
.function-block {
  margin-top: 1rem;
  a {
    color: inherit;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
  border-radius: 0.25rem;
  overflow: hidden;
  border: solid 1px var(--wb-color-border-soft);
  table {
    margin: 0;
    min-width: 100%;
    display: table;
    overflow: hidden;
    border-radius: inherit;
    thead tr th {
      border-top-color: transparent;
    }
    tbody tr:last-child td {
      border-bottom-color: transparent;
    }
    th:first-child,
    td:first-child {
      border-left-color: transparent;
    }
    th:last-child,
    td:last-child {
      border-right-color: transparent;
    }
  }
}
</style>
