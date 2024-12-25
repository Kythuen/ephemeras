export const supportFeatures = ['format', 'commit'] as const
export type LintFeature = (typeof supportFeatures)[number]

export type PromptData = {
  preset: string
  features: string[]
  environment: string[]
  framework: string
  typescript: boolean
  commitHook: boolean
  commitMessage: boolean
  save: boolean
  install: boolean
  packageManager: string
  description?: string
}
