/**
 * Ketoy Documentation – Production Release
 * Covers: ketoyExport DSL, KetoyAutoExportRunner, manifests,
 *         cloud config, Gradle push/rollback/delete tasks
 */

const productionReleaseDoc = {
  id: 'production-release',
  title: 'Production Release',
  description: 'Export production-ready screen .ktw wire bundles and navigation manifests with ketoyExport DSL, configure cloud credentials, and deploy screens with versioned push, rollback, and lifecycle management via Gradle tasks.',
  icon: 'FaRocket',
  order: 6,
  sections: [
    // ── Overview ──
    {
      id: 'overview',
      title: 'Overview',
      content: `The production pipeline takes your Kotlin DSL screens, compiles them to self-contained \`.ktw\` wire bundles (**10× smaller than JSON**), writes index manifests, and optionally pushes them to the Ketoy Cloud API for over-the-air delivery.

### Production vs Dev Export

| | Dev Export | Production Export |
|---|---|---|
| **DSL** | \`ketoyExport()\` | \`ketoyExport()\` (same!) |
| **Output dir** | \`ketoy-screens/\` | \`ketoy-export/\` |
| **Gradle task** | \`ketoyExport\` | \`ketoyExportProd\` |
| **Test method** | \`exportForDevServer()\` | \`exportForProduction()\` |
| **Manifests** | No | Yes (\`navigation_manifest.json\` + \`screen_manifest.json\`) — JSON index files |
| **Purpose** | Live-reload during development | Ship to app assets / cloud |

> **Note:** As of 0.1-beta.1, both dev and production exports use the same \`ketoyExport()\` DSL. No separate \`KetoyProductionExport\` class is needed.

### Gradle tasks at a glance

| Task | Command | Description |
|---|---|---|
| \`ketoyExportProd\` | \`./gradlew ketoyExportProd\` | Compile screens to \`.ktw\` wire files + manifests in \`ketoy-export/\` |
| \`ketoyPush\` | \`./gradlew ketoyPush -PscreenName=home -Pversion=1.0.0\` | Upload a single screen to the cloud |
| \`ketoyPushAll\` | \`./gradlew ketoyPushAll -Pversion=1.0.0\` | Upload all screens from \`ketoy-screens/\` |
| \`ketoyListScreens\` | \`./gradlew ketoyListScreens\` | List deployed screens |
| \`ketoyScreenVersions\` | \`./gradlew ketoyScreenVersions -PscreenName=home\` | List all versions of a screen |
| \`ketoyRollback\` | \`./gradlew ketoyRollback -PscreenName=home -Pversion=1.0.0\` | Rollback to a specific version |
| \`ketoyDeleteScreen\` | \`./gradlew ketoyDeleteScreen -PscreenName=home\` | Delete all versions of a screen |`,
    },

    // ── Step 1: Define Screen Exports ──
    {
      id: 'screen-exports',
      title: 'Step 1 — Define Screen Exports (Same as Dev)',
      content: `Production exports use the same \`ketoyExport()\` DSL as dev exports. Just add version and description metadata:`,
      code: `// HomeScreen.kt
import com.developerstring.ketoy.export.ketoyExport
import com.developerstring.ketoy.util.KData

val homeExport = ketoyExport(
    screenName = "home",
    displayName = "Home Screen",
    description = "Main landing screen with cards and transactions",
    version = "1.0.0"
) {
    content("cards") {
        buildHomeCards(
            userName = KData.user("name"),
            totalBalance = KData.user("totalBalance"),
            income = KData.user("monthlyIncome"),
            notificationCount = KData.user("notificationCount"),
        )
    }
    content("transactions") {
        buildHomeTransactions()
    }
}`,
      language: 'kotlin',
      subsections: [
        {
          id: 'screen-metadata',
          title: 'Screen Metadata',
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
          id: 'kdata-templates',
          title: 'KData Template Variables',
          content: `Use \`KData\` to insert template placeholders that resolve at runtime:`,
          code: `userName = KData.user("name")          // → {{data:user:name}} → "Jane Doe"
totalBalance = KData.user("totalBalance")  // → {{data:user:totalBalance}} → "$12,450.00"
iconRef = KData.ref("settings_icon")       // → {{data:ref:settings_icon}}`,
          language: 'kotlin',
        },
      ],
    },

    // ── Step 2: Register Nav Graph Exports ──
    {
      id: 'nav-exports',
      title: 'Step 2 — Register Nav Graph Exports',
      content: `Register navigation graphs for export using \`ketoyNavExport()\`:`,
      code: `// AppNavGraphs.kt (or a dedicated exports file)
import com.developerstring.ketoy.export.ketoyNavExport

val mainNavExport = ketoyNavExport(AppNavGraphs.main)
val demoNavExport = ketoyNavExport(AppNavGraphs.demo)`,
      language: 'kotlin',
    },

    // ── Step 3: AppExports Manifest ──
    {
      id: 'app-exports',
      title: 'Step 3 — Create AppExports Manifest',
      content: `Reference all your export definitions in an \`AppExports\` object to trigger class-loading:`,
      code: `// AppExports.kt
object AppExports {
    init {
        // Screen exports
        homeExport
        profileExport
        analyticsExport
        cardsExport
        historyExport

        // Nav graph exports
        mainNavExport
        demoNavExport
    }

    fun ensureLoaded() { /* init block does the work */ }
}`,
      language: 'kotlin',
    },

    // ── Step 4: KetoyAutoExportTest ──
    {
      id: 'auto-export-test',
      title: 'Step 4 — KetoyAutoExportTest Handles Both',
      content: `A single test class handles both dev and production exports:`,
      code: `class KetoyAutoExportTest {

    private val runner = KetoyAutoExportRunner()

    @Before
    fun setUp() {
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
            writeManifests = true  // production includes manifests
        )
        println(result)
    }
}`,
      language: 'kotlin',
      subsections: [
        {
          id: 'export-runner-api',
          title: 'KetoyAutoExportRunner API',
          table: {
            headers: ['Parameter', 'Type', 'Default', 'Description'],
            rows: [
              ['outputDir', 'File', '(required)', 'Target directory for .ktw wire files and manifests.'],
              ['clearExisting', 'Boolean', 'true', 'Remove existing .ktw wire files before writing.'],
              ['writeManifests', 'Boolean', 'true', 'Generate navigation_manifest.json and screen_manifest.json (JSON index files).'],
            ],
          },
        },
      ],
    },

    // ── Step 5: Run the Export ──
    {
      id: 'run-prod-export',
      title: 'Step 5 — Run the Production Export',
      content: `Use the \`ketoyExportProd\` Gradle task:`,
      code: `./gradlew ketoyExportProd`,
      language: 'bash',
      subsections: [
        {
          id: 'prod-output',
          title: 'Output Structure',
          content: `The exported files land in \`ketoy-export/\` at the project root:

\`\`\`
ketoy-export/
├── home.ktw                     # Screen wire files (10× smaller than JSON)
├── profile.ktw
├── analytics.ktw
├── cards.ktw
├── history_screen.ktw
├── nav_main.json                # Navigation graph JSONs (remain JSON)
├── nav_demo.json
├── navigation_manifest.json     # Nav graph index (JSON)
└── screen_manifest.json         # Screen index with metadata (JSON)
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
            "fileName": "home.ktw",
            "contents": ["cards", "transactions"]
        },
        {
            "screenName": "profile",
            "displayName": "Profile Screen",
            "version": "1.0.0",
            "fileName": "profile.ktw",
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
      content: `Upload screen \`.ktw\` wire payloads to the Ketoy Cloud API for over-the-air delivery.`,
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
              ['-PscreenName', 'Yes', 'Name of the screen to push (must match a .ktw file in ketoy-screens/).'],
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
          content: `Upload every \`.ktw\` wire file in \`ketoy-screens/\` at once:`,
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

and a multipart body containing the screen name, version, metadata, and the \`.ktw\` wire payload.`,
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
      content: `**Use \`KData\` template variables** — Use \`KData.user("key")\` instead of hardcoded values. This keeps JSON screens data-agnostic and reusable across environments.

**Define exports alongside screens** — Place \`ketoyExport()\` at the top of each screen file. The export definition and screen code stay together as a single source of truth.

**Run \`ketoyExportProd\` in CI** — Add the export task to your CI pipeline to catch serialization errors early.

**Version bump before pushing** — Always increment the version string when pushing a changed screen. This creates an audit trail and enables rollback.

**Test locally first** — Use \`./gradlew ketoyDev\` and the live-reload pipeline to preview changes before exporting for production.

**Keep \`local.properties\` private** — Your API key lives there. Never commit it. Use CI secrets for automated push workflows.

**Keep \`AppExports\` up to date** — When adding a new screen, reference its export val in \`AppExports.init {}\`.

**Bundle a fallback** — Ship a baseline set of screens in \`assets/\` so the app works offline, then layer cloud-fetched updates on top.`,
    },
  ],
  nextDoc: 'ktext',
  prevDoc: 'testing-locally',
}

export default productionReleaseDoc
