/**
 * Ketoy SDK – Cloud Module
 * Package: com.developerstring.ketoy.cloud
 * Sub-packages: cache, network
 */

const cloudData = {

  /* ── Cloud > Service ── */

  KetoyCloud: {
    name: 'KetoyCloud',
    kind: 'object',
    module: 'cloud',
    subpackage: 'service',
    category: 'Cloud',
    subcategory: 'Cloud Service',
    description: 'Public facade for all Ketoy Cloud operations. The primary entry point for interacting with the Ketoy SDUI backend at runtime. Exposes a clean, coroutine-friendly API that wraps KetoyCloudService and KetoyCloudNavService.',
    android: {
      packageName: 'com.developerstring.ketoy.cloud',
      annotations: [],
      imports: [
        'import com.developerstring.ketoy.cloud.cache.KetoyCacheStore',
      ],
      sourceCode: `object KetoyCloud {

    fun clearScreenCache(screenName: String): Boolean {
        return KetoyCloudService.clearScreenCache(screenName)
    }

    fun clearAllCache() {
        KetoyCloudService.clearAllCache()
    }

    fun getCachedScreenNames(): Set<String> {
        return KetoyCloudService.getCachedScreenNames()
    }

    suspend fun hasUpdate(screenName: String): Boolean {
        return KetoyCloudService.hasUpdate(screenName)
    }

    fun isCached(screenName: String): Boolean {
        return KetoyCacheStore.isCached(screenName)
    }

    fun getCachedVersion(screenName: String): String? {
        return KetoyCacheStore.getVersion(screenName)
    }

    suspend fun fetchNavGraph(
        navName: String
    ): KetoyCloudNavService.NavFetchResult {
        return KetoyCloudNavService.fetchNavGraph(navName)
    }

    suspend fun prefetchNavGraphs(
        navNames: List<String>
    ): Map<String, KetoyCloudNavService.NavFetchResult> {
        return KetoyCloudNavService.prefetchNavGraphs(navNames)
    }

    suspend fun hasNavUpdate(navName: String): Boolean {
        return KetoyCloudNavService.hasUpdate(navName)
    }

    fun clearNavCache(navName: String): Boolean {
        return KetoyCloudNavService.clearNavCache(navName)
    }

    fun clearAllNavCache() {
        KetoyCloudNavService.clearAllNavCache()
    }
}`,
    },
    methods: [
      { name: 'clearScreenCache(screenName: String)', returns: 'Boolean', description: 'Clear the cache for a specific screen. Returns true if the screen was found and removed.' },
      { name: 'clearAllCache()', returns: 'Unit', description: 'Clear all cached screens, removing every screen entry from KetoyCacheStore.' },
      { name: 'getCachedScreenNames()', returns: 'Set<String>', description: 'Get the names of all screens currently stored in the local cache.' },
      { name: 'hasUpdate(screenName: String)', returns: 'Boolean', description: 'Suspend. Check if a screen has an updated version on the server using lightweight version endpoint.' },
      { name: 'isCached(screenName: String)', returns: 'Boolean', description: 'Check if a screen is cached locally. No network call is made.' },
      { name: 'getCachedVersion(screenName: String)', returns: 'String?', description: 'Get the cached version string of a screen, or null if not cached.' },
      { name: 'fetchNavGraph(navName: String)', returns: 'NavFetchResult', description: 'Suspend. Fetch a navigation graph from the cloud. On success, auto-registers into KetoyCloudNavOverrides.' },
      { name: 'prefetchNavGraphs(navNames: List<String>)', returns: 'Map<String, NavFetchResult>', description: 'Suspend. Prefetch multiple navigation graphs in parallel during app startup.' },
      { name: 'hasNavUpdate(navName: String)', returns: 'Boolean', description: 'Suspend. Check if a navigation graph has an updated version on the server.' },
      { name: 'clearNavCache(navName: String)', returns: 'Boolean', description: 'Clear the cache for a specific navigation graph and unregister from KetoyCloudNavOverrides.' },
      { name: 'clearAllNavCache()', returns: 'Unit', description: 'Clear all cached navigation-graph overrides. Does not clear the screen cache.' },
    ],
    usage: `// Initialize first
Ketoy.initialize(
    cloudConfig = KetoyCloudConfig(
        apiKey = "fa044a28d695b2fa...",
        packageName = "com.example.myapp"
    )
)

// Screen cache management
KetoyCloud.clearScreenCache("home_screen")
KetoyCloud.clearAllCache()
val cached: Set<String> = KetoyCloud.getCachedScreenNames()
val isCached: Boolean = KetoyCloud.isCached("home_screen")
val version: String? = KetoyCloud.getCachedVersion("home_screen")

// Version checking
val needsUpdate: Boolean = KetoyCloud.hasUpdate("home_screen")

// Navigation graph operations
val result = KetoyCloud.fetchNavGraph("nav_main")
val results = KetoyCloud.prefetchNavGraphs(listOf("nav_main", "nav_settings"))
val hasNav: Boolean = KetoyCloud.hasNavUpdate("nav_main")`,
    notes: 'All methods are safe to call from any coroutine scope. Suspending functions perform network I/O on Dispatchers.IO internally. Ensure the SDK has been initialised via Ketoy.initialize() before calling any method.',
    seeAlso: ['KetoyCloudService', 'KetoyCloudNavService', 'KetoyCloudConfig', 'KetoyCacheStore', 'FetchResult', 'NavFetchResult', 'KetoyCloudScreen'],
  },

  KetoyCloudConfig: {
    name: 'KetoyCloudConfig',
    kind: 'data class',
    module: 'cloud',
    subpackage: 'service',
    category: 'Cloud',
    subcategory: 'Cloud Service',
    description: 'Configuration for connecting to the Ketoy Cloud (SDUI backend). Passed to Ketoy.initialize() to enable server-driven screen fetching. Every API call includes the apiKey and packageName as HTTP headers.',
    android: {
      packageName: 'com.developerstring.ketoy.cloud',
      annotations: [],
      imports: [],
      sourceCode: `data class KetoyCloudConfig(
    val apiKey: String,
    val packageName: String,
    val baseUrl: String = DEFAULT_BASE_URL
) {
    companion object {
        const val DEFAULT_BASE_URL = "https://api.ketoy.dev"
    }
}`,
    },
    properties: [
      { name: 'apiKey', type: 'String', default: '—', description: 'API key for authenticating with the Ketoy backend. Obtain this from your Ketoy Cloud dashboard.' },
      { name: 'packageName', type: 'String', default: '—', description: 'The Android application package name (e.g. "com.example.myapp"). Sent with every request so the backend can resolve the correct project.' },
      { name: 'baseUrl', type: 'String', default: '"https://api.ketoy.dev"', description: 'Base URL for the Ketoy API. Override when using a self-hosted Ketoy backend.' },
    ],
    usage: `// Minimal usage
val cloudConfig = KetoyCloudConfig(
    apiKey = "fa044a28d695b2fa...",
    packageName = "com.developerstring.myapp"
)
Ketoy.initialize(cloudConfig = cloudConfig)

// Custom base URL (self-hosted backend)
val cloudConfig = KetoyCloudConfig(
    apiKey = "my-key",
    packageName = "com.example.app",
    baseUrl = "https://sdui.internal.mycompany.com"
)`,
    notes: 'API headers sent with every request: x-api-key (apiKey) and x-package-name (packageName). The companion object contains DEFAULT_BASE_URL = "https://api.ketoy.dev".',
    seeAlso: ['KetoyCloud', 'KetoyCloudService', 'KetoyApiClient', 'KetoyCacheConfig'],
  },

  KetoyCloudService: {
    name: 'KetoyCloudService',
    kind: 'object',
    module: 'cloud',
    subpackage: 'service',
    category: 'Cloud',
    subcategory: 'Cloud Service',
    description: 'Orchestrates screen fetching from Ketoy Cloud with intelligent caching. Internal engine behind KetoyCloud and KetoyCloudScreen. Implements all five cache strategies defined by KetoyCacheStrategy.',
    android: {
      packageName: 'com.developerstring.ketoy.cloud',
      annotations: [],
      imports: [
        'import com.developerstring.ketoy.cloud.cache.KetoyCacheConfig',
        'import com.developerstring.ketoy.cloud.cache.KetoyCacheEntry',
        'import com.developerstring.ketoy.cloud.cache.KetoyCacheStore',
        'import com.developerstring.ketoy.cloud.cache.KetoyCacheStrategy',
        'import com.developerstring.ketoy.cloud.network.KetoyApiClient',
        'import com.developerstring.ketoy.cloud.network.KetoyNetworkException',
        'import kotlinx.coroutines.*',
        'import kotlinx.serialization.json.Json',
        'import kotlinx.serialization.json.JsonElement',
      ],
      sourceCode: `object KetoyCloudService {

    private const val TAG = "KetoyCloud"
    internal var cacheConfig: KetoyCacheConfig = KetoyCacheConfig.DEFAULT

    sealed class FetchResult {
        data class Success(
            val screenName: String,
            val version: String,
            val uiJson: String,
            val fromCache: Boolean
        ) : FetchResult()

        data class Error(
            val screenName: String,
            val message: String,
            val cause: Exception? = null
        ) : FetchResult()
    }

    suspend fun fetchScreen(screenName: String): FetchResult { ... }
    suspend fun hasUpdate(screenName: String): Boolean { ... }
    fun clearScreenCache(screenName: String): Boolean { ... }
    fun clearAllCache() { ... }
    fun getCachedScreenNames(): Set<String> { ... }
}`,
    },
    methods: [
      { name: 'fetchScreen(screenName: String)', returns: 'FetchResult', description: 'Suspend. Main entry point for all screen data retrieval. Delegates to the appropriate strategy handler based on cacheConfig. Runs entirely on Dispatchers.IO.' },
      { name: 'hasUpdate(screenName: String)', returns: 'Boolean', description: 'Suspend. Compares local cached version with server version using lightweight version endpoint. Safe to call frequently (e.g. on app resume).' },
      { name: 'clearScreenCache(screenName: String)', returns: 'Boolean', description: 'Clear the cache entry for a specific screen.' },
      { name: 'clearAllCache()', returns: 'Unit', description: 'Clear all cached screens from KetoyCacheStore.' },
      { name: 'getCachedScreenNames()', returns: 'Set<String>', description: 'Get the names of all screens currently present in the local cache.' },
    ],
    usage: `val result: FetchResult = KetoyCloudService.fetchScreen("home_screen")
when (result) {
    is FetchResult.Success -> renderUi(result.uiJson)
    is FetchResult.Error   -> showError(result.message)
}`,
    notes: 'Implements NETWORK_FIRST, CACHE_FIRST, OPTIMISTIC, CACHE_ONLY, and NETWORK_ONLY strategies. Background refresh is controlled by KetoyCacheConfig.refreshInBackground. Thread-safe: all public suspend functions switch to Dispatchers.IO internally.',
    seeAlso: ['KetoyCloud', 'FetchResult', 'KetoyCacheConfig', 'KetoyCacheStrategy', 'KetoyCacheStore', 'KetoyApiClient', 'KetoyCloudConfig'],
  },

  FetchResult: {
    name: 'FetchResult',
    kind: 'sealed class',
    module: 'cloud',
    subpackage: 'service',
    category: 'Cloud',
    subcategory: 'Cloud Service',
    description: 'Result of a screen fetch operation. Sealed hierarchy with two outcomes: Success (screen loaded from cache or network) and Error (fetch failed with human-readable message).',
    android: {
      packageName: 'com.developerstring.ketoy.cloud',
      annotations: [],
      imports: [],
      sourceCode: `sealed class FetchResult {
    data class Success(
        val screenName: String,
        val version: String,
        val uiJson: String,
        val fromCache: Boolean
    ) : FetchResult()

    data class Error(
        val screenName: String,
        val message: String,
        val cause: Exception? = null
    ) : FetchResult()
}`,
    },
    properties: [],
    innerClasses: [
      {
        name: 'FetchResult.Success',
        kind: 'data class',
        description: 'Screen loaded successfully.',
        properties: [
          { name: 'screenName', type: 'String', default: '—', description: 'The resolved screen identifier.' },
          { name: 'version', type: 'String', default: '—', description: 'Version string returned by the server or stored in cache.' },
          { name: 'uiJson', type: 'String', default: '—', description: 'The full JSON UI tree as a raw string, ready to be passed to JSONStringToUI.' },
          { name: 'fromCache', type: 'Boolean', default: '—', description: 'true if the content came from the local cache rather than a fresh network response.' },
        ],
      },
      {
        name: 'FetchResult.Error',
        kind: 'data class',
        description: 'Screen fetch failed.',
        properties: [
          { name: 'screenName', type: 'String', default: '—', description: 'The screen that was requested.' },
          { name: 'message', type: 'String', default: '—', description: 'Human-readable error description suitable for logging.' },
          { name: 'cause', type: 'Exception?', default: 'null', description: 'Optional underlying exception (e.g. KetoyNetworkException).' },
        ],
      },
    ],
    usage: `when (val r = KetoyCloudService.fetchScreen("home")) {
    is FetchResult.Success -> Log.d("UI", "Got \${r.screenName} v\${r.version}")
    is FetchResult.Error   -> Log.e("UI", r.message, r.cause)
}`,
    notes: 'Nested inside KetoyCloudService.',
    seeAlso: ['KetoyCloudService', 'KetoyCloud', 'KetoyNetworkException', 'CloudScreenState', 'KetoyCloudScreen'],
  },

  /* ── Cloud > Screen ── */

  KetoyCloudScreen: {
    name: 'KetoyCloudScreen',
    kind: '@Composable function',
    module: 'cloud',
    subpackage: 'screen',
    category: 'Cloud',
    subcategory: 'Cloud Screen',
    description: 'Renders a server-driven screen by its name using the unified KetoyScreen pipeline. Resolution order: Dev-server override → Cloud → Local JSON → DSL fallback → Error.',
    android: {
      packageName: 'com.developerstring.ketoy.cloud',
      annotations: ['@Composable'],
      imports: [
        'import androidx.compose.foundation.layout.Box',
        'import androidx.compose.runtime.*',
        'import androidx.compose.ui.Modifier',
        'import com.developerstring.ketoy.renderer.JSONStringToUI',
        'import com.developerstring.ketoy.screen.KetoyScreen',
        'import com.developerstring.ketoy.screen.KetoyScreenRegistry',
        'import com.developerstring.ketoy.theme.KetoyColorScheme',
      ],
      sourceCode: `@Composable
fun KetoyCloudScreen(
    screenName: String,
    modifier: Modifier = Modifier,
    colorScheme: KetoyColorScheme? = null,
    loadingContent: @Composable () -> Unit = { DefaultCloudLoading() },
    errorContent: @Composable (error: String, retry: () -> Unit) -> Unit = { error, retry ->
        DefaultCloudError(error, retry)
    }
)`,
    },
    properties: [
      { name: 'screenName', type: 'String', default: '—', description: 'The screen identifier. Must match the screen name registered on the Ketoy Cloud dashboard or in KetoyScreenRegistry.' },
      { name: 'modifier', type: 'Modifier', default: 'Modifier', description: 'Optional Modifier applied to the root Box container.' },
      { name: 'colorScheme', type: 'KetoyColorScheme?', default: 'null', description: 'Optional KetoyColorScheme for theming the rendered UI tree.' },
      { name: 'loadingContent', type: '@Composable () -> Unit', default: 'DefaultCloudLoading()', description: 'Composable shown while the screen JSON is being fetched. Defaults to a centred CircularProgressIndicator.' },
      { name: 'errorContent', type: '@Composable (String, () -> Unit) -> Unit', default: 'DefaultCloudError()', description: 'Composable shown when fetching fails. Receives the error message and a retry callback.' },
    ],
    usage: `// Basic usage
@Composable
fun App() {
    KetoyCloudScreen(screenName = "home_screen")
}

// With custom loading and error UI
KetoyCloudScreen(
    screenName = "profile",
    colorScheme = myKetoyColors,
    loadingContent = { ShimmerPlaceholder() },
    errorContent = { error, retry ->
        Column {
            Text("Oops: $error")
            Button(onClick = retry) { Text("Try again") }
        }
    }
)`,
    notes: 'If a KetoyScreen with the given screenName is already registered in KetoyScreenRegistry, this composable delegates to screen.Content(). Otherwise it falls back to a direct cloud fetch (legacy behaviour for screens not registered via ProvideKetoyScreen).',
    seeAlso: ['KetoyCloudScreenFromJson', 'CloudScreenState', 'KetoyCloudService', 'FetchResult', 'KetoyCloud', 'KComponent'],
  },

  KetoyCloudScreenFromJson: {
    name: 'KetoyCloudScreenFromJson',
    kind: '@Composable function',
    module: 'cloud',
    subpackage: 'screen',
    category: 'Cloud',
    subcategory: 'Cloud Screen',
    description: 'Renders a pre-fetched Ketoy screen from a raw JSON string. Use when you have already fetched or constructed the screen JSON yourself (e.g. from a custom API, local file, or Room database) without any network call.',
    android: {
      packageName: 'com.developerstring.ketoy.cloud',
      annotations: ['@Composable'],
      imports: [
        'import androidx.compose.foundation.layout.Box',
        'import androidx.compose.ui.Modifier',
        'import com.developerstring.ketoy.renderer.JSONStringToUI',
        'import com.developerstring.ketoy.theme.KetoyColorScheme',
      ],
      sourceCode: `@Composable
fun KetoyCloudScreenFromJson(
    json: String,
    modifier: Modifier = Modifier,
    colorScheme: KetoyColorScheme? = null
) {
    Box(modifier = modifier) {
        JSONStringToUI(value = json, colorScheme = colorScheme)
    }
}`,
    },
    properties: [
      { name: 'json', type: 'String', default: '—', description: 'The raw JSON string describing the Ketoy UI tree.' },
      { name: 'modifier', type: 'Modifier', default: 'Modifier', description: 'Optional Modifier applied to the root Box container.' },
      { name: 'colorScheme', type: 'KetoyColorScheme?', default: 'null', description: 'Optional KetoyColorScheme for theming.' },
    ],
    usage: `val json = myRepository.getScreenJson("dashboard")
KetoyCloudScreenFromJson(
    json = json,
    colorScheme = myKetoyColors
)`,
    notes: 'Expected JSON format: { "type": "Column", "children": [{ "type": "Text", "text": "Hello, World!" }] }',
    seeAlso: ['KetoyCloudScreen', 'CloudScreenState', 'KetoyJsonUtils', 'KetoyJson'],
  },

  CloudScreenState: {
    name: 'CloudScreenState',
    kind: 'sealed class',
    module: 'cloud',
    subpackage: 'screen',
    category: 'Cloud',
    subcategory: 'Cloud Screen',
    description: 'Internal state model for KetoyCloudScreen. Represents the three possible states during a cloud screen fetch: Loading, Loaded, and Error.',
    android: {
      packageName: 'com.developerstring.ketoy.cloud',
      annotations: ['private'],
      imports: [],
      sourceCode: `private sealed class CloudScreenState {
    data object Loading : CloudScreenState()
    data class Loaded(
        val uiJson: String,
        val version: String,
        val fromCache: Boolean
    ) : CloudScreenState()
    data class Error(val message: String) : CloudScreenState()
}`,
    },
    properties: [],
    innerClasses: [
      {
        name: 'CloudScreenState.Loading',
        kind: 'data object',
        description: 'Initial loading state. Screen JSON is being fetched.',
        properties: [],
      },
      {
        name: 'CloudScreenState.Loaded',
        kind: 'data class',
        description: 'Screen loaded successfully.',
        properties: [
          { name: 'uiJson', type: 'String', default: '—', description: 'The full JSON UI tree as a raw string.' },
          { name: 'version', type: 'String', default: '—', description: 'Version string from the server or cache.' },
          { name: 'fromCache', type: 'Boolean', default: '—', description: 'Whether content came from the local cache.' },
        ],
      },
      {
        name: 'CloudScreenState.Error',
        kind: 'data class',
        description: 'Fetch failed.',
        properties: [
          { name: 'message', type: 'String', default: '—', description: 'Human-readable error message.' },
        ],
      },
    ],
    notes: 'This is a private sealed class used internally by LegacyCloudFetch composable. Not accessible from external code.',
    seeAlso: ['KetoyCloudScreen', 'KetoyCloudScreenFromJson', 'FetchResult', 'KetoyCloudService'],
  },

  /* ── Cloud > Navigation ── */

  KetoyCloudNavService: {
    name: 'KetoyCloudNavService',
    kind: 'object',
    module: 'cloud',
    subpackage: 'navigation',
    category: 'Cloud',
    subcategory: 'Navigation',
    description: 'Handles fetching and caching navigation graphs from Ketoy Cloud. Uses the same REST endpoint as screen fetching. On success, parsed KetoyNavGraph is automatically registered into KetoyCloudNavOverrides.',
    android: {
      packageName: 'com.developerstring.ketoy.cloud',
      annotations: [],
      imports: [
        'import com.developerstring.ketoy.cloud.cache.KetoyCacheEntry',
        'import com.developerstring.ketoy.cloud.cache.KetoyCacheStore',
        'import com.developerstring.ketoy.cloud.cache.KetoyCacheStrategy',
        'import com.developerstring.ketoy.cloud.network.KetoyApiClient',
        'import com.developerstring.ketoy.navigation.KetoyCloudNavOverrides',
        'import com.developerstring.ketoy.navigation.KetoyNavGraph',
        'import kotlinx.coroutines.*',
      ],
      sourceCode: `object KetoyCloudNavService {

    private const val TAG = "KetoyCloudNav"

    sealed class NavFetchResult {
        data class Success(
            val navHostName: String,
            val version: String,
            val navGraph: KetoyNavGraph,
            val fromCache: Boolean
        ) : NavFetchResult()

        data class Error(
            val navName: String,
            val message: String,
            val cause: Exception? = null
        ) : NavFetchResult()
    }

    suspend fun fetchNavGraph(navName: String): NavFetchResult { ... }

    suspend fun prefetchNavGraphs(
        navNames: List<String>
    ): Map<String, NavFetchResult> = coroutineScope {
        navNames
            .map { name -> async { name to fetchNavGraph(name) } }
            .associate { it.await() }
    }

    suspend fun hasUpdate(navName: String): Boolean { ... }

    fun clearNavCache(navName: String): Boolean { ... }

    fun clearAllNavCache() { ... }
}`,
    },
    methods: [
      { name: 'fetchNavGraph(navName: String)', returns: 'NavFetchResult', description: 'Suspend. Fetch a navigation graph from cloud using the configured KetoyCacheStrategy. Auto-registers parsed graph into KetoyCloudNavOverrides.' },
      { name: 'prefetchNavGraphs(navNames: List<String>)', returns: 'Map<String, NavFetchResult>', description: 'Suspend. Prefetch multiple navigation graphs in parallel via coroutineScope + async.' },
      { name: 'hasUpdate(navName: String)', returns: 'Boolean', description: 'Suspend. Check if a nav graph has an updated version on the server using lightweight version endpoint.' },
      { name: 'clearNavCache(navName: String)', returns: 'Boolean', description: 'Clear the cache for a specific nav graph. Removes from KetoyCacheStore and unregisters from KetoyCloudNavOverrides.' },
      { name: 'clearAllNavCache()', returns: 'Unit', description: 'Clear all cached nav-graph overrides from KetoyCloudNavOverrides. Does not clear screen caches.' },
    ],
    usage: `// Fetch a single nav graph
lifecycleScope.launch {
    when (val result = KetoyCloudNavService.fetchNavGraph("nav_main")) {
        is NavFetchResult.Success ->
            Log.d("Nav", "Loaded \${result.navHostName} v\${result.version}")
        is NavFetchResult.Error ->
            Log.e("Nav", result.message)
    }
}

// Prefetch multiple nav graphs during startup
lifecycleScope.launch {
    val results = KetoyCloudNavService.prefetchNavGraphs(
        listOf("nav_main", "nav_settings", "nav_onboarding")
    )
    results.forEach { (name, result) ->
        Log.d("Nav", "$name -> $result")
    }
}`,
    notes: 'Uses the same REST endpoint as screen fetches: GET {baseUrl}/api/v1/screen?screen_name=nav_main. The "ui" field in the response contains a serialised KetoyNavGraph. Respects the global cache strategy configured via Ketoy.initialize().',
    seeAlso: ['KetoyCloud', 'NavFetchResult', 'KetoyCacheStore', 'KetoyCacheStrategy', 'KetoyApiClient', 'KetoyCacheEntry'],
  },

  NavFetchResult: {
    name: 'NavFetchResult',
    kind: 'sealed class',
    module: 'cloud',
    subpackage: 'navigation',
    category: 'Cloud',
    subcategory: 'Navigation',
    description: 'Result of a navigation-graph fetch operation. Sealed hierarchy with two outcomes: Success (nav graph loaded and auto-registered) and Error (fetch or parse failed).',
    android: {
      packageName: 'com.developerstring.ketoy.cloud',
      annotations: [],
      imports: [
        'import com.developerstring.ketoy.navigation.KetoyNavGraph',
      ],
      sourceCode: `sealed class NavFetchResult {
    data class Success(
        val navHostName: String,
        val version: String,
        val navGraph: KetoyNavGraph,
        val fromCache: Boolean
    ) : NavFetchResult()

    data class Error(
        val navName: String,
        val message: String,
        val cause: Exception? = null
    ) : NavFetchResult()
}`,
    },
    properties: [],
    innerClasses: [
      {
        name: 'NavFetchResult.Success',
        kind: 'data class',
        description: 'Navigation graph loaded successfully.',
        properties: [
          { name: 'navHostName', type: 'String', default: '—', description: 'The navHostName extracted from the parsed KetoyNavGraph. Used by KetoyNavHost to match cloud overrides.' },
          { name: 'version', type: 'String', default: '—', description: 'Version string from the server or local cache (e.g. "2.1.0").' },
          { name: 'navGraph', type: 'KetoyNavGraph', default: '—', description: 'The fully parsed KetoyNavGraph ready for rendering.' },
          { name: 'fromCache', type: 'Boolean', default: '—', description: 'true if the graph came from the local cache rather than a fresh network response.' },
        ],
      },
      {
        name: 'NavFetchResult.Error',
        kind: 'data class',
        description: 'Navigation graph fetch failed.',
        properties: [
          { name: 'navName', type: 'String', default: '—', description: 'The cloud screen name that was requested (e.g. "nav_main").' },
          { name: 'message', type: 'String', default: '—', description: 'Human-readable error description suitable for logging or display.' },
          { name: 'cause', type: 'Exception?', default: 'null', description: 'Optional underlying exception (e.g. KetoyNetworkException).' },
        ],
      },
    ],
    usage: `when (val r = KetoyCloudNavService.fetchNavGraph("nav_main")) {
    is NavFetchResult.Success -> Log.d("Nav", "Loaded \${r.navHostName}")
    is NavFetchResult.Error   -> Log.e("Nav", r.message, r.cause)
}`,
    notes: 'Nested inside KetoyCloudNavService. The Success variant auto-registers the parsed KetoyNavGraph into KetoyCloudNavOverrides.',
    seeAlso: ['KetoyCloudNavService', 'KetoyCloud', 'KetoyNetworkException', 'FetchResult'],
  },

  /* ── Cloud > Cache ── */

  KetoyCacheConfig: {
    name: 'KetoyCacheConfig',
    kind: 'data class',
    module: 'cloud',
    subpackage: 'cache',
    category: 'Cloud',
    subcategory: 'Cache',
    description: 'Configuration for Ketoy screen caching behaviour. Controls how screens are cached, when they expire, and whether the SDK should silently refresh stale data in the background.',
    android: {
      packageName: 'com.developerstring.ketoy.cloud.cache',
      annotations: [],
      imports: [
        'import kotlin.time.Duration',
        'import kotlin.time.Duration.Companion.days',
      ],
      sourceCode: `data class KetoyCacheConfig(
    val strategy: KetoyCacheStrategy = KetoyCacheStrategy.NETWORK_FIRST,
    val maxAge: Duration? = 30.days,
    val refreshInBackground: Boolean = true
) {
    companion object {
        val DEFAULT = KetoyCacheConfig()
    }
}`,
    },
    properties: [
      { name: 'strategy', type: 'KetoyCacheStrategy', default: 'NETWORK_FIRST', description: 'The caching strategy to use.' },
      { name: 'maxAge', type: 'Duration?', default: '30.days', description: 'Maximum age before cached data is considered stale. null means no time-based expiration (version-only invalidation).' },
      { name: 'refreshInBackground', type: 'Boolean', default: 'true', description: 'Whether to fetch fresh data silently in the background when returning cached content. Only applies to CACHE_FIRST and OPTIMISTIC strategies.' },
    ],
    usage: `// Basic usage
Ketoy.initialize(
    cacheConfig = KetoyCacheConfig(
        strategy = KetoyCacheStrategy.NETWORK_FIRST,
        maxAge = 30.days,
    )
)

// Strategy + background refresh
KetoyCacheConfig(
    strategy = KetoyCacheStrategy.CACHE_FIRST,
    maxAge = 1.hours,
    refreshInBackground = true
)

// Disable time-based expiration (version-only)
KetoyCacheConfig(
    strategy = KetoyCacheStrategy.CACHE_FIRST,
    maxAge = null
)`,
    notes: 'Companion object contains DEFAULT = KetoyCacheConfig() with NETWORK_FIRST strategy, 30-day max age, and background refresh enabled. Configured globally during SDK initialisation and shared between KetoyCloudService and KetoyCloudNavService.',
    seeAlso: ['KetoyCacheStrategy', 'KetoyCacheStore', 'KetoyCacheEntry', 'KetoyCloudService', 'KetoyCloudNavService'],
  },

  KetoyCacheEntry: {
    name: 'KetoyCacheEntry',
    kind: 'data class',
    module: 'cloud',
    subpackage: 'cache',
    category: 'Cloud',
    subcategory: 'Cache',
    description: 'Represents a single cached screen (or nav graph) entry stored locally. Contains the full JSON UI tree, a version identifier, and a timestamp used for time-based staleness checks.',
    android: {
      packageName: 'com.developerstring.ketoy.cloud.cache',
      annotations: ['@Serializable'],
      imports: [
        'import kotlinx.serialization.Serializable',
      ],
      sourceCode: `@Serializable
data class KetoyCacheEntry(
    val screenName: String,
    val version: String,
    val jsonContent: String,
    val cachedAt: Long = System.currentTimeMillis()
)`,
    },
    properties: [
      { name: 'screenName', type: 'String', default: '—', description: 'The screen identifier (e.g. "home_screen"). Also used as the file name in the cache directory.' },
      { name: 'version', type: 'String', default: '—', description: 'The version string from the server (e.g. "1.0.0"). Used for lightweight version comparison.' },
      { name: 'jsonContent', type: 'String', default: '—', description: 'The full JSON UI tree for the screen. When read back from KetoyCacheStore.get, contains actual JSON content loaded from disk.' },
      { name: 'cachedAt', type: 'Long', default: 'System.currentTimeMillis()', description: 'Epoch millis when this entry was cached.' },
    ],
    notes: 'Metadata (version, timestamp) goes into SharedPreferences. JSON content goes into a separate internal file to handle large payloads. The jsonContent is stored as empty string in SharedPreferences; the actual UI JSON is stored separately on disk.',
    seeAlso: ['KetoyCacheStore', 'KetoyCacheConfig', 'KetoyCacheStrategy', 'KetoyCloudService', 'KetoyCloudNavService'],
  },

  KetoyCacheStore: {
    name: 'KetoyCacheStore',
    kind: 'object',
    module: 'cloud',
    subpackage: 'cache',
    category: 'Cloud',
    subcategory: 'Cache',
    description: 'Local cache storage for Ketoy server-driven screens and navigation graphs. Uses a two-tier approach: SharedPreferences for metadata (version, timestamp) and internal files for actual JSON content.',
    android: {
      packageName: 'com.developerstring.ketoy.cloud.cache',
      annotations: [],
      imports: [
        'import android.content.Context',
        'import android.content.SharedPreferences',
        'import kotlinx.serialization.encodeToString',
        'import kotlinx.serialization.json.Json',
        'import java.io.File',
      ],
      sourceCode: `object KetoyCacheStore {

    private const val PREFS_NAME = "ketoy_screen_cache"
    private const val CACHE_DIR_NAME = "ketoy_cache"
    private const val META_PREFIX = "meta_"

    fun initialize(context: Context) { ... }
    fun put(screenName: String, version: String, jsonContent: String) { ... }
    fun get(screenName: String): KetoyCacheEntry? { ... }
    fun getVersion(screenName: String): String? { ... }
    fun getCachedAt(screenName: String): Long? { ... }
    fun isCached(screenName: String): Boolean { ... }
    fun remove(screenName: String): Boolean { ... }
    fun clearAll() { ... }
    fun getAllCachedScreenNames(): Set<String> { ... }
}`,
    },
    methods: [
      { name: 'initialize(context: Context)', returns: 'Unit', description: 'Initialise the cache store with an Android Context. Must be called before any cache operations. Handled automatically by Ketoy.initialize().' },
      { name: 'put(screenName, version, jsonContent)', returns: 'Unit', description: 'Save a screen\'s JSON content and metadata to the local cache. Metadata stored in SharedPreferences, JSON written to internal file.' },
      { name: 'get(screenName: String)', returns: 'KetoyCacheEntry?', description: 'Get a cached screen entry, or null if not cached. Loads metadata from SharedPreferences and JSON content from internal file.' },
      { name: 'getVersion(screenName: String)', returns: 'String?', description: 'Get only the cached version string without loading the JSON content into memory.' },
      { name: 'getCachedAt(screenName: String)', returns: 'Long?', description: 'Get the epoch-millis timestamp of when a screen was cached.' },
      { name: 'isCached(screenName: String)', returns: 'Boolean', description: 'Check if a screen is cached (both metadata in SharedPreferences and a JSON file on disk).' },
      { name: 'remove(screenName: String)', returns: 'Boolean', description: 'Remove a specific screen from the cache. Deletes both SharedPreferences metadata and internal JSON file.' },
      { name: 'clearAll()', returns: 'Unit', description: 'Clear all cached screens. Wipes all SharedPreferences metadata and deletes every file in the cache directory.' },
      { name: 'getAllCachedScreenNames()', returns: 'Set<String>', description: 'Get the names of all screens currently in the cache. Strips the internal META_PREFIX from SharedPreferences keys.' },
    ],
    usage: `// Initialize (typically during SDK init)
KetoyCacheStore.initialize(applicationContext)

// Write
KetoyCacheStore.put("home_screen", "1.0.0", homeJson)

// Read
val entry: KetoyCacheEntry? = KetoyCacheStore.get("home_screen")

// Quick version check
val version: String? = KetoyCacheStore.getVersion("home_screen")

// Delete
KetoyCacheStore.remove("home_screen")
KetoyCacheStore.clearAll()`,
    notes: 'Uses two-tier storage: SharedPreferences for fast metadata lookups, internal files for large JSON payloads. Individual reads/writes are atomic at the SharedPreferences level; file I/O runs on the caller\'s dispatcher (typically Dispatchers.IO).',
    seeAlso: ['KetoyCacheEntry', 'KetoyCacheConfig', 'KetoyCacheStrategy', 'KetoyCloudService', 'KetoyCloudNavService', 'KetoyCloud'],
  },

  KetoyCacheStrategy: {
    name: 'KetoyCacheStrategy',
    kind: 'enum class',
    module: 'cloud',
    subpackage: 'cache',
    category: 'Cloud',
    subcategory: 'Cache',
    description: 'Defines caching strategies for Ketoy server-driven screens and navigation graphs. Inspired by service workers, HTTP Cache-Control, and SWR (stale-while-revalidate) patterns.',
    android: {
      packageName: 'com.developerstring.ketoy.cloud.cache',
      annotations: [],
      imports: [],
      sourceCode: `enum class KetoyCacheStrategy {
    NETWORK_FIRST,
    CACHE_FIRST,
    OPTIMISTIC,
    CACHE_ONLY,
    NETWORK_ONLY
}`,
    },
    properties: [
      { name: 'NETWORK_FIRST', type: 'KetoyCacheStrategy', default: '—', description: 'Always fetch from network first; fall back to cache on failure. Default strategy. Best for real-time dashboards, frequently changing screens, e-commerce product listings.' },
      { name: 'CACHE_FIRST', type: 'KetoyCacheStrategy', default: '—', description: 'Use cached data if available and valid; fall back to network. Optionally refreshes in background. Best for offline-first apps, content that rarely changes.' },
      { name: 'OPTIMISTIC', type: 'KetoyCacheStrategy', default: '—', description: 'Return cached data immediately while fetching updates in background (SWR pattern). Fastest perceived loading time. Best for UI layouts, nav graphs.' },
      { name: 'CACHE_ONLY', type: 'KetoyCacheStrategy', default: '—', description: 'Only use cached data; never make network requests. Returns error if no cache exists. Best for airplane/offline mode, pre-cached screens.' },
      { name: 'NETWORK_ONLY', type: 'KetoyCacheStrategy', default: '—', description: 'Always fetch from network; never use or update cache. Best for sensitive, non-cacheable data, debugging.' },
    ],
    usage: `Ketoy.initialize(
    cacheConfig = KetoyCacheConfig(
        strategy = KetoyCacheStrategy.NETWORK_FIRST
    )
)`,
    notes: 'Strategy comparison: NETWORK_FIRST (Network → Cache fallback), CACHE_FIRST (Cache → Network fallback), OPTIMISTIC (Cache instant + Background refresh), CACHE_ONLY (Cache → Error), NETWORK_ONLY (Network → Error).',
    seeAlso: ['KetoyCacheConfig', 'KetoyCacheStore', 'KetoyCacheEntry', 'KetoyCloudService', 'KetoyCloudNavService'],
  },

  /* ── Cloud > Network ── */

  KetoyApiClient: {
    name: 'KetoyApiClient',
    kind: 'object',
    module: 'cloud',
    subpackage: 'network',
    category: 'Cloud',
    subcategory: 'Network',
    description: 'Low-level HTTP client for the Ketoy SDUI REST API. Uses HttpURLConnection to avoid external dependencies. Makes authenticated requests to fetch screen JSON and check versions.',
    android: {
      packageName: 'com.developerstring.ketoy.cloud.network',
      annotations: [],
      imports: [
        'import com.developerstring.ketoy.cloud.KetoyCloudConfig',
        'import kotlinx.serialization.json.Json',
        'import kotlinx.serialization.json.JsonElement',
        'import java.net.HttpURLConnection',
        'import java.net.URL',
      ],
      sourceCode: `object KetoyApiClient {

    private var config: KetoyCloudConfig? = null
    private val json = Json { ignoreUnknownKeys = true; encodeDefaults = false }

    fun initialize(config: KetoyCloudConfig) {
        this.config = config
    }

    fun fetchScreen(screenName: String): KetoyScreenData { ... }

    fun fetchScreenVersion(screenName: String): KetoyScreenVersionData { ... }

    private fun executeGet(urlString: String, cfg: KetoyCloudConfig): String { ... }
}`,
    },
    methods: [
      { name: 'initialize(config: KetoyCloudConfig)', returns: 'Unit', description: 'Initialise the client with a KetoyCloudConfig. Must be called before fetchScreen or fetchScreenVersion. Handled automatically by Ketoy.initialize().' },
      { name: 'fetchScreen(screenName: String)', returns: 'KetoyScreenData', description: 'Fetch the full screen JSON from the server. Calls GET {baseUrl}/api/v1/screen?screen_name={screenName}. Throws KetoyNetworkException on error.' },
      { name: 'fetchScreenVersion(screenName: String)', returns: 'KetoyScreenVersionData', description: 'Check the version of a screen on the server (lightweight call). Calls GET {baseUrl}/api/v1/screen/version?screen_name={screenName}.' },
    ],
    usage: `// Called internally by Ketoy.initialize()
KetoyApiClient.initialize(
    KetoyCloudConfig(
        apiKey = "fa044a28d695b2fa...",
        packageName = "com.example.app"
    )
)

// Fetch screen (typically called by KetoyCloudService, not directly)
val data: KetoyScreenData = KetoyApiClient.fetchScreen("home_screen")`,
    notes: 'API endpoints: GET /api/v1/screen?screen_name={name} (full screen JSON), GET /api/v1/screen/version?screen_name={name} (lightweight version). Authentication: x-api-key and x-package-name headers. Timeouts: connect 15s, read 30s.',
    seeAlso: ['KetoyCloudConfig', 'KetoyScreenData', 'KetoyScreenVersionData', 'KetoyNetworkException', 'KetoyApiResponse', 'KetoyCloudService'],
  },

  KetoyApiResponse: {
    name: 'KetoyApiResponse',
    kind: 'data class',
    module: 'cloud',
    subpackage: 'network',
    category: 'Cloud',
    subcategory: 'Network',
    description: 'Generic response wrapper from the Ketoy API. All API responses share this structure with success boolean, data payload, and optional error message.',
    android: {
      packageName: 'com.developerstring.ketoy.cloud.network',
      annotations: ['@Serializable'],
      imports: [
        'import kotlinx.serialization.Serializable',
        'import kotlinx.serialization.json.JsonElement',
      ],
      sourceCode: `@Serializable
data class KetoyApiResponse<T>(
    val success: Boolean,
    val data: T? = null,
    val error: String? = null
)`,
    },
    properties: [
      { name: 'success', type: 'Boolean', default: '—', description: 'Whether the API call succeeded.' },
      { name: 'data', type: 'T?', default: 'null', description: 'The response payload; null when success is false.' },
      { name: 'error', type: 'String?', default: 'null', description: 'Error message from the server; null on success.' },
    ],
    notes: 'Generic type parameter T represents the data payload type (e.g. KetoyScreenData, KetoyScreenVersionData).',
    seeAlso: ['KetoyApiClient', 'KetoyScreenData', 'KetoyScreenVersionData', 'KetoyNetworkException'],
  },

  KetoyScreenData: {
    name: 'KetoyScreenData',
    kind: 'data class',
    module: 'cloud',
    subpackage: 'network',
    category: 'Cloud',
    subcategory: 'Network',
    description: 'The data payload returned by the full screen fetch endpoint (GET /api/v1/screen). Contains the screen name, version, and the raw JSON UI tree.',
    android: {
      packageName: 'com.developerstring.ketoy.cloud.network',
      annotations: ['@Serializable'],
      imports: [
        'import kotlinx.serialization.Serializable',
        'import kotlinx.serialization.json.JsonElement',
      ],
      sourceCode: `@Serializable
data class KetoyScreenData(
    val screenName: String,
    val version: String,
    val ui: JsonElement
)`,
    },
    properties: [
      { name: 'screenName', type: 'String', default: '—', description: 'The server-side screen identifier (e.g. "home_screen").' },
      { name: 'version', type: 'String', default: '—', description: 'Semantic version string (e.g. "1.0.0") used for cache invalidation.' },
      { name: 'ui', type: 'JsonElement', default: '—', description: 'The raw JSON element representing the Ketoy UI tree. Can describe a screen layout or a navigation graph.' },
    ],
    seeAlso: ['KetoyApiClient', 'KetoyApiResponse', 'KetoyScreenVersionData', 'KetoyNetworkException', 'KetoyCloudService'],
  },

  KetoyScreenVersionData: {
    name: 'KetoyScreenVersionData',
    kind: 'data class',
    module: 'cloud',
    subpackage: 'network',
    category: 'Cloud',
    subcategory: 'Network',
    description: 'The data payload returned by the version-only check endpoint (GET /api/v1/screen/version). A lightweight alternative to KetoyScreenData — returns only version metadata without the full UI tree.',
    android: {
      packageName: 'com.developerstring.ketoy.cloud.network',
      annotations: ['@Serializable'],
      imports: [
        'import kotlinx.serialization.Serializable',
      ],
      sourceCode: `@Serializable
data class KetoyScreenVersionData(
    val screenName: String,
    val version: String,
    val updatedAt: String? = null
)`,
    },
    properties: [
      { name: 'screenName', type: 'String', default: '—', description: 'The server-side screen identifier (e.g. "home_screen").' },
      { name: 'version', type: 'String', default: '—', description: 'Semantic version string (e.g. "1.2.0").' },
      { name: 'updatedAt', type: 'String?', default: 'null', description: 'ISO-8601 timestamp of the last server update. May be null if the server does not provide it.' },
    ],
    seeAlso: ['KetoyApiClient', 'KetoyApiResponse', 'KetoyScreenData', 'KetoyNetworkException', 'KetoyCloudService'],
  },

  KetoyNetworkException: {
    name: 'KetoyNetworkException',
    kind: 'class',
    module: 'cloud',
    subpackage: 'network',
    category: 'Cloud',
    subcategory: 'Network',
    description: 'Exception thrown by the Ketoy network layer. Wraps HTTP and API errors with a human-readable message. When the error originates from an HTTP response, statusCode contains the HTTP status code.',
    android: {
      packageName: 'com.developerstring.ketoy.cloud.network',
      annotations: [],
      imports: [],
      sourceCode: `class KetoyNetworkException(
    message: String,
    val statusCode: Int? = null
) : Exception(message)`,
    },
    properties: [
      { name: 'message', type: 'String', default: '—', description: 'Human-readable error description.' },
      { name: 'statusCode', type: 'Int?', default: 'null', description: 'HTTP status code, if available; null for non-HTTP errors (e.g. client not initialised).' },
    ],
    usage: `try {
    val data = KetoyApiClient.fetchScreen("home")
} catch (e: KetoyNetworkException) {
    Log.e("Network", "Failed: \${e.message}, HTTP \${e.statusCode}")
}`,
    seeAlso: ['KetoyApiClient', 'FetchResult', 'NavFetchResult', 'KetoyApiResponse', 'KetoyCloudService'],
  },

}

export default cloudData
