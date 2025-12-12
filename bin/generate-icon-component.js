/* eslint-disable no-console */
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const ICON_DIR = path.join(process.cwd(), 'src', 'icons')
const VUE_COMPONENT_TEMPLATE_START = `
<template>
`
const VUE_COMPONENT_TEMPLATE_END = `
</template>

<script lang="ts" setup>
import { computed } from 'vue'

interface Props {
  size?: number
  fill?: string
}
interface Emits {

}

const { size = 24, fill = '#030303' } = defineProps<Props>()
defineEmits<Emits>()

const sizePx = computed(() => \`\${size}px\`)
</script>
`

function checkArguments() {
  const args = process.argv.slice(2)
  if (args.length !== 2) {
    console.error('❌ Fehler: Ungültige Anzahl von Argumenten.')
    console.error('Nutzung: node bin/generate-icon-component.js <IconName> <PathToSvgFile>')
    process.exit(1)
  }
  return { iconName: args[0], svgPath: args[1] }
}

function readAndValidateSvgFile(svgPath) {
  if (!fs.existsSync(svgPath)) {
    console.error(`❌ Fehler: Datei nicht gefunden unter: ${svgPath}`)
    process.exit(1)
  }

  if (path.extname(svgPath).toLowerCase() !== '.svg') {
    console.error(`❌ Fehler: Die Datei muss eine SVG-Datei (.svg) sein. Gefunden: ${path.extname(svgPath)}`)
    process.exit(1)
  }

  try {
    return fs.readFileSync(svgPath, 'utf8')
  }
  catch (e) {
    console.error(`❌ Fehler beim Lesen der Datei: ${svgPath}`)
    console.error(e.message)
    process.exit(1)
  }
}

function transformSvg(svgContent) {
  const cleanedSvg = svgContent.trim().replace(/[\r\n]+/g, ' ').replace(/\s{2,}/g, ' ')

  let transformedSvg = cleanedSvg
    .replace(/height="[^"]*"/, ':height="sizePx"')
    .replace(/width="[^"]*"/, ':width="sizePx"')
    .replace(/fill="[^"]*"/, ':fill="fill"')

  transformedSvg = transformedSvg.replace(/<svg\s+/, '<svg\n    ')
    .replace(/\s+viewBox/, '\n    viewBox')
    .replace(/\s+:height/, '\n    :height')
    .replace(/\s+:width/, '\n    :width')
    .replace(/\s+:fill/, '\n    :fill')
    .replace(/>\s*<path/, '>\n    <path')

  return transformedSvg
}

function createAndSaveVueComponent(iconName, transformedSvg) {
  const fileName = `Icon${iconName}.vue`
  const targetPath = path.join(ICON_DIR, fileName)

  if (!fs.existsSync(ICON_DIR)) {
    console.log(`ℹ️ Erstelle Verzeichnis: ${ICON_DIR}`)
    fs.mkdirSync(ICON_DIR, { recursive: true })
  }

  const componentContent = `${VUE_COMPONENT_TEMPLATE_START}${transformedSvg}${VUE_COMPONENT_TEMPLATE_END}`

  try {
    fs.writeFileSync(targetPath, componentContent, 'utf8')
    console.log(`✅ Erfolgreich erstellt: ${targetPath}`)
    return true
  }
  catch (e) {
    console.error(`❌ Fehler beim Schreiben der Datei: ${targetPath}`)
    console.error(e.message)
    return false
  }
}

function deleteSourceFile(filePath) {
  try {
    fs.unlinkSync(filePath)
    console.log(`🗑️ Quelldatei erfolgreich gelöscht: ${filePath}`)
  }
  catch (e) {
    console.error(`⚠️ Warnung: Fehler beim Löschen der Quelldatei (${filePath}).`)
    console.error(e.message)
  }
}

function main() {
  const { iconName, svgPath } = checkArguments()
  const svgContent = readAndValidateSvgFile(svgPath)
  const transformedSvg = transformSvg(svgContent)

  const success = createAndSaveVueComponent(iconName, transformedSvg)

  if (success) {
    deleteSourceFile(svgPath)
  }
  else {
    console.log('ℹ️ Quelldatei wurde nicht gelöscht, da die Erstellung der Vue-Komponente fehlgeschlagen ist.')
  }
}

main()
