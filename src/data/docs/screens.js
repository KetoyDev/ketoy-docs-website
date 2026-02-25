/**
 * Ketoy Documentation – Screens
 * Covers: ProvideKetoyScreen, KetoyContent, KetoyScreen, LocalKetoyScreen
 */

const screensDoc = {
  id: 'screens',
  title: 'Screens',
  description: 'Use ProvideKetoyScreen and KetoyContent to define server-driven screens in Ketoy. Screens support mixed Compose + DSL content, multi-content blocks, cloud fetching, and hot-reload from the dev server.',
  icon: 'FaMobileAlt',
  order: 3,
  sections: [
    // ── Overview ──
    {
      id: 'overview',
      title: 'Overview',
      content: `Every Ketoy screen is built around two composables:

| Composable | Role |
|---|---|
| **ProvideKetoyScreen** | Top-level wrapper — creates (or retrieves) a \`KetoyScreen\` and provides it to children via \`LocalKetoyScreen\` |
| **KetoyContent** | Child block — self-registers a DSL/JSON content entry with the parent screen and renders it in-place |

A single \`ProvideKetoyScreen\` can contain **multiple** \`KetoyContent\` blocks freely interleaved with native Jetpack Compose code. Each content block is independently hot-reloadable from the dev server and fetchable from Ketoy Cloud.

### Content resolution order
When a \`KetoyContent\` block renders, the parent \`KetoyScreen\` resolves the UI in this order:

1. **Dev-server override** — hot-reload JSON injected via \`setDevOverride\`
2. **Cloud** — fetches from Ketoy Cloud (when \`cloudEnabled\` and SDK cloud is configured)
3. **Local JSON** — from the content entry's \`jsonContent\`
4. **Asset** — loads JSON from a local asset file (\`assetPath\`)
5. **Composable** — renders a \`@Composable\` lambda directly
6. **DSL fallback** — \`nodeBuilder\` or \`dslBuilder\` → serialised to JSON → rendered
7. **Empty** — placeholder text`,
    },

    // ── ProvideKetoyScreen ──
    {
      id: 'provide-ketoy-screen',
      title: 'ProvideKetoyScreen',
      content: `\`ProvideKetoyScreen\` is the **primary entry point** for every Ketoy screen. It creates a \`KetoyScreen\` instance (or retrieves an existing one from \`KetoyScreenRegistry\`) and provides it to child composables via \`LocalKetoyScreen\`.

Wrap your screen composable with \`ProvideKetoyScreen\` so that child \`KetoyContent\` blocks can self-register and resolve their content.`,
      code: `@Composable
fun ProvideKetoyScreen(
    screenName: String,
    cloudEnabled: Boolean = true,
    colorScheme: KetoyColorScheme? = null,
    content: @Composable () -> Unit
)`,
      language: 'kotlin',
      subsections: [
        {
          id: 'provide-params',
          title: 'Parameters',
          table: {
            headers: ['Parameter', 'Type', 'Default', 'Description'],
            rows: [
              ['screenName', 'String', '—', 'Unique screen identifier used for cloud lookup, dev-server hot reload, and JSON export.'],
              ['cloudEnabled', 'Boolean', 'true', 'Whether Ketoy Cloud fetching is enabled for this screen.'],
              ['colorScheme', 'KetoyColorScheme?', 'null', 'Optional color scheme override for DSL rendering.'],
              ['content', '@Composable () -> Unit', '—', 'The screen body. Typically contains one or more KetoyContent blocks and/or native Compose code.'],
            ],
          },
        },
      ],
    },

    // ── KetoyContent ──
    {
      id: 'ketoy-content',
      title: 'KetoyContent',
      content: `\`KetoyContent\` is a **child** composable that represents one DSL content block inside a \`ProvideKetoyScreen\`-wrapped parent.

Each \`KetoyContent\` is identified by a unique \`name\` (default \`"main"\`), so a single screen can contain multiple DSL content blocks. \`KetoyContent\` self-registers its content entry with the parent \`KetoyScreen\` and renders the DSL-driven UI in-place.`,
      code: `@Composable
fun KetoyContent(
    name: String = "main",
    nodeBuilder: (() -> KNode)? = null,
    dslBuilder: (KUniversalScope.() -> Unit)? = null
)`,
      language: 'kotlin',
      subsections: [
        {
          id: 'content-params',
          title: 'Parameters',
          table: {
            headers: ['Parameter', 'Type', 'Default', 'Description'],
            rows: [
              ['name', 'String', '"main"', 'Identifies this content block within the screen. Must be unique among siblings.'],
              ['nodeBuilder', '(() -> KNode)?', 'null', 'A lambda returning a KNode tree. Takes precedence over dslBuilder.'],
              ['dslBuilder', '(KUniversalScope.() -> Unit)?', 'null', 'Inline DSL builder using KUniversalScope. Used when nodeBuilder is null.'],
            ],
          },
        },
        {
          id: 'content-trailing-lambda',
          title: 'Trailing-Lambda Overload',
          content: `There is a convenience overload that accepts a trailing lambda for inline DSL — no need to specify the \`dslBuilder\` parameter name:`,
          code: `@Composable
fun KetoyContent(
    name: String = "main",
    dslBuilder: KUniversalScope.() -> Unit
)

// Usage:
KetoyContent("body") {
    KText("Hello from DSL")
    KButton(onClick = { doSomething() }) {
        KText("Click Me")
    }
}`,
          language: 'kotlin',
        },
      ],
    },

    // ── Single-content screen ──
    {
      id: 'single-content',
      title: 'Single-Content Screen',
      content: `The simplest pattern — one screen, one DSL content block. The \`nodeBuilder\` lambda returns a \`KNode\` tree that the screen will render, hot-reload, and export:`,
      code: `@Composable
fun HomeScreen() {
    ProvideKetoyScreen(screenName = "home") {
        KetoyContent(
            nodeBuilder = { buildHomeUI() }
        )
    }
}`,
      language: 'kotlin',
    },

    // ── Multi-content screen ──
    {
      id: 'multi-content',
      title: 'Multi-Content Screen (Mixed Compose + DSL)',
      content: `The real power of Ketoy — interleave multiple \`KetoyContent\` blocks with native Jetpack Compose code. Each DSL block is independently hot-reloadable while the native Compose sections remain untouched:`,
      code: `@Composable
fun HomeScreen(
    userName: String,
    totalBalance: String,
    income: String,
    expenses: String,
    savings: String,
    notificationCount: Int,
    isDark: Boolean,
    transactions: List<Triple<String, String, String>>
) {
    ProvideKetoyScreen(screenName = "home") {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(if (isDark) Color(0xFF1C1B1F) else Color(0xFFFFFBFE))
        ) {

            // ── 1. Cards section (DSL — hot-reloadable) ──
            KetoyContent(
                name = "cards",
                nodeBuilder = {
                    buildHomeCards(
                        userName = userName,
                        totalBalance = totalBalance,
                        income = income,
                        notificationCount = notificationCount,
                        isDark = isDark
                    )
                }
            )

            // ── 2. Expenses section (native Compose) ──
            HomeExpensesSection(
                expenses = expenses,
                savings = savings,
                isDark = isDark
            )

            // ── 3. Transactions list (DSL — hot-reloadable) ──
            KetoyContent(
                name = "transactions",
                nodeBuilder = {
                    buildHomeTransactions(
                        transactions = transactions,
                        isDark = isDark
                    )
                }
            )

            Spacer(modifier = Modifier.weight(1f))

            // ── 4. Bottom buttons (native Compose) ──
            HomeBottomButtons(isDark = isDark)
        }
    }
}`,
      language: 'kotlin',
    },

    // ── Inline DSL ──
    {
      id: 'inline-dsl',
      title: 'Inline DSL (Trailing Lambda)',
      content: `For quick prototyping or simple screens, you can write the DSL inline using the trailing-lambda overload of \`KetoyContent\`:`,
      code: `@Composable
fun SimpleBanner() {
    ProvideKetoyScreen(screenName = "banner") {
        KetoyContent("header") {
            KColumn(
                modifier = KModifier(fillMaxWidth = 1f, padding = 16),
                verticalArrangement = spacedBy(8)
            ) {
                KText("Welcome!", fontSize = 24, fontWeight = KFontWeights.Bold)
                KText("Check out the latest updates.", color = KColors.OnSurfaceVariant)
            }
        }
    }
}`,
      language: 'kotlin',
    },

    // ── KetoyScreen class ──
    {
      id: 'ketoy-screen-class',
      title: 'KetoyScreen Class',
      content: `Under the hood, \`ProvideKetoyScreen\` creates a \`KetoyScreen\` instance. This class holds all screen metadata and content entries:`,
      code: `class KetoyScreen(
    val screenName: String,
    val displayName: String = screenName.replace("_", " ")
        .replaceFirstChar { it.uppercaseChar() },
    val description: String = "",
    val version: String = "1.0.0",
    val cloudEnabled: Boolean = true,
    val colorScheme: KetoyColorScheme? = null
)`,
      language: 'kotlin',
      subsections: [
        {
          id: 'screen-class-params',
          title: 'Properties',
          table: {
            headers: ['Property', 'Type', 'Default', 'Description'],
            rows: [
              ['screenName', 'String', '—', 'Unique identifier for cloud fetching, dev-server hot reload, and JSON export (e.g. "home_screen").'],
              ['displayName', 'String', 'derived from screenName', 'Human-readable name (underscores replaced, first char capitalised).'],
              ['description', 'String', '""', 'Optional description of the screen purpose.'],
              ['version', 'String', '"1.0.0"', 'Semantic version string for the screen.'],
              ['cloudEnabled', 'Boolean', 'true', 'Whether cloud fetching is enabled for this screen.'],
              ['colorScheme', 'KetoyColorScheme?', 'null', 'Optional color scheme override applied when rendering the DSL/JSON UI tree.'],
            ],
          },
        },
        {
          id: 'screen-factory-methods',
          title: 'Factory Methods',
          content: `\`KetoyScreen\` provides factory methods for creating single-content screens from different sources:`,
          table: {
            headers: ['Method', 'Source', 'Description'],
            rows: [
              ['create { ... }', 'Inline DSL', 'Build content using KUniversalScope DSL.'],
              ['fromNode { ... }', '() -> KNode', 'Build content from a KNode lambda.'],
              ['fromJson(json)', 'String', 'Render content from a raw JSON string.'],
              ['fromComposable { ... }', '@Composable', 'Render a native Compose lambda directly.'],
              ['fromAsset(path)', 'Asset file', 'Load JSON from a local asset file path.'],
            ],
          },
        },
      ],
    },

    // ── ContentEntry ──
    {
      id: 'content-entry',
      title: 'ContentEntry',
      content: `Each content block in a \`KetoyScreen\` is stored as a \`ContentEntry\` data class:`,
      code: `data class ContentEntry(
    val name: String,
    val jsonContent: String? = null,
    val dslBuilder: (KUniversalScope.() -> Unit)? = null,
    val nodeBuilder: (() -> KNode)? = null,
    val composableBuilder: (@Composable () -> Unit)? = null,
    val assetPath: String? = null
)`,
      language: 'kotlin',
      subsections: [
        {
          id: 'content-entry-params',
          title: 'Properties',
          table: {
            headers: ['Property', 'Type', 'Description'],
            rows: [
              ['name', 'String', 'Unique identifier within the parent screen (default "main").'],
              ['jsonContent', 'String?', 'Static JSON string for the UI tree.'],
              ['dslBuilder', '(KUniversalScope.() -> Unit)?', 'Inline DSL builder. Used when nodeBuilder is null.'],
              ['nodeBuilder', '(() -> KNode)?', 'Lambda returning a KNode tree. Takes precedence over dslBuilder.'],
              ['composableBuilder', '(@Composable () -> Unit)?', 'A native Compose lambda rendered as-is.'],
              ['assetPath', 'String?', 'Path to a local JSON asset file.'],
            ],
          },
        },
        {
          id: 'content-entry-methods',
          title: 'Methods',
          table: {
            headers: ['Method', 'Returns', 'Description'],
            rows: [
              ['buildNode()', 'KNode?', 'Build DSL to a KNode tree (prefers nodeBuilder over dslBuilder).'],
              ['buildJson()', 'String?', 'Build DSL to a JSON string via buildNode().toJson().'],
            ],
          },
        },
      ],
    },

    // ── LocalKetoyScreen ──
    {
      id: 'local-ketoy-screen',
      title: 'LocalKetoyScreen',
      content: `\`LocalKetoyScreen\` is a \`CompositionLocal\` that provides the current \`KetoyScreen\` to child composables. It is set automatically by \`ProvideKetoyScreen\`:`,
      code: `val LocalKetoyScreen = staticCompositionLocalOf<KetoyScreen?> { null }

// Access from child composables
@Composable
fun MyWidget() {
    val screen = LocalKetoyScreen.current
        ?: error("Must be inside a ProvideKetoyScreen block")
    Text("Screen: \${screen.screenName}")
}`,
      language: 'kotlin',
    },

    // ── JSON Export Format ──
    {
      id: 'json-export',
      title: 'JSON Export Format',
      content: `When a multi-content screen is exported (via the dev-server or export tests), the JSON wraps individual content blocks under a \`"contents"\` key:`,
      code: `{
    "screenName": "dashboard",
    "displayName": "Dashboard",
    "version": "1.0.0",
    "contents": {
        "cards":        { "type": "Column", ... },
        "transactions": { "type": "LazyColumn", ... }
    }
}`,
      language: 'json',
    },

    // ── Dev-server overrides ──
    {
      id: 'dev-override',
      title: 'Dev-Server Overrides',
      content: `The dev server can push JSON overrides for individual content blocks or the entire screen. When an override is active, it takes highest priority in the resolution chain:`,
      code: `// Per-content override
screen.setDevOverride(name = "cards", json = updatedCardsJson)

// Screen-level override (distributes to individual content entries)
screen.setScreenDevOverride(json = """
{
    "contents": {
        "cards": { "type": "Column", ... },
        "transactions": { "type": "LazyColumn", ... }
    }
}
""")

// Clear override
screen.setDevOverride(name = "cards", json = null)`,
      language: 'kotlin',
    },

    // ── KetoyScreenRegistry ──
    {
      id: 'screen-registry',
      title: 'KetoyScreenRegistry',
      content: `\`KetoyScreenRegistry\` is a global singleton that stores all registered screens. \`ProvideKetoyScreen\` automatically registers screens here. The registry is used by:

- **Navigation** — \`KetoyNavHost\` resolves string routes by looking up screen names here
- **Dev server** — targets screens by \`screenName\` for hot-reload
- **Cloud** — fetches overrides using \`screenName\` as the key
- **Export** — serializes all registered screens to JSON files`,
    },

    // ── Best practices ──
    {
      id: 'best-practices',
      title: 'Best Practices',
      content: `**Use meaningful screen names** — The \`screenName\` is the key for cloud, dev-server, and export. Use stable, descriptive names like \`"home"\`, \`"profile"\`, \`"checkout_review"\`.

**Give each content block a name** — When using multiple \`KetoyContent\` blocks, always provide a \`name\` parameter (e.g. \`"cards"\`, \`"transactions"\`). The default \`"main"\` works for single-content screens.

**Keep DSL builders pure** — \`nodeBuilder\` and \`dslBuilder\` should be side-effect free. Pass data as parameters — don't call APIs or mutate state inside them.

**Prefer nodeBuilder for complex screens** — Extract your DSL into a separate \`buildXyz()\` function that returns a \`KNode\`. This keeps your Compose code clean and makes your DSL testable.

**Mix freely** — Native Compose sections (that don't need hot-reload) and \`KetoyContent\` blocks can be interleaved freely. Only the DSL parts are server-driven.`,
    },
  ],
  relatedReference: ['KetoyScreen', 'KUniversalScope', 'KNode', 'KetoyScreenRegistry', 'ProvideKetoyScreen', 'KetoyContent', 'LocalKetoyScreen'],
  nextDoc: 'knavigation',
  prevDoc: 'layouts',
}

export default screensDoc
