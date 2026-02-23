/**
 * Ketoy SDK – Util Module
 * Package: com.developerstring.ketoy.util
 */

const utilData = {

  /* ══════════════════════════════════════════════
     SUBPACKAGE: colors
     ══════════════════════════════════════════════ */

  KColors: {
    name: 'KColors',
    kind: 'object',
    module: 'util',
    subpackage: 'colors',
    category: 'Util',
    subcategory: 'Color Constants',
    description: 'Singleton object providing static hex color constants, Material 3 theme color references, and helper methods for composing colors with alpha transparency. Hex constants resolve to literal color values while theme references (prefixed "@theme/") resolve at render time from the active MaterialTheme.',
    android: {
      packageName: 'com.developerstring.ketoy.util',
      annotations: [],
      imports: [],
      sourceCode: `object KColors {
    // ── Static hex colors ──
    const val Blue = "#0000FF"
    const val Red = "#FF0000"
    const val Green = "#00FF00"
    const val Yellow = "#FFFF00"
    const val Cyan = "#00FFFF"
    const val Magenta = "#FF00FF"
    const val White = "#FFFFFF"
    const val Black = "#000000"
    const val Transparent = "transparent"
    const val Gray = "#808080"

    // ── Material 3 theme references ──
    const val Primary = "@theme/primary"
    const val OnPrimary = "@theme/onPrimary"
    const val PrimaryContainer = "@theme/primaryContainer"
    const val OnPrimaryContainer = "@theme/onPrimaryContainer"
    const val Secondary = "@theme/secondary"
    const val OnSecondary = "@theme/onSecondary"
    const val SecondaryContainer = "@theme/secondaryContainer"
    const val OnSecondaryContainer = "@theme/onSecondaryContainer"
    const val Tertiary = "@theme/tertiary"
    const val OnTertiary = "@theme/onTertiary"
    const val Background = "@theme/background"
    const val OnBackground = "@theme/onBackground"
    const val Surface = "@theme/surface"
    const val OnSurface = "@theme/onSurface"
    const val SurfaceVariant = "@theme/surfaceVariant"
    const val OnSurfaceVariant = "@theme/onSurfaceVariant"
    const val Error = "@theme/error"
    const val OnError = "@theme/onError"

    fun hex(hex: String): String = hex
    fun withAlpha(color: String, alpha: Float): String = "$color@alpha:$alpha"
    fun withAlphaPercent(color: String, percent: Int): String =
        "$color@alpha:\${percent / 100f}"
}`,
    },
    properties: [
      { name: 'Blue', type: 'String', default: '"#0000FF"', description: 'Static hex color for blue.' },
      { name: 'Red', type: 'String', default: '"#FF0000"', description: 'Static hex color for red.' },
      { name: 'Green', type: 'String', default: '"#00FF00"', description: 'Static hex color for green.' },
      { name: 'Yellow', type: 'String', default: '"#FFFF00"', description: 'Static hex color for yellow.' },
      { name: 'Cyan', type: 'String', default: '"#00FFFF"', description: 'Static hex color for cyan.' },
      { name: 'Magenta', type: 'String', default: '"#FF00FF"', description: 'Static hex color for magenta.' },
      { name: 'White', type: 'String', default: '"#FFFFFF"', description: 'Static hex color for white.' },
      { name: 'Black', type: 'String', default: '"#000000"', description: 'Static hex color for black.' },
      { name: 'Transparent', type: 'String', default: '"transparent"', description: 'Transparent color keyword.' },
      { name: 'Gray', type: 'String', default: '"#808080"', description: 'Static hex color for gray.' },
      { name: 'Primary', type: 'String', default: '"@theme/primary"', description: 'Material 3 primary theme color reference.' },
      { name: 'OnPrimary', type: 'String', default: '"@theme/onPrimary"', description: 'Material 3 on-primary theme color reference.' },
      { name: 'PrimaryContainer', type: 'String', default: '"@theme/primaryContainer"', description: 'Material 3 primary container theme color reference.' },
      { name: 'OnPrimaryContainer', type: 'String', default: '"@theme/onPrimaryContainer"', description: 'Material 3 on-primary-container theme color reference.' },
      { name: 'Secondary', type: 'String', default: '"@theme/secondary"', description: 'Material 3 secondary theme color reference.' },
      { name: 'OnSecondary', type: 'String', default: '"@theme/onSecondary"', description: 'Material 3 on-secondary theme color reference.' },
      { name: 'SecondaryContainer', type: 'String', default: '"@theme/secondaryContainer"', description: 'Material 3 secondary container theme color reference.' },
      { name: 'OnSecondaryContainer', type: 'String', default: '"@theme/onSecondaryContainer"', description: 'Material 3 on-secondary-container theme color reference.' },
      { name: 'Tertiary', type: 'String', default: '"@theme/tertiary"', description: 'Material 3 tertiary theme color reference.' },
      { name: 'OnTertiary', type: 'String', default: '"@theme/onTertiary"', description: 'Material 3 on-tertiary theme color reference.' },
      { name: 'Background', type: 'String', default: '"@theme/background"', description: 'Material 3 background theme color reference.' },
      { name: 'OnBackground', type: 'String', default: '"@theme/onBackground"', description: 'Material 3 on-background theme color reference.' },
      { name: 'Surface', type: 'String', default: '"@theme/surface"', description: 'Material 3 surface theme color reference.' },
      { name: 'OnSurface', type: 'String', default: '"@theme/onSurface"', description: 'Material 3 on-surface theme color reference.' },
      { name: 'SurfaceVariant', type: 'String', default: '"@theme/surfaceVariant"', description: 'Material 3 surface variant theme color reference.' },
      { name: 'OnSurfaceVariant', type: 'String', default: '"@theme/onSurfaceVariant"', description: 'Material 3 on-surface-variant theme color reference.' },
      { name: 'Error', type: 'String', default: '"@theme/error"', description: 'Material 3 error theme color reference.' },
      { name: 'OnError', type: 'String', default: '"@theme/onError"', description: 'Material 3 on-error theme color reference.' },
    ],
    methods: [
      { name: 'hex(hex: String)', returns: 'String', description: 'Pass-through helper for custom hex color strings. Returns the input unchanged.' },
      { name: 'withAlpha(color: String, alpha: Float)', returns: 'String', description: 'Append an alpha suffix to a color string. alpha should be 0.0–1.0.' },
      { name: 'withAlphaPercent(color: String, percent: Int)', returns: 'String', description: 'Append an alpha suffix based on a percentage (0–100). Converts to 0.0–1.0 internally.' },
    ],
    usage: `// Use a static hex color
text(color = KColors.Red)

// Use a Material 3 theme color
text(color = KColors.Primary)

// Custom hex color via helper
text(color = KColors.hex("#1A73E8"))

// 50% transparent black overlay
box(background = KColors.withAlpha(KColors.Black, 0.5f))

// 25% alpha via percentage
box(background = KColors.withAlphaPercent(KColors.White, 25))`,
    notes: 'Theme color references (prefixed "@theme/") are resolved at render time from the active MaterialTheme color scheme. They are not valid standalone hex strings.',
    seeAlso: ['KShapes', 'KGradients', 'kModifier'],
  },

  /* ══════════════════════════════════════════════
     SUBPACKAGE: constants
     ══════════════════════════════════════════════ */

  KArrangements: {
    name: 'KArrangements',
    kind: 'object',
    module: 'util',
    subpackage: 'constants',
    category: 'Util',
    subcategory: 'Layout Arrangement',
    description: 'String constants representing vertical and horizontal arrangement options for Row and Column layouts. Maps to Jetpack Compose Arrangement values. Also provides a spacedBy() helper for fixed-dp spacing.',
    android: {
      packageName: 'com.developerstring.ketoy.util',
      annotations: [],
      imports: [],
      sourceCode: `object KArrangements {
    const val Start = "start"
    const val Top = "top"
    const val Center = "center"
    const val End = "end"
    const val Bottom = "bottom"
    const val SpaceBetween = "spaceBetween"
    const val SpaceEvenly = "spaceEvenly"
    const val SpaceAround = "spaceAround"

    fun spacedBy(dp: Int): String = "spacedBy_\$dp"
}`,
    },
    properties: [
      { name: 'Start', type: 'String', default: '"start"', description: 'Arrange children at the start (horizontal).' },
      { name: 'Top', type: 'String', default: '"top"', description: 'Arrange children at the top (vertical).' },
      { name: 'Center', type: 'String', default: '"center"', description: 'Arrange children at the center.' },
      { name: 'End', type: 'String', default: '"end"', description: 'Arrange children at the end (horizontal).' },
      { name: 'Bottom', type: 'String', default: '"bottom"', description: 'Arrange children at the bottom (vertical).' },
      { name: 'SpaceBetween', type: 'String', default: '"spaceBetween"', description: 'Space children evenly; no space at edges.' },
      { name: 'SpaceEvenly', type: 'String', default: '"spaceEvenly"', description: 'Distribute children evenly with equal spacing.' },
      { name: 'SpaceAround', type: 'String', default: '"spaceAround"', description: 'Space children evenly; half-size space at edges.' },
    ],
    methods: [
      { name: 'spacedBy(dp: Int)', returns: 'String', description: 'Returns the arrangement string "spacedBy_<dp>" recognised by the arrangement parser. E.g. spacedBy(8) → "spacedBy_8".' },
    ],
    usage: `column(verticalArrangement = KArrangements.SpaceBetween) {
    text("First")
    text("Last")
}

row(horizontalArrangement = KArrangements.Center) {
    icon(KIcons.Home)
    text("Home")
}

// Fixed spacing between children
column(verticalArrangement = KArrangements.spacedBy(8)) {
    text("Item 1")
    text("Item 2")
    text("Item 3")
}`,
    notes: 'Used in KColumn verticalArrangement and KRow horizontalArrangement properties. All values are lowercase strings. The spacedBy() function generates a "spacedBy_<dp>" string that the renderer parses into Arrangement.spacedBy(<dp>.dp).',
    seeAlso: ['KAlignments', 'kModifier'],
  },

  KAlignments: {
    name: 'KAlignments',
    kind: 'object',
    module: 'util',
    subpackage: 'constants',
    category: 'Util',
    subcategory: 'Layout Alignment',
    description: 'String constants representing alignment options for Box, Row, and Column composables. Maps to Jetpack Compose Alignment values.',
    android: {
      packageName: 'com.developerstring.ketoy.util',
      annotations: [],
      imports: [],
      sourceCode: `object KAlignments {
    const val Start = "start"
    const val Center = "center"
    const val End = "end"
    const val Top = "top"
    const val Bottom = "bottom"
    const val CenterHorizontally = "centerHorizontally"
    const val CenterVertically = "centerVertically"
    const val TopStart = "topStart"
    const val TopCenter = "topCenter"
    const val TopEnd = "topEnd"
    const val CenterStart = "centerStart"
    const val CenterEnd = "centerEnd"
    const val BottomStart = "bottomStart"
    const val BottomCenter = "bottomCenter"
    const val BottomEnd = "bottomEnd"
}`,
    },
    properties: [
      { name: 'Start', type: 'String', default: '"start"', description: 'Align to start (Column child alignment).' },
      { name: 'Center', type: 'String', default: '"center"', description: 'Align to center (Box 2D).' },
      { name: 'End', type: 'String', default: '"end"', description: 'Align to end (Column child alignment).' },
      { name: 'Top', type: 'String', default: '"top"', description: 'Align to top (Row child alignment).' },
      { name: 'Bottom', type: 'String', default: '"bottom"', description: 'Align to bottom (Row child alignment).' },
      { name: 'CenterHorizontally', type: 'String', default: '"centerHorizontally"', description: 'Center horizontally (Column child alignment).' },
      { name: 'CenterVertically', type: 'String', default: '"centerVertically"', description: 'Center vertically (Row child alignment).' },
      { name: 'TopStart', type: 'String', default: '"topStart"', description: 'Align to top-start corner (Box).' },
      { name: 'TopCenter', type: 'String', default: '"topCenter"', description: 'Align to top-center (Box).' },
      { name: 'TopEnd', type: 'String', default: '"topEnd"', description: 'Align to top-end corner (Box).' },
      { name: 'CenterStart', type: 'String', default: '"centerStart"', description: 'Align to center-start (Box).' },
      { name: 'CenterEnd', type: 'String', default: '"centerEnd"', description: 'Align to center-end (Box).' },
      { name: 'BottomStart', type: 'String', default: '"bottomStart"', description: 'Align to bottom-start corner (Box).' },
      { name: 'BottomCenter', type: 'String', default: '"bottomCenter"', description: 'Align to bottom-center (Box).' },
      { name: 'BottomEnd', type: 'String', default: '"bottomEnd"', description: 'Align to bottom-end corner (Box).' },
    ],
    usage: `box(contentAlignment = KAlignments.Center) {
    text("Centered")
}

row(verticalAlignment = KAlignments.CenterVertically) {
    icon(KIcons.Star)
    text("Aligned")
}

column(horizontalAlignment = KAlignments.CenterHorizontally) {
    text("Centered Column")
}`,
    notes: 'Box uses 2D alignments (TopStart, Center, etc.), Row uses vertical alignments (Top, CenterVertically, Bottom), and Column uses horizontal alignments (Start, CenterHorizontally, End).',
    seeAlso: ['KArrangements', 'kModifier'],
  },

  KFontWeights: {
    name: 'KFontWeights',
    kind: 'object',
    module: 'util',
    subpackage: 'constants',
    category: 'Util',
    subcategory: 'Typography',
    description: 'String constants for font weight values. Maps to Compose FontWeight options.',
    android: {
      packageName: 'com.developerstring.ketoy.util',
      annotations: [],
      imports: [],
      sourceCode: `object KFontWeights {
    const val Thin = "Thin"
    const val Light = "Light"
    const val Normal = "Normal"
    const val Bold = "Bold"
    const val ExtraBold = "ExtraBold"
}`,
    },
    properties: [
      { name: 'Thin', type: 'String', default: '"Thin"', description: 'Thin font weight (W100).' },
      { name: 'Light', type: 'String', default: '"Light"', description: 'Light font weight (W300).' },
      { name: 'Normal', type: 'String', default: '"Normal"', description: 'Normal font weight (W400).' },
      { name: 'Bold', type: 'String', default: '"Bold"', description: 'Bold font weight (W700).' },
      { name: 'ExtraBold', type: 'String', default: '"ExtraBold"', description: 'Extra-bold font weight (W800).' },
    ],
    usage: `text(
    "Hello World",
    fontWeight = KFontWeights.Bold
)`,
    notes: 'The renderer maps these string constants to Compose FontWeight values at render time.',
    seeAlso: ['KTextAlign', 'KColors'],
  },

  KTextAlign: {
    name: 'KTextAlign',
    kind: 'object',
    module: 'util',
    subpackage: 'constants',
    category: 'Util',
    subcategory: 'Typography',
    description: 'String constants for text alignment options. Maps to Compose TextAlign values.',
    android: {
      packageName: 'com.developerstring.ketoy.util',
      annotations: [],
      imports: [],
      sourceCode: `object KTextAlign {
    const val Start = "Start"
    const val Center = "Center"
    const val End = "End"
    const val Justify = "Justify"
}`,
    },
    properties: [
      { name: 'Start', type: 'String', default: '"Start"', description: 'Align text to the start edge.' },
      { name: 'Center', type: 'String', default: '"Center"', description: 'Center-align text.' },
      { name: 'End', type: 'String', default: '"End"', description: 'Align text to the end edge.' },
      { name: 'Justify', type: 'String', default: '"Justify"', description: 'Justify text across the available width.' },
    ],
    usage: `text(
    "Centered heading",
    textAlign = KTextAlign.Center
)`,
    notes: 'Justify may not be visually impactful on short single-line text.',
    seeAlso: ['KFontWeights', 'KColors'],
  },

  KGradients: {
    name: 'KGradients',
    kind: 'object',
    module: 'util',
    subpackage: 'constants',
    category: 'Util',
    subcategory: 'Gradient Builders',
    description: 'Factory methods for creating gradient descriptors. Supports linear, radial, and sweep gradients with configurable parameters. Contains a nested Directions object with predefined direction vectors.',
    android: {
      packageName: 'com.developerstring.ketoy.util',
      annotations: [],
      imports: [],
      sourceCode: `object KGradients {
    fun linear(colors: List<String>) = KGradient("linear", colors)
    fun linearAngle(colors: List<String>, angle: Float) =
        KGradient("linear_angle", colors, angle = angle)
    fun radial(colors: List<String>) = KGradient("radial", colors)
    fun radialCenter(colors: List<String>, centerX: Float, centerY: Float) =
        KGradient("radial_center", colors, centerX = centerX, centerY = centerY)
    fun sweep(colors: List<String>) = KGradient("sweep", colors)
    fun sweepAngles(colors: List<String>, startAngle: Float, endAngle: Float) =
        KGradient("sweep_angles", colors, startAngle = startAngle, endAngle = endAngle)

    object Directions {
        val Horizontal get() = listOf(0f, 0f, 1f, 0f)
        val Vertical get() = listOf(0f, 0f, 0f, 1f)
        val TopLeftToBottomRight get() = listOf(0f, 0f, 1f, 1f)
        val TopRightToBottomLeft get() = listOf(1f, 0f, 0f, 1f)
    }
}`,
    },
    methods: [
      { name: 'linear(colors: List<String>)', returns: 'KGradient', description: 'Create a default linear gradient with the given color stops.' },
      { name: 'linearAngle(colors: List<String>, angle: Float)', returns: 'KGradient', description: 'Create a linear gradient at a specific angle in degrees.' },
      { name: 'radial(colors: List<String>)', returns: 'KGradient', description: 'Create a default radial gradient centered in the view.' },
      { name: 'radialCenter(colors: List<String>, centerX: Float, centerY: Float)', returns: 'KGradient', description: 'Create a radial gradient with a custom center point (0.0–1.0 normalized).' },
      { name: 'sweep(colors: List<String>)', returns: 'KGradient', description: 'Create a default sweep (conical) gradient.' },
      { name: 'sweepAngles(colors: List<String>, startAngle: Float, endAngle: Float)', returns: 'KGradient', description: 'Create a sweep gradient between specific start and end angles in degrees.' },
    ],
    properties: [
      { name: 'Directions.Horizontal', type: 'List<Float>', default: '[0f, 0f, 1f, 0f]', description: 'Left-to-right direction vector.' },
      { name: 'Directions.Vertical', type: 'List<Float>', default: '[0f, 0f, 0f, 1f]', description: 'Top-to-bottom direction vector.' },
      { name: 'Directions.TopLeftToBottomRight', type: 'List<Float>', default: '[0f, 0f, 1f, 1f]', description: 'Diagonal direction: top-left to bottom-right.' },
      { name: 'Directions.TopRightToBottomLeft', type: 'List<Float>', default: '[1f, 0f, 0f, 1f]', description: 'Diagonal direction: top-right to bottom-left.' },
    ],
    usage: `// Simple linear gradient
box(
    gradient = KGradients.linear(listOf(KColors.Red, KColors.Blue))
)

// Angled linear gradient
box(
    gradient = KGradients.linearAngle(
        listOf(KColors.Primary, KColors.Secondary), 45f
    )
)

// Radial gradient with custom center
box(
    gradient = KGradients.radialCenter(
        listOf(KColors.White, KColors.Black), 0.3f, 0.7f
    )
)

// Sweep gradient
box(
    gradient = KGradients.sweep(
        listOf(KColors.Red, KColors.Green, KColors.Blue)
    )
)`,
    notes: 'Gradient descriptors are serialized to JSON and resolved by the renderer. Color strings can be hex values or theme references from KColors.',
    seeAlso: ['KColors', 'KShapes', 'kModifier'],
  },

  KFabPosition: {
    name: 'KFabPosition',
    kind: 'object',
    module: 'util',
    subpackage: 'constants',
    category: 'Util',
    subcategory: 'Scaffold Configuration',
    description: 'String constants for floating action button positioning within a Scaffold.',
    android: {
      packageName: 'com.developerstring.ketoy.util',
      annotations: [],
      imports: [],
      sourceCode: `object KFabPosition {
    const val Start = "Start"
    const val End = "End"
    const val Center = "Center"
    const val EndOverlay = "EndOverlay"
    const val StartOverlay = "StartOverlay"
    const val CenterOverlay = "CenterOverlay"
}`,
    },
    properties: [
      { name: 'Start', type: 'String', default: '"Start"', description: 'Position FAB at the start of the bottom bar area.' },
      { name: 'End', type: 'String', default: '"End"', description: 'Position FAB at the end of the bottom bar area.' },
      { name: 'Center', type: 'String', default: '"Center"', description: 'Position FAB at the center of the bottom bar area.' },
      { name: 'EndOverlay', type: 'String', default: '"EndOverlay"', description: 'Position FAB overlaying the end of the bottom bar.' },
      { name: 'StartOverlay', type: 'String', default: '"StartOverlay"', description: 'Position FAB overlaying the start of the bottom bar.' },
      { name: 'CenterOverlay', type: 'String', default: '"CenterOverlay"', description: 'Position FAB overlaying the center of the bottom bar.' },
    ],
    usage: `scaffold(
    fabPosition = KFabPosition.EndOverlay
) {
    // scaffold content
}`,
    notes: 'Overlay positions cause the FAB to overlap the bottom bar; non-overlay positions are inset.',
    seeAlso: ['KFabType', 'KScaffoldDefaults', 'kFabElevation'],
  },

  KTopAppBarType: {
    name: 'KTopAppBarType',
    kind: 'object',
    module: 'util',
    subpackage: 'constants',
    category: 'Util',
    subcategory: 'Scaffold Configuration',
    description: 'String constants for Material 3 top app bar types.',
    android: {
      packageName: 'com.developerstring.ketoy.util',
      annotations: [],
      imports: [],
      sourceCode: `object KTopAppBarType {
    const val Small = "Small"
    const val CenterAligned = "CenterAligned"
    const val Medium = "Medium"
    const val Large = "Large"
}`,
    },
    properties: [
      { name: 'Small', type: 'String', default: '"Small"', description: 'Small top app bar (single-line title).' },
      { name: 'CenterAligned', type: 'String', default: '"CenterAligned"', description: 'Center-aligned top app bar.' },
      { name: 'Medium', type: 'String', default: '"Medium"', description: 'Medium top app bar (two-line collapsible).' },
      { name: 'Large', type: 'String', default: '"Large"', description: 'Large top app bar (three-line collapsible).' },
    ],
    usage: `scaffold(
    topBarType = KTopAppBarType.CenterAligned
) {
    // scaffold content
}`,
    notes: 'Medium and Large types support scrolling collapse behavior configured via KTopAppBarScrollBehaviorDefaults.',
    seeAlso: ['KTopAppBarScrollBehaviorDefaults', 'KScaffoldDefaults', 'kTopAppBarColors'],
  },

  KFabType: {
    name: 'KFabType',
    kind: 'object',
    module: 'util',
    subpackage: 'constants',
    category: 'Util',
    subcategory: 'Scaffold Configuration',
    description: 'String constants for floating action button size/type variants.',
    android: {
      packageName: 'com.developerstring.ketoy.util',
      annotations: [],
      imports: [],
      sourceCode: `object KFabType {
    const val Small = "Small"
    const val Regular = "Regular"
    const val Large = "Large"
    const val Extended = "Extended"
}`,
    },
    properties: [
      { name: 'Small', type: 'String', default: '"Small"', description: 'Small FAB variant.' },
      { name: 'Regular', type: 'String', default: '"Regular"', description: 'Regular (default) FAB variant.' },
      { name: 'Large', type: 'String', default: '"Large"', description: 'Large FAB variant.' },
      { name: 'Extended', type: 'String', default: '"Extended"', description: 'Extended FAB with icon and text label.' },
    ],
    usage: `scaffold(
    fabType = KFabType.Extended
) {
    // scaffold content
}`,
    notes: 'The Extended type requires both an icon and a text label; other types display only an icon.',
    seeAlso: ['KFabPosition', 'KScaffoldDefaults', 'kFabElevation'],
  },

  KSnackBarDuration: {
    name: 'KSnackBarDuration',
    kind: 'object',
    module: 'util',
    subpackage: 'constants',
    category: 'Util',
    subcategory: 'Scaffold Configuration',
    description: 'String constants for snack bar display duration.',
    android: {
      packageName: 'com.developerstring.ketoy.util',
      annotations: [],
      imports: [],
      sourceCode: `object KSnackBarDuration {
    const val Short = "Short"
    const val Long = "Long"
    const val Indefinite = "Indefinite"
}`,
    },
    properties: [
      { name: 'Short', type: 'String', default: '"Short"', description: 'Show snack bar for a short duration (~4 seconds).' },
      { name: 'Long', type: 'String', default: '"Long"', description: 'Show snack bar for a long duration (~10 seconds).' },
      { name: 'Indefinite', type: 'String', default: '"Indefinite"', description: 'Show snack bar until explicitly dismissed.' },
    ],
    usage: `scaffold(
    snackBarDuration = KSnackBarDuration.Long
) {
    // scaffold content
}`,
    notes: 'Indefinite snack bars must be dismissed programmatically or by user action.',
    seeAlso: ['KScaffoldDefaults'],
  },

  KTopAppBarScrollBehaviorDefaults: {
    name: 'KTopAppBarScrollBehaviorDefaults',
    kind: 'object',
    module: 'util',
    subpackage: 'constants',
    category: 'Util',
    subcategory: 'Scaffold Configuration',
    description: 'String constants for top app bar scroll behavior presets.',
    android: {
      packageName: 'com.developerstring.ketoy.util',
      annotations: [],
      imports: [],
      sourceCode: `object KTopAppBarScrollBehaviorDefaults {
    const val Pinned = "pinned"
    const val EnterAlways = "enterAlways"
    const val ExitUntilCollapsed = "exitUntilCollapsed"
}`,
    },
    properties: [
      { name: 'Pinned', type: 'String', default: '"pinned"', description: 'Top app bar stays fixed and does not respond to scroll.' },
      { name: 'EnterAlways', type: 'String', default: '"enterAlways"', description: 'Top app bar scrolls away on scroll down and reappears immediately on scroll up.' },
      { name: 'ExitUntilCollapsed', type: 'String', default: '"exitUntilCollapsed"', description: 'Top app bar collapses to its minimum height on scroll down.' },
    ],
    usage: `scaffold(
    topBarScrollBehavior = KTopAppBarScrollBehaviorDefaults.EnterAlways
) {
    // scaffold content
}`,
    notes: 'EnterAlways is the default for KScaffoldDefaults. Pinned is best suited for Small and CenterAligned types.',
    seeAlso: ['KTopAppBarType', 'KScaffoldDefaults', 'kTopAppBarColors'],
  },

  KWindowInsetsDefaults: {
    name: 'KWindowInsetsDefaults',
    kind: 'object',
    module: 'util',
    subpackage: 'constants',
    category: 'Util',
    subcategory: 'Window Insets',
    description: 'String constants for predefined window inset types. Maps to Compose WindowInsets companion values.',
    android: {
      packageName: 'com.developerstring.ketoy.util',
      annotations: [],
      imports: [],
      sourceCode: `object KWindowInsetsDefaults {
    const val None = "none"
    const val SystemBars = "systemBars"
    const val StatusBars = "statusBars"
    const val NavigationBars = "navigationBars"
    const val Ime = "ime"
    const val DisplayCutout = "displayCutout"
    const val WaterFall = "waterfall"
    const val MandatorySystemGestures = "mandatorySystemGestures"
    const val SystemGestures = "systemGestures"
    const val CaptionBar = "captionBar"
}`,
    },
    properties: [
      { name: 'None', type: 'String', default: '"none"', description: 'No window insets applied.' },
      { name: 'SystemBars', type: 'String', default: '"systemBars"', description: 'Combined status bar and navigation bar insets.' },
      { name: 'StatusBars', type: 'String', default: '"statusBars"', description: 'Status bar insets only.' },
      { name: 'NavigationBars', type: 'String', default: '"navigationBars"', description: 'Navigation bar insets only.' },
      { name: 'Ime', type: 'String', default: '"ime"', description: 'Software keyboard (IME) insets.' },
      { name: 'DisplayCutout', type: 'String', default: '"displayCutout"', description: 'Display cutout (notch) insets.' },
      { name: 'WaterFall', type: 'String', default: '"waterfall"', description: 'Waterfall display edge insets.' },
      { name: 'MandatorySystemGestures', type: 'String', default: '"mandatorySystemGestures"', description: 'Mandatory system gesture insets.' },
      { name: 'SystemGestures', type: 'String', default: '"systemGestures"', description: 'System gesture insets.' },
      { name: 'CaptionBar', type: 'String', default: '"captionBar"', description: 'Caption bar (freeform window title bar) insets.' },
    ],
    usage: `scaffold(
    contentWindowInsets = KWindowInsetsDefaults.SystemBars
) {
    // scaffold content
}

// Or with the helper function
val insets = kWindowInsets(type = KWindowInsetsDefaults.Ime)`,
    notes: 'Used by KScaffoldDefaults and the kWindowInsets helper function to specify inset types.',
    seeAlso: ['KScaffoldDefaults', 'kWindowInsets'],
  },

  KScaffoldDefaults: {
    name: 'KScaffoldDefaults',
    kind: 'object',
    module: 'util',
    subpackage: 'constants',
    category: 'Util',
    subcategory: 'Scaffold Configuration',
    description: 'Default configuration values for the Ketoy scaffold component. Provides sensible defaults for padding, insets, top bar behavior, bottom bar, FAB, snack bar, navigation rail, and drawer.',
    android: {
      packageName: 'com.developerstring.ketoy.util',
      annotations: [],
      imports: [],
      sourceCode: `object KScaffoldDefaults {
    const val ContentHorizontalPadding = "16"
    const val ContentVerticalPadding = "16"
    const val ContentWindowInsets = "systemBars"
    const val TopBarScrollBehavior = "enterAlways"
    const val BottomBarContainerColor = "@theme/surface"
    const val FabPosition = "End"
    const val FabShape = "circle"
    const val FabElevation = "6"
    const val SnackBarShape = "rounded_4"
    const val SnackBarDuration = "Short"
    const val NavigationBarContainerColor = "@theme/surface"
    const val NavigationRailContainerColor = "@theme/surface"
    const val DrawerContainerColor = "@theme/surface"
}`,
    },
    properties: [
      { name: 'ContentHorizontalPadding', type: 'String', default: '"16"', description: 'Default horizontal content padding in dp.' },
      { name: 'ContentVerticalPadding', type: 'String', default: '"16"', description: 'Default vertical content padding in dp.' },
      { name: 'ContentWindowInsets', type: 'String', default: '"systemBars"', description: 'Default window insets for scaffold content area.' },
      { name: 'TopBarScrollBehavior', type: 'String', default: '"enterAlways"', description: 'Default scroll behavior for the top app bar.' },
      { name: 'BottomBarContainerColor', type: 'String', default: '"@theme/surface"', description: 'Default container color for the bottom bar.' },
      { name: 'FabPosition', type: 'String', default: '"End"', description: 'Default FAB position.' },
      { name: 'FabShape', type: 'String', default: '"circle"', description: 'Default FAB shape.' },
      { name: 'FabElevation', type: 'String', default: '"6"', description: 'Default FAB elevation in dp.' },
      { name: 'SnackBarShape', type: 'String', default: '"rounded_4"', description: 'Default snack bar shape.' },
      { name: 'SnackBarDuration', type: 'String', default: '"Short"', description: 'Default snack bar display duration.' },
      { name: 'NavigationBarContainerColor', type: 'String', default: '"@theme/surface"', description: 'Default container color for the navigation bar.' },
      { name: 'NavigationRailContainerColor', type: 'String', default: '"@theme/surface"', description: 'Default container color for the navigation rail.' },
      { name: 'DrawerContainerColor', type: 'String', default: '"@theme/surface"', description: 'Default container color for the drawer.' },
    ],
    usage: `// These are applied automatically when using scaffold().
// Override individual values as needed:
scaffold(
    fabPosition = KFabPosition.Center,
    snackBarDuration = KSnackBarDuration.Long
) {
    // content
}`,
    notes: 'All values are strings because they are serialized to JSON. Numeric values like "16" are parsed to Int/dp at render time. Color references prefixed with "@theme/" resolve from MaterialTheme.',
    seeAlso: ['KFabPosition', 'KFabType', 'KTopAppBarType', 'KTopAppBarScrollBehaviorDefaults', 'KSnackBarDuration', 'KWindowInsetsDefaults', 'KShapes'],
  },

  /* ══════════════════════════════════════════════
     SUBPACKAGE: helpers
     ══════════════════════════════════════════════ */

  kModifier: {
    name: 'kModifier',
    kind: 'top-level function',
    module: 'util',
    subpackage: 'helpers',
    category: 'Util',
    subcategory: 'Modifier Builder',
    description: 'DSL builder function that creates a KModifier descriptor from named parameters. All parameters are nullable with null defaults, meaning only explicitly set values are serialized to JSON.',
    android: {
      packageName: 'com.developerstring.ketoy.util',
      annotations: [],
      imports: [
        'import com.developerstring.ketoy.model.KModifier',
      ],
      sourceCode: `fun kModifier(
    width: Int? = null,
    height: Int? = null,
    fillMaxWidth: Boolean? = null,
    fillMaxHeight: Boolean? = null,
    fillMaxSize: Boolean? = null,
    padding: Int? = null,
    paddingHorizontal: Int? = null,
    paddingVertical: Int? = null,
    background: String? = null,
    shape: String? = null,
    border: KBorder? = null,
    shadow: KShadow? = null,
    alpha: Float? = null,
    clip: Boolean? = null,
    clickable: String? = null,
    weight: Float? = null,
    aspectRatio: Float? = null,
    offset: KOffset? = null,
    rotate: Float? = null,
    scale: Float? = null,
    zIndex: Float? = null,
    scrollable: Boolean? = null
): KModifier = KModifier(
    width, height, fillMaxWidth, fillMaxHeight, fillMaxSize,
    padding, paddingHorizontal, paddingVertical,
    background, shape, border, shadow, alpha, clip,
    clickable, weight, aspectRatio, offset, rotate, scale,
    zIndex, scrollable
)`,
    },
    properties: [
      { name: 'width', type: 'Int?', default: 'null', description: 'Fixed width in dp.' },
      { name: 'height', type: 'Int?', default: 'null', description: 'Fixed height in dp.' },
      { name: 'fillMaxWidth', type: 'Boolean?', default: 'null', description: 'Fill the maximum available width.' },
      { name: 'fillMaxHeight', type: 'Boolean?', default: 'null', description: 'Fill the maximum available height.' },
      { name: 'fillMaxSize', type: 'Boolean?', default: 'null', description: 'Fill the maximum available size (width + height).' },
      { name: 'padding', type: 'Int?', default: 'null', description: 'Uniform padding on all sides in dp.' },
      { name: 'paddingHorizontal', type: 'Int?', default: 'null', description: 'Horizontal (start + end) padding in dp.' },
      { name: 'paddingVertical', type: 'Int?', default: 'null', description: 'Vertical (top + bottom) padding in dp.' },
      { name: 'background', type: 'String?', default: 'null', description: 'Background color (hex or theme reference).' },
      { name: 'shape', type: 'String?', default: 'null', description: 'Shape descriptor string (see KShapes).' },
      { name: 'border', type: 'KBorder?', default: 'null', description: 'Border configuration (see kBorder).' },
      { name: 'shadow', type: 'KShadow?', default: 'null', description: 'Shadow/elevation configuration (see kShadow).' },
      { name: 'alpha', type: 'Float?', default: 'null', description: 'Opacity (0.0–1.0).' },
      { name: 'clip', type: 'Boolean?', default: 'null', description: 'Whether to clip content to the shape.' },
      { name: 'clickable', type: 'String?', default: 'null', description: 'Action ID to invoke on click (registered via ActionRegistry).' },
      { name: 'weight', type: 'Float?', default: 'null', description: 'Layout weight for Row/Column children.' },
      { name: 'aspectRatio', type: 'Float?', default: 'null', description: 'Aspect ratio constraint (width / height).' },
      { name: 'offset', type: 'KOffset?', default: 'null', description: 'Offset translation (x, y in dp).' },
      { name: 'rotate', type: 'Float?', default: 'null', description: 'Rotation in degrees.' },
      { name: 'scale', type: 'Float?', default: 'null', description: 'Uniform scale factor.' },
      { name: 'zIndex', type: 'Float?', default: 'null', description: 'Z-index for draw ordering.' },
      { name: 'scrollable', type: 'Boolean?', default: 'null', description: 'Enable vertical scrolling for the content.' },
    ],
    usage: `val mod = kModifier(
    fillMaxWidth = true,
    padding = 16,
    background = KColors.Surface,
    shape = KShapes.Rounded12,
    border = kBorder(width = 1, color = KColors.OnSurface),
    shadow = kShadow(elevation = 4, shape = KShapes.Rounded12),
    alpha = 0.9f,
    clickable = actionId
)

text("Hello", modifier = mod)`,
    notes: 'Only non-null properties are serialized to JSON. The renderer maps each property to the corresponding Compose Modifier call.',
    seeAlso: ['kPadding', 'kMargin', 'kBorder', 'kShadow', 'KShapes', 'KColors', 'ActionRegistry'],
  },

  kPadding: {
    name: 'kPadding',
    kind: 'top-level function',
    module: 'util',
    subpackage: 'helpers',
    category: 'Util',
    subcategory: 'Spacing Builder',
    description: 'DSL builder for creating a KPadding descriptor. Supports uniform, axis-based, and per-side padding.',
    android: {
      packageName: 'com.developerstring.ketoy.util',
      annotations: [],
      imports: [
        'import com.developerstring.ketoy.model.KPadding',
      ],
      sourceCode: `fun kPadding(
    all: Int? = null,
    horizontal: Int? = null,
    vertical: Int? = null,
    start: Int? = null,
    end: Int? = null,
    top: Int? = null,
    bottom: Int? = null
): KPadding = KPadding(all, horizontal, vertical, start, end, top, bottom)`,
    },
    properties: [
      { name: 'all', type: 'Int?', default: 'null', description: 'Uniform padding on all sides in dp.' },
      { name: 'horizontal', type: 'Int?', default: 'null', description: 'Horizontal (start + end) padding in dp.' },
      { name: 'vertical', type: 'Int?', default: 'null', description: 'Vertical (top + bottom) padding in dp.' },
      { name: 'start', type: 'Int?', default: 'null', description: 'Start-side padding in dp.' },
      { name: 'end', type: 'Int?', default: 'null', description: 'End-side padding in dp.' },
      { name: 'top', type: 'Int?', default: 'null', description: 'Top padding in dp.' },
      { name: 'bottom', type: 'Int?', default: 'null', description: 'Bottom padding in dp.' },
    ],
    usage: `// Uniform padding
val p = kPadding(all = 16)

// Axis-based padding
val p = kPadding(horizontal = 24, vertical = 8)

// Per-side padding
val p = kPadding(start = 16, end = 8, top = 4, bottom = 12)`,
    notes: 'More specific values override less specific: per-side > axis > all.',
    seeAlso: ['kMargin', 'kModifier'],
  },

  kMargin: {
    name: 'kMargin',
    kind: 'top-level function',
    module: 'util',
    subpackage: 'helpers',
    category: 'Util',
    subcategory: 'Spacing Builder',
    description: 'DSL builder for creating a KMargin descriptor. Supports uniform, axis-based, and per-side margin. Margins are applied as outer spacing around a component.',
    android: {
      packageName: 'com.developerstring.ketoy.util',
      annotations: [],
      imports: [
        'import com.developerstring.ketoy.model.KMargin',
      ],
      sourceCode: `fun kMargin(
    all: Int? = null,
    horizontal: Int? = null,
    vertical: Int? = null,
    start: Int? = null,
    end: Int? = null,
    top: Int? = null,
    bottom: Int? = null
): KMargin = KMargin(all, horizontal, vertical, start, end, top, bottom)`,
    },
    properties: [
      { name: 'all', type: 'Int?', default: 'null', description: 'Uniform margin on all sides in dp.' },
      { name: 'horizontal', type: 'Int?', default: 'null', description: 'Horizontal (start + end) margin in dp.' },
      { name: 'vertical', type: 'Int?', default: 'null', description: 'Vertical (top + bottom) margin in dp.' },
      { name: 'start', type: 'Int?', default: 'null', description: 'Start-side margin in dp.' },
      { name: 'end', type: 'Int?', default: 'null', description: 'End-side margin in dp.' },
      { name: 'top', type: 'Int?', default: 'null', description: 'Top margin in dp.' },
      { name: 'bottom', type: 'Int?', default: 'null', description: 'Bottom margin in dp.' },
    ],
    usage: `// Uniform margin
val m = kMargin(all = 8)

// Horizontal + vertical margins
val m = kMargin(horizontal = 16, vertical = 4)`,
    notes: 'Margin is implemented as outer padding in Compose. More specific values override less specific: per-side > axis > all.',
    seeAlso: ['kPadding', 'kModifier'],
  },

  kBorder: {
    name: 'kBorder',
    kind: 'top-level function',
    module: 'util',
    subpackage: 'helpers',
    category: 'Util',
    subcategory: 'Decoration Builder',
    description: 'DSL builder for creating a KBorder descriptor with width, color, and optional shape.',
    android: {
      packageName: 'com.developerstring.ketoy.util',
      annotations: [],
      imports: [
        'import com.developerstring.ketoy.model.KBorder',
      ],
      sourceCode: `fun kBorder(
    width: Int? = null,
    color: String? = null,
    shape: String? = null
): KBorder = KBorder(width, color, shape)`,
    },
    properties: [
      { name: 'width', type: 'Int?', default: 'null', description: 'Border width in dp.' },
      { name: 'color', type: 'String?', default: 'null', description: 'Border color (hex or theme reference).' },
      { name: 'shape', type: 'String?', default: 'null', description: 'Border shape descriptor (see KShapes).' },
    ],
    usage: `val border = kBorder(
    width = 2,
    color = KColors.Primary,
    shape = KShapes.Rounded8
)

text("Bordered", modifier = kModifier(border = border))`,
    notes: 'If shape is null, the border follows the modifier\'s shape or defaults to rectangle.',
    seeAlso: ['kShadow', 'kModifier', 'KShapes', 'KColors'],
  },

  kShadow: {
    name: 'kShadow',
    kind: 'top-level function',
    module: 'util',
    subpackage: 'helpers',
    category: 'Util',
    subcategory: 'Decoration Builder',
    description: 'DSL builder for creating a KShadow descriptor with elevation, shape, clip, and color overrides.',
    android: {
      packageName: 'com.developerstring.ketoy.util',
      annotations: [],
      imports: [
        'import com.developerstring.ketoy.model.KShadow',
      ],
      sourceCode: `fun kShadow(
    elevation: Int? = null,
    shape: String? = null,
    clip: Boolean? = null,
    ambientColor: String? = null,
    spotColor: String? = null
): KShadow = KShadow(elevation, shape, clip, ambientColor, spotColor)`,
    },
    properties: [
      { name: 'elevation', type: 'Int?', default: 'null', description: 'Shadow elevation in dp.' },
      { name: 'shape', type: 'String?', default: 'null', description: 'Shadow shape descriptor (see KShapes).' },
      { name: 'clip', type: 'Boolean?', default: 'null', description: 'Whether to clip the shadow to the shape.' },
      { name: 'ambientColor', type: 'String?', default: 'null', description: 'Ambient shadow color override.' },
      { name: 'spotColor', type: 'String?', default: 'null', description: 'Spot shadow color override.' },
    ],
    usage: `val shadow = kShadow(
    elevation = 8,
    shape = KShapes.Rounded12,
    clip = true
)

box(modifier = kModifier(shadow = shadow)) {
    text("Elevated Card")
}`,
    notes: 'Color overrides (ambientColor, spotColor) are only effective on API 28+.',
    seeAlso: ['kBorder', 'kModifier', 'KShapes', 'KColors'],
  },

  kWindowInsets: {
    name: 'kWindowInsets',
    kind: 'top-level function',
    module: 'util',
    subpackage: 'helpers',
    category: 'Util',
    subcategory: 'Window Insets Builder',
    description: 'DSL builder for creating a KWindowInsets descriptor with explicit values or a predefined type.',
    android: {
      packageName: 'com.developerstring.ketoy.util',
      annotations: [],
      imports: [
        'import com.developerstring.ketoy.model.KWindowInsets',
      ],
      sourceCode: `fun kWindowInsets(
    left: Int? = null,
    top: Int? = null,
    right: Int? = null,
    bottom: Int? = null,
    type: String? = null
): KWindowInsets = KWindowInsets(left, top, right, bottom, type)`,
    },
    properties: [
      { name: 'left', type: 'Int?', default: 'null', description: 'Left inset in dp.' },
      { name: 'top', type: 'Int?', default: 'null', description: 'Top inset in dp.' },
      { name: 'right', type: 'Int?', default: 'null', description: 'Right inset in dp.' },
      { name: 'bottom', type: 'Int?', default: 'null', description: 'Bottom inset in dp.' },
      { name: 'type', type: 'String?', default: 'null', description: 'Predefined inset type (see KWindowInsetsDefaults).' },
    ],
    usage: `// By predefined type
val insets = kWindowInsets(type = KWindowInsetsDefaults.SystemBars)

// Explicit values
val insets = kWindowInsets(left = 0, top = 24, right = 0, bottom = 48)`,
    notes: 'If type is specified, explicit dp values are ignored. Use KWindowInsetsDefaults constants for the type parameter.',
    seeAlso: ['KWindowInsetsDefaults', 'KScaffoldDefaults'],
  },

  kTopAppBarColors: {
    name: 'kTopAppBarColors',
    kind: 'top-level function',
    module: 'util',
    subpackage: 'helpers',
    category: 'Util',
    subcategory: 'Color Configuration Builder',
    description: 'DSL builder for creating a KTopAppBarColors descriptor to customize top app bar colors.',
    android: {
      packageName: 'com.developerstring.ketoy.util',
      annotations: [],
      imports: [
        'import com.developerstring.ketoy.model.KTopAppBarColors',
      ],
      sourceCode: `fun kTopAppBarColors(
    containerColor: String? = null,
    scrolledContainerColor: String? = null,
    navigationIconContentColor: String? = null,
    titleContentColor: String? = null,
    actionIconContentColor: String? = null
): KTopAppBarColors = KTopAppBarColors(
    containerColor, scrolledContainerColor,
    navigationIconContentColor, titleContentColor,
    actionIconContentColor
)`,
    },
    properties: [
      { name: 'containerColor', type: 'String?', default: 'null', description: 'Background color of the top app bar.' },
      { name: 'scrolledContainerColor', type: 'String?', default: 'null', description: 'Background color when scrolled (elevated).' },
      { name: 'navigationIconContentColor', type: 'String?', default: 'null', description: 'Color of the navigation icon.' },
      { name: 'titleContentColor', type: 'String?', default: 'null', description: 'Color of the title text.' },
      { name: 'actionIconContentColor', type: 'String?', default: 'null', description: 'Color of the action icons.' },
    ],
    usage: `val colors = kTopAppBarColors(
    containerColor = KColors.Primary,
    titleContentColor = KColors.OnPrimary,
    navigationIconContentColor = KColors.OnPrimary,
    actionIconContentColor = KColors.OnPrimary
)`,
    notes: 'Color strings can be hex values (#RRGGBB) or theme references (@theme/*).',
    seeAlso: ['KTopAppBarType', 'KTopAppBarScrollBehaviorDefaults', 'KColors'],
  },

  kFabElevation: {
    name: 'kFabElevation',
    kind: 'top-level function',
    module: 'util',
    subpackage: 'helpers',
    category: 'Util',
    subcategory: 'Elevation Configuration Builder',
    description: 'DSL builder for creating a KFloatingActionButtonElevation descriptor to customize FAB elevation in different interaction states.',
    android: {
      packageName: 'com.developerstring.ketoy.util',
      annotations: [],
      imports: [
        'import com.developerstring.ketoy.model.KFloatingActionButtonElevation',
      ],
      sourceCode: `fun kFabElevation(
    defaultElevation: Int? = null,
    pressedElevation: Int? = null,
    focusedElevation: Int? = null,
    hoveredElevation: Int? = null,
    draggedElevation: Int? = null
): KFloatingActionButtonElevation = KFloatingActionButtonElevation(
    defaultElevation, pressedElevation, focusedElevation,
    hoveredElevation, draggedElevation
)`,
    },
    properties: [
      { name: 'defaultElevation', type: 'Int?', default: 'null', description: 'Default elevation in dp.' },
      { name: 'pressedElevation', type: 'Int?', default: 'null', description: 'Elevation when pressed in dp.' },
      { name: 'focusedElevation', type: 'Int?', default: 'null', description: 'Elevation when focused in dp.' },
      { name: 'hoveredElevation', type: 'Int?', default: 'null', description: 'Elevation when hovered in dp.' },
      { name: 'draggedElevation', type: 'Int?', default: 'null', description: 'Elevation when being dragged in dp.' },
    ],
    usage: `val elevation = kFabElevation(
    defaultElevation = 6,
    pressedElevation = 12,
    hoveredElevation = 8
)`,
    notes: 'All values are in dp. Null values fall back to Material 3 defaults.',
    seeAlso: ['KFabType', 'KFabPosition', 'KScaffoldDefaults'],
  },

  kNavigationDrawerItemColors: {
    name: 'kNavigationDrawerItemColors',
    kind: 'top-level function',
    module: 'util',
    subpackage: 'helpers',
    category: 'Util',
    subcategory: 'Color Configuration Builder',
    description: 'DSL builder for creating a KNavigationDrawerItemColors descriptor to customize navigation drawer item colors for selected and unselected states.',
    android: {
      packageName: 'com.developerstring.ketoy.util',
      annotations: [],
      imports: [
        'import com.developerstring.ketoy.model.KNavigationDrawerItemColors',
      ],
      sourceCode: `fun kNavigationDrawerItemColors(
    selectedContainerColor: String? = null,
    unselectedContainerColor: String? = null,
    selectedIconColor: String? = null,
    unselectedIconColor: String? = null,
    selectedTextColor: String? = null,
    unselectedTextColor: String? = null,
    selectedBadgeColor: String? = null,
    unselectedBadgeColor: String? = null
): KNavigationDrawerItemColors = KNavigationDrawerItemColors(
    selectedContainerColor, unselectedContainerColor,
    selectedIconColor, unselectedIconColor,
    selectedTextColor, unselectedTextColor,
    selectedBadgeColor, unselectedBadgeColor
)`,
    },
    properties: [
      { name: 'selectedContainerColor', type: 'String?', default: 'null', description: 'Container color when the item is selected.' },
      { name: 'unselectedContainerColor', type: 'String?', default: 'null', description: 'Container color when the item is unselected.' },
      { name: 'selectedIconColor', type: 'String?', default: 'null', description: 'Icon color when the item is selected.' },
      { name: 'unselectedIconColor', type: 'String?', default: 'null', description: 'Icon color when the item is unselected.' },
      { name: 'selectedTextColor', type: 'String?', default: 'null', description: 'Text color when the item is selected.' },
      { name: 'unselectedTextColor', type: 'String?', default: 'null', description: 'Text color when the item is unselected.' },
      { name: 'selectedBadgeColor', type: 'String?', default: 'null', description: 'Badge color when the item is selected.' },
      { name: 'unselectedBadgeColor', type: 'String?', default: 'null', description: 'Badge color when the item is unselected.' },
    ],
    usage: `val drawerColors = kNavigationDrawerItemColors(
    selectedContainerColor = KColors.PrimaryContainer,
    selectedIconColor = KColors.OnPrimaryContainer,
    selectedTextColor = KColors.OnPrimaryContainer,
    unselectedIconColor = KColors.OnSurfaceVariant,
    unselectedTextColor = KColors.OnSurfaceVariant
)`,
    notes: 'Null values fall back to Material 3 default colors. All color strings support hex and theme references.',
    seeAlso: ['kIconButtonColors', 'KColors', 'KScaffoldDefaults'],
  },

  kIconButtonColors: {
    name: 'kIconButtonColors',
    kind: 'top-level function',
    module: 'util',
    subpackage: 'helpers',
    category: 'Util',
    subcategory: 'Color Configuration Builder',
    description: 'DSL builder for creating a KIconButtonColors descriptor to customize icon button colors for enabled and disabled states.',
    android: {
      packageName: 'com.developerstring.ketoy.util',
      annotations: [],
      imports: [
        'import com.developerstring.ketoy.model.KIconButtonColors',
      ],
      sourceCode: `fun kIconButtonColors(
    containerColor: String? = null,
    contentColor: String? = null,
    disabledContainerColor: String? = null,
    disabledContentColor: String? = null
): KIconButtonColors = KIconButtonColors(
    containerColor, contentColor,
    disabledContainerColor, disabledContentColor
)`,
    },
    properties: [
      { name: 'containerColor', type: 'String?', default: 'null', description: 'Container color when enabled.' },
      { name: 'contentColor', type: 'String?', default: 'null', description: 'Content (icon) color when enabled.' },
      { name: 'disabledContainerColor', type: 'String?', default: 'null', description: 'Container color when disabled.' },
      { name: 'disabledContentColor', type: 'String?', default: 'null', description: 'Content (icon) color when disabled.' },
    ],
    usage: `val colors = kIconButtonColors(
    containerColor = KColors.Primary,
    contentColor = KColors.OnPrimary,
    disabledContainerColor = KColors.withAlpha(KColors.OnSurface, 0.12f),
    disabledContentColor = KColors.withAlpha(KColors.OnSurface, 0.38f)
)`,
    notes: 'Null values fall back to Material 3 default colors.',
    seeAlso: ['kIcon', 'kIconButton', 'kNavigationDrawerItemColors', 'KColors'],
  },

  kImageRes: {
    name: 'kImageRes',
    kind: 'top-level function',
    module: 'util',
    subpackage: 'helpers',
    category: 'Util',
    subcategory: 'Image Source Helper',
    description: 'Helper function to create a drawable resource image source reference.',
    android: {
      packageName: 'com.developerstring.ketoy.util',
      annotations: [],
      imports: [
        'import com.developerstring.ketoy.model.KResImageSource',
      ],
      sourceCode: `fun kImageRes(resName: String): KResImageSource = KResImageSource(resName)`,
    },
    properties: [
      { name: 'resName', type: 'String', default: '—', description: 'Drawable resource name (without extension or prefix).' },
    ],
    usage: `val source = kImageRes("ic_logo")
image(source = source)`,
    notes: 'The resource must exist in the app\'s drawable resources. Referenced by name, not R.drawable ID.',
    seeAlso: ['kImageUrl', 'kImageBase64', 'kImageIcon'],
  },

  kImageUrl: {
    name: 'kImageUrl',
    kind: 'top-level function',
    module: 'util',
    subpackage: 'helpers',
    category: 'Util',
    subcategory: 'Image Source Helper',
    description: 'Helper function to create a URL-based image source reference. The image is loaded asynchronously at render time.',
    android: {
      packageName: 'com.developerstring.ketoy.util',
      annotations: [],
      imports: [
        'import com.developerstring.ketoy.model.KUrlImageSource',
      ],
      sourceCode: `fun kImageUrl(url: String): KUrlImageSource = KUrlImageSource(url)`,
    },
    properties: [
      { name: 'url', type: 'String', default: '—', description: 'Full URL of the image to load.' },
    ],
    usage: `val source = kImageUrl("https://example.com/avatar.png")
image(source = source)`,
    notes: 'Requires internet permission. Images are loaded via Coil by default.',
    seeAlso: ['kImageRes', 'kImageBase64', 'kImageIcon'],
  },

  kImageBase64: {
    name: 'kImageBase64',
    kind: 'top-level function',
    module: 'util',
    subpackage: 'helpers',
    category: 'Util',
    subcategory: 'Image Source Helper',
    description: 'Helper function to create a Base64-encoded image source. Useful for inline images in JSON payloads.',
    android: {
      packageName: 'com.developerstring.ketoy.util',
      annotations: [],
      imports: [
        'import com.developerstring.ketoy.model.KBase64ImageSource',
      ],
      sourceCode: `fun kImageBase64(base64: String): KBase64ImageSource = KBase64ImageSource(base64)`,
    },
    properties: [
      { name: 'base64', type: 'String', default: '—', description: 'Base64-encoded image data string.' },
    ],
    usage: `val source = kImageBase64("iVBORw0KGgoAAAANSUhEUgAA...")
image(source = source)`,
    notes: 'Large Base64 strings increase JSON payload size significantly. Prefer kImageUrl for large images.',
    seeAlso: ['kImageRes', 'kImageUrl', 'kImageIcon'],
  },

  kImageIcon: {
    name: 'kImageIcon',
    kind: 'top-level function',
    module: 'util',
    subpackage: 'helpers',
    category: 'Util',
    subcategory: 'Image Source Helper',
    description: 'Helper function to create an icon-based image source using a Material icon name.',
    android: {
      packageName: 'com.developerstring.ketoy.util',
      annotations: [],
      imports: [
        'import com.developerstring.ketoy.model.KIconImageSource',
      ],
      sourceCode: `fun kImageIcon(icon: String): KIconImageSource = KIconImageSource(icon)`,
    },
    properties: [
      { name: 'icon', type: 'String', default: '—', description: 'Material icon name (see KIcons).' },
    ],
    usage: `val source = kImageIcon(KIcons.Home)
image(source = source)`,
    notes: 'Icon names should match constants from KIcons. Resolved via Material Icons at render time.',
    seeAlso: ['kImageRes', 'kImageUrl', 'kImageBase64', 'KIcons'],
  },

  kIcon: {
    name: 'kIcon',
    kind: 'top-level function',
    module: 'util',
    subpackage: 'helpers',
    category: 'Util',
    subcategory: 'Icon Builder',
    description: 'DSL builder for creating a KIconProps descriptor with icon name, style, size, color, and content description.',
    android: {
      packageName: 'com.developerstring.ketoy.util',
      annotations: [],
      imports: [
        'import com.developerstring.ketoy.model.KIconProps',
      ],
      sourceCode: `fun kIcon(
    icon: String,
    style: String? = null,
    size: Int? = null,
    color: String? = null,
    contentDescription: String? = null
): KIconProps = KIconProps(icon, style, size, color, contentDescription)`,
    },
    properties: [
      { name: 'icon', type: 'String', default: '—', description: 'Material icon name (see KIcons).' },
      { name: 'style', type: 'String?', default: 'null', description: 'Icon style (see KIcons.STYLE_* constants).' },
      { name: 'size', type: 'Int?', default: 'null', description: 'Icon size in dp.' },
      { name: 'color', type: 'String?', default: 'null', description: 'Icon tint color (hex or theme reference).' },
      { name: 'contentDescription', type: 'String?', default: 'null', description: 'Accessibility content description.' },
    ],
    usage: `val icon = kIcon(
    icon = KIcons.Favorite,
    style = KIcons.STYLE_FILLED,
    size = 24,
    color = KColors.Red,
    contentDescription = "Favorite"
)`,
    notes: 'If style is null, defaults to KIcons.STYLE_FILLED.',
    seeAlso: ['kIconButton', 'KIcons', 'KIconRef', 'resolveIcon'],
  },

  kIconButton: {
    name: 'kIconButton',
    kind: 'top-level function',
    module: 'util',
    subpackage: 'helpers',
    category: 'Util',
    subcategory: 'Icon Builder',
    description: 'DSL builder for creating a KIconButtonProps descriptor combining an icon with button behavior and color configuration.',
    android: {
      packageName: 'com.developerstring.ketoy.util',
      annotations: [],
      imports: [
        'import com.developerstring.ketoy.model.KIconButtonProps',
      ],
      sourceCode: `fun kIconButton(
    icon: String,
    onClick: String? = null,
    enabled: Boolean? = null,
    iconSize: Int? = null,
    iconColor: String? = null,
    containerColor: String? = null,
    contentColor: String? = null
): KIconButtonProps = KIconButtonProps(
    icon, onClick, enabled, iconSize, iconColor,
    containerColor, contentColor
)`,
    },
    properties: [
      { name: 'icon', type: 'String', default: '—', description: 'Material icon name.' },
      { name: 'onClick', type: 'String?', default: 'null', description: 'Action ID to invoke on click (from ActionRegistry).' },
      { name: 'enabled', type: 'Boolean?', default: 'null', description: 'Whether the button is enabled.' },
      { name: 'iconSize', type: 'Int?', default: 'null', description: 'Icon size in dp.' },
      { name: 'iconColor', type: 'String?', default: 'null', description: 'Icon tint color.' },
      { name: 'containerColor', type: 'String?', default: 'null', description: 'Button container color.' },
      { name: 'contentColor', type: 'String?', default: 'null', description: 'Button content color.' },
    ],
    usage: `val actionId = ActionRegistry.register { navigateBack() }

val btn = kIconButton(
    icon = KIcons.ArrowBack,
    onClick = actionId,
    iconSize = 24,
    iconColor = KColors.OnSurface
)`,
    notes: 'When enabled is null, defaults to true. onClick should be an action ID registered in ActionRegistry.',
    seeAlso: ['kIcon', 'kIconButtonColors', 'KIcons', 'ActionRegistry'],
  },

  /* ══════════════════════════════════════════════
     SUBPACKAGE: icons
     ══════════════════════════════════════════════ */

  KIcons: {
    name: 'KIcons',
    kind: 'object',
    module: 'util',
    subpackage: 'icons',
    category: 'Util',
    subcategory: 'Icon Constants',
    description: 'Massive singleton object containing 100+ Material icon name constants organized by category, style variant constants (Filled, Outlined, Rounded, Sharp, TwoTone), and inner objects that return KIconRef instances via property access (e.g. KIcons.Outlined.Home). Also provides a factory method to create icon references by name and style.',
    android: {
      packageName: 'com.developerstring.ketoy.util',
      annotations: [],
      imports: [],
      sourceCode: `object KIcons {
    // ── Style constants ──
    const val STYLE_FILLED = "filled"
    const val STYLE_OUTLINED = "outlined"
    const val STYLE_ROUNDED = "rounded"
    const val STYLE_SHARP = "sharp"
    const val STYLE_TWO_TONE = "twotone"

    // ── Navigation ──
    const val Home = "Home"
    const val Search = "Search"
    const val Settings = "Settings"
    const val Menu = "Menu"
    const val Close = "Close"
    const val ArrowBack = "ArrowBack"
    const val ArrowForward = "ArrowForward"
    const val MoreVert = "MoreVert"
    const val MoreHoriz = "MoreHoriz"
    const val ExpandMore = "ExpandMore"
    const val ExpandLess = "ExpandLess"
    const val ChevronLeft = "ChevronLeft"
    const val ChevronRight = "ChevronRight"

    // ── Content ──
    const val Favorite = "Favorite"
    const val FavoriteBorder = "FavoriteBorder"
    const val Star = "Star"
    const val StarBorder = "StarBorder"
    const val ThumbUp = "ThumbUp"
    const val Bookmark = "Bookmark"
    const val BookmarkBorder = "BookmarkBorder"

    // ── Communication ──
    const val Email = "Email"
    const val Call = "Call"
    const val Chat = "Chat"
    const val Send = "Send"
    const val Notifications = "Notifications"

    // ── People ──
    const val Person = "Person"
    const val PersonAdd = "PersonAdd"
    const val People = "People"
    const val AccountCircle = "AccountCircle"

    // ── Media ──
    const val PlayArrow = "PlayArrow"
    const val Pause = "Pause"
    const val Stop = "Stop"
    const val SkipNext = "SkipNext"
    const val SkipPrevious = "SkipPrevious"
    // ... 60+ more icon constants omitted for brevity

    fun of(name: String, style: String = STYLE_FILLED) = KIconRef(name, style)

    /** Filled-style icon references via property access: KIcons.Filled.Home */
    object Filled {
        val Home get() = KIconRef(KIcons.Home, STYLE_FILLED)
        val Search get() = KIconRef(KIcons.Search, STYLE_FILLED)
        val Settings get() = KIconRef(KIcons.Settings, STYLE_FILLED)
        val Favorite get() = KIconRef(KIcons.Favorite, STYLE_FILLED)
        // ... all icon constants available as properties
    }

    /** Outlined-style icon references via property access: KIcons.Outlined.Home */
    object Outlined {
        val Home get() = KIconRef(KIcons.Home, STYLE_OUTLINED)
        val Search get() = KIconRef(KIcons.Search, STYLE_OUTLINED)
        val Settings get() = KIconRef(KIcons.Settings, STYLE_OUTLINED)
        val Favorite get() = KIconRef(KIcons.Favorite, STYLE_OUTLINED)
        // ... all icon constants available as properties
    }

    /** Rounded-style icon references: KIcons.Rounded.Home */
    object Rounded { /* same properties */ }

    /** Sharp-style icon references: KIcons.Sharp.Home */
    object Sharp { /* same properties */ }

    /** TwoTone-style icon references: KIcons.TwoTone.Home */
    object TwoTone { /* same properties */ }
}`,
    },
    properties: [
      { name: 'STYLE_FILLED', type: 'String', default: '"filled"', description: 'Filled icon style constant.' },
      { name: 'STYLE_OUTLINED', type: 'String', default: '"outlined"', description: 'Outlined icon style constant.' },
      { name: 'STYLE_ROUNDED', type: 'String', default: '"rounded"', description: 'Rounded icon style constant.' },
      { name: 'STYLE_SHARP', type: 'String', default: '"sharp"', description: 'Sharp icon style constant.' },
      { name: 'STYLE_TWO_TONE', type: 'String', default: '"twotone"', description: 'Two-tone icon style constant.' },
      { name: 'Home', type: 'String', default: '"Home"', description: 'Navigation: Home icon.' },
      { name: 'Search', type: 'String', default: '"Search"', description: 'Navigation: Search icon.' },
      { name: 'Settings', type: 'String', default: '"Settings"', description: 'Navigation: Settings icon.' },
      { name: 'Menu', type: 'String', default: '"Menu"', description: 'Navigation: Menu (hamburger) icon.' },
      { name: 'Close', type: 'String', default: '"Close"', description: 'Navigation: Close icon.' },
      { name: 'Favorite', type: 'String', default: '"Favorite"', description: 'Content: Filled favorite icon.' },
      { name: 'Star', type: 'String', default: '"Star"', description: 'Content: Filled star icon.' },
      { name: 'Email', type: 'String', default: '"Email"', description: 'Communication: Email icon.' },
      { name: 'Person', type: 'String', default: '"Person"', description: 'People: Person icon.' },
      { name: 'PlayArrow', type: 'String', default: '"PlayArrow"', description: 'Media: Play arrow icon.' },
    ],
    methods: [
      { name: 'of(name: String, style: String)', returns: 'KIconRef', description: 'Create a KIconRef with the given icon name and style. Defaults to STYLE_FILLED.' },
    ],
    innerClasses: [
      { name: 'Filled', description: 'Inner object providing filled-style KIconRef properties. Access via KIcons.Filled.Home, KIcons.Filled.Settings, etc.' },
      { name: 'Outlined', description: 'Inner object providing outlined-style KIconRef properties. Access via KIcons.Outlined.Home, KIcons.Outlined.Search, etc.' },
      { name: 'Rounded', description: 'Inner object providing rounded-style KIconRef properties. Access via KIcons.Rounded.Home, etc.' },
      { name: 'Sharp', description: 'Inner object providing sharp-style KIconRef properties. Access via KIcons.Sharp.Home, etc.' },
      { name: 'TwoTone', description: 'Inner object providing two-tone-style KIconRef properties. Access via KIcons.TwoTone.Home, etc.' },
    ],
    usage: `// Use a string constant directly (defaults to Filled style)
icon(KIcons.Home)

// Style-qualified via inline property access (returns KIconRef)
icon(KIcons.Outlined.Home)
icon(KIcons.Filled.Settings)
icon(KIcons.Rounded.Favorite)
icon(KIcons.Sharp.Delete)

// Create a styled reference with the factory method
val ref = KIcons.of(KIcons.Favorite, KIcons.STYLE_OUTLINED)

// With the kIcon builder
val iconProps = kIcon(
    icon = KIcons.Star,
    style = KIcons.STYLE_ROUNDED,
    size = 32,
    color = KColors.Primary
)`,
    notes: 'Contains 100+ icon constants organized by category (Navigation, Content, Communication, People, Media, Action, Alert, AV, Device, Editor, File, Hardware, Image, Maps, Social, Toggle, Places, etc.). Only a representative subset is shown in the source code above.',
    seeAlso: ['KIconRef', 'resolveIcon', 'kIcon', 'kIconButton'],
  },

  KIconRef: {
    name: 'KIconRef',
    kind: 'data class',
    module: 'util',
    subpackage: 'icons',
    category: 'Util',
    subcategory: 'Icon Reference',
    description: 'Lightweight data class holding a Material icon name and its style variant. Used as the return type of KIcons factory methods.',
    android: {
      packageName: 'com.developerstring.ketoy.util',
      annotations: [],
      imports: [],
      sourceCode: `data class KIconRef(
    val name: String,
    val style: String
)`,
    },
    properties: [
      { name: 'name', type: 'String', default: '—', description: 'The Material icon name (e.g. "Home", "Favorite").' },
      { name: 'style', type: 'String', default: '—', description: 'The icon style variant (e.g. "filled", "outlined").' },
    ],
    usage: `val ref = KIconRef("Home", KIcons.STYLE_OUTLINED)

// Or via factory
val ref = KIcons.of("Home", KIcons.STYLE_OUTLINED)

// Resolve to ImageVector
val imageVector = resolveIcon(ref)`,
    notes: 'This is a simple data class with no behavior. Use resolveIcon() to convert to a Compose ImageVector.',
    seeAlso: ['KIcons', 'resolveIcon', 'kIcon'],
  },

  resolveIcon: {
    name: 'resolveIcon',
    kind: 'top-level function',
    module: 'util',
    subpackage: 'icons',
    category: 'Util',
    subcategory: 'Icon Resolution',
    description: 'Resolves a Material icon name and style to a Compose ImageVector. Provides two overloads: one accepting separate name + style strings, and one accepting a KIconRef.',
    android: {
      packageName: 'com.developerstring.ketoy.util',
      annotations: [],
      imports: [
        'import androidx.compose.ui.graphics.vector.ImageVector',
        'import androidx.compose.material.icons.Icons',
      ],
      sourceCode: `fun resolveIcon(
    name: String,
    style: String = KIcons.STYLE_FILLED
): ImageVector? {
    // Reflection-based lookup into Icons.Filled / Outlined / Rounded / Sharp / TwoTone
    val styleObj = when (style) {
        KIcons.STYLE_FILLED -> Icons.Filled
        KIcons.STYLE_OUTLINED -> Icons.Outlined
        KIcons.STYLE_ROUNDED -> Icons.Rounded
        KIcons.STYLE_SHARP -> Icons.Sharp
        KIcons.STYLE_TWO_TONE -> Icons.TwoTone
        else -> Icons.Filled
    }
    return try {
        styleObj::class.members
            .filterIsInstance<kotlin.reflect.KProperty1<Any, *>>()
            .firstOrNull { it.name == name }
            ?.get(styleObj) as? ImageVector
    } catch (_: Exception) { null }
}

fun resolveIcon(ref: KIconRef): ImageVector? =
    resolveIcon(ref.name, ref.style)`,
    },
    properties: [
      { name: 'name', type: 'String', default: '—', description: 'Material icon name to resolve.' },
      { name: 'style', type: 'String', default: 'KIcons.STYLE_FILLED', description: 'Icon style variant.' },
      { name: 'ref', type: 'KIconRef', default: '—', description: 'Icon reference (overload accepting KIconRef).' },
    ],
    usage: `// Resolve by name and style
val vector: ImageVector? = resolveIcon("Home", KIcons.STYLE_OUTLINED)

// Resolve by KIconRef
val ref = KIcons.of("Favorite", KIcons.STYLE_ROUNDED)
val vector: ImageVector? = resolveIcon(ref)

// Use in Compose
vector?.let { Icon(imageVector = it, contentDescription = "Home") }`,
    notes: 'Uses reflection to look up icons from the Material Icons library. Returns null if the icon name is not found in the specified style object. Performance is acceptable for occasional use but avoid calling in tight loops.',
    seeAlso: ['KIcons', 'KIconRef', 'kIcon'],
  },

  /* ══════════════════════════════════════════════
     SUBPACKAGE: shapes
     ══════════════════════════════════════════════ */

  KShapes: {
    name: 'KShapes',
    kind: 'object',
    module: 'util',
    subpackage: 'shapes',
    category: 'Util',
    subcategory: 'Shape Descriptors',
    description: 'Singleton object providing shape descriptor constants and factory methods. Shape strings are serialized to JSON and resolved to Compose Shape instances at render time.',
    android: {
      packageName: 'com.developerstring.ketoy.util',
      annotations: [],
      imports: [],
      sourceCode: `object KShapes {
    fun rounded(radius: Int) = "rounded_$radius"
    fun rounded(
        topStart: Int = 0,
        topEnd: Int = 0,
        bottomEnd: Int = 0,
        bottomStart: Int = 0
    ) = "rounded_corners_\${topStart}_\${topEnd}_\${bottomEnd}_\${bottomStart}"
    fun circle() = "circle"
    fun rectangle() = "rectangle"
    fun clip() = "clip"

    const val Rectangle = "rectangle"
    const val Circle = "circle"
    const val Clip = "clip"
    const val Rounded4 = "rounded_4"
    const val Rounded8 = "rounded_8"
    const val Rounded12 = "rounded_12"
    const val Rounded16 = "rounded_16"
    const val Rounded20 = "rounded_20"
    const val Rounded24 = "rounded_24"
    const val Rounded28 = "rounded_28"
    const val Rounded32 = "rounded_32"
}`,
    },
    properties: [
      { name: 'Rectangle', type: 'String', default: '"rectangle"', description: 'Rectangular shape with no rounding.' },
      { name: 'Circle', type: 'String', default: '"circle"', description: 'Fully circular shape.' },
      { name: 'Clip', type: 'String', default: '"clip"', description: 'Clip shape (clips content to bounds).' },
      { name: 'Rounded4', type: 'String', default: '"rounded_4"', description: 'Rounded corners with 4dp radius.' },
      { name: 'Rounded8', type: 'String', default: '"rounded_8"', description: 'Rounded corners with 8dp radius.' },
      { name: 'Rounded12', type: 'String', default: '"rounded_12"', description: 'Rounded corners with 12dp radius.' },
      { name: 'Rounded16', type: 'String', default: '"rounded_16"', description: 'Rounded corners with 16dp radius.' },
      { name: 'Rounded20', type: 'String', default: '"rounded_20"', description: 'Rounded corners with 20dp radius.' },
      { name: 'Rounded24', type: 'String', default: '"rounded_24"', description: 'Rounded corners with 24dp radius.' },
      { name: 'Rounded28', type: 'String', default: '"rounded_28"', description: 'Rounded corners with 28dp radius.' },
      { name: 'Rounded32', type: 'String', default: '"rounded_32"', description: 'Rounded corners with 32dp radius.' },
    ],
    methods: [
      { name: 'rounded(radius: Int)', returns: 'String', description: 'Create a uniform rounded-corner shape descriptor with custom radius.' },
      { name: 'rounded(topStart: Int, topEnd: Int, bottomEnd: Int, bottomStart: Int)', returns: 'String', description: 'Create a rounded-corner shape descriptor with individual corner radii.' },
      { name: 'circle()', returns: 'String', description: 'Create a circle shape descriptor.' },
      { name: 'rectangle()', returns: 'String', description: 'Create a rectangle shape descriptor.' },
      { name: 'clip()', returns: 'String', description: 'Create a clip shape descriptor.' },
    ],
    usage: `// Use a preset constant
box(shape = KShapes.Rounded12)

// Custom uniform radius
box(shape = KShapes.rounded(10))

// Per-corner radius
box(shape = KShapes.rounded(
    topStart = 16, topEnd = 16,
    bottomEnd = 0, bottomStart = 0
))

// Circle
image(shape = KShapes.Circle)

// In modifier
text("Hello", modifier = kModifier(
    shape = KShapes.Rounded8,
    background = KColors.Surface
))`,
    notes: 'Shape strings follow the format "rounded_N" for uniform and "rounded_corners_TL_TR_BR_BL" for per-corner. The renderer parses these strings into Compose RoundedCornerShape instances.',
    seeAlso: ['kRounded', 'kCircle', 'kRectangle', 'kModifier', 'kBorder', 'kShadow'],
  },

  kRounded: {
    name: 'kRounded',
    kind: 'top-level function',
    module: 'util',
    subpackage: 'shapes',
    category: 'Util',
    subcategory: 'Shape Shorthand',
    description: 'Top-level shorthand functions for creating rounded shape descriptors. Two overloads: uniform radius and per-corner radius.',
    android: {
      packageName: 'com.developerstring.ketoy.util',
      annotations: [],
      imports: [],
      sourceCode: `fun kRounded(radius: Int): String = KShapes.rounded(radius)

fun kRounded(
    topStart: Int = 0,
    topEnd: Int = 0,
    bottomEnd: Int = 0,
    bottomStart: Int = 0
): String = KShapes.rounded(topStart, topEnd, bottomEnd, bottomStart)`,
    },
    properties: [
      { name: 'radius', type: 'Int', default: '—', description: 'Uniform corner radius in dp (single-param overload).' },
      { name: 'topStart', type: 'Int', default: '0', description: 'Top-start corner radius in dp.' },
      { name: 'topEnd', type: 'Int', default: '0', description: 'Top-end corner radius in dp.' },
      { name: 'bottomEnd', type: 'Int', default: '0', description: 'Bottom-end corner radius in dp.' },
      { name: 'bottomStart', type: 'Int', default: '0', description: 'Bottom-start corner radius in dp.' },
    ],
    usage: `// Uniform radius
val shape = kRounded(12)  // "rounded_12"

// Per-corner radius
val shape = kRounded(
    topStart = 16, topEnd = 16,
    bottomEnd = 0, bottomStart = 0
)  // "rounded_corners_16_16_0_0"`,
    notes: 'Delegates to KShapes.rounded(). Provided as a top-level convenience for cleaner DSL code.',
    seeAlso: ['KShapes', 'kCircle', 'kRectangle'],
  },

  kCircle: {
    name: 'kCircle',
    kind: 'top-level function',
    module: 'util',
    subpackage: 'shapes',
    category: 'Util',
    subcategory: 'Shape Shorthand',
    description: 'Top-level shorthand function that returns the circle shape descriptor string.',
    android: {
      packageName: 'com.developerstring.ketoy.util',
      annotations: [],
      imports: [],
      sourceCode: `fun kCircle(): String = "circle"`,
    },
    properties: [],
    usage: `val shape = kCircle()  // "circle"
image(shape = shape)`,
    notes: 'Equivalent to KShapes.Circle or KShapes.circle().',
    seeAlso: ['KShapes', 'kRounded', 'kRectangle'],
  },

  kRectangle: {
    name: 'kRectangle',
    kind: 'top-level function',
    module: 'util',
    subpackage: 'shapes',
    category: 'Util',
    subcategory: 'Shape Shorthand',
    description: 'Top-level shorthand function that returns the rectangle shape descriptor string.',
    android: {
      packageName: 'com.developerstring.ketoy.util',
      annotations: [],
      imports: [],
      sourceCode: `fun kRectangle(): String = "rectangle"`,
    },
    properties: [],
    usage: `val shape = kRectangle()  // "rectangle"
box(shape = shape)`,
    notes: 'Equivalent to KShapes.Rectangle or KShapes.rectangle().',
    seeAlso: ['KShapes', 'kRounded', 'kCircle'],
  },

}

export default utilData
