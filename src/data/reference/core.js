/**
 * Ketoy SDK – Core Module
 * Package: com.developerstring.ketoy.core
 */

const coreData = {

  /* ── Core > Actions ── */

  ActionRegistry: {
    name: 'ActionRegistry',
    kind: 'object',
    module: 'core',
    subpackage: 'actions',
    category: 'Core',
    subcategory: 'Actions',
    description: 'Global registry that maps action IDs to callback lambdas. Used by the DSL layer to capture onClick / onValueChange lambdas and by the renderer layer to invoke them when the user interacts.',
    android: {
      packageName: 'com.developerstring.ketoy.core',
      annotations: [],
      imports: [],
      sourceCode: `object ActionRegistry {

    private val actions = mutableMapOf<String, () -> Unit>()
    private val textChangeActions = mutableMapOf<String, (String) -> Unit>()
    private var counter = 0

    fun register(action: () -> Unit): String { ... }
    fun registerAction(id: String, action: () -> Unit) { ... }
    fun registerTextChange(action: (String) -> Unit): String { ... }
    fun registerTextChange(id: String, action: (String) -> Unit) { ... }
    fun get(id: String): (() -> Unit)? = actions[id]
    fun getTextChange(id: String): ((String) -> Unit)? = textChangeActions[id]
    fun execute(id: String) { actions[id]?.invoke() }
    fun executeTextChange(id: String, value: String) { ... }
    fun clear() { ... }
}`,
    },
    methods: [
      { name: 'register(action: () -> Unit)', returns: 'String', description: 'Register an action lambda and return an auto-generated ID (e.g. "action_0").' },
      { name: 'registerAction(id: String, action: () -> Unit)', returns: 'Unit', description: 'Register an action lambda with a specific ID.' },
      { name: 'registerTextChange(action: (String) -> Unit)', returns: 'String', description: 'Register a text change action lambda and return an auto-generated ID.' },
      { name: 'registerTextChange(id: String, action: (String) -> Unit)', returns: 'Unit', description: 'Register a text change action with a specific ID.' },
      { name: 'get(id: String)', returns: '(() -> Unit)?', description: 'Retrieve an action by its ID, or null if not found.' },
      { name: 'getTextChange(id: String)', returns: '((String) -> Unit)?', description: 'Retrieve a text change action by its ID, or null if not found.' },
      { name: 'execute(id: String)', returns: 'Unit', description: 'Execute an action by its ID. No-op if the ID is not registered.' },
      { name: 'executeTextChange(id: String, value: String)', returns: 'Unit', description: 'Execute a text change action by its ID with the given value.' },
      { name: 'clear()', returns: 'Unit', description: 'Clear all registered actions and text change actions. Resets the counter to 0.' },
    ],
    usage: `// Register an action
val actionId = ActionRegistry.register { 
    navigateToScreen("details") 
}

// Execute the action later (e.g. from renderer)
ActionRegistry.execute(actionId)

// Register text change handler
val textChangeId = ActionRegistry.registerTextChange { newText ->
    viewModel.updateSearch(newText)
}

// Cleanup
ActionRegistry.clear()`,
    notes: 'Auto-generated IDs follow the pattern "action_N" for click actions and "textChange_N" for text change actions. The counter increments globally across both types.',
    seeAlso: ['KetoyVariableRegistry', 'ketoyRemember', 'ketoyMutableStateOf', 'KComponent'],
  },

  /* ── Core > Serialization ── */

  KetoyJson: {
    name: 'KetoyJson',
    kind: 'top-level property',
    module: 'core',
    subpackage: 'serialization',
    category: 'Core',
    subcategory: 'Serialization',
    description: 'Global Json instance used throughout the SDK for consistent serialization / deserialization. Configured with prettyPrint, no encodeDefaults, and ignoreUnknownKeys.',
    android: {
      packageName: 'com.developerstring.ketoy.core',
      annotations: [],
      imports: [
        'import kotlinx.serialization.json.Json',
      ],
      sourceCode: `val KetoyJson: Json = Json {
    prettyPrint = true
    encodeDefaults = false
    ignoreUnknownKeys = true
}`,
    },
    properties: [
      { name: 'prettyPrint', type: 'Boolean', default: 'true', description: 'JSON output is formatted with indentation for readability.' },
      { name: 'encodeDefaults', type: 'Boolean', default: 'false', description: 'Properties with default values are omitted from serialized output.' },
      { name: 'ignoreUnknownKeys', type: 'Boolean', default: 'true', description: 'Unknown properties in JSON input are silently ignored during deserialization.' },
    ],
    notes: 'This is a top-level val, not a class. Use it directly: KetoyJson.encodeToString(...) or KetoyJson.decodeFromString(...).',
    seeAlso: ['KetoyJsonUtils', 'KetoyCloudScreenFromJson', 'KetoyCloudScreen'],
  },

  KetoyJsonUtils: {
    name: 'KetoyJsonUtils',
    kind: 'top-level functions',
    module: 'core',
    subpackage: 'serialization',
    category: 'Core',
    subcategory: 'Serialization',
    description: 'Utility extension and top-level functions for converting KNode trees to/from JSON. Includes enhanced JSON support with component metadata and schema versioning.',
    android: {
      packageName: 'com.developerstring.ketoy.core',
      annotations: [],
      imports: [
        'import com.developerstring.ketoy.model.*',
        'import com.developerstring.ketoy.registry.KComponentRegistry',
        'import kotlinx.serialization.encodeToString',
      ],
      sourceCode: `fun KNode.toJson(): String {
    return KetoyJson.encodeToString(KNode.serializer(), this)
}

fun KNode.toEnhancedJson(): String {
    val usedComponents = extractUsedComponents(this)
    val componentMetadata = usedComponents.mapNotNull { name ->
        KComponentRegistry.getMetadata(name)?.let { name to it }
    }.toMap()
    val schema = KetoyJsonSchema(
        ui = this,
        components = componentMetadata,
        requiredImports = componentMetadata.values
            .flatMap { it.imports }.distinct()
    )
    return KetoyJson.encodeToString(KetoyJsonSchema.serializer(), schema)
}

fun parseEnhancedJson(jsonString: String): KNode { ... }

fun parseKetoyJson(jsonString: String): KNode { ... }`,
    },
    methods: [
      { name: 'KNode.toJson()', returns: 'String', description: 'Extension function. Convert a KNode to a compact JSON string using KetoyJson serializer.' },
      { name: 'KNode.toEnhancedJson()', returns: 'String', description: 'Extension function. Convert a KNode to an enhanced JSON string that includes component metadata, schema version, and required imports.' },
      { name: 'parseEnhancedJson(jsonString: String)', returns: 'KNode', description: 'Parse an enhanced-JSON string (with component metadata) back to a KNode. Falls back to plain JSON parsing on failure.' },
      { name: 'parseKetoyJson(jsonString: String)', returns: 'KNode', description: 'Parse a plain Ketoy JSON string to a KNode. Returns an error KTextNode on failure.' },
    ],
    usage: `// Serialize to JSON
val json: String = myNode.toJson()

// Serialize with metadata
val enhanced: String = myNode.toEnhancedJson()

// Parse from JSON
val node: KNode = parseKetoyJson(jsonString)

// Parse enhanced JSON (auto-loads component metadata)
val node: KNode = parseEnhancedJson(enhancedJsonString)`,
    notes: 'parseEnhancedJson automatically registers component metadata from the JSON into KComponentRegistry if not already available. parseKetoyJson returns a KTextNode with an error message on parse failure instead of throwing.',
    seeAlso: ['KetoyJson', 'KComponent', 'KetoyCloudScreenFromJson', 'KetoyCloudScreen'],
  },

  /* ── Core > State Management ── */

  KetoyVariableRegistry: {
    name: 'KetoyVariableRegistry',
    kind: 'object',
    module: 'core',
    subpackage: 'state',
    category: 'Core',
    subcategory: 'State Management',
    description: 'Simple state-management registry for Ketoy variables. Variables are stored by a string ID and can be immutable or mutable. Templates such as {{data:userId:name}} are resolved at render time.',
    android: {
      packageName: 'com.developerstring.ketoy.core',
      annotations: [],
      imports: [
        'import com.developerstring.ketoy.model.KetoyVariable',
      ],
      sourceCode: `object KetoyVariableRegistry {

    private val variables = mutableMapOf<String, KetoyVariable<*>>()

    fun <T> register(variable: KetoyVariable<T>): KetoyVariable<T> { ... }
    fun <T> get(id: String): KetoyVariable<T>? { ... }
    fun getValue(id: String): Any? { ... }
    fun <T> updateValue(id: String, newValue: T): Boolean { ... }
    fun clear() { ... }
    fun getAllVariables(): Map<String, KetoyVariable<*>> { ... }
    fun resolveTemplate(template: String): String { ... }
}`,
    },
    methods: [
      { name: 'register(variable: KetoyVariable<T>)', returns: 'KetoyVariable<T>', description: 'Register a KetoyVariable (Immutable or Mutable) and return it.' },
      { name: 'get(id: String)', returns: 'KetoyVariable<T>?', description: 'Retrieve a variable by its ID, cast to the expected type.' },
      { name: 'getValue(id: String)', returns: 'Any?', description: 'Get the raw value of a variable by ID.' },
      { name: 'updateValue(id: String, newValue: T)', returns: 'Boolean', description: 'Update a mutable variable\'s value. Returns false if the variable doesn\'t exist or is immutable.' },
      { name: 'clear()', returns: 'Unit', description: 'Clear all registered variables.' },
      { name: 'getAllVariables()', returns: 'Map<String, KetoyVariable<*>>', description: 'Get a snapshot of all registered variables.' },
      { name: 'resolveTemplate(template: String)', returns: 'String', description: 'Resolve {{data:id:field}} and {{enum:id:property}} placeholders within the supplied template string.' },
    ],
    usage: `// Using DSL convenience functions
val name = ketoyRemember("user.name", "Alice")
val count = ketoyMutableStateOf("counter.value", 0)

// Update a mutable variable
KetoyVariableRegistry.updateValue("counter.value", 42)

// Template resolution
val resolved = variableValue("Hello, {{data:user:name}}!")
// → "Hello, Alice!"

// Get all variables
val all = KetoyVariableRegistry.getAllVariables()`,
    notes: 'Templates support two patterns: {{data:id:field}} for data variables and {{enum:id:property}} for enum variables. Both resolve using the "id.field" key format.',
    seeAlso: ['ketoyRemember', 'ketoyMutableStateOf', 'variableValue', 'ActionRegistry'],
  },

  ketoyRemember: {
    name: 'ketoyRemember',
    kind: 'top-level function',
    module: 'core',
    subpackage: 'state',
    category: 'Core',
    subcategory: 'State Management',
    description: 'DSL convenience function to register an immutable Ketoy variable. Creates and registers a KetoyVariable.Immutable in the KetoyVariableRegistry.',
    android: {
      packageName: 'com.developerstring.ketoy.core',
      annotations: [],
      imports: [
        'import com.developerstring.ketoy.model.KetoyVariable',
      ],
      sourceCode: `fun <T> ketoyRemember(id: String, value: T): KetoyVariable.Immutable<T> {
    @Suppress("UNCHECKED_CAST")
    return KetoyVariableRegistry.register(
        KetoyVariable.Immutable(id, value)
    ) as KetoyVariable.Immutable<T>
}`,
    },
    properties: [
      { name: 'id', type: 'String', default: '—', description: 'Unique identifier for the variable.' },
      { name: 'value', type: 'T', default: '—', description: 'The immutable value to store.' },
    ],
    usage: `val userName = ketoyRemember("user.name", "Alice")`,
    seeAlso: ['KetoyVariableRegistry', 'ketoyMutableStateOf', 'variableValue'],
  },

  ketoyMutableStateOf: {
    name: 'ketoyMutableStateOf',
    kind: 'top-level function',
    module: 'core',
    subpackage: 'state',
    category: 'Core',
    subcategory: 'State Management',
    description: 'DSL convenience function to register a mutable Ketoy variable. Creates and registers a KetoyVariable.Mutable in the KetoyVariableRegistry.',
    android: {
      packageName: 'com.developerstring.ketoy.core',
      annotations: [],
      imports: [
        'import com.developerstring.ketoy.model.KetoyVariable',
      ],
      sourceCode: `fun <T> ketoyMutableStateOf(id: String, value: T): KetoyVariable.Mutable<T> {
    @Suppress("UNCHECKED_CAST")
    return KetoyVariableRegistry.register(
        KetoyVariable.Mutable(id, value)
    ) as KetoyVariable.Mutable<T>
}`,
    },
    properties: [
      { name: 'id', type: 'String', default: '—', description: 'Unique identifier for the variable.' },
      { name: 'value', type: 'T', default: '—', description: 'The initial mutable value to store.' },
    ],
    usage: `val counter = ketoyMutableStateOf("counter.value", 0)
KetoyVariableRegistry.updateValue("counter.value", 42)`,
    seeAlso: ['KetoyVariableRegistry', 'ketoyRemember', 'variableValue'],
  },

  variableValue: {
    name: 'variableValue',
    kind: 'top-level function',
    module: 'core',
    subpackage: 'state',
    category: 'Core',
    subcategory: 'State Management',
    description: 'DSL convenience function to resolve variable template strings. Delegates to KetoyVariableRegistry.resolveTemplate().',
    android: {
      packageName: 'com.developerstring.ketoy.core',
      annotations: [],
      imports: [],
      sourceCode: `fun variableValue(template: String): String =
    KetoyVariableRegistry.resolveTemplate(template)`,
    },
    properties: [
      { name: 'template', type: 'String', default: '—', description: 'Template string containing {{data:id:field}} or {{enum:id:property}} placeholders.' },
    ],
    usage: `val greeting = variableValue("Hello, {{data:user:name}}!")
// → "Hello, Alice!" (if user.name is registered)`,
    seeAlso: ['KetoyVariableRegistry', 'ketoyRemember', 'ketoyMutableStateOf'],
  },

}

export default coreData
