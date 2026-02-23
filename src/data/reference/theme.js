/**
 * Ketoy SDK – Theme Module
 * Package: com.developerstring.ketoy.theme
 */

const themeData = {

  /* ── Theme > Mode ── */

  KetoyThemeMode: {
    name: 'KetoyThemeMode',
    kind: 'sealed class',
    module: 'theme',
    subpackage: 'mode',
    category: 'Theme',
    subcategory: 'Theme Mode',
    description: 'Controls how Ketoy resolves dark/light theme colours. Sealed hierarchy with four variants: System (follow device setting), Light (force light), Dark (force dark), and Custom (provide your own light and dark KetoyColorScheme).',
    android: {
      packageName: 'com.developerstring.ketoy.theme',
      annotations: [],
      imports: [],
      sourceCode: `sealed class KetoyThemeMode {
    data object System : KetoyThemeMode()
    data object Light : KetoyThemeMode()
    data object Dark : KetoyThemeMode()
    data class Custom(
        val lightScheme: KetoyColorScheme,
        val darkScheme: KetoyColorScheme,
    ) : KetoyThemeMode()
}`,
    },
    properties: [],
    innerClasses: [
      {
        name: 'KetoyThemeMode.System',
        kind: 'data object',
        description: 'Follow the system dark/light setting (reads MaterialTheme.colorScheme).',
        properties: [],
      },
      {
        name: 'KetoyThemeMode.Light',
        kind: 'data object',
        description: 'Force light theme.',
        properties: [],
      },
      {
        name: 'KetoyThemeMode.Dark',
        kind: 'data object',
        description: 'Force dark theme.',
        properties: [],
      },
      {
        name: 'KetoyThemeMode.Custom',
        kind: 'data class',
        description: 'Provide custom light and dark KetoyColorSchemes. Ketoy switches between them based on the system setting.',
        properties: [
          { name: 'lightScheme', type: 'KetoyColorScheme', default: '—', description: 'Colour scheme used in light mode.' },
          { name: 'darkScheme', type: 'KetoyColorScheme', default: '—', description: 'Colour scheme used in dark mode.' },
        ],
      },
    ],
    usage: `// Follow system setting (default)
KetoyThemeProvider(themeMode = KetoyThemeMode.System) { ... }

// Always light
KetoyThemeProvider(themeMode = KetoyThemeMode.Light) { ... }

// Always dark
KetoyThemeProvider(themeMode = KetoyThemeMode.Dark) { ... }

// Custom dark & light schemes
KetoyThemeProvider(
    themeMode = KetoyThemeMode.Custom(
        lightScheme = myLightScheme,
        darkScheme  = myDarkScheme
    )
) {
    JSONStringToUI(json)
}`,
    notes: 'Used by KetoyThemeProvider to resolve colours. When System is selected, colours are derived from the active MaterialTheme.colorScheme.',
    seeAlso: ['KetoyThemeProvider', 'KetoyColorScheme', 'LocalKetoyColors', 'LocalKetoyDarkTheme'],
  },

  /* ── Theme > Color Scheme ── */

  KetoyColorScheme: {
    name: 'KetoyColorScheme',
    kind: 'data class',
    module: 'theme',
    subpackage: 'colorscheme',
    category: 'Theme',
    subcategory: 'Color Scheme',
    description: 'Ketoy\'s own colour scheme that maps semantic tokens (e.g. "primary") to actual Color values. Provides a consistent bridge between server-driven JSON colour references and the host app\'s design system. The full set of tokens mirrors Material 3\'s ColorScheme.',
    android: {
      packageName: 'com.developerstring.ketoy.theme',
      annotations: [],
      imports: [
        'import androidx.compose.material3.ColorScheme',
        'import androidx.compose.ui.graphics.Color',
      ],
      sourceCode: `data class KetoyColorScheme(
    val primary: Color,
    val onPrimary: Color,
    val primaryContainer: Color,
    val onPrimaryContainer: Color,
    val secondary: Color,
    val onSecondary: Color,
    val secondaryContainer: Color,
    val onSecondaryContainer: Color,
    val tertiary: Color,
    val onTertiary: Color,
    val tertiaryContainer: Color,
    val onTertiaryContainer: Color,
    val error: Color,
    val onError: Color,
    val errorContainer: Color,
    val onErrorContainer: Color,
    val background: Color,
    val onBackground: Color,
    val surface: Color,
    val onSurface: Color,
    val surfaceVariant: Color,
    val onSurfaceVariant: Color,
    val outline: Color,
    val outlineVariant: Color,
    val inversePrimary: Color,
    val inverseSurface: Color,
    val inverseOnSurface: Color,
    val surfaceTint: Color,
) {
    fun resolve(token: String): Color? { ... }

    companion object {
        fun fromMaterial(cs: ColorScheme): KetoyColorScheme { ... }
    }
}`,
    },
    properties: [
      { name: 'primary', type: 'Color', default: '—', description: 'The primary brand colour.' },
      { name: 'onPrimary', type: 'Color', default: '—', description: 'Content colour on top of primary.' },
      { name: 'primaryContainer', type: 'Color', default: '—', description: 'A tonal variant of primary for containers.' },
      { name: 'onPrimaryContainer', type: 'Color', default: '—', description: 'Content colour on primaryContainer.' },
      { name: 'secondary', type: 'Color', default: '—', description: 'The secondary brand colour.' },
      { name: 'onSecondary', type: 'Color', default: '—', description: 'Content colour on top of secondary.' },
      { name: 'secondaryContainer', type: 'Color', default: '—', description: 'A tonal variant of secondary for containers.' },
      { name: 'onSecondaryContainer', type: 'Color', default: '—', description: 'Content colour on secondaryContainer.' },
      { name: 'tertiary', type: 'Color', default: '—', description: 'The tertiary accent colour.' },
      { name: 'onTertiary', type: 'Color', default: '—', description: 'Content colour on top of tertiary.' },
      { name: 'tertiaryContainer', type: 'Color', default: '—', description: 'A tonal variant of tertiary for containers.' },
      { name: 'onTertiaryContainer', type: 'Color', default: '—', description: 'Content colour on tertiaryContainer.' },
      { name: 'error', type: 'Color', default: '—', description: 'Colour for error states and indicators.' },
      { name: 'onError', type: 'Color', default: '—', description: 'Content colour on top of error.' },
      { name: 'errorContainer', type: 'Color', default: '—', description: 'A lighter tonal variant of error for containers.' },
      { name: 'onErrorContainer', type: 'Color', default: '—', description: 'Content colour on errorContainer.' },
      { name: 'background', type: 'Color', default: '—', description: 'The default background colour of the application.' },
      { name: 'onBackground', type: 'Color', default: '—', description: 'Content colour on top of background.' },
      { name: 'surface', type: 'Color', default: '—', description: 'The default surface colour for cards, sheets, etc.' },
      { name: 'onSurface', type: 'Color', default: '—', description: 'Content colour on top of surface.' },
      { name: 'surfaceVariant', type: 'Color', default: '—', description: 'An alternative surface colour with slightly more emphasis.' },
      { name: 'onSurfaceVariant', type: 'Color', default: '—', description: 'Content colour on surfaceVariant.' },
      { name: 'outline', type: 'Color', default: '—', description: 'Subtle border/divider colour.' },
      { name: 'outlineVariant', type: 'Color', default: '—', description: 'A lower-emphasis variant of outline.' },
      { name: 'inversePrimary', type: 'Color', default: '—', description: 'Primary colour for inverse (dark-on-light) surfaces.' },
      { name: 'inverseSurface', type: 'Color', default: '—', description: 'Surface colour for inverse themes.' },
      { name: 'inverseOnSurface', type: 'Color', default: '—', description: 'Content colour on inverseSurface.' },
      { name: 'surfaceTint', type: 'Color', default: '—', description: 'Tint colour applied to elevated surfaces.' },
    ],
    methods: [
      { name: 'resolve(token: String)', returns: 'Color?', description: 'Resolve a theme token name (e.g. "primary", "onSurface") to the corresponding Color, or null if the token is unknown. Used internally by the Ketoy renderer to map JSON colour references.' },
      { name: 'fromMaterial(cs: ColorScheme)', returns: 'KetoyColorScheme', description: 'Companion factory. Build a KetoyColorScheme from a Material 3 ColorScheme, mapping every slot to its Ketoy equivalent.' },
    ],
    usage: `// Custom scheme
val myScheme = KetoyColorScheme(
    primary = Color(0xFF6200EE),
    onPrimary = Color.White,
    // ... all other tokens ...
)

// From Material 3
val scheme = KetoyColorScheme.fromMaterial(MaterialTheme.colorScheme)

// Resolve a token
val bgColor: Color? = scheme.resolve("background")`,
    notes: 'All 28 colour tokens mirror Material 3\'s ColorScheme. The resolve() method is case-sensitive. Unknown tokens return null. The companion fromMaterial() factory is the recommended way to create a scheme from an existing M3 theme.',
    seeAlso: ['KetoyThemeProvider', 'KetoyThemeMode', 'LocalKetoyColors'],
  },

  LocalKetoyColors: {
    name: 'LocalKetoyColors',
    kind: 'CompositionLocal',
    module: 'theme',
    subpackage: 'colorscheme',
    category: 'Theme',
    subcategory: 'Color Scheme',
    description: 'CompositionLocal that provides the current KetoyColorScheme. If no KetoyThemeProvider is installed the default is a "stub" scheme where every slot is Color.Unspecified, so callers always fall back to their own defaults.',
    android: {
      packageName: 'com.developerstring.ketoy.theme',
      annotations: [],
      imports: [
        'import androidx.compose.runtime.staticCompositionLocalOf',
        'import androidx.compose.ui.graphics.Color',
      ],
      sourceCode: `val LocalKetoyColors = staticCompositionLocalOf {
    KetoyColorScheme(
        primary = Color.Unspecified, onPrimary = Color.Unspecified,
        // ... all slots = Color.Unspecified ...
    )
}`,
    },
    properties: [
      { name: 'current', type: 'KetoyColorScheme', default: 'all Color.Unspecified', description: 'The current KetoyColorScheme. Defaults to a stub scheme where every slot is Color.Unspecified.' },
    ],
    usage: `// Reading colours inside a Ketoy renderer
val scheme = LocalKetoyColors.current
val bgColor = scheme.resolve("background") ?: Color.White`,
    notes: 'Always returns a valid KetoyColorScheme (never null). Without a KetoyThemeProvider ancestor, all colours are Color.Unspecified.',
    seeAlso: ['KetoyColorScheme', 'KetoyThemeProvider', 'LocalKetoyDarkTheme'],
  },

  /* ── Theme > Provider ── */

  LocalKetoyDarkTheme: {
    name: 'LocalKetoyDarkTheme',
    kind: 'CompositionLocal',
    module: 'theme',
    subpackage: 'provider',
    category: 'Theme',
    subcategory: 'Theme Provider',
    description: 'Whether Ketoy is currently rendering in dark mode. Readable anywhere inside a KetoyThemeProvider subtree.',
    android: {
      packageName: 'com.developerstring.ketoy.theme',
      annotations: [],
      imports: [
        'import androidx.compose.runtime.staticCompositionLocalOf',
      ],
      sourceCode: `val LocalKetoyDarkTheme = staticCompositionLocalOf { false }`,
    },
    properties: [
      { name: 'current', type: 'Boolean', default: 'false', description: 'true if Ketoy is rendering in dark mode, false for light mode.' },
    ],
    usage: `val isDark = LocalKetoyDarkTheme.current
if (isDark) {
    // Dark-mode specific logic
}`,
    notes: 'Set automatically by KetoyThemeProvider based on the resolved themeMode.',
    seeAlso: ['KetoyThemeProvider', 'KetoyThemeMode', 'LocalKetoyColors'],
  },

  KetoyThemeProvider: {
    name: 'KetoyThemeProvider',
    kind: '@Composable function',
    module: 'theme',
    subpackage: 'provider',
    category: 'Theme',
    subcategory: 'Theme Provider',
    description: 'Provides a KetoyColorScheme for the Ketoy rendering pipeline. Wraps content with LocalKetoyColors and LocalKetoyDarkTheme. Can auto-derive colours from MaterialTheme.colorScheme, accept an explicit override, or switch based on KetoyThemeMode.',
    android: {
      packageName: 'com.developerstring.ketoy.theme',
      annotations: ['@Composable'],
      imports: [
        'import androidx.compose.foundation.isSystemInDarkTheme',
        'import androidx.compose.material3.MaterialTheme',
        'import androidx.compose.runtime.CompositionLocalProvider',
      ],
      sourceCode: `@Composable
fun KetoyThemeProvider(
    colorScheme: KetoyColorScheme? = null,
    themeMode: KetoyThemeMode = KetoyThemeMode.System,
    content: @Composable () -> Unit,
) {
    val isDark = isSystemInDarkTheme()
    val resolved = colorScheme ?: when (themeMode) {
        is KetoyThemeMode.System -> KetoyColorScheme.fromMaterial(MaterialTheme.colorScheme)
        is KetoyThemeMode.Light  -> KetoyColorScheme.fromMaterial(MaterialTheme.colorScheme)
        is KetoyThemeMode.Dark   -> KetoyColorScheme.fromMaterial(MaterialTheme.colorScheme)
        is KetoyThemeMode.Custom -> if (isDark) themeMode.darkScheme else themeMode.lightScheme
    }
    val darkFlag = when {
        colorScheme != null              -> isDark
        themeMode is KetoyThemeMode.Light -> false
        themeMode is KetoyThemeMode.Dark  -> true
        else                              -> isDark
    }
    CompositionLocalProvider(
        LocalKetoyColors provides resolved,
        LocalKetoyDarkTheme provides darkFlag,
    ) {
        content()
    }
}`,
    },
    properties: [
      { name: 'colorScheme', type: 'KetoyColorScheme?', default: 'null', description: 'Explicit colour scheme override. Takes priority over themeMode when non-null.' },
      { name: 'themeMode', type: 'KetoyThemeMode', default: 'KetoyThemeMode.System', description: 'How to pick the colour scheme when colorScheme is null.' },
      { name: 'content', type: '@Composable () -> Unit', default: '—', description: 'Composable content that will receive the provided colour scheme.' },
    ],
    usage: `// Automatic — reads MaterialTheme
KetoyThemeProvider {
    JSONStringToUI(json)
}

// Custom colours
KetoyThemeProvider(
    colorScheme = KetoyColorScheme(
        primary = Color(0xFF6200EE),
        onPrimary = Color.White,
        // ...
    )
) {
    JSONStringToUI(json)
}

// Theme mode — dark/light switching
KetoyThemeProvider(
    themeMode = KetoyThemeMode.Custom(
        lightScheme = myLightScheme,
        darkScheme  = myDarkScheme
    )
) {
    JSONStringToUI(json)
}`,
    notes: 'When colorScheme is provided, it takes absolute priority over themeMode. For System/Light/Dark modes, colours are derived from MaterialTheme.colorScheme. For Custom, the appropriate light/dark scheme is selected based on the system dark-theme state.',
    seeAlso: ['KetoyColorScheme', 'KetoyThemeMode', 'LocalKetoyColors', 'LocalKetoyDarkTheme'],
  },
}

export default themeData
