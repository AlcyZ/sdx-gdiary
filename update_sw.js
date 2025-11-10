/* eslint-disable no-console */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { exit } from 'node:process'

const DIST_DIR = 'dist'
const STUB_FILE = 'public/sw_release.js'
const OUTPUT_FILE = join(DIST_DIR, 'sw.js')
const EXCLUDE_FILES = ['sw_release.js', 'sw_dev.js', 'sw.js', '.DS_Store']
const CACHE_NAME_REGEX = /(const CACHE_NAME = 'grow-diary-v)\d+'/

function getAssets(dir, base = '') {
  let assets = []
  const files = readdirSync(dir, { withFileTypes: true })

  for (const file of files) {
    const fullPath = join(dir, file.name)
    const relativePath = join(base, file.name).replace(/\\/g, '/')

    if (EXCLUDE_FILES.includes(relativePath)) {
      continue
    }

    if (file.isDirectory()) {
      assets = assets.concat(getAssets(fullPath, relativePath))
    }
    else {
      assets.push(`./${relativePath}`)
    }
  }
  return assets
}

try {
  console.log(`[SW Update] Starting service worker build...`)

  const assetsToCache = getAssets(DIST_DIR, '')

  assetsToCache.unshift('./')

  const newVersion = Math.floor(Date.now() / 1000)

  let content = readFileSync(STUB_FILE, 'utf8')

  content = content.replace(CACHE_NAME_REGEX, `$1${newVersion}'`)

  if (!content.match(new RegExp(`'grow-diary-v${newVersion}'`))) {
    // noinspection ExceptionCaughtLocallyJS
    throw new Error(`Failed to update CACHE_NAME. Check if the regex '${CACHE_NAME_REGEX}' matches the stub content.`)
  }

  const assetsArrayString = JSON.stringify(assetsToCache, null, 2)
  const assetsToCacheRegex = /const ASSETS_TO_CACHE = \[\]/g

  content = content.replace(assetsToCacheRegex, `const ASSETS_TO_CACHE = ${assetsArrayString}`)

  writeFileSync(OUTPUT_FILE, content)

  console.log(`[SW Update] Successfully created ${OUTPUT_FILE}:`)
  console.log(`  - Assets Cached: ${assetsToCache.length}`)
  console.log(`  - New Cache Name: grow-diary-v${newVersion}`)
}
catch (error) {
  console.error(`[SW Update] FATAL ERROR during service worker creation:`, error.message)
  exit(1)
}
