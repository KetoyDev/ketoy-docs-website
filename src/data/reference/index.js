/**
 * Ketoy SDK – Reference Index
 * Aggregates all package-level reference data and exports helper functions.
 */

import devtoolsData from './devtools'
import annotationData from './annotation'
import cloudData from './cloud'
import coreData from './core'
import dslData from './dsl'
import exportData from './export'
import ketoyData from './ketoy'
import modelData from './model'
import navigationData from './navigation'
import parserData from './parser'
import registryData from './registry'
import rendererData from './renderer'
import screenData from './screen'
import themeData from './theme'
import utilData from './util'
import widgetData from './widget'
import wireData from './wire'

/** Merged reference map (keyed by class name) */
const referenceData = {
  ...devtoolsData,
  ...annotationData,
  ...cloudData,
  ...coreData,
  ...dslData,
  ...exportData,
  ...ketoyData,
  ...modelData,
  ...navigationData,
  ...parserData,
  ...registryData,
  ...rendererData,
  ...screenData,
  ...themeData,
  ...utilData,
  ...widgetData,
  ...wireData,
}

/* ── Helper: get all classes as sorted array ── */
export function getAllClasses() {
  return Object.values(referenceData).sort((a, b) => a.name.localeCompare(b.name))
}

/* ── Helper: group classes by category → subcategory ── */
export function getClassesByCategory() {
  const map = {}
  for (const cls of Object.values(referenceData)) {
    if (!map[cls.category]) map[cls.category] = {}
    if (!map[cls.category][cls.subcategory]) map[cls.category][cls.subcategory] = []
    map[cls.category][cls.subcategory].push(cls)
  }
  return map
}

/* ── Helper: get single class by ID ── */
export function getClassById(id) {
  return referenceData[id] || null
}

/* ── Helper: get classes by module ── */
export function getClassesByModule(module) {
  return Object.values(referenceData).filter(cls => cls.module === module)
}

/* ── Helper: get classes by module + subpackage ── */
export function getClassesBySubpackage(module, subpackage) {
  return Object.values(referenceData).filter(
    cls => cls.module === module && cls.subpackage === subpackage
  )
}

export { devtoolsData, annotationData, cloudData, coreData, dslData, exportData, ketoyData, modelData, navigationData, parserData, registryData, rendererData, screenData, themeData, utilData, widgetData, wireData }
export default referenceData
