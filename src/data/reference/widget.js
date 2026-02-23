/**
 * Ketoy SDK – Widget Module
 * Package: com.developerstring.ketoy.widget
 * Sub-packages: parser, registry, builtin
 */

const widgetData = {

  /* ══════════════════════════════════════════════════════════════
   *  Widget > Action Parser  (KetoyActionParser.kt)
   * ══════════════════════════════════════════════════════════════ */

  KetoyActionParser: {
    name: 'KetoyActionParser',
    kind: 'interface',
    module: 'widget',
    subpackage: 'action parser',
    category: 'Widget',
    subcategory: 'Action Parser',
    description: 'Base interface for Ketoy action parsers. An action parser handles a specific type of JSON action (e.g. navigate, showDialog, callFunction). Implementations declare an actionType, deserialize JSON via getModel(), and execute via onCall(). The framework dispatches actions to parsers through KetoyActionRegistry.',
    android: {
      packageName: 'com.developerstring.ketoy.widget',
      annotations: [],
      imports: [
        'import kotlinx.serialization.json.JsonObject',
      ],
      sourceCode: `interface KetoyActionParser<T> {

    /**
     * Unique action type identifier. Must match "actionType" in JSON.
     */
    val actionType: String

    /**
     * Deserialise JSON into the action model.
     *
     * @param json The JSON object containing action-specific properties.
     * @return A fully initialised action model of type [T].
     */
    fun getModel(json: JsonObject): T

    /**
     * Execute the action.
     *
     * @param model   The parsed action model.
     * @param context Provides access to Android context, nav controller, etc.
     */
    fun onCall(model: T, context: ActionContext)
}`,
    },
    properties: [
      { name: 'actionType', type: 'String', description: 'Unique action type identifier string. Must match the "actionType" field in the JSON action definition.' },
    ],
    methods: [
      { name: 'getModel(json: JsonObject)', returns: 'T', description: 'Deserialize a JSON object into the typed action model. The surrounding "actionType" key is already consumed by the framework before this method is called.' },
      { name: 'onCall(model: T, context: ActionContext)', returns: 'Unit', description: 'Execute the action with the parsed model and runtime context. Called by OnClickResolver when the action is triggered.' },
    ],
    innerClasses: [],
    usage: `// Creating a custom action parser:
class ShowToastActionParser : KetoyActionParser<ShowToastModel> {
    override val actionType = "showToast"

    override fun getModel(json: JsonObject): ShowToastModel {
        return ShowToastModel(
            message = json["message"]?.jsonPrimitive?.content ?: ""
        )
    }

    override fun onCall(model: ShowToastModel, context: ActionContext) {
        Toast.makeText(context.androidContext, model.message, Toast.LENGTH_SHORT).show()
    }
}`,
    notes: 'Implement this interface to create custom action types. Register with KetoyActionRegistry.register(). Built-in implementations include NavigateActionParser and CallFunctionActionParser.',
    seeAlso: ['KetoyActionRegistry', 'ActionContext', 'OnClickResolver', 'NavigateActionParser', 'CallFunctionActionParser'],
  },

  ActionContext: {
    name: 'ActionContext',
    kind: 'data class',
    module: 'widget',
    subpackage: 'action parser',
    category: 'Widget',
    subcategory: 'Action Parser',
    description: 'Context object passed to KetoyActionParser implementations during action execution. Centralises the runtime dependencies that actions may need — Android system services, the active navigation controller, etc. The framework constructs this object automatically; custom parsers receive it in onCall().',
    android: {
      packageName: 'com.developerstring.ketoy.widget',
      annotations: [],
      imports: [
        'import android.content.Context',
        'import com.developerstring.ketoy.navigation.KetoyNavController',
      ],
      sourceCode: `data class ActionContext(
    val androidContext: android.content.Context,
    val navController: com.developerstring.ketoy.navigation.KetoyNavController? = null
)`,
    },
    properties: [
      { name: 'androidContext', type: 'android.content.Context', description: 'The Android Context of the host Activity or Fragment. Use for toasts, starting activities, accessing system services, etc.' },
      { name: 'navController', type: 'KetoyNavController?', description: 'The active KetoyNavController for navigation actions. May be null if the action is triggered outside a navigation-enabled scope. Defaults to null.' },
    ],
    methods: [],
    innerClasses: [],
    usage: `// Accessing context in a custom action:
override fun onCall(model: MyModel, context: ActionContext) {
    Toast.makeText(context.androidContext, model.message, Toast.LENGTH_SHORT).show()
    context.navController?.navigate("result_screen")
}`,
    notes: 'Created automatically by OnClickResolver and passed to action parsers. The navController is sourced from LocalKetoyNavController in the composition.',
    seeAlso: ['KetoyActionParser', 'OnClickResolver', 'KetoyNavController'],
  },

  /* ══════════════════════════════════════════════════════════════
   *  Widget > Action Registry  (KetoyActionRegistry.kt)
   * ══════════════════════════════════════════════════════════════ */

  KetoyActionRegistry: {
    name: 'KetoyActionRegistry',
    kind: 'object',
    module: 'widget',
    subpackage: 'action registry',
    category: 'Widget',
    subcategory: 'Action Registry',
    description: 'Global singleton registry for KetoyActionParser instances. When a JSON action is triggered (e.g. via an onClick handler), the Ketoy action executor looks up the parser by its actionType key and delegates execution. Ships with two built-in actions: "navigate" (NavigateActionParser) and "callFunction" (CallFunctionActionParser).',
    android: {
      packageName: 'com.developerstring.ketoy.widget',
      annotations: [],
      imports: [],
      sourceCode: `object KetoyActionRegistry {

    private val parsers = mutableMapOf<String, KetoyActionParser<*>>()

    fun register(parser: KetoyActionParser<*>, override: Boolean = false) {
        if (override || !parsers.containsKey(parser.actionType)) {
            parsers[parser.actionType] = parser
        }
    }

    fun registerAll(parserList: List<KetoyActionParser<*>>, override: Boolean = false) {
        parserList.forEach { register(it, override) }
    }

    fun registerAll(vararg parserList: KetoyActionParser<*>) {
        parserList.forEach { register(it) }
    }

    @Suppress("UNCHECKED_CAST")
    fun <T> get(actionType: String): KetoyActionParser<T>? {
        return parsers[actionType] as? KetoyActionParser<T>
    }

    fun isRegistered(actionType: String): Boolean =
        parsers.containsKey(actionType)

    fun getAllTypes(): Set<String> = parsers.keys.toSet()

    fun remove(actionType: String): Boolean =
        parsers.remove(actionType) != null

    fun clear() { parsers.clear() }
}`,
    },
    properties: [],
    methods: [
      { name: 'register(parser: KetoyActionParser<*>, override: Boolean)', returns: 'Unit', description: 'Register a single custom action parser. If override is true, replaces any existing parser with the same actionType. Defaults to false.' },
      { name: 'registerAll(parserList: List<KetoyActionParser<*>>, override: Boolean)', returns: 'Unit', description: 'Register multiple action parsers from a List.' },
      { name: 'registerAll(vararg parserList: KetoyActionParser<*>)', returns: 'Unit', description: 'Register multiple action parsers via varargs.' },
      { name: 'get(actionType: String)', returns: 'KetoyActionParser<T>?', description: 'Retrieve a registered action parser by its action type. Generic parameter T is inferred at call-site. Returns null if not registered.' },
      { name: 'isRegistered(actionType: String)', returns: 'Boolean', description: 'Check whether an action parser is registered for the given type.' },
      { name: 'getAllTypes()', returns: 'Set<String>', description: 'Get all registered action type identifiers as an immutable set.' },
      { name: 'remove(actionType: String)', returns: 'Boolean', description: 'Remove a previously registered action parser by its type. Returns true if a parser was removed.' },
      { name: 'clear()', returns: 'Unit', description: 'Clear all registered action parsers. Typically used in tests or when reinitialising the SDK.' },
    ],
    innerClasses: [],
    usage: `// Register custom actions:
KetoyActionRegistry.register(ShowToastActionParser())
KetoyActionRegistry.register(AnalyticsEventActionParser())

// Check registration:
KetoyActionRegistry.isRegistered("showToast") // true

// JSON trigger:
// { "onClick": { "actionType": "showToast", "message": "Hello from Ketoy!" } }`,
    notes: 'Built-in actions ("navigate" and "callFunction") are typically registered during SDK initialisation. Custom actions can override built-in ones by passing override = true.',
    seeAlso: ['KetoyActionParser', 'ActionContext', 'OnClickResolver', 'NavigateActionParser', 'CallFunctionActionParser'],
  },

  /* ══════════════════════════════════════════════════════════════
   *  Widget > Widget Parser  (KetoyWidgetParser.kt)
   * ══════════════════════════════════════════════════════════════ */

  KetoyWidgetParser: {
    name: 'KetoyWidgetParser',
    kind: 'interface',
    module: 'widget',
    subpackage: 'widget parser',
    category: 'Widget',
    subcategory: 'Widget Parser',
    description: 'Base interface for all Ketoy widget parsers. A widget parser bridges the gap between a JSON widget definition and its rendered Compose UI. Each parser declares a unique type string, deserializes JSON into a model via getModel(), and renders it via parse(). Register custom parsers with KetoyWidgetRegistry.',
    android: {
      packageName: 'com.developerstring.ketoy.widget',
      annotations: [],
      imports: [
        'import androidx.compose.runtime.Composable',
        'import kotlinx.serialization.json.JsonObject',
      ],
      sourceCode: `interface KetoyWidgetParser<T> {

    /**
     * The unique type identifier for this widget.
     * Must match the "type" field in the JSON widget definition.
     */
    val type: String

    /**
     * Deserialise a JsonObject into the model type T.
     *
     * @param json The JSON object containing widget properties.
     * @return The fully initialised model of type T.
     */
    fun getModel(json: JsonObject): T

    /**
     * Render the model as a Composable widget.
     *
     * @param model The parsed model produced by getModel.
     */
    @Composable
    fun parse(model: T)
}`,
    },
    properties: [
      { name: 'type', type: 'String', description: 'The unique type identifier for this widget. Must match the "type" field in the JSON widget definition.' },
    ],
    methods: [
      { name: 'getModel(json: JsonObject)', returns: 'T', description: 'Deserialize a JsonObject into the typed model. Unknown keys should be silently ignored for forward-compatible schema evolution.' },
      { name: 'parse(model: T)', returns: 'Unit', description: '@Composable. Render the model as a Compose widget. Emits one or more Composable nodes representing the visual output.' },
    ],
    innerClasses: [],
    usage: `// Creating a custom widget parser:
class KetoyBadgeParser : KetoyWidgetParser<BadgeModel> {
    override val type = "badge"

    override fun getModel(json: JsonObject): BadgeModel {
        return BadgeModel(
            text = json["text"]?.jsonPrimitive?.content ?: "",
            color = json["color"]?.jsonPrimitive?.content
        )
    }

    @Composable
    override fun parse(model: BadgeModel) {
        Badge(text = model.text, color = model.color?.toColor())
    }
}

// Register:
Ketoy.initialize(widgetParsers = listOf(KetoyBadgeParser()))`,
    notes: 'Widget parsers are resolved by the rendering pipeline when it encounters an unknown component type. The type is matched case-sensitively first, then case-insensitively as fallback.',
    seeAlso: ['KetoyWidgetRegistry', 'RenderCustomWidgetParser', 'RenderComponent'],
  },

  /* ══════════════════════════════════════════════════════════════
   *  Widget > Widget Registry  (KetoyWidgetRegistry.kt)
   * ══════════════════════════════════════════════════════════════ */

  KetoyWidgetRegistry: {
    name: 'KetoyWidgetRegistry',
    kind: 'object',
    module: 'widget',
    subpackage: 'widget registry',
    category: 'Widget',
    subcategory: 'Widget Registry',
    description: 'Global singleton registry for custom KetoyWidgetParser instances. When the renderer encounters a JSON type it doesn\'t recognise as a built-in widget, it checks this registry for a matching custom parser. Provides registration, retrieval, lifecycle management, and an internal resolveParser helper used by the rendering pipeline.',
    android: {
      packageName: 'com.developerstring.ketoy.widget',
      annotations: [],
      imports: [],
      sourceCode: `object KetoyWidgetRegistry {

    private val parsers = mutableMapOf<String, KetoyWidgetParser<*>>()

    fun register(parser: KetoyWidgetParser<*>, override: Boolean = false) {
        if (override || !parsers.containsKey(parser.type)) {
            parsers[parser.type] = parser
        }
    }

    fun registerAll(parserList: List<KetoyWidgetParser<*>>, override: Boolean = false) {
        parserList.forEach { register(it, override) }
    }

    fun registerAll(vararg parserList: KetoyWidgetParser<*>) {
        parserList.forEach { register(it) }
    }

    @Suppress("UNCHECKED_CAST")
    fun <T> get(type: String): KetoyWidgetParser<T>? {
        return parsers[type] as? KetoyWidgetParser<T>
    }

    fun isRegistered(type: String): Boolean = parsers.containsKey(type)

    fun getAllTypes(): Set<String> = parsers.keys.toSet()

    internal fun resolveParser(type: String): KetoyWidgetParser<*>? {
        return parsers[type]
    }

    fun remove(type: String): Boolean = parsers.remove(type) != null

    fun clear() { parsers.clear() }
}`,
    },
    properties: [],
    methods: [
      { name: 'register(parser: KetoyWidgetParser<*>, override: Boolean)', returns: 'Unit', description: 'Register a single custom widget parser. If override is true, replaces any existing parser with the same type.' },
      { name: 'registerAll(parserList: List<KetoyWidgetParser<*>>, override: Boolean)', returns: 'Unit', description: 'Register multiple custom widget parsers from a List.' },
      { name: 'registerAll(vararg parserList: KetoyWidgetParser<*>)', returns: 'Unit', description: 'Register multiple parsers via varargs.' },
      { name: 'get(type: String)', returns: 'KetoyWidgetParser<T>?', description: 'Retrieve a registered parser by its type identifier. Generic T is inferred at call-site. Returns null if not registered.' },
      { name: 'isRegistered(type: String)', returns: 'Boolean', description: 'Check whether a parser is registered for the given type.' },
      { name: 'getAllTypes()', returns: 'Set<String>', description: 'Get all registered type identifiers as an immutable set.' },
      { name: 'resolveParser(type: String)', returns: 'KetoyWidgetParser<*>?', description: 'Internal. Resolve the parser for a given widget type. Used by the Ketoy rendering pipeline at render time.' },
      { name: 'remove(type: String)', returns: 'Boolean', description: 'Remove a previously registered parser by its type. Returns true if removed.' },
      { name: 'clear()', returns: 'Unit', description: 'Clear all registered parsers. Typically called during testing or SDK teardown.' },
    ],
    innerClasses: [],
    usage: `// Register custom widgets:
KetoyWidgetRegistry.register(KetoyBadgeParser())
KetoyWidgetRegistry.register(KetoyRatingBarParser())

// Batch registration:
KetoyWidgetRegistry.registerAll(
    listOf(KetoyBadgeParser(), KetoyRatingBarParser()),
    override = true
)

// Check:
KetoyWidgetRegistry.isRegistered("badge") // true`,
    notes: 'The rendering pipeline calls resolveParser() internally when it encounters an unknown type. Custom parsers take precedence over KComponentRegistry entries.',
    seeAlso: ['KetoyWidgetParser', 'RenderCustomWidgetParser', 'RenderComponent', 'KComponentRegistry'],
  },

  /* ══════════════════════════════════════════════════════════════
   *  Widget > Builtin  (builtin/CallFunctionActionParser.kt)
   * ══════════════════════════════════════════════════════════════ */

  CallFunctionActionParser: {
    name: 'CallFunctionActionParser',
    kind: 'class',
    module: 'widget',
    subpackage: 'builtin',
    category: 'Widget',
    subcategory: 'Builtin',
    description: 'Built-in action parser for the "callFunction" action type. Bridges JSON actions to KetoyFunctionRegistry, enabling server-driven UI to invoke app-side Kotlin functions by name with typed arguments.',
    android: {
      packageName: 'com.developerstring.ketoy.widget.builtin',
      annotations: [],
      imports: [
        'import com.developerstring.ketoy.registry.KetoyFunctionRegistry',
        'import com.developerstring.ketoy.widget.ActionContext',
        'import com.developerstring.ketoy.widget.KetoyActionParser',
        'import kotlinx.serialization.json.*',
      ],
      sourceCode: `class CallFunctionActionParser : KetoyActionParser<CallFunctionAction> {

    override val actionType: String = "callFunction"

    override fun getModel(json: JsonObject): CallFunctionAction {
        val functionName = json["functionName"]?.jsonPrimitive?.content ?: ""
        val argsJson = json["arguments"]?.jsonObject
        val arguments = mutableMapOf<String, Any>()

        argsJson?.forEach { (key, value) ->
            if (value is JsonPrimitive) {
                when {
                    value.isString -> arguments[key] = value.content
                    value.booleanOrNull != null -> arguments[key] = value.booleanOrNull!!
                    value.intOrNull != null -> arguments[key] = value.intOrNull!!
                    value.floatOrNull != null -> arguments[key] = value.floatOrNull!!
                    value.doubleOrNull != null -> arguments[key] = value.doubleOrNull!!
                    else -> arguments[key] = value.content
                }
            } else {
                arguments[key] = value.toString()
            }
        }

        return CallFunctionAction(functionName = functionName, arguments = arguments)
    }

    override fun onCall(model: CallFunctionAction, context: ActionContext) {
        KetoyFunctionRegistry.call(model.functionName, model.arguments)
    }
}`,
    },
    properties: [
      { name: 'actionType', type: 'String', description: 'The action type identifier: "callFunction".' },
    ],
    methods: [
      { name: 'getModel(json: JsonObject)', returns: 'CallFunctionAction', description: 'Parse a JSON action object into a CallFunctionAction model. Extracts "functionName" and "arguments". Arguments are automatically coerced from JSON primitives to String, Boolean, Int, Float, or Double.' },
      { name: 'onCall(model: CallFunctionAction, context: ActionContext)', returns: 'Unit', description: 'Execute the function call by delegating to KetoyFunctionRegistry.call(). If the function is not registered, a warning is logged and the call is silently ignored.' },
    ],
    innerClasses: [],
    usage: `// JSON action:
// { "actionType": "callFunction", "functionName": "addToCart", "arguments": { "productId": "SKU-12345", "quantity": 2 } }

// Register the function first:
KetoyFunctionRegistry.register("addToCart") { args ->
    val productId = args["productId"] as? String
    val quantity = args["quantity"] as? Int
    cartService.addItem(productId, quantity)
}`,
    notes: 'This is a built-in action parser registered automatically during SDK initialisation. Arguments support automatic type coercion from JSON primitives.',
    seeAlso: ['CallFunctionAction', 'KetoyFunctionRegistry', 'KetoyActionParser', 'KetoyActionRegistry'],
  },

  CallFunctionAction: {
    name: 'CallFunctionAction',
    kind: 'data class',
    module: 'widget',
    subpackage: 'builtin',
    category: 'Widget',
    subcategory: 'Builtin',
    description: 'Model representing a "callFunction" action parsed from JSON. Contains the target function name and a map of typed arguments.',
    android: {
      packageName: 'com.developerstring.ketoy.widget.builtin',
      annotations: [],
      imports: [],
      sourceCode: `data class CallFunctionAction(
    val functionName: String,
    val arguments: Map<String, Any> = emptyMap()
)`,
    },
    properties: [
      { name: 'functionName', type: 'String', description: 'The registered function name in KetoyFunctionRegistry.' },
      { name: 'arguments', type: 'Map<String, Any>', description: 'A map of argument names to their typed Kotlin values. Defaults to an empty map for no-argument functions.' },
    ],
    methods: [],
    innerClasses: [],
    usage: `// Created by CallFunctionActionParser.getModel():
val action = CallFunctionAction(
    functionName = "addToCart",
    arguments = mapOf("productId" to "SKU-12345", "quantity" to 2)
)`,
    notes: 'Argument values are typed — String, Boolean, Int, Float, Double — based on the JSON primitive types in the original JSON.',
    seeAlso: ['CallFunctionActionParser', 'KetoyFunctionRegistry'],
  },

  /* ══════════════════════════════════════════════════════════════
   *  Widget > Builtin  (builtin/NavigateActionParser.kt)
   * ══════════════════════════════════════════════════════════════ */

  NavigateActionParser: {
    name: 'NavigateActionParser',
    kind: 'class',
    module: 'widget',
    subpackage: 'builtin',
    category: 'Widget',
    subcategory: 'Builtin',
    description: 'Built-in action parser for the "navigate" action type. Bridges JSON navigation actions to KetoyNavigationExecutor, enabling server-driven UI to perform navigation operations including push, pop, replace, and clear-back-stack navigation styles.',
    android: {
      packageName: 'com.developerstring.ketoy.widget.builtin',
      annotations: [],
      imports: [
        'import com.developerstring.ketoy.navigation.KNavigateAction',
        'import com.developerstring.ketoy.navigation.KetoyNavigationExecutor',
        'import com.developerstring.ketoy.navigation.NavigationStyle',
        'import com.developerstring.ketoy.widget.ActionContext',
        'import com.developerstring.ketoy.widget.KetoyActionParser',
        'import kotlinx.serialization.json.*',
      ],
      sourceCode: `class NavigateActionParser : KetoyActionParser<KNavigateAction> {

    override val actionType: String = "navigate"

    override fun getModel(json: JsonObject): KNavigateAction {
        return KNavigateAction(
            routeName = json["routeName"]?.jsonPrimitive?.content,
            widgetJson = json["widgetJson"]?.jsonPrimitive?.content,
            assetPath = json["assetPath"]?.jsonPrimitive?.content,
            navigationStyle = json["navigationStyle"]?.jsonPrimitive?.content
                ?.let { parseNavigationStyle(it) }
                ?: NavigationStyle.Navigate,
            result = json["result"]?.jsonObject?.mapValues { (_, v) -> v.jsonPrimitive.content },
            arguments = json["arguments"]?.jsonObject?.mapValues { (_, v) -> v.jsonPrimitive.content }
        )
    }

    override fun onCall(model: KNavigateAction, context: ActionContext) {
        val navController = context.navController ?: return
        KetoyNavigationExecutor.execute(
            navController = navController,
            action = model,
            context = context.androidContext
        )
    }

    private fun parseNavigationStyle(value: String): NavigationStyle {
        return when (value.lowercase()) {
            "navigate", "push" -> NavigationStyle.Navigate
            "popbackstack", "pop" -> NavigationStyle.PopBackStack
            "navigateandreplace", "pushreplacement" -> NavigationStyle.NavigateAndReplace
            "navigateandclearbackstack", "pushandremoveall" -> NavigationStyle.NavigateAndClearBackStack
            "poptoroot", "popall" -> NavigationStyle.PopToRoot
            else -> NavigationStyle.Navigate
        }
    }
}`,
    },
    properties: [
      { name: 'actionType', type: 'String', description: 'The action type identifier: "navigate".' },
    ],
    methods: [
      { name: 'getModel(json: JsonObject)', returns: 'KNavigateAction', description: 'Parse a JSON action object into a KNavigateAction model. Extracts routeName, widgetJson, assetPath, navigationStyle, result, and arguments.' },
      { name: 'onCall(model: KNavigateAction, context: ActionContext)', returns: 'Unit', description: 'Execute the navigation action via KetoyNavigationExecutor. Requires a non-null navController; if absent the action is silently ignored.' },
      { name: 'parseNavigationStyle(value: String)', returns: 'NavigationStyle', description: 'Private. Convert a raw JSON string into a NavigationStyle enum. Recognised values: navigate/push, popbackstack/pop, navigateandreplace/pushreplacement, navigateandclearbackstack/pushandremoveall, poptoroot/popall.' },
    ],
    innerClasses: [],
    usage: `// JSON action:
// { "actionType": "navigate", "routeName": "detail_screen", "navigationStyle": "push", "arguments": { "id": "123" } }

// Pop back:
// { "actionType": "navigate", "navigationStyle": "pop" }

// Navigate and replace:
// { "actionType": "navigate", "routeName": "home", "navigationStyle": "pushReplacement" }`,
    notes: 'This is a built-in action parser registered automatically during SDK initialisation. Navigation style parsing is case-insensitive and supports both camelCase and shorthand names.',
    seeAlso: ['KNavigateAction', 'KetoyNavigationExecutor', 'NavigationStyle', 'KetoyActionParser', 'KetoyActionRegistry'],
  },

}

export default widgetData
