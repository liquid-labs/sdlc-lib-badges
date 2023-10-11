const processBadgeBuilders = async({ builders }) => {
  const builderResults = await Promise.all(builders)

  const dependencyIndex = {}
  const scripts = []

  for (const result of builderResults) {
    for (const dep of result.dependencies || []) {
      dependencyIndex[dep] = true
    }
    scripts.push(...(result.scripts || []))
  }

  const results = {
    dependencies : Object.keys(dependencyIndex).sort(),
    scripts      : scripts.sort((a, b) => {
      if (a.priority < b.priority) return -1
      else if (a.priority > b.priority) return 1
      else return 0
    })
  }

  return results
}

export { processBadgeBuilders }
