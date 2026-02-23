/**
 * Ketoy SDK – Navigation Module
 * Package: com.developerstring.ketoy.navigation
 * Sub-packages: controller, graph, host, executor, navigator, registry, overrides, models
 *
 * Contains the full navigation system: KetoyNavHost, KetoyNavController,
 * KetoyNavGraph, KetoyNavigator, KetoyNavigationExecutor, composable/nav registries,
 * override layers (dev-server & cloud), route models, and action models.
 */

const navigationData = {

  /* ══════════════════════════════════════════════════════════════
   *  Navigation > Route
   * ══════════════════════════════════════════════════════════════ */

  KetoyRoute: {
    name: 'KetoyRoute',
    kind: 'interface',
    module: 'navigation',
    subpackage: 'route',
    category: 'Navigation',
    subcategory: 'Route',
    description: 'Marker interface for type-safe Ketoy navigation routes. Implement on @Serializable data object or data class types to define type-safe destinations for KetoyNavHost, following the Navigation Compose 2.8+ pattern. Works alongside string-based routes for a hybrid approach.',
    android: {
      packageName: 'com.developerstring.ketoy.navigation',
      annotations: [],
      imports: [
        'import kotlinx.serialization.Serializable',
      ],
      sourceCode: `interface KetoyRoute`,
    },
    properties: [],
    usage: `// Define type-safe routes
@Serializable
data object Home : KetoyRoute

@Serializable
data object Profile : KetoyRoute

@Serializable
data class Detail(val id: String) : KetoyRoute

@Serializable
data class Product(
    val productId: Int,
    val from: String = "home"   // default values supported
) : KetoyRoute

// Use in KetoyNavHost
KetoyNavHost(startRoute = Home) {
    screen<Home> { HomeScreen() }
    screen<Profile> { ProfileScreen() }
    screen<Detail> { route ->
        DetailScreen(id = route.id)
    }
    screen<Product> { route ->
        ProductScreen(
            productId = route.productId,
            from = route.from
        )
    }
}

// Navigate
val nav = LocalKetoyNavController.current
nav?.navigate(Detail(id = "42"))
nav?.navigateAndReplace(Home)
nav?.navigateAndClearBackStack(Home)

// Extract the current route
val detail: Detail? = nav?.currentRouteAs<Detail>()`,
    notes: 'String-based routes remain fully supported for JSON-driven / dynamic navigation via KNavigateAction and KetoyNavigator. Type-safe routes and string routes can coexist in the same KetoyNavHost.',
    seeAlso: ['KetoyNavHost', 'KetoyNavController', 'KetoyNavGraphScope'],
  },

  /* ══════════════════════════════════════════════════════════════
   *  Navigation > Nav Graph
   * ══════════════════════════════════════════════════════════════ */

  KetoyNavDestination: {
    name: 'KetoyNavDestination',
    kind: 'data class',
    module: 'navigation',
    subpackage: 'graph',
    category: 'Navigation',
    subcategory: 'Nav Graph',
    description: 'Describes a single navigation destination inside a KetoyNavGraph. Maps a stable ID to an actual Navigation Compose route, along with metadata for building data-driven navigation UI (bottom bars, drawers, labels, icons).',
    android: {
      packageName: 'com.developerstring.ketoy.navigation',
      annotations: ['@Serializable'],
      imports: [
        'import kotlinx.serialization.Serializable',
      ],
      sourceCode: `@Serializable
data class KetoyNavDestination(
    val id: String = "",
    val route: String,
    val screenName: String,
    val label: String = "",
    val icon: String = "",
    val selectedIcon: String = "",
    val isStartDestination: Boolean = false
) {
    val resolvedId: String get() = id.ifEmpty { route }
}`,
    },
    properties: [
      { name: 'id', type: 'String', default: '""', description: 'Stable identifier used by the builder DSL and navigateToRoute. When empty, resolvedId falls back to route.' },
      { name: 'route', type: 'String', default: '—', description: 'The actual route string registered in Navigation Compose.' },
      { name: 'screenName', type: 'String', default: '—', description: 'The Ketoy screen name this destination renders (looked up in KetoyScreenRegistry).' },
      { name: 'label', type: 'String', default: '""', description: 'Human-readable label for UI elements (bottom nav, drawer items).' },
      { name: 'icon', type: 'String', default: '""', description: 'Icon reference string for the unselected state.' },
      { name: 'selectedIcon', type: 'String', default: '""', description: 'Icon reference string for the selected state.' },
      { name: 'isStartDestination', type: 'Boolean', default: 'false', description: 'Whether this destination is the start route of its nav graph.' },
      { name: 'resolvedId', type: 'String', default: '(computed)', description: 'Returns id if non-empty; otherwise falls back to route. Used by buildActionRemaps().' },
    ],
    usage: `// JSON
{
    "id": "home_tab",
    "route": "home",
    "screenName": "HomeScreen",
    "label": "Home",
    "icon": "home",
    "selectedIcon": "home_filled",
    "isStartDestination": true
}

// Kotlin
val dest = KetoyNavDestination(
    id = "profile_tab",
    route = "profile",
    screenName = "ProfileScreen",
    label = "Profile",
    icon = "person",
    selectedIcon = "person_filled"
)`,
    seeAlso: ['KetoyNavGraph', 'KetoyNavAction', 'KetoyNavHost', 'KetoyNavRegistry'],
  },

  KetoyNavAction: {
    name: 'KetoyNavAction',
    kind: 'data class',
    module: 'navigation',
    subpackage: 'graph',
    category: 'Navigation',
    subcategory: 'Nav Graph',
    description: 'A navigation action that maps an action ID to a target route. When the dev server or cloud overrides the nav graph, the route can change dynamically — the same action ID in code navigates to the new target without code changes.',
    android: {
      packageName: 'com.developerstring.ketoy.navigation',
      annotations: ['@Serializable'],
      imports: [
        'import kotlinx.serialization.Serializable',
      ],
      sourceCode: `@Serializable
data class KetoyNavAction(
    val id: String,
    val route: String,
    val label: String = ""
)`,
    },
    properties: [
      { name: 'id', type: 'String', default: '—', description: 'Stable action identifier used in code (e.g. "go_favorites"). Remains constant even when the target route changes via JSON override.' },
      { name: 'route', type: 'String', default: '—', description: 'The default target route string. Overridable via JSON. Changing this in JSON causes all navigateToRoute("go_favorites") calls to navigate to the new route.' },
      { name: 'label', type: 'String', default: '""', description: 'Optional human-readable label for tooling and debugging.' },
    ],
    usage: `// JSON
{
    "id": "go_favorites",
    "route": "favorites",
    "label": "Open Favorites"
}

// Changing "route": "bookmarks" in JSON causes all
// navigateToRoute("go_favorites") calls to navigate to "bookmarks"

// Kotlin
val action = KetoyNavAction(
    id = "go_favorites",
    route = "favorites",
    label = "Open Favorites"
)`,
    seeAlso: ['KetoyNavGraph', 'KetoyNavDestination', 'KetoyNavController'],
  },

  KetoyNavGraph: {
    name: 'KetoyNavGraph',
    kind: 'data class',
    module: 'navigation',
    subpackage: 'graph',
    category: 'Navigation',
    subcategory: 'Nav Graph',
    description: 'Serializable model representing a complete navigation graph for one KetoyNavHost. Contains destinations (screen nodes) and navigations (action edges). Exported to JSON for the dev server and Ketoy Cloud. Editing navigations[*].route in JSON and pushing via dev server or cloud live-updates all matching navigateToRoute() calls.',
    android: {
      packageName: 'com.developerstring.ketoy.navigation',
      annotations: ['@Serializable'],
      imports: [
        'import kotlinx.serialization.Serializable',
        'import kotlinx.serialization.encodeToString',
        'import kotlinx.serialization.json.Json',
      ],
      sourceCode: `@Serializable
data class KetoyNavGraph(
    val navHostName: String,
    val startRoute: String,
    val destinations: List<KetoyNavDestination> = emptyList(),
    val navigations: List<KetoyNavAction> = emptyList()
) {
    companion object {
        fun fromJson(jsonString: String): KetoyNavGraph
        fun toJson(graph: KetoyNavGraph): String
    }

    fun toJson(): String
    fun buildActionRemaps(): Map<String, String>
}`,
    },
    properties: [
      { name: 'navHostName', type: 'String', default: '—', description: 'Unique name identifying this nav graph. Must match the navHostName parameter of KetoyNavHost.' },
      { name: 'startRoute', type: 'String', default: '—', description: 'The default start route string for this nav graph.' },
      { name: 'destinations', type: 'List<KetoyNavDestination>', default: 'emptyList()', description: 'All navigation destinations (screen nodes) in the graph.' },
      { name: 'navigations', type: 'List<KetoyNavAction>', default: 'emptyList()', description: 'All navigation actions (edges) connecting destinations.' },
    ],
    methods: [
      { name: 'toJson()', returns: 'String', description: 'Serialize this nav graph to a pretty-printed JSON string. Default values are included for completeness.' },
      { name: 'buildActionRemaps()', returns: 'Map<String, String>', description: 'Build the action remap table mapping action/destination IDs to resolved target routes. Used by KetoyNavController for route resolution.' },
      { name: 'fromJson(jsonString: String)', returns: 'KetoyNavGraph', description: 'Companion. Deserialize a KetoyNavGraph from a JSON string. Unknown keys are silently ignored (forward-compatible).' },
      { name: 'toJson(graph: KetoyNavGraph)', returns: 'String', description: 'Companion. Serialize a KetoyNavGraph to pretty-printed JSON.' },
    ],
    usage: `// JSON
{
    "navHostName": "main",
    "startRoute": "home",
    "destinations": [
        {
            "id": "home",
            "route": "home",
            "screenName": "HomeScreen",
            "label": "Home",
            "icon": "home"
        },
        {
            "id": "profile",
            "route": "profile",
            "screenName": "ProfileScreen",
            "label": "Profile",
            "icon": "person"
        }
    ],
    "navigations": [
        {
            "id": "go_profile",
            "route": "profile",
            "label": "Open Profile"
        }
    ]
}

// Kotlin
val graph = KetoyNavGraph(
    navHostName = "main",
    startRoute = "home",
    destinations = listOf(
        KetoyNavDestination(id = "home", route = "home", screenName = "HomeScreen"),
        KetoyNavDestination(id = "profile", route = "profile", screenName = "ProfileScreen")
    ),
    navigations = listOf(
        KetoyNavAction(id = "go_profile", route = "profile")
    )
)

// Serialize / deserialize
val json = graph.toJson()
val parsed = KetoyNavGraph.fromJson(json)

// Build remap table for KetoyNavController
val remaps = graph.buildActionRemaps()
// { "home" → "home", "profile" → "profile", "go_profile" → "profile" }`,
    notes: 'The buildActionRemaps() method applies destination remaps first, then navigation action remaps (which take precedence). This allows navigation actions to override destination IDs.',
    seeAlso: ['KetoyNavDestination', 'KetoyNavAction', 'KetoyNavHost', 'KetoyNavRegistry', 'KetoyNavController'],
  },

  KetoyNavRegistry: {
    name: 'KetoyNavRegistry',
    kind: 'object',
    module: 'navigation',
    subpackage: 'graph',
    category: 'Navigation',
    subcategory: 'Nav Graph',
    description: 'Global registry for exportable KetoyNavGraph definitions. Stores navigation graphs that can be exported as JSON for the Ketoy dev server, or looked up at runtime by KetoyNavHost when no dev-server or cloud override is active. Lowest priority in the override chain.',
    android: {
      packageName: 'com.developerstring.ketoy.navigation',
      annotations: [],
      imports: [],
      sourceCode: `object KetoyNavRegistry {

    private val graphs = mutableMapOf<String, KetoyNavGraph>()

    fun register(graph: KetoyNavGraph) { ... }
    fun get(name: String): KetoyNavGraph? = graphs[name]
    fun getAll(): Map<String, KetoyNavGraph> = graphs.toMap()
    fun getAllNames(): Set<String> = graphs.keys.toSet()
    fun clear() { ... }
}`,
    },
    methods: [
      { name: 'register(graph: KetoyNavGraph)', returns: 'Unit', description: 'Register or replace a navigation graph by its navHostName. If a graph with the same name exists, it is silently replaced.' },
      { name: 'get(name: String)', returns: 'KetoyNavGraph?', description: 'Retrieve a registered nav graph by its navHostName. Returns null if not registered.' },
      { name: 'getAll()', returns: 'Map<String, KetoyNavGraph>', description: 'Returns a snapshot of all registered nav graphs as an immutable map.' },
      { name: 'getAllNames()', returns: 'Set<String>', description: 'Returns the set of all registered nav graph names.' },
      { name: 'clear()', returns: 'Unit', description: 'Remove all registered nav graphs. Useful for test teardown.' },
    ],
    usage: `// Register a nav graph
KetoyNavRegistry.register(
    KetoyNavGraph(
        navHostName = "main",
        startRoute = "home",
        destinations = listOf(
            KetoyNavDestination("home", "home", "HomeScreen", "Home", "home"),
            KetoyNavDestination("profile", "profile", "ProfileScreen", "Profile", "person")
        )
    )
)

// Retrieve by name
val graph = KetoyNavRegistry.get("main")

// Export all for the dev server
val allGraphs = KetoyNavRegistry.getAll()`,
    notes: 'Override priority (highest → lowest): 1) KetoyNavDevOverrides — live dev-server reload. 2) KetoyCloudNavOverrides — cloud-fetched graphs. 3) KetoyNavRegistry — compile-time / locally registered.',
    seeAlso: ['KetoyNavGraph', 'KetoyNavHost', 'KetoyNavDevOverrides', 'KetoyCloudNavOverrides'],
  },

  /* ══════════════════════════════════════════════════════════════
   *  Navigation > Nav Host
   * ══════════════════════════════════════════════════════════════ */

  KetoyNavHost: {
    name: 'KetoyNavHost',
    kind: '@Composable function',
    module: 'navigation',
    subpackage: 'host',
    category: 'Navigation',
    subcategory: 'Nav Host',
    description: 'Server-driven Navigation host that renders Ketoy screens. Two overloads: type-safe @Serializable start route and string-based start route. Supports hybrid navigation — both type-safe and string-based routes in the same graph. Automatically resolves nav graph overrides from dev-server, cloud, or local registry.',
    android: {
      packageName: 'com.developerstring.ketoy.navigation',
      annotations: ['@Composable'],
      imports: [
        'import androidx.compose.runtime.*',
        'import androidx.compose.ui.Modifier',
        'import androidx.navigation.NavHostController',
        'import androidx.navigation.compose.NavHost',
        'import androidx.navigation.compose.composable',
        'import androidx.navigation.compose.rememberNavController',
      ],
      sourceCode: `// Overload 1: Type-safe start route
@Composable
fun <T : Any> KetoyNavHost(
    startRoute: T,
    modifier: Modifier = Modifier,
    navHostName: String = "main",
    navController: NavHostController = rememberNavController(),
    fallback: @Composable (route: String) -> Unit = { DefaultFallbackScreen(it) },
    builder: KetoyNavGraphScope.() -> Unit = {}
)

// Overload 2: String-based start route
@Composable
fun KetoyNavHost(
    startRoute: String,
    modifier: Modifier = Modifier,
    navHostName: String = "main",
    navController: NavHostController = rememberNavController(),
    fallback: @Composable (route: String) -> Unit = { DefaultFallbackScreen(it) },
    builder: KetoyNavGraphScope.() -> Unit = {}
)`,
    },
    properties: [
      { name: 'startRoute', type: 'T / String', default: '—', description: 'The initial route. Either a @Serializable data object/class (overload 1) or a route string (overload 2).' },
      { name: 'modifier', type: 'Modifier', default: 'Modifier', description: 'Optional Modifier applied to the NavHost.' },
      { name: 'navHostName', type: 'String', default: '"main"', description: 'Name of this nav graph. Used to match dev-server and cloud overrides. Must be unique per Activity.' },
      { name: 'navController', type: 'NavHostController', default: 'rememberNavController()', description: 'Optional pre-created NavHostController.' },
      { name: 'fallback', type: '@Composable (String) -> Unit', default: 'DefaultFallbackScreen', description: 'Composable rendered for unresolved routes. Shows an error-styled text by default.' },
      { name: 'builder', type: 'KetoyNavGraphScope.() -> Unit', default: '{}', description: 'DSL block for registering destinations via screen<T> and composable(route).' },
    ],
    usage: `// Type-safe routes
@Serializable data object Home : KetoyRoute
@Serializable data class Detail(val id: String) : KetoyRoute

KetoyNavHost(
    startRoute = Home,
    modifier = Modifier.fillMaxSize()
) {
    screen<Home> { HomeScreen() }
    screen<Detail> { DetailScreen(id = it.id) }
}

// String-based routes (JSON-driven)
KetoyNavHost(
    startRoute = "home",
    navHostName = "demo",
    modifier = Modifier.fillMaxSize()
) {
    composable("home") { HomeScreen() }
    composable("favorites") { FavoritesScreen() }
    composable("settings") { SettingsScreen() }
}

// Hybrid: type-safe + string routes
KetoyNavHost(startRoute = Home, navHostName = "main") {
    screen<Home> { HomeScreen() }
    screen<Detail> { DetailScreen(id = it.id) }
    composable("settings") { SettingsScreen() }
}`,
    notes: 'Nav graph override priority: 1) KetoyNavDevOverrides (live dev-server reload). 2) KetoyCloudNavOverrides (cloud-fetched). 3) KetoyNavRegistry (compile-time local). Route resolution order for destinations: 1) Builder DSL (screen<T> / composable). 2) KetoyComposableRegistry (native composables). 3) KetoyScreenRegistry (JSON-rendered screens). 4) Fallback composable.',
    seeAlso: ['KetoyNavGraphScope', 'KetoyNavController', 'KetoyNavGraph', 'LocalKetoyNavController', 'LocalKetoyNavHostName', 'LocalKetoyNavGraph', 'KetoyComposableRegistry'],
  },

  KetoyNavGraphScope: {
    name: 'KetoyNavGraphScope',
    kind: 'class',
    module: 'navigation',
    subpackage: 'host',
    category: 'Navigation',
    subcategory: 'Nav Host',
    description: 'DSL scope for declaring Ketoy destinations inside a KetoyNavHost builder. Supports both type-safe @Serializable routes via screen<T>() and string-based routes via composable(). String routes act as destination IDs that can be remapped by JSON nav overrides.',
    android: {
      packageName: 'com.developerstring.ketoy.navigation',
      annotations: [],
      imports: [
        'import androidx.compose.runtime.Composable',
        'import androidx.navigation.NavGraphBuilder',
        'import androidx.navigation.compose.composable',
        'import androidx.navigation.toRoute',
      ],
      sourceCode: `class KetoyNavGraphScope(
    @PublishedApi internal val navGraphBuilder: NavGraphBuilder
) {
    internal val stringDestinations = mutableListOf<Pair<String, @Composable () -> Unit>>()

    inline fun <reified T : Any> screen(
        noinline content: @Composable (route: T) -> Unit
    ) { ... }

    fun composable(
        route: String,
        content: @Composable () -> Unit
    ) { ... }
}`,
    },
    methods: [
      { name: 'screen<T>(content: @Composable (route: T) -> Unit)', returns: 'Unit', description: 'Register a type-safe destination using a @Serializable route class. The content lambda receives the deserialized route object with access to type-safe parameters.' },
      { name: 'composable(route: String, content: @Composable () -> Unit)', returns: 'Unit', description: 'Declare a string-based destination. The route string is the destination ID and default route. When a nav override is active, the ID can be remapped to a different actual route.' },
    ],
    usage: `KetoyNavHost(startRoute = Home) {
    // Type-safe
    screen<Home> { HomeScreen() }
    screen<Detail> { route ->
        DetailScreen(id = route.id)
    }

    // String-based (with live remap from JSON)
    composable("explore") { ExploreScreen() }
    composable("favorites") { FavoritesScreen() }
}`,
    notes: 'String destinations are collected and registered by KetoyNavHost with route remapping applied from the active nav override. Type-safe destinations are registered immediately in the underlying NavGraphBuilder.',
    seeAlso: ['KetoyNavHost', 'KetoyRoute', 'KetoyNavController'],
  },

  LocalKetoyNavController: {
    name: 'LocalKetoyNavController',
    kind: 'CompositionLocal',
    module: 'navigation',
    subpackage: 'host',
    category: 'Navigation',
    subcategory: 'Nav Host',
    description: 'CompositionLocal providing the KetoyNavController to descendant composables within a KetoyNavHost. The primary mechanism for accessing navigation capabilities. Supports both type-safe and string-based navigation. Returns null when accessed outside a KetoyNavHost scope.',
    android: {
      packageName: 'com.developerstring.ketoy.navigation',
      annotations: [],
      imports: [
        'import androidx.compose.runtime.staticCompositionLocalOf',
      ],
      sourceCode: `val LocalKetoyNavController = staticCompositionLocalOf<KetoyNavController?> {
    null
}`,
    },
    properties: [
      { name: 'current', type: 'KetoyNavController?', default: 'null', description: 'The current KetoyNavController, or null if outside a KetoyNavHost.' },
    ],
    usage: `@Composable
fun MyScreen() {
    val nav = LocalKetoyNavController.current

    // Type-safe navigation
    Button(onClick = { nav?.navigate(Detail(id = "42")) }) {
        Text("Go to Detail")
    }

    // String-based (JSON-driven) navigation
    Button(onClick = { nav?.navigateToRoute("favorites") }) {
        Text("Go to Favorites")
    }

    // Pop back
    Button(onClick = { nav?.popBackStack() }) {
        Text("Go Back")
    }
}`,
    seeAlso: ['KetoyNavController', 'KetoyNavHost', 'LocalKetoyNavHostName', 'LocalKetoyNavGraph'],
  },

  LocalKetoyNavHostName: {
    name: 'LocalKetoyNavHostName',
    kind: 'CompositionLocal',
    module: 'navigation',
    subpackage: 'host',
    category: 'Navigation',
    subcategory: 'Nav Host',
    description: 'CompositionLocal providing the nav-host name to descendant composables within a KetoyNavHost. Used by the dev server to identify which navigation graph is currently being rendered, enabling targeted live-reload. Returns null outside a KetoyNavHost.',
    android: {
      packageName: 'com.developerstring.ketoy.navigation',
      annotations: [],
      imports: [
        'import androidx.compose.runtime.staticCompositionLocalOf',
      ],
      sourceCode: `val LocalKetoyNavHostName = staticCompositionLocalOf<String?> { null }`,
    },
    properties: [
      { name: 'current', type: 'String?', default: 'null', description: 'The current nav-host name, or null if outside a KetoyNavHost.' },
    ],
    usage: `@Composable
fun DebugNavOverlay() {
    val navHostName = LocalKetoyNavHostName.current
    Text("Active nav-host: \${navHostName ?: "none"}")
}`,
    seeAlso: ['KetoyNavHost', 'LocalKetoyNavController', 'LocalKetoyNavGraph'],
  },

  LocalKetoyNavGraph: {
    name: 'LocalKetoyNavGraph',
    kind: 'CompositionLocal',
    module: 'navigation',
    subpackage: 'host',
    category: 'Navigation',
    subcategory: 'Nav Host',
    description: 'CompositionLocal providing the active KetoyNavGraph to descendant composables. Screens read this to discover available destinations, build data-driven navigation UI (bottom bars, drawers), and resolve route strings — all from JSON.',
    android: {
      packageName: 'com.developerstring.ketoy.navigation',
      annotations: [],
      imports: [
        'import androidx.compose.runtime.staticCompositionLocalOf',
      ],
      sourceCode: `val LocalKetoyNavGraph = staticCompositionLocalOf<KetoyNavGraph?> { null }`,
    },
    properties: [
      { name: 'current', type: 'KetoyNavGraph?', default: 'null', description: 'The active KetoyNavGraph, or null if no graph is active or outside a KetoyNavHost.' },
    ],
    usage: `@Composable
fun MyScreen() {
    val nav = LocalKetoyNavController.current
    val navGraph = LocalKetoyNavGraph.current
    val destinations = navGraph?.destinations ?: emptyList()

    // Build a data-driven bottom bar from JSON destinations
    destinations.forEach { dest ->
        Button(onClick = { nav?.navigateToRoute(dest.route) }) {
            Text(dest.label)
        }
    }
}`,
    seeAlso: ['KetoyNavGraph', 'KetoyNavHost', 'LocalKetoyNavController', 'KetoyNavDestination'],
  },

  /* ══════════════════════════════════════════════════════════════
   *  Navigation > Controller
   * ══════════════════════════════════════════════════════════════ */

  KetoyNavController: {
    name: 'KetoyNavController',
    kind: 'class',
    module: 'navigation',
    subpackage: 'controller',
    category: 'Navigation',
    subcategory: 'Controller',
    description: 'Wrapper around Jetpack Navigation\'s NavHostController that provides a server-driven navigation API for Ketoy. Supports two route styles, both fully interoperable: type-safe @Serializable routes and string-based routes (for JSON-driven / dynamic navigation). String routes are resolved through a remap table built from the active nav graph override.',
    android: {
      packageName: 'com.developerstring.ketoy.navigation',
      annotations: [],
      imports: [
        'import androidx.navigation.NavHostController',
        'import androidx.navigation.toRoute',
      ],
      sourceCode: `class KetoyNavController(
    @PublishedApi internal val navController: NavHostController
) {
    internal var routeRemaps: Map<String, String> = emptyMap()

    // Type-safe navigation
    fun <T : Any> navigate(route: T) { ... }
    fun <T : Any> navigateAndReplace(route: T) { ... }
    fun <T : Any> navigateAndClearBackStack(route: T) { ... }
    inline fun <reified T : KetoyRoute> currentRouteAs(): T? { ... }

    // String-based navigation
    fun navigateToRoute(route: String, arguments: Map<String, Any>? = null) { ... }
    fun navigateAndReplaceRoute(route: String, result: Map<String, Any>? = null, arguments: Map<String, Any>? = null) { ... }
    fun navigateAndClearBackStackRoute(route: String, arguments: Map<String, Any>? = null) { ... }

    // Pop
    fun popBackStack(result: Map<String, Any>? = null) { ... }
    fun popToRoot() { ... }

    // Query
    val currentRoute: String?
    val canGoBack: Boolean
    fun <T> getArgument(key: String): T? { ... }
    fun <T> getResult(key: String): T? { ... }
}`,
    },
    methods: [
      { name: 'navigate(route: T)', returns: 'Unit', description: 'Navigate to a type-safe @Serializable route. Pushes a new destination onto the back stack.' },
      { name: 'navigateAndReplace(route: T)', returns: 'Unit', description: 'Navigate to a type-safe route, replacing the current screen in the back stack.' },
      { name: 'navigateAndClearBackStack(route: T)', returns: 'Unit', description: 'Navigate to a type-safe route and clear the entire back stack. The new screen becomes root.' },
      { name: 'currentRouteAs<T>()', returns: 'T?', description: 'Extract the type-safe route object from the current back stack entry. Returns null if the cast fails.' },
      { name: 'navigateToRoute(route: String, arguments?)', returns: 'Unit', description: 'Navigate to a string route or navigation action ID. Resolved through the remap table from the active nav graph override.' },
      { name: 'navigateAndReplaceRoute(route, result?, arguments?)', returns: 'Unit', description: 'Navigate to a string route, replacing the current screen.' },
      { name: 'navigateAndClearBackStackRoute(route, arguments?)', returns: 'Unit', description: 'Navigate to a string route and clear the entire back stack.' },
      { name: 'popBackStack(result?)', returns: 'Unit', description: 'Pop the current screen from the back stack, optionally passing a result map to the previous screen.' },
      { name: 'popToRoot()', returns: 'Unit', description: 'Pop all screens back to the root (start destination). The root is retained.' },
      { name: 'getArgument<T>(key)', returns: 'T?', description: 'Retrieve a navigation argument from the current back stack entry\'s SavedStateHandle.' },
      { name: 'getResult<T>(key)', returns: 'T?', description: 'Retrieve a result value passed back from a popped screen.' },
    ],
    properties: [
      { name: 'currentRoute', type: 'String?', default: '—', description: 'The current destination\'s route string, or null if no destination is active.' },
      { name: 'canGoBack', type: 'Boolean', default: '—', description: 'Whether the back stack has entries to pop.' },
    ],
    usage: `val nav = LocalKetoyNavController.current

// Type-safe navigation
nav?.navigate(Detail(id = "42"))
nav?.navigateAndReplace(Home)
nav?.navigateAndClearBackStack(Home)

// Extract current route
val detail: Detail? = nav?.currentRouteAs<Detail>()

// String-based navigation (JSON-driven)
nav?.navigateToRoute("favorites")
nav?.navigateToRoute("go_favorites")  // resolved via remap table
nav?.navigateToRoute("detail", mapOf("id" to "42"))
nav?.navigateAndReplaceRoute("checkout",
    result = mapOf("selected" to "item_42"),
    arguments = mapOf("step" to "payment")
)

// Pop
nav?.popBackStack()
nav?.popBackStack(mapOf("selectedItem" to "item_42"))
nav?.popToRoot()

// Query
val currentScreen = nav?.currentRoute
if (nav?.canGoBack == true) { /* show back button */ }
val itemId: String? = nav?.getArgument("id")
val result: String? = nav?.getResult("selected")`,
    notes: 'The routeRemaps table is populated by KetoyNavHost from the active nav graph. It maps destination IDs and action IDs to actual routes. When no override is active, routes are used as-is. Results and arguments are stored via SavedStateHandle — values are converted to String via toString().',
    seeAlso: ['KetoyNavHost', 'LocalKetoyNavController', 'KetoyNavGraph', 'KetoyRoute', 'KNavigateAction'],
  },

  /* ══════════════════════════════════════════════════════════════
   *  Navigation > Overrides
   * ══════════════════════════════════════════════════════════════ */

  KetoyNavDevOverrides: {
    name: 'KetoyNavDevOverrides',
    kind: 'object',
    module: 'navigation',
    subpackage: 'overrides',
    category: 'Navigation',
    subcategory: 'Overrides',
    description: 'Holds live-reloadable navigation graph overrides from the Ketoy dev server. Highest priority override layer — takes precedence over both cloud overrides and local registry. KetoyDevWrapper populates this when it receives nav_*.json updates over WebSocket. KetoyNavHost observes via SnapshotStateMap and recomposes automatically.',
    android: {
      packageName: 'com.developerstring.ketoy.navigation',
      annotations: [],
      imports: [
        'import androidx.compose.runtime.mutableStateMapOf',
        'import androidx.compose.runtime.snapshots.SnapshotStateMap',
      ],
      sourceCode: `object KetoyNavDevOverrides {

    val overrides: SnapshotStateMap<String, KetoyNavGraph> =
        mutableStateMapOf()

    fun set(navHostName: String, graph: KetoyNavGraph?) { ... }
    fun get(navHostName: String): KetoyNavGraph? = overrides[navHostName]
    fun clearAll() { overrides.clear() }
}`,
    },
    properties: [
      { name: 'overrides', type: 'SnapshotStateMap<String, KetoyNavGraph>', default: 'mutableStateMapOf()', description: 'Observable map of navHostName → dev-server KetoyNavGraph override. Compose recomposes automatically when entries change.' },
    ],
    methods: [
      { name: 'set(navHostName, graph)', returns: 'Unit', description: 'Set or remove a dev-server override. Pass null to remove and fall back to cloud/registry.' },
      { name: 'get(navHostName)', returns: 'KetoyNavGraph?', description: 'Retrieve the dev-server override for a specific nav host, or null if none active.' },
      { name: 'clearAll()', returns: 'Unit', description: 'Clear all dev-server overrides. KetoyNavHost falls back to cloud or registry.' },
    ],
    usage: `// Typically populated automatically by KetoyDevWrapper.
// Manual override for testing:
KetoyNavDevOverrides.set("main", devNavGraph)

// Clear on dev server disconnect:
KetoyNavDevOverrides.clearAll()

// Check if an override is active:
val override = KetoyNavDevOverrides.get("main")`,
    notes: 'Override priority (highest → lowest): 1) KetoyNavDevOverrides (development). 2) KetoyCloudNavOverrides (production). 3) KetoyNavRegistry (compile-time).',
    seeAlso: ['KetoyCloudNavOverrides', 'KetoyNavRegistry', 'KetoyNavHost', 'KetoyNavGraph'],
  },

  KetoyCloudNavOverrides: {
    name: 'KetoyCloudNavOverrides',
    kind: 'object',
    module: 'navigation',
    subpackage: 'overrides',
    category: 'Navigation',
    subcategory: 'Overrides',
    description: 'Holds cloud-fetched navigation graph overrides for KetoyNavHost. Medium priority — dev-server overrides take precedence, but cloud overrides beat local registry. KetoyCloudNavService auto-registers graphs here upon successful fetch. KetoyNavHost observes via SnapshotStateMap.',
    android: {
      packageName: 'com.developerstring.ketoy.navigation',
      annotations: [],
      imports: [
        'import androidx.compose.runtime.mutableStateMapOf',
        'import androidx.compose.runtime.snapshots.SnapshotStateMap',
      ],
      sourceCode: `object KetoyCloudNavOverrides {

    val overrides: SnapshotStateMap<String, KetoyNavGraph> =
        mutableStateMapOf()

    fun set(navHostName: String, graph: KetoyNavGraph?) { ... }
    fun get(navHostName: String): KetoyNavGraph? = overrides[navHostName]
    fun clearAll() { overrides.clear() }
}`,
    },
    properties: [
      { name: 'overrides', type: 'SnapshotStateMap<String, KetoyNavGraph>', default: 'mutableStateMapOf()', description: 'Observable map of navHostName → cloud-fetched KetoyNavGraph. Compose recomposes automatically when entries change.' },
    ],
    methods: [
      { name: 'set(navHostName, graph)', returns: 'Unit', description: 'Set or remove a cloud override. Pass null to remove and fall back to KetoyNavRegistry.' },
      { name: 'get(navHostName)', returns: 'KetoyNavGraph?', description: 'Retrieve the cloud override for a specific nav host, or null if none active.' },
      { name: 'clearAll()', returns: 'Unit', description: 'Clear all cloud overrides. KetoyNavHost falls back to KetoyNavRegistry.' },
    ],
    usage: `// Cloud service auto-registers:
KetoyCloudNavService.fetchNavGraph("nav_main")
// KetoyNavHost with navHostName="main" recomposes with the cloud graph.

// Manual override (advanced):
KetoyCloudNavOverrides.set("main", cloudNavGraph)

// Clear all cloud overrides:
KetoyCloudNavOverrides.clearAll()`,
    notes: 'Override priority: 1) KetoyNavDevOverrides. 2) KetoyCloudNavOverrides. 3) KetoyNavRegistry. You typically do not interact with this object directly — KetoyCloudNavService handles registration automatically.',
    seeAlso: ['KetoyNavDevOverrides', 'KetoyNavRegistry', 'KetoyNavHost', 'KetoyCloudNavService', 'KetoyNavGraph'],
  },

  /* ══════════════════════════════════════════════════════════════
   *  Navigation > Composable Registry
   * ══════════════════════════════════════════════════════════════ */

  KetoyComposableRegistry: {
    name: 'KetoyComposableRegistry',
    kind: 'object',
    module: 'navigation',
    subpackage: 'registry',
    category: 'Navigation',
    subcategory: 'Registry',
    description: 'Global registry mapping route strings to native @Composable screen functions. Bridges JSON-defined nav graphs with real Compose destinations. When KetoyNavHost encounters a destination from a nav override, it checks this registry — if a composable is registered, it renders the native screen instead of falling back to JSON rendering.',
    android: {
      packageName: 'com.developerstring.ketoy.navigation',
      annotations: [],
      imports: [
        'import androidx.compose.runtime.Composable',
      ],
      sourceCode: `object KetoyComposableRegistry {

    private val composables =
        mutableMapOf<String, @Composable () -> Unit>()

    fun register(route: String, content: @Composable () -> Unit) { ... }
    fun registerAll(
        vararg entries: Pair<String, @Composable () -> Unit>
    ) { ... }
    fun get(route: String): (@Composable () -> Unit)? = composables[route]
    fun isRegistered(route: String): Boolean
    fun getAllRoutes(): Set<String>
    fun remove(route: String) { ... }
    fun clear() { ... }
}`,
    },
    methods: [
      { name: 'register(route, content)', returns: 'Unit', description: 'Register a native @Composable screen for a route string. Silently replaces if already registered.' },
      { name: 'registerAll(vararg entries)', returns: 'Unit', description: 'Register multiple composable screens at once using vararg pairs.' },
      { name: 'get(route)', returns: '(@Composable () -> Unit)?', description: 'Retrieve the composable function for a route, or null if not registered.' },
      { name: 'isRegistered(route)', returns: 'Boolean', description: 'Check if a composable is registered for the given route.' },
      { name: 'getAllRoutes()', returns: 'Set<String>', description: 'Returns the set of all route strings with registered composables.' },
      { name: 'remove(route)', returns: 'Unit', description: 'Remove a composable registration for a route.' },
      { name: 'clear()', returns: 'Unit', description: 'Clear all composable registrations.' },
    ],
    usage: `// Register in Application.onCreate or Activity.onCreate
KetoyComposableRegistry.register("explore") { ExploreScreen() }
KetoyComposableRegistry.register("favorites") { FavoritesScreen() }

// Or register multiple at once
KetoyComposableRegistry.registerAll(
    "explore" to { ExploreScreen() },
    "favorites" to { FavoritesScreen() },
    "settings" to { SettingsScreen() }
)

// Check registration
if (KetoyComposableRegistry.isRegistered("explore")) { ... }`,
    notes: 'Resolution priority in KetoyNavHost: 1) Builder DSL destinations (screen<T> / composable). 2) KetoyComposableRegistry (native composable screens). 3) KetoyScreenRegistry (JSON-rendered screens). 4) Fallback composable. This enables the key Ketoy nav feature: define the navigation graph in JSON while actual screen content is native Compose.',
    seeAlso: ['KetoyNavHost', 'KetoyNavGraph', 'KetoyNavDevOverrides', 'KetoyNavGraphScope'],
  },

  /* ══════════════════════════════════════════════════════════════
   *  Navigation > Navigation Models
   * ══════════════════════════════════════════════════════════════ */

  NavigationStyle: {
    name: 'NavigationStyle',
    kind: 'enum class',
    module: 'navigation',
    subpackage: 'models',
    category: 'Navigation',
    subcategory: 'Models',
    description: 'Defines the navigation transition styles available in Ketoy\'s server-driven UI. Maps directly to Jetpack Navigation operations. Used in KNavigateAction to describe how a navigation should be performed. In JSON, values are serialized as lowercase strings.',
    android: {
      packageName: 'com.developerstring.ketoy.navigation',
      annotations: ['@Serializable'],
      imports: [
        'import kotlinx.serialization.SerialName',
        'import kotlinx.serialization.Serializable',
      ],
      sourceCode: `@Serializable
enum class NavigationStyle {
    @SerialName("navigate")
    Navigate,

    @SerialName("popBackStack")
    PopBackStack,

    @SerialName("navigateAndReplace")
    NavigateAndReplace,

    @SerialName("navigateAndClearBackStack")
    NavigateAndClearBackStack,

    @SerialName("popToRoot")
    PopToRoot
}`,
    },
    properties: [
      { name: 'Navigate', type: 'NavigationStyle', default: '—', description: 'Standard forward navigation — pushes a new destination onto the back stack.' },
      { name: 'PopBackStack', type: 'NavigationStyle', default: '—', description: 'Pops the current destination and returns to the previous one.' },
      { name: 'NavigateAndReplace', type: 'NavigationStyle', default: '—', description: 'Replaces the current destination with the new one (current is popped first).' },
      { name: 'NavigateAndClearBackStack', type: 'NavigationStyle', default: '—', description: 'Clears the entire back stack and sets the new destination as root.' },
      { name: 'PopToRoot', type: 'NavigationStyle', default: '—', description: 'Pops all destinations back to the root of the navigation graph.' },
    ],
    usage: `// JSON
{ "navigationStyle": "navigate" }
{ "navigationStyle": "popBackStack" }
{ "navigationStyle": "navigateAndReplace" }
{ "navigationStyle": "navigateAndClearBackStack" }
{ "navigationStyle": "popToRoot" }

// Kotlin
val action = KNavigateAction(
    routeName = "home",
    navigationStyle = NavigationStyle.NavigateAndClearBackStack
)`,
    seeAlso: ['KNavigateAction', 'KetoyNavigationExecutor', 'KetoyNavController', 'KetoyNavigator'],
  },

  KNavigateAction: {
    name: 'KNavigateAction',
    kind: 'data class',
    module: 'navigation',
    subpackage: 'models',
    category: 'Navigation',
    subcategory: 'Models',
    description: 'Serializable model describing a navigation action from JSON. Targets one of three mutually exclusive sources: routeName (registered screen), widgetJson (inline JSON tree), or assetPath (local JSON asset file). The navigationStyle determines how navigation is performed.',
    android: {
      packageName: 'com.developerstring.ketoy.navigation',
      annotations: ['@Serializable'],
      imports: [
        'import kotlinx.serialization.Serializable',
      ],
      sourceCode: `@Serializable
data class KNavigateAction(
    val routeName: String? = null,
    val widgetJson: String? = null,
    val assetPath: String? = null,
    val navigationStyle: NavigationStyle = NavigationStyle.Navigate,
    val result: Map<String, String>? = null,
    val arguments: Map<String, String>? = null
)`,
    },
    properties: [
      { name: 'routeName', type: 'String?', default: 'null', description: 'Route name of a registered Ketoy screen. Mutually exclusive with widgetJson and assetPath.' },
      { name: 'widgetJson', type: 'String?', default: 'null', description: 'Inline JSON widget tree string rendered on-the-fly. Mutually exclusive with routeName and assetPath.' },
      { name: 'assetPath', type: 'String?', default: 'null', description: 'Path to a local JSON asset file (e.g. "screens/home.json"). Mutually exclusive with routeName and widgetJson.' },
      { name: 'navigationStyle', type: 'NavigationStyle', default: 'Navigate', description: 'How the navigation should be performed (push, replace, clear stack, pop).' },
      { name: 'result', type: 'Map<String, String>?', default: 'null', description: 'Optional key-value map passed back to the previous screen on pop.' },
      { name: 'arguments', type: 'Map<String, String>?', default: 'null', description: 'Optional key-value map forwarded to the target screen.' },
    ],
    usage: `// JSON: Forward navigation to a registered screen
{
    "routeName": "detail_screen",
    "navigationStyle": "navigate",
    "arguments": { "id": "123", "source": "home" }
}

// JSON: Replace with inline JSON widget tree
{
    "widgetJson": "{\\"type\\": \\"Column\\", \\"children\\": []}",
    "navigationStyle": "navigateAndReplace"
}

// JSON: Pop with result
{
    "navigationStyle": "popBackStack",
    "result": { "selected": "item_42" }
}

// Kotlin (via KetoyNavigator factory methods)
val action = KetoyNavigator.navigateToScreen("detail", mapOf("id" to "42"))
KetoyNavigationExecutor.execute(navController, action, context)`,
    seeAlso: ['NavigationStyle', 'KetoyNavigator', 'KetoyNavigationExecutor', 'KetoyNavController'],
  },

  /* ══════════════════════════════════════════════════════════════
   *  Navigation > Executor
   * ══════════════════════════════════════════════════════════════ */

  KetoyNavigationExecutor: {
    name: 'KetoyNavigationExecutor',
    kind: 'object',
    module: 'navigation',
    subpackage: 'executor',
    category: 'Navigation',
    subcategory: 'Executor',
    description: 'Executes KNavigateAction instances against a KetoyNavController. Bridges JSON-driven navigation actions and the actual Jetpack Compose Navigation runtime. Handles all target types: routeName (registered screen), widgetJson (inline JSON screen), assetPath (load from assets), and pop operations.',
    android: {
      packageName: 'com.developerstring.ketoy.navigation',
      annotations: [],
      imports: [
        'import android.content.Context',
        'import kotlinx.serialization.json.Json',
      ],
      sourceCode: `object KetoyNavigationExecutor {

    private val json = Json { ignoreUnknownKeys = true }

    fun execute(
        navController: KetoyNavController,
        action: KNavigateAction,
        context: Context? = null
    ) { ... }

    fun executeFromJson(
        navController: KetoyNavController,
        actionJson: String,
        context: Context? = null
    ) { ... }
}`,
    },
    methods: [
      { name: 'execute(navController, action, context?)', returns: 'Unit', description: 'Execute a KNavigateAction. Dispatches to the appropriate navigation method based on NavigationStyle and target type. For inline JSON and asset screens, registers a temporary screen in KetoyScreenRegistry.' },
      { name: 'executeFromJson(navController, actionJson, context?)', returns: 'Unit', description: 'Convenience: deserialize a JSON string into KNavigateAction and execute it. Unknown JSON keys are silently ignored.' },
    ],
    usage: `// Decode and execute from JSON
val actionJson = """{ "routeName": "detail", "navigationStyle": "navigate" }"""
KetoyNavigationExecutor.executeFromJson(navController, actionJson, context)

// Execute a pre-built action
val action = KetoyNavigator.navigateToScreen("detail", mapOf("id" to "42"))
KetoyNavigationExecutor.execute(navController, action, context)

// Inline JSON screen
val jsonAction = KetoyNavigator.navigateToJson(
    """{ "type": "Column", "children": [{"type": "Text", "text": "Hello!"}] }"""
)
KetoyNavigationExecutor.execute(navController, jsonAction)

// Asset-based screen
val assetAction = KetoyNavigator.navigateToAsset("screens/promo.json")
KetoyNavigationExecutor.execute(navController, assetAction, context)`,
    notes: 'For widgetJson and assetPath targets, a temporary KetoyScreen is registered with a unique timestamped route (e.g. "ketoy_inline_1708123456789") before navigating. Context is required for asset loading but can be null for other target types.',
    seeAlso: ['KNavigateAction', 'KetoyNavigator', 'KetoyNavController', 'NavigationStyle'],
  },

  /* ══════════════════════════════════════════════════════════════
   *  Navigation > Navigator
   * ══════════════════════════════════════════════════════════════ */

  KetoyNavigator: {
    name: 'KetoyNavigator',
    kind: 'object',
    module: 'navigation',
    subpackage: 'navigator',
    category: 'Navigation',
    subcategory: 'Navigator',
    description: 'Static factory for building KNavigateAction instances from Kotlin code. Provides factory methods for screen routes, inline JSON screens, asset-based screens, and pop operations. These actions are consumed by KetoyNavigationExecutor. For direct navigation, use KetoyNavController instead.',
    android: {
      packageName: 'com.developerstring.ketoy.navigation',
      annotations: [],
      imports: [],
      sourceCode: `object KetoyNavigator {

    // Screen routes
    fun navigateToScreen(routeName: String, arguments: Map<String, String>? = null): KNavigateAction
    fun navigateAndReplaceScreen(routeName: String, result: Map<String, String>? = null, arguments: Map<String, String>? = null): KNavigateAction
    fun navigateAndClearBackStackScreen(routeName: String, arguments: Map<String, String>? = null): KNavigateAction

    // Inline JSON
    fun navigateToJson(widgetJson: String): KNavigateAction
    fun navigateAndReplaceJson(widgetJson: String, result: Map<String, String>? = null): KNavigateAction
    fun navigateAndClearBackStackJson(widgetJson: String): KNavigateAction

    // Asset-based
    fun navigateToAsset(assetPath: String): KNavigateAction
    fun navigateAndReplaceAsset(assetPath: String, result: Map<String, String>? = null): KNavigateAction
    fun navigateAndClearBackStackAsset(assetPath: String): KNavigateAction

    // Pop
    fun popBackStack(result: Map<String, String>? = null): KNavigateAction
    fun popToRoot(): KNavigateAction
}`,
    },
    methods: [
      { name: 'navigateToScreen(routeName, arguments?)', returns: 'KNavigateAction', description: 'Create an action that navigates to a registered screen (forward push).' },
      { name: 'navigateAndReplaceScreen(routeName, result?, arguments?)', returns: 'KNavigateAction', description: 'Create an action that replaces the current screen with another.' },
      { name: 'navigateAndClearBackStackScreen(routeName, arguments?)', returns: 'KNavigateAction', description: 'Create an action that navigates and clears the entire back stack.' },
      { name: 'navigateToJson(widgetJson)', returns: 'KNavigateAction', description: 'Create an action that navigates to an inline JSON screen.' },
      { name: 'navigateAndReplaceJson(widgetJson, result?)', returns: 'KNavigateAction', description: 'Create an action that replaces current screen with inline JSON.' },
      { name: 'navigateAndClearBackStackJson(widgetJson)', returns: 'KNavigateAction', description: 'Create an action that navigates to inline JSON and clears the stack.' },
      { name: 'navigateToAsset(assetPath)', returns: 'KNavigateAction', description: 'Create an action that navigates to a screen loaded from a JSON asset file.' },
      { name: 'navigateAndReplaceAsset(assetPath, result?)', returns: 'KNavigateAction', description: 'Create an action that replaces current screen with a JSON asset screen.' },
      { name: 'navigateAndClearBackStackAsset(assetPath)', returns: 'KNavigateAction', description: 'Create an action that navigates to a JSON asset screen and clears the stack.' },
      { name: 'popBackStack(result?)', returns: 'KNavigateAction', description: 'Create an action that pops the current screen, optionally passing a result.' },
      { name: 'popToRoot()', returns: 'KNavigateAction', description: 'Create an action that pops all screens back to root.' },
    ],
    usage: `// Navigate to a screen
val action = KetoyNavigator.navigateToScreen(
    routeName = "detail_screen",
    arguments = mapOf("id" to "42", "source" to "search")
)
KetoyNavigationExecutor.execute(nav, action, context)

// Replace with another screen
val replaceAction = KetoyNavigator.navigateAndReplaceScreen(
    routeName = "checkout",
    result = mapOf("status" to "confirmed"),
    arguments = mapOf("step" to "payment")
)

// Navigate to inline JSON
val jsonAction = KetoyNavigator.navigateToJson(
    """{ "type": "Column", "children": [{"type": "Text", "text": "Hello!"}] }"""
)

// Navigate to asset
val assetAction = KetoyNavigator.navigateToAsset("screens/promo_banner.json")

// Pop with result
val popAction = KetoyNavigator.popBackStack(mapOf("saved" to "true"))

// Reset to root
val resetAction = KetoyNavigator.popToRoot()`,
    notes: 'Type-safe route navigation is performed directly via KetoyNavController.navigate(), not through KNavigateAction. The factory methods here are designed for the string-based / JSON-driven navigation pipeline.',
    seeAlso: ['KNavigateAction', 'KetoyNavigationExecutor', 'KetoyNavController', 'NavigationStyle'],
  },

}

export default navigationData
