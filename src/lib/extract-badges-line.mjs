const extractBadgesLine = ({ catalystData = {} }) => {
  const badgeData = []

  processData({ data : catalystData, badgeData })

  const allBadgesLine = badgeData
    .sort((a, b) => a.priority > b.priority ? 1 : (a.priority < b.priority ? -1 : 0))
    .map(({ content }) => content)
    .join(' ')
    .trim()

  return allBadgesLine
}

const processData = ({ data, badgeData }) => {
  const { artifacts } = data

  if (artifacts !== undefined) {
    for (const artifact of artifacts) {
      const { content, priority } = artifact
      if (content !== undefined && priority !== undefined) {
        badgeData.push({ content, priority })
      }
    }
  }
  else if (typeof data === 'object') {
    for (const entry of Object.values(data)) {
      processData({ data : entry, badgeData })
    }
  }
}

export { extractBadgesLine }
