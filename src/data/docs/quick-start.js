/**
 * Ketoy Documentation – Quick Start
 * Covers: plugin setup, SDK dependency, Ketoy.initialize(), KetoyDevWrapper,
 *         ProvideKetoyScreen, KetoyContent, ketoyExport DSL, KetoyAutoExportTest,
 *         running ketoyExport and ketoyDev Gradle tasks.
 */

const quickStartDoc = {
  id: 'quick-start',
  title: 'Quick Start',
  description: 'Get a working Ketoy screen running in under 10 minutes - plugin setup, SDK initialization, building your first SDUI screen, exporting it to JSON, and launching the live dev server.',
  icon: 'FaBolt',
  order: 0,
  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content: `This guide walks you through the complete Ketoy setup from scratch - no prior SDUI experience needed. By the end you will have:

- The Ketoy SDK and Gradle plugin wired into your project
- \`Ketoy.initialize()\` called at app startup
- A screen built using the Kotlin DSL
- That screen exported to JSON for the dev server
- Live hot-reload running on your device or emulator

**What you need:** Android Studio, an existing Android project, Kotlin DSL build files (\`build.gradle.kts\`).`,
    },
    {
      id: 'gradle-setup',
      title: 'Step 1 - Add the Plugin & SDK',
      content: `Ketoy ships two artifacts: the **SDK** (runtime rendering engine, added as a dependency to your app module) and the **Gradle plugin** (dev server, export tasks - applied to the project).

Add the plugin to your **\`settings.gradle.kts\`** so Gradle can resolve it, then apply it in your **root \`build.gradle.kts\`**.`,
      code: `// settings.gradle.kts
pluginManagement {
    repositories {
        gradlePluginPortal()
        mavenCentral()
        google()
    }
}`,
      language: 'kotlin',
      codeTitle: 'settings.gradle.kts',
      subsections: [
        {
          id: 'apply-plugin',
          title: 'Apply the plugin in your root build file',
          content: 'Add the plugin block to your **root** `build.gradle.kts`. The plugin registers all `ketoy*` Gradle tasks (`ketoyExport`, `ketoyDev`, `ketoyPush`, etc.).',
          code: `// root build.gradle.kts
plugins {
    id("dev.ketoy.devtools") version "0.1.5-beta.10" apply false
}`,
          language: 'kotlin',
          codeTitle: 'build.gradle.kts (root)',
        },
        {
          id: 'apply-plugin-app',
          title: 'Apply to your app module',
          content: 'Apply the plugin in your **app module** `build.gradle.kts` and add the SDK dependency:',
          code: `// app/build.gradle.kts
plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("org.jetbrains.kotlin.plugin.compose")
    id("dev.ketoy.devtools")                   // Ketoy Gradle plugin
}

dependencies {
    implementation("dev.ketoy:sdk:0.1.3-beta.2")
}`,
          language: 'kotlin',
          codeTitle: 'app/build.gradle.kts',
        },
        {
          id: 'plugin-config',
          title: 'Configure the plugin (optional)',
          content: 'The `ketoy {}` block configures the dev server port and export directories. Defaults work out of the box - only configure if you need different ports or directories, or to enable cloud push tasks.',
          code: `// app/build.gradle.kts
ketoy {
    serverPort = 8484                    // Local dev server port optional
    exportDir = "ketoy-export"           // Production export dir (default: ketoy-export)

    // Required only for cloud push tasks (ketoyPush, ketoyPushAll, etc.)
    // Get your API key from: https://console.ketoy.dev
    // apiKey = "your-api-key"
    // packageName = "com.example.app"
    // baseUrl = "https://api.ketoy.dev"
}`,
          language: 'kotlin',
          codeTitle: 'app/build.gradle.kts',
        },
      ],
    },
    {
      id: 'initialize',
      title: 'Step 2 - Initialize Ketoy',
      content: `Call \`Ketoy.initialize()\` once at app startup, before any server-driven UI is rendered. The simplest form takes no arguments at all - all parameters are optional.

\`context\` is only required when **cloud features** are enabled. For local-only development (the default when starting out), you can omit it entirely or just pass \`applicationContext\` for safety.

> **Cloud credentials** are obtained from [console.ketoy.dev](https://console.ketoy.dev). Skip \`cloudConfig\` entirely while getting started locally - you can add it later when you're ready to push screens to the cloud.`,
      code: `// MainActivity.kt  (or your Application class)
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Minimum initialization - local rendering only
        Ketoy.initialize(
            context = applicationContext,
        )

        setContent {
            YourAppTheme {
                // your composable tree here (see Step 3)
            }
        }
    }
}`,
      language: 'kotlin',
      codeTitle: 'MainActivity.kt',
      subsections: [
        {
          id: 'initialize-cloud',
          title: 'Adding cloud (optional - do this later)',
          content: 'When you\'re ready to push screens to the Ketoy cloud and serve them to production users, add `cloudConfig`. Get your `apiKey` and `packageName` from [console.ketoy.dev](https://console.ketoy.dev).',
          code: `Ketoy.initialize(
    context = applicationContext,
    cloudConfig = KetoyCloudConfig(
        apiKey = "your-api-key",           // From console.ketoy.dev
        packageName = "com.example.myapp", // Your app package name
        baseUrl = "https://api.ketoy.dev"
    )
)`,
          language: 'kotlin',
          codeTitle: 'MainActivity.kt',
        },
      ],
    },
    {
      id: 'dev-wrapper',
      title: 'Step 3 - Wrap with KetoyDevWrapper',
      content: `\`KetoyDevWrapper\` connects your running app to the local Ketoy dev server. When you edit a DSL screen and the JSON is regenerated, the wrapper receives the update over WebSocket and re-renders the affected screen - no recompile needed.

**Place it at the root of your composable tree**, outside everything else. It can wrap your entire navigation graph, ViewModels, theme providers - anything. It's transparent at runtime (a no-op unless a dev server connection is active). **It is recomemded to remove it from production builds**`,
      code: `setContent {
    KetoyTestingTheme {
        KetoyDevWrapper {
            // Your entire app goes here - navigation, ViewModels, screens, everything
            HomeScreen()
        }
    }
}`,
      language: 'kotlin',
      codeTitle: 'MainActivity.kt',
      subsections: [
        {
          id: 'dev-wrapper-nav',
          title: 'With navigation',
          content: '`KetoyDevWrapper` wraps your full nav host just as naturally:',
          code: `setContent {
    YourAppTheme {
        KetoyDevWrapper {
            val navController = rememberNavController()
            NavHost(navController = navController, startDestination = "home") {
                composable("home") { HomeScreen() }
                composable("profile") { ProfileScreen() }
            }
        }
    }
}`,
          language: 'kotlin',
          codeTitle: 'MainActivity.kt',
        },
        {
          id: 'dev-wrapper-note',
          title: 'Network security for local dev (Only if Your app ALREADY has a custom network security config)',
          content: '**No changes needed if you don\'t have a custom network security config.** The Ketoy Dev Server communicates over **HTTP** (not HTTPS) because it runs entirely on your local machine during development. Android 9+ (API 28+) blocks cleartext HTTP by default, so the Ketoy SDK ships a network security config that explicitly permits HTTP to the three dev-server addresses: 10.0.2.2, localhost, and 127.0.0.1. [please see the network config docs for complete info](https://github.com/KetoyDev/ketoy/blob/main/NETWORK_SECURITY.md).',
          code: `<!-- app/src/debug/res/xml/network_security_config.xml -->
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="false">localhost</domain>
        <domain includeSubdomains="false">10.0.2.2</domain>
    </domain-config>
</network-security-config>`,
          language: 'xml',
          codeTitle: 'network_security_config.xml (debug only)',
        },
      ],
    },
    {
      id: 'create-screen',
      title: 'Step 4 - Create a Screen & Content',
      content: `A Ketoy screen has two parts:

1. **\`ProvideKetoyScreen\`** - a composable that declares a named screen context. All child \`KetoyContent\` blocks belong to this screen.
2. **\`KetoyContent\`** - renders one DSL content block. A single screen can have multiple named content blocks interleaved with native Compose code.

The UI itself is built with the **Ketoy Kotlin DSL** - a set of builder functions (\`KColumn\`, \`KText\`, \`KSpacer\`, etc.) that produce a \`KNode\` tree. This tree gets serialized to JSON for the dev server and production export.`,
      code: `@Composable
fun HomeScreen() {
    ProvideKetoyScreen(screenName = "home") {
        KetoyContent(
            name = "homeContent",
            nodeBuilder = {
                buildHomeScreen()
            }
        )
    }
}`,
      language: 'kotlin',
      codeTitle: 'HomeScreen.kt',
      subsections: [
        {
          id: 'dsl-builder',
          title: 'The DSL builder function',
          content: 'The builder function returns a `KNode` tree. Use `ketoyRoot { }` as the entry point, then compose layouts and widgets inside it. `KModifier`, `KArrangements`, `KAlignments`, `KFontWeights`, `KTextAlign`, and `KColors` are all utility objects from the SDK. <br> <br> To add parameter / Arguments please refer to this example: [ProfileScreen.kt](https://github.com/KetoyDev/ketoy/blob/main/app/src/main/java/com/developerstring/ketoy_app/screens/ProfileScreen.kt)',
          code: `fun buildHomeScreen(): KNode = ketoyRoot {
    KColumn(
        modifier = KModifier(fillMaxSize = 1f, padding = KPadding(all = 16)),
        verticalArrangement = KArrangements.Center,
        horizontalAlignment = KAlignments.CenterHorizontally
    ) {
        KText(
            "Welcome to the Ketoy demo!",
            fontSize = 30,
            fontWeight = KFontWeights.Bold,
            textAlign = KTextAlign.Center
        )
        KSpacer(modifier = KModifier(height = 150))
        KText(
            "This is the home screen, built with \\na simple KUniversalScope DSL block.",
            fontWeight = KFontWeights.Medium,
            color = KColors.Gray,
            fontSize = 16,
            textAlign = KTextAlign.Center
        )
    }
}`,
          language: 'kotlin',
          codeTitle: 'HomeScreen.kt',
        },
        {
          id: 'dsl-notes',
          title: 'Key DSL concepts',
          content: '',
          table: {
            headers: ['Concept', 'What it is'],
            rows: [
              ['`ketoyRoot { }`', 'Entry point for a builder function. Returns a `KNode`.'],
              ['`KColumn { }` / `KRow { }` / `KBox { }`', 'Layout containers. Children go inside the trailing lambda.'],
              ['`KText(text, ...)`', 'Renders styled text. Accepts `fontSize`, `fontWeight`, `color`, `textAlign`.'],
              ['`KSpacer(modifier)`', 'Empty space. Use `KModifier(height = N)` or `KModifier(width = N)`.'],
              ['`KModifier(...)`', 'Applies layout and visual properties to any node.'],
              ['`KPadding(all = N)` / `KPadding(top, bottom, start, end)`', 'Padding helper used inside `KModifier`.'],
              ['`KArrangements` / `KAlignments`', 'Enum-like objects for `verticalArrangement` and `horizontalAlignment`.'],
              ['`KColors`', 'Named color constants (Gray, Blue, Red, etc.) and Material 3 tokens.'],
            ],
          },
        },
      ],
    },
    {
      id: 'export-declaration',
      title: 'Step 5 - Declare the Export',
      content: `The \`ketoyExport()\` DSL function declares which screen content blocks should be written to JSON. Place it **in the same file as the screen**, just below the DSL builder. It self-registers with \`KetoyExportRegistry\` on class-load - no manual registration needed.

The \`content(name)\` block inside it must match the \`name\` parameter used in \`KetoyContent\`. The builder lambda calls the same DSL function the composable uses, ensuring export and runtime stay in sync.`,
      code: `val homeExport = ketoyExport("home", displayName = "Home") {
    content("homeContent") {
        buildHomeScreen()
    }
}`,
      language: 'kotlin',
      codeTitle: 'HomeScreen.kt',
      subsections: [
        {
          id: 'app-exports',
          title: 'AppExports - class-loading entry point',
          content: 'The Gradle export task triggers via JUnit, which only class-loads what it can find. Create an `AppExports.kt` file in your app module that references every export `val` - this guarantees all exports are registered before the runner reads them.',
          code: `// app/src/main/java/com/example/myapp/AppExports.kt
object AppExports {

    // Reference every export val here to ensure they are class-loaded
    private val all = listOf(
        homeExport,
        // profileExport,
        // analyticsExport,
    )

    fun ensureLoaded() {
        // Called in @Before to trigger class loading of all export vals
    }
}`,
          language: 'kotlin',
          codeTitle: 'AppExports.kt',
        },
      ],
    },
    {
      id: 'export-test',
      title: 'Step 6 - Create the Export Test',
      content: `Ketoy exports run via JUnit in the **test** source set. The test file is the bridge between the Gradle task and your export declarations - it loads your exports, then calls \`KetoyAutoExportRunner.exportAll()\`.

Create \`KetoyAutoExportTest.kt\` in \`app/src/test/\`. The two test methods handle **dev mode** (no manifests, writes to \`ketoy-screens/\`) and **production** (with manifests, writes to \`ketoy-export/\`).`,
      code: `// app/src/test/java/com/example/myapp/KetoyAutoExportTest.kt
package com.example.myapp

import com.developerstring.ketoy.export.KetoyAutoExportRunner
import org.junit.Before
import org.junit.Test
import java.io.File

class KetoyAutoExportTest {

    private val runner = KetoyAutoExportRunner()

    @Before
    fun setUp() {
        // Triggers class-loading of all registered export vals
        AppExports.ensureLoaded()
    }

    @Test
    fun exportForDevServer() {
        val outputDir = File(System.getProperty("user.dir") ?: ".")
            .resolve("../ketoy-screens")
        val result = runner.exportAll(
            outputDir = outputDir,
            writeManifests = false   // Dev server doesn't need manifests
        )
        println(result)
    }

    @Test
    fun exportForProduction() {
        val outputDir = File(System.getProperty("user.dir") ?: ".")
            .resolve("../ketoy-export")
        val result = runner.exportAll(
            outputDir = outputDir,
            writeManifests = true    // Production needs screen_manifest.json + navigation_manifest.json
        )
        println(result)
    }
}`,
      language: 'kotlin',
      codeTitle: 'KetoyAutoExportTest.kt',
      subsections: [
        {
          id: 'export-test-breakdown',
          title: 'What each method does',
          content: '',
          table: {
            headers: ['Method', 'Output dir', 'writeManifests', 'Purpose'],
            rows: [
              ['`exportForDevServer()`', '`ketoy-screens/`', '`false`', 'Writes screen JSON for the live dev server. Manifests not needed - the server reads JSON files directly.'],
              ['`exportForProduction()`', '`ketoy-export/`', '`true`', 'Writes screen JSON **and** `screen_manifest.json` + `navigation_manifest.json` for production loading via `KetoyProductionNavLoader`.'],
            ],
          },
        },
      ],
    },
    {
      id: 'run-dev',
      title: 'Step 7 - Run & Iterate',
      content: `With everything in place, run the export and start the dev server. Make sure your device or emulator is running the app first.`,
      subsections: [
        {
          id: 'run-export',
          title: 'Export screens to JSON',
          content: 'Run the export task to generate JSON from your DSL screens. This runs the `KetoyAutoExportTest.exportForDevServer()` method under the hood.',
          code: `./gradlew ketoyExport`,
          language: 'bash',
          codeTitle: 'Terminal',
        },
        {
          id: 'run-dev-server',
          title: 'Start the dev server with live reload',
          content: '`ketoyDev` starts the HTTP + WebSocket server **and** watches your Kotlin source files for changes. When you edit a DSL screen, it auto-runs `ketoyExport`, detects the updated JSON (100ms debounce), and broadcasts the new UI to your connected app instantly.',
          code: `./gradlew ketoyDev`,
          language: 'bash',
          codeTitle: 'Terminal',
        },
        {
          id: 'run-prod-export',
          title: 'Export for production',
          content: 'When you\'re ready to ship, run the production export. This generates both the screen JSON files **and** the manifests required by `KetoyProductionNavLoader`.',
          code: `./gradlew ketoyExportProd`,
          language: 'bash',
          codeTitle: 'Terminal',
        },
        {
          id: 'run-summary',
          title: 'Dev loop summary',
          content: '',
          table: {
            headers: ['Task', 'What it does', 'When to use'],
            rows: [
              ['`./gradlew ketoyExport`', 'Runs `exportForDevServer()` → writes to `ketoy-screens/`', 'Once before starting `ketoyDev`, or after adding a new screen'],
              ['`./gradlew ketoyDev`', 'Starts dev server + source watcher → auto-export + hot-reload', 'During active development'],
              ['`./gradlew ketoyExportProd`', 'Runs `exportForProduction()` → writes to `ketoy-export/` with manifests', 'Before committing or releasing'],
              ['`./gradlew ketoyPushAll`', 'Pushes exported screens to Ketoy cloud API', 'When deploying to production (requires API key)'],
            ],
          },
        },
      ],
    },
    {
      id: 'complete-example',
      title: 'Complete Example',
      content: 'The full set of files for a minimal Ketoy quick start - copy, adapt, and run.',
      subsections: [
        {
          id: 'complete-mainactivity',
          title: 'MainActivity.kt',
          code: `class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        Ketoy.initialize(
            context = applicationContext,
        )

        setContent {
            KetoyTestingTheme {
                KetoyDevWrapper {
                    HomeScreen()
                }
            }
        }
    }
}`,
          language: 'kotlin',
          codeTitle: 'MainActivity.kt',
        },
        {
          id: 'complete-homescreen',
          title: 'HomeScreen.kt',
          code: `// Screen composable
@Composable
fun HomeScreen() {
    ProvideKetoyScreen(screenName = "home") {
        KetoyContent(
            name = "homeContent",
            nodeBuilder = { buildHomeScreen() }
        )
    }
}

// DSL builder (same function used at runtime and export time)
fun buildHomeScreen(): KNode = ketoyRoot {
    KColumn(
        modifier = KModifier(fillMaxSize = 1f, padding = KPadding(all = 16)),
        verticalArrangement = KArrangements.Center,
        horizontalAlignment = KAlignments.CenterHorizontally
    ) {
        KText(
            "Welcome to the Ketoy demo!",
            fontSize = 30,
            fontWeight = KFontWeights.Bold,
            textAlign = KTextAlign.Center
        )
        KSpacer(modifier = KModifier(height = 150))
        KText(
            "This is the home screen, built with \\na simple KUniversalScope DSL block.",
            fontWeight = KFontWeights.Medium,
            color = KColors.Gray,
            fontSize = 16,
            textAlign = KTextAlign.Center
        )
    }
}

// Export declaration (co-located with screen)
val homeExport = ketoyExport("home", displayName = "Home") {
    content("homeContent") {
        buildHomeScreen()
    }
}`,
          language: 'kotlin',
          codeTitle: 'HomeScreen.kt',
        },
        {
          id: 'complete-appexports',
          title: 'AppExports.kt',
          code: `object AppExports {
    private val all = listOf(homeExport)
    fun ensureLoaded() { /* triggers class loading */ }
}`,
          language: 'kotlin',
          codeTitle: 'AppExports.kt',
        },
        {
          id: 'complete-test',
          title: 'KetoyAutoExportTest.kt',
          code: `class KetoyAutoExportTest {
    private val runner = KetoyAutoExportRunner()

    @Before
    fun setUp() { AppExports.ensureLoaded() }

    @Test
    fun exportForDevServer() {
        val outputDir = File(System.getProperty("user.dir") ?: ".").resolve("../ketoy-screens")
        println(runner.exportAll(outputDir = outputDir, writeManifests = false))
    }

    @Test
    fun exportForProduction() {
        val outputDir = File(System.getProperty("user.dir") ?: ".").resolve("../ketoy-export")
        println(runner.exportAll(outputDir = outputDir, writeManifests = true))
    }
}`,
          language: 'kotlin',
          codeTitle: 'KetoyAutoExportTest.kt',
        },
      ],
    },
    {
      id: 'next-steps',
      title: 'Next Steps',
      content: `You now have a working Ketoy screen with live hot-reload. From here:

- **Layouts** - explore \`KColumn\`, \`KRow\`, \`KBox\`, \`KLazyColumn\`, and all layout options
- **Initialization** - dive into all \`Ketoy.initialize()\` parameters, custom widget/action parsers
- **Screens** - learn multi-content screens and interleaving DSL with native Compose
- **Navigation** - set up type-safe \`KetoyNavHost\` with server-driven route definitions
- **Production Release** - push screens to the Ketoy cloud for OTA UI updates`,
    },
  ],
  relatedReference: [
    'Ketoy',
    'KetoyDevWrapper',
    'ProvideKetoyScreen',
    'KetoyContent',
    'ketoyExport',
    'KetoyAutoExportRunner',
    'AppExports',
    'KetoyCloudConfig',
  ],
  nextDoc: 'initialization',
  prevDoc: null,
}

export default quickStartDoc
