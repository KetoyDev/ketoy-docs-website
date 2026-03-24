/**
 * Ketoy SDK – Renderer Module
 * Package: com.developerstring.ketoy.renderer
 * Sub-packages: core, component, layout, action, scaffold, textfield, widget
 */

const rendererData = {

  /* ══════════════════════════════════════════════════════════════
   *  Renderer > Core  (KetoyRenderer.kt)
   * ══════════════════════════════════════════════════════════════ */

  UIComponent: {
    name: 'UIComponent',
    kind: 'data class',
    module: 'renderer',
    subpackage: 'core',
    category: 'Renderer',
    subcategory: 'Core',
    description: 'Serializable data class representing a single node in the server-driven UI tree. Every .ktw wire or JSON component definition is deserialized into a UIComponent before rendering. The tree is recursive — each node can have child nodes via the children property.',
    android: {
      packageName: 'com.developerstring.ketoy.renderer',
      annotations: ['@Serializable'],
      imports: [
        'import kotlinx.serialization.Serializable',
        'import kotlinx.serialization.json.JsonObject',
      ],
      sourceCode: `@Serializable
data class UIComponent(
    val type: String,
    val props: JsonObject? = null,
    val children: List<UIComponent>? = null
)`,
    },
    properties: [
      { name: 'type', type: 'String', description: 'Component type identifier (e.g. "column", "text", "scaffold"). Matched case-insensitively in RenderComponent dispatch.' },
      { name: 'props', type: 'JsonObject?', description: 'Optional JSON object containing all component properties — modifiers, styling, content slots, onClick handlers, etc. Defaults to null.' },
      { name: 'children', type: 'List<UIComponent>?', description: 'Optional list of child UIComponent nodes that form the subtree beneath this node. Defaults to null.' },
    ],
    methods: [],
    innerClasses: [],
    usage: `// Deserialize a JSON string into a UIComponent tree
val json = Json { ignoreUnknownKeys = true }
val root = json.decodeFromString<UIComponent>(jsonString)

// The root component can then be passed to RenderComponent
RenderComponent(root)`,
    notes: 'UIComponent is the universal currency of the Ketoy rendering pipeline. All JSON UI definitions — whether loaded from a file, fetched from a server, or built via the DSL — are first deserialized into this format.',
    seeAlso: ['RenderComponent', 'JSONStringToUI'],
  },

  JSONStringToUI: {
    name: 'JSONStringToUI',
    kind: 'function',
    module: 'renderer',
    subpackage: 'core',
    category: 'Renderer',
    subcategory: 'Core',
    description: 'Top-level composable entry point that accepts a raw JSON string or wire-format string and renders it as a Jetpack Compose UI tree. The SDK auto-detects wire format (.ktw) vs plain JSON by inspecting magic bytes. Internally deserializes into a UIComponent, wraps rendering in a KetoyThemeProvider, and dispatches to RenderComponent. Prefer JSONBytesToUI() for .ktw wire payloads in production.',
    android: {
      packageName: 'com.developerstring.ketoy.renderer',
      annotations: ['@Composable'],
      imports: [
        'import androidx.compose.runtime.Composable',
        'import com.developerstring.ketoy.theme.KetoyColorScheme',
        'import com.developerstring.ketoy.theme.KetoyThemeProvider',
        'import kotlinx.serialization.json.Json',
      ],
      sourceCode: `@Composable
fun JSONStringToUI(
    value: String,
    colorScheme: KetoyColorScheme? = null,
) {
    val jsonConfig = Json {
        ignoreUnknownKeys = true
        encodeDefaults = false
    }
    val component = jsonConfig.decodeFromString<UIComponent>(value)

    if (colorScheme != null) {
        KetoyThemeProvider(colorScheme = colorScheme) {
            RenderComponent(component)
        }
    } else {
        KetoyThemeProvider {
            RenderComponent(component)
        }
    }
}`,
    },
    properties: [
      { name: 'value', type: 'String', description: 'Raw JSON string describing the UI tree. Must be a valid UIComponent JSON object.' },
      { name: 'colorScheme', type: 'KetoyColorScheme?', description: 'Optional custom colour scheme. When non-null, the tree is rendered inside a KetoyThemeProvider with this colour scheme. Defaults to null (uses the default theme).' },
    ],
    methods: [],
    innerClasses: [],
    usage: `// Render a JSON UI string with default theme
JSONStringToUI(value = jsonString)

// Render with a custom colour scheme
JSONStringToUI(
    value = jsonString,
    colorScheme = KetoyColorScheme(primary = "#6200EE")
)`,
    notes: 'Deprecated in favour of JSONBytesToUI(). JSONStringToUI() is kept for migration and testing only — wire bytes are the production path.',
    seeAlso: ['JSONBytesToUI', 'RenderComponent', 'UIComponent', 'KetoyThemeProvider'],
  },

  JSONBytesToUI: {
    name: 'JSONBytesToUI',
    kind: 'function',
    module: 'renderer',
    subpackage: 'core',
    category: 'Renderer',
    subcategory: 'Core',
    description: 'Production entry-point: accepts compressed .ktw wire bytes and renders them as a Jetpack Compose UI tree. Calls KetoyWireFormat.autoDecode() which auto-detects the format (gzip + MessagePack, gzip-only, aliased JSON, or plain JSON) and applies the correct decoding layers. Wraps rendering in KetoyThemeProvider. If decoding fails, renders a red error text instead of crashing. Prefer this over JSONStringToUI() — wire bytes are 10-15× smaller than raw JSON.',
    android: {
      packageName: 'com.developerstring.ketoy.renderer',
      annotations: ['@Composable'],
      imports: [
        'import androidx.compose.runtime.Composable',
        'import com.developerstring.ketoy.renderer.JSONBytesToUI',
        'import com.developerstring.ketoy.theme.KetoyColorScheme',
      ],
      sourceCode: `@Composable
fun JSONBytesToUI(
    data: ByteArray,
    colorScheme: KetoyColorScheme? = null,
) {
    val result = remember(data) {
        try {
            val element = KetoyWireFormat.autoDecode(data)
            Result.success(ketoyJson.decodeFromJsonElement<UIComponent>(element))
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    val component = result.getOrNull()
    if (component != null) {
        KetoyThemeProvider(colorScheme = colorScheme) {
            RenderComponent(component)
        }
    } else {
        Text("Ketoy: decode error — \${result.exceptionOrNull()?.message ?: "unknown"}")
    }
}`,
    },
    properties: [
      { name: 'data', type: 'ByteArray', description: 'Compressed wire bytes. Any format produced by the Ketoy wire pipeline is accepted: gzip+MessagePack (OPTIMIZED), gzip-only (GZIP_ONLY), aliased JSON (ALIASED), or plain JSON (NONE). autoDecode() detects the format automatically.' },
      { name: 'colorScheme', type: 'KetoyColorScheme?', description: 'Optional custom colour scheme. When non-null, the tree is rendered inside a KetoyThemeProvider with this colour scheme. Defaults to null (uses the current Material 3 theme).' },
    ],
    methods: [],
    innerClasses: [],
    usage: `// Minimal — render wire bytes fetched from any source
val wireBytes: ByteArray = fetchFromServer()
JSONBytesToUI(data = wireBytes)

// With a custom colour scheme
JSONBytesToUI(
    data = wireBytes,
    colorScheme = KetoyColorScheme(primary = "#6200EE")
)

// From a KNode DSL tree (e.g. for testing)
val node = KColumn { KText("Hello") }
JSONBytesToUI(data = node.toWireBytes())`,
    notes: 'This is the preferred rendering entry-point. KetoyCloudScreen, KetoyView, and all production screens call this internally. Use it directly only when you manage the network call yourself.',
    seeAlso: ['JSONStringToUI', 'KetoyWireFormat', 'RenderComponent', 'KetoyCloudScreen', 'KetoyCloudScreenFromWireBytes'],
  },

  RenderComponent: {
    name: 'RenderComponent',
    kind: 'function',
    module: 'renderer',
    subpackage: 'core',
    category: 'Renderer',
    subcategory: 'Core',
    description: 'Central dispatch composable that routes a UIComponent to its appropriate specialised renderer based on the component type string. Handles ~30 built-in types (layouts, widgets, scaffold family, data constructs) and falls back to custom widget parsers and the legacy component registry.',
    android: {
      packageName: 'com.developerstring.ketoy.renderer',
      annotations: ['@Composable'],
      imports: [
        'import androidx.compose.runtime.Composable',
        'import com.developerstring.ketoy.widget.KetoyWidgetRegistry',
        'import com.developerstring.ketoy.registry.KComponentRegistry',
      ],
      sourceCode: `@Composable
fun RenderComponent(component: UIComponent) {
    when (component.type.lowercase()) {
        // Layouts
        "column"    -> RenderColumn(component)
        "row"       -> RenderRow(component)
        "box"       -> RenderBox(component)
        "lazycolumn" -> RenderLazyColumn(component)
        "lazyrow"   -> RenderLazyRow(component)

        // Widgets
        "text"      -> RenderText(component)
        "textfield" -> RenderTextField(component)
        "button"    -> RenderButton(component)
        "spacer"    -> RenderSpacer(component)
        "card"      -> RenderCard(component)
        "image"     -> RenderImage(component)
        "icon"      -> RenderIcon(component)
        "iconbutton" -> RenderIconButton(component)
        "component" -> RenderCustomComponent(component)

        // Scaffold family
        "scaffold"             -> RenderScaffold(component)
        "topappbar"            -> RenderTopAppBar(component)
        "bottomappbar"         -> RenderBottomAppBar(component)
        "navigationbar"        -> RenderNavigationBar(component)
        "floatingactionbutton" -> RenderFloatingActionButton(component)
        "snackbar"             -> RenderSnackBar(component)
        "snackbarhost"         -> RenderSnackBarHost(component)
        "navigationdraweritem" -> RenderNavigationDrawerItem(component)
        "customnavigationitem" -> RenderCustomNavigationItem(component)
        "navigationrail"       -> RenderNavigationRail(component)
        "navigationrailitem"   -> RenderNavigationRailItem(component)
        "appbaraction"         -> RenderAppBarAction(component)
        "navigationbaritem"    -> {} // rendered by NavigationBar parent
        "modalbottomsheet"     -> RenderModalBottomSheet(component)

        // Data constructs
        "dataclass" -> { /* registers fields as KetoyVariables */ }
        "enum"      -> { /* registers enum values as KetoyVariables */ }

        // Fallback
        else -> {
            val widgetParser = KetoyWidgetRegistry.resolveParser(name)
            if (widgetParser != null) RenderCustomWidgetParser(widgetParser, component)
            else if (KComponentRegistry.get(name) != null) RenderRegisteredComponent(name, component)
            else Text("Unknown component: \${component.type}")
        }
    }
}`,
    },
    properties: [
      { name: 'component', type: 'UIComponent', description: 'The UI component node to render. The type field determines which specialised renderer is invoked.' },
    ],
    methods: [],
    innerClasses: [],
    usage: `// Render a single component
RenderComponent(uiComponent)

// Recursively render children
component.children?.forEach { child ->
    RenderComponent(child)
}`,
    notes: 'Component type matching is case-insensitive. Unrecognised types are resolved first via KetoyWidgetRegistry (custom parsers), then KComponentRegistry (legacy), and finally display an error text.',
    seeAlso: ['UIComponent', 'JSONStringToUI', 'KetoyWidgetRegistry', 'KComponentRegistry'],
  },

  RenderContentSlotFromJson: {
    name: 'RenderContentSlotFromJson',
    kind: 'function',
    module: 'renderer',
    subpackage: 'core',
    category: 'Renderer',
    subcategory: 'Core',
    description: 'Helper composable that renders a JSON array as a content slot. Each element in the array is deserialized into a UIComponent and rendered via RenderComponent. Used internally by scaffold and widget renderers for named slots like label, icon, title, etc.',
    android: {
      packageName: 'com.developerstring.ketoy.renderer',
      annotations: ['@Composable'],
      imports: [
        'import androidx.compose.runtime.Composable',
        'import kotlinx.serialization.json.JsonArray',
        'import kotlinx.serialization.json.Json',
      ],
      sourceCode: `@Composable
fun RenderContentSlotFromJson(contentArray: JsonArray) {
    contentArray.forEach { contentElement ->
        val contentComponent = Json.decodeFromJsonElement<UIComponent>(contentElement)
        RenderComponent(contentComponent)
    }
}`,
    },
    properties: [
      { name: 'contentArray', type: 'JsonArray', description: 'A JSON array where each element is a serialized UIComponent. All elements are rendered sequentially.' },
    ],
    methods: [],
    innerClasses: [],
    usage: `// Render a label slot from props
val labelContent = props["label"]?.jsonArray
labelContent?.let { RenderContentSlotFromJson(it) }`,
    notes: 'This is a convenience wrapper used extensively by scaffold renderers (e.g. TopAppBar title, NavigationBar icon) and the TextField renderer for its content slots.',
    seeAlso: ['RenderComponent', 'UIComponent'],
  },

  RenderCustomWidgetParser: {
    name: 'RenderCustomWidgetParser',
    kind: 'function',
    module: 'renderer',
    subpackage: 'core',
    category: 'Renderer',
    subcategory: 'Core',
    description: 'Internal bridge composable that connects the rendering pipeline with the custom widget extension system. Accepts a KetoyWidgetParser and a UIComponent, extracts the props JSON, calls getModel() to build the typed model, and then invokes parse() to render the widget.',
    android: {
      packageName: 'com.developerstring.ketoy.renderer',
      annotations: ['@Composable', '@Suppress("UNCHECKED_CAST")', 'internal'],
      imports: [
        'import androidx.compose.runtime.Composable',
        'import com.developerstring.ketoy.widget.KetoyWidgetParser',
        'import kotlinx.serialization.json.JsonObject',
      ],
      sourceCode: `@Composable
@Suppress("UNCHECKED_CAST")
internal fun <T> RenderCustomWidgetParser(
    parser: KetoyWidgetParser<T>,
    component: UIComponent
) {
    val json = component.props ?: JsonObject(emptyMap())
    val model = parser.getModel(json)
    parser.parse(model)
}`,
    },
    properties: [
      { name: 'parser', type: 'KetoyWidgetParser<T>', description: 'The custom widget parser that knows how to deserialize and render this widget type.' },
      { name: 'component', type: 'UIComponent', description: 'The UIComponent whose props are forwarded to the parser\'s getModel method.' },
    ],
    methods: [],
    innerClasses: [],
    usage: `// Called internally by RenderComponent for custom types
val widgetParser = KetoyWidgetRegistry.resolveParser(name)
if (widgetParser != null) {
    RenderCustomWidgetParser(widgetParser, component)
}`,
    notes: 'This is an internal function. To register custom widgets, use KetoyWidgetRegistry.register() and the framework will invoke this bridge automatically.',
    seeAlso: ['KetoyWidgetParser', 'KetoyWidgetRegistry', 'RenderComponent'],
  },

  /* ══════════════════════════════════════════════════════════════
   *  Renderer > Component  (ComponentRenderer.kt)
   * ══════════════════════════════════════════════════════════════ */

  RenderCustomComponent: {
    name: 'RenderCustomComponent',
    kind: 'function',
    module: 'renderer',
    subpackage: 'component',
    category: 'Renderer',
    subcategory: 'Component',
    description: 'Internal composable that handles the "component" type by looking up props.componentName in KComponentRegistry. Extracts properties from the nested "properties" JSON object and forwards them to the registered renderer lambda.',
    android: {
      packageName: 'com.developerstring.ketoy.renderer',
      annotations: ['@Composable', 'internal'],
      imports: [
        'import androidx.compose.material3.Text',
        'import androidx.compose.runtime.Composable',
        'import com.developerstring.ketoy.registry.KComponentRegistry',
        'import kotlinx.serialization.json.*',
      ],
      sourceCode: `@Composable
internal fun RenderCustomComponent(component: UIComponent) {
    val props = component.props ?: JsonObject(emptyMap())
    val componentName = props["componentName"]?.jsonPrimitive?.content ?: ""

    if (componentName.isEmpty()) {
        Text("Error: No component name specified")
        return
    }

    val componentInfo = KComponentRegistry.get(componentName)
    if (componentInfo == null) {
        Text("Error: Component '\$componentName' not registered")
        return
    }

    val properties = extractProperties(props["properties"]?.jsonObject)
    componentInfo.renderer?.let { it(properties) }
}`,
    },
    properties: [
      { name: 'component', type: 'UIComponent', description: 'The UIComponent with type "component". Must have props.componentName to look up the registered component.' },
    ],
    methods: [],
    innerClasses: [],
    usage: `// JSON triggering this renderer:
// { "type": "component", "props": { "componentName": "MyWidget", "properties": { "title": "Hello" } } }`,
    notes: 'Works in tandem with KComponentRegistry. The componentName must be pre-registered via KComponentRegistry.register().',
    seeAlso: ['RenderRegisteredComponent', 'KComponentRegistry', 'extractProperties'],
  },

  RenderRegisteredComponent: {
    name: 'RenderRegisteredComponent',
    kind: 'function',
    module: 'renderer',
    subpackage: 'component',
    category: 'Renderer',
    subcategory: 'Component',
    description: 'Internal composable that handles the fallback path where the component\'s type name itself is used as the KComponentRegistry key. Extracts all non-modifier props as typed values (String, Boolean, Int, Float, Double) and forwards them to the registered renderer.',
    android: {
      packageName: 'com.developerstring.ketoy.renderer',
      annotations: ['@Composable', 'internal'],
      imports: [
        'import androidx.compose.material3.Text',
        'import androidx.compose.runtime.Composable',
        'import com.developerstring.ketoy.registry.KComponentRegistry',
        'import kotlinx.serialization.json.*',
      ],
      sourceCode: `@Composable
internal fun RenderRegisteredComponent(componentName: String, component: UIComponent) {
    val componentInfo = KComponentRegistry.get(componentName)
    if (componentInfo == null) {
        Text("Error: Component '\$componentName' not registered")
        return
    }

    val props = component.props ?: JsonObject(emptyMap())
    val properties = mutableMapOf<String, Any>()

    props.forEach { (key, value) ->
        if (key != "modifier") {
            when (value) {
                is JsonPrimitive -> {
                    when {
                        value.isString -> properties[key] = value.content
                        value.booleanOrNull != null -> properties[key] = value.boolean
                        value.intOrNull != null -> properties[key] = value.int
                        value.floatOrNull != null -> properties[key] = value.float
                        value.doubleOrNull != null -> properties[key] = value.double
                        else -> properties[key] = value.content
                    }
                }
                else -> properties[key] = value.toString()
            }
        }
    }

    componentInfo.renderer?.let { it(properties) }
}`,
    },
    properties: [
      { name: 'componentName', type: 'String', description: 'The registry key to look up in KComponentRegistry.' },
      { name: 'component', type: 'UIComponent', description: 'The UIComponent whose props are extracted and forwarded to the registered renderer.' },
    ],
    methods: [],
    innerClasses: [],
    usage: `// Called from RenderComponent fallback when type matches a registered component name
// { "type": "MyCustomCard", "props": { "title": "Hello", "count": 5 } }`,
    notes: 'All props except "modifier" are extracted as typed Kotlin values. JSON primitives are automatically coerced to String, Boolean, Int, Float, or Double.',
    seeAlso: ['RenderCustomComponent', 'KComponentRegistry'],
  },

  extractProperties: {
    name: 'extractProperties',
    kind: 'function',
    module: 'renderer',
    subpackage: 'component',
    category: 'Renderer',
    subcategory: 'Component',
    description: 'Private helper that converts a JsonObject into a Map<String, Any> with automatic type coercion from JSON primitives to Kotlin types (String, Boolean, Int, Float, Double).',
    android: {
      packageName: 'com.developerstring.ketoy.renderer',
      annotations: ['private'],
      imports: [
        'import kotlinx.serialization.json.*',
      ],
      sourceCode: `private fun extractProperties(propsObject: JsonObject?): Map<String, Any> {
    if (propsObject == null) return emptyMap()
    val result = mutableMapOf<String, Any>()
    propsObject.forEach { (key, value) ->
        when (value) {
            is JsonPrimitive -> {
                when {
                    value.isString -> result[key] = value.content
                    value.booleanOrNull != null -> result[key] = value.boolean
                    value.intOrNull != null -> result[key] = value.int
                    value.floatOrNull != null -> result[key] = value.float
                    value.doubleOrNull != null -> result[key] = value.double
                    else -> result[key] = value.content
                }
            }
            else -> result[key] = value.toString()
        }
    }
    return result
}`,
    },
    properties: [
      { name: 'propsObject', type: 'JsonObject?', description: 'The JSON object to extract properties from. Returns an empty map if null.' },
    ],
    methods: [],
    innerClasses: [],
    usage: `// Used internally by RenderCustomComponent
val properties = extractProperties(props["properties"]?.jsonObject)`,
    notes: 'Non-primitive JSON values (objects, arrays) are converted to their toString() representation.',
    seeAlso: ['RenderCustomComponent'],
  },

  /* ══════════════════════════════════════════════════════════════
   *  Renderer > Layout  (LayoutRenderer.kt)
   * ══════════════════════════════════════════════════════════════ */

  RenderColumn: {
    name: 'RenderColumn',
    kind: 'function',
    module: 'renderer',
    subpackage: 'layout',
    category: 'Renderer',
    subcategory: 'Layout',
    description: 'Internal composable that renders a "column" UIComponent as a Jetpack Compose Column. Parses modifier, vertical arrangement, and horizontal alignment from props. Supports child weight modifiers for proportional sizing.',
    android: {
      packageName: 'com.developerstring.ketoy.renderer',
      annotations: ['@Composable', 'internal'],
      imports: [
        'import androidx.compose.foundation.layout.*',
        'import androidx.compose.runtime.Composable',
        'import androidx.compose.ui.Alignment',
        'import androidx.compose.ui.Modifier',
        'import com.developerstring.ketoy.parser.*',
        'import kotlinx.serialization.json.*',
      ],
      sourceCode: `@Composable
internal fun RenderColumn(component: UIComponent) {
    val modifier = component.props?.let { parseModifier(it) } ?: Modifier
    val verticalArrangement = component.props?.let { parseVerticalArrangement(it) } ?: Arrangement.Top
    val horizontalAlignment = component.props?.let { parseHorizontalAlignment(it) } ?: Alignment.Start

    Column(
        modifier = modifier,
        verticalArrangement = verticalArrangement,
        horizontalAlignment = horizontalAlignment
    ) {
        component.children?.forEach { child ->
            val childWeight = child.props?.get("modifier")?.jsonObject?.get("weight")?.jsonPrimitive?.floatOrNull
            if (childWeight != null) {
                Box(modifier = Modifier.weight(childWeight)) { RenderComponent(child) }
            } else {
                RenderComponent(child)
            }
        }
    }
}`,
    },
    properties: [
      { name: 'component', type: 'UIComponent', description: 'The UIComponent with type "column". Props may include modifier, verticalArrangement, horizontalAlignment. Children are rendered sequentially.' },
    ],
    methods: [],
    innerClasses: [],
    usage: `// JSON:
// { "type": "Column", "props": { "verticalArrangement": "spaceBetween" }, "children": [...] }`,
    notes: 'Children with a "weight" modifier prop are wrapped in a weighted Box for proportional sizing within the column.',
    seeAlso: ['RenderRow', 'RenderBox', 'parseModifier', 'parseVerticalArrangement'],
  },

  RenderRow: {
    name: 'RenderRow',
    kind: 'function',
    module: 'renderer',
    subpackage: 'layout',
    category: 'Renderer',
    subcategory: 'Layout',
    description: 'Internal composable that renders a "row" UIComponent as a Jetpack Compose Row. Parses modifier, horizontal arrangement, and vertical alignment from props. Supports child weight modifiers.',
    android: {
      packageName: 'com.developerstring.ketoy.renderer',
      annotations: ['@Composable', 'internal'],
      imports: [
        'import androidx.compose.foundation.layout.*',
        'import androidx.compose.runtime.Composable',
        'import androidx.compose.ui.Alignment',
        'import androidx.compose.ui.Modifier',
        'import com.developerstring.ketoy.parser.*',
        'import kotlinx.serialization.json.*',
      ],
      sourceCode: `@Composable
internal fun RenderRow(component: UIComponent) {
    val modifier = component.props?.let { parseModifier(it) } ?: Modifier
    val horizontalArrangement = component.props?.let { parseHorizontalArrangement(it) } ?: Arrangement.Start
    val verticalAlignment = component.props?.let { parseVerticalAlignment(it) } ?: Alignment.Top

    Row(
        modifier = modifier,
        horizontalArrangement = horizontalArrangement,
        verticalAlignment = verticalAlignment
    ) {
        component.children?.forEach { child ->
            val childWeight = child.props?.get("modifier")?.jsonObject?.get("weight")?.jsonPrimitive?.floatOrNull
            if (childWeight != null) {
                Box(modifier = Modifier.weight(childWeight)) { RenderComponent(child) }
            } else {
                RenderComponent(child)
            }
        }
    }
}`,
    },
    properties: [
      { name: 'component', type: 'UIComponent', description: 'The UIComponent with type "row". Props may include modifier, horizontalArrangement, verticalAlignment.' },
    ],
    methods: [],
    innerClasses: [],
    usage: `// JSON:
// { "type": "Row", "props": { "horizontalArrangement": "spaceEvenly" }, "children": [...] }`,
    notes: 'Children with a "weight" modifier prop are wrapped in a weighted Box.',
    seeAlso: ['RenderColumn', 'RenderBox', 'parseModifier', 'parseHorizontalArrangement'],
  },

  RenderBox: {
    name: 'RenderBox',
    kind: 'function',
    module: 'renderer',
    subpackage: 'layout',
    category: 'Renderer',
    subcategory: 'Layout',
    description: 'Internal composable that renders a "box" UIComponent as a Jetpack Compose Box. Parses modifier and content alignment from props. Children are stacked on top of each other.',
    android: {
      packageName: 'com.developerstring.ketoy.renderer',
      annotations: ['@Composable', 'internal'],
      imports: [
        'import androidx.compose.foundation.layout.Box',
        'import androidx.compose.runtime.Composable',
        'import androidx.compose.ui.Alignment',
        'import androidx.compose.ui.Modifier',
        'import com.developerstring.ketoy.parser.*',
        'import kotlinx.serialization.json.*',
      ],
      sourceCode: `@Composable
internal fun RenderBox(component: UIComponent) {
    val modifier = component.props?.let { parseModifier(it) } ?: Modifier
    val contentAlignment = component.props?.let { parseContentAlignment(it) } ?: Alignment.TopStart

    Box(modifier = modifier, contentAlignment = contentAlignment) {
        component.children?.forEach { child -> RenderComponent(child) }
    }
}`,
    },
    properties: [
      { name: 'component', type: 'UIComponent', description: 'The UIComponent with type "box". Props may include modifier, contentAlignment.' },
    ],
    methods: [],
    innerClasses: [],
    usage: `// JSON:
// { "type": "Box", "props": { "contentAlignment": "center" }, "children": [...] }`,
    notes: 'Unlike Column and Row, Box does not support child weight modifiers — children are overlaid.',
    seeAlso: ['RenderColumn', 'RenderRow', 'parseContentAlignment'],
  },

  RenderLazyColumn: {
    name: 'RenderLazyColumn',
    kind: 'function',
    module: 'renderer',
    subpackage: 'layout',
    category: 'Renderer',
    subcategory: 'Layout',
    description: 'Internal composable that renders a "lazycolumn" UIComponent as a vertically-scrolling LazyColumn. Supports userScrollEnabled, reverseLayout, contentPadding, arrangement, and alignment props.',
    android: {
      packageName: 'com.developerstring.ketoy.renderer',
      annotations: ['@Composable', 'internal'],
      imports: [
        'import androidx.compose.foundation.layout.PaddingValues',
        'import androidx.compose.foundation.lazy.LazyColumn',
        'import androidx.compose.foundation.lazy.items',
        'import androidx.compose.runtime.Composable',
        'import androidx.compose.ui.unit.dp',
        'import com.developerstring.ketoy.parser.*',
        'import kotlinx.serialization.json.*',
      ],
      sourceCode: `@Composable
internal fun RenderLazyColumn(component: UIComponent) {
    val props = component.props ?: JsonObject(emptyMap())
    val modifier = parseModifier(props)
    val verticalArrangement = parseVerticalArrangement(props)
    val horizontalAlignment = parseHorizontalAlignment(props)
    val userScrollEnabled = props["userScrollEnabled"]?.jsonPrimitive?.booleanOrNull ?: true
    val reverseLayout = props["reverseLayout"]?.jsonPrimitive?.booleanOrNull ?: false
    val contentPadding = props["contentPadding"]?.let { parsePadding(it) } ?: PaddingValues(0.dp)

    LazyColumn(
        modifier = modifier,
        verticalArrangement = verticalArrangement,
        horizontalAlignment = horizontalAlignment,
        userScrollEnabled = userScrollEnabled,
        reverseLayout = reverseLayout,
        contentPadding = contentPadding
    ) {
        component.children?.let { children ->
            items(children) { child -> RenderComponent(child) }
        }
    }
}`,
    },
    properties: [
      { name: 'component', type: 'UIComponent', description: 'The UIComponent with type "lazycolumn". Additional props: userScrollEnabled (Boolean), reverseLayout (Boolean), contentPadding (JSON padding).' },
    ],
    methods: [],
    innerClasses: [],
    usage: `// JSON:
// { "type": "LazyColumn", "props": { "reverseLayout": false, "contentPadding": 16 }, "children": [...] }`,
    notes: 'All children are rendered as lazy items. For large lists this provides virtualised scrolling with only visible items composed.',
    seeAlso: ['RenderLazyRow', 'RenderColumn', 'parsePadding'],
  },

  RenderLazyRow: {
    name: 'RenderLazyRow',
    kind: 'function',
    module: 'renderer',
    subpackage: 'layout',
    category: 'Renderer',
    subcategory: 'Layout',
    description: 'Internal composable that renders a "lazyrow" UIComponent as a horizontally-scrolling LazyRow. Supports userScrollEnabled, reverseLayout, contentPadding, arrangement, and alignment props.',
    android: {
      packageName: 'com.developerstring.ketoy.renderer',
      annotations: ['@Composable', 'internal'],
      imports: [
        'import androidx.compose.foundation.layout.PaddingValues',
        'import androidx.compose.foundation.lazy.LazyRow',
        'import androidx.compose.foundation.lazy.items',
        'import androidx.compose.runtime.Composable',
        'import androidx.compose.ui.unit.dp',
        'import com.developerstring.ketoy.parser.*',
        'import kotlinx.serialization.json.*',
      ],
      sourceCode: `@Composable
internal fun RenderLazyRow(component: UIComponent) {
    val props = component.props ?: JsonObject(emptyMap())
    val modifier = parseModifier(props)
    val horizontalArrangement = parseHorizontalArrangement(props)
    val verticalAlignment = parseVerticalAlignment(props)
    val userScrollEnabled = props["userScrollEnabled"]?.jsonPrimitive?.booleanOrNull ?: true
    val reverseLayout = props["reverseLayout"]?.jsonPrimitive?.booleanOrNull ?: false
    val contentPadding = props["contentPadding"]?.let { parsePadding(it) } ?: PaddingValues(0.dp)

    LazyRow(
        modifier = modifier,
        horizontalArrangement = horizontalArrangement,
        verticalAlignment = verticalAlignment,
        userScrollEnabled = userScrollEnabled,
        reverseLayout = reverseLayout,
        contentPadding = contentPadding
    ) {
        component.children?.let { children ->
            items(children) { child -> RenderComponent(child) }
        }
    }
}`,
    },
    properties: [
      { name: 'component', type: 'UIComponent', description: 'The UIComponent with type "lazyrow". Additional props: userScrollEnabled (Boolean), reverseLayout (Boolean), contentPadding (JSON padding).' },
    ],
    methods: [],
    innerClasses: [],
    usage: `// JSON:
// { "type": "LazyRow", "props": { "userScrollEnabled": true }, "children": [...] }`,
    notes: 'Horizontal counterpart of RenderLazyColumn.',
    seeAlso: ['RenderLazyColumn', 'RenderRow', 'parsePadding'],
  },

  /* ══════════════════════════════════════════════════════════════
   *  Renderer > Action  (OnClickResolver.kt)
   * ══════════════════════════════════════════════════════════════ */

  OnClickResolver: {
    name: 'OnClickResolver',
    kind: 'object',
    module: 'renderer',
    subpackage: 'action',
    category: 'Renderer',
    subcategory: 'Action',
    description: 'Singleton object that converts raw JSON onClick elements into executable () -> Unit lambdas. Supports three JSON formats: a primitive string (legacy ActionRegistry lookup), a JSON object (KetoyActionRegistry parser dispatch), or a JSON array (sequential execution of multiple actions).',
    android: {
      packageName: 'com.developerstring.ketoy.renderer',
      annotations: ['internal'],
      imports: [
        'import android.content.Context',
        'import com.developerstring.ketoy.core.ActionRegistry',
        'import com.developerstring.ketoy.navigation.KetoyNavController',
        'import com.developerstring.ketoy.widget.ActionContext',
        'import com.developerstring.ketoy.widget.KetoyActionRegistry',
        'import kotlinx.serialization.json.*',
      ],
      sourceCode: `internal object OnClickResolver {

    fun resolve(
        element: JsonElement?,
        context: Context,
        navController: KetoyNavController? = null
    ): (() -> Unit)? {
        if (element == null) return null

        return when (element) {
            is JsonPrimitive -> {
                val id = element.content
                val action: () -> Unit = { ActionRegistry.get(id)?.invoke() }
                action
            }
            is JsonObject -> {
                resolveJsonAction(element, context, navController)
            }
            is JsonArray -> {
                val callbacks = element.mapNotNull { el ->
                    if (el is JsonObject) resolveJsonAction(el, context, navController) else null
                }
                if (callbacks.isNotEmpty()) {
                    val action: () -> Unit = { callbacks.forEach { it.invoke() } }
                    action
                } else null
            }
            else -> null
        }
    }

    @Suppress("UNCHECKED_CAST")
    private fun resolveJsonAction(
        json: JsonObject,
        context: Context,
        navController: KetoyNavController?
    ): (() -> Unit)? {
        val actionType = json["actionType"]?.jsonPrimitive?.content ?: return null
        val parser = KetoyActionRegistry.get<Any>(actionType) ?: return null

        return {
            try {
                val model = parser.getModel(json)
                parser.onCall(model, ActionContext(androidContext = context, navController = navController))
            } catch (e: Exception) {
                android.util.Log.e("OnClickResolver", "Error in '\$actionType': \${e.message}", e)
            }
        }
    }
}`,
    },
    methods: [
      { name: 'resolve(element: JsonElement?, context: Context, navController: KetoyNavController?)', returns: '(() -> Unit)?', description: 'Convert a JSON element into an executable lambda. Handles JsonPrimitive (legacy string ID), JsonObject (action with actionType), and JsonArray (sequential multi-action). Returns null if element is null or unresolvable.' },
      { name: 'resolveJsonAction(json: JsonObject, context: Context, navController: KetoyNavController?)', returns: '(() -> Unit)?', description: 'Private. Resolves a single JSON action object by looking up the actionType in KetoyActionRegistry, parsing the model, and wrapping the execution in a lambda with error handling.' },
    ],
    properties: [],
    innerClasses: [],
    usage: `// Used internally by all interactive renderers:
val onClickAction = OnClickResolver.resolve(props["onClick"], context, navController)
Button(onClick = { onClickAction?.invoke() }) { ... }

// JSON formats supported:
// String:  "onClick": "myActionId"
// Object:  "onClick": { "actionType": "navigate", "routeName": "detail" }
// Array:   "onClick": [{ "actionType": "navigate", ... }, { "actionType": "callFunction", ... }]`,
    notes: 'String-based onClick uses the legacy ActionRegistry. Object and array formats use KetoyActionRegistry with typed action parsers. Errors during action execution are logged but do not crash.',
    seeAlso: ['ActionRegistry', 'KetoyActionRegistry', 'ActionContext'],
  },

  /* ══════════════════════════════════════════════════════════════
   *  Renderer > Scaffold  (ScaffoldRenderer.kt)
   * ══════════════════════════════════════════════════════════════ */

  RenderScaffold: {
    name: 'RenderScaffold',
    kind: 'function',
    module: 'renderer',
    subpackage: 'scaffold',
    category: 'Renderer',
    subcategory: 'Scaffold',
    description: 'Internal composable that renders a "scaffold" UIComponent as a Material 3 Scaffold. Supports slot-based content: topBar, bottomBar, snackbarHost, floatingActionButton. Children are rendered inside a padded Box as body content.',
    android: {
      packageName: 'com.developerstring.ketoy.renderer',
      annotations: ['@Composable', 'internal', '@OptIn(ExperimentalMaterial3Api::class)'],
      imports: [
        'import androidx.compose.foundation.layout.*',
        'import androidx.compose.material3.*',
        'import androidx.compose.runtime.*',
        'import com.developerstring.ketoy.parser.*',
        'import kotlinx.serialization.json.*',
      ],
      sourceCode: `@OptIn(ExperimentalMaterial3Api::class)
@Composable
internal fun RenderScaffold(component: UIComponent) {
    val props = component.props ?: JsonObject(emptyMap())
    val modifier = parseModifier(props)
    val containerColor = resolveKetoyColorOrNull(props["containerColor"]?.jsonPrimitive?.contentOrNull)
        ?: MaterialTheme.colorScheme.background
    val contentColor = resolveKetoyColorOrNull(props["contentColor"]?.jsonPrimitive?.contentOrNull)
        ?: MaterialTheme.colorScheme.onBackground
    val contentWindowInsets = props["contentWindowInsets"]?.jsonObject
        ?.let { parseWindowInsets(it) } ?: ScaffoldDefaults.contentWindowInsets

    val topBarContent = props["topBar"]?.jsonArray
    val bottomBarContent = props["bottomBar"]?.jsonArray
    val snackbarHostContent = props["snackbarHost"]?.jsonArray
    val fabContent = props["floatingActionButton"]?.jsonArray
    val fabPosition = parseFabPosition(
        props["floatingActionButtonPosition"]?.jsonPrimitive?.contentOrNull
    )

    Scaffold(
        modifier = modifier,
        topBar = { topBarContent?.forEach { RenderComponent(Json.decodeFromJsonElement(it)) } },
        bottomBar = { bottomBarContent?.forEach { RenderComponent(Json.decodeFromJsonElement(it)) } },
        snackbarHost = { /* ... */ },
        floatingActionButton = { fabContent?.forEach { RenderComponent(Json.decodeFromJsonElement(it)) } },
        floatingActionButtonPosition = fabPosition,
        containerColor = containerColor,
        contentColor = contentColor,
        contentWindowInsets = contentWindowInsets
    ) { paddingValues ->
        Box(modifier = Modifier.padding(paddingValues)) {
            component.children?.forEach { child -> RenderComponent(child) }
        }
    }
}`,
    },
    properties: [
      { name: 'component', type: 'UIComponent', description: 'The UIComponent with type "scaffold". Slot props: topBar, bottomBar, snackbarHost, floatingActionButton (all JsonArray). Styling: containerColor, contentColor, contentWindowInsets, floatingActionButtonPosition.' },
    ],
    methods: [],
    innerClasses: [],
    usage: `// JSON:
// { "type": "Scaffold", "props": { "topBar": [...], "bottomBar": [...], "containerColor": "@theme/background" }, "children": [...] }`,
    notes: 'All slot props (topBar, bottomBar, etc.) are JSON arrays of UIComponent objects rendered in the corresponding Scaffold slot. Body children are rendered inside a padding-aware Box.',
    seeAlso: ['RenderTopAppBar', 'RenderBottomAppBar', 'RenderNavigationBar', 'RenderFloatingActionButton'],
  },

  RenderTopAppBar: {
    name: 'RenderTopAppBar',
    kind: 'function',
    module: 'renderer',
    subpackage: 'scaffold',
    category: 'Renderer',
    subcategory: 'Scaffold',
    description: 'Internal composable that renders a "topappbar" UIComponent. Supports four Material 3 variants via the "type" prop: small (default), centerAligned, medium, large. Includes title, navigationIcon, and actions slots.',
    android: {
      packageName: 'com.developerstring.ketoy.renderer',
      annotations: ['@Composable', 'internal', '@OptIn(ExperimentalMaterial3Api::class)'],
      imports: [
        'import androidx.compose.material3.*',
        'import androidx.compose.runtime.Composable',
        'import com.developerstring.ketoy.parser.*',
        'import kotlinx.serialization.json.*',
      ],
      sourceCode: `@OptIn(ExperimentalMaterial3Api::class)
@Composable
internal fun RenderTopAppBar(component: UIComponent) {
    val props = component.props ?: JsonObject(emptyMap())
    val modifier = parseModifier(props)
    val type = props["type"]?.jsonPrimitive?.contentOrNull ?: "small"
    val colors = props["colors"]?.jsonObject?.let { parseTopAppBarColors(it) }
        ?: TopAppBarDefaults.topAppBarColors()
    val windowInsets = props["windowInsets"]?.jsonObject?.let { parseWindowInsets(it) }
        ?: TopAppBarDefaults.windowInsets
    val scrollBehavior = props["scrollBehavior"]?.jsonObject
        ?.let { parseTopAppBarScrollBehavior(it) }
    // ... title, navigationIcon, actions slots
    when (type) {
        "centerAligned" -> CenterAlignedTopAppBar(...)
        "medium" -> MediumTopAppBar(...)
        "large" -> LargeTopAppBar(...)
        else -> TopAppBar(...)
    }
}`,
    },
    properties: [
      { name: 'component', type: 'UIComponent', description: 'Props: type ("small"|"centerAligned"|"medium"|"large"), title (JsonArray), navigationIcon (JsonArray), actions (JsonArray), colors (JsonObject), windowInsets (JsonObject), scrollBehavior (JsonObject).' },
    ],
    methods: [],
    innerClasses: [],
    usage: `// JSON:
// { "type": "TopAppBar", "props": { "type": "centerAligned", "title": [{ "type": "Text", "props": { "text": "Home" } }] } }`,
    notes: 'The "type" prop selects the Material 3 variant. Title, navigationIcon, and actions are content slots rendered as UIComponent arrays.',
    seeAlso: ['RenderScaffold', 'RenderAppBarAction', 'parseTopAppBarColors'],
  },

  RenderBottomAppBar: {
    name: 'RenderBottomAppBar',
    kind: 'function',
    module: 'renderer',
    subpackage: 'scaffold',
    category: 'Renderer',
    subcategory: 'Scaffold',
    description: 'Internal composable that renders a "bottomappbar" UIComponent as a Material 3 BottomAppBar. Supports containerColor, contentColor, tonalElevation, contentPadding, and windowInsets. Children are rendered as bar content.',
    android: {
      packageName: 'com.developerstring.ketoy.renderer',
      annotations: ['@Composable', 'internal'],
      imports: [
        'import androidx.compose.material3.*',
        'import com.developerstring.ketoy.parser.*',
        'import kotlinx.serialization.json.*',
      ],
      sourceCode: `@Composable
internal fun RenderBottomAppBar(component: UIComponent) {
    val props = component.props ?: JsonObject(emptyMap())
    val modifier = parseModifier(props)
    val containerColor = resolveKetoyColorOrNull(props["containerColor"]?.jsonPrimitive?.contentOrNull)
        ?: BottomAppBarDefaults.containerColor
    val contentColor = resolveKetoyColorOrNull(props["contentColor"]?.jsonPrimitive?.contentOrNull)
        ?: Color.Unspecified
    val tonalElevation = props["tonalElevation"]?.jsonPrimitive?.intOrNull?.dp
        ?: BottomAppBarDefaults.ContainerElevation
    val contentPadding = props["contentPadding"]?.let { parsePadding(it) }
        ?: BottomAppBarDefaults.ContentPadding
    val windowInsets = props["windowInsets"]?.jsonObject?.let { parseWindowInsets(it) }
        ?: BottomAppBarDefaults.windowInsets

    BottomAppBar(modifier = modifier, containerColor = containerColor, /* ... */) {
        component.children?.forEach { child -> RenderComponent(child) }
    }
}`,
    },
    properties: [
      { name: 'component', type: 'UIComponent', description: 'Props: containerColor, contentColor, tonalElevation (Int dp), contentPadding, windowInsets. Children rendered as bar content.' },
    ],
    methods: [],
    innerClasses: [],
    usage: `// JSON:
// { "type": "BottomAppBar", "props": { "containerColor": "@theme/surface" }, "children": [...] }`,
    notes: 'Colours can reference the active Ketoy theme via @theme/ prefixed strings.',
    seeAlso: ['RenderScaffold', 'RenderNavigationBar'],
  },

  RenderNavigationBar: {
    name: 'RenderNavigationBar',
    kind: 'function',
    module: 'renderer',
    subpackage: 'scaffold',
    category: 'Renderer',
    subcategory: 'Scaffold',
    description: 'Internal composable that renders a "navigationbar" UIComponent as a Material 3 NavigationBar. Children with type "NavigationBarItem" are rendered via RenderNavigationBarItem within RowScope; other children are rendered normally.',
    android: {
      packageName: 'com.developerstring.ketoy.renderer',
      annotations: ['@Composable', 'internal'],
      imports: [
        'import androidx.compose.material3.*',
        'import com.developerstring.ketoy.parser.*',
        'import kotlinx.serialization.json.*',
      ],
      sourceCode: `@Composable
internal fun RenderNavigationBar(component: UIComponent) {
    val props = component.props ?: JsonObject(emptyMap())
    val modifier = parseModifier(props)
    val containerColor = resolveKetoyColorOrNull(props["containerColor"]?.jsonPrimitive?.contentOrNull)
        ?: NavigationBarDefaults.containerColor
    // ...
    NavigationBar(modifier = modifier, containerColor = containerColor, /* ... */) {
        component.children?.forEach { child ->
            if (child.type.equals("NavigationBarItem", ignoreCase = true)) {
                RenderNavigationBarItem(child)
            } else {
                RenderComponent(child)
            }
        }
    }
}`,
    },
    properties: [
      { name: 'component', type: 'UIComponent', description: 'Props: containerColor, contentColor, tonalElevation (Int dp), windowInsets. Children should be NavigationBarItem components.' },
    ],
    methods: [],
    innerClasses: [],
    usage: `// JSON:
// { "type": "NavigationBar", "children": [{ "type": "NavigationBarItem", "props": { "selected": true, "icon": [...], "label": [...] } }] }`,
    notes: 'Children typed "NavigationBarItem" are specially rendered within RowScope to satisfy Material 3 API requirements.',
    seeAlso: ['RenderNavigationBarItem', 'RenderScaffold'],
  },

  RenderNavigationBarItem: {
    name: 'RenderNavigationBarItem',
    kind: 'function',
    module: 'renderer',
    subpackage: 'scaffold',
    category: 'Renderer',
    subcategory: 'Scaffold',
    description: 'Internal composable extension on RowScope that renders a NavigationBarItem. Supports selected/unselected icon variants, label content, onClick actions, enabled state, alwaysShowLabel, and custom colours.',
    android: {
      packageName: 'com.developerstring.ketoy.renderer',
      annotations: ['@Composable', 'internal'],
      imports: [
        'import androidx.compose.foundation.layout.RowScope',
        'import androidx.compose.material3.*',
        'import com.developerstring.ketoy.parser.*',
        'import kotlinx.serialization.json.*',
      ],
      sourceCode: `@Composable
internal fun RowScope.RenderNavigationBarItem(component: UIComponent) {
    val props = component.props ?: JsonObject(emptyMap())
    val selected = props["selected"]?.jsonPrimitive?.booleanOrNull ?: false
    val onClickAction = OnClickResolver.resolve(props["onClick"], context, navController)
    val iconContent = props["icon"]?.jsonArray
    val selectedIconContent = props["selectedIcon"]?.jsonArray
    val labelContent = props["label"]?.jsonArray
    val colors = props["colors"]?.jsonObject?.let { parseNavigationBarItemColors(it) }
        ?: NavigationBarItemDefaults.colors()

    NavigationBarItem(
        selected = selected,
        onClick = { onClickAction?.invoke() },
        icon = { /* renders selectedIcon when selected, else icon */ },
        label = labelContent?.let { arr -> { arr.forEach { RenderComponent(Json.decodeFromJsonElement(it)) } } },
        alwaysShowLabel = alwaysShowLabel,
        colors = colors
    )
}`,
    },
    properties: [
      { name: 'component', type: 'UIComponent', description: 'Props: selected (Boolean), onClick, icon (JsonArray), selectedIcon (JsonArray), label (JsonArray), enabled (Boolean), alwaysShowLabel (Boolean), colors (JsonObject).' },
    ],
    methods: [],
    innerClasses: [],
    usage: `// Rendered automatically by RenderNavigationBar for NavigationBarItem children`,
    notes: 'This is a RowScope extension function, so it must be called inside a NavigationBar or similar RowScope container.',
    seeAlso: ['RenderNavigationBar', 'OnClickResolver', 'parseNavigationBarItemColors'],
  },

  RenderNavigationDrawerItem: {
    name: 'RenderNavigationDrawerItem',
    kind: 'function',
    module: 'renderer',
    subpackage: 'scaffold',
    category: 'Renderer',
    subcategory: 'Scaffold',
    description: 'Internal composable that renders a "navigationdraweritem" UIComponent as a Material 3 NavigationDrawerItem. Supports selected state, icon, label, badge content slots, onClick actions, and custom colours.',
    android: {
      packageName: 'com.developerstring.ketoy.renderer',
      annotations: ['@Composable', 'internal'],
      imports: [
        'import androidx.compose.material3.*',
        'import com.developerstring.ketoy.parser.*',
        'import kotlinx.serialization.json.*',
      ],
      sourceCode: `@Composable
internal fun RenderNavigationDrawerItem(component: UIComponent) {
    val props = component.props ?: JsonObject(emptyMap())
    val selected = props["selected"]?.jsonPrimitive?.booleanOrNull ?: false
    val onClickAction = OnClickResolver.resolve(props["onClick"], context, navController)
    val iconContent = props["icon"]?.jsonArray
    val labelContent = props["label"]?.jsonArray
    val badgeContent = props["badge"]?.jsonArray
    val colors = props["colors"]?.jsonObject?.let { parseNavigationDrawerItemColors(it) }
        ?: NavigationDrawerItemDefaults.colors()

    NavigationDrawerItem(
        label = { labelContent?.forEach { RenderComponent(Json.decodeFromJsonElement(it)) } },
        selected = selected,
        onClick = { onClickAction?.invoke() },
        icon = iconContent?.let { arr -> { arr.forEach { RenderComponent(Json.decodeFromJsonElement(it)) } } },
        badge = badgeContent?.let { arr -> { arr.forEach { RenderComponent(Json.decodeFromJsonElement(it)) } } },
        colors = colors
    )
}`,
    },
    properties: [
      { name: 'component', type: 'UIComponent', description: 'Props: selected (Boolean), onClick, icon (JsonArray), label (JsonArray), badge (JsonArray), colors (JsonObject).' },
    ],
    methods: [],
    innerClasses: [],
    usage: `// JSON:
// { "type": "NavigationDrawerItem", "props": { "selected": true, "label": [{ "type": "Text", "props": { "text": "Home" } }] } }`,
    notes: 'Icon and badge are optional content slots. Colours can be customised via the colors prop.',
    seeAlso: ['RenderCustomNavigationItem', 'RenderNavigationBar', 'parseNavigationDrawerItemColors'],
  },

  RenderCustomNavigationItem: {
    name: 'RenderCustomNavigationItem',
    kind: 'function',
    module: 'renderer',
    subpackage: 'scaffold',
    category: 'Renderer',
    subcategory: 'Scaffold',
    description: 'Internal composable that renders a "customnavigationitem" UIComponent as a fallback button-based navigation item. Supports selected/unselected styling with configurable container and content colours, icon/selectedIcon variants, and label.',
    android: {
      packageName: 'com.developerstring.ketoy.renderer',
      annotations: ['@Composable', 'internal'],
      imports: [
        'import androidx.compose.material3.*',
        'import com.developerstring.ketoy.parser.*',
        'import kotlinx.serialization.json.*',
      ],
      sourceCode: `@Composable
internal fun RenderCustomNavigationItem(component: UIComponent) {
    // Parses selected, onClick, icon, selectedIcon, label
    // Uses Button with custom containerColor/contentColor based on selected state
    Button(
        onClick = { onClickAction?.invoke() },
        colors = ButtonDefaults.buttonColors(
            containerColor = if (selected) selectedContainerColor ?: ... else containerColor ?: ...,
            contentColor = if (selected) selectedContentColor ?: ... else contentColor ?: ...
        )
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            // icon or selectedIcon
            // label (if alwaysShowLabel or selected)
        }
    }
}`,
    },
    properties: [
      { name: 'component', type: 'UIComponent', description: 'Props: selected (Boolean), onClick, icon (JsonArray), selectedIcon (JsonArray), label (JsonArray), enabled (Boolean), alwaysShowLabel (Boolean), containerColor, selectedContainerColor, contentColor, selectedContentColor.' },
    ],
    methods: [],
    innerClasses: [],
    usage: `// JSON:
// { "type": "CustomNavigationItem", "props": { "selected": false, "containerColor": "#FFFFFF", "icon": [...] } }`,
    notes: 'This is a fallback for custom-styled navigation items that do not fit the Material 3 NavigationBarItem or NavigationDrawerItem patterns.',
    seeAlso: ['RenderNavigationBarItem', 'RenderNavigationDrawerItem'],
  },

  RenderFloatingActionButton: {
    name: 'RenderFloatingActionButton',
    kind: 'function',
    module: 'renderer',
    subpackage: 'scaffold',
    category: 'Renderer',
    subcategory: 'Scaffold',
    description: 'Internal composable that renders a "floatingactionbutton" UIComponent. Supports four Material 3 variants via the "type" prop: regular (default), small, large, extended. Includes onClick, shape, containerColor, contentColor, and elevation.',
    android: {
      packageName: 'com.developerstring.ketoy.renderer',
      annotations: ['@Composable', 'internal'],
      imports: [
        'import androidx.compose.material3.*',
        'import com.developerstring.ketoy.parser.*',
        'import kotlinx.serialization.json.*',
      ],
      sourceCode: `@Composable
internal fun RenderFloatingActionButton(component: UIComponent) {
    val props = component.props ?: JsonObject(emptyMap())
    val onClickAction = OnClickResolver.resolve(props["onClick"], context, navController)
    val type = props["type"]?.jsonPrimitive?.contentOrNull ?: "regular"
    val shape = props["shape"]?.jsonPrimitive?.contentOrNull?.let { parseShape(it) }
        ?: FloatingActionButtonDefaults.shape
    val containerColor = resolveKetoyColorOrNull(props["containerColor"]?.jsonPrimitive?.contentOrNull)
        ?: FloatingActionButtonDefaults.containerColor
    val elevation = props["elevation"]?.jsonObject?.let { parseFabElevation(it) }
        ?: FloatingActionButtonDefaults.elevation()

    when (type) {
        "small" -> SmallFloatingActionButton(onClick = { onClickAction?.invoke() }, ...)
        "large" -> LargeFloatingActionButton(onClick = { onClickAction?.invoke() }, ...)
        "extended" -> ExtendedFloatingActionButton(onClick = { onClickAction?.invoke() }, text = {...}, icon = {...})
        else -> FloatingActionButton(onClick = { onClickAction?.invoke() }, ...)
    }
}`,
    },
    properties: [
      { name: 'component', type: 'UIComponent', description: 'Props: type ("regular"|"small"|"large"|"extended"), onClick, shape, containerColor, contentColor, elevation (JsonObject). Children rendered as FAB content.' },
    ],
    methods: [],
    innerClasses: [],
    usage: `// JSON:
// { "type": "FloatingActionButton", "props": { "type": "extended", "onClick": { "actionType": "navigate", "routeName": "add" } }, "children": [...] }`,
    notes: 'Extended FAB automatically splits children — Text children go to the text slot, non-Text children to the icon slot.',
    seeAlso: ['RenderScaffold', 'OnClickResolver', 'parseFabElevation'],
  },

  RenderSnackBar: {
    name: 'RenderSnackBar',
    kind: 'function',
    module: 'renderer',
    subpackage: 'scaffold',
    category: 'Renderer',
    subcategory: 'Scaffold',
    description: 'Internal composable that renders a "snackbar" UIComponent as a Material 3 Snackbar. Supports message text, action and dismissAction content slots, actionOnNewLine, shape, and colour customisation.',
    android: {
      packageName: 'com.developerstring.ketoy.renderer',
      annotations: ['@Composable', 'internal'],
      imports: [
        'import androidx.compose.material3.*',
        'import com.developerstring.ketoy.parser.*',
        'import kotlinx.serialization.json.*',
      ],
      sourceCode: `@Composable
internal fun RenderSnackBar(component: UIComponent) {
    val props = component.props ?: JsonObject(emptyMap())
    val message = props["message"]?.jsonPrimitive?.contentOrNull ?: ""
    val actionContent = props["action"]?.jsonArray
    val dismissActionContent = props["dismissAction"]?.jsonArray
    // ... shape, colours, actionOnNewLine
    Snackbar(
        action = actionContent?.let { arr -> { arr.forEach { ... } } },
        dismissAction = dismissActionContent?.let { arr -> { arr.forEach { ... } } },
        // ...
    ) {
        if (message.isNotEmpty()) Text(text = message)
        component.children?.forEach { child -> RenderComponent(child) }
    }
}`,
    },
    properties: [
      { name: 'component', type: 'UIComponent', description: 'Props: message (String), action (JsonArray), dismissAction (JsonArray), actionOnNewLine (Boolean), shape, containerColor, contentColor, actionContentColor, dismissActionContentColor.' },
    ],
    methods: [],
    innerClasses: [],
    usage: `// JSON:
// { "type": "Snackbar", "props": { "message": "Item deleted", "action": [{ "type": "Text", "props": { "text": "Undo" } }] } }`,
    notes: 'Body content can come from both the message prop and children. Action and dismissAction are content slots.',
    seeAlso: ['RenderSnackBarHost', 'RenderScaffold'],
  },

  RenderSnackBarHost: {
    name: 'RenderSnackBarHost',
    kind: 'function',
    module: 'renderer',
    subpackage: 'scaffold',
    category: 'Renderer',
    subcategory: 'Scaffold',
    description: 'Internal composable that renders a "snackbarhost" UIComponent as a Material 3 SnackbarHost wrapper. Manages a SnackbarHostState and optionally renders custom snackbar content from the "snackbar" prop.',
    android: {
      packageName: 'com.developerstring.ketoy.renderer',
      annotations: ['@Composable', 'internal'],
      imports: [
        'import androidx.compose.material3.*',
        'import androidx.compose.runtime.remember',
        'import com.developerstring.ketoy.parser.*',
        'import kotlinx.serialization.json.*',
      ],
      sourceCode: `@Composable
internal fun RenderSnackBarHost(component: UIComponent) {
    val props = component.props ?: JsonObject(emptyMap())
    val modifier = parseModifier(props)
    val snackbarContent = props["snackbar"]?.jsonArray
    val hostState = remember { SnackbarHostState() }

    if (snackbarContent != null) {
        SnackbarHost(hostState = hostState, modifier = modifier) {
            snackbarContent.forEach { RenderComponent(Json.decodeFromJsonElement(it)) }
        }
    } else {
        SnackbarHost(hostState = hostState, modifier = modifier)
    }
}`,
    },
    properties: [
      { name: 'component', type: 'UIComponent', description: 'Props: modifier, snackbar (JsonArray of custom snackbar UIComponents).' },
    ],
    methods: [],
    innerClasses: [],
    usage: `// JSON:
// { "type": "SnackbarHost", "props": { "snackbar": [{ "type": "Snackbar", "props": { "message": "Saved" } }] } }`,
    notes: 'When the snackbar prop is absent, a default SnackbarHost with no custom content is rendered.',
    seeAlso: ['RenderSnackBar', 'RenderScaffold'],
  },

  RenderAppBarAction: {
    name: 'RenderAppBarAction',
    kind: 'function',
    module: 'renderer',
    subpackage: 'scaffold',
    category: 'Renderer',
    subcategory: 'Scaffold',
    description: 'Internal composable that renders an "appbaraction" UIComponent as an IconButton wrapper, typically used within TopAppBar actions. Supports onClick, enabled, and custom icon button colours.',
    android: {
      packageName: 'com.developerstring.ketoy.renderer',
      annotations: ['@Composable', 'internal'],
      imports: [
        'import androidx.compose.material3.*',
        'import com.developerstring.ketoy.parser.*',
        'import kotlinx.serialization.json.*',
      ],
      sourceCode: `@Composable
internal fun RenderAppBarAction(component: UIComponent) {
    val props = component.props ?: JsonObject(emptyMap())
    val modifier = parseModifier(props)
    val enabled = props["enabled"]?.jsonPrimitive?.booleanOrNull ?: true
    val colors = props["colors"]?.jsonObject?.let { parseIconButtonColors(it) }
        ?: IconButtonDefaults.iconButtonColors()
    val resolvedClick = OnClickResolver.resolve(props["onClick"], context, navController)

    IconButton(
        onClick = { resolvedClick?.invoke() },
        modifier = modifier,
        enabled = enabled,
        colors = colors
    ) {
        component.children?.forEach { child -> RenderComponent(child) }
    }
}`,
    },
    properties: [
      { name: 'component', type: 'UIComponent', description: 'Props: onClick, enabled (Boolean), colors (JsonObject), modifier. Children are rendered as IconButton content (typically an Icon).' },
    ],
    methods: [],
    innerClasses: [],
    usage: `// JSON (inside TopAppBar actions):
// { "type": "AppBarAction", "props": { "onClick": "search" }, "children": [{ "type": "Icon", "props": { "icon": "Search" } }] }`,
    notes: 'Designed to be used inside TopAppBar actions slot. Wraps an IconButton with click resolution.',
    seeAlso: ['RenderTopAppBar', 'OnClickResolver', 'parseIconButtonColors'],
  },

  RenderNavigationRail: {
    name: 'RenderNavigationRail',
    kind: 'function',
    module: 'renderer',
    subpackage: 'scaffold',
    category: 'Renderer',
    subcategory: 'Scaffold',
    description: 'Internal composable that renders a "navigationrail" UIComponent as a Material 3 NavigationRail. Supports a header content slot, containerColor, contentColor, and windowInsets. Children are rendered as rail items.',
    android: {
      packageName: 'com.developerstring.ketoy.renderer',
      annotations: ['@Composable', 'internal'],
      imports: [
        'import androidx.compose.material3.*',
        'import com.developerstring.ketoy.parser.*',
        'import kotlinx.serialization.json.*',
      ],
      sourceCode: `@Composable
internal fun RenderNavigationRail(component: UIComponent) {
    val props = component.props ?: JsonObject(emptyMap())
    val modifier = parseModifier(props)
    val containerColor = resolveKetoyColorOrNull(props["containerColor"]?.jsonPrimitive?.contentOrNull)
        ?: NavigationRailDefaults.ContainerColor
    val headerContent = props["header"]?.jsonArray
    val windowInsets = props["windowInsets"]?.jsonObject?.let { parseWindowInsets(it) }
        ?: NavigationRailDefaults.windowInsets

    NavigationRail(modifier = modifier, containerColor = containerColor,
        header = headerContent?.let { arr -> { arr.forEach { RenderComponent(Json.decodeFromJsonElement(it)) } } },
        windowInsets = windowInsets
    ) {
        component.children?.forEach { child -> RenderComponent(child) }
    }
}`,
    },
    properties: [
      { name: 'component', type: 'UIComponent', description: 'Props: containerColor, contentColor, header (JsonArray), windowInsets. Children rendered as rail content (typically NavigationRailItem).' },
    ],
    methods: [],
    innerClasses: [],
    usage: `// JSON:
// { "type": "NavigationRail", "props": { "header": [...] }, "children": [{ "type": "NavigationRailItem", ... }] }`,
    notes: 'Navigation rail is typically used in tablet/desktop layouts alongside a content area.',
    seeAlso: ['RenderNavigationRailItem', 'RenderNavigationBar'],
  },

  RenderNavigationRailItem: {
    name: 'RenderNavigationRailItem',
    kind: 'function',
    module: 'renderer',
    subpackage: 'scaffold',
    category: 'Renderer',
    subcategory: 'Scaffold',
    description: 'Internal composable that renders a "navigationrailitem" UIComponent as a Material 3 NavigationRailItem. Supports selected state, icon/selectedIcon variants, label, onClick, enabled, and alwaysShowLabel.',
    android: {
      packageName: 'com.developerstring.ketoy.renderer',
      annotations: ['@Composable', 'internal'],
      imports: [
        'import androidx.compose.material3.*',
        'import com.developerstring.ketoy.parser.*',
        'import kotlinx.serialization.json.*',
      ],
      sourceCode: `@Composable
internal fun RenderNavigationRailItem(component: UIComponent) {
    val props = component.props ?: JsonObject(emptyMap())
    val selected = props["selected"]?.jsonPrimitive?.booleanOrNull ?: false
    val iconContent = props["icon"]?.jsonArray
    val selectedIconContent = props["selectedIcon"]?.jsonArray
    val labelContent = props["label"]?.jsonArray
    val resolvedClick = OnClickResolver.resolve(props["onClick"], context, navController)

    NavigationRailItem(
        selected = selected,
        onClick = { resolvedClick?.invoke() },
        icon = { /* selectedIcon if selected, else icon */ },
        label = labelContent?.let { arr -> { arr.forEach { RenderComponent(Json.decodeFromJsonElement(it)) } } },
        alwaysShowLabel = alwaysShowLabel
    )
}`,
    },
    properties: [
      { name: 'component', type: 'UIComponent', description: 'Props: selected (Boolean), onClick, icon (JsonArray), selectedIcon (JsonArray), label (JsonArray), enabled (Boolean), alwaysShowLabel (Boolean).' },
    ],
    methods: [],
    innerClasses: [],
    usage: `// JSON:
// { "type": "NavigationRailItem", "props": { "selected": true, "icon": [...], "label": [...] } }`,
    notes: 'Uses the same selected/unselected icon pattern as NavigationBarItem.',
    seeAlso: ['RenderNavigationRail', 'RenderNavigationBarItem'],
  },

  RenderModalBottomSheet: {
    name: 'RenderModalBottomSheet',
    kind: 'function',
    module: 'renderer',
    subpackage: 'scaffold',
    category: 'Renderer',
    subcategory: 'Scaffold',
    description: 'Internal composable that renders a "modalbottomsheet" UIComponent as a Material 3 ModalBottomSheet. Supports shape, containerColor, tonalElevation, scrimColor, dragHandle slot, and onDismissRequest action.',
    android: {
      packageName: 'com.developerstring.ketoy.renderer',
      annotations: ['@Composable', 'internal', '@OptIn(ExperimentalMaterial3Api::class)'],
      imports: [
        'import androidx.compose.material3.*',
        'import com.developerstring.ketoy.parser.*',
        'import kotlinx.serialization.json.*',
      ],
      sourceCode: `@OptIn(ExperimentalMaterial3Api::class)
@Composable
internal fun RenderModalBottomSheet(component: UIComponent) {
    val props = component.props ?: JsonObject(emptyMap())
    val shape = props["shape"]?.jsonPrimitive?.contentOrNull?.let { parseShape(it) }
        ?: BottomSheetDefaults.ExpandedShape
    val containerColor = resolveKetoyColorOrNull(props["containerColor"]?.jsonPrimitive?.contentOrNull)
        ?: BottomSheetDefaults.ContainerColor
    val scrimColor = resolveKetoyColorOrNull(props["scrimColor"]?.jsonPrimitive?.contentOrNull)
        ?: BottomSheetDefaults.ScrimColor
    val dragHandleContent = props["dragHandle"]?.jsonArray
    val resolvedDismiss = OnClickResolver.resolve(props["onDismissRequest"], context, navController)
    val sheetState = rememberModalBottomSheetState()

    ModalBottomSheet(
        onDismissRequest = { resolvedDismiss?.invoke() },
        sheetState = sheetState,
        shape = shape,
        containerColor = containerColor,
        scrimColor = scrimColor,
        dragHandle = dragHandleContent?.let { arr -> { arr.forEach { ... } } } ?: { BottomSheetDefaults.DragHandle() }
    ) {
        component.children?.forEach { child -> RenderComponent(child) }
    }
}`,
    },
    properties: [
      { name: 'component', type: 'UIComponent', description: 'Props: shape, containerColor, contentColor, tonalElevation (Int dp), scrimColor, dragHandle (JsonArray), onDismissRequest. Children rendered as sheet content.' },
    ],
    methods: [],
    innerClasses: [],
    usage: `// JSON:
// { "type": "ModalBottomSheet", "props": { "onDismissRequest": { "actionType": "pop" }, "shape": "roundedTop16" }, "children": [...] }`,
    notes: 'Uses ExperimentalMaterial3Api. The drag handle defaults to BottomSheetDefaults.DragHandle() if not provided.',
    seeAlso: ['RenderScaffold', 'OnClickResolver'],
  },

  /* ══════════════════════════════════════════════════════════════
   *  Renderer > TextField  (TextFieldRenderer.kt)
   * ══════════════════════════════════════════════════════════════ */

  RenderTextField: {
    name: 'RenderTextField',
    kind: 'function',
    module: 'renderer',
    subpackage: 'textfield',
    category: 'Renderer',
    subcategory: 'TextField',
    description: 'Internal composable that renders a "textfield" UIComponent as a Material 3 TextField. Supports full two-way data binding via KetoyVariableRegistry, content slots (label, placeholder, leading/trailing icons, prefix, suffix, supporting text), keyboard configuration, visual transformation, and custom colours.',
    android: {
      packageName: 'com.developerstring.ketoy.renderer',
      annotations: ['@Composable', 'internal'],
      imports: [
        'import androidx.compose.foundation.text.KeyboardActions',
        'import androidx.compose.foundation.text.KeyboardOptions',
        'import androidx.compose.material3.TextField',
        'import androidx.compose.material3.TextFieldDefaults',
        'import androidx.compose.runtime.*',
        'import com.developerstring.ketoy.core.ActionRegistry',
        'import com.developerstring.ketoy.core.KetoyVariableRegistry',
        'import com.developerstring.ketoy.parser.*',
        'import kotlinx.serialization.json.*',
      ],
      sourceCode: `@Composable
internal fun RenderTextField(component: UIComponent) {
    val props = component.props ?: JsonObject(emptyMap())

    val initialValue = KetoyVariableRegistry.resolveTemplate(
        props["value"]?.jsonPrimitive?.content ?: ""
    )
    var value by remember { mutableStateOf(initialValue) }
    val modifier = parseModifier(props)
    val enabled = props["enabled"]?.jsonPrimitive?.booleanOrNull ?: true
    val readOnly = props["readOnly"]?.jsonPrimitive?.booleanOrNull ?: false
    val singleLine = props["singleLine"]?.jsonPrimitive?.booleanOrNull ?: false
    val maxLines = props["maxLines"]?.jsonPrimitive?.intOrNull ?: if (singleLine) 1 else Int.MAX_VALUE
    val minLines = props["minLines"]?.jsonPrimitive?.intOrNull ?: 1
    val isError = props["isError"]?.jsonPrimitive?.booleanOrNull ?: false

    // Content slots: labelContent, placeholderContent, leadingIconContent,
    //   trailingIconContent, prefixContent, suffixContent, supportingTextContent

    TextField(
        value = value,
        onValueChange = { newValue ->
            value = newValue
            props["onValueChange"]?.jsonPrimitive?.content?.let { actionId ->
                ActionRegistry.getTextChange(actionId)?.invoke(newValue)
            }
        },
        modifier = modifier,
        enabled = enabled,
        label = labelContent?.let { { RenderContentSlotFromJson(it) } },
        placeholder = placeholderContent?.let { { RenderContentSlotFromJson(it) } },
        // ... all other slots and configuration
    )
}`,
    },
    properties: [
      { name: 'component', type: 'UIComponent', description: 'Props: value (String, supports variable templates), enabled, readOnly, singleLine, maxLines, minLines, isError (all Boolean/Int), onValueChange (action ID), textStyle, visualTransformation, keyboardOptions, keyboardActions, colors (all JsonObject). Content slots: labelContent, placeholderContent, leadingIconContent, trailingIconContent, prefixContent, suffixContent, supportingTextContent (all JsonArray).' },
    ],
    methods: [],
    innerClasses: [],
    usage: `// JSON:
// { "type": "TextField", "props": { "value": "{{username}}", "singleLine": true, "labelContent": [{ "type": "Text", "props": { "text": "Username" } }] } }`,
    notes: 'Initial value supports KetoyVariableRegistry template resolution (e.g. "{{variableName}}"). Value changes trigger registered ActionRegistry callbacks via the onValueChange action ID.',
    seeAlso: ['RenderContentSlotFromJson', 'KetoyVariableRegistry', 'ActionRegistry', 'parseTextStyle', 'parseKeyboardOptions'],
  },

  /* ══════════════════════════════════════════════════════════════
   *  Renderer > Widget  (WidgetRenderer.kt)
   * ══════════════════════════════════════════════════════════════ */

  rememberOnClick: {
    name: 'rememberOnClick',
    kind: 'function',
    module: 'renderer',
    subpackage: 'widget',
    category: 'Renderer',
    subcategory: 'Widget',
    description: 'Private composable helper that resolves an onClick action from the current composition context. Captures LocalContext and LocalKetoyNavController and delegates to OnClickResolver.resolve().',
    android: {
      packageName: 'com.developerstring.ketoy.renderer',
      annotations: ['@Composable', 'private'],
      imports: [
        'import androidx.compose.runtime.Composable',
        'import androidx.compose.ui.platform.LocalContext',
        'import com.developerstring.ketoy.navigation.LocalKetoyNavController',
        'import kotlinx.serialization.json.JsonObject',
      ],
      sourceCode: `@Composable
private fun rememberOnClick(props: JsonObject): (() -> Unit)? {
    val context = LocalContext.current
    val navController = LocalKetoyNavController.current
    val element = props["onClick"]
    return OnClickResolver.resolve(element, context, navController)
}`,
    },
    properties: [
      { name: 'props', type: 'JsonObject', description: 'The props JSON object from which onClick is extracted.' },
    ],
    methods: [],
    innerClasses: [],
    usage: `// Used internally by widget renderers:
val onClickAction = rememberOnClick(props)
Button(onClick = { onClickAction?.invoke() }) { ... }`,
    notes: 'This is a convenience wrapper used by RenderText, RenderButton, RenderCard, RenderImage, RenderIcon, and RenderIconButton.',
    seeAlso: ['OnClickResolver'],
  },

  RenderText: {
    name: 'RenderText',
    kind: 'function',
    module: 'renderer',
    subpackage: 'widget',
    category: 'Renderer',
    subcategory: 'Widget',
    description: 'Internal composable that renders a "text" UIComponent as a Material 3 Text. Supports text content with variable template resolution, fontSize, fontWeight, color (including @theme/ references), and textAlign.',
    android: {
      packageName: 'com.developerstring.ketoy.renderer',
      annotations: ['@Composable', 'internal'],
      imports: [
        'import androidx.compose.material3.Text',
        'import com.developerstring.ketoy.core.KetoyVariableRegistry',
        'import com.developerstring.ketoy.parser.*',
        'import kotlinx.serialization.json.*',
      ],
      sourceCode: `@Composable
internal fun RenderText(component: UIComponent) {
    val props = component.props ?: JsonObject(emptyMap())
    val rawText = props["text"]?.jsonPrimitive?.content ?: ""
    val resolvedText = KetoyVariableRegistry.resolveTemplate(rawText)
    val fontSize = props["fontSize"]?.jsonPrimitive?.intOrNull?.sp ?: 14.sp
    val fontWeight = when (props["fontWeight"]?.jsonPrimitive?.content) {
        "bold" -> FontWeight.Bold
        "normal" -> FontWeight.Normal
        "light" -> FontWeight.Light
        else -> FontWeight.Normal
    }
    val color = resolveKetoyColor(props["color"]?.jsonPrimitive?.content)
    val textAlign = when (props["textAlign"]?.jsonPrimitive?.content) {
        "center" -> TextAlign.Center
        "start" -> TextAlign.Start
        "end" -> TextAlign.End
        else -> TextAlign.Start
    }
    val modifier = parseModifier(props)

    Text(text = resolvedText, fontSize = fontSize, fontWeight = fontWeight,
         color = color, textAlign = textAlign, modifier = modifier)
}`,
    },
    properties: [
      { name: 'component', type: 'UIComponent', description: 'Props: text (String, supports {{variable}} templates), fontSize (Int sp), fontWeight ("bold"|"normal"|"light"), color (hex or @theme/ reference), textAlign ("center"|"start"|"end"), modifier.' },
    ],
    methods: [],
    innerClasses: [],
    usage: `// JSON:
// { "type": "Text", "props": { "text": "Hello {{username}}", "fontSize": 18, "fontWeight": "bold", "color": "@theme/primary" } }`,
    notes: 'Text content supports KetoyVariableRegistry template resolution. Colours can reference the Ketoy theme via @theme/ prefix.',
    seeAlso: ['KetoyVariableRegistry', 'resolveKetoyColor', 'parseModifier'],
  },

  RenderButton: {
    name: 'RenderButton',
    kind: 'function',
    module: 'renderer',
    subpackage: 'widget',
    category: 'Renderer',
    subcategory: 'Widget',
    description: 'Internal composable that renders a "button" UIComponent. Has two rendering paths: when the modifier has a custom background, renders as a styled clickable Box; otherwise renders as a standard Material 3 Button. Supports containerColor, shape, and fillMaxWidth.',
    android: {
      packageName: 'com.developerstring.ketoy.renderer',
      annotations: ['@Composable', 'internal'],
      imports: [
        'import androidx.compose.foundation.clickable',
        'import androidx.compose.foundation.layout.*',
        'import androidx.compose.material3.*',
        'import com.developerstring.ketoy.parser.*',
        'import kotlinx.serialization.json.*',
      ],
      sourceCode: `@Composable
internal fun RenderButton(component: UIComponent) {
    val props = component.props ?: JsonObject(emptyMap())
    val onClickAction = rememberOnClick(props)
    val hasCustomBackground = /* checks modifier.background */

    if (hasCustomBackground) {
        val modifier = parseModifier(props)
        Box(modifier = modifier.clickable { onClickAction?.invoke() }, contentAlignment = Alignment.Center) {
            Row(modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)) {
                component.children?.forEach { child -> RenderComponent(child) }
            }
        }
    } else {
        Button(onClick = { onClickAction?.invoke() }, modifier = buttonModifier,
            colors = if (containerColor != null) ButtonDefaults.buttonColors(containerColor = containerColor)
                     else ButtonDefaults.buttonColors(),
            shape = shape ?: ButtonDefaults.shape
        ) {
            component.children?.forEach { child -> RenderComponent(child) }
        }
    }
}`,
    },
    properties: [
      { name: 'component', type: 'UIComponent', description: 'Props: onClick, containerColor, shape, modifier (with fillMaxWidth, width, height, margin, padding, background). Children rendered inside the button.' },
    ],
    methods: [],
    innerClasses: [],
    usage: `// Standard button:
// { "type": "Button", "props": { "onClick": "submit" }, "children": [{ "type": "Text", "props": { "text": "Submit" } }] }
// Custom background button:
// { "type": "Button", "props": { "modifier": { "background": "#FF6200EE", "cornerRadius": 8 }, "onClick": "submit" }, "children": [...] }`,
    notes: 'When a custom background is specified in the modifier, the button renders as a Box with clickable modifier instead of a Material 3 Button, allowing full visual customisation.',
    seeAlso: ['rememberOnClick', 'parseModifier'],
  },

  RenderSpacer: {
    name: 'RenderSpacer',
    kind: 'function',
    module: 'renderer',
    subpackage: 'widget',
    category: 'Renderer',
    subcategory: 'Widget',
    description: 'Internal composable that renders a "spacer" UIComponent as a Jetpack Compose Spacer. Supports explicit width and height props.',
    android: {
      packageName: 'com.developerstring.ketoy.renderer',
      annotations: ['@Composable', 'internal'],
      imports: [
        'import androidx.compose.foundation.layout.Spacer',
        'import androidx.compose.ui.unit.dp',
        'import com.developerstring.ketoy.parser.*',
        'import kotlinx.serialization.json.*',
      ],
      sourceCode: `@Composable
internal fun RenderSpacer(component: UIComponent) {
    val props = component.props ?: JsonObject(emptyMap())
    val width = props["width"]?.jsonPrimitive?.intOrNull
    val height = props["height"]?.jsonPrimitive?.intOrNull
    val modifier = parseModifier(props)

    when {
        width != null && height != null -> Spacer(modifier = modifier.size(width.dp, height.dp))
        width != null -> Spacer(modifier = modifier.width(width.dp))
        height != null -> Spacer(modifier = modifier.height(height.dp))
        else -> Spacer(modifier = modifier)
    }
}`,
    },
    properties: [
      { name: 'component', type: 'UIComponent', description: 'Props: width (Int dp), height (Int dp), modifier.' },
    ],
    methods: [],
    innerClasses: [],
    usage: `// JSON:
// { "type": "Spacer", "props": { "height": 16 } }`,
    notes: 'If neither width nor height is specified, the spacer relies entirely on the modifier for sizing.',
    seeAlso: ['parseModifier'],
  },

  RenderCard: {
    name: 'RenderCard',
    kind: 'function',
    module: 'renderer',
    subpackage: 'widget',
    category: 'Renderer',
    subcategory: 'Widget',
    description: 'Internal composable that renders a "card" UIComponent as a Material 3 Card. Supports optional click behaviour, border, elevation, shape, and intelligent container colour handling — transparently defers to gradient/background when children or self have visual backgrounds.',
    android: {
      packageName: 'com.developerstring.ketoy.renderer',
      annotations: ['@Composable', 'internal'],
      imports: [
        'import androidx.compose.foundation.BorderStroke',
        'import androidx.compose.material3.*',
        'import com.developerstring.ketoy.parser.*',
        'import kotlinx.serialization.json.*',
      ],
      sourceCode: `@Composable
internal fun RenderCard(component: UIComponent) {
    val props = component.props ?: JsonObject(emptyMap())
    val containerColor = resolveKetoyColorOrNull(props["containerColor"]?.jsonPrimitive?.contentOrNull)
    val elevation = props["elevation"]?.jsonPrimitive?.intOrNull ?: 1
    val shape = props["shape"]?.jsonPrimitive?.contentOrNull?.let { parseShape(it) } ?: RoundedCornerShape(12.dp)
    val border = props["border"]?.jsonObject?.let { /* BorderStroke */ }
    val onClickAction = rememberOnClick(props)
    val hasOnClick = props["onClick"] != null

    // Smart container colour: transparent if child has gradient/background
    val effectiveContainerColor = if (childHasVisualBg || selfHasVisualBg)
        Color.Transparent else containerColor ?: CardDefaults.cardColors().containerColor

    if (hasOnClick && enabled) {
        Card(onClick = { onClickAction?.invoke() }, shape = shape, colors = cardColors, elevation = cardElevation, border = border) {
            component.children?.forEach { child -> RenderComponent(child) }
        }
    } else {
        Card(shape = shape, colors = cardColors, elevation = cardElevation, border = border) {
            component.children?.forEach { child -> RenderComponent(child) }
        }
    }
}`,
    },
    properties: [
      { name: 'component', type: 'UIComponent', description: 'Props: containerColor, contentColor, elevation (Int dp), shape, border ({ width, color }), onClick, enabled (Boolean), modifier. Children rendered as card content.' },
    ],
    methods: [],
    innerClasses: [],
    usage: `// Clickable card:
// { "type": "Card", "props": { "onClick": { "actionType": "navigate", "routeName": "detail" }, "elevation": 4 }, "children": [...] }`,
    notes: 'Container colour is automatically set to transparent when the card or its children specify a gradient or background modifier, preventing colour conflict.',
    seeAlso: ['rememberOnClick', 'parseShape'],
  },

  RenderImage: {
    name: 'RenderImage',
    kind: 'function',
    module: 'renderer',
    subpackage: 'widget',
    category: 'Renderer',
    subcategory: 'Widget',
    description: 'Internal composable that renders an "image" UIComponent. Supports multiple image sources via the "source" prop: "url" (async loading via Coil), "res" (Android drawable/mipmap resource), "icon" (Material icon vector), and "base64" (placeholder). Includes contentScale/scaleType and contentDescription.',
    android: {
      packageName: 'com.developerstring.ketoy.renderer',
      annotations: ['@Composable', 'internal'],
      imports: [
        'import coil.compose.AsyncImage',
        'import coil.request.ImageRequest',
        'import androidx.compose.foundation.Image',
        'import com.developerstring.ketoy.model.KImageSource',
        'import com.developerstring.ketoy.model.KScaleType',
        'import com.developerstring.ketoy.util.resolveIcon',
        'import com.developerstring.ketoy.parser.*',
        'import kotlinx.serialization.json.*',
      ],
      sourceCode: `@Composable
internal fun RenderImage(component: UIComponent) {
    val props = component.props ?: JsonObject(emptyMap())
    val modifier = parseModifier(props)
    val contentDescription = props["contentDescription"]?.jsonPrimitive?.contentOrNull
    val scaleType = props["scaleType"]?.jsonPrimitive?.contentOrNull ?: KScaleType.FitCenter

    val source = props["source"]?.jsonObject
    val sourceType = source?.get("type")?.jsonPrimitive?.contentOrNull
    val value = source?.get("value")?.jsonPrimitive?.contentOrNull

    when (sourceType) {
        "icon" -> { /* resolveIcon + Icon composable */ }
        "res"  -> { /* painterResource from drawable/mipmap */ }
        "url"  -> { /* AsyncImage via Coil */ }
        "base64" -> { /* placeholder Box */ }
        else -> { /* error fallback */ }
    }
}`,
    },
    properties: [
      { name: 'component', type: 'UIComponent', description: 'Props: source ({ type: "url"|"res"|"icon"|"base64", value: String, style?: String }), scaleType (KScaleType string), contentDescription (String), modifier.' },
    ],
    methods: [],
    innerClasses: [],
    usage: `// URL image:
// { "type": "Image", "props": { "source": { "type": "url", "value": "https://example.com/img.png" }, "scaleType": "centerCrop" } }
// Resource image:
// { "type": "Image", "props": { "source": { "type": "res", "value": "ic_launcher" } } }
// Icon image:
// { "type": "Image", "props": { "source": { "type": "icon", "value": "Star", "style": "filled" } } }`,
    notes: 'URL images are loaded asynchronously via Coil with crossfade. Resource images look up drawable then mipmap. Icon images use resolveIcon with an optional style parameter.',
    seeAlso: ['RenderIcon', 'KImageSource', 'KScaleType', 'resolveIcon'],
  },

  RenderIcon: {
    name: 'RenderIcon',
    kind: 'function',
    module: 'renderer',
    subpackage: 'widget',
    category: 'Renderer',
    subcategory: 'Widget',
    description: 'Internal composable that renders an "icon" UIComponent as a Material icon. Resolves the icon by name and style using resolveIcon. Supports size, colour, and contentDescription.',
    android: {
      packageName: 'com.developerstring.ketoy.renderer',
      annotations: ['@Composable', 'internal'],
      imports: [
        'import androidx.compose.material3.Icon',
        'import com.developerstring.ketoy.util.KIcons',
        'import com.developerstring.ketoy.util.resolveIcon',
        'import com.developerstring.ketoy.parser.*',
        'import kotlinx.serialization.json.*',
      ],
      sourceCode: `@Composable
internal fun RenderIcon(component: UIComponent) {
    val props = component.props ?: JsonObject(emptyMap())
    val iconName = props["icon"]?.jsonPrimitive?.contentOrNull ?: ""
    val style = props["style"]?.jsonPrimitive?.contentOrNull ?: KIcons.STYLE_FILLED
    val size = props["size"]?.jsonPrimitive?.intOrNull
    val color = resolveKetoyColorOrNull(props["color"]?.jsonPrimitive?.contentOrNull)
    val contentDescription = props["contentDescription"]?.jsonPrimitive?.contentOrNull
    val modifier = parseModifier(props)

    val imageVector = resolveIcon(iconName, style)
    if (imageVector != null) {
        Icon(imageVector = imageVector, contentDescription = contentDescription,
            modifier = if (size != null) modifier.size(size.dp) else modifier,
            tint = color ?: LocalContentColor.current)
    } else {
        Box(modifier = modifier) { Text(text = "⚠ Icon: \$iconName", color = Color.Gray) }
    }
}`,
    },
    properties: [
      { name: 'component', type: 'UIComponent', description: 'Props: icon (String name), style ("filled"|"outlined"|"rounded"|"sharp"|"twoTone"), size (Int dp), color (hex or @theme/ reference), contentDescription (String), modifier.' },
    ],
    methods: [],
    innerClasses: [],
    usage: `// JSON:
// { "type": "Icon", "props": { "icon": "Home", "style": "outlined", "size": 24, "color": "@theme/primary" } }`,
    notes: 'Icon resolution uses KIcons utility. If the icon name is not found, a warning placeholder is displayed.',
    seeAlso: ['RenderIconButton', 'resolveIcon', 'KIcons'],
  },

  RenderIconButton: {
    name: 'RenderIconButton',
    kind: 'function',
    module: 'renderer',
    subpackage: 'widget',
    category: 'Renderer',
    subcategory: 'Widget',
    description: 'Internal composable that renders an "iconbutton" UIComponent as a Material 3 IconButton with an embedded icon. Supports onClick, enabled state, icon size/colour, container and content colours, disabled colours, and optional child content.',
    android: {
      packageName: 'com.developerstring.ketoy.renderer',
      annotations: ['@Composable', 'internal'],
      imports: [
        'import androidx.compose.material3.*',
        'import com.developerstring.ketoy.util.resolveIcon',
        'import com.developerstring.ketoy.parser.*',
        'import kotlinx.serialization.json.*',
      ],
      sourceCode: `@Composable
internal fun RenderIconButton(component: UIComponent) {
    val props = component.props ?: JsonObject(emptyMap())
    val iconName = props["icon"]?.jsonPrimitive?.contentOrNull ?: ""
    val style = props["iconStyle"]?.jsonPrimitive?.contentOrNull ?: KIcons.STYLE_FILLED
    val onClickAction = rememberOnClick(props)
    val enabled = props["enabled"]?.jsonPrimitive?.booleanOrNull ?: true
    val iconSize = props["iconSize"]?.jsonPrimitive?.intOrNull
    val iconColor = resolveKetoyColorOrNull(props["iconColor"]?.jsonPrimitive?.contentOrNull)
    val containerColor = resolveKetoyColorOrNull(props["containerColor"]?.jsonPrimitive?.contentOrNull)
    val contentColor = resolveKetoyColorOrNull(props["contentColor"]?.jsonPrimitive?.contentOrNull)

    val colors = IconButtonDefaults.iconButtonColors(
        containerColor = containerColor ?: Color.Transparent,
        contentColor = contentColor ?: LocalContentColor.current,
        // ...disabled colours
    )

    IconButton(onClick = { onClickAction?.invoke() }, modifier = modifier, enabled = enabled, colors = colors) {
        if (iconName.isNotEmpty()) {
            val imageVector = resolveIcon(iconName, style)
            if (imageVector != null) Icon(imageVector = imageVector, tint = iconColor ?: LocalContentColor.current)
        }
        component.children?.forEach { child -> RenderComponent(child) }
    }
}`,
    },
    properties: [
      { name: 'component', type: 'UIComponent', description: 'Props: icon (String), iconStyle ("filled"|"outlined"|...), onClick, enabled (Boolean), iconSize (Int dp), iconColor, containerColor, contentColor, disabledContainerColor, disabledContentColor, contentDescription, modifier. Children are also rendered inside the button.' },
    ],
    methods: [],
    innerClasses: [],
    usage: `// JSON:
// { "type": "IconButton", "props": { "icon": "Settings", "onClick": { "actionType": "navigate", "routeName": "settings" } } }`,
    notes: 'Both the named icon and any children are rendered inside the button. This allows custom content to be placed alongside or instead of the icon.',
    seeAlso: ['RenderIcon', 'rememberOnClick', 'resolveIcon'],
  },

  applyJsonPadding: {
    name: 'applyJsonPadding',
    kind: 'function',
    module: 'renderer',
    subpackage: 'widget',
    category: 'Renderer',
    subcategory: 'Widget',
    description: 'Private helper that applies padding to a Modifier from a JSON element. Supports integer shorthand (all-sides), and object form with all, horizontal, vertical, top, bottom, start, end properties.',
    android: {
      packageName: 'com.developerstring.ketoy.renderer',
      annotations: ['private'],
      imports: [
        'import androidx.compose.foundation.layout.padding',
        'import androidx.compose.ui.Modifier',
        'import androidx.compose.ui.unit.dp',
        'import kotlinx.serialization.json.*',
      ],
      sourceCode: `private fun applyJsonPadding(base: Modifier, element: JsonElement): Modifier {
    return when (element) {
        is JsonPrimitive -> element.intOrNull?.let { base.padding(it.dp) } ?: base
        is JsonObject -> {
            val all = element["all"]?.jsonPrimitive?.intOrNull?.dp
            val h = element["horizontal"]?.jsonPrimitive?.intOrNull?.dp
            val v = element["vertical"]?.jsonPrimitive?.intOrNull?.dp
            val top = element["top"]?.jsonPrimitive?.intOrNull?.dp
            val bottom = element["bottom"]?.jsonPrimitive?.intOrNull?.dp
            val start = element["start"]?.jsonPrimitive?.intOrNull?.dp
            val end = element["end"]?.jsonPrimitive?.intOrNull?.dp
            when {
                all != null -> base.padding(all)
                h != null && v != null -> base.padding(horizontal = h, vertical = v)
                h != null -> base.padding(horizontal = h)
                v != null -> base.padding(vertical = v)
                top != null || bottom != null || start != null || end != null ->
                    base.padding(top = top ?: 0.dp, bottom = bottom ?: 0.dp, start = start ?: 0.dp, end = end ?: 0.dp)
                else -> base
            }
        }
        else -> base
    }
}`,
    },
    properties: [
      { name: 'base', type: 'Modifier', description: 'The existing modifier to extend with padding.' },
      { name: 'element', type: 'JsonElement', description: 'A JSON int (all sides) or object with all/horizontal/vertical/top/bottom/start/end.' },
    ],
    methods: [],
    innerClasses: [],
    usage: `// Used internally by RenderButton:
mp["margin"]?.let { buttonModifier = applyJsonPadding(buttonModifier, it) }`,
    notes: 'Supports both shorthand integer form and detailed object form with directional padding.',
    seeAlso: ['RenderButton', 'parseModifier'],
  },

}

export default rendererData
