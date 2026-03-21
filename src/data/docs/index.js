/**
 * Ketoy Documentation – Index
 * Aggregates all documentation modules and provides helper functions.
 */

import quickStartDoc from './quick-start'
import initializationDoc from './initialization'
import layoutsDoc from './layouts'
import screensDoc from './screens'
import kNavigationDoc from './knavigation'
import testingLocallyDoc from './testing-locally'
import productionReleaseDoc from './production-release'
import kTextDoc from './ktext'
import kButtonDoc from './kbutton'
import kLayoutDoc from './klayout'
import kCardDoc from './kcard'
import kMediaDoc from './kmedia'
import kInputDoc from './kinput'
import kScaffoldDoc from './kscaffold'
import kListsDoc from './klists'
import kAdvancedDoc from './kadvanced'

/** Guide documentation entries (Initialization, Layouts) */
const guideDocs = {
  [quickStartDoc.id]: quickStartDoc,
  [initializationDoc.id]: initializationDoc,
  [layoutsDoc.id]: layoutsDoc,
  [screensDoc.id]: screensDoc,
  [kNavigationDoc.id]: kNavigationDoc,
  [testingLocallyDoc.id]: testingLocallyDoc,
  [productionReleaseDoc.id]: productionReleaseDoc,
}

/** Widget documentation entries (KText, KButton, etc.) – shown under Documentation / Components */
const widgetDocs = {
  [kTextDoc.id]: kTextDoc,
  [kButtonDoc.id]: kButtonDoc,
  [kLayoutDoc.id]: kLayoutDoc,
  [kCardDoc.id]: kCardDoc,
  [kMediaDoc.id]: kMediaDoc,
  [kInputDoc.id]: kInputDoc,
  [kScaffoldDoc.id]: kScaffoldDoc,
  [kListsDoc.id]: kListsDoc,
  [kAdvancedDoc.id]: kAdvancedDoc,
}

/** All documentation entries, keyed by id */
const docsData = { ...guideDocs, ...widgetDocs }

/** Guide docs only, sorted by order */
export function getGuideDocs() {
  return Object.values(guideDocs).sort((a, b) => a.order - b.order)
}

/** Widget docs only, sorted by order */
export function getWidgetDocs() {
  return Object.values(widgetDocs).sort((a, b) => a.order - b.order)
}

/** All docs sorted by order */
export function getAllDocs() {
  return Object.values(docsData).sort((a, b) => a.order - b.order)
}

/** Get a single doc by ID */
export function getDocById(id) {
  return docsData[id] || null
}

/** Get the full ordered list of doc IDs (for prev/next navigation) */
export function getDocOrder() {
  return getAllDocs().map(d => d.id)
}

export default docsData
