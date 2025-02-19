import type { PageData } from 'vitepress'
import { changelogsData } from './changelogs'

export async function transformPageData(pageData: PageData) {
  const { frontmatter } = pageData
  if (frontmatter.type === 'changelogs') {
    return changelogsData(pageData)
  }
}
