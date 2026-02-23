/**
 * Ketoy SDK – Export Module
 * Package: com.developerstring.ketoy.export
 */

const exportData = {

  /* ── Export > Production Export ── */

  KetoyProductionExport: {
    name: 'KetoyProductionExport',
    kind: 'abstract class',
    module: 'export',
    subpackage: 'production',
    category: 'Export',
    subcategory: 'Production Export',
    description: 'Base class for declaring production screen and navigation exports. Client apps extend this class to register their production screens and navigation graphs. Unlike the dev-server export, the production export has no test data, no dummy placeholders, and no dev tooling — exports are self-contained JSON for runtime use.',
    android: {
      packageName: 'com.developerstring.ketoy.export',
      annotations: [],
      imports: [
        'import com.developerstring.ketoy.core.toJson',
        'import com.developerstring.ketoy.model.KNode',
        'import com.developerstring.ketoy.navigation.KetoyNavGraph',
      ],
      sourceCode: `abstract class KetoyProductionExport {

    val screens: List<ScreenDefinition>
    val navGraphs: List<KetoyNavGraph>

    abstract fun registerScreens()
    abstract fun registerNavGraphs()

    fun screen(
        screenName: String,
        displayName: String = ...,
        description: String = "",
        version: String = "1.0.0",
        builder: ScreenBuilder.() -> Unit
    ) { ... }

    fun navGraph(graph: KetoyNavGraph) { ... }

    fun buildExport(): ExportResult { ... }
}`,
    },
    properties: [
      { name: 'screens', type: 'List<ScreenDefinition>', default: '[]', description: 'All registered screen definitions (read-only). Populated by registerScreens().' },
      { name: 'navGraphs', type: 'List<KetoyNavGraph>', default: '[]', description: 'All registered nav graphs (read-only). Populated by registerNavGraphs().' },
    ],
    methods: [
      { name: 'registerScreens()', returns: 'Unit', description: 'Abstract. Register all production screens for export. Use screen() to declare each screen and its content blocks.' },
      { name: 'registerNavGraphs()', returns: 'Unit', description: 'Abstract. Register all navigation graphs for export. Use navGraph() to declare each exportable nav graph.' },
      { name: 'screen(screenName, displayName?, description?, version?, builder)', returns: 'Unit', description: 'Declare a production screen with one or more content blocks via ScreenBuilder.' },
      { name: 'navGraph(graph: KetoyNavGraph)', returns: 'Unit', description: 'Register a navigation graph for production export. The graph is serialized as-is to nav_{navHostName}.json.' },
      { name: 'buildExport()', returns: 'ExportResult', description: 'Execute all registrations and build the export result. Call this from the export test or Gradle task runner. Clears previous state before re-running.' },
    ],
    innerClasses: [
      {
        name: 'ScreenBuilder',
        kind: 'class',
        description: 'Builder scope for declaring content blocks within a screen. Each content() call adds a named content block backed by a KNode builder.',
        methods: [
          { name: 'content(name: String = "main", nodeBuilder: () -> KNode)', returns: 'Unit', description: 'Declare a named content block. The name must match the runtime KetoyContent(name = ...) declaration.' },
        ],
      },
      {
        name: 'ScreenDefinition',
        kind: 'data class',
        description: 'Internal definition of a screen before export.',
        properties: [
          { name: 'screenName', type: 'String', default: '—', description: 'Unique identifier matching the runtime screen name.' },
          { name: 'displayName', type: 'String', default: '—', description: 'Human-readable label for tooling.' },
          { name: 'description', type: 'String', default: '—', description: 'Optional description of the screen\'s purpose.' },
          { name: 'version', type: 'String', default: '—', description: 'Semantic version of this screen\'s UI definition.' },
          { name: 'contents', type: 'List<ContentDefinition>', default: '—', description: 'Ordered list of content blocks within the screen.' },
        ],
      },
      {
        name: 'ContentDefinition',
        kind: 'data class',
        description: 'Internal definition of a content block before export.',
        properties: [
          { name: 'name', type: 'String', default: '—', description: 'Content block identifier (e.g. "main", "cards").' },
          { name: 'nodeBuilder', type: '() -> KNode', default: '—', description: 'Lambda that constructs the KNode tree for this block.' },
        ],
      },
      {
        name: 'ScreenExport',
        kind: 'data class',
        description: 'A single exported screen ready to be written to disk.',
        properties: [
          { name: 'screenName', type: 'String', default: '—', description: 'The unique screen identifier.' },
          { name: 'fileName', type: 'String', default: '—', description: 'The target file name (e.g. "home.json").' },
          { name: 'json', type: 'String', default: '—', description: 'The serialised JSON string of the screen.' },
        ],
      },
      {
        name: 'NavGraphExport',
        kind: 'data class',
        description: 'A single exported navigation graph ready to be written to disk.',
        properties: [
          { name: 'navHostName', type: 'String', default: '—', description: 'The nav-host identifier (e.g. "main").' },
          { name: 'fileName', type: 'String', default: '—', description: 'The target file name (e.g. "nav_main.json").' },
          { name: 'json', type: 'String', default: '—', description: 'The serialised JSON string of the nav graph.' },
          { name: 'destinationCount', type: 'Int', default: '—', description: 'Number of destinations in the graph.' },
          { name: 'navigationCount', type: 'Int', default: '—', description: 'Number of navigation edges in the graph.' },
        ],
      },
      {
        name: 'ExportResult',
        kind: 'data class',
        description: 'Complete export result containing all screens and nav graphs. Use writeTo() to write all files to a directory, or access individual exports for custom handling.',
        properties: [
          { name: 'screens', type: 'List<ScreenExport>', default: '—', description: 'All exported screen JSONs.' },
          { name: 'navGraphs', type: 'List<NavGraphExport>', default: '—', description: 'All exported nav graph JSONs.' },
          { name: 'totalCount', type: 'Int', default: '—', description: 'Total number of exported items (screens + nav graphs).' },
        ],
        methods: [
          { name: 'writeTo(directory: File, clearExisting: Boolean = true)', returns: 'ExportSummary', description: 'Write all exported JSONs to the given directory. Creates the directory if needed. Returns an ExportSummary.' },
          { name: 'buildNavigationManifest()', returns: 'String', description: 'Build a combined navigation manifest containing all nav graphs with a top-level index of available nav host names.' },
          { name: 'buildScreenManifest(allScreenDefs: List<ScreenDefinition>)', returns: 'String', description: 'Build a screen manifest listing all exported screens with their content names.' },
        ],
      },
      {
        name: 'ExportSummary',
        kind: 'data class',
        description: 'Summary of a completed export operation.',
        properties: [
          { name: 'screenCount', type: 'Int', default: '—', description: 'Number of screens exported.' },
          { name: 'navGraphCount', type: 'Int', default: '—', description: 'Number of nav graphs exported.' },
          { name: 'totalBytes', type: 'Long', default: '—', description: 'Combined byte size of all exported JSON files.' },
          { name: 'outputDirectory', type: 'String', default: '—', description: 'Absolute path of the export output directory.' },
        ],
      },
    ],
    usage: `class AppProductionExport : KetoyProductionExport() {

    override fun registerScreens() {
        screen("home", displayName = "Home") {
            content("cards") { buildHomeCards() }
            content("transactions") { buildHomeTransactions() }
        }
        screen("profile", displayName = "Profile") {
            content { buildProfileScreen() }
        }
    }

    override fun registerNavGraphs() {
        navGraph(AppNavGraphs.main)
        navGraph(AppNavGraphs.demo)
    }
}

// Execute the export
val export = AppProductionExport()
val result = export.buildExport()

// Write to disk
val summary = result.writeTo(File("ketoy-export"))
println(summary)

// Build manifests
val navManifest = result.buildNavigationManifest()
val screenManifest = result.buildScreenManifest(export.screens)`,
    notes: 'Run via Gradle task: ./gradlew ketoyExportProd. The exported JSON is consumed by asset-based rendering (bundle in assets/), cloud delivery (push to Ketoy Cloud), or CDN/custom server hosting. buildExport() clears previous state so it can be called multiple times safely.',
    seeAlso: ['ScreenBuilder', 'ScreenDefinition', 'ContentDefinition', 'ScreenExport', 'NavGraphExport', 'ExportResult', 'ExportSummary', 'KetoyProductionNavLoader', 'KetoyNavGraph'],
  },

  ScreenBuilder: {
    name: 'ScreenBuilder',
    kind: 'class',
    module: 'export',
    subpackage: 'production',
    category: 'Export',
    subcategory: 'Production Export',
    description: 'Builder scope for declaring content blocks within a production screen. Each content() call adds a named content block backed by a KNode builder — matching the KetoyContent(name = ..., nodeBuilder = ...) declarations in the composable screen. Nested inside KetoyProductionExport.',
    android: {
      packageName: 'com.developerstring.ketoy.export',
      annotations: [],
      imports: [
        'import com.developerstring.ketoy.model.KNode',
      ],
      sourceCode: `class ScreenBuilder {
    internal val contents = mutableListOf<ContentDefinition>()

    fun content(
        name: String = "main",
        nodeBuilder: () -> KNode
    ) {
        contents.add(ContentDefinition(name = name, nodeBuilder = nodeBuilder))
    }
}`,
    },
    methods: [
      { name: 'content(name: String = "main", nodeBuilder: () -> KNode)', returns: 'Unit', description: 'Declare a named content block. The name must match the runtime KetoyContent(name = ...) declaration. Defaults to "main" for screens with a single content block.' },
    ],
    usage: `screen("dashboard", displayName = "Dashboard") {
    content("cards") { buildDashboardCards() }
    content("transactions") { buildDashboardTransactions() }
}`,
    notes: 'Nested inside KetoyProductionExport. Used as the receiver in the screen() DSL lambda.',
    seeAlso: ['KetoyProductionExport', 'ContentDefinition', 'KNode'],
  },

  ScreenDefinition: {
    name: 'ScreenDefinition',
    kind: 'data class',
    module: 'export',
    subpackage: 'production',
    category: 'Export',
    subcategory: 'Production Export',
    description: 'Internal definition of a screen before export. Created by screen() calls in KetoyProductionExport. Nested inside KetoyProductionExport.',
    android: {
      packageName: 'com.developerstring.ketoy.export',
      annotations: [],
      imports: [],
      sourceCode: `data class ScreenDefinition(
    val screenName: String,
    val displayName: String,
    val description: String,
    val version: String,
    val contents: List<ContentDefinition>
)`,
    },
    properties: [
      { name: 'screenName', type: 'String', default: '—', description: 'Unique identifier matching the runtime screen name.' },
      { name: 'displayName', type: 'String', default: '—', description: 'Human-readable label for tooling.' },
      { name: 'description', type: 'String', default: '—', description: 'Optional description of the screen\'s purpose.' },
      { name: 'version', type: 'String', default: '—', description: 'Semantic version of this screen\'s UI definition.' },
      { name: 'contents', type: 'List<ContentDefinition>', default: '—', description: 'Ordered list of content blocks within the screen.' },
    ],
    usage: `// Accessed via KetoyProductionExport.screens
val defs: List<ScreenDefinition> = export.screens
defs.forEach { println("\${it.screenName}: \${it.contents.size} blocks") }`,
    notes: 'Nested inside KetoyProductionExport. Created internally by the screen() DSL.',
    seeAlso: ['KetoyProductionExport', 'ContentDefinition', 'ScreenExport'],
  },

  ContentDefinition: {
    name: 'ContentDefinition',
    kind: 'data class',
    module: 'export',
    subpackage: 'production',
    category: 'Export',
    subcategory: 'Production Export',
    description: 'Internal definition of a content block before export. Created by content() calls inside a ScreenBuilder. Nested inside KetoyProductionExport.',
    android: {
      packageName: 'com.developerstring.ketoy.export',
      annotations: [],
      imports: [
        'import com.developerstring.ketoy.model.KNode',
      ],
      sourceCode: `data class ContentDefinition(
    val name: String,
    val nodeBuilder: () -> KNode
)`,
    },
    properties: [
      { name: 'name', type: 'String', default: '—', description: 'Content block identifier (e.g. "main", "cards").' },
      { name: 'nodeBuilder', type: '() -> KNode', default: '—', description: 'Lambda that constructs the KNode tree for this block.' },
    ],
    usage: `// Created via ScreenBuilder.content()
content("header") { buildHeaderNode() }`,
    notes: 'Nested inside KetoyProductionExport.',
    seeAlso: ['KetoyProductionExport', 'ScreenBuilder', 'ScreenDefinition', 'KNode'],
  },

  ScreenExport: {
    name: 'ScreenExport',
    kind: 'data class',
    module: 'export',
    subpackage: 'production',
    category: 'Export',
    subcategory: 'Production Export',
    description: 'A single exported screen ready to be written to disk. Part of ExportResult. Nested inside KetoyProductionExport.',
    android: {
      packageName: 'com.developerstring.ketoy.export',
      annotations: [],
      imports: [],
      sourceCode: `data class ScreenExport(
    val screenName: String,
    val fileName: String,
    val json: String
)`,
    },
    properties: [
      { name: 'screenName', type: 'String', default: '—', description: 'The unique screen identifier.' },
      { name: 'fileName', type: 'String', default: '—', description: 'The target file name (e.g. "home.json").' },
      { name: 'json', type: 'String', default: '—', description: 'The serialised JSON string of the screen.' },
    ],
    usage: `val result = export.buildExport()
result.screens.forEach { screenExport ->
    File(outputDir, screenExport.fileName).writeText(screenExport.json)
}`,
    notes: 'Nested inside KetoyProductionExport. Part of ExportResult.screens.',
    seeAlso: ['KetoyProductionExport', 'ExportResult', 'NavGraphExport'],
  },

  NavGraphExport: {
    name: 'NavGraphExport',
    kind: 'data class',
    module: 'export',
    subpackage: 'production',
    category: 'Export',
    subcategory: 'Production Export',
    description: 'A single exported navigation graph ready to be written to disk. Part of ExportResult. Nested inside KetoyProductionExport.',
    android: {
      packageName: 'com.developerstring.ketoy.export',
      annotations: [],
      imports: [],
      sourceCode: `data class NavGraphExport(
    val navHostName: String,
    val fileName: String,
    val json: String,
    val destinationCount: Int,
    val navigationCount: Int
)`,
    },
    properties: [
      { name: 'navHostName', type: 'String', default: '—', description: 'The nav-host identifier (e.g. "main").' },
      { name: 'fileName', type: 'String', default: '—', description: 'The target file name (e.g. "nav_main.json").' },
      { name: 'json', type: 'String', default: '—', description: 'The serialised JSON string of the nav graph.' },
      { name: 'destinationCount', type: 'Int', default: '—', description: 'Number of destinations in the graph.' },
      { name: 'navigationCount', type: 'Int', default: '—', description: 'Number of navigation edges in the graph.' },
    ],
    usage: `val result = export.buildExport()
result.navGraphs.forEach { navExport ->
    println("\${navExport.navHostName}: \${navExport.destinationCount} destinations")
}`,
    notes: 'Nested inside KetoyProductionExport. Part of ExportResult.navGraphs.',
    seeAlso: ['KetoyProductionExport', 'ExportResult', 'ScreenExport', 'KetoyNavGraph'],
  },

  ExportResult: {
    name: 'ExportResult',
    kind: 'data class',
    module: 'export',
    subpackage: 'production',
    category: 'Export',
    subcategory: 'Production Export',
    description: 'Complete export result containing all screens and nav graphs. Use writeTo() to write all files to a directory, or access individual exports for custom handling. Nested inside KetoyProductionExport.',
    android: {
      packageName: 'com.developerstring.ketoy.export',
      annotations: [],
      imports: [],
      sourceCode: `data class ExportResult(
    val screens: List<ScreenExport>,
    val navGraphs: List<NavGraphExport>
) {
    val totalCount: Int get() = screens.size + navGraphs.size

    fun writeTo(directory: File, clearExisting: Boolean = true): ExportSummary { ... }
    fun buildNavigationManifest(): String { ... }
    fun buildScreenManifest(allScreenDefs: List<ScreenDefinition>): String { ... }
}`,
    },
    properties: [
      { name: 'screens', type: 'List<ScreenExport>', default: '—', description: 'All exported screen JSONs.' },
      { name: 'navGraphs', type: 'List<NavGraphExport>', default: '—', description: 'All exported nav graph JSONs.' },
      { name: 'totalCount', type: 'Int', default: '—', description: 'Total number of exported items (screens + nav graphs).' },
    ],
    methods: [
      { name: 'writeTo(directory: File, clearExisting: Boolean = true)', returns: 'ExportSummary', description: 'Write all exported JSONs to the given directory. Creates the directory if it doesn\'t exist. When clearExisting is true, removes existing .json files before writing.' },
      { name: 'buildNavigationManifest()', returns: 'String', description: 'Build a combined navigation manifest JSON containing all nav graphs with a top-level index of available nav host names and full graph definitions.' },
      { name: 'buildScreenManifest(allScreenDefs: List<ScreenDefinition>)', returns: 'String', description: 'Build a screen manifest JSON listing all exported screens with their content names, display names, versions, and file names.' },
    ],
    usage: `val result = export.buildExport()

// Write to disk
val summary = result.writeTo(File("ketoy-export"))
println(summary) // Prints screen/nav/byte counts

// Build manifests
val navManifest = result.buildNavigationManifest()
val screenManifest = result.buildScreenManifest(export.screens)`,
    notes: 'Nested inside KetoyProductionExport. writeTo() clears existing .json files by default to ensure clean exports. Manifest formats include version "1.0.0" and list all items.',
    seeAlso: ['KetoyProductionExport', 'ScreenExport', 'NavGraphExport', 'ExportSummary'],
  },

  ExportSummary: {
    name: 'ExportSummary',
    kind: 'data class',
    module: 'export',
    subpackage: 'production',
    category: 'Export',
    subcategory: 'Production Export',
    description: 'Summary of a completed export operation. Returned by ExportResult.writeTo(). toString() prints a formatted report. Nested inside KetoyProductionExport.',
    android: {
      packageName: 'com.developerstring.ketoy.export',
      annotations: [],
      imports: [],
      sourceCode: `data class ExportSummary(
    val screenCount: Int,
    val navGraphCount: Int,
    val totalBytes: Long,
    val outputDirectory: String
)`,
    },
    properties: [
      { name: 'screenCount', type: 'Int', default: '—', description: 'Number of screens exported.' },
      { name: 'navGraphCount', type: 'Int', default: '—', description: 'Number of nav graphs exported.' },
      { name: 'totalBytes', type: 'Long', default: '—', description: 'Combined byte size of all exported JSON files.' },
      { name: 'outputDirectory', type: 'String', default: '—', description: 'Absolute path of the export output directory.' },
    ],
    usage: `val summary = result.writeTo(File("ketoy-export"))
println(summary)
// ╔════════════════════════════════════════════╗
// ║     Ketoy Production Export Complete       ║
// ╚════════════════════════════════════════════╝
//   Screens:     5
//   Nav graphs:  2
//   Total size:  12.3 KB
//   Output:      /path/to/ketoy-export`,
    notes: 'Nested inside KetoyProductionExport. toString() uses formatted box-drawing characters. Byte sizes are auto-formatted to B/KB/MB.',
    seeAlso: ['ExportResult', 'KetoyProductionExport'],
  },

  /* ── Export > Nav Loader ── */

  KetoyProductionNavLoader: {
    name: 'KetoyProductionNavLoader',
    kind: 'object',
    module: 'export',
    subpackage: 'loader',
    category: 'Export',
    subcategory: 'Nav Loader',
    description: 'Loads production navigation manifests and individual nav graph JSONs. The production counterpart to the dev-server\'s live nav graph loading. Use this to initialize navigation from exported JSON files at app startup. After loading, all nav graphs are available via KetoyNavRegistry.',
    android: {
      packageName: 'com.developerstring.ketoy.export',
      annotations: [],
      imports: [
        'import com.developerstring.ketoy.navigation.KetoyNavGraph',
        'import com.developerstring.ketoy.navigation.KetoyNavRegistry',
        'import kotlinx.serialization.json.Json',
      ],
      sourceCode: `object KetoyProductionNavLoader {

    fun loadManifest(manifestJson: String): List<String> { ... }
    fun loadNavGraph(navGraphJson: String): KetoyNavGraph? { ... }
    fun loadAllFromAssets(context: Context, assetDirectory: String): List<String> { ... }
    fun loadAllFromAssetsComplete(context: Context, assetDirectory: String): Pair<Int, Int> { ... }
}`,
    },
    methods: [
      { name: 'loadManifest(manifestJson: String)', returns: 'List<String>', description: 'Load a navigation manifest JSON and register all contained nav graphs. Returns list of nav host names that were registered.' },
      { name: 'loadNavGraph(navGraphJson: String)', returns: 'KetoyNavGraph?', description: 'Load a single nav graph JSON and register it. Returns the registered nav graph, or null on parse failure.' },
      { name: 'loadAllFromAssets(context: Context, assetDirectory: String)', returns: 'List<String>', description: 'Load all nav_*.json files and the navigation manifest from an Android asset directory. Tries manifest first, then individual files. Returns list of registered nav host names.' },
      { name: 'loadAllFromAssetsComplete(context: Context, assetDirectory: String)', returns: 'Pair<Int, Int>', description: 'Load all screens and navigation from an asset directory. Single-call production initialiser. Returns a Pair of (screen count, nav graph count).' },
    ],
    usage: `// Loading from a navigation manifest
val manifestJson = assets.open("ketoy-export/navigation_manifest.json")
    .bufferedReader().readText()
KetoyProductionNavLoader.loadManifest(manifestJson)

// Loading individual nav graphs
val mainNavJson = assets.open("ketoy-export/nav_main.json")
    .bufferedReader().readText()
KetoyProductionNavLoader.loadNavGraph(mainNavJson)

// Loading all from an asset directory
KetoyProductionNavLoader.loadAllFromAssets(context, "ketoy-export")

// Single-call complete loading (screens + nav)
val (screens, navGraphs) = KetoyProductionNavLoader
    .loadAllFromAssetsComplete(this, "ketoy-export")
Log.d("Ketoy", "Loaded \$screens screens, \$navGraphs nav graphs")`,
    notes: 'loadAllFromAssets tries navigation_manifest.json first; if not found, falls back to individual nav_*.json files. loadAllFromAssetsComplete also loads screen *.json files into KetoyScreenRegistry. All errors are logged to stderr and non-fatal.',
    seeAlso: ['KetoyProductionExport', 'KetoyNavGraph', 'KetoyNavRegistry', 'KetoyScreenRegistry', 'KetoyNavHost'],
  },
}

export default exportData
