/**
 * Ketoy SDK – Registry Module
 * Package: com.developerstring.ketoy.registry
 *
 * Singleton registries for custom components and callable functions.
 * KComponentRegistry manages composable renderers, KetoyFunctionRegistry
 * manages business-logic functions callable from JSON actions.
 */

const registryData = {

  /* ══════════════════════════════════════════════════════════════════
   *  Registry > Component
   * ══════════════════════════════════════════════════════════════════ */

  KComponentRegistry: {
    name: 'KComponentRegistry',
    kind: 'object',
    module: 'registry',
    subpackage: 'component',
    category: 'Registry',
    subcategory: 'Component Registry',
    description: 'Global singleton registry for custom Ketoy components. Components are registered with a KComponentInfo that carries an optional renderer lambda. The renderer is invoked at render time when a JSON node references the component by name. Supports both direct registration and reflection-based dynamic loading from metadata.',
    android: {
      packageName: 'com.developerstring.ketoy.registry',
      annotations: [],
      imports: [
        'import android.util.Log',
        'import com.developerstring.ketoy.model.KComponentInfo',
        'import com.developerstring.ketoy.model.KComponentMetadata',
      ],
      sourceCode: `object KComponentRegistry {

    private const val TAG = "KComponentRegistry"

    private val components = mutableMapOf<String, KComponentInfo>()
    private val componentMetadata = mutableMapOf<String, KComponentMetadata>()
    private var isInitialized = false

    fun initialize() {
        if (isInitialized) return
        isInitialized = true
    }

    fun register(info: KComponentInfo) {
        components[info.name] = info
        componentMetadata[info.name] = KComponentMetadata(
            name = info.name,
            packageName = info.packageName,
            className = info.className,
            version = info.version
        )
        Log.d(TAG, "Registered component '\${info.name}'")
    }

    fun register(
        name: String,
        renderer: @Composable (Map<String, Any>) -> Unit,
        parameterTypes: Map<String, String> = emptyMap(),
        packageName: String = "",
        className: String = ""
    ) {
        register(
            KComponentInfo(
                name = name,
                packageName = packageName,
                className = className,
                parameterTypes = parameterTypes
            ).apply { this.renderer = renderer }
        )
    }

    fun get(name: String): KComponentInfo? { ... }
    fun getAll(): Map<String, KComponentInfo> { ... }
    fun getMetadata(name: String): KComponentMetadata? { ... }
    fun getAllMetadata(): Map<String, KComponentMetadata> { ... }
    fun isAvailable(name: String): Boolean { ... }
    fun loadFromMetadata(metadata: KComponentMetadata): Boolean { ... }
    fun clear() { ... }
    fun reset() { ... }
}`,
    },
    properties: [
      { name: 'components', type: 'MutableMap<String, KComponentInfo>', default: 'mutableMapOf()', description: 'Internal map storing registered components by name. Private.' },
      { name: 'componentMetadata', type: 'MutableMap<String, KComponentMetadata>', default: 'mutableMapOf()', description: 'Lightweight metadata per component for schema/documentation use. Private.' },
      { name: 'isInitialized', type: 'Boolean', default: 'false', description: 'Lazy-init guard. Set to true after first initialize() call. Private.' },
    ],
    methods: [
      { name: 'initialize()', returns: 'Unit', description: 'Initialise the component registry. Called lazily on first get or isAvailable access. Idempotent — subsequent calls are no-ops.' },
      { name: 'register(info: KComponentInfo)', returns: 'Unit', description: 'Register a component using a pre-built KComponentInfo. Stores both the component info (with renderer lambda) and lightweight KComponentMetadata.' },
      { name: 'register(name, renderer, parameterTypes, packageName, className)', returns: 'Unit', description: 'Register a custom Jetpack Compose composable for server-driven rendering. The renderer lambda receives extracted properties as Map<String, Any>.' },
      { name: 'get(name: String)', returns: 'KComponentInfo?', description: 'Retrieve a registered component by name. Triggers lazy initialize if not yet called. Returns null if not registered.' },
      { name: 'getAll()', returns: 'Map<String, KComponentInfo>', description: 'Return all registered components as an immutable map.' },
      { name: 'getMetadata(name: String)', returns: 'KComponentMetadata?', description: 'Retrieve lightweight metadata for a registered component. Returns null if not registered.' },
      { name: 'getAllMetadata()', returns: 'Map<String, KComponentMetadata>', description: 'Return all registered component metadata as an immutable map.' },
      { name: 'isAvailable(name: String)', returns: 'Boolean', description: 'Check whether a component with the given name is registered and available for rendering.' },
      { name: 'loadFromMetadata(metadata: KComponentMetadata)', returns: 'Boolean', description: 'Attempt to load a component from its metadata using reflection. Looks for a class with a static register() method. Returns true if the component is now available.' },
      { name: 'clear()', returns: 'Unit', description: 'Clear all registered components and metadata, resetting the initialisation flag. Primarily used in tests.' },
      { name: 'reset()', returns: 'Unit', description: 'Clear all registered data and immediately re-initialise the registry. Equivalent to clear() + initialize().' },
    ],
    usage: `// Register with a pre-built KComponentInfo
KComponentRegistry.register(
    KComponentInfo(
        name = "UserCard",
        packageName = "com.example.components",
        className = "UserCardComponent"
    ).apply {
        renderer = { props ->
            val name = props["name"] as? String ?: ""
            UserCardComposable(name = name)
        }
    }
)

// Register with typed parameter extraction
KComponentRegistry.register(
    name = "UserCard",
    renderer = { props ->
        val name = props["name"] as? String ?: ""
        val age  = props["age"]  as? Int ?: 0
        val isVip = props["isVip"] as? Boolean ?: false
        UserCardComposable(name = name, age = age, isVip = isVip)
    },
    parameterTypes = mapOf(
        "name" to "String",
        "age"  to "Int",
        "isVip" to "Boolean"
    )
)

// Check availability and retrieve
if (KComponentRegistry.isAvailable("UserCard")) {
    val info = KComponentRegistry.get("UserCard")
    info?.renderer?.invoke(props)
}

// Dynamic loading from metadata
val metadata = KComponentMetadata(
    name = "UserCard",
    packageName = "com.example.components",
    className = "UserCardComponent"
)
KComponentRegistry.loadFromMetadata(metadata)

// Query all registered components
val all = KComponentRegistry.getAll()
val names = all.keys // Set of component names

// Lifecycle
KComponentRegistry.clear()  // Clear all
KComponentRegistry.reset()  // Clear + re-initialize`,
    notes: 'Thread safety: the internal maps are not synchronised — register from a single thread (typically the main/UI thread during app startup). The reflection-based loadFromMetadata looks for Class.forName(packageName.className) with a static register() method. JSON type mapping: { "type": "UserCard", "props": { "name": "Alice", "age": 30, "isVip": true } }.',
    seeAlso: ['KComponentInfo', 'KComponentMetadata', 'KetoyFunctionRegistry', 'KetoyComposableRegistry'],
  },

  /* ══════════════════════════════════════════════════════════════════
   *  Registry > Function
   * ══════════════════════════════════════════════════════════════════ */

  KetoyFunctionRegistry: {
    name: 'KetoyFunctionRegistry',
    kind: 'object',
    module: 'registry',
    subpackage: 'function',
    category: 'Registry',
    subcategory: 'Function Registry',
    description: 'Global singleton registry for Kotlin functions callable from Ketoy SDUI JSON. Developers register named functions with typed parameters, then reference them from JSON actions. This bridges the gap between server-driven UI and app-side business logic.',
    android: {
      packageName: 'com.developerstring.ketoy.registry',
      annotations: [],
      imports: [
        'import android.util.Log',
      ],
      sourceCode: `object KetoyFunctionRegistry {

    private const val TAG = "KetoyFunctionRegistry"

    data class FunctionInfo(
        val name: String,
        val handler: (Map<String, Any>) -> Unit,
        val parameterTypes: Map<String, String> = emptyMap(),
        val description: String = ""
    )

    private val functions = mutableMapOf<String, FunctionInfo>()

    fun register(
        name: String,
        parameterTypes: Map<String, String>,
        description: String = "",
        handler: (params: Map<String, Any>) -> Unit
    ) {
        functions[name] = FunctionInfo(
            name = name,
            handler = handler,
            parameterTypes = parameterTypes,
            description = description
        )
    }

    fun register(name: String, description: String = "", handler: () -> Unit) {
        register(name = name, parameterTypes = emptyMap(), description = description)
        { _ -> handler() }
    }

    fun call(name: String, arguments: Map<String, Any> = emptyMap()): Boolean { ... }
    fun get(name: String): FunctionInfo? { ... }
    fun isRegistered(name: String): Boolean { ... }
    fun getAllNames(): Set<String> { ... }
    fun getAll(): Map<String, FunctionInfo> { ... }
    fun remove(name: String): Boolean { ... }
    fun clear() { ... }
}`,
    },
    properties: [
      { name: 'functions', type: 'MutableMap<String, FunctionInfo>', default: 'mutableMapOf()', description: 'Internal map storing registered functions by name. Private.' },
    ],
    innerClasses: [
      {
        name: 'FunctionInfo',
        kind: 'data class',
        description: 'Describes a registered callable function with its handler, typed parameter map, and optional description.',
        properties: [
          { name: 'name', type: 'String', default: '—', description: 'Function identifier used in JSON "functionName".' },
          { name: 'handler', type: '(Map<String, Any>) -> Unit', default: '—', description: 'The function body receiving typed parameters as a map.' },
          { name: 'parameterTypes', type: 'Map<String, String>', default: 'emptyMap()', description: 'Map of parameter name → type name for documentation and schema generation.' },
          { name: 'description', type: 'String', default: '""', description: 'Optional human-readable description of the function.' },
        ],
      },
    ],
    methods: [
      { name: 'register(name, parameterTypes, description, handler)', returns: 'Unit', description: 'Register a function with typed parameters. The handler receives a Map<String, Any> of typed arguments extracted from JSON primitives.' },
      { name: 'register(name, description, handler)', returns: 'Unit', description: 'Register a simple no-argument function. Convenience overload that wraps the () -> Unit handler.' },
      { name: 'call(name, arguments)', returns: 'Boolean', description: 'Call a registered function by name with arguments. Returns true if the function was found and executed successfully, false if not found or on exception.' },
      { name: 'get(name: String)', returns: 'FunctionInfo?', description: 'Get a function\'s info by name. Returns null if not registered.' },
      { name: 'isRegistered(name: String)', returns: 'Boolean', description: 'Check if a function is registered.' },
      { name: 'getAllNames()', returns: 'Set<String>', description: 'Get all registered function names as an immutable set.' },
      { name: 'getAll()', returns: 'Map<String, FunctionInfo>', description: 'Get all registered functions with their metadata as an immutable map.' },
      { name: 'remove(name: String)', returns: 'Boolean', description: 'Remove a function by name. Returns true if it was present and removed.' },
      { name: 'clear()', returns: 'Unit', description: 'Clear all registered functions. Typically used in tests to reset state.' },
    ],
    usage: `// Register a simple no-argument function
KetoyFunctionRegistry.register("logout") {
    authManager.signOut()
}

// Register a function with typed parameters
KetoyFunctionRegistry.register(
    name = "addToCart",
    parameterTypes = mapOf("productId" to "String", "quantity" to "Int"),
    description = "Add a product to the shopping cart"
) { params ->
    val productId = params["productId"] as? String ?: return@register
    val quantity = params["quantity"] as? Int ?: 1
    cartRepository.add(productId, quantity)
}

// Call from Kotlin code
KetoyFunctionRegistry.call(
    "addToCart",
    mapOf("productId" to "SKU-12345", "quantity" to 2)
)

// JSON action reference
{
    "onClick": {
        "actionType": "callFunction",
        "functionName": "addToCart",
        "arguments": {
            "productId": "SKU-12345",
            "quantity": 2
        }
    }
}

// Query & lifecycle
val names = KetoyFunctionRegistry.getAllNames()
val info = KetoyFunctionRegistry.get("addToCart")
KetoyFunctionRegistry.remove("addToCart")
KetoyFunctionRegistry.clear()`,
    notes: 'The call() method catches exceptions from the handler body and returns false instead of throwing. Log output uses TAG "KetoyFunctionRegistry". JSON arguments are automatically converted from JSON primitives (String, Int, Float, Double, Boolean) by the Ketoy renderer pipeline before calling the handler.',
    seeAlso: ['FunctionInfo', 'KComponentRegistry', 'ActionRegistry'],
  },

  FunctionInfo: {
    name: 'FunctionInfo',
    kind: 'data class',
    module: 'registry',
    subpackage: 'function',
    category: 'Registry',
    subcategory: 'Function Registry',
    description: 'Describes a registered function in KetoyFunctionRegistry. Holds the function name, handler lambda, typed parameter map for documentation/schema, and an optional description.',
    android: {
      packageName: 'com.developerstring.ketoy.registry',
      annotations: [],
      imports: [],
      sourceCode: `data class FunctionInfo(
    val name: String,
    val handler: (Map<String, Any>) -> Unit,
    val parameterTypes: Map<String, String> = emptyMap(),
    val description: String = ""
)`,
    },
    properties: [
      { name: 'name', type: 'String', default: '—', description: 'Function identifier used in JSON "functionName" and as the registry key.' },
      { name: 'handler', type: '(Map<String, Any>) -> Unit', default: '—', description: 'The function body. Receives a map of typed arguments extracted from JSON primitives. Invoked by KetoyFunctionRegistry.call().' },
      { name: 'parameterTypes', type: 'Map<String, String>', default: 'emptyMap()', description: 'Map of parameter name → type name (e.g. "productId" to "String"). Used for documentation and schema generation. Empty for no-argument functions.' },
      { name: 'description', type: 'String', default: '""', description: 'Optional human-readable description of what the function does.' },
    ],
    usage: `val info = FunctionInfo(
    name = "addToCart",
    handler = { params ->
        val productId = params["productId"] as? String ?: return@FunctionInfo
        val quantity = params["quantity"] as? Int ?: 1
        cartRepository.add(productId, quantity)
    },
    parameterTypes = mapOf("productId" to "String", "quantity" to "Int"),
    description = "Add a product to the shopping cart"
)

// Access metadata
println(info.name)                 // "addToCart"
println(info.parameterTypes)       // {productId=String, quantity=Int}
println(info.description)          // "Add a product to the shopping cart"

// Invoke
info.handler(mapOf("productId" to "SKU-123", "quantity" to 2))`,
    notes: 'Nested inside KetoyFunctionRegistry. Used as the value type in the internal functions map. The handler is invoked on the caller\'s thread — use withContext(Dispatchers.IO) inside if the function performs I/O.',
    seeAlso: ['KetoyFunctionRegistry', 'KComponentRegistry', 'KComponentInfo'],
  },

}

export default registryData
