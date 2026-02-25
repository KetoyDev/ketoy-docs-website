/**
 * Ketoy Documentation – Navigation
 * Covers: KetoyNavHost, KetoyNavGraph, KetoyRoute, KetoyNavController,
 *         KetoyNavDestination, KetoyNavAction, KetoyNavRegistry
 */

const kNavigationDoc = {
  id: 'knavigation',
  title: 'Navigation',
  description: 'Ketoy Compose navigation support — build server-driven navigation with KetoyNavHost, type-safe @Serializable routes via KetoyRoute, string-based routes via JSON, and live route editing from the dev server or Ketoy Cloud.',
  icon: 'FaRoute',
  order: 4,
  sections: [
    // ── Overview ──
    {
      id: 'overview',
      title: 'Overview',
      content: `Ketoy wraps Jetpack Navigation Compose with a server-driven layer. It supports **two route styles** that can be used together in the same graph:

| Style | Description | Route Changes |
|---|---|---|
| **Type-safe** (\`@Serializable\` + \`KetoyRoute\`) | Compile-time safe, parameterised routes | Requires code change |
| **String-based** (JSON-driven) | Dynamic route resolution via \`KetoyNavGraph\` | Live-editable via dev server or cloud |

### Key components

| Component | Role |
|---|---|
| **KetoyNavHost** | The navigation host composable — replaces \`NavHost\` |
| **KetoyRoute** | Marker interface for type-safe route definitions |
| **KetoyNavGraph** | Serializable model defining destinations + navigation actions |
| **KetoyNavDestination** | A single destination in the graph (route, screenName, icon, label) |
| **KetoyNavAction** | A navigation action that maps an \`id\` to a target \`route\` |
| **KetoyNavController** | Navigation controller provided via \`LocalKetoyNavController\` |
| **KetoyNavRegistry** | Global registry for nav graphs |
| **KetoyNavGraphScope** | DSL scope for declaring destinations inside \`KetoyNavHost\` |`,
    },

    // ── KetoyNavHost — Type-safe ──
    {
      id: 'nav-host-type-safe',
      title: 'KetoyNavHost – Type-Safe Routes',
      content: `The type-safe overload accepts a \`@Serializable\` start route. Use \`screen<T> { }\` in the builder to register destinations:`,
      code: `@Composable
fun <T : Any> KetoyNavHost(
    startRoute: T,
    modifier: Modifier = Modifier,
    navHostName: String = "main",
    navController: NavHostController = rememberNavController(),
    fallback: @Composable (route: String) -> Unit = { DefaultFallbackScreen(it) },
    builder: KetoyNavGraphScope.() -> Unit = {}
)`,
      language: 'kotlin',
      subsections: [
        {
          id: 'nav-host-type-safe-params',
          title: 'Parameters',
          table: {
            headers: ['Parameter', 'Type', 'Default', 'Description'],
            rows: [
              ['startRoute', 'T (Any)', '—', 'Initial route — a @Serializable data object or data class.'],
              ['modifier', 'Modifier', 'Modifier', 'Layout modifier applied to the NavHost.'],
              ['navHostName', 'String', '"main"', 'Name of this nav graph. Used by the dev server for targeted live-reload.'],
              ['navController', 'NavHostController', 'rememberNavController()', 'Optional pre-created NavHostController.'],
              ['fallback', '@Composable (String) -> Unit', 'DefaultFallbackScreen', 'Composable rendered when a string route cannot be resolved.'],
              ['builder', 'KetoyNavGraphScope.() -> Unit', '{}', 'DSL block for registering destinations via screen<T> {} and composable().'],
            ],
          },
        },
        {
          id: 'nav-host-type-safe-example',
          title: 'Example',
          code: `@Serializable data object Home : KetoyRoute
@Serializable data object Profile : KetoyRoute
@Serializable data class Detail(val id: String) : KetoyRoute

KetoyNavHost(
    startRoute = Home,
    modifier = Modifier.fillMaxSize()
) {
    screen<Home> { HomeScreen() }
    screen<Profile> { ProfileScreen() }
    screen<Detail> { route ->
        DetailScreen(id = route.id)
    }
}`,
          language: 'kotlin',
        },
      ],
    },

    // ── KetoyNavHost — String-based ──
    {
      id: 'nav-host-string',
      title: 'KetoyNavHost – String-Based Routes',
      content: `The string-based overload accepts a route name as the start destination. String routes act as **destination IDs** — when a nav override is active, the ID can be remapped to a different actual route without code changes:`,
      code: `@Composable
fun KetoyNavHost(
    startRoute: String,
    modifier: Modifier = Modifier,
    navHostName: String = "main",
    navController: NavHostController = rememberNavController(),
    fallback: @Composable (route: String) -> Unit = { DefaultFallbackScreen(it) },
    builder: KetoyNavGraphScope.() -> Unit = {}
)`,
      language: 'kotlin',
      subsections: [
        {
          id: 'nav-host-string-example',
          title: 'Example',
          code: `KetoyNavHost(
    startRoute = "home",
    navHostName = "main",
    modifier = Modifier
        .fillMaxSize()
        .padding(innerPadding),
    navController = navController
) {
    composable("home") { HomeScreen() }
    composable("analytics") { AnalyticsScreen() }
    composable("cards") { CardsScreen() }
    composable("profile") { ProfileScreen() }
    composable("demo_nav") { DemoNavScreen() }
}`,
          language: 'kotlin',
        },
      ],
    },

    // ── KetoyRoute ──
    {
      id: 'ketoy-route',
      title: 'KetoyRoute – Type-Safe Routes',
      content: `\`KetoyRoute\` is a marker interface for type-safe navigation routes. Implement it on \`@Serializable data object\` or \`@Serializable data class\` types to define compile-time safe destinations:`,
      code: `interface KetoyRoute

// Data object — no parameters
@Serializable
data object Home : KetoyRoute

@Serializable
data object Profile : KetoyRoute

// Data class — with parameters
@Serializable
data class Detail(val id: String) : KetoyRoute

@Serializable
data class Product(
    val productId: Int,
    val from: String = "home"   // default values supported
) : KetoyRoute`,
      language: 'kotlin',
      subsections: [
        {
          id: 'route-usage',
          title: 'Using in KetoyNavHost',
          code: `KetoyNavHost(startRoute = Home) {
    screen<Home> { HomeScreen() }
    screen<Profile> { ProfileScreen() }
    screen<Detail> { route ->
        DetailScreen(id = route.id)
    }
    screen<Product> { route ->
        ProductScreen(productId = route.productId, from = route.from)
    }
}`,
          language: 'kotlin',
        },
        {
          id: 'route-navigation',
          title: 'Navigating with Type-Safe Routes',
          code: `val nav = LocalKetoyNavController.current

// Navigate to a route
nav?.navigate(Detail(id = "42"))

// Navigate and replace current screen
nav?.navigateAndReplace(Home)

// Navigate and clear entire back stack
nav?.navigateAndClearBackStack(Home)

// Pop back
nav?.popBackStack()

// Extract the current route
val detail: Detail? = nav?.currentRouteAs<Detail>()`,
          language: 'kotlin',
        },
      ],
    },

    // ── KetoyNavGraphScope ──
    {
      id: 'nav-graph-scope',
      title: 'KetoyNavGraphScope',
      content: `The DSL scope inside a \`KetoyNavHost\` builder. You use it to register both type-safe and string-based destinations:`,
      code: `class KetoyNavGraphScope(
    internal val navGraphBuilder: NavGraphBuilder
) {
    // Type-safe destination
    inline fun <reified T : Any> screen(
        noinline content: @Composable (route: T) -> Unit
    )

    // String-based destination
    fun composable(
        route: String,
        content: @Composable () -> Unit
    )
}`,
      language: 'kotlin',
      subsections: [
        {
          id: 'scope-methods',
          title: 'Methods',
          table: {
            headers: ['Method', 'Route Type', 'Description'],
            rows: [
              ['screen<T> { route -> ... }', 'Type-safe', 'Register a @Serializable route. The content lambda receives the deserialized route object.'],
              ['composable(route) { ... }', 'String', 'Register a string-based destination. The route string doubles as a destination ID for JSON remapping.'],
            ],
          },
        },
        {
          id: 'scope-hybrid',
          title: 'Hybrid Example (Both Route Types)',
          code: `@Serializable data object Home : KetoyRoute
@Serializable data class Detail(val id: String) : KetoyRoute

KetoyNavHost(startRoute = Home) {
    // Type-safe destinations
    screen<Home> { HomeScreen() }
    screen<Detail> { route -> DetailScreen(id = route.id) }

    // String-based destinations (JSON-remappable)
    composable("favorites") { FavoritesScreen() }
    composable("settings") { SettingsScreen() }
}`,
          language: 'kotlin',
        },
      ],
    },

    // ── KetoyNavGraph ──
    {
      id: 'nav-graph',
      title: 'KetoyNavGraph',
      content: `\`KetoyNavGraph\` is a serializable model representing a complete navigation graph. It contains **destinations** (the screen nodes) and **navigations** (the action edges).

Editing \`navigations[*].route\` in the JSON and pushing via the dev server or cloud will live-update all matching \`navigateToRoute(navId)\` calls — no recompile needed.`,
      code: `@Serializable
data class KetoyNavGraph(
    val navHostName: String,
    val startRoute: String,
    val destinations: List<KetoyNavDestination> = emptyList(),
    val navigations: List<KetoyNavAction> = emptyList()
)`,
      language: 'kotlin',
      subsections: [
        {
          id: 'nav-graph-params',
          title: 'Properties',
          table: {
            headers: ['Property', 'Type', 'Default', 'Description'],
            rows: [
              ['navHostName', 'String', '—', 'Unique name identifying this nav graph. Must match the navHostName in KetoyNavHost.'],
              ['startRoute', 'String', '—', 'Default start route string for this nav graph.'],
              ['destinations', 'List<KetoyNavDestination>', 'emptyList()', 'All navigation destinations (screen nodes) in the graph.'],
              ['navigations', 'List<KetoyNavAction>', 'emptyList()', 'All navigation actions (edges) connecting destinations.'],
            ],
          },
        },
        {
          id: 'nav-graph-json',
          title: 'JSON Representation',
          code: `{
    "navHostName": "main",
    "startRoute": "home",
    "destinations": [
        {
            "id": "home",
            "route": "home",
            "screenName": "HomeScreen",
            "label": "Home",
            "icon": "home",
            "selectedIcon": "home_filled",
            "isStartDestination": true
        },
        {
            "id": "profile",
            "route": "profile",
            "screenName": "ProfileScreen",
            "label": "Profile",
            "icon": "person",
            "selectedIcon": "person_filled"
        }
    ],
    "navigations": [
        { "id": "go_profile", "route": "profile", "label": "Open Profile" }
    ]
}`,
          language: 'json',
        },
        {
          id: 'nav-graph-methods',
          title: 'Methods',
          table: {
            headers: ['Method', 'Returns', 'Description'],
            rows: [
              ['toJson()', 'String', 'Serialize this nav graph to a pretty-printed JSON string.'],
              ['KetoyNavGraph.fromJson(json)', 'KetoyNavGraph', 'Deserialize a nav graph from a JSON string.'],
              ['buildActionRemaps()', 'Map<String, String>', 'Build a route remap table (destination IDs + action IDs → routes).'],
            ],
          },
        },
      ],
    },

    // ── KetoyNavDestination ──
    {
      id: 'nav-destination',
      title: 'KetoyNavDestination',
      content: `Each destination maps a stable \`id\` to an actual Navigation Compose \`route\`, plus metadata for building data-driven navigation UI (bottom bars, drawers, etc.):`,
      code: `@Serializable
data class KetoyNavDestination(
    val id: String = "",
    val route: String,
    val screenName: String,
    val label: String = "",
    val icon: String = "",
    val selectedIcon: String = "",
    val isStartDestination: Boolean = false
)`,
      language: 'kotlin',
      subsections: [
        {
          id: 'destination-params',
          title: 'Properties',
          table: {
            headers: ['Property', 'Type', 'Default', 'Description'],
            rows: [
              ['id', 'String', '""', 'Stable identifier used by the builder DSL and navigateToRoute. Falls back to route when empty.'],
              ['route', 'String', '—', 'The actual route string registered in Navigation Compose.'],
              ['screenName', 'String', '—', 'Ketoy screen name looked up in KetoyScreenRegistry.'],
              ['label', 'String', '""', 'Human-readable label for UI elements (bottom nav, drawer items).'],
              ['icon', 'String', '""', 'Icon reference string for the unselected state.'],
              ['selectedIcon', 'String', '""', 'Icon reference string for the selected state.'],
              ['isStartDestination', 'Boolean', 'false', 'Whether this is the start route of its nav graph.'],
            ],
          },
        },
      ],
    },

    // ── KetoyNavAction ──
    {
      id: 'nav-action',
      title: 'KetoyNavAction',
      content: `Navigation actions map an action \`id\` to a target \`route\`. When the dev server or cloud pushes an updated JSON, the route can change dynamically — the same action ID in code navigates to the new target without any code changes:`,
      code: `@Serializable
data class KetoyNavAction(
    val id: String,
    val route: String,
    val label: String = ""
)`,
      language: 'kotlin',
      subsections: [
        {
          id: 'action-live-edit',
          title: 'Live Route Editing',
          content: `Define an action in your nav graph JSON:
\`\`\`json
{ "id": "go_favorites", "route": "favorites", "label": "Open Favorites" }
\`\`\`

In code, use the action ID:
\`\`\`kotlin
nav?.navigateToRoute("go_favorites")
\`\`\`

Now change the route in JSON and push via dev server:
\`\`\`json
{ "id": "go_favorites", "route": "bookmarks" }
\`\`\`

The same code now navigates to **"bookmarks"** instead — no recompile needed.`,
        },
      ],
    },

    // ── Defining nav graphs in code ──
    {
      id: 'defining-nav-graphs',
      title: 'Defining Nav Graphs in Code',
      content: `Define your navigation graphs as Kotlin objects and register them with \`KetoyNavRegistry\` at startup. This is the single source of truth for destinations and navigation actions — the same definitions are exported to JSON for the dev server.`,
      code: `object AppNavGraphs {

    val main = KetoyNavGraph(
        navHostName = "main",
        startRoute = "home",
        destinations = listOf(
            KetoyNavDestination(
                id = "home", route = "home", screenName = "home",
                label = "Home", icon = "home", selectedIcon = "home",
                isStartDestination = true
            ),
            KetoyNavDestination(
                id = "analytics", route = "analytics", screenName = "analytics",
                label = "Analytics", icon = "insights", selectedIcon = "insights"
            ),
            KetoyNavDestination(
                id = "cards", route = "cards", screenName = "cards",
                label = "Cards", icon = "credit_card", selectedIcon = "credit_card"
            ),
            KetoyNavDestination(
                id = "profile", route = "profile", screenName = "profile",
                label = "Profile", icon = "person", selectedIcon = "person"
            ),
        ),
        navigations = listOf(
            KetoyNavAction(id = "go_home", route = "home", label = "Go Home"),
            KetoyNavAction(id = "go_analytics", route = "analytics", label = "Go Analytics"),
            KetoyNavAction(id = "go_cards", route = "cards", label = "Go Cards"),
            KetoyNavAction(id = "go_profile", route = "profile", label = "Go Profile"),
        )
    )

    val demo = KetoyNavGraph(
        navHostName = "demo",
        startRoute = "explore",
        destinations = listOf(
            KetoyNavDestination(
                id = "explore", route = "explore", screenName = "explore",
                label = "Explore", icon = "explore", selectedIcon = "explore",
                isStartDestination = true
            ),
            KetoyNavDestination(
                id = "favorites", route = "favorites", screenName = "favorites",
                label = "Favorites", icon = "favorite_border", selectedIcon = "favorite"
            ),
            KetoyNavDestination(
                id = "settings", route = "settings", screenName = "settings",
                label = "Settings", icon = "settings", selectedIcon = "settings"
            ),
        ),
        navigations = listOf(
            KetoyNavAction(id = "go_favorites", route = "favorites", label = "Open Favorites"),
            KetoyNavAction(id = "go_settings", route = "settings", label = "Open Settings"),
        )
    )

    fun registerAll() {
        KetoyNavRegistry.register(main)
        KetoyNavRegistry.register(demo)
    }
}`,
      language: 'kotlin',
    },

    // ── Registering in MainActivity ──
    {
      id: 'registration',
      title: 'Registering in MainActivity',
      content: `Register your nav graphs in \`onCreate\` before \`setContent\`, then use \`KetoyNavHost\` inside your Compose tree. Optionally fetch cloud overrides with \`KetoyCloud.fetchNavGraph()\`:`,
      code: `class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        // 1. Initialize the SDK
        Ketoy.initialize(
            context = applicationContext,
            cloudConfig = KetoyCloudConfig(
                apiKey = "your-api-key",
                packageName = "com.example.myapp",
                baseUrl = "https://ketoy-api.example.com"
            )
        )

        // 2. Register nav graphs (local-first)
        AppNavGraphs.registerAll()

        setContent {
            // 3. Fetch cloud nav graph overrides
            LaunchedEffect(Unit) {
                if (Ketoy.isCloudEnabled()) {
                    KetoyCloud.fetchNavGraph("nav_main")
                    KetoyCloud.fetchNavGraph("nav_demo")
                }
            }

            MyTheme {
                KetoyDevWrapper {
                    MainApp()
                }
            }
        }
    }
}`,
      language: 'kotlin',
    },

    // ── Using KetoyNavHost (full example) ──
    {
      id: 'full-example',
      title: 'Full Example – String Routes + Bottom Nav',
      content: `A complete example showing \`KetoyNavHost\` with string-based routes, a bottom navigation bar driven by the nav graph destinations, and action remap support:`,
      code: `@Composable
fun MainApp() {
    val navController = rememberNavController()
    val backStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = backStackEntry?.destination?.route

    // Resolve nav graph (priority: dev → cloud → local)
    val navGraph = KetoyNavDevOverrides.overrides["main"]
        ?: KetoyCloudNavOverrides.overrides["main"]
        ?: KetoyNavRegistry.get("main")
    val routeRemaps = remember(navGraph) {
        navGraph?.buildActionRemaps() ?: emptyMap()
    }
    val bottomDests = remember(navGraph) {
        navGraph?.destinations?.filter { it.label.isNotEmpty() } ?: emptyList()
    }

    Scaffold(
        bottomBar = {
            NavigationBar {
                bottomDests.forEach { dest ->
                    val targetRoute = routeRemaps["go_\${dest.resolvedId}"] ?: dest.route
                    val selected = currentRoute == targetRoute

                    NavigationBarItem(
                        selected = selected,
                        onClick = {
                            navController.navigate(targetRoute) {
                                popUpTo(navController.graph.startDestinationId) {
                                    saveState = true
                                }
                                launchSingleTop = true
                                restoreState = true
                            }
                        },
                        icon = {
                            val iconRef = if (selected) dest.selectedIcon else dest.icon
                            val imageVector = resolveIcon(iconRef)
                            if (imageVector != null) {
                                Icon(imageVector, contentDescription = dest.label)
                            }
                        },
                        label = { Text(dest.label) }
                    )
                }
            }
        }
    ) { innerPadding ->
        KetoyNavHost(
            startRoute = "home",
            navHostName = "main",
            modifier = Modifier.fillMaxSize().padding(innerPadding),
            navController = navController
        ) {
            composable("home") { HomeScreen() }
            composable("analytics") { AnalyticsScreen() }
            composable("cards") { CardsScreen() }
            composable("profile") { ProfileScreen() }
        }
    }
}`,
      language: 'kotlin',
    },

    // ── Nested nav host ──
    {
      id: 'nested-nav-host',
      title: 'Nested KetoyNavHost',
      content: `You can nest a second \`KetoyNavHost\` inside a screen for sub-navigation (e.g. a demo area, tabbed section). Each nav host uses its own \`navHostName\` for independent dev-server targeting:`,
      code: `@Composable
fun DemoNavScreen(onBack: () -> Unit) {
    // Register the demo nav graph
    remember { KetoyNavRegistry.register(AppNavGraphs.demo); true }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Nav Demo", fontWeight = FontWeight.SemiBold) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, "Back")
                    }
                }
            )
        }
    ) { innerPadding ->
        KetoyNavHost(
            startRoute = "explore",
            navHostName = "demo",
            modifier = Modifier.fillMaxSize().padding(innerPadding)
        ) {
            composable("explore") { DemoExploreScreen() }
            composable("favorites") { DemoFavoritesScreen() }
            composable("notifications") { DemoNotificationsScreen() }
            composable("settings") { DemoSettingsScreen() }
        }
    }
}`,
      language: 'kotlin',
    },

    // ── LocalKetoyNavController ──
    {
      id: 'nav-controller',
      title: 'KetoyNavController & Locals',
      content: `\`KetoyNavHost\` provides navigation state via \`CompositionLocal\`:`,
      code: `// Access from any child composable
val nav = LocalKetoyNavController.current
val navGraph = LocalKetoyNavGraph.current
val navHostName = LocalKetoyNavHostName.current`,
      language: 'kotlin',
      subsections: [
        {
          id: 'nav-controller-methods',
          title: 'KetoyNavController Methods',
          table: {
            headers: ['Method', 'Description'],
            rows: [
              ['navigate(route: T)', 'Navigate to a type-safe @Serializable route.'],
              ['navigateToRoute(id: String)', 'Navigate to a string route (resolved via action remap table).'],
              ['navigateAndReplace(route: T)', 'Navigate and replace the current screen in the back stack.'],
              ['navigateAndClearBackStack(route: T)', 'Navigate and clear the entire back stack.'],
              ['popBackStack()', 'Pop the current screen from the back stack.'],
              ['currentRouteAs<T>()', 'Extract the current route as a typed object.'],
            ],
          },
        },
        {
          id: 'nav-locals',
          title: 'CompositionLocals',
          table: {
            headers: ['Local', 'Type', 'Description'],
            rows: [
              ['LocalKetoyNavController', 'KetoyNavController?', 'The navigation controller for the current KetoyNavHost.'],
              ['LocalKetoyNavGraph', 'KetoyNavGraph?', 'The active navigation graph (from dev/cloud/local registry).'],
              ['LocalKetoyNavHostName', 'String?', 'Name of the currently active nav host (used by dev server).'],
            ],
          },
        },
      ],
    },

    // ── KetoyNavRegistry ──
    {
      id: 'nav-registry',
      title: 'KetoyNavRegistry',
      content: `Global singleton registry for \`KetoyNavGraph\` definitions. \`KetoyNavHost\` looks up graphs here when no dev-server or cloud override is active:`,
      code: `object KetoyNavRegistry {
    fun register(graph: KetoyNavGraph)
    fun get(name: String): KetoyNavGraph?
    fun getAll(): Map<String, KetoyNavGraph>
    fun getAllNames(): Set<String>
    fun clear()
}`,
      language: 'kotlin',
      subsections: [
        {
          id: 'registry-priority',
          title: 'Override Priority',
          content: `\`KetoyNavHost\` resolves nav graphs in this order (highest priority first):

1. **KetoyNavDevOverrides** — live dev-server reload
2. **KetoyCloudNavOverrides** — cloud-fetched graphs
3. **KetoyNavRegistry** — compile-time / locally registered

This means the dev server always wins during development, then cloud for production overrides, and local registry as the fallback.`,
        },
      ],
    },

    // ── Live route editing ──
    {
      id: 'live-editing',
      title: 'Live Route Editing',
      content: `One of the most powerful features — change navigation routes at runtime without recompiling:

### How it works
1. Define navigation actions with stable IDs in your \`KetoyNavGraph\`
2. In code, use \`navigateToRoute(navId)\` — it resolves through the remap table
3. Edit the JSON (\`route\` field) via dev server or cloud
4. The same code now navigates to the new route

### Example
In \`DemoNavGraphs.kt\`:
\`\`\`kotlin
KetoyNavAction(id = "go_favorites", route = "favorites", label = "Open Favorites")
\`\`\`

In your screen:
\`\`\`kotlin
nav?.navigateToRoute("go_favorites") // navigates to "favorites"
\`\`\`

Push updated JSON from the dev server:
\`\`\`json
{ "id": "go_favorites", "route": "bookmarks" }
\`\`\`

Now the same \`navigateToRoute("go_favorites")\` navigates to **"bookmarks"** — no code change, no recompile.`,
    },

    // ── Resolution order ──
    {
      id: 'screen-resolution',
      title: 'Screen Resolution',
      content: `When \`KetoyNavHost\` encounters a string route, it resolves the screen in this order:

1. **Builder DSL** — routes declared via \`composable("route") { ... }\` or \`screen<T> { ... }\`
2. **KetoyComposableRegistry** — native \`@Composable\` screen functions registered by route
3. **KetoyScreenRegistry** — JSON-rendered Ketoy screens (match by \`screenName\`)
4. **Fallback** — the \`fallback\` composable for unresolved routes (default shows "Screen not found: route")

For destinations defined in a nav graph override (dev/cloud), the screen is resolved by \`dest.screenName\` against the registries.`,
    },

    // ── Best practices ──
    {
      id: 'best-practices',
      title: 'Best Practices',
      content: `**Use stable action IDs** — Name navigation actions descriptively (e.g. \`"go_profile"\`, \`"open_settings"\`). These IDs persist across route changes.

**Register graphs early** — Call \`AppNavGraphs.registerAll()\` in \`onCreate\` before \`setContent\`. This ensures the local graph is always available as a fallback.

**Fetch cloud graphs in LaunchedEffect** — Cloud fetching is async. Wrap it in a \`LaunchedEffect(Unit)\` inside your Compose tree so it runs once on composition.

**Use navHostName for nested graphs** — Each \`KetoyNavHost\` should have a unique \`navHostName\` (e.g. \`"main"\`, \`"demo"\`). The dev server targets graphs by name.

**Mix route types freely** — Type-safe \`screen<T>\` and string-based \`composable("route")\` can coexist in the same \`KetoyNavHost\` builder. Use type-safe for compile-time safety, string-based for server-driven flexibility.

**Export your graphs** — Nav graphs are exported to JSON files (e.g. \`nav_main.json\`, \`nav_demo.json\`) by the Ketoy export tests. Push these to the dev server for live editing.`,
    },
  ],
  relatedReference: ['KetoyNavHost', 'KetoyRoute', 'KetoyNavGraph', 'KetoyNavDestination', 'KetoyNavAction', 'KetoyNavRegistry', 'KetoyNavController', 'LocalKetoyNavController', 'LocalKetoyNavGraph'],
  nextDoc: 'testing-locally',
  prevDoc: 'screens',
}

export default kNavigationDoc
