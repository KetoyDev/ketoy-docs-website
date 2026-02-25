/**
 * Ketoy Documentation – Testing Locally
 * Covers: ExportScreensTest, KetoyDevExporter, KetoyDevWrapper,
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
| **ketoy-devtools** | Android library | Client-side: \`KetoyDevWrapper\`, \`KetoyDevClient\`, connection UI |
| **ketoy-devtools-server** | JVM application | Server-side: HTTP + WebSocket server, file watching |
| **ketoy-sdk** | Android library | Core SDK with \`KetoyScreen\`, JSON renderer, DSL |

### Gradle tasks at a glance

| Task | Command | What it does |
|---|---|---|
| \`ketoyExport\` | \`./gradlew ketoyExport\` | Run \`ExportScreensTest\` → write JSON to \`ketoy-screens/\` |
| \`ketoyServe\` | \`./gradlew ketoyServe\` | Start the dev server (watches \`ketoy-screens/\` for JSON changes) |
| \`ketoyDev\` | \`./gradlew ketoyDev\` | Start dev server **with** auto-export (recommended — single command) |`,
    },

    // ── Step 1: Write the Export Test ──
    {
      id: 'export-test',
      title: 'Step 1 — Write the Export Test',
      content: `Create a unit test class that declares every screen and its DSL builder. This test is triggered by \`./gradlew ketoyExport\` and writes \`.json\` files to \`ketoy-screens/\`.

Place the file at \`app/src/test/java/.../ExportScreensTest.kt\`:`,
      code: `class ExportScreensTest {

    private val outputDir = File(System.getProperty("user.dir") ?: ".")
        .resolve("../ketoy-screens")

    // ── Screen definitions ──────────────────────────────────

    private val screens = listOf(
        // Multi-content screen (multiple KetoyContent blocks)
        KetoyScreen(screenName = "home", displayName = "Home").apply {
            addContent(name = "cards", nodeBuilder = {
                buildHomeCards(
                    userName = "Test User",
                    totalBalance = "\\$12,450.00",
                    income = "\\$4,200.00",
                    notificationCount = 3,
                    isDark = true
                )
            })
            addContent(name = "transactions", nodeBuilder = {
                buildHomeTransactions(
                    transactions = listOf(
                        Triple("Salary", "Today", "+\\$4,200.00"),
                        Triple("Groceries", "Yesterday", "-\\$85.50"),
                    ),
                    isDark = true
                )
            })
        },

        // Single-content screens (shorthand)
        KetoyScreen.fromNode("profile", displayName = "Profile") {
            buildProfileScreen(userName = "Test User", isDark = true)
        },
        KetoyScreen.fromNode("analytics", displayName = "Analytics") {
            buildAnalyticsScreen(
                income = "\\$4,200.00",
                expenses = "\\$2,150.00",
                savings = "\\$2,050.00",
                isDark = true
            )
        },
    )

    // ── Export ───────────────────────────────────────────────

    @Test
    fun exportAllScreens() {
        outputDir.mkdirs()

        // Export screens
        var exported = 0
        screens.forEach { screen ->
            val json = screen.buildExportJson()
            if (json != null) {
                val file = File(outputDir, "\${screen.screenName}.json")
                file.writeText(json)
                println("📄 Exported: \${screen.screenName} → \${file.absolutePath}")
                exported++
            }
        }

        // Register and export navigation graphs
        AppNavGraphs.registerAll()
        val allNavGraphs = KetoyNavRegistry.getAll().values

        var navExported = 0
        allNavGraphs.forEach { graph ->
            val json = graph.toJson()
            val file = File(outputDir, "nav_\${graph.navHostName}.json")
            file.writeText(json)
            println("🗺️  Nav exported: \${graph.navHostName}")
            navExported++
        }

        println("✅ Exported \$exported screen(s) + \$navExported nav graph(s)")
    }
}`,
      language: 'kotlin',
      subsections: [
        {
          id: 'export-test-multi-content',
          title: 'Multi-Content Screens',
          content: `For screens that use multiple \`KetoyContent\` blocks (e.g. Home with a "cards" section and a "transactions" section), create the \`KetoyScreen\` manually and call \`addContent()\` for each block:`,
          code: `KetoyScreen(screenName = "home", displayName = "Home").apply {
    addContent(name = "cards", nodeBuilder = {
        buildHomeCards(userName = "Test User", ...)
    })
    addContent(name = "transactions", nodeBuilder = {
        buildHomeTransactions(transactions = testData, ...)
    })
}`,
          language: 'kotlin',
        },
        {
          id: 'export-test-single-content',
          title: 'Single-Content Screens',
          content: `For screens with a single \`KetoyContent\` (the default "main" block), use the \`KetoyScreen.fromNode\` shorthand:`,
          code: `KetoyScreen.fromNode("profile", displayName = "Profile") {
    buildProfileScreen(userName = "Test User", isDark = true)
}`,
          language: 'kotlin',
        },
        {
          id: 'export-test-nav-graphs',
          title: 'Exporting Navigation Graphs',
          content: `Register your nav graphs with \`KetoyNavRegistry\`, then iterate and export each one as \`nav_{navHostName}.json\`:`,
          code: `AppNavGraphs.registerAll()
val allNavGraphs = KetoyNavRegistry.getAll().values

allNavGraphs.forEach { graph ->
    val json = graph.toJson()
    val file = File(outputDir, "nav_\${graph.navHostName}.json")
    file.writeText(json)
}`,
          language: 'kotlin',
        },
      ],
    },

    // ── Step 2: KetoyDevExporter (alternative) ──
    {
      id: 'dev-exporter',
      title: 'Step 2 (Alternative) — KetoyDevExporter',
      content: `If you prefer a DSL-based approach instead of raw \`KetoyScreen\` objects, subclass \`KetoyDevExporter\` and register screens with trailing-lambda DSL builders:`,
      code: `class MyScreenExporter : KetoyDevExporter() {

    override fun registerScreens() {
        screen("home") {
            KColumn(modifier = KMod(fillMaxSize = true)) {
                KText(text = "Hello World!")
                KText(text = "Balance: \\$12,450", fontSize = 24)
            }
        }
        screen("profile") {
            KColumn {
                KText(text = "Profile Screen")
                KText(text = "User: Test User")
            }
        }
    }
}

// In a test or Gradle task:
val exporter = MyScreenExporter()

// Option A: Export to directory
exporter.exportTo(File("ketoy-screens"))
// → ketoy-screens/home.json
// → ketoy-screens/profile.json

// Option B: Get JSON map without writing to disk
val jsonMap: Map<String, String> = exporter.export()`,
      language: 'kotlin',
      subsections: [
        {
          id: 'dev-exporter-api',
          title: 'KetoyDevExporter API',
          table: {
            headers: ['Method', 'Returns', 'Description'],
            rows: [
              ['registerScreens()', 'Unit', 'Override this — call screen() for each screen you want to export.'],
              ['screen(name, builder)', 'Unit', 'Register a screen with a KUniversalScope DSL builder.'],
              ['buildAll()', 'Map<String, String>', 'Execute all builders and serialize to JSON.'],
              ['exportTo(directory)', 'Unit', 'Build all screens and write individual .json files to the directory.'],
              ['export()', 'Map<String, String>', 'Alias for buildAll() — returns JSON without writing to disk.'],
            ],
          },
        },
      ],
    },

    // ── Step 3: Run the Export ──
    {
      id: 'run-export',
      title: 'Step 3 — Run the Export',
      content: `Use the \`ketoyExport\` Gradle task to execute your \`ExportScreensTest\` and generate JSON files:`,
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
          content: `\`ketoyExport\` is a convenience task defined in your root \`build.gradle.kts\`. It runs:

\`\`\`kotlin
// build.gradle.kts
tasks.register("ketoyExport") {
    group = "ketoy"
    description = "Export Ketoy DSL screens to JSON files for the dev server"
    dependsOn(":app:testDebugUnitTest")
}
\`\`\`

When triggered, **only** \`ExportScreensTest\` runs (not your other tests):

\`\`\`kotlin
gradle.taskGraph.whenReady {
    if (hasTask(":ketoyExport") || hasTask("ketoyExport")) {
        allTasks.filterIsInstance<Test>()
            .filter { it.path == ":app:testDebugUnitTest" }
            .forEach { task ->
                task.filter {
                    includeTestsMatching("*.ExportScreensTest")
                }
            }
    }
}
\`\`\``,
        },
      ],
    },

    // ── Step 4: Start the Dev Server ──
    {
      id: 'dev-server',
      title: 'Step 4 — Start the Dev Server',
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

    // ── Step 5: Add KetoyDevWrapper to your app ──
    {
      id: 'dev-wrapper',
      title: 'Step 5 — Add KetoyDevWrapper',
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
      content: `Add \`ketoy-devtools\` as a **debug-only** dependency so it's stripped from release builds:`,
      code: `// app/build.gradle.kts
dependencies {
    // Core SDK (always included)
    implementation(project(":ketoy-sdk"))

    // Dev tools (debug builds only)
    debugImplementation(project(":ketoy-devtools"))
}`,
      language: 'kotlin',
      subsections: [
        {
          id: 'conditional-wrapper',
          title: 'Conditional Wrapper in Release',
          content: `Since \`ketoy-devtools\` is only available in debug, wrap it conditionally:`,
          code: `setContent {
    MyTheme {
        // KetoyDevWrapper is only available in debug builds
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

**Keep test data realistic** — The export test uses hardcoded test values (e.g., "Test User", "$12,450"). Make them visually representative so the preview is useful.

**Use isDark = true in exports** — The test export convention is dark theme. The dev server preview renders against a dark background by default.

**Don't commit \`ketoy-screens/\`** — The directory contains generated JSON. Add it to \`.gitignore\`. Regenerate it with \`./gradlew ketoyExport\`.

**Strip devtools from release** — Use \`debugImplementation\` for \`ketoy-devtools\`. Wrap \`KetoyDevWrapper\` in a \`BuildConfig.DEBUG\` check.

**Export after DSL changes** — If not using \`ketoyDev\` (auto-export), remember to run \`./gradlew ketoyExport\` after editing your DSL builders.`,
    },
  ],
  nextDoc: 'production-release',
  prevDoc: 'knavigation',
}

export default testingLocallyDoc
