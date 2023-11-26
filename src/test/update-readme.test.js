/* global beforeAll describe expect test */
import * as fs from 'node:fs/promises'
import * as fsPath from 'node:path'

import { updateReadme } from '../update-readme'

describe('updateReadme', () => {
  const pkgRoot = fsPath.join(__dirname, 'data', 'pkgA')
  const readmePath = fsPath.join(pkgRoot, 'README.md')
  const badgesLine = '[![some badge](./somelink)](./anotherLink)'

  beforeAll(async() => {
    await updateReadme({ pkgRoot, badgesLine })
  })

  test('inserts the badge line if not present', async() => {
    const afterContents = await fs.readFile(readmePath, { encoding : 'utf8' })
    const afterLines = afterContents.split('\n')
    expect(afterLines[1]).toBe(badgesLine)
  })

  test('replaces the badge line if present', async() => {
    const newBadgeLine = '[![new badge](./somelink)](./anotherLink)'
    await updateReadme({ pkgRoot, badgesLine : newBadgeLine })
    const afterContents = await fs.readFile(readmePath, { encoding : 'utf8' })
    const afterLines = afterContents.split('\n')
    expect(afterLines[1]).toBe(newBadgeLine)
  })

  test('will read from .sdlc-data.yaml', async() => {
    const catylstDataBadgeLine = '[![coverage: 100%](./.readme-assets/coverage.svg)](https://google.com)'
    await updateReadme({ pkgRoot })
    const afterContents = await fs.readFile(readmePath, { encoding : 'utf8' })
    const afterLines = afterContents.split('\n')
    expect(afterLines[1]).toBe(catylstDataBadgeLine)
  })
})
