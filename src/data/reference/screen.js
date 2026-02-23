/**
 * Ketoy SDK – Screen Module
 * Package: com.developerstring.ketoy.screen
 */

const screenData = {

  /* ── Screen > Content ── */

  KetoyContent: {
    name: 'KetoyContent',
    kind: '@Composable function',
    module: 'screen',
    subpackage: 'content',
    category: 'Screen',
    subcategory: 'Content',
    description: 'A child composable that represents one DSL content block inside a ProvideKetoyScreen-wrapped parent. Each KetoyContent is identified by a unique name (default "main"), allowing a single screen to contain multiple DSL content blocks freely interleaved with native Jetpack Compose code. Self-registers its content entry with the parent KetoyScreen and renders the DSL-driven UI in-place using the screen\'s full resolution chain.',
    android: {
      packageName: 'com.developerstring.ketoy.screen',
      annotations: ['@Composable'],
      imports: [
        'import androidx.compose.runtime.*',
        'import com.developerstring.ketoy.dsl.KUniversalScope',
        'import com.developerstring.ketoy.model.KNode',
      ],
      sourceCode: `@Composable
fun KetoyContent(
    name: String = "main",
    nodeBuilder: (() -> KNode)? = null,
    dslBuilder: (KUniversalScope.() -> Unit)? = null
)

// Convenience overload with trailing-lambda for inline DSL
@Composable
fun KetoyContent(
    name: String = "main",
    dslBuilder: KUniversalScope.() -> Unit
)`,
    },
    properties: [
      { name: 'name', type: 'String', default: '"main"', description: 'Identifies this content block within the screen. Must be unique among siblings.' },
      { name: 'nodeBuilder', type: '(() -> KNode)?', default: 'null', description: 'A lambda returning a KNode tree. Takes precedence over dslBuilder.' },
      { name: 'dslBuilder', type: '(KUniversalScope.() -> Unit)?', default: 'null', description: 'Inline DSL builder using KUniversalScope. If both nodeBuilder and dslBuilder are provided, nodeBuilder is used.' },
    ],
    usage: `// Single content
@Composable
fun HomeScreen() {
    ProvideKetoyScreen(screenName = "home") {
        KetoyContent(nodeBuilder = { buildHomeUI() })
    }
}

// Mixed Compose + DSL
@Composable
fun DashboardScreen() {
    ProvideKetoyScreen(screenName = "dashboard") {
        KetoyContent(name = "cards", nodeBuilder = { buildCards() })
        Text("Native Compose section")
        KetoyContent(name = "transactions", nodeBuilder = { buildTxns() })
        Button(onClick = {}) { Text("Compose Button") }
    }
}

// Trailing-lambda DSL
KetoyContent("body") {
    KText("Hello from DSL")
}`,
    notes: 'Resolution order (inherited from parent KetoyScreen): 1. Dev-server override (hot-reload JSON) 2. Ketoy Cloud (if configured) 3. Local JSON 4. Asset file 5. Composable fallback 6. DSL fallback 7. "Empty content" placeholder. Throws IllegalStateException if used outside ProvideKetoyScreen.',
    seeAlso: ['ProvideKetoyScreen', 'KetoyScreen', 'LocalKetoyScreen', 'KUniversalScope', 'KNode'],
  },

  /* ── Screen > Screen ── */

  LocalKetoyScreen: {
    name: 'LocalKetoyScreen',
    kind: 'CompositionLocal',
    module: 'screen',
    subpackage: 'screen',
    category: 'Screen',
    subcategory: 'Screen',
    description: 'CompositionLocal that provides the current KetoyScreen to child composables. Set automatically by ProvideKetoyScreen so that KetoyContent can look up its parent screen without an explicit parameter.',
    android: {
      packageName: 'com.developerstring.ketoy.screen',
      annotations: [],
      imports: [
        'import androidx.compose.runtime.staticCompositionLocalOf',
      ],
      sourceCode: `val LocalKetoyScreen = staticCompositionLocalOf<KetoyScreen?> { null }`,
    },
    properties: [
      { name: 'current', type: 'KetoyScreen?', default: 'null', description: 'The current KetoyScreen provided by a parent ProvideKetoyScreen, or null when outside any screen scope.' },
    ],
    usage: `@Composable
fun MyWidget() {
    val screen = LocalKetoyScreen.current
        ?: error("Must be inside a ProvideKetoyScreen block")
    Text("Screen: \${screen.screenName}")
}`,
    notes: 'Returns null if no ProvideKetoyScreen is installed in the composition tree. Always check for null or use the error pattern shown in usage.',
    seeAlso: ['ProvideKetoyScreen', 'KetoyScreen', 'KetoyContent'],
  },

  ProvideKetoyScreen: {
    name: 'ProvideKetoyScreen',
    kind: '@Composable function',
    module: 'screen',
    subpackage: 'screen',
    category: 'Screen',
    subcategory: 'Screen',
    description: 'The primary entry point for every Ketoy screen. Creates (or retrieves) a KetoyScreen and provides it to child composables via LocalKetoyScreen. If a screen with the given screenName already exists in KetoyScreenRegistry, it is reused; otherwise a new KetoyScreen is created and registered automatically.',
    android: {
      packageName: 'com.developerstring.ketoy.screen',
      annotations: ['@Composable'],
      imports: [
        'import androidx.compose.runtime.*',
      ],
      sourceCode: `@Composable
fun ProvideKetoyScreen(
    screenName: String,
    cloudEnabled: Boolean = true,
    colorScheme: KetoyColorScheme? = null,
    content: @Composable () -> Unit
) {
    val screen = remember(screenName) {
        KetoyScreenRegistry.get(screenName)
            ?: KetoyScreen(
                screenName = screenName,
                cloudEnabled = cloudEnabled,
                colorScheme = colorScheme
            ).also { KetoyScreenRegistry.register(it) }
    }
    CompositionLocalProvider(LocalKetoyScreen provides screen) {
        content()
    }
}`,
    },
    properties: [
      { name: 'screenName', type: 'String', default: '—', description: 'Unique screen identifier used for cloud lookup, dev-server hot reload, and JSON export.' },
      { name: 'cloudEnabled', type: 'Boolean', default: 'true', description: 'Whether Ketoy Cloud fetching is enabled for this screen.' },
      { name: 'colorScheme', type: 'KetoyColorScheme?', default: 'null', description: 'Optional KetoyColorScheme override for DSL rendering.' },
      { name: 'content', type: '@Composable () -> Unit', default: '—', description: 'The screen\'s composable body. Typically contains one or more KetoyContent blocks and/or native Compose code.' },
    ],
    usage: `// Single-content screen
@Composable
fun HomeScreen() {
    ProvideKetoyScreen(screenName = "home") {
        KetoyContent(nodeBuilder = { buildHomeUI() })
    }
}

// Multi-content screen (mixed Compose + DSL)
@Composable
fun DashboardScreen() {
    ProvideKetoyScreen(screenName = "dashboard") {
        KetoyContent(name = "cards", nodeBuilder = { buildCards() })
        Text("Native Compose expenses section")
        KetoyContent(name = "transactions", nodeBuilder = { buildTxns() })
        Button(onClick = {}) { Text("Compose Button") }
    }
}`,
    notes: 'If a screen with the given name already exists in KetoyScreenRegistry, it is reused. Otherwise a new KetoyScreen is created and auto-registered.',
    seeAlso: ['KetoyScreen', 'KetoyContent', 'KetoyScreenRegistry', 'LocalKetoyScreen', 'KetoyColorScheme'],
  },

  KetoyScreen: {
    name: 'KetoyScreen',
    kind: 'class',
    module: 'screen',
    subpackage: 'screen',
    category: 'Screen',
    subcategory: 'Screen',
    description: 'Represents a server-driven screen in the Ketoy SDUI framework. A single KetoyScreen can hold multiple content entries identified by a unique name (default "main"). This allows a @KScreen composable to contain several KetoyContent blocks that are exported together into a single JSON file. Screen-wide metadata (screenName, displayName, description, version) lives here, not in individual content blocks.',
    android: {
      packageName: 'com.developerstring.ketoy.screen',
      annotations: [],
      imports: [
        'import com.developerstring.ketoy.cloud.KetoyCloudService',
        'import com.developerstring.ketoy.dsl.KUniversalScope',
        'import com.developerstring.ketoy.model.KNode',
        'import com.developerstring.ketoy.renderer.JSONStringToUI',
        'import com.developerstring.ketoy.theme.KetoyColorScheme',
      ],
      sourceCode: `class KetoyScreen(
    val screenName: String,
    val displayName: String = screenName.replace("_", " ")
        .replaceFirstChar { it.uppercaseChar() },
    val description: String = "",
    val version: String = "1.0.0",
    val cloudEnabled: Boolean = true,
    val colorScheme: KetoyColorScheme? = null
)`,
    },
    properties: [
      { name: 'screenName', type: 'String', default: '—', description: 'Unique identifier used for cloud fetching, dev-server hot reload, and JSON export (e.g. "home_screen").' },
      { name: 'displayName', type: 'String', default: 'derived from screenName', description: 'Human-readable name derived from screenName by default (underscores replaced, first char capitalised).' },
      { name: 'description', type: 'String', default: '""', description: 'Optional description of the screen\'s purpose.' },
      { name: 'version', type: 'String', default: '"1.0.0"', description: 'Semantic version string (e.g. "1.0.0").' },
      { name: 'cloudEnabled', type: 'Boolean', default: 'true', description: 'Whether cloud fetching is enabled for this screen.' },
      { name: 'colorScheme', type: 'KetoyColorScheme?', default: 'null', description: 'Optional KetoyColorScheme override applied when rendering the DSL or JSON UI tree.' },
      { name: 'contents', type: 'Map<String, ContentEntry>', default: '{}', description: 'Read-only view of all content entries keyed by name.' },
      { name: 'devOverrideJson', type: 'String?', default: 'null', description: 'Legacy: get/set the "main" content\'s dev-server override JSON. Prefer setDevOverride for the multi-content API.' },
      { name: 'routeName', type: 'String', default: '= screenName', description: 'Legacy: routeName alias for screenName.' },
    ],
    methods: [
      { name: 'addContent(name, jsonContent?, dslBuilder?, nodeBuilder?, composableBuilder?, assetPath?)', returns: 'KetoyScreen', description: 'Add (or replace) a content entry in this screen. Returns this KetoyScreen for chaining.' },
      { name: 'getContent(name)', returns: 'ContentEntry?', description: 'Get a content entry by its ID. Returns null if not found.' },
      { name: 'contentNames()', returns: 'Set<String>', description: 'All content names registered in this screen.' },
      { name: 'setDevOverride(name, json)', returns: 'Unit', description: 'Set a dev-server override for a specific content block. Passing null removes the override.' },
      { name: 'setScreenDevOverride(json)', returns: 'Unit', description: 'Set a screen-level dev-server override from JSON that uses the { "contents": { "name": {...} } } wrapper format.' },
      { name: 'getDevOverride(name)', returns: 'String?', description: 'Get the dev-server override JSON for a specific content block.' },
      { name: 'buildDslJson()', returns: 'String?', description: 'Build the "main" content\'s DSL to a JSON string.' },
      { name: 'buildDslNode()', returns: 'KNode?', description: 'Build the "main" content\'s DSL to a KNode tree.' },
      { name: 'buildAllJson()', returns: 'Map<String, String?>', description: 'Build all contents\' DSL to a JSON map (name → json).' },
      { name: 'buildExportJson()', returns: 'String?', description: 'Builds the export JSON for this screen in multi-content wrapper format.' },
      { name: 'Content(name, colorScheme?, loadingContent, errorContent)', returns: 'Unit', description: '@Composable. Renders a specific content entry using the full resolution order: devOverride → cloud → local JSON → asset → composable → DSL → empty.' },
    ],
    innerClasses: [
      {
        name: 'ContentEntry',
        kind: 'data class',
        description: 'A single content block within a KetoyScreen. Each entry represents one KetoyContent region that can be independently rendered or exported.',
        properties: [
          { name: 'name', type: 'String', default: '—', description: 'Unique identifier within the parent screen (default "main").' },
          { name: 'jsonContent', type: 'String?', default: 'null', description: 'Static JSON string for the UI tree; null when content is provided via DSL or composable.' },
          { name: 'dslBuilder', type: '(KUniversalScope.() -> Unit)?', default: 'null', description: 'Inline DSL builder using KUniversalScope.' },
          { name: 'nodeBuilder', type: '(() -> KNode)?', default: 'null', description: 'Lambda returning a KNode tree directly. Takes precedence over dslBuilder.' },
          { name: 'composableBuilder', type: '(@Composable () -> Unit)?', default: 'null', description: 'A @Composable lambda rendered as-is.' },
          { name: 'assetPath', type: 'String?', default: 'null', description: 'Path to a local JSON asset file.' },
        ],
        methods: [
          { name: 'buildNode()', returns: 'KNode?', description: 'Build the DSL to a KNode tree. Prefers nodeBuilder over dslBuilder. Returns null if neither is set.' },
          { name: 'buildJson()', returns: 'String?', description: 'Build the DSL to a JSON string. Delegates to buildNode and serialises via KNode.toJson.' },
        ],
      },
    ],
    usage: `// Factory: from inline DSL
val screen = KetoyScreen.create("home") {
    KColumn {
        KText("Hello World")
    }
}

// Factory: from KNode builder
val screen = KetoyScreen.fromNode("profile") {
    buildProfileNode()
}

// Factory: from raw JSON
val screen = KetoyScreen.fromJson("home", homeJsonString)

// Factory: from composable
val screen = KetoyScreen.fromComposable("settings") {
    SettingsPageComposable()
}

// Factory: from asset file
val screen = KetoyScreen.fromAsset(
    screenName = "onboarding",
    assetPath  = "screens/onboarding.json"
)

// Multi-content export JSON format:
// {
//   "screenName": "dashboard",
//   "displayName": "Dashboard",
//   "version": "1.0.0",
//   "contents": {
//     "cards":        { "type": "Column", ... },
//     "transactions": { "type": "LazyColumn", ... }
//   }
// }`,
    notes: 'Content resolution order inside Content(): 1. Dev-server override 2. Cloud (if configured) 3. Local JSON 4. Asset 5. Composable 6. DSL fallback 7. Empty placeholder. Companion factory methods: create, fromNode, fromJson, fromComposable, fromAsset.',
    seeAlso: ['ProvideKetoyScreen', 'KetoyContent', 'KetoyScreenRegistry', 'KetoyCloudService', 'ContentEntry', 'LocalKetoyScreen'],
  },

  ContentEntry: {
    name: 'ContentEntry',
    kind: 'data class',
    module: 'screen',
    subpackage: 'screen',
    category: 'Screen',
    subcategory: 'Screen',
    description: 'A single content block within a KetoyScreen. Each entry represents one KetoyContent region that can be independently rendered or exported. Nested inside KetoyScreen.',
    android: {
      packageName: 'com.developerstring.ketoy.screen',
      annotations: [],
      imports: [
        'import com.developerstring.ketoy.dsl.KUniversalScope',
        'import com.developerstring.ketoy.model.KNode',
      ],
      sourceCode: `data class ContentEntry(
    val name: String,
    val jsonContent: String? = null,
    val dslBuilder: (KUniversalScope.() -> Unit)? = null,
    val nodeBuilder: (() -> KNode)? = null,
    val composableBuilder: (@Composable () -> Unit)? = null,
    val assetPath: String? = null
) {
    fun buildNode(): KNode? { ... }
    fun buildJson(): String? { ... }
}`,
    },
    properties: [
      { name: 'name', type: 'String', default: '—', description: 'Unique identifier within the parent screen (default "main").' },
      { name: 'jsonContent', type: 'String?', default: 'null', description: 'Static JSON string for the UI tree; null when content is provided via DSL or composable.' },
      { name: 'dslBuilder', type: '(KUniversalScope.() -> Unit)?', default: 'null', description: 'Inline DSL builder using KUniversalScope.' },
      { name: 'nodeBuilder', type: '(() -> KNode)?', default: 'null', description: 'Lambda returning a KNode tree directly. Takes precedence over dslBuilder.' },
      { name: 'composableBuilder', type: '(@Composable () -> Unit)?', default: 'null', description: 'A @Composable lambda rendered as-is.' },
      { name: 'assetPath', type: 'String?', default: 'null', description: 'Path to a local JSON asset file.' },
    ],
    methods: [
      { name: 'buildNode()', returns: 'KNode?', description: 'Build the DSL to a KNode tree. Prefers nodeBuilder over dslBuilder. Returns null if neither builder is set.' },
      { name: 'buildJson()', returns: 'String?', description: 'Build the DSL to a JSON string. Delegates to buildNode and serialises the resulting KNode via KNode.toJson.' },
    ],
    usage: `val entry = ContentEntry(
    name = "header",
    nodeBuilder = { buildHeaderNode() }
)
val json: String? = entry.buildJson()
val node: KNode? = entry.buildNode()`,
    notes: 'Nested inside KetoyScreen. Created via KetoyScreen.addContent() or by KetoyContent composable self-registration.',
    seeAlso: ['KetoyScreen', 'KetoyContent', 'KNode', 'KUniversalScope'],
  },

  /* ── Screen > Annotation ── */

  KScreen: {
    name: 'KScreen',
    kind: 'annotation',
    module: 'screen',
    subpackage: 'annotation',
    category: 'Screen',
    subcategory: 'Annotation',
    description: 'Optional marker annotation for Ketoy screen composables. Not required for Ketoy to work at runtime — the runtime mechanism is ProvideKetoyScreen. Use @KScreen only when you want external tools (e.g. the Ketoy Dev Tools CLI or IDE plugins) to discover screen functions via reflection.',
    android: {
      packageName: 'com.developerstring.ketoy.screen',
      annotations: ['@Target(AnnotationTarget.FUNCTION)', '@Retention(AnnotationRetention.RUNTIME)'],
      imports: [],
      sourceCode: `@Target(AnnotationTarget.FUNCTION)
@Retention(AnnotationRetention.RUNTIME)
annotation class KScreen(val name: String = "")`,
    },
    properties: [
      { name: 'name', type: 'String', default: '""', description: 'The unique screen identifier. Only needed if external tools scan for @KScreen via reflection. Leave empty to rely on ProvideKetoyScreen\'s screenName parameter.' },
    ],
    usage: `// Recommended pattern (no annotation needed)
@Composable
fun HomeScreen() {
    ProvideKetoyScreen(screenName = "home") {
        KetoyContent(nodeBuilder = { buildHomeUI() })
    }
}

// With annotation (optional, for tooling discovery)
@KScreen(name = "home")
@Composable
fun HomeScreen() {
    ProvideKetoyScreen(screenName = "home") {
        KetoyContent(nodeBuilder = { buildHomeUI() })
    }
}`,
    notes: 'RUNTIME retention — tools can discover @KScreen functions at runtime via reflection. The annotation is entirely optional; ProvideKetoyScreen is the actual runtime mechanism.',
    seeAlso: ['ProvideKetoyScreen', 'KetoyContent', 'KetoyScreen', 'KetoyScreenRegistry'],
  },

  /* ── Screen > Registry ── */

  KetoyScreenRegistry: {
    name: 'KetoyScreenRegistry',
    kind: 'object',
    module: 'screen',
    subpackage: 'registry',
    category: 'Screen',
    subcategory: 'Registry',
    description: 'Global singleton registry for KetoyScreen instances. Every screen must be registered here before navigation, KetoyView, or KetoyCloudScreen can resolve it by name. Registration happens automatically via ProvideKetoyScreen / KetoyContent, or can be done explicitly during Ketoy.initialize().',
    android: {
      packageName: 'com.developerstring.ketoy.screen',
      annotations: [],
      imports: [],
      sourceCode: `object KetoyScreenRegistry {

    private val screens = mutableMapOf<String, KetoyScreen>()

    fun register(screen: KetoyScreen) { ... }
    fun registerAll(vararg screenList: KetoyScreen) { ... }
    fun registerAll(screenList: List<KetoyScreen>) { ... }
    fun get(screenName: String): KetoyScreen? { ... }
    fun getAllRoutes(): Set<String> { ... }
    fun getAll(): Map<String, KetoyScreen> { ... }
    fun isRegistered(screenName: String): Boolean { ... }
    fun count(): Int { ... }
    fun remove(screenName: String): Boolean { ... }
    fun clear() { ... }
    fun registerFromJsonMap(jsonScreens: Map<String, String>) { ... }
    fun registerFromAssets(assetScreens: Map<String, String>) { ... }
}`,
    },
    methods: [
      { name: 'register(screen: KetoyScreen)', returns: 'Unit', description: 'Register a KetoyScreen. Replaces any existing screen with the same screenName.' },
      { name: 'registerAll(vararg screenList: KetoyScreen)', returns: 'Unit', description: 'Register multiple screens at once (vararg).' },
      { name: 'registerAll(screenList: List<KetoyScreen>)', returns: 'Unit', description: 'Register multiple screens from a collection.' },
      { name: 'get(screenName: String)', returns: 'KetoyScreen?', description: 'Get a screen by its screen name, or null if not registered.' },
      { name: 'getAllRoutes()', returns: 'Set<String>', description: 'Returns the names of all registered screens.' },
      { name: 'getAll()', returns: 'Map<String, KetoyScreen>', description: 'Returns all registered screens as an immutable map of name → screen.' },
      { name: 'isRegistered(screenName: String)', returns: 'Boolean', description: 'Check whether a screen with the given name is registered.' },
      { name: 'count()', returns: 'Int', description: 'Returns the number of registered screens.' },
      { name: 'remove(screenName: String)', returns: 'Boolean', description: 'Remove a screen by name. Returns true if the screen was found and removed.' },
      { name: 'clear()', returns: 'Unit', description: 'Clear all registered screens. Primarily useful in tests or when resetting the SDK.' },
      { name: 'registerFromJsonMap(jsonScreens: Map<String, String>)', returns: 'Unit', description: 'Register screens from a map of screen name → JSON content. Each entry creates a KetoyScreen.fromJson instance.' },
      { name: 'registerFromAssets(assetScreens: Map<String, String>)', returns: 'Unit', description: 'Register screens from asset paths. Each entry creates a KetoyScreen.fromAsset instance.' },
    ],
    usage: `// Register a single screen
KetoyScreenRegistry.register(
    KetoyScreen.fromJson("home", homeJson)
)

// Register multiple screens
KetoyScreenRegistry.registerAll(
    KetoyScreen.fromJson("home", homeJson),
    KetoyScreen.fromJson("profile", profileJson)
)

// Bulk-load from JSON map
KetoyScreenRegistry.registerFromJsonMap(
    mapOf("home" to homeJson, "settings" to settingsJson)
)

// Bulk-load from assets
KetoyScreenRegistry.registerFromAssets(
    mapOf("home" to "screens/home.json", "profile" to "screens/profile.json")
)

// Retrieve a screen
val screen: KetoyScreen? = KetoyScreenRegistry.get("home")`,
    notes: 'Singleton object — all registrations are global. ProvideKetoyScreen auto-registers screens, so explicit registration is only needed for programmatic setup (e.g. in Ketoy.initialize).',
    seeAlso: ['KetoyScreen', 'ProvideKetoyScreen', 'KetoyView', 'Ketoy'],
  },

  /* ── Screen > View ── */

  KetoyView: {
    name: 'KetoyView',
    kind: '@Composable function',
    module: 'screen',
    subpackage: 'view',
    category: 'Screen',
    subcategory: 'View',
    description: 'Primary composable for rendering a Ketoy screen by its registered name. Looks up a KetoyScreen in KetoyScreenRegistry and renders its content using the full resolution chain. Falls back to errorContent if the screen has not been registered.',
    android: {
      packageName: 'com.developerstring.ketoy.screen',
      annotations: ['@Composable'],
      imports: [
        'import androidx.compose.ui.Modifier',
      ],
      sourceCode: `@Composable
fun KetoyView(
    screenName: String,
    modifier: Modifier = Modifier,
    loadingContent: @Composable () -> Unit = { DefaultLoadingContent() },
    errorContent: @Composable (String) -> Unit = { msg -> DefaultErrorContent(msg) }
)`,
    },
    properties: [
      { name: 'screenName', type: 'String', default: '—', description: 'The name identifying the screen in KetoyScreenRegistry.' },
      { name: 'modifier', type: 'Modifier', default: 'Modifier', description: 'Optional Modifier applied to the root container.' },
      { name: 'loadingContent', type: '@Composable () -> Unit', default: 'DefaultLoadingContent()', description: 'Composable shown while loading async screens. Defaults to a centred CircularProgressIndicator.' },
      { name: 'errorContent', type: '@Composable (String) -> Unit', default: 'DefaultErrorContent(msg)', description: 'Composable shown when the screen cannot be found or loaded. Receives a human-readable error message.' },
    ],
    usage: `// From a registered screen
KetoyScreenRegistry.register(
    KetoyScreen.fromJson("home", homeJson)
)

@Composable
fun App() {
    KetoyView(screenName = "home")
}

// With custom error UI
KetoyView(
    screenName   = "settings",
    errorContent = { msg -> Text("Error: \$msg") }
)`,
    notes: 'Requires the screen to be registered in KetoyScreenRegistry before rendering. Falls back to errorContent composable if not found.',
    seeAlso: ['KetoyViewFromJson', 'KetoyViewFromAsset', 'KetoyViewFromNetwork', 'KetoyScreenRegistry', 'KetoyScreen'],
  },

  KetoyViewFromJson: {
    name: 'KetoyViewFromJson',
    kind: '@Composable function',
    module: 'screen',
    subpackage: 'view',
    category: 'Screen',
    subcategory: 'View',
    description: 'Render a Ketoy screen from a raw JSON string. Directly invokes the JSONStringToUI renderer — no registry lookup or caching is involved.',
    android: {
      packageName: 'com.developerstring.ketoy.screen',
      annotations: ['@Composable'],
      imports: [
        'import com.developerstring.ketoy.renderer.JSONStringToUI',
      ],
      sourceCode: `@Composable
fun KetoyViewFromJson(
    json: String,
    modifier: Modifier = Modifier
) {
    Box(modifier = modifier) {
        JSONStringToUI(json)
    }
}`,
    },
    properties: [
      { name: 'json', type: 'String', default: '—', description: 'The raw JSON string describing the Ketoy UI tree.' },
      { name: 'modifier', type: 'Modifier', default: 'Modifier', description: 'Optional Modifier applied to the root container.' },
    ],
    usage: `val json = """{ "type": "Text", "text": "Hello" }"""
KetoyViewFromJson(json = json)`,
    notes: 'No registry lookup or caching. Expected JSON format: { "type": "Column", "children": [ { "type": "Text", "text": "Hello, World!" } ] }.',
    seeAlso: ['KetoyView', 'JSONStringToUI', 'KetoyViewFromAsset', 'KetoyViewFromNetwork'],
  },

  KetoyViewFromAsset: {
    name: 'KetoyViewFromAsset',
    kind: '@Composable function',
    module: 'screen',
    subpackage: 'view',
    category: 'Screen',
    subcategory: 'View',
    description: 'Render a Ketoy screen from a local Android asset JSON file. Loads the file asynchronously on Dispatchers.IO and renders the UI tree once the content is available.',
    android: {
      packageName: 'com.developerstring.ketoy.screen',
      annotations: ['@Composable'],
      imports: [
        'import com.developerstring.ketoy.renderer.JSONStringToUI',
        'import kotlinx.coroutines.Dispatchers',
        'import kotlinx.coroutines.withContext',
      ],
      sourceCode: `@Composable
fun KetoyViewFromAsset(
    assetPath: String,
    modifier: Modifier = Modifier,
    loadingContent: @Composable () -> Unit = { DefaultLoadingContent() },
    errorContent: @Composable (String) -> Unit = { msg -> DefaultErrorContent(msg) }
)`,
    },
    properties: [
      { name: 'assetPath', type: 'String', default: '—', description: 'Relative path inside the Android assets/ directory (e.g. "screens/home.json").' },
      { name: 'modifier', type: 'Modifier', default: 'Modifier', description: 'Optional Modifier applied to the root container.' },
      { name: 'loadingContent', type: '@Composable () -> Unit', default: 'DefaultLoadingContent()', description: 'Composable shown while reading the file.' },
      { name: 'errorContent', type: '@Composable (String) -> Unit', default: 'DefaultErrorContent(msg)', description: 'Composable shown when reading fails.' },
    ],
    usage: `KetoyViewFromAsset(assetPath = "screens/onboarding.json")`,
    notes: 'Loads file asynchronously on Dispatchers.IO. Shows loadingContent while reading, errorContent on failure.',
    seeAlso: ['KetoyView', 'KetoyViewFromJson', 'KetoyViewFromNetwork'],
  },

  KetoyViewFromNetwork: {
    name: 'KetoyViewFromNetwork',
    kind: '@Composable function',
    module: 'screen',
    subpackage: 'view',
    category: 'Screen',
    subcategory: 'View',
    description: 'Render a Ketoy screen from a network URL. Fetches the JSON asynchronously via HttpURLConnection and renders the UI tree once the download completes. Custom HTTP headers can be provided for authentication or caching.',
    android: {
      packageName: 'com.developerstring.ketoy.screen',
      annotations: ['@Composable'],
      imports: [
        'import com.developerstring.ketoy.renderer.JSONStringToUI',
        'import kotlinx.coroutines.Dispatchers',
        'import kotlinx.coroutines.withContext',
      ],
      sourceCode: `@Composable
fun KetoyViewFromNetwork(
    url: String,
    modifier: Modifier = Modifier,
    headers: Map<String, String> = emptyMap(),
    loadingContent: @Composable () -> Unit = { DefaultLoadingContent() },
    errorContent: @Composable (String) -> Unit = { msg -> DefaultErrorContent(msg) }
)`,
    },
    properties: [
      { name: 'url', type: 'String', default: '—', description: 'Fully-qualified URL returning a Ketoy JSON payload.' },
      { name: 'modifier', type: 'Modifier', default: 'Modifier', description: 'Optional Modifier applied to the root container.' },
      { name: 'headers', type: 'Map<String, String>', default: 'emptyMap()', description: 'Optional HTTP headers appended to the request (e.g. for authentication).' },
      { name: 'loadingContent', type: '@Composable () -> Unit', default: 'DefaultLoadingContent()', description: 'Composable shown while downloading.' },
      { name: 'errorContent', type: '@Composable (String) -> Unit', default: 'DefaultErrorContent(msg)', description: 'Composable shown on network or parse failure.' },
    ],
    usage: `KetoyViewFromNetwork(
    url     = "https://api.example.com/screens/promo",
    headers = mapOf("Authorization" to "Bearer token123")
)`,
    notes: 'Uses java.net.HttpURLConnection internally. Fetches asynchronously on Dispatchers.IO. For production apps with caching, prefer KetoyCloudScreen instead.',
    seeAlso: ['KetoyView', 'KetoyViewFromJson', 'KetoyViewFromAsset', 'KetoyCloudScreen'],
  },
}

export default screenData
