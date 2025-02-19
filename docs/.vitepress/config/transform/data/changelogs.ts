import glob from 'fast-glob'
import { resolve } from 'node:path'
import { readFileSync } from 'node:fs'
import MarkdownIt from 'markdown-it'
import matter from 'gray-matter'
import type { PageData } from 'vitepress'

const Md = MarkdownIt()

export function changelogsData(pageData: PageData) {
  const { packages } = pageData.frontmatter
  if (!packages) {
    return {}
  }
  const changelogs = glob.sync([
    `../docs/src/packages/${packages}/changelogs/*.md`
  ])
  const result: any = []
  for (const item of changelogs) {
    const date = item.match(/(\d{4}-\d{2}-\d{2})/)?.[0] || ''
    if (date) {
      const filePath = resolve(__dirname, '../../../..', item)
      const fileContent = readFileSync(filePath, 'utf-8')
      const { data, content } = matter(fileContent)
      result.push({ date, content: Md.render(content), data })
    }
  }

  return {
    changelogs: result
  }
}
