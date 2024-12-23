function to<T = any, U = any>(
  promise: Promise<T>
): Promise<[U, undefined] | [null, T]> {
  return promise
    .then<[null, T]>((data: T) => [null, data])
    .catch<[U, undefined]>((err: U) => {
      return [err, undefined]
    })
}

export type TaskItem = () => Promise<any>
export type TaskItemResult = { err: any; log: string }
export type TaskMap = Map<string, TaskItem[]>
export type RunGroupTaskOptions = {
  before: (tasks: TaskMap) => void
  each: (result: TaskItemResult) => void
  after: (tasks: TaskItemResult[]) => void
}

export class Tasks {
  tasks: TaskMap = new Map()

  addGroup(groupId: string) {
    this.tasks.set(groupId, [])
  }

  addTask(task: TaskItem, type: 'push' | 'unshift' = 'push') {
    this.addGroupTask('default', task, type)
  }
  addGroupTask(
    groupId: string,
    task: TaskItem,
    type: 'push' | 'unshift' = 'push'
  ) {
    if (!this.tasks.get(groupId)) {
      this.tasks.set(groupId, [])
    }
    if (type === 'push') {
      this.tasks.get(groupId)!.push(task)
    } else {
      this.tasks.get(groupId)!.unshift(task)
    }
  }

  runTask(options = {}) {
    return this.runGroupTask('default', options)
  }
  async runGroupTask(
    groupId: string,
    options: Partial<RunGroupTaskOptions> = {}
  ) {
    const result: TaskItemResult[] = []
    options.before?.(this.tasks)
    for (const task of this.tasks.get(groupId) || []) {
      const [err, log] = await to(task())
      result.push({ err, log })
      options.each?.({ err, log })
    }
    this.tasks.delete(groupId)
    options.after?.(result)
    return result
  }
}
