/**
 * Ketoy Documentation – Initialization
 * Covers: Ketoy.initialize() and all its sub-properties
 */

const initializationDoc = {
  id: 'initialization',
  title: 'Ketoy Initialization',
  description: 'Learn how to initialize the Ketoy SDUI engine in your Android app. This guide covers the Ketoy.initialize() call, all its parameters, and sub-configurations like cloud and cache.',
  icon: 'FaRocket',
  order: 1,
  sections: [
    {
      id: 'installation',
      title: 'Installation',
      content: `Add the Ketoy SDK to your Android project. Always use the **latest version** — check [Maven Central](https://central.sonatype.com/artifact/dev.ketoy/sdk) for the most recent release.

The artifact coordinates are: **group** \`dev.ketoy\`, **name** \`sdk\`.

| Build System | Config File | Latest Version |
|---|---|---|
| Kotlin DSL | \`build.gradle.kts\` | \`0.1-beta\` |
| Groovy DSL | \`build.gradle\` | \`0.1-beta\` |
| Version Catalog (TOML) | \`libs.versions.toml\` | \`0.1-beta\` |`,
      subsections: [
        {
          id: 'install-kotlin-dsl',
          title: 'Kotlin DSL',
          content: 'Add the dependency in your module-level `build.gradle.kts`:',
          code: `dependencies {
    implementation("dev.ketoy:sdk:0.1-beta")
}`,
          language: 'kotlin',
          codeTitle: 'build.gradle.kts',
        },
        {
          id: 'install-groovy',
          title: 'Groovy DSL',
          content: 'Add the dependency in your module-level `build.gradle`:',
          code: `dependencies {
    implementation 'dev.ketoy:sdk:0.1-beta'
}`,
          language: 'groovy',
          codeTitle: 'build.gradle',
        },
        {
          id: 'install-toml',
          title: 'Version Catalog (TOML)',
          content: 'If you use a Gradle version catalog, declare the version and library in `libs.versions.toml`:',
          code: `[versions]
ketoy = "0.1-beta"

[libraries]
ketoy-sdk = { group = "dev.ketoy", name = "sdk", version.ref = "ketoy" }`,
          language: 'toml',
          codeTitle: 'libs.versions.toml',
          subsections: [
            {
              id: 'install-toml-usage',
              title: 'Then reference it in your build file',
              content: 'Reference the catalog alias in your module-level `build.gradle.kts`:',
              code: `dependencies {
    implementation(libs.ketoy.sdk)
}`,
              language: 'kotlin',
              codeTitle: 'build.gradle.kts',
            },
          ],
        },
      ],
    },
    {
      id: 'overview',
      title: 'Overview',
      content: `Ketoy is initialized via a single call to \`Ketoy.initialize()\`. This must be invoked **before** rendering any server-driven UI — typically inside your \`Application.onCreate()\` or root composable.

The initializer sets up:
- **Core registries** (components, widgets, actions, variables, functions)
- **Custom widget & action parsers** you provide
- **Screens** (from JSON or builder functions)
- **Cloud configuration** (optional) for fetching UI from the Ketoy backend
- **Cache configuration** for controlling how fetched screens are stored`,
    },
    {
      id: 'basic-setup',
      title: 'Basic Setup',
      content: 'The simplest way to get started — local-only mode without cloud features. This initializes the core registries and built-in parsers.',
      code: `// In your Application class or root Composable
Ketoy.initialize()

// You can now render server-driven UI from local JSON
JSONStringToUI(value = myJsonString)`,
      language: 'kotlin',
    },
    {
      id: 'full-signature',
      title: 'Full Signature',
      content: 'The complete initialization signature with all available parameters:',
      code: `Ketoy.initialize(
    context: Context? = null,
    widgetParsers: List<KetoyWidgetParser<*>> = emptyList(),
    actionParsers: List<KetoyActionParser<*>> = emptyList(),
    cloudConfig: KetoyCloudConfig? = null,
    cacheConfig: KetoyCacheConfig = KetoyCacheConfig.DEFAULT,
    force: Boolean = false
)`,
      language: 'kotlin',
    },
    {
      id: 'parameters',
      title: 'Parameters',
      content: 'Each parameter controls a specific aspect of the SDK setup:',
      table: {
        headers: ['Parameter', 'Type', 'Default', 'Description'],
        rows: [
          ['context', 'Context?', 'null', 'Android context. Required when cloudConfig is set (needed for network and cache). Pass applicationContext.'],
          ['widgetParsers', 'List<KetoyWidgetParser<*>>', 'emptyList()', 'Custom widget parsers to register. Each parser handles rendering a custom component type from JSON.'],
          ['actionParsers', 'List<KetoyActionParser<*>>', 'emptyList()', 'Custom action parsers to register. Each parser handles executing a custom action triggered from the UI.'],
          ['cloudConfig', 'KetoyCloudConfig?', 'null', 'Cloud configuration for connecting to the Ketoy backend. When null, cloud features are disabled.'],
          ['cacheConfig', 'KetoyCacheConfig', 'KetoyCacheConfig.DEFAULT', 'Cache configuration controlling how fetched screens are persisted and refreshed.'],
          ['force', 'Boolean', 'false', 'When true, re-initializes even if already initialized. Useful for testing or hot-reload scenarios.'],
        ],
      },
    },
    {
      id: 'cloud-config',
      title: 'Cloud Configuration',
      content: `To enable fetching screens from the Ketoy Cloud backend, provide a \`KetoyCloudConfig\`. This requires an API key and your app's package name.`,
      code: `Ketoy.initialize(
    context = applicationContext,
    cloudConfig = KetoyCloudConfig(
        apiKey = "your-api-key",          // From Ketoy Cloud dashboard
        packageName = "com.example.myapp", // Your app's package name
        baseUrl = "https://api.ketoy.dev"  // Default — override for self-hosted
    )
)`,
      language: 'kotlin',
      subsections: [
        {
          id: 'cloud-config-properties',
          title: 'KetoyCloudConfig Properties',
          table: {
            headers: ['Property', 'Type', 'Default', 'Description'],
            rows: [
              ['apiKey', 'String', '—', 'API key for authenticating with the Ketoy backend. Obtain this from your Ketoy Cloud dashboard.'],
              ['packageName', 'String', '—', 'Android application package name (e.g. "com.example.myapp"). Sent as an HTTP header with every request.'],
              ['baseUrl', 'String', '"https://api.ketoy.dev"', 'Base URL for the Ketoy API. Override when using a self-hosted backend.'],
            ],
          },
        },
      ],
    },
    {
      id: 'cache-config',
      title: 'Cache Configuration',
      content: `Control how Ketoy caches fetched screen data. The \`KetoyCacheConfig\` lets you choose a cache strategy and set expiry.`,
      code: `Ketoy.initialize(
    context = applicationContext,
    cloudConfig = KetoyCloudConfig(
        apiKey = "your-api-key",
        packageName = "com.example.myapp"
    ),
    cacheConfig = KetoyCacheConfig(
        strategy = KetoyCacheStrategy.NETWORK_FIRST,
        maxAge = 30.days
    )
)`,
      language: 'kotlin',
      subsections: [
        {
          id: 'cache-strategies',
          title: 'Cache Strategies',
          table: {
            headers: ['Strategy', 'Description'],
            rows: [
              ['NETWORK_FIRST', 'Always try the network first. Falls back to cache if the network fails. Best for apps that need fresh data.'],
              ['CACHE_FIRST', 'Serve from cache immediately. Refresh in the background for next time. Best for performance-sensitive apps.'],
              ['OPTIMISTIC', 'Serve from cache immediately AND fetch from network. Replace the UI if a newer version arrives.'],
              ['CACHE_ONLY', 'Never hit the network. Only serve from cache. Useful for offline-first apps.'],
              ['NETWORK_ONLY', 'Always fetch from network. Never write to or read from cache.'],
            ],
          },
        },
        {
          id: 'cache-config-properties',
          title: 'KetoyCacheConfig Properties',
          table: {
            headers: ['Property', 'Type', 'Default', 'Description'],
            rows: [
              ['strategy', 'KetoyCacheStrategy', 'NETWORK_FIRST', 'Defines how screen data is fetched and cached.'],
              ['maxAge', 'Duration', '7.days', 'Maximum age of cached data before it is considered stale and evicted.'],
            ],
          },
        },
      ],
    },
    {
      id: 'custom-parsers',
      title: 'Custom Widget & Action Parsers',
      content: `You can extend the Ketoy component system by registering custom widget and action parsers during initialization.`,
      code: `// Custom widget parser
class MyBadgeParser : KetoyWidgetParser<MyBadgeProps>("badge") {
    @Composable
    override fun Render(props: MyBadgeProps, children: List<UIComponent>?) {
        Badge(text = props.text, color = props.color)
    }
}

// Custom action parser
class ShowToastParser : KetoyActionParser<ShowToastAction>("showToast") {
    override fun execute(action: ShowToastAction, context: ActionContext) {
        Toast.makeText(context.androidContext, action.message, Toast.LENGTH_SHORT).show()
    }
}

// Register during initialization
Ketoy.initialize(
    widgetParsers = listOf(MyBadgeParser(), MyRatingParser()),
    actionParsers = listOf(ShowToastParser(), OpenUrlParser())
)`,
      language: 'kotlin',
    },
    {
      id: 'screens',
      title: 'Registering Screens',
      content: `Use \`ProvideKetoyScreen\` directly in your composable tree to register screens. This composable creates (or retrieves) a \`KetoyScreen\` and provides it to child composables via \`LocalKetoyScreen\`. Each screen can contain one or more \`KetoyContent\` blocks interleaved with native Compose code.`,
      code: `// ProvideKetoyScreen composable
@Composable
fun HomeScreen() {
    ProvideKetoyScreen(screenName = "home") {
        KetoyContent(nodeBuilder = { buildHomeUI() })
    }
}

// Multi-content screen with native Compose code
@Composable
fun DashboardScreen() {
    ProvideKetoyScreen(screenName = "dashboard") {
        KetoyContent(name = "cards", nodeBuilder = { buildCards() })
        Text("Native Compose section")
        KetoyContent(name = "transactions", nodeBuilder = { buildTxns() })
    }
}`,
      language: 'kotlin',
    },
    {
      id: 'advanced-example',
      title: 'Advanced Example',
      content: `A complete initialization with all features enabled:`,
      code: `class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        Ketoy.initialize(
            context = applicationContext,
            widgetParsers = listOf(
                MyBadgeParser(),
                MyRatingParser(),
                MyChartParser()
            ),
            actionParsers = listOf(
                ShowToastParser(),
                OpenUrlParser(),
                AnalyticsEventParser()
            ),
            cloudConfig = KetoyCloudConfig(
                apiKey = BuildConfig.KETOY_API_KEY,
                packageName = packageName,
                baseUrl = "https://api.ketoy.dev"
            ),
            cacheConfig = KetoyCacheConfig(
                strategy = KetoyCacheStrategy.OPTIMISTIC,
                maxAge = 24.hours
            )
        )
    }
}`,
      language: 'kotlin',
    },
    {
      id: 'initialization-order',
      title: 'Initialization Order',
      content: `When \`Ketoy.initialize()\` is called, the following happens in order:

1. **KComponentRegistry** is initialized (resets all registered @KComponent composables)
2. **ActionRegistry** is cleared (removes all registered actions)
3. **KetoyVariableRegistry** is cleared (removes all runtime variables)
4. **KetoyFunctionRegistry** is cleared (removes all registered functions)
5. **Custom widget parsers** are registered in KetoyWidgetRegistry
6. **Custom action parsers** are registered in KetoyActionRegistry
7. **Built-in parsers** are registered (NavigateActionParser, CallFunctionActionParser)
8. **Screens** are registered in KetoyScreenRegistry
9. **Cloud & cache** are configured if cloudConfig is provided (requires Android Context)

Exceptions during initialization are caught and printed to stderr — the host app decides crash policy.`,
    },
    {
      id: 'state-checking',
      title: 'Checking State',
      content: `After initialization you can query the SDK state:`,
      code: `// Check if the SDK has been initialized
val ready: Boolean = Ketoy.isInitialized()

// Check if cloud features are configured
val cloudEnabled: Boolean = Ketoy.isCloudEnabled()

// Get cloud config (null if not configured)
val config: KetoyCloudConfig? = Ketoy.cloudConfig`,
      language: 'kotlin',
    },
    {
      id: 'reset',
      title: 'Resetting (Testing)',
      content: `For testing or hot-reload scenarios, you can reset all SDK state:`,
      code: `// Reset everything — clears all registries, cloud config, sets isInitialized to false
Ketoy.reset()

// Re-initialize with different config
Ketoy.initialize(
    context = applicationContext,
    cloudConfig = KetoyCloudConfig(apiKey = "test-key", packageName = "com.test.app"),
    force = true  // Also works: force re-init without reset
)`,
      language: 'kotlin',
    },
  ],
  relatedReference: ['Ketoy', 'KetoyCloudConfig', 'KetoyCacheConfig', 'KetoyCloudService', 'ProvideKetoyScreen', 'KetoyContent', 'KetoyWidgetParser', 'KetoyActionParser'],
  nextDoc: 'layouts',
  prevDoc: null,
}

export default initializationDoc
