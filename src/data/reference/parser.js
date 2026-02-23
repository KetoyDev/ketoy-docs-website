/**
 * Ketoy SDK – Parser Module
 * Package: com.developerstring.ketoy.parser
 *
 * Top-level Kotlin functions that convert JSON descriptors into Jetpack Compose
 * types (Modifier, Arrangement, Alignment, Brush, Shape, TextStyle, KeyboardOptions,
 * TextFieldColors, WindowInsets, TopAppBarColors, etc.).
 */

const parserData = {

  /* ══════════════════════════════════════════════════════════════════
   *  Parser > Arrangement
   * ══════════════════════════════════════════════════════════════════ */

  parseVerticalArrangement: {
    name: 'parseVerticalArrangement',
    kind: 'function',
    module: 'parser',
    subpackage: 'arrangement',
    category: 'Parser',
    subcategory: 'Arrangement',
    description: 'Parses the "verticalArrangement" property from a component JsonObject into a Compose Arrangement.Vertical. Accepts both string shorthand ("center", "spaceBetween", "spacedBy_8") and structured JSON objects ({ "type": "spacedBy", "spacing": 8 }).',
    android: {
      packageName: 'com.developerstring.ketoy.parser',
      annotations: [],
      imports: [
        'import androidx.compose.foundation.layout.Arrangement',
        'import kotlinx.serialization.json.JsonObject',
        'import kotlinx.serialization.json.JsonPrimitive',
      ],
      sourceCode: `fun parseVerticalArrangement(props: JsonObject): Arrangement.Vertical {
    val arrangement = props["verticalArrangement"] ?: return Arrangement.Top

    return when (arrangement) {
        is JsonPrimitive -> {
            when (arrangement.content) {
                "center", "centerVertically" -> Arrangement.Center
                "spaceBetween" -> Arrangement.SpaceBetween
                "spaceEvenly" -> Arrangement.SpaceEvenly
                "spaceAround" -> Arrangement.SpaceAround
                "start", "top", "Top" -> Arrangement.Top
                "end", "bottom", "Bottom" -> Arrangement.Bottom
                else -> {
                    if (arrangement.content.startsWith("spacedBy_")) {
                        val spacing = arrangement.content
                            .substringAfter("spacedBy_").toIntOrNull() ?: 0
                        Arrangement.spacedBy(spacing.dp)
                    } else Arrangement.Top
                }
            }
        }
        is JsonObject -> {
            val spacingValue =
                arrangement["spacing"]?.jsonPrimitive?.intOrNull ?: 0
            when (arrangement["type"]?.jsonPrimitive?.content) {
                "spacedBy" -> Arrangement.spacedBy(spacingValue.dp)
                "center" -> Arrangement.Center
                "spaceBetween" -> Arrangement.SpaceBetween
                "spaceEvenly" -> Arrangement.SpaceEvenly
                "spaceAround" -> Arrangement.SpaceAround
                "start", "top" -> Arrangement.Top
                "end", "bottom" -> Arrangement.Bottom
                else -> Arrangement.spacedBy(spacingValue.dp)
            }
        }
        else -> Arrangement.Top
    }
}`,
    },
    properties: [
      { name: 'props', type: 'JsonObject', default: '—', description: 'The component\'s top-level JsonObject containing a "verticalArrangement" key.' },
    ],
    methods: [],
    usage: `// JSON input – string shorthand
{ "type": "Column", "verticalArrangement": "spaceBetween" }

// JSON input – structured object
{ "type": "Column", "verticalArrangement": { "type": "spacedBy", "spacing": 8 } }

// Kotlin usage
val arrangement = parseVerticalArrangement(props) // Arrangement.SpaceBetween`,
    notes: 'Returns Arrangement.Top when the key is absent or the value is unrecognised. The "spacedBy_<dp>" format allows compact spacing definitions in JSON strings.',
    seeAlso: ['parseHorizontalArrangement', 'parseHorizontalAlignment', 'parseVerticalAlignment', 'parseContentAlignment'],
  },

  parseHorizontalArrangement: {
    name: 'parseHorizontalArrangement',
    kind: 'function',
    module: 'parser',
    subpackage: 'arrangement',
    category: 'Parser',
    subcategory: 'Arrangement',
    description: 'Parses the "horizontalArrangement" property from a component JsonObject into a Compose Arrangement.Horizontal. Accepts both string shorthand and structured JSON objects, with horizontal-axis names ("start", "end", "center", "spacedBy_<dp>").',
    android: {
      packageName: 'com.developerstring.ketoy.parser',
      annotations: [],
      imports: [
        'import androidx.compose.foundation.layout.Arrangement',
        'import kotlinx.serialization.json.JsonObject',
        'import kotlinx.serialization.json.JsonPrimitive',
      ],
      sourceCode: `fun parseHorizontalArrangement(props: JsonObject): Arrangement.Horizontal {
    val arrangement = props["horizontalArrangement"] ?: return Arrangement.Start

    return when (arrangement) {
        is JsonPrimitive -> {
            when (arrangement.content) {
                "center", "centerHorizontally" -> Arrangement.Center
                "spaceBetween" -> Arrangement.SpaceBetween
                "spaceEvenly" -> Arrangement.SpaceEvenly
                "spaceAround" -> Arrangement.SpaceAround
                "start" -> Arrangement.Start
                "end" -> Arrangement.End
                else -> {
                    if (arrangement.content.startsWith("spacedBy_")) {
                        val spacing = arrangement.content
                            .substringAfter("spacedBy_").toIntOrNull() ?: 0
                        Arrangement.spacedBy(spacing.dp)
                    } else Arrangement.Start
                }
            }
        }
        is JsonObject -> {
            val spacingValue =
                arrangement["spacing"]?.jsonPrimitive?.intOrNull ?: 0
            when (arrangement["type"]?.jsonPrimitive?.content) {
                "spacedBy" -> Arrangement.spacedBy(spacingValue.dp)
                "center" -> Arrangement.Center
                "spaceBetween" -> Arrangement.SpaceBetween
                "spaceEvenly" -> Arrangement.SpaceEvenly
                "spaceAround" -> Arrangement.SpaceAround
                "start" -> Arrangement.Start
                "end" -> Arrangement.End
                else -> Arrangement.spacedBy(spacingValue.dp)
            }
        }
        else -> Arrangement.Start
    }
}`,
    },
    properties: [
      { name: 'props', type: 'JsonObject', default: '—', description: 'The component\'s top-level JsonObject containing a "horizontalArrangement" key.' },
    ],
    methods: [],
    usage: `// JSON input
{ "type": "Row", "horizontalArrangement": "spaceBetween" }

// Structured format
{ "type": "Row", "horizontalArrangement": { "type": "spacedBy", "spacing": 12 } }

// Kotlin
val arrangement = parseHorizontalArrangement(props) // Arrangement.SpaceBetween`,
    notes: 'Returns Arrangement.Start when the key is absent or the value is unrecognised. Same value format as parseVerticalArrangement but uses horizontal-axis defaults.',
    seeAlso: ['parseVerticalArrangement', 'parseHorizontalAlignment', 'parseVerticalAlignment'],
  },

  parseHorizontalAlignment: {
    name: 'parseHorizontalAlignment',
    kind: 'function',
    module: 'parser',
    subpackage: 'arrangement',
    category: 'Parser',
    subcategory: 'Arrangement',
    description: 'Parses the "horizontalAlignment" property into a Compose Alignment.Horizontal. Used by Column components to control the horizontal alignment of children.',
    android: {
      packageName: 'com.developerstring.ketoy.parser',
      annotations: [],
      imports: [
        'import androidx.compose.ui.Alignment',
        'import kotlinx.serialization.json.JsonObject',
      ],
      sourceCode: `fun parseHorizontalAlignment(props: JsonObject): Alignment.Horizontal {
    return when (props["horizontalAlignment"]?.jsonPrimitive?.content) {
        "center", "centerHorizontally" -> Alignment.CenterHorizontally
        "start" -> Alignment.Start
        "end" -> Alignment.End
        else -> Alignment.Start
    }
}`,
    },
    properties: [
      { name: 'props', type: 'JsonObject', default: '—', description: 'The component\'s top-level JsonObject containing a "horizontalAlignment" key.' },
    ],
    methods: [],
    usage: `// JSON
{ "type": "Column", "horizontalAlignment": "center" }

// Kotlin
val alignment = parseHorizontalAlignment(props) // Alignment.CenterHorizontally`,
    notes: 'Recognised values: "center" / "centerHorizontally", "start", "end". Defaults to Alignment.Start.',
    seeAlso: ['parseVerticalAlignment', 'parseContentAlignment', 'parseVerticalArrangement'],
  },

  parseVerticalAlignment: {
    name: 'parseVerticalAlignment',
    kind: 'function',
    module: 'parser',
    subpackage: 'arrangement',
    category: 'Parser',
    subcategory: 'Arrangement',
    description: 'Parses the "verticalAlignment" property into a Compose Alignment.Vertical. Used by Row components to control the vertical alignment of children.',
    android: {
      packageName: 'com.developerstring.ketoy.parser',
      annotations: [],
      imports: [
        'import androidx.compose.ui.Alignment',
        'import kotlinx.serialization.json.JsonObject',
      ],
      sourceCode: `fun parseVerticalAlignment(props: JsonObject): Alignment.Vertical {
    return when (props["verticalAlignment"]?.jsonPrimitive?.content) {
        "center", "centerVertically" -> Alignment.CenterVertically
        "top" -> Alignment.Top
        "bottom" -> Alignment.Bottom
        else -> Alignment.Top
    }
}`,
    },
    properties: [
      { name: 'props', type: 'JsonObject', default: '—', description: 'The component\'s top-level JsonObject containing a "verticalAlignment" key.' },
    ],
    methods: [],
    usage: `// JSON
{ "type": "Row", "verticalAlignment": "center" }

// Kotlin
val alignment = parseVerticalAlignment(props) // Alignment.CenterVertically`,
    notes: 'Recognised values: "center" / "centerVertically", "top", "bottom". Defaults to Alignment.Top.',
    seeAlso: ['parseHorizontalAlignment', 'parseContentAlignment', 'parseHorizontalArrangement'],
  },

  parseContentAlignment: {
    name: 'parseContentAlignment',
    kind: 'function',
    module: 'parser',
    subpackage: 'arrangement',
    category: 'Parser',
    subcategory: 'Arrangement',
    description: 'Parses the "contentAlignment" property into a two-dimensional Alignment suitable for Box composables. Delegates to parseContentAlignmentFromString for the actual resolution.',
    android: {
      packageName: 'com.developerstring.ketoy.parser',
      annotations: [],
      imports: [
        'import androidx.compose.ui.Alignment',
        'import kotlinx.serialization.json.JsonObject',
      ],
      sourceCode: `fun parseContentAlignment(props: JsonObject): Alignment {
    return parseContentAlignmentFromString(
        props["contentAlignment"]?.jsonPrimitive?.content ?: ""
    )
}`,
    },
    properties: [
      { name: 'props', type: 'JsonObject', default: '—', description: 'The component\'s top-level JsonObject containing a "contentAlignment" key.' },
    ],
    methods: [],
    usage: `// JSON
{ "type": "Box", "contentAlignment": "center" }

// Kotlin
val alignment = parseContentAlignment(props) // Alignment.Center`,
    notes: 'Defaults to Alignment.TopStart. Supports 9 named positions plus shorthand aliases ("top", "bottom", "start", "end").',
    seeAlso: ['parseContentAlignmentFromString', 'parseHorizontalAlignment', 'parseVerticalAlignment'],
  },

  parseContentAlignmentFromString: {
    name: 'parseContentAlignmentFromString',
    kind: 'function',
    module: 'parser',
    subpackage: 'arrangement',
    category: 'Parser',
    subcategory: 'Arrangement',
    description: 'Resolves a raw alignment string into a two-dimensional Compose Alignment. Supports all 9 named positions (topStart, topCenter, topEnd, centerStart, center, centerEnd, bottomStart, bottomCenter, bottomEnd) plus convenient shorthand aliases.',
    android: {
      packageName: 'com.developerstring.ketoy.parser',
      annotations: [],
      imports: [
        'import androidx.compose.ui.Alignment',
      ],
      sourceCode: `fun parseContentAlignmentFromString(alignment: String): Alignment {
    return when (alignment) {
        "center" -> Alignment.Center
        "topStart" -> Alignment.TopStart
        "topCenter" -> Alignment.TopCenter
        "topEnd" -> Alignment.TopEnd
        "centerStart" -> Alignment.CenterStart
        "centerEnd" -> Alignment.CenterEnd
        "bottomStart" -> Alignment.BottomStart
        "bottomCenter" -> Alignment.BottomCenter
        "bottomEnd" -> Alignment.BottomEnd
        "top" -> Alignment.TopCenter
        "bottom" -> Alignment.BottomCenter
        "start" -> Alignment.CenterStart
        "end" -> Alignment.CenterEnd
        else -> Alignment.TopStart
    }
}`,
    },
    properties: [
      { name: 'alignment', type: 'String', default: '—', description: 'The alignment string from the JSON payload (e.g. "center", "topStart", "bottomEnd").' },
    ],
    methods: [],
    usage: `val alignment = parseContentAlignmentFromString("center")      // Alignment.Center
val topLeft   = parseContentAlignmentFromString("topStart")    // Alignment.TopStart
val shorthand = parseContentAlignmentFromString("bottom")      // Alignment.BottomCenter`,
    notes: 'Shorthand aliases: "top" → TopCenter, "bottom" → BottomCenter, "start" → CenterStart, "end" → CenterEnd. Defaults to Alignment.TopStart for unknown strings.',
    seeAlso: ['parseContentAlignment', 'parseHorizontalAlignment', 'parseVerticalAlignment'],
  },

  parsePadding: {
    name: 'parsePadding',
    kind: 'function',
    module: 'parser',
    subpackage: 'arrangement',
    category: 'Parser',
    subcategory: 'Arrangement',
    description: 'Converts a JSON element into Compose PaddingValues. Accepts a JsonObject with directional keys (all, horizontal, vertical, top, bottom, start, end).',
    android: {
      packageName: 'com.developerstring.ketoy.parser',
      annotations: [],
      imports: [
        'import androidx.compose.foundation.layout.PaddingValues',
        'import androidx.compose.ui.unit.dp',
        'import kotlinx.serialization.json.JsonElement',
        'import kotlinx.serialization.json.JsonObject',
      ],
      sourceCode: `fun parsePadding(paddingElement: JsonElement): PaddingValues {
    return when (paddingElement) {
        is JsonObject -> {
            val all = paddingElement["all"]?.jsonPrimitive?.intOrNull?.dp
            val horizontal = paddingElement["horizontal"]?.jsonPrimitive?.intOrNull?.dp
            val vertical = paddingElement["vertical"]?.jsonPrimitive?.intOrNull?.dp
            val top = paddingElement["top"]?.jsonPrimitive?.intOrNull?.dp
            val bottom = paddingElement["bottom"]?.jsonPrimitive?.intOrNull?.dp
            val start = paddingElement["start"]?.jsonPrimitive?.intOrNull?.dp
            val end = paddingElement["end"]?.jsonPrimitive?.intOrNull?.dp

            when {
                all != null -> PaddingValues(all)
                horizontal != null || vertical != null -> PaddingValues(
                    horizontal = horizontal ?: 0.dp,
                    vertical = vertical ?: 0.dp
                )
                else -> PaddingValues(
                    top = top ?: 0.dp,
                    bottom = bottom ?: 0.dp,
                    start = start ?: 0.dp,
                    end = end ?: 0.dp
                )
            }
        }
        else -> PaddingValues(0.dp)
    }
}`,
    },
    properties: [
      { name: 'paddingElement', type: 'JsonElement', default: '—', description: 'The raw JsonElement from the component tree. Must be a JsonObject with padding keys.' },
    ],
    methods: [],
    usage: `// Uniform padding
{ "padding": { "all": 16 } }

// Axis-based
{ "padding": { "horizontal": 16, "vertical": 8 } }

// Per-side
{ "padding": { "top": 16, "bottom": 8, "start": 12, "end": 12 } }`,
    notes: 'Priority: "all" > "horizontal"/"vertical" > per-side keys. Returns PaddingValues(0.dp) for non-object inputs.',
    seeAlso: ['parseModifier', 'parseVerticalArrangement', 'parseHorizontalArrangement'],
  },

  /* ══════════════════════════════════════════════════════════════════
   *  Parser > Color
   * ══════════════════════════════════════════════════════════════════ */

  parseColor: {
    name: 'parseColor',
    kind: 'function',
    module: 'parser',
    subpackage: 'color',
    category: 'Parser',
    subcategory: 'Color',
    description: 'Parses a colour string (hex #RRGGBB / #AARRGGBB or named) to a Compose Color. Not composable and does not resolve @theme/ tokens. For theme-aware resolution use resolveKetoyColor.',
    android: {
      packageName: 'com.developerstring.ketoy.parser',
      annotations: [],
      imports: [
        'import androidx.compose.ui.graphics.Color',
      ],
      sourceCode: `fun parseColor(colorString: String?): Color {
    if (colorString == null) return Color.Black
    if (colorString.startsWith("#")) {
        return try {
            Color(android.graphics.Color.parseColor(colorString))
        } catch (_: Exception) {
            Color.Black
        }
    }
    return namedColorOrNull(colorString) ?: Color.Black
}`,
    },
    properties: [
      { name: 'colorString', type: 'String?', default: '—', description: 'A hex string ("#FF0000", "#80FF0000") or a named colour ("red", "blue"), or null.' },
    ],
    methods: [],
    usage: `val red = parseColor("#FF0000")         // Color.Red
val semi = parseColor("#80FF0000")       // Red at 50% alpha
val named = parseColor("blue")           // Color.Blue
val fallback = parseColor(null)          // Color.Black
val unknown = parseColor("fancy")        // Color.Black`,
    notes: 'Recognised named colours: red, blue, green, yellow, white, black, gray, transparent, cyan, magenta, darkgray, lightgray. Falls back to Color.Black for null or unrecognised values.',
    seeAlso: ['parseColorOrNull', 'resolveKetoyColor', 'resolveKetoyColorOrNull'],
  },

  parseColorOrNull: {
    name: 'parseColorOrNull',
    kind: 'function',
    module: 'parser',
    subpackage: 'color',
    category: 'Parser',
    subcategory: 'Color',
    description: 'Same as parseColor but returns null for unknown or absent values instead of a fallback colour. Useful when you need to distinguish between "no colour specified" and "black".',
    android: {
      packageName: 'com.developerstring.ketoy.parser',
      annotations: [],
      imports: [
        'import androidx.compose.ui.graphics.Color',
      ],
      sourceCode: `fun parseColorOrNull(colorString: String?): Color? {
    if (colorString == null) return null
    if (colorString.startsWith("#")) {
        return try {
            Color(android.graphics.Color.parseColor(colorString))
        } catch (_: Exception) { null }
    }
    return namedColorOrNull(colorString)
}`,
    },
    properties: [
      { name: 'colorString', type: 'String?', default: '—', description: 'A hex or named colour string, or null.' },
    ],
    methods: [],
    usage: `val red = parseColorOrNull("#FF0000")    // Color.Red
val nothing = parseColorOrNull(null)     // null
val unknown = parseColorOrNull("fancy")  // null`,
    notes: 'Returns null (not Color.Black) when the input is absent or unrecognised. Used internally by parseModifier for optional colour fields like shadow ambient/spot colours.',
    seeAlso: ['parseColor', 'resolveKetoyColor', 'resolveKetoyColorOrNull'],
  },

  resolveKetoyColor: {
    name: 'resolveKetoyColor',
    kind: '@Composable function',
    module: 'parser',
    subpackage: 'color',
    category: 'Parser',
    subcategory: 'Color',
    description: 'Resolves any colour string — @theme/ tokens, hex, or named colours. Theme tokens (e.g. "@theme/primary") are resolved against the KetoyColorScheme provided by KetoyThemeProvider via LocalKetoyColors. Falls back to parseColor for non-theme strings.',
    android: {
      packageName: 'com.developerstring.ketoy.parser',
      annotations: ['@Composable'],
      imports: [
        'import androidx.compose.runtime.Composable',
        'import androidx.compose.ui.graphics.Color',
        'import com.developerstring.ketoy.theme.LocalKetoyColors',
      ],
      sourceCode: `@Composable
fun resolveKetoyColor(colorString: String?): Color {
    if (colorString == null) return Color.Unspecified
    if (colorString.startsWith("@theme/")) {
        val token = colorString.removePrefix("@theme/")
        return LocalKetoyColors.current.resolve(token) ?: Color.Unspecified
    }
    return parseColor(colorString)
}`,
    },
    properties: [
      { name: 'colorString', type: 'String?', default: '—', description: 'A theme token ("@theme/primary"), hex string ("#FF0000"), named colour ("red"), or null.' },
    ],
    methods: [],
    usage: `// Theme token
resolveKetoyColor("@theme/primary")     // → KetoyColorScheme.primary

// Hex colour
resolveKetoyColor("#FF5722")            // → Color(0xFFFF5722)

// Named colour
resolveKetoyColor("red")               // → Color.Red

// Null
resolveKetoyColor(null)                 // → Color.Unspecified`,
    notes: 'Must be called from a @Composable context since it reads LocalKetoyColors. Returns Color.Unspecified (not Color.Black) for null inputs. Used extensively by ScaffoldParser, TextFieldParser and the renderer layer.',
    seeAlso: ['resolveKetoyColorOrNull', 'parseColor', 'parseColorOrNull', 'KetoyColorScheme', 'LocalKetoyColors'],
  },

  resolveKetoyColorOrNull: {
    name: 'resolveKetoyColorOrNull',
    kind: '@Composable function',
    module: 'parser',
    subpackage: 'color',
    category: 'Parser',
    subcategory: 'Color',
    description: 'Same as resolveKetoyColor but returns null when the input is null or when a @theme/ token cannot be resolved. Useful for optional colour properties.',
    android: {
      packageName: 'com.developerstring.ketoy.parser',
      annotations: ['@Composable'],
      imports: [
        'import androidx.compose.runtime.Composable',
        'import androidx.compose.ui.graphics.Color',
        'import com.developerstring.ketoy.theme.LocalKetoyColors',
      ],
      sourceCode: `@Composable
fun resolveKetoyColorOrNull(colorString: String?): Color? {
    if (colorString == null) return null
    if (colorString.startsWith("@theme/")) {
        val token = colorString.removePrefix("@theme/")
        return LocalKetoyColors.current.resolve(token)
    }
    return parseColorOrNull(colorString)
}`,
    },
    properties: [
      { name: 'colorString', type: 'String?', default: '—', description: 'A theme token, hex string, named colour, or null.' },
    ],
    methods: [],
    usage: `val color = resolveKetoyColorOrNull("@theme/primary") // Color or null
val nothing = resolveKetoyColorOrNull(null)             // null`,
    notes: 'Returns null instead of Color.Unspecified for absent/unresolvable values.',
    seeAlso: ['resolveKetoyColor', 'parseColor', 'parseColorOrNull'],
  },

  /* ══════════════════════════════════════════════════════════════════
   *  Parser > Gradient
   * ══════════════════════════════════════════════════════════════════ */

  parseGradient: {
    name: 'parseGradient',
    kind: 'function',
    module: 'parser',
    subpackage: 'gradient',
    category: 'Parser',
    subcategory: 'Gradient',
    description: 'Parses a gradient JsonObject into a Compose Brush. Supports linear (with direction or angle), radial (with centerX, centerY, radius), and angular/sweep (with centerX, centerY) gradient types. Colours can be plain strings or objects with color + alpha keys.',
    android: {
      packageName: 'com.developerstring.ketoy.parser',
      annotations: [],
      imports: [
        'import androidx.compose.ui.geometry.Offset',
        'import androidx.compose.ui.graphics.Brush',
        'import androidx.compose.ui.graphics.TileMode',
        'import kotlinx.serialization.json.*',
        'import kotlin.math.cos',
        'import kotlin.math.sin',
      ],
      sourceCode: `fun parseGradient(gradientObject: JsonObject): Brush? {
    try {
        val type = gradientObject["type"]?.jsonPrimitive?.content ?: "linear"
        val colorsList = gradientObject["colors"]?.jsonArray
        if (colorsList == null || colorsList.isEmpty()) return null

        val colors = colorsList.mapNotNull { colorElement ->
            when (colorElement) {
                is JsonPrimitive -> parseColor(colorElement.content)
                is JsonObject -> {
                    val colorString = colorElement["color"]?.jsonPrimitive?.content
                    val alpha = colorElement["alpha"]?.jsonPrimitive?.floatOrNull
                    val color = parseColor(colorString)
                    if (alpha != null && alpha != 1.0f) color.copy(alpha = alpha) else color
                }
                else -> null
            }
        }
        if (colors.size < 2) return null

        return when (type.lowercase()) {
            "linear" -> { /* direction or angle-based linear gradient */ }
            "radial" -> { /* center + radius radial gradient */ }
            "angular", "sweep" -> { /* sweep gradient */ }
            else -> Brush.verticalGradient(colors)
        }
    } catch (e: Exception) { return null }
}`,
    },
    properties: [
      { name: 'gradientObject', type: 'JsonObject', default: '—', description: 'The JSON object describing the gradient. Must contain a "colors" array with at least 2 entries.' },
    ],
    methods: [],
    usage: `// Linear gradient (direction-based)
{
    "gradient": {
        "type": "linear",
        "direction": "horizontal",
        "colors": ["#FF0000", "#0000FF"]
    }
}

// Linear gradient (angle-based)
{
    "gradient": {
        "type": "linear",
        "angle": 45.0,
        "colors": ["#FF0000", "#00FF00", "#0000FF"]
    }
}

// Radial gradient
{
    "gradient": {
        "type": "radial",
        "centerX": 0.5,
        "centerY": 0.5,
        "radius": 0.5,
        "colors": ["#FFFFFF", "#000000"]
    }
}

// Sweep gradient
{
    "gradient": {
        "type": "sweep",
        "centerX": 0.5,
        "centerY": 0.5,
        "colors": ["#FF0000", "#00FF00", "#0000FF"]
    }
}

// Colours with alpha
{
    "gradient": {
        "type": "linear",
        "colors": [
            { "color": "#FF0000", "alpha": 0.8 },
            { "color": "#0000FF", "alpha": 0.5 }
        ]
    }
}`,
    notes: 'Returns null when fewer than 2 colours are provided or on any parsing error. Linear gradient directions: "horizontal"/"right", "vertical"/"down", "topleft", "topright". Default type is "linear" with "vertical" direction.',
    seeAlso: ['parseModifier', 'parseColor', 'KGradient'],
  },

  /* ══════════════════════════════════════════════════════════════════
   *  Parser > Modifier
   * ══════════════════════════════════════════════════════════════════ */

  parseModifier: {
    name: 'parseModifier',
    kind: 'function',
    module: 'parser',
    subpackage: 'modifier',
    category: 'Parser',
    subcategory: 'Modifier',
    description: 'Parses a JsonObject "modifier" key into a fully chained Compose Modifier. The order in which keys appear in the JSON object is preserved, giving the server/backend full control over modifier chain ordering. Supports size, spacing, position, appearance, effects, interaction, and scroll modifiers.',
    android: {
      packageName: 'com.developerstring.ketoy.parser',
      annotations: [],
      imports: [
        'import androidx.compose.foundation.background',
        'import androidx.compose.foundation.border',
        'import androidx.compose.foundation.clickable',
        'import androidx.compose.foundation.ScrollState',
        'import androidx.compose.foundation.horizontalScroll',
        'import androidx.compose.foundation.layout.*',
        'import androidx.compose.foundation.verticalScroll',
        'import androidx.compose.foundation.shape.RoundedCornerShape',
        'import androidx.compose.ui.Modifier',
        'import androidx.compose.ui.draw.*',
        'import androidx.compose.ui.graphics.Color',
        'import androidx.compose.ui.graphics.RectangleShape',
        'import androidx.compose.ui.graphics.Shape',
        'import androidx.compose.ui.unit.dp',
        'import kotlinx.serialization.json.*',
      ],
      sourceCode: `fun parseModifier(props: JsonObject): Modifier {
    var modifier: Modifier = Modifier
    val modifierProps = props["modifier"]?.jsonObject
    if (modifierProps == null || modifierProps.isEmpty()) return modifier

    try {
        // Pre-compute shape from shape/cornerRadius for reuse
        val componentShape: Shape = when { ... }

        // Walk keys in order to preserve modifier chain
        modifierProps.forEach { (key, value) ->
            modifier = when (key) {
                "margin" -> applyPaddingFromJson(modifier, value)
                "fillMaxSize" -> modifier.fillMaxSize(...)
                "fillMaxWidth" -> modifier.fillMaxWidth(...)
                "fillMaxHeight" -> modifier.fillMaxHeight(...)
                "wrapContentWidth" -> modifier.wrapContentWidth()
                "wrapContentHeight" -> modifier.wrapContentHeight()
                "size" -> modifier.size(value.dp)
                "width" -> modifier.width(value.dp)
                "height" -> modifier.height(value.dp)
                "offsetX" -> modifier.offset(x = value.dp, y = offsetY.dp)
                "shadow" -> modifier.shadow(elevation, shape, ...)
                "background" -> modifier.background(color, shape)
                "gradient" -> modifier.background(brush, shape)
                "shape", "cornerRadius" -> modifier.clip(shape)
                "border" -> modifier.border(width, color, shape)
                "padding" -> applyPaddingFromJson(modifier, value)
                "alpha" -> modifier.alpha(value)
                "scale" -> modifier.scale(value)
                "rotation" -> modifier.rotate(value)
                "clickable" -> modifier.clickable { }
                "verticalScroll" -> modifier.verticalScroll(...)
                "horizontalScroll" -> modifier.horizontalScroll(...)
                else -> modifier
            }
        }
    } catch (_: Exception) { }
    return modifier
}`,
    },
    properties: [
      { name: 'props', type: 'JsonObject', default: '—', description: 'The component\'s top-level JsonObject; the function reads props["modifier"].' },
    ],
    methods: [],
    usage: `// JSON modifier object
{
    "type": "Box",
    "modifier": {
        "fillMaxWidth": true,
        "padding": { "all": 16 },
        "background": "#FFFFFF",
        "cornerRadius": 12,
        "border": { "width": 1, "color": "#E0E0E0" },
        "shadow": { "elevation": 4 },
        "alpha": 0.9
    }
}

// Kotlin
val modifier = parseModifier(props)`,
    notes: 'Supported modifier keys: fillMaxSize, fillMaxWidth, fillMaxHeight, size, width, height, wrapContentWidth, wrapContentHeight, padding, margin, paddingHorizontal, paddingVertical, paddingTop, offsetX, offsetY, background, gradient, shape, cornerRadius, border, shadow, alpha, scale, scaleX, scaleY, rotation, clickable, verticalScroll, horizontalScroll. Unknown keys are silently ignored. The shape/cornerRadius is pre-computed once and reused across background, clip, and border modifiers.',
    seeAlso: ['parseShape', 'parseShapeWithRadius', 'parseColor', 'parseGradient', 'KModifier'],
  },

  /* ══════════════════════════════════════════════════════════════════
   *  Parser > Shape
   * ══════════════════════════════════════════════════════════════════ */

  parseShape: {
    name: 'parseShape',
    kind: 'function',
    module: 'parser',
    subpackage: 'shape',
    category: 'Parser',
    subcategory: 'Shape',
    description: 'Parses a shape descriptor string into a Compose Shape. Supports "circle", "rectangle", "clip", "rounded_X" (uniform radius), "rounded_corners_A_B_C_D" (per-corner), "roundedcornershape(Xdp)", "roundedcornershape(X%)", and "roundedcornershape(a,b,c,d)".',
    android: {
      packageName: 'com.developerstring.ketoy.parser',
      annotations: [],
      imports: [
        'import androidx.compose.foundation.shape.CircleShape',
        'import androidx.compose.foundation.shape.RoundedCornerShape',
        'import androidx.compose.ui.graphics.RectangleShape',
        'import androidx.compose.ui.graphics.Shape',
        'import androidx.compose.ui.unit.dp',
      ],
      sourceCode: `fun parseShape(shapeType: String?): Shape {
    return when {
        shapeType?.lowercase() == "circle" -> CircleShape
        shapeType?.lowercase() == "rectangle" -> RectangleShape
        shapeType?.lowercase() == "clip" -> RectangleShape
        shapeType?.startsWith("rounded_") == true -> {
            if (shapeType.startsWith("rounded_corners_")) {
                val corners = shapeType.substringAfter("rounded_corners_")
                    .split("_").mapNotNull { it.toIntOrNull() }
                if (corners.size == 4)
                    RoundedCornerShape(corners[0].dp, corners[1].dp,
                                       corners[2].dp, corners[3].dp)
                else RectangleShape
            } else {
                val radius = shapeType.substringAfter("rounded_")
                    .toIntOrNull() ?: 8
                RoundedCornerShape(radius.dp)
            }
        }
        shapeType?.startsWith("roundedcornershape(") == true -> {
            val content = shapeType.substringAfter("(").substringBefore(")")
            when {
                content.endsWith("dp") -> RoundedCornerShape(content.removeSuffix("dp").toInt().dp)
                content.endsWith("%") -> RoundedCornerShape(percent = content.removeSuffix("%").toInt())
                content.contains(",") -> /* per-corner dp values */
                else -> RoundedCornerShape(content.toInt().dp)
            }
        }
        else -> RectangleShape
    }
}`,
    },
    properties: [
      { name: 'shapeType', type: 'String?', default: '—', description: 'The shape descriptor string (case-insensitive), or null.' },
    ],
    methods: [],
    usage: `parseShape("circle")                         // CircleShape
parseShape("rectangle")                      // RectangleShape
parseShape("rounded_12")                     // RoundedCornerShape(12.dp)
parseShape("rounded_corners_4_8_4_8")        // Per-corner shape
parseShape("roundedcornershape(16dp)")        // RoundedCornerShape(16.dp)
parseShape("roundedcornershape(50%)")         // 50% rounded corners
parseShape("roundedcornershape(4,8,4,8)")     // Per-corner dp values
parseShape(null)                             // RectangleShape`,
    notes: 'Defaults to RectangleShape for null or unrecognised inputs. For structured JSON shape objects, use parseShapeWithRadius instead.',
    seeAlso: ['parseShapeWithRadius', 'parseModifier', 'KShapes'],
  },

  parseShapeWithRadius: {
    name: 'parseShapeWithRadius',
    kind: 'function',
    module: 'parser',
    subpackage: 'shape',
    category: 'Parser',
    subcategory: 'Shape',
    description: 'Parses a shape from a structured JsonObject with explicit type and radius/percent/per-corner values. Complements parseShape which handles string-based descriptors.',
    android: {
      packageName: 'com.developerstring.ketoy.parser',
      annotations: [],
      imports: [
        'import androidx.compose.foundation.shape.CircleShape',
        'import androidx.compose.foundation.shape.RoundedCornerShape',
        'import androidx.compose.ui.graphics.RectangleShape',
        'import androidx.compose.ui.graphics.Shape',
        'import androidx.compose.ui.unit.dp',
        'import kotlinx.serialization.json.JsonObject',
      ],
      sourceCode: `fun parseShapeWithRadius(shapeProps: JsonObject?): Shape {
    if (shapeProps == null) return RectangleShape
    val type = shapeProps["type"]?.jsonPrimitive?.content?.lowercase()
    return when (type) {
        "circle" -> CircleShape
        "rectangle" -> RectangleShape
        "rounded", "roundedcornershape" -> {
            when {
                shapeProps["radius"] != null ->
                    RoundedCornerShape(shapeProps["radius"]!!.jsonPrimitive.intOrNull?.dp ?: 0.dp)
                shapeProps["percent"] != null ->
                    RoundedCornerShape(percent = shapeProps["percent"]!!.jsonPrimitive.intOrNull ?: 0)
                shapeProps["topLeft"] != null || shapeProps["topRight"] != null ||
                    shapeProps["bottomLeft"] != null || shapeProps["bottomRight"] != null ->
                    RoundedCornerShape(topStart = ..., topEnd = ..., bottomEnd = ..., bottomStart = ...)
                else -> RoundedCornerShape(8.dp)
            }
        }
        else -> RectangleShape
    }
}`,
    },
    properties: [
      { name: 'shapeProps', type: 'JsonObject?', default: '—', description: 'The JSON object describing the shape, or null.' },
    ],
    methods: [],
    usage: `// Uniform radius
{ "shape": { "type": "rounded", "radius": 12 } }

// Percentage-based
{ "shape": { "type": "rounded", "percent": 50 } }

// Per-corner
{
    "shape": {
        "type": "rounded",
        "topLeft": 16,
        "topRight": 16,
        "bottomLeft": 0,
        "bottomRight": 0
    }
}

// Circle
{ "shape": { "type": "circle" } }`,
    notes: 'Expected JSON keys: type (String), radius (Int), percent (Int), topLeft (Int), topRight (Int), bottomLeft (Int), bottomRight (Int). Default for "rounded" without specifics is RoundedCornerShape(8.dp).',
    seeAlso: ['parseShape', 'parseModifier', 'KShapes'],
  },

  /* ══════════════════════════════════════════════════════════════════
   *  Parser > Scaffold
   * ══════════════════════════════════════════════════════════════════ */

  parseWindowInsets: {
    name: 'parseWindowInsets',
    kind: '@Composable function',
    module: 'parser',
    subpackage: 'scaffold',
    category: 'Parser',
    subcategory: 'Scaffold',
    description: 'Parses a window-insets JSON object into a Compose WindowInsets instance. Resolves system-defined insets by type name or uses explicit dp values for left/top/right/bottom.',
    android: {
      packageName: 'com.developerstring.ketoy.parser',
      annotations: ['@Composable'],
      imports: [
        'import androidx.compose.foundation.layout.WindowInsets',
        'import androidx.compose.foundation.layout.statusBars',
        'import androidx.compose.foundation.layout.navigationBars',
        'import androidx.compose.foundation.layout.systemBars',
        'import androidx.compose.foundation.layout.ime',
        'import kotlinx.serialization.json.JsonObject',
      ],
      sourceCode: `@Composable
fun parseWindowInsets(windowInsetsObject: JsonObject): WindowInsets {
    val type = windowInsetsObject["type"]?.jsonPrimitive?.content
    val left = windowInsetsObject["left"]?.jsonPrimitive?.intOrNull ?: 0
    val top = windowInsetsObject["top"]?.jsonPrimitive?.intOrNull ?: 0
    val right = windowInsetsObject["right"]?.jsonPrimitive?.intOrNull ?: 0
    val bottom = windowInsetsObject["bottom"]?.jsonPrimitive?.intOrNull ?: 0

    return when (type) {
        "statusBars" -> WindowInsets.statusBars
        "navigationBars" -> WindowInsets.navigationBars
        "systemBars" -> WindowInsets.systemBars
        "ime" -> WindowInsets.ime
        "captionBar" -> WindowInsets.captionBar
        "displayCutout" -> WindowInsets.displayCutout
        "mandatorySystemGestures" -> WindowInsets.mandatorySystemGestures
        "systemGestures" -> WindowInsets.systemGestures
        "tappableElement" -> WindowInsets.tappableElement
        "waterfall" -> WindowInsets.waterfall
        else -> WindowInsets(left, top, right, bottom)
    }
}`,
    },
    properties: [
      { name: 'windowInsetsObject', type: 'JsonObject', default: '—', description: 'JSON object with "type" for system insets or "left/top/right/bottom" dp values.' },
    ],
    methods: [],
    usage: `// System insets by type
{ "windowInsets": { "type": "statusBars" } }

// Explicit dp values
{ "windowInsets": { "left": 0, "top": 24, "right": 0, "bottom": 0 } }`,
    notes: 'Supported type values: statusBars, navigationBars, systemBars, ime, captionBar, displayCutout, mandatorySystemGestures, systemGestures, tappableElement, waterfall. Falls back to explicit dp values when type is absent.',
    seeAlso: ['parseTopAppBarColors', 'parseFabPosition', 'KScaffoldProps', 'KWindowInsets'],
  },

  parseTopAppBarColors: {
    name: 'parseTopAppBarColors',
    kind: '@Composable function',
    module: 'parser',
    subpackage: 'scaffold',
    category: 'Parser',
    subcategory: 'Scaffold',
    description: 'Parses a JSON object into Material 3 TopAppBarColors. Resolves colour values via resolveKetoyColor, supporting hex, named colours, and @theme/ tokens.',
    android: {
      packageName: 'com.developerstring.ketoy.parser',
      annotations: ['@Composable', '@OptIn(ExperimentalMaterial3Api::class)'],
      imports: [
        'import androidx.compose.material3.*',
        'import kotlinx.serialization.json.JsonObject',
      ],
      sourceCode: `@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun parseTopAppBarColors(colorsObject: JsonObject): TopAppBarColors {
    return TopAppBarDefaults.topAppBarColors(
        containerColor = resolveKetoyColor(colorsObject["containerColor"]?.jsonPrimitive?.content),
        scrolledContainerColor = resolveKetoyColor(colorsObject["scrolledContainerColor"]?.jsonPrimitive?.content),
        navigationIconContentColor = resolveKetoyColor(colorsObject["navigationIconContentColor"]?.jsonPrimitive?.content),
        titleContentColor = resolveKetoyColor(colorsObject["titleContentColor"]?.jsonPrimitive?.content),
        actionIconContentColor = resolveKetoyColor(colorsObject["actionIconContentColor"]?.jsonPrimitive?.content)
    )
}`,
    },
    properties: [
      { name: 'colorsObject', type: 'JsonObject', default: '—', description: 'JSON object with colour keys: containerColor, scrolledContainerColor, navigationIconContentColor, titleContentColor, actionIconContentColor.' },
    ],
    methods: [],
    usage: `{
    "topAppBarColors": {
        "containerColor": "@theme/primary",
        "titleContentColor": "#FFFFFF",
        "actionIconContentColor": "#FFFFFF"
    }
}`,
    notes: 'All colour values are resolved via resolveKetoyColor (supports @theme/ tokens). Uses TopAppBarDefaults.topAppBarColors() with Material 3 defaults for unspecified slots.',
    seeAlso: ['parseTopAppBarScrollBehavior', 'resolveKetoyColor', 'parseWindowInsets', 'KTopAppBarProps'],
  },

  parseTopAppBarScrollBehavior: {
    name: 'parseTopAppBarScrollBehavior',
    kind: '@Composable function',
    module: 'parser',
    subpackage: 'scaffold',
    category: 'Parser',
    subcategory: 'Scaffold',
    description: 'Parses a JSON object into a TopAppBarScrollBehavior. Supports pinned, enter-always, and exit-until-collapsed scroll behaviours.',
    android: {
      packageName: 'com.developerstring.ketoy.parser',
      annotations: ['@Composable', '@OptIn(ExperimentalMaterial3Api::class)'],
      imports: [
        'import androidx.compose.material3.*',
        'import kotlinx.serialization.json.JsonObject',
      ],
      sourceCode: `@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun parseTopAppBarScrollBehavior(scrollBehaviorObject: JsonObject): TopAppBarScrollBehavior? {
    return when (scrollBehaviorObject["type"]?.jsonPrimitive?.content) {
        "pinnedScroll" -> TopAppBarDefaults.pinnedScrollBehavior()
        "enterAlwaysScroll" -> TopAppBarDefaults.enterAlwaysScrollBehavior()
        "exitUntilCollapsedScroll" -> TopAppBarDefaults.exitUntilCollapsedScrollBehavior()
        else -> null
    }
}`,
    },
    properties: [
      { name: 'scrollBehaviorObject', type: 'JsonObject', default: '—', description: 'JSON object with a "type" key: "pinnedScroll", "enterAlwaysScroll", or "exitUntilCollapsedScroll".' },
    ],
    methods: [],
    usage: `{ "scrollBehavior": { "type": "pinnedScroll" } }
{ "scrollBehavior": { "type": "enterAlwaysScroll" } }
{ "scrollBehavior": { "type": "exitUntilCollapsedScroll" } }`,
    notes: 'Returns null for unknown type values. Uses ExperimentalMaterial3Api.',
    seeAlso: ['parseTopAppBarColors', 'parseWindowInsets', 'KTopAppBarProps'],
  },

  parseNavigationDrawerItemColors: {
    name: 'parseNavigationDrawerItemColors',
    kind: '@Composable function',
    module: 'parser',
    subpackage: 'scaffold',
    category: 'Parser',
    subcategory: 'Scaffold',
    description: 'Parses a JSON object into Material 3 NavigationDrawerItemColors, covering 8 colour slots for selected/unselected states of containers, icons, text, and badges.',
    android: {
      packageName: 'com.developerstring.ketoy.parser',
      annotations: ['@Composable'],
      imports: [
        'import androidx.compose.material3.NavigationDrawerItemColors',
        'import androidx.compose.material3.NavigationDrawerItemDefaults',
        'import kotlinx.serialization.json.JsonObject',
      ],
      sourceCode: `@Composable
fun parseNavigationDrawerItemColors(colorsObject: JsonObject): NavigationDrawerItemColors {
    return NavigationDrawerItemDefaults.colors(
        selectedContainerColor = resolveKetoyColor(colorsObject["selectedContainerColor"]?.jsonPrimitive?.content),
        unselectedContainerColor = resolveKetoyColor(colorsObject["unselectedContainerColor"]?.jsonPrimitive?.content),
        selectedIconColor = resolveKetoyColor(colorsObject["selectedIconColor"]?.jsonPrimitive?.content),
        unselectedIconColor = resolveKetoyColor(colorsObject["unselectedIconColor"]?.jsonPrimitive?.content),
        selectedTextColor = resolveKetoyColor(colorsObject["selectedTextColor"]?.jsonPrimitive?.content),
        unselectedTextColor = resolveKetoyColor(colorsObject["unselectedTextColor"]?.jsonPrimitive?.content),
        selectedBadgeColor = resolveKetoyColor(colorsObject["selectedBadgeColor"]?.jsonPrimitive?.content),
        unselectedBadgeColor = resolveKetoyColor(colorsObject["unselectedBadgeColor"]?.jsonPrimitive?.content)
    )
}`,
    },
    properties: [
      { name: 'colorsObject', type: 'JsonObject', default: '—', description: 'JSON object with colour keys: selectedContainerColor, unselectedContainerColor, selectedIconColor, unselectedIconColor, selectedTextColor, unselectedTextColor, selectedBadgeColor, unselectedBadgeColor.' },
    ],
    methods: [],
    usage: `{
    "drawerItemColors": {
        "selectedContainerColor": "@theme/primaryContainer",
        "selectedIconColor": "@theme/onPrimaryContainer",
        "selectedTextColor": "@theme/onPrimaryContainer",
        "unselectedIconColor": "@theme/onSurfaceVariant"
    }
}`,
    notes: 'All 8 colour slots are optional. Unspecified values use Material 3 defaults. Colour values are resolved via resolveKetoyColor.',
    seeAlso: ['parseNavigationBarItemColors', 'parseIconButtonColors', 'resolveKetoyColor', 'KNavigationDrawerItemProps'],
  },

  parseIconButtonColors: {
    name: 'parseIconButtonColors',
    kind: '@Composable function',
    module: 'parser',
    subpackage: 'scaffold',
    category: 'Parser',
    subcategory: 'Scaffold',
    description: 'Parses a JSON object into Material 3 IconButtonColors with 4 colour slots: containerColor, contentColor, disabledContainerColor, disabledContentColor.',
    android: {
      packageName: 'com.developerstring.ketoy.parser',
      annotations: ['@Composable'],
      imports: [
        'import androidx.compose.material3.IconButtonColors',
        'import androidx.compose.material3.IconButtonDefaults',
        'import kotlinx.serialization.json.JsonObject',
      ],
      sourceCode: `@Composable
fun parseIconButtonColors(colorsObject: JsonObject): IconButtonColors {
    return IconButtonDefaults.iconButtonColors(
        containerColor = resolveKetoyColor(colorsObject["containerColor"]?.jsonPrimitive?.content),
        contentColor = resolveKetoyColor(colorsObject["contentColor"]?.jsonPrimitive?.content),
        disabledContainerColor = resolveKetoyColor(colorsObject["disabledContainerColor"]?.jsonPrimitive?.content),
        disabledContentColor = resolveKetoyColor(colorsObject["disabledContentColor"]?.jsonPrimitive?.content)
    )
}`,
    },
    properties: [
      { name: 'colorsObject', type: 'JsonObject', default: '—', description: 'JSON object with colour keys: containerColor, contentColor, disabledContainerColor, disabledContentColor.' },
    ],
    methods: [],
    usage: `{
    "iconButtonColors": {
        "containerColor": "transparent",
        "contentColor": "@theme/onSurface"
    }
}`,
    notes: 'Uses IconButtonDefaults.iconButtonColors() with Material 3 defaults for unspecified slots.',
    seeAlso: ['parseNavigationBarItemColors', 'parseNavigationDrawerItemColors', 'resolveKetoyColor'],
  },

  parseNavigationBarItemColors: {
    name: 'parseNavigationBarItemColors',
    kind: '@Composable function',
    module: 'parser',
    subpackage: 'scaffold',
    category: 'Parser',
    subcategory: 'Scaffold',
    description: 'Parses a JSON object into Material 3 NavigationBarItemColors, covering 7 colour slots for selected/unselected/disabled states of icons, text, and the indicator.',
    android: {
      packageName: 'com.developerstring.ketoy.parser',
      annotations: ['@Composable'],
      imports: [
        'import androidx.compose.material3.NavigationBarItemColors',
        'import androidx.compose.material3.NavigationBarItemDefaults',
        'import kotlinx.serialization.json.JsonObject',
      ],
      sourceCode: `@Composable
fun parseNavigationBarItemColors(colorsObject: JsonObject): NavigationBarItemColors {
    return NavigationBarItemDefaults.colors(
        selectedIconColor = resolveKetoyColor(colorsObject["selectedIconColor"]?.jsonPrimitive?.content),
        selectedTextColor = resolveKetoyColor(colorsObject["selectedTextColor"]?.jsonPrimitive?.content),
        indicatorColor = resolveKetoyColor(colorsObject["indicatorColor"]?.jsonPrimitive?.content),
        unselectedIconColor = resolveKetoyColor(colorsObject["unselectedIconColor"]?.jsonPrimitive?.content),
        unselectedTextColor = resolveKetoyColor(colorsObject["unselectedTextColor"]?.jsonPrimitive?.content),
        disabledIconColor = resolveKetoyColor(colorsObject["disabledIconColor"]?.jsonPrimitive?.content),
        disabledTextColor = resolveKetoyColor(colorsObject["disabledTextColor"]?.jsonPrimitive?.content)
    )
}`,
    },
    properties: [
      { name: 'colorsObject', type: 'JsonObject', default: '—', description: 'JSON object with colour keys: selectedIconColor, selectedTextColor, indicatorColor, unselectedIconColor, unselectedTextColor, disabledIconColor, disabledTextColor.' },
    ],
    methods: [],
    usage: `{
    "navBarItemColors": {
        "selectedIconColor": "@theme/onSecondaryContainer",
        "indicatorColor": "@theme/secondaryContainer",
        "unselectedIconColor": "@theme/onSurfaceVariant"
    }
}`,
    notes: 'All 7 colour slots are optional. Uses NavigationBarItemDefaults.colors() with Material 3 defaults for unspecified values.',
    seeAlso: ['parseNavigationDrawerItemColors', 'parseIconButtonColors', 'resolveKetoyColor', 'KNavigationBarItemProps'],
  },

  parseFabElevation: {
    name: 'parseFabElevation',
    kind: '@Composable function',
    module: 'parser',
    subpackage: 'scaffold',
    category: 'Parser',
    subcategory: 'Scaffold',
    description: 'Parses FAB elevation values from a JSON object into a Material 3 FloatingActionButtonElevation with four elevation states.',
    android: {
      packageName: 'com.developerstring.ketoy.parser',
      annotations: ['@Composable'],
      imports: [
        'import androidx.compose.material3.FloatingActionButtonDefaults',
        'import androidx.compose.material3.FloatingActionButtonElevation',
        'import androidx.compose.ui.unit.dp',
        'import kotlinx.serialization.json.JsonObject',
      ],
      sourceCode: `@Composable
fun parseFabElevation(elevationObject: JsonObject): FloatingActionButtonElevation {
    return FloatingActionButtonDefaults.elevation(
        defaultElevation = elevationObject["defaultElevation"]
            ?.jsonPrimitive?.intOrNull?.dp ?: 6.dp,
        pressedElevation = elevationObject["pressedElevation"]
            ?.jsonPrimitive?.intOrNull?.dp ?: 8.dp,
        focusedElevation = elevationObject["focusedElevation"]
            ?.jsonPrimitive?.intOrNull?.dp ?: 8.dp,
        hoveredElevation = elevationObject["hoveredElevation"]
            ?.jsonPrimitive?.intOrNull?.dp ?: 8.dp
    )
}`,
    },
    properties: [
      { name: 'elevationObject', type: 'JsonObject', default: '—', description: 'JSON object with dp values: defaultElevation (default 6), pressedElevation (default 8), focusedElevation (default 8), hoveredElevation (default 8).' },
    ],
    methods: [],
    usage: `{
    "fabElevation": {
        "defaultElevation": 4,
        "pressedElevation": 6,
        "focusedElevation": 6,
        "hoveredElevation": 8
    }
}`,
    notes: 'Default elevations: defaultElevation = 6dp, pressedElevation = 8dp, focusedElevation = 8dp, hoveredElevation = 8dp. All values are in dp.',
    seeAlso: ['parseFabPosition', 'parseWindowInsets', 'KFloatingActionButtonProps'],
  },

  parseFabPosition: {
    name: 'parseFabPosition',
    kind: 'function',
    module: 'parser',
    subpackage: 'scaffold',
    category: 'Parser',
    subcategory: 'Scaffold',
    description: 'Resolves a FAB position string into a Compose FabPosition. Not composable — performs a simple string lookup.',
    android: {
      packageName: 'com.developerstring.ketoy.parser',
      annotations: [],
      imports: [
        'import androidx.compose.material3.FabPosition',
      ],
      sourceCode: `fun parseFabPosition(position: String?): FabPosition {
    return when (position) {
        "start" -> FabPosition.Start
        "center" -> FabPosition.Center
        "end" -> FabPosition.End
        "endOverlay" -> FabPosition.EndOverlay
        "centerDocked" -> FabPosition.Center
        "endDocked" -> FabPosition.End
        else -> FabPosition.End
    }
}`,
    },
    properties: [
      { name: 'position', type: 'String?', default: '—', description: 'The position string: "start", "center", "end", "endOverlay", "centerDocked", "endDocked".' },
    ],
    methods: [],
    usage: `parseFabPosition("center")        // FabPosition.Center
parseFabPosition("endOverlay")     // FabPosition.EndOverlay
parseFabPosition(null)             // FabPosition.End`,
    notes: 'Recognised values: "start", "center", "end", "endOverlay", "centerDocked" (→ Center), "endDocked" (→ End). Defaults to FabPosition.End.',
    seeAlso: ['parseFabElevation', 'parseWindowInsets', 'KScaffoldProps'],
  },

  /* ══════════════════════════════════════════════════════════════════
   *  Parser > TextField
   * ══════════════════════════════════════════════════════════════════ */

  parseTextStyle: {
    name: 'parseTextStyle',
    kind: 'function',
    module: 'parser',
    subpackage: 'textfield',
    category: 'Parser',
    subcategory: 'TextField',
    description: 'Parses a JSON object into a Compose TextStyle. Covers colour, font size, font weight, font style, font family, letter spacing, text decoration, line height, and background colour.',
    android: {
      packageName: 'com.developerstring.ketoy.parser',
      annotations: [],
      imports: [
        'import androidx.compose.ui.text.TextStyle',
        'import androidx.compose.ui.text.font.FontFamily',
        'import androidx.compose.ui.text.font.FontStyle',
        'import androidx.compose.ui.text.font.FontWeight',
        'import androidx.compose.ui.text.style.TextDecoration',
        'import androidx.compose.ui.unit.sp',
        'import kotlinx.serialization.json.JsonObject',
      ],
      sourceCode: `fun parseTextStyle(textStyleObject: JsonObject): TextStyle {
    return TextStyle(
        color = parseColor(textStyleObject["color"]?.jsonPrimitive?.content),
        fontSize = textStyleObject["fontSize"]?.jsonPrimitive?.intOrNull?.sp
            ?: TextStyle.Default.fontSize,
        fontWeight = when (textStyleObject["fontWeight"]?.jsonPrimitive?.content) {
            "normal" -> FontWeight.Normal
            "bold" -> FontWeight.Bold
            "light" -> FontWeight.Light
            "medium" -> FontWeight.Medium
            "semibold" -> FontWeight.SemiBold
            "black" -> FontWeight.Black
            else -> TextStyle.Default.fontWeight
        },
        fontStyle = when (textStyleObject["fontStyle"]?.jsonPrimitive?.content) {
            "normal" -> FontStyle.Normal
            "italic" -> FontStyle.Italic
            else -> TextStyle.Default.fontStyle
        },
        fontFamily = when (textStyleObject["fontFamily"]?.jsonPrimitive?.content) {
            "default" -> FontFamily.Default
            "serif" -> FontFamily.Serif
            "sansSerif" -> FontFamily.SansSerif
            "monospace" -> FontFamily.Monospace
            "cursive" -> FontFamily.Cursive
            else -> TextStyle.Default.fontFamily
        },
        letterSpacing = textStyleObject["letterSpacing"]?.jsonPrimitive?.floatOrNull?.sp
            ?: TextStyle.Default.letterSpacing,
        textDecoration = when (textStyleObject["textDecoration"]?.jsonPrimitive?.content) {
            "none" -> TextDecoration.None
            "underline" -> TextDecoration.Underline
            "lineThrough" -> TextDecoration.LineThrough
            else -> TextStyle.Default.textDecoration
        },
        lineHeight = textStyleObject["lineHeight"]?.jsonPrimitive?.intOrNull?.sp
            ?: TextStyle.Default.lineHeight,
        background = parseColor(textStyleObject["background"]?.jsonPrimitive?.content)
    )
}`,
    },
    properties: [
      { name: 'textStyleObject', type: 'JsonObject', default: '—', description: 'JSON object with TextStyle keys: color, fontSize, fontWeight, fontStyle, fontFamily, letterSpacing, textDecoration, lineHeight, background.' },
    ],
    methods: [],
    usage: `{
    "textStyle": {
        "color": "#333333",
        "fontSize": 16,
        "fontWeight": "bold",
        "fontStyle": "italic",
        "fontFamily": "sansSerif",
        "letterSpacing": 0.5,
        "textDecoration": "underline",
        "lineHeight": 24
    }
}`,
    notes: 'fontWeight values: "normal", "bold", "light", "medium", "semibold", "black". fontFamily values: "default", "serif", "sansSerif", "monospace", "cursive". textDecoration values: "none", "underline", "lineThrough". Unset properties fall back to TextStyle.Default.',
    seeAlso: ['parseTextFieldColors', 'parseKeyboardOptions', 'parseVisualTransformation', 'KTextFieldProps'],
  },

  parseVisualTransformation: {
    name: 'parseVisualTransformation',
    kind: 'function',
    module: 'parser',
    subpackage: 'textfield',
    category: 'Parser',
    subcategory: 'TextField',
    description: 'Parses a visual-transformation JSON object for text fields. Currently supports "password" type with an optional mask character.',
    android: {
      packageName: 'com.developerstring.ketoy.parser',
      annotations: [],
      imports: [
        'import androidx.compose.ui.text.input.PasswordVisualTransformation',
        'import androidx.compose.ui.text.input.VisualTransformation',
        'import kotlinx.serialization.json.JsonObject',
      ],
      sourceCode: `fun parseVisualTransformation(visualTransObject: JsonObject): VisualTransformation {
    return when (visualTransObject["type"]?.jsonPrimitive?.content) {
        "password" -> {
            val mask = visualTransObject["mask"]?.jsonPrimitive?.content?.firstOrNull() ?: '•'
            PasswordVisualTransformation(mask)
        }
        else -> VisualTransformation.None
    }
}`,
    },
    properties: [
      { name: 'visualTransObject', type: 'JsonObject', default: '—', description: 'JSON object with "type" key ("password") and optional "mask" character.' },
    ],
    methods: [],
    usage: `// Password with default bullet mask
{ "visualTransformation": { "type": "password" } }

// Password with star mask
{ "visualTransformation": { "type": "password", "mask": "*" } }`,
    notes: 'Default mask character is "•". Returns VisualTransformation.None for unknown types.',
    seeAlso: ['parseKeyboardOptions', 'parseTextFieldColors', 'parseTextStyle', 'KTextFieldProps'],
  },

  parseKeyboardOptions: {
    name: 'parseKeyboardOptions',
    kind: 'function',
    module: 'parser',
    subpackage: 'textfield',
    category: 'Parser',
    subcategory: 'TextField',
    description: 'Parses a JSON object into Compose KeyboardOptions with capitalization, auto-correct, keyboard type, and IME action settings.',
    android: {
      packageName: 'com.developerstring.ketoy.parser',
      annotations: [],
      imports: [
        'import androidx.compose.foundation.text.KeyboardOptions',
        'import androidx.compose.ui.text.input.*',
        'import kotlinx.serialization.json.JsonObject',
      ],
      sourceCode: `fun parseKeyboardOptions(keyboardObject: JsonObject): KeyboardOptions {
    val capitalization = when (keyboardObject["capitalization"]?.jsonPrimitive?.content) {
        "none" -> KeyboardCapitalization.None
        "characters" -> KeyboardCapitalization.Characters
        "words" -> KeyboardCapitalization.Words
        "sentences" -> KeyboardCapitalization.Sentences
        else -> KeyboardCapitalization.None
    }
    val autoCorrect = keyboardObject["autoCorrect"]?.jsonPrimitive?.booleanOrNull ?: true
    val keyboardType = when (keyboardObject["keyboardType"]?.jsonPrimitive?.content) {
        "text" -> KeyboardType.Text
        "ascii" -> KeyboardType.Ascii
        "number" -> KeyboardType.Number
        "phone" -> KeyboardType.Phone
        "uri" -> KeyboardType.Uri
        "email" -> KeyboardType.Email
        "password" -> KeyboardType.Password
        "numberPassword" -> KeyboardType.NumberPassword
        "decimal" -> KeyboardType.Decimal
        else -> KeyboardType.Text
    }
    val imeAction = when (keyboardObject["imeAction"]?.jsonPrimitive?.content) {
        "default" -> ImeAction.Default
        "none" -> ImeAction.None
        "go" -> ImeAction.Go
        "search" -> ImeAction.Search
        "send" -> ImeAction.Send
        "previous" -> ImeAction.Previous
        "next" -> ImeAction.Next
        "done" -> ImeAction.Done
        else -> ImeAction.Default
    }
    return KeyboardOptions(
        capitalization = capitalization,
        autoCorrect = autoCorrect,
        keyboardType = keyboardType,
        imeAction = imeAction
    )
}`,
    },
    properties: [
      { name: 'keyboardObject', type: 'JsonObject', default: '—', description: 'JSON object with keys: capitalization, autoCorrect, keyboardType, imeAction.' },
    ],
    methods: [],
    usage: `{
    "keyboardOptions": {
        "capitalization": "sentences",
        "autoCorrect": true,
        "keyboardType": "email",
        "imeAction": "done"
    }
}`,
    notes: 'capitalization: "none", "characters", "words", "sentences". keyboardType: "text", "ascii", "number", "phone", "uri", "email", "password", "numberPassword", "decimal". imeAction: "default", "none", "go", "search", "send", "previous", "next", "done". Defaults: capitalization = None, autoCorrect = true, keyboardType = Text, imeAction = Default.',
    seeAlso: ['parseKeyboardActions', 'parseTextFieldColors', 'parseVisualTransformation', 'KTextFieldProps'],
  },

  parseKeyboardActions: {
    name: 'parseKeyboardActions',
    kind: '@Composable function',
    module: 'parser',
    subpackage: 'textfield',
    category: 'Parser',
    subcategory: 'TextField',
    description: 'Parses a JSON object into Compose KeyboardActions. Wires default behaviours for each action: onDone hides keyboard and clears focus, onNext/onPrevious move focus, others are bound as no-ops.',
    android: {
      packageName: 'com.developerstring.ketoy.parser',
      annotations: ['@Composable'],
      imports: [
        'import androidx.compose.foundation.text.KeyboardActions',
        'import androidx.compose.ui.focus.FocusDirection',
        'import androidx.compose.ui.platform.LocalFocusManager',
        'import androidx.compose.ui.platform.LocalSoftwareKeyboardController',
        'import kotlinx.serialization.json.JsonObject',
      ],
      sourceCode: `@Composable
fun parseKeyboardActions(keyboardActionsObject: JsonObject): KeyboardActions {
    val focusManager = LocalFocusManager.current
    val keyboardController = LocalSoftwareKeyboardController.current

    return KeyboardActions(
        onDone = keyboardActionsObject["onDone"]?.jsonPrimitive?.content?.let {
            { keyboardController?.hide(); focusManager.clearFocus() }
        },
        onGo = keyboardActionsObject["onGo"]?.jsonPrimitive?.content?.let { { } },
        onNext = keyboardActionsObject["onNext"]?.jsonPrimitive?.content?.let {
            { focusManager.moveFocus(FocusDirection.Next) }
        },
        onPrevious = keyboardActionsObject["onPrevious"]?.jsonPrimitive?.content?.let {
            { focusManager.moveFocus(FocusDirection.Previous) }
        },
        onSearch = keyboardActionsObject["onSearch"]?.jsonPrimitive?.content?.let { { } },
        onSend = keyboardActionsObject["onSend"]?.jsonPrimitive?.content?.let { { } }
    )
}`,
    },
    properties: [
      { name: 'keyboardActionsObject', type: 'JsonObject', default: '—', description: 'JSON object with action keys: onDone, onGo, onNext, onPrevious, onSearch, onSend.' },
    ],
    methods: [],
    usage: `{
    "keyboardActions": {
        "onDone": "hideKeyboard",
        "onNext": "moveFocus"
    }
}`,
    notes: 'The string values are used as presence-checks only; the actual action value is not significant. onDone hides the keyboard and clears focus. onNext moves focus forward. onPrevious moves focus backward. Must be called from a @Composable context.',
    seeAlso: ['parseKeyboardOptions', 'parseTextFieldColors', 'parseTextStyle', 'KTextFieldProps'],
  },

  parseTextFieldColors: {
    name: 'parseTextFieldColors',
    kind: '@Composable function',
    module: 'parser',
    subpackage: 'textfield',
    category: 'Parser',
    subcategory: 'TextField',
    description: 'Parses a comprehensive JSON colour-scheme object into Material 3 TextFieldColors. Covers all 40 colour slots across text, container, cursor, indicator, leading/trailing icons, label, placeholder, supporting text, prefix, and suffix in focused/unfocused/disabled/error states.',
    android: {
      packageName: 'com.developerstring.ketoy.parser',
      annotations: ['@Composable'],
      imports: [
        'import androidx.compose.material3.TextFieldColors',
        'import androidx.compose.material3.TextFieldDefaults',
        'import kotlinx.serialization.json.JsonObject',
      ],
      sourceCode: `@Composable
fun parseTextFieldColors(colorsObject: JsonObject): TextFieldColors {
    return TextFieldDefaults.colors(
        focusedTextColor = resolveKetoyColor(colorsObject["focusedTextColor"]?.jsonPrimitive?.content),
        unfocusedTextColor = resolveKetoyColor(colorsObject["unfocusedTextColor"]?.jsonPrimitive?.content),
        disabledTextColor = resolveKetoyColor(colorsObject["disabledTextColor"]?.jsonPrimitive?.content),
        errorTextColor = resolveKetoyColor(colorsObject["errorTextColor"]?.jsonPrimitive?.content),
        focusedContainerColor = resolveKetoyColor(colorsObject["focusedContainerColor"]?.jsonPrimitive?.content),
        unfocusedContainerColor = resolveKetoyColor(colorsObject["unfocusedContainerColor"]?.jsonPrimitive?.content),
        disabledContainerColor = resolveKetoyColor(colorsObject["disabledContainerColor"]?.jsonPrimitive?.content),
        errorContainerColor = resolveKetoyColor(colorsObject["errorContainerColor"]?.jsonPrimitive?.content),
        cursorColor = resolveKetoyColor(colorsObject["cursorColor"]?.jsonPrimitive?.content),
        errorCursorColor = resolveKetoyColor(colorsObject["errorCursorColor"]?.jsonPrimitive?.content),
        // ... + 30 more colour slots for indicators, icons, labels,
        //       placeholders, supporting text, prefix, suffix
    )
}`,
    },
    properties: [
      { name: 'colorsObject', type: 'JsonObject', default: '—', description: 'JSON object with up to 40 colour keys covering all Material 3 text field states.' },
    ],
    methods: [],
    usage: `{
    "textFieldColors": {
        "focusedTextColor": "#333333",
        "unfocusedTextColor": "#666666",
        "focusedContainerColor": "#FFFFFF",
        "unfocusedContainerColor": "#F5F5F5",
        "cursorColor": "@theme/primary",
        "focusedIndicatorColor": "@theme/primary",
        "unfocusedIndicatorColor": "#CCCCCC",
        "focusedLabelColor": "@theme/primary",
        "unfocusedLabelColor": "#999999"
    }
}`,
    notes: 'Full list of 40 colour slots: focusedTextColor, unfocusedTextColor, disabledTextColor, errorTextColor, focusedContainerColor, unfocusedContainerColor, disabledContainerColor, errorContainerColor, cursorColor, errorCursorColor, focusedIndicatorColor, unfocusedIndicatorColor, disabledIndicatorColor, errorIndicatorColor, focusedLeadingIconColor, unfocusedLeadingIconColor, disabledLeadingIconColor, errorLeadingIconColor, focusedTrailingIconColor, unfocusedTrailingIconColor, disabledTrailingIconColor, errorTrailingIconColor, focusedLabelColor, unfocusedLabelColor, disabledLabelColor, errorLabelColor, focusedPlaceholderColor, unfocusedPlaceholderColor, disabledPlaceholderColor, errorPlaceholderColor, focusedSupportingTextColor, unfocusedSupportingTextColor, disabledSupportingTextColor, errorSupportingTextColor, focusedPrefixColor, unfocusedPrefixColor, disabledPrefixColor, errorPrefixColor, focusedSuffixColor, unfocusedSuffixColor, disabledSuffixColor, errorSuffixColor. All resolved via resolveKetoyColor.',
    seeAlso: ['parseTextStyle', 'parseKeyboardOptions', 'parseKeyboardActions', 'resolveKetoyColor', 'KTextFieldProps'],
  },

}

export default parserData
