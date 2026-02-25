/**
 * Ketoy Documentation – Production Release
 * Covers: KetoyProductionExport, ProductionExportTest, manifests,
 *         cloud config, Gradle push/rollback/delete tasks
 */

const productionReleaseDoc = {
  id: 'production-release',
  title: 'Production Release',
  description: 'Export production-ready screen and navigation JSON bundles with KetoyProductionExport, generate manifests, configure cloud credentials, and deploy screens with versioned push, rollback, and lifecycle management via Gradle tasks.',
  icon: 'FaRocket',
  order: 6,
  sections: [
    // ── Overview ──
    {
      id: 'overview',
      title: 'Overview',
      content: `The production pipeline takes your Kotlin DSL screens, serializes them to self-contained JSON bundles, writes index manifests, and optionally pushes them to the Ketoy Cloud API for over-the-air delivery.

### Production vs Dev Export

| | Dev Export | Production Export |
|---|---|---|
| **Class** | \`ExportScreensTest\` / \`KetoyDevExporter\` | \`KetoyProductionExport\` |
| **Output dir** | \`ketoy-screens/\` | \`ketoy-export/\` |
| **Gradle task** | \`ketoyExport\` | \`ketoyExportProd\` |
| **Test data** | Hardcoded values ("Test User") | Template variables (\`{{data:user:name}}\`) |
| **Nav graphs** | Via \`KetoyNavRegistry\` | Built-in \`registerNavGraphs()\` |
| **Manifests** | None | \`navigation_manifest.json\` + \`screen_manifest.json\` |
| **Purpose** | Live-reload during development | Ship to app assets / cloud |

### Gradle tasks at a glance

| Task | Command | Description |
|---|---|---|
| \`ketoyExportProd\` | \`./gradlew ketoyExportProd\` | Export production JSON + manifests to \`ketoy-export/\` |
| \`ketoyPush\` | \`./gradlew ketoyPush -PscreenName=home -Pversion=1.0.0\` | Upload a single screen to the cloud |
| \`ketoyPushAll\` | \`./gradlew ketoyPushAll -Pversion=1.0.0\` | Upload all screens from \`ketoy-screens/\` |
| \`ketoyListScreens\` | \`./gradlew ketoyListScreens\` | List deployed screens |
| \`ketoyScreenVersions\` | \`./gradlew ketoyScreenVersions -PscreenName=home\` | List all versions of a screen |
| \`ketoyRollback\` | \`./gradlew ketoyRollback -PscreenName=home -Pversion=1.0.0\` | Rollback to a specific version |
| \`ketoyDeleteScreen\` | \`./gradlew ketoyDeleteScreen -PscreenName=home\` | Delete all versions of a screen |`,
    },

    // ── Step 1: Subclass KetoyProductionExport ──
    {
      id: 'production-export-class',
      title: 'Step 1 — Subclass KetoyProductionExport',
      content: `Create a concrete subclass that registers every screen and navigation graph you want to ship:`,
      code: `class AppProductionExport : KetoyProductionExport() {

    override fun registerScreens() {
        // Multi-content screen (multiple KetoyContent blocks)
        screen(
            screenName = "home",
            displayName = "Home Screen",
            description = "Main landing screen with cards and transactions",
            version = "1.0.0"
        ) {
            content("cards") {
                buildHomeCards(
                    userName = "{{data:user:name}}",
                    totalBalance = "{{data:user:totalBalance}}",
                    income = "{{data:user:monthlyIncome}}",
                    notificationCount = 3,
                    isDark = false
                )
            }
            content("transactions") {
                buildHomeTransactions(
                    transactions = listOf(
                        Triple("Salary", "Today", "+\\$4,200.00"),
                    ),
                    isDark = false
                )
            }
        }

        // Single-content screen
        screen(
            screenName = "profile",
            displayName = "Profile Screen",
            description = "User profile and settings",
            version = "1.0.0"
        ) {
            content {   // default "main" content block
                buildProfileScreen(
                    userName = "{{data:user:name}}",
                    isDark = false
                )
            }
        }
    }

    override fun registerNavGraphs() {
        navGraph(AppNavGraphs.main)
        navGraph(AppNavGraphs.demo)
    }
}`,
      language: 'kotlin',
      subsections: [
        {
          id: 'screen-builder-api',
          title: 'Screen Registration API',
          table: {
            headers: ['Parameter', 'Type', 'Default', 'Description'],
            rows: [
              ['screenName', 'String', '(required)', 'Unique key for the screen (e.g. "home", "profile").'],
              ['displayName', 'String', 'auto from screenName', 'Human-readable label for manifests and dashboards.'],
              ['description', 'String', '""', 'Optional description included in the manifest.'],
              ['version', 'String', '"1.0.0"', 'Semantic version. Incremented when pushing updates to the cloud.'],
            ],
          },
        },
        {
          id: 'content-builder',
          title: 'Content Builder',
          content: `Inside the \`screen { }\` lambda you get a \`ScreenBuilder\` scope. Call \`content()\` for each \`KetoyContent\` block the screen renders:`,
          code: `screen("home", version = "1.2.0") {
    // Named content block — matches KetoyContent(name = "cards")
    content("cards") {
        buildHomeCards(...)
    }
    // Default "main" content block
    content {
        buildMainContent(...)
    }
}`,
          language: 'kotlin',
        },
        {
          id: 'template-variables',
          title: 'Template Variables',
          content: `Use template variables (\`{{data:...}}\`) instead of hardcoded test data. At runtime, the app resolves these to live values:

\`\`\`kotlin
userName = "{{data:user:name}}"          // → "Jane Doe"
totalBalance = "{{data:user:totalBalance}}"  // → "$12,450.00"
\`\`\`

The double-brace syntax is recognized by the Ketoy renderer. In production JSON, these remain as literal strings and are substituted at render time by your data bindings.`,
        },
      ],
    },

    // ── KetoyProductionExport API ──
    {
      id: 'production-export-api',
      title: 'KetoyProductionExport API',
      content: `Full reference for the abstract class and its output types:`,
      subsections: [
        {
          id: 'base-class-api',
          title: 'Abstract Class',
          table: {
            headers: ['Method', 'Returns', 'Description'],
            rows: [
              ['registerScreens()', 'Unit', 'Override — call screen() for each screen to export.'],
              ['registerNavGraphs()', 'Unit', 'Override — call navGraph() for each navigation graph.'],
              ['screen(name, displayName?, desc?, version?, builder)', 'Unit', 'Register a screen with content builders.'],
              ['navGraph(graph: KetoyNavGraph)', 'Unit', 'Register a navigation graph for export.'],
              ['buildExport()', 'ExportResult', 'Execute all builders, serialize, and return the result bundle.'],
            ],
          },
        },
        {
          id: 'export-result-api',
          title: 'ExportResult',
          table: {
            headers: ['Property / Method', 'Type', 'Description'],
            rows: [
              ['screens', 'List<ScreenExport>', 'All serialized screen exports.'],
              ['navGraphs', 'List<NavGraphExport>', 'All serialized nav graph exports.'],
              ['writeTo(directory, clearExisting?)', 'ExportSummary', 'Write all files to disk. clearExisting = true (default) deletes old files first.'],
              ['buildNavigationManifest()', 'String', 'JSON index of all nav graphs (version, navHosts list, full graphs map).'],
              ['buildScreenManifest(allScreenDefs)', 'String', 'JSON index of all screens (version, screen metadata array with names, versions, filenames).'],
            ],
          },
        },
        {
          id: 'screen-export-type',
          title: 'ScreenExport & NavGraphExport',
          code: `// Individual screen export
data class ScreenExport(
    val screenName: String,
    val fileName: String,      // "home.json"
    val json: String           // Full serialized JSON
)

// Individual nav graph export
data class NavGraphExport(
    val navHostName: String,
    val fileName: String,      // "nav_main.json"
    val json: String,
    val destinationCount: Int,
    val navigationCount: Int
)

// Summary returned by writeTo()
data class ExportSummary(
    val screenCount: Int,
    val navGraphCount: Int,
    val totalBytes: Long,
    val outputDirectory: File
)`,
          language: 'kotlin',
        },
      ],
    },

    // ── Step 2: Write the Production Test ──
    {
      id: 'production-test',
      title: 'Step 2 — Write the Production Test',
      content: `Create a JUnit test that runs the export and writes files + manifests to \`ketoy-export/\`:`,
      code: `class ProductionExportTest {

    @Test
    fun exportProduction() {
        // 1. Build the export
        val export = AppProductionExport()
        val result = export.buildExport()

        // 2. Write all screen + nav JSON files to disk
        val outputDir = File(System.getProperty("user.dir") ?: ".")
            .resolve("../ketoy-export")
        outputDir.mkdirs()

        val summary = result.writeTo(outputDir)
        println("✅ Exported \${summary.screenCount} screen(s) " +
            "+ \${summary.navGraphCount} nav graph(s) " +
            "(\${summary.totalBytes} bytes)")

        // 3. Write navigation_manifest.json
        val navManifest = result.buildNavigationManifest()
        File(outputDir, "navigation_manifest.json").writeText(navManifest)
        println("📋 Navigation manifest written")

        // 4. Write screen_manifest.json
        val screenDefs = export.getAllScreenDefinitions()
        val screenManifest = result.buildScreenManifest(screenDefs)
        File(outputDir, "screen_manifest.json").writeText(screenManifest)
        println("📋 Screen manifest written")
    }
}`,
      language: 'kotlin',
    },

    // ── Step 3: Run the Export ──
    {
      id: 'run-prod-export',
      title: 'Step 3 — Run the Production Export',
      content: `Use the \`ketoyExportProd\` Gradle task to run \`ProductionExportTest\`:`,
      code: `./gradlew ketoyExportProd`,
      language: 'bash',
      subsections: [
        {
          id: 'prod-output',
          title: 'Output Structure',
          content: `The exported files land in \`ketoy-export/\` at the project root:

\`\`\`
ketoy-export/
├── home.json                    # Screen JSONs
├── profile.json
├── analytics.json
├── cards.json
├── history_screen.json
├── nav_main.json                # Navigation graph JSONs
├── nav_demo.json
├── navigation_manifest.json     # Nav graph index
└── screen_manifest.json         # Screen index with metadata
\`\`\``,
        },
        {
          id: 'nav-manifest',
          title: 'navigation_manifest.json',
          content: `A combined index of all navigation graphs:`,
          code: `{
    "version": "1.0.0",
    "navHosts": ["main", "demo"],
    "graphs": {
        "main": { /* full KetoyNavGraph JSON */ },
        "demo": { /* full KetoyNavGraph JSON */ }
    }
}`,
          language: 'json',
        },
        {
          id: 'screen-manifest',
          title: 'screen_manifest.json',
          content: `An index of all screens with metadata for discovery and loading:`,
          code: `{
    "version": "1.0.0",
    "screens": [
        {
            "screenName": "home",
            "displayName": "Home Screen",
            "version": "1.0.0",
            "fileName": "home.json",
            "contents": ["cards", "transactions"]
        },
        {
            "screenName": "profile",
            "displayName": "Profile Screen",
            "version": "1.0.0",
            "fileName": "profile.json",
            "contents": ["main"]
        }
    ]
}`,
          language: 'json',
        },
      ],
    },

    // ── Cloud Configuration ──
    {
      id: 'cloud-config',
      title: 'Cloud Configuration',
      content: `Before using the cloud push/pull tasks, configure your credentials in \`local.properties\` (not committed to git):`,
      code: `# local.properties

KETOY_DEVELOPER_API_KEY=your-api-key-here
KETOY_BASE_URL=https://api.ketoy.dev
KETOY_PACKAGE_NAME=com.example.myapp`,
      language: 'properties',
      subsections: [
        {
          id: 'cloud-config-params',
          title: 'Configuration Properties',
          table: {
            headers: ['Property', 'Required', 'Default', 'Description'],
            rows: [
              ['KETOY_DEVELOPER_API_KEY', 'Yes', '—', 'Your developer API key for authentication. Sent as x-developer-api-key header.'],
              ['KETOY_BASE_URL', 'No', 'http://localhost:3000', 'Base URL of the Ketoy Cloud API.'],
              ['KETOY_PACKAGE_NAME', 'Yes', '—', 'Your app\'s unique package identifier for namespacing screens.'],
            ],
          },
        },
        {
          id: 'cloud-config-security',
          title: 'Security',
          content: `\`local.properties\` is automatically excluded from version control by the default Android \`.gitignore\`. **Never commit your API key.** Each team member should configure their own \`local.properties\` locally.`,
        },
      ],
    },

    // ── Push to Cloud ──
    {
      id: 'push-screens',
      title: 'Push Screens to Cloud',
      content: `Upload screen JSON to the Ketoy Cloud API for over-the-air delivery.`,
      subsections: [
        {
          id: 'push-single',
          title: 'Push a Single Screen',
          content: `Upload one screen with a specific version:`,
          code: `./gradlew ketoyPush \\
    -PscreenName=home \\
    -Pversion=1.0.0`,
          language: 'bash',
        },
        {
          id: 'push-optional-params',
          title: 'Optional Parameters',
          code: `./gradlew ketoyPush \\
    -PscreenName=home \\
    -Pversion=1.2.0 \\
    -PdisplayName="Home Screen" \\
    -Pdescription="Main landing screen with cards and transactions" \\
    -Pcategory=main \\
    -Ptags=home,landing,featured`,
          language: 'bash',
        },
        {
          id: 'push-single-params',
          title: 'ketoyPush Parameters',
          table: {
            headers: ['Parameter', 'Required', 'Description'],
            rows: [
              ['-PscreenName', 'Yes', 'Name of the screen to push (must match a .json file in ketoy-screens/).'],
              ['-Pversion', 'Yes', 'Semantic version string for this upload (e.g. "1.0.0", "1.2.0-beta").'],
              ['-PdisplayName', 'No', 'Human-readable name (defaults to screenName if omitted).'],
              ['-Pdescription', 'No', 'Optional description for the screen.'],
              ['-Pcategory', 'No', 'Optional category for filtering.'],
              ['-Ptags', 'No', 'Comma-separated tags (e.g. "home,landing").'],
            ],
          },
        },
        {
          id: 'push-all',
          title: 'Push All Screens',
          content: `Upload every \`.json\` file in \`ketoy-screens/\` at once:`,
          code: `./gradlew ketoyPushAll -Pversion=1.0.0`,
          language: 'bash',
        },
        {
          id: 'push-api',
          title: 'Cloud API Endpoint',
          content: `\`ketoyPush\` sends a POST request to:

\`\`\`
POST {KETOY_BASE_URL}/api/screens/{KETOY_PACKAGE_NAME}/upload
\`\`\`

with headers:

\`\`\`
x-developer-api-key: {KETOY_DEVELOPER_API_KEY}
Content-Type: application/json
\`\`\`

and a JSON body containing the screen name, version, metadata, and the full screen JSON payload.`,
        },
      ],
    },

    // ── Screen Management ──
    {
      id: 'screen-management',
      title: 'Screen Management',
      content: `Manage deployed screens via Gradle tasks:`,
      subsections: [
        {
          id: 'list-screens',
          title: 'List Deployed Screens',
          code: `./gradlew ketoyListScreens`,
          language: 'bash',
          content: `Lists all screens currently deployed for your package. Calls:

\`\`\`
GET {KETOY_BASE_URL}/api/screens/{KETOY_PACKAGE_NAME}
\`\`\``,
        },
        {
          id: 'screen-versions',
          title: 'List Screen Versions',
          code: `./gradlew ketoyScreenVersions -PscreenName=home`,
          language: 'bash',
          content: `Shows all deployed versions for a specific screen. Calls:

\`\`\`
GET {KETOY_BASE_URL}/api/screens/{KETOY_PACKAGE_NAME}/home/versions
\`\`\``,
        },
        {
          id: 'screen-details',
          title: 'Get Screen Details',
          code: `./gradlew ketoyScreenDetails -PscreenName=home`,
          language: 'bash',
          content: `Fetches full details including the current JSON payload. Calls:

\`\`\`
GET {KETOY_BASE_URL}/api/screens/{KETOY_PACKAGE_NAME}/home/details?includeJson=true
\`\`\``,
        },
        {
          id: 'rollback',
          title: 'Rollback to a Version',
          code: `./gradlew ketoyRollback -PscreenName=home -Pversion=1.0.0`,
          language: 'bash',
          content: `Rolls back a screen to a previously pushed version. Calls:

\`\`\`
POST {KETOY_BASE_URL}/api/screens/{KETOY_PACKAGE_NAME}/home/rollback/1.0.0
\`\`\``,
        },
        {
          id: 'delete-screen',
          title: 'Delete a Screen',
          code: `./gradlew ketoyDeleteScreen -PscreenName=home`,
          language: 'bash',
          content: `**⚠️ Destructive** — Deletes all versions of the screen from the cloud. Calls:

\`\`\`
DELETE {KETOY_BASE_URL}/api/screens/{KETOY_PACKAGE_NAME}/home
\`\`\``,
        },
      ],
    },

    // ── Consuming Exports ──
    {
      id: 'consuming-exports',
      title: 'Consuming Exports',
      content: `Once your screens are exported you have three delivery strategies:

### 1. Bundle in App Assets
Copy \`ketoy-export/\` contents into your \`assets/\` folder. Screens load instantly at runtime with zero network dependency:

\`\`\`
app/src/main/assets/ketoy/
├── home.json
├── profile.json
├── nav_main.json
├── navigation_manifest.json
└── screen_manifest.json
\`\`\`

### 2. Push to Ketoy Cloud
Use \`./gradlew ketoyPush\` or \`ketoyPushAll\` to upload screens. The app fetches them from the cloud API at runtime — enables **over-the-air UI updates** without app store releases.

### 3. Self-Hosted CDN
Host the exported JSON files on any static CDN (S3, CloudFront, Vercel, etc.). Configure your app to fetch screens from your CDN URL. Full control over caching and distribution.`,
    },

    // ── Versioning Strategy ──
    {
      id: 'versioning',
      title: 'Versioning Strategy',
      content: `Every screen has an independent version string. Follow semantic versioning:

| Change Type | Example | Version Bump |
|---|---|---|
| Color tweak, text change | Updated button label | Patch: \`1.0.0\` → \`1.0.1\` |
| New content block added | Added "promotions" section | Minor: \`1.0.0\` → \`1.1.0\` |
| Layout restructure | Redesigned screen layout | Major: \`1.0.0\` → \`2.0.0\` |

The version is set in your \`KetoyProductionExport\` subclass and can be overridden per push:

\`\`\`kotlin
// In AppProductionExport:
screen(screenName = "home", version = "1.2.0") { ... }

// Or override at push time:
./gradlew ketoyPush -PscreenName=home -Pversion=1.3.0
\`\`\`

Use \`ketoyScreenVersions\` to audit all deployed versions, and \`ketoyRollback\` to revert instantly if an update causes issues.`,
    },

    // ── Best Practices ──
    {
      id: 'best-practices',
      title: 'Best Practices',
      content: `**Use template variables in production** — Replace hardcoded test data with \`{{data:...}}\` placeholders. This keeps JSON screens data-agnostic and reusable.

**Run \`ketoyExportProd\` in CI** — Add the export task to your CI pipeline to catch serialization errors early.

**Version bump before pushing** — Always increment the version string when pushing a changed screen. This creates an audit trail and enables rollback.

**Test locally first** — Use \`./gradlew ketoyDev\` and the live-reload pipeline to preview changes before exporting for production.

**Keep \`local.properties\` private** — Your API key lives there. Never commit it. Use CI secrets for automated push workflows.

**Write manifests** — Always generate \`navigation_manifest.json\` and \`screen_manifest.json\`. They serve as the entry point for loading screens at runtime.

**Bundle a fallback** — Ship a baseline set of screens in \`assets/\` so the app works offline, then layer cloud-fetched updates on top.`,
    },
  ],
  nextDoc: 'ktext',
  prevDoc: 'testing-locally',
}

export default productionReleaseDoc
