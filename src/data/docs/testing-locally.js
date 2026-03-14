/**
 * Ketoy Documentation – Testing Locally
 * Covers: ketoyExport DSL, KetoyAutoExportTest, KetoyDevWrapper,
 *         KetoyDevClient, KetoyDevServer, Gradle tasks, live-reload pipeline
 */

const testingLocallyDoc = {
  id: 'testing-locally',
  title: 'Testing Locally',
  description: 'Set up the full local development loop — export your Kotlin DSL screens to JSON, launch the Ketoy Dev Server, connect your app with KetoyDevWrapper, and see changes live on your device or emulator in under a second.',
  icon: 'FaFlask',
  order: 5,
  sections: [
    // ── Overview ──
    {
      id: 'overview',
      title: 'Overview',
      content: `The Ketoy local testing pipeline lets you **edit Kotlin DSL → see the result on your device instantly**, without recompiling the app. The full loop:

\`\`\`
Developer edits .kt DSL
       ↓
SourceWatcher detects the change
       ↓
Runs \`gradlew ketoyExport\` (auto)
       ↓
ketoy-screens/ JSON files are regenerated
       ↓
FileWatcher detects the new JSON
       ↓
KetoyDevServer pushes via WebSocket
       ↓
Android app recomposes the UI instantly
\`\`\`

### Modules involved

| Module | Type | Purpose |
|---|---|---|
| **ketoy-sdk** | Android library | Core SDK with devtools, JSON renderer, DSL, and export system |
| **ketoy-gradle-plugin** | Gradle plugin | Ketoy tasks (\`ketoyExport\`, \`ketoyServe\`, \`ketoyDev\`) |

> **Note:** As of 0.1-beta.1, devtools are integrated directly into \`ketoy-sdk\`. No separate \`ketoy-devtools\` module is required.

### Gradle tasks at a glance

| Task | Command | What it does |
|---|---|---|
| \`ketoyExport\` | \`./gradlew ketoyExport\` | Run \`KetoyAutoExportTest\` → write JSON to \`ketoy-screens/\` |
| \`ketoyExportProd\` | \`./gradlew ketoyExportProd\` | Export for production → write JSON to \`ketoy-export/\` with manifests |
| \`ketoyServe\` | \`./gradlew ketoyServe\` | Start the dev server (watches \`ketoy-screens/\` for JSON changes) |
| \`ketoyDev\` | \`./gradlew ketoyDev\` | Start dev server **with** auto-export (recommended — single command) |`,
    },

    // ── Step 1: Declare Screen Exports (ketoyExport DSL) ──
    {
      id: 'export-dsl',
      title: 'Step 1 — Declare Screen Exports',
      content: `Instead of writing manual test classes, define exports **inline alongside your screen composables** using the \`ketoyExport()\` DSL. This becomes the **single source of truth** for what gets exported.

Place the export definition at the top of your screen file:`,
      code: `// HomeScreen.kt
import com.developerstring.ketoy.export.ketoyExport
import com.developerstring.ketoy.util.KData

/**
 * Export definition for Home screen — single source of truth.
 * Uses KData template variables for dynamic values.
 */
val homeExport = ketoyExport("home", displayName = "Home") {
    content("cards") {
        buildHomeCards(
            userName = KData.user("name"),
            totalBalance = KData.user("totalBalance"),
            income = KData.user("income"),
            notificationCount = KData.user("notificationCount"),
        )
    }
    content("transactions") {
        buildHomeTransactions()
    }
}

// The screen composable (unchanged)
@Composable
fun HomeScreen(userName: String, totalBalance: String, /* ... */) {
    ProvideKetoyScreen(screenName = "home") {
        // ... your UI code
        KetoyContent(name = "cards", data = mapOf("name" to userName, /* ... */)) {
            // fallback UI
        }
    }
}`,
      language: 'kotlin',
      subsections: [
        {
          id: 'single-content-export',
          title: 'Single-Content Screens',
          content: `For screens with a single content block, use the shorthand:`,
          code: `val profileExport = ketoyExport("profile") {
    content {
        buildProfileScreen(
            userName = KData.user("name"),
            darkModeIcon = KData.user("darkModeIcon"),
        )
    }
}`,
          language: 'kotlin',
        },
        {
          id: 'multi-content-export',
          title: 'Multi-Content Screens',
          content: `For screens with multiple \`KetoyContent\` blocks, declare each with a name:`,
          code: `val homeExport = ketoyExport("home", displayName = "Home") {
    content("cards") {
        buildHomeCards(userName = KData.user("name"))
    }
    content("transactions") {
        buildHomeTransactions()
    }
}`,
          language: 'kotlin',
        },
        {
          id: 'nav-export',
          title: 'Exporting Navigation Graphs',
          content: `Register nav graphs for export using \`ketoyNavExport()\`:`,
          code: `// In AppNavGraphs.kt or a dedicated exports file
import com.developerstring.ketoy.export.ketoyNavExport

val mainNavExport = ketoyNavExport(AppNavGraphs.main)
val demoNavExport = ketoyNavExport(AppNavGraphs.demo)`,
          language: 'kotlin',
        },
        {
          id: 'kdata-templates',
          title: 'KData Template Variables',
          content: `Use \`KData\` to insert template placeholders that resolve at runtime:

| Method | Template Output | Description |
|---|---|---|
| \`KData.user("key")\` | \`{{data:user:key}}\` | User-provided data from \`KetoyContent(data = ...)\` |
| \`KData.ref("refId")\` | \`{{data:ref:refId}}\` | Reference to shared/global data |

At runtime, the SDK replaces these placeholders with actual values from the \`data\` map.`,
        },
      ],
    },

    // ── Step 2: Create AppExports Manifest ──
    {
      id: 'app-exports',
      title: 'Step 2 — Create AppExports Manifest',
      content: `Create an \`AppExports\` object that references all your export definitions. This triggers class-loading so the export runner can discover them:`,
      code: `// AppExports.kt
package com.yourapp

import com.yourapp.screens.*

/**
 * Export manifest — triggers class-loading for all screen and nav exports.
 */
object AppExports {
    init {
        // ── Screen exports ───────────────────────────────
        homeExport
        profileExport
        analyticsExport
        cardsExport
        historyExport

        // ── Nav graph exports ────────────────────────────
        mainNavExport
        demoNavExport
    }

    /** Call this to ensure all exports are registered. */
    fun ensureLoaded() { /* init block does the work */ }
}`,
      language: 'kotlin',
      subsections: [
        {
          id: 'adding-new-screen',
          title: 'Adding a New Screen',
          content: `To add a new screen to the export:

1. Add \`ketoyExport(...)\` at the top of your screen file
2. Reference the export val in \`AppExports.init {}\`

That's it — no separate test files, no manual builders, no duplication.`,
        },
      ],
    },

    // ── Step 3: Create the Export Test ──
    {
      id: 'export-test',
      title: 'Step 3 — Create KetoyAutoExportTest',
      content: `Create a single test class that runs all exports. This replaces the old manual \`ExportScreensTest\` and \`ProductionExportTest\`:`,
      code: `// app/src/test/java/.../KetoyAutoExportTest.kt
class KetoyAutoExportTest {

    private val runner = KetoyAutoExportRunner()

    @Before
    fun setUp() {
        // Ensure all exports are registered via class-loading
        AppExports.ensureLoaded()
    }

    @Test
    fun exportForDevServer() {
        val outputDir = File(System.getProperty("user.dir") ?: ".").resolve("../ketoy-screens")
        val result = runner.exportAll(
            outputDir = outputDir,
            writeManifests = false  // dev server doesn't need manifests
        )
        println(result)
    }

    @Test
    fun exportForProduction() {
        val outputDir = File(System.getProperty("user.dir") ?: ".").resolve("../ketoy-export")
        val result = runner.exportAll(
            outputDir = outputDir,
            writeManifests = true  // production needs manifests
        )
        println(result)
    }
}`,
      language: 'kotlin',
      subsections: [
        {
          id: 'how-auto-export-works',
          title: 'How It Works',
          content: `\`KetoyAutoExportRunner\` reads all registered exports from \`KetoyExportRegistry\`:

1. **Screen files** register via \`ketoyExport(...)\` — self-registering on class-load
2. **Nav graphs** register via \`ketoyNavExport(...)\`
3. **AppExports** references all export vals to trigger class-loading
4. **The runner** iterates the registry and writes JSON files

No manual screen listings, no builder duplication, no keeping test code in sync with screen code.`,
        },
      ],
    },

    // ── Step 4: Run the Export ──
    {
      id: 'run-export',
      title: 'Step 4 — Run the Export',
      content: `Use the \`ketoyExport\` Gradle task to run \`KetoyAutoExportTest\` and generate JSON files:`,
      code: `./gradlew ketoyExport`,
      language: 'bash',
      subsections: [
        {
          id: 'export-output',
          title: 'Output Structure',
          content: `The exported files land in \`ketoy-screens/\` at the project root:

\`\`\`
ketoy-screens/
├── home.json               # Screen JSONs (one per screen)
├── profile.json
├── analytics.json
├── cards.json
├── history_screen.json
├── nav_main.json            # Navigation graph JSONs
└── nav_demo.json
\`\`\`

The dev server watches this directory. Any file change triggers a push to connected clients.`,
        },
        {
          id: 'export-how-works',
          title: 'How the Gradle Task Works',
          content: `\`ketoyExport\` is registered by the \`dev.ketoy.devtools\` Gradle plugin:

\`\`\`kotlin
// The plugin registers these tasks automatically
tasks {
    register("ketoyExport") {
        group = "ketoy"
        description = "Export screens for dev server"
        // Runs KetoyAutoExportTest.exportForDevServer()
    }
    register("ketoyExportProd") {
        group = "ketoy"
        description = "Export screens for production"
        // Runs KetoyAutoExportTest.exportForProduction()
    }
}
\`\`\`

Both tasks run \`KetoyAutoExportTest\` — the difference is just the output directory and whether manifests are generated.`,
        },
      ],
    },

    // ── Step 5: Add KetoyDevWrapper to your app ──
    {
      id: 'dev-server',
      title: 'Step 5 — Start the Dev Server',
      content: `The Ketoy Dev Server is a JVM application that serves screen JSON over HTTP and pushes live updates via WebSocket. Two ways to start it:`,
      code: `# Option A: JSON-only watching (manually run ketoyExport when DSL changes)
./gradlew ketoyServe

# Option B: Full live-reload (RECOMMENDED — single command)
# Watches Kotlin source files, auto-exports JSON, pushes to app
./gradlew ketoyDev`,
      language: 'bash',
      subsections: [
        {
          id: 'server-output',
          title: 'Terminal Output',
          code: `┌─────────────────────────────────────────────────┐
│          🚀 Ketoy Dev Server v1.1.0             │
│       Hot-reload for Ketoy UI Framework         │
└─────────────────────────────────────────────────┘

📡 Server running at:
   Local:     http://localhost:8484
   Network:   http://192.168.1.5:8484
   Emulator:  http://10.0.2.2:8484

📱 Enter this URL in your app's Ketoy Dev connection screen:
   Physical device → 192.168.1.5
   Android Emulator → 10.0.2.2

👀 Watching: /path/to/project/ketoy-screens
   Available screens:
   • home
   • profile
   • analytics

   Navigation graphs:
   🗺️  main
   🗺️  demo`,
          language: 'text',
        },
        {
          id: 'server-config',
          title: 'Server Configuration',
          table: {
            headers: ['Flag', 'Short', 'Default', 'Description'],
            rows: [
              ['--port', '-p', '8484', 'HTTP server port. WebSocket runs on port + 1 (8485).'],
              ['--watch', '-w', './ketoy-screens', 'Directory to watch for JSON files.'],
              ['--auto-export', '-a', 'false', 'Watch Kotlin sources and auto-rebuild JSON on change.'],
              ['--project', '—', '.', 'Gradle project root (for locating gradlew).'],
              ['--source', '-s', 'app/src/main/java', 'Source dir to watch (repeatable).'],
              ['--debounce', '—', '1500', 'Milliseconds to wait after last source change before exporting.'],
            ],
          },
        },
        {
          id: 'server-endpoints',
          title: 'HTTP Endpoints',
          table: {
            headers: ['Endpoint', 'Description'],
            rows: [
              ['GET /', 'HTML dashboard with status, screens, and API docs.'],
              ['GET /status', 'JSON health check (version, screen count, connected clients).'],
              ['GET /screens', 'List available screen names.'],
              ['GET /screen?name=X', 'Fetch a single screen\'s JSON.'],
              ['GET /navs', 'List available navigation graph names.'],
              ['GET /nav?name=X', 'Fetch a single nav graph\'s JSON.'],
              ['GET /bundle', 'Full payload — all screens + all nav graphs.'],
              ['GET /poll?v=N', 'Long-poll — returns immediately if server version > N, else waits 30s.'],
              ['WS :port+1', 'WebSocket for real-time push updates.'],
            ],
          },
        },
      ],
    },

    // ── Step 6: Add KetoyDevWrapper ──
    {
      id: 'dev-wrapper',
      title: 'Step 6 — Add KetoyDevWrapper',
      content: `\`KetoyDevWrapper\` wraps your **entire app** to enable hot-reload. Your app runs normally — behind the scenes the wrapper connects to the dev server, receives JSON updates, and injects them into the matching \`KetoyScreen\` instances.`,
      code: `class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        Ketoy.initialize(context = applicationContext)
        AppNavGraphs.registerAll()

        setContent {
            MyTheme {
                KetoyDevWrapper {
                    MainApp()   // ← always rendered, never blocked
                }
            }
        }
    }
}`,
      language: 'kotlin',
      subsections: [
        {
          id: 'dev-wrapper-auto-connect',
          title: 'Auto-Connect to a Known Server',
          content: `Skip the connection screen by providing a \`KetoyDevConfig\`:`,
          code: `KetoyDevWrapper(
    config = KetoyDevConfig(
        host = "192.168.1.5",    // or "10.0.2.2" for emulator
        port = 8484,
        autoConnect = true
    )
) {
    MainApp()
}`,
          language: 'kotlin',
        },
        {
          id: 'dev-wrapper-how-works',
          title: 'How It Works',
          content: `When the wrapper connects to the dev server:

1. **KetoyDevClient** opens a WebSocket to \`port + 1\` (falls back to HTTP polling if WebSocket is unavailable).
2. The server sends an initial **bundle** with all screen + nav graph JSON payloads.
3. For each incoming screen JSON, the wrapper matches the screen name against \`KetoyScreenRegistry\` and calls \`setScreenDevOverride(json)\` — injecting the new JSON.
4. For each incoming nav graph JSON (\`nav_*.json\`), the wrapper parses it into a \`KetoyNavGraph\` and sets it in \`KetoyNavDevOverrides\`.
5. The matching \`KetoyContent\` blocks **recompose instantly** with the new JSON.
6. On disconnect, all dev-overrides are cleared — the app restores to its normal state.`,
        },
      ],
    },

    // ── KetoyDevConfig ──
    {
      id: 'dev-config',
      title: 'KetoyDevConfig',
      content: `Configuration for the dev tools connection:`,
      code: `data class KetoyDevConfig(
    val host: String = "",
    val port: Int = 8484,
    val autoConnect: Boolean = false,
    val showOverlay: Boolean = true,
    val shakeToDisconnect: Boolean = true,
)`,
      language: 'kotlin',
      subsections: [
        {
          id: 'dev-config-params',
          title: 'Properties',
          table: {
            headers: ['Property', 'Type', 'Default', 'Description'],
            rows: [
              ['host', 'String', '""', 'Dev server hostname or IP. Empty = show the manual connection screen.'],
              ['port', 'Int', '8484', 'HTTP port. WebSocket is always port + 1.'],
              ['autoConnect', 'Boolean', 'false', 'When true and host is set, connects immediately (skips connection screen).'],
              ['showOverlay', 'Boolean', 'true', 'Show the floating status pill overlay on top of the app.'],
              ['shakeToDisconnect', 'Boolean', 'true', 'Shake the device to disconnect (physical device testing).'],
            ],
          },
        },
      ],
    },

    // ── KetoyDevClient ──
    {
      id: 'dev-client',
      title: 'KetoyDevClient',
      content: `The networking heart of the devtools module. Manages the WebSocket / HTTP connection to the dev server. All state is exposed as Compose snapshot state for reactive UI updates:`,
      code: `val client = KetoyDevClient()
client.connect("192.168.1.5", port = 8484)

// Observe in Compose:
val screens: Map<String, String> = client.screens         // screen name → JSON
val navGraphs: Map<String, String> = client.navGraphs     // nav host → JSON
val state by client.connectionState                        // ConnectionState`,
      language: 'kotlin',
      subsections: [
        {
          id: 'dev-client-state',
          title: 'ConnectionState',
          code: `sealed class ConnectionState {
    data object Disconnected : ConnectionState()
    data object Connecting : ConnectionState()
    data class Reconnecting(val attempt: Int) : ConnectionState()
    data class Error(val message: String) : ConnectionState()
    data object Connected : ConnectionState()
}`,
          language: 'kotlin',
        },
        {
          id: 'dev-client-api',
          title: 'API',
          table: {
            headers: ['Method / Property', 'Type', 'Description'],
            rows: [
              ['connect(host, port)', 'Unit', 'Connect to a dev server. Verifies via HTTP /status, then opens WebSocket.'],
              ['connect(url)', 'Unit', 'Connect with a raw URL string (e.g. "192.168.1.5:8484").'],
              ['disconnect()', 'Unit', 'Gracefully close the connection. Screen maps are NOT cleared.'],
              ['destroy()', 'Unit', 'Full teardown — disconnect, cancel scope, shutdown HTTP client. Cannot reuse.'],
              ['isConnected()', 'Boolean', 'Whether the client is currently connected.'],
              ['connectionState', 'State<ConnectionState>', 'Observable connection state.'],
              ['screens', 'SnapshotStateMap<String, String>', 'All screen JSON payloads from the server.'],
              ['navGraphs', 'SnapshotStateMap<String, String>', 'All nav graph JSON payloads from the server.'],
              ['dataVersion', 'State<Long>', 'Monotonically increasing version counter from the server.'],
              ['activeScreen', 'MutableState<String?>', 'Currently focused screen for preview mode.'],
              ['serverInfo', 'State<ServerInfo?>', 'Server metadata (version, screen count, client count).'],
            ],
          },
        },
        {
          id: 'dev-client-protocol',
          title: 'WebSocket Protocol',
          table: {
            headers: ['Message Type', 'Direction', 'Description'],
            rows: [
              ['connected', 'Server → Client', 'Initial handshake with current data version.'],
              ['bundle', 'Server → Client', 'Full payload — all screens + nav graphs.'],
              ['update', 'Server → Client', 'Single screen JSON updated.'],
              ['nav_update', 'Server → Client', 'Single navigation graph updated.'],
              ['pong', 'Server → Client', 'Heartbeat acknowledgement.'],
            ],
          },
        },
      ],
    },

    // ── KetoyDevConnectScreen ──
    {
      id: 'connect-screen',
      title: 'KetoyDevConnectScreen',
      content: `The Material 3 themed connection screen shown when \`KetoyDevConfig.autoConnect\` is \`false\` (the default). It handles the entire flow:

- **Server URL input** with automatic emulator detection (pre-fills \`10.0.2.2\` on AVD)
- **Connect button** that initiates \`KetoyDevClient.connect()\`
- **Skip button** to bypass devtools and load the app directly
- **Advanced section** for overriding the port
- **Error display** driven by \`KetoyDevClient.connectionState\``,
      code: `// Usually you don't call this directly — KetoyDevWrapper uses it.
// But you can embed it manually if needed:
KetoyDevConnectScreen(
    client = remember { KetoyDevClient() },
    onConnected = { /* navigate to your app */ },
    onSkip = { /* load app without dev tools */ }
)`,
      language: 'kotlin',
    },

    // ── KetoyDevOverlay ──
    {
      id: 'dev-overlay',
      title: 'KetoyDevOverlay',
      content: `A floating overlay composable that shows the live connection status. It renders in two modes:

| Mode | Size | What it shows |
|---|---|---|
| **Collapsed** | 36 dp dot | Color-coded status (green = connected, amber = connecting, red = error, grey = disconnected) |
| **Expanded** | Dark card | Server URL, screen count, data version, and a Disconnect button |

Tap the collapsed dot to expand; tap close to collapse. The overlay is rendered automatically by \`KetoyDevWrapper\` when \`showOverlay = true\`.`,
      code: `// Manual usage (if not using KetoyDevWrapper):
Box {
    MyApp()

    KetoyDevOverlay(
        client = client,
        onDisconnect = { client.disconnect() }
    )
}`,
      language: 'kotlin',
    },

    // ── KetoyDevActivity ──
    {
      id: 'dev-activity',
      title: 'KetoyDevActivity',
      content: `A standalone \`ComponentActivity\` for isolated dev previews — **without modifying your existing app code**. Launch it programmatically or via deep link:`,
      code: `// Programmatic launch — show connection screen:
KetoyDevActivity.launch(context)

// Auto-connect to a known server:
KetoyDevActivity.launch(context, host = "192.168.1.5", port = 8484)`,
      language: 'kotlin',
      subsections: [
        {
          id: 'dev-activity-manifest',
          title: 'Manifest Declaration (debug only)',
          code: `<activity
    android:name="com.developerstring.ketoy.devtools.KetoyDevActivity"
    android:exported="true"
    android:label="Ketoy Dev Preview">
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <data android:scheme="ketoy" android:host="dev" />
    </intent-filter>
</activity>`,
          language: 'xml',
        },
      ],
    },

    // ── KetoyDevPreviewScreen ──
    {
      id: 'dev-preview',
      title: 'KetoyDevPreviewScreen',
      content: `A self-contained composable for quick, standalone previews. Unlike \`KetoyDevWrapper\` (which wraps your full app), this creates its own \`KetoyDevClient\` and renders raw JSON through \`JSONStringToUI\`:`,
      code: `KetoyDevPreviewScreen(
    serverUrl = "192.168.1.5:8484",
    screenName = "home"     // null = show screen picker
)`,
      language: 'kotlin',
    },

    // ── Dev Server Architecture ──
    {
      id: 'server-architecture',
      title: 'Dev Server Architecture',
      content: `The Ketoy Dev Server consists of three cooperating components:

### FileWatcher
Monitors the \`ketoy-screens/\` directory for JSON file changes:
- \`*.json\` (not \`nav_*\`) → screen definition → \`broadcastUpdate()\`
- \`nav_*.json\` → navigation graph → \`broadcastNavUpdate()\`

### SourceWatcher (auto-export only)
Monitors Kotlin source directories for \`.kt\` / \`.kts\` changes:
- Debounces rapid edits (default 1.5s)
- Runs \`gradlew ketoyExport --quiet\` to regenerate JSON
- Re-entrancy protected: only one export runs at a time

### ScreenManager
In-memory cache for all screen + nav graph JSON:
- Thread-safe (\`ConcurrentHashMap\` + \`AtomicLong\` version counter)
- Deduplicates unchanged content (skips broadcast if JSON is identical)
- File conventions: \`home.json\` → screen "home", \`nav_main.json\` → nav "main"

\`\`\`
FileWatcher / SourceWatcher
         │
         └── broadcastUpdate() / broadcastNavUpdate()
                    │
                    ├── WebSocket push to all clients
                    └── Wake long-poll waiters
\`\`\``,
    },

    // ── Dependency Setup ──
    {
      id: 'dependency-setup',
      title: 'Dependency Setup',
      content: `Devtools are integrated directly into \`ketoy-sdk\`. No separate module is required:`,
      code: `// app/build.gradle.kts
dependencies {
    // Core SDK (includes devtools)
    implementation(project(":ketoy-sdk"))
}

// settings.gradle.kts — apply the Gradle plugin
plugins {
    id("dev.ketoy.devtools") version "0.1-beta.1"
}`,
      language: 'kotlin',
      subsections: [
        {
          id: 'conditional-wrapper',
          title: 'Conditional Wrapper in Release',
          content: `\`KetoyDevWrapper\` is always available in the SDK but should only be used in debug builds. Wrap it conditionally:`,
          code: `setContent {
    MyTheme {
        if (BuildConfig.DEBUG) {
            KetoyDevWrapper {
                MainApp()
            }
        } else {
            MainApp()
        }
    }
}`,
          language: 'kotlin',
        },
      ],
    },

    // ── Emulator vs Physical Device ──
    {
      id: 'emulator-vs-device',
      title: 'Emulator vs Physical Device',
      content: `The connection URL differs depending on where the app runs:

| Device Type | Server Address | Why |
|---|---|---|
| **Android Emulator** | \`10.0.2.2:8484\` | Special loopback address that maps to the host machine's localhost |
| **Physical device** | \`<your-ip>:8484\` | Both device and machine must be on the same WiFi network |

The \`KetoyDevConnectScreen\` automatically detects emulators and pre-fills \`10.0.2.2\` for you.`,
    },

    // ── Best Practices ──
    {
      id: 'best-practices',
      title: 'Best Practices',
      content: `**Use \`./gradlew ketoyDev\` as your default** — It starts the server, watches your Kotlin sources, and auto-exports JSON. One command for the complete loop.

**Define exports alongside screens** — Place \`ketoyExport(...)\` at the top of each screen file. This keeps the export definition and screen code together as a single source of truth.

**Use \`KData\` template variables** — Instead of hardcoding test values, use \`KData.user("key")\` so exports contain template placeholders that resolve at runtime.

**Keep \`AppExports\` up to date** — When adding a new screen, don't forget to reference its export val in \`AppExports.init {}\`.

**Don't commit \`ketoy-screens/\`** — The directory contains generated JSON. Add it to \`.gitignore\`. Regenerate it with \`./gradlew ketoyExport\`.

**Wrap devtools in DEBUG check** — Use \`KetoyDevWrapper\` only in debug builds. It's available in the SDK but should be guarded with \`BuildConfig.DEBUG\`.

**Export after DSL changes** — If not using \`ketoyDev\` (auto-export), remember to run \`./gradlew ketoyExport\` after editing your DSL builders.`,
    },
  ],
  nextDoc: 'production-release',
  prevDoc: 'knavigation',
}

export default testingLocallyDoc
