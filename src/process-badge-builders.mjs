const processBadgeBuilders = async({ builders }) => {
  const builderResults = await Promise.all(builders)

  const dependencyIndex = {}
  const artifacts = []

  for (const result of builderResults) {
    for (const dep of result.dependencies || []) {
      dependencyIndex[dep] = true
    }
    artifacts.push(...(result.artifacts || []))
  }

  const results = {
    dependencies : Object.keys(dependencyIndex).sort(),
    artifacts    : artifacts.sort((a, b) => {
      if (a.priority < b.priority) return -1
      else if (a.priority > b.priority) return 1
      else return 0
    })
  }

  return results
}

export { processBadgeBuilders }
