import * as fs from 'node:fs/promises'
import * as fsPath from 'node:path'

import yaml from 'js-yaml'

import { getPackageJSON, getPackageOrgAndBasename } from '@liquid-labs/npm-toolkit'

import { extractBadgesLine } from './lib/extract-badges-line'

const badgeLineRe = /^\s*\[!\[/

const updateReadme = async({ pkgRoot, badgesLine }) => {
  const readmePath = fsPath.join(pkgRoot, 'README.md')
  let noReadme = false
  let readmeContents
  try {
    readmeContents = await fs.readFile(readmePath, { encoding : 'utf8' })
  }
  catch (e) {
    if (e.code === 'ENOENT') { // we're missing a README.md
      noReadme = true
      // TODO: this might be useful in a library
      const pkgJSON = await getPackageJSON({ pkgDir : pkgRoot })
      const { basename } = await getPackageOrgAndBasename({ pkgJSON })
      const { description } = pkgJSON
      readmeContents = `# ${basename}\n`
      if (description !== undefined && description.trim().length > 0) {
        readmeContents += '\n' + description + '\n'
      }
    }
    else {
      throw e
    }
  }

  if (badgesLine === undefined) {
    const catalystDataPath = fsPath.join(pkgRoot, '.catalyst-data.yaml')
    let catalystDataContents
    // we'd love to do these sequentially, but that makes it hard to handle the case where both files are missing
    try {
      catalystDataContents = await fs.readFile(catalystDataPath, { encoding : 'utf8' })
    }
    catch (e) {
      if (e.code === 'ENOENT') {
        catalystDataContents = '{}'
      }
    }

    const catalystData = yaml.load(catalystDataContents)
    badgesLine = extractBadgesLine({ catalystData })
  }

  if (badgesLine !== undefined && badgesLine.length > 0) {
    const readmeLines = readmeContents.split('\n')
    const tocIndex = readmeLines.findIndex((l) => l.match(/^# +.+/))
    // note, if there is no TOC index, the rest works out because then we want to put the badges on the top line and
    // '-1 + 1 = 0'

    const spliceDelete = readmeLines[tocIndex + 1]?.match(badgeLineRe) ? 1 : 0

    readmeLines.splice(tocIndex + 1, spliceDelete, badgesLine)

    const newReadmeContents = readmeLines.join('\n')

    await fs.writeFile(readmePath, newReadmeContents)
  }
  else if (noReadme === true) {
    await fs.writeFile(readmePath, readmeContents)
  }
}

export { updateReadme }
