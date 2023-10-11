const extractBadgesLine = ({ catalystData = {} }) => {
  const badgeData = []

  console.log('catalystData (extract-badge-line):', catalystData) // DEBUG
  processData({ data : catalystData, badgeData })

  const allBadgesLine = badgeData
    .sort((a, b) => a.priority > b.priority ? 1 : (a.priority < b.priority ? -1 : 0))
    .map(({ badgeLine }) => badgeLine)
    .join(' ')
    .trim()

  return allBadgesLine
}

const processData = ({ data, badgeData }) => {
  const { scripts } = data
  console.log('data (extract-badge-line):', data) // DEBUG

  if (scripts !== undefined) {
    console.log('scripts:', scripts) // DEBUG
    for (const script of scripts) {
      const { badgeLine, priority } = script
      if (badgeLine !== undefined && priority !== undefined) {
        badgeData.push({ badgeLine, priority })
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
