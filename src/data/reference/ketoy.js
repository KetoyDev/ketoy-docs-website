/**
 * Ketoy SDK – Root Entry Point
 * Package: com.developerstring.ketoy
 */

const ketoyData = {

  /* ── Root > Ketoy ── */

  Ketoy: {
    name: 'Ketoy',
    kind: 'object',
    module: 'ketoy',
    subpackage: 'root',
    category: 'Ketoy',
    subcategory: 'Entry Point',
    description: 'Main entry point for the Ketoy SDK. Call Ketoy.initialize() at app startup (e.g. inside your root composable or Application.onCreate) before rendering any server-driven UI. Configures core registries, custom parsers, screens, and optional cloud features.',
    android: {
      packageName: 'com.developerstring.ketoy',
      annotations: [],
      imports: [
        'import android.content.Context',
        'import com.developerstring.ketoy.cloud.KetoyCloudConfig',
        'import com.developerstring.ketoy.cloud.cache.KetoyCacheConfig',
        'import com.developerstring.ketoy.screen.KetoyScreen',
        'import com.developerstring.ketoy.widget.KetoyActionParser',
        'import com.developerstring.ketoy.widget.KetoyWidgetParser',
      ],
      sourceCode: `object Ketoy {

    private var isInitialized = false
    private var _cloudConfig: KetoyCloudConfig? = null

    val cloudConfig: KetoyCloudConfig? get() = _cloudConfig

    fun initialize(
        context: Context? = null,
        widgetParsers: List<KetoyWidgetParser<*>> = emptyList(),
        actionParsers: List<KetoyActionParser<*>> = emptyList(),
        screens: List<KetoyScreen> = emptyList(),
        cloudConfig: KetoyCloudConfig? = null,
        cacheConfig: KetoyCacheConfig = KetoyCacheConfig.DEFAULT,
        force: Boolean = false
    ) { ... }

    fun isInitialized(): Boolean = isInitialized
    fun isCloudEnabled(): Boolean = _cloudConfig != null
    fun reset() { ... }
}`,
    },
    properties: [
      { name: 'cloudConfig', type: 'KetoyCloudConfig?', default: 'null', description: 'The current cloud configuration, or null if cloud is not configured.' },
    ],
    methods: [
      { name: 'initialize(context?, widgetParsers, actionParsers, screens, cloudConfig?, cacheConfig, force)', returns: 'Unit', description: 'Initialise the Ketoy SDUI engine. Safe to call multiple times — subsequent calls are no-ops unless force is set to true. Sets up core registries, custom widget/action parsers, screens, and optional cloud configuration.' },
      { name: 'isInitialized()', returns: 'Boolean', description: 'Whether the SDK has been initialised.' },
      { name: 'isCloudEnabled()', returns: 'Boolean', description: 'Whether cloud features are configured and available.' },
      { name: 'reset()', returns: 'Unit', description: 'Reset all internal state — useful for testing. Clears all registries, cloud config, and sets isInitialized to false.' },
    ],
    usage: `// Basic usage (local-only)
Ketoy.initialize()

// Cloud-enabled SDUI
Ketoy.initialize(
    context = applicationContext,
    cloudConfig = KetoyCloudConfig(
        apiKey = "your-api-key",
        packageName = "com.example.myapp",
        baseUrl = "https://api.ketoy.dev"
    ),
    cacheConfig = KetoyCacheConfig(
        strategy = KetoyCacheStrategy.NETWORK_FIRST,
        maxAge = 30.days,
    )
)

// Advanced usage (with custom parsers and screens)
Ketoy.initialize(
    context = applicationContext,
    widgetParsers = listOf(MyBadgeParser(), MyRatingParser()),
    actionParsers = listOf(ShowToastParser()),
    screens = listOf(
        KetoyScreen.fromJson("home", homeJson),
        KetoyScreen.fromNode("profile") { buildProfileUI() }
    ),
    cloudConfig = KetoyCloudConfig(
        apiKey = "your-api-key",
        packageName = "com.example.myapp"
    )
)

// Check state
val ready = Ketoy.isInitialized()
val cloudEnabled = Ketoy.isCloudEnabled()

// Reset for testing
Ketoy.reset()`,
    notes: 'initialize() performs the following in order: 1. Initializes KComponentRegistry. 2. Clears ActionRegistry, KetoyVariableRegistry, KetoyFunctionRegistry. 3. Registers custom widget parsers (KetoyWidgetRegistry). 4. Registers custom action parsers (KetoyActionRegistry). 5. Registers built-in parsers (NavigateActionParser, CallFunctionActionParser). 6. Registers screens (KetoyScreenRegistry). 7. Configures cloud/cache if cloudConfig is provided. Requires Android Context when cloudConfig is set. Exceptions are caught and printed to stderr; the host app decides crash policy.',
    seeAlso: ['KetoyCloudConfig', 'KetoyCacheConfig', 'KetoyScreen', 'KetoyWidgetParser', 'KetoyActionParser', 'KComponentRegistry', 'KetoyScreenRegistry', 'KetoyWidgetRegistry', 'KetoyActionRegistry'],
  },

  KetoyInitializer: {
    name: 'KetoyInitializer',
    kind: 'typealias',
    module: 'ketoy',
    subpackage: 'root',
    category: 'Ketoy',
    subcategory: 'Entry Point',
    description: 'Legacy alias kept for backwards compatibility. Prefer using the Ketoy object directly.',
    android: {
      packageName: 'com.developerstring.ketoy',
      annotations: ['@Deprecated("Use Ketoy object directly", ReplaceWith("Ketoy"))'],
      imports: [],
      sourceCode: `@Deprecated("Use Ketoy object directly", ReplaceWith("Ketoy"))
typealias KetoyInitializer = Ketoy`,
    },
    properties: [],
    usage: `// Deprecated — use Ketoy directly instead
// KetoyInitializer.initialize() → Ketoy.initialize()`,
    notes: 'Deprecated. Use the Ketoy object directly.',
    seeAlso: ['Ketoy'],
  },
}

export default ketoyData
