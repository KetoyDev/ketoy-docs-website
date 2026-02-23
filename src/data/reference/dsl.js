/**
 * Ketoy SDK – DSL Module
 * Package: com.developerstring.ketoy.dsl
 */

const dslData = {

  /* ══════════════════════════════════════════════
     SUBPACKAGE: scope
     ══════════════════════════════════════════════ */

  KScope: {
    name: 'KScope',
    kind: 'abstract class',
    module: 'dsl',
    subpackage: 'scope',
    category: 'DSL',
    subcategory: 'Scopes',
    description:
      'Abstract base class for all Ketoy DSL scopes. Maintains an ordered list of child KNode elements and provides the fundamental addChild mechanism that every concrete scope inherits.',
    android: {
      packageName: 'com.developerstring.ketoy.dsl',
      annotations: [],
      imports: [
        'import com.developerstring.ketoy.model.KNode',
      ],
      sourceCode: `abstract class KScope {
    val children = mutableListOf<KNode>()
    fun addChild(node: KNode) { children += node }
}`,
    },
    properties: [
      { name: 'children', type: 'MutableList<KNode>', default: 'mutableListOf()', description: 'Ordered list of child nodes accumulated during DSL evaluation.' },
    ],
    methods: [
      { name: 'addChild(node: KNode)', returns: 'Unit', description: 'Appends a KNode to the children list.' },
    ],
    usage: `// KScope is abstract – use a concrete subclass such as KUniversalScope
val scope = KUniversalScope().apply {
    KText("Hello")
}
val nodes = scope.children // [KTextNode(...)]`,
    notes:
      'KScope is never instantiated directly. Use KUniversalScope, KLazyListScope, KNavigationScope, or one of the other concrete scopes.',
    seeAlso: ['KUniversalScope', 'KLazyListScope', 'KNavigationScope'],
  },

  /* ─────────────────────────────────────────── */

  KUniversalScope: {
    name: 'KUniversalScope',
    kind: 'open class',
    module: 'dsl',
    subpackage: 'scope',
    category: 'DSL',
    subcategory: 'Scopes',
    description:
      'The primary DSL scope and receiver for almost every content lambda in the Ketoy SDK. Provides builder functions for ALL built-in UI components – layout containers, input fields, navigation chrome, and utility helpers. Most DSL entry points use KUniversalScope as their receiver.',
    android: {
      packageName: 'com.developerstring.ketoy.dsl',
      annotations: [],
      imports: [
        'import com.developerstring.ketoy.model.*',
        'import com.developerstring.ketoy.util.KModifier',
        'import com.developerstring.ketoy.util.KColors',
        'import com.developerstring.ketoy.util.KIcons',
        'import com.developerstring.ketoy.util.KShapes',
        'import com.developerstring.ketoy.core.ActionRegistry',
      ],
      sourceCode: `open class KUniversalScope : KScope() {

    // ── Text ──
    fun KText(
        text: String,
        modifier: KModifier? = null,
        fontSize: String? = null,
        fontWeight: String? = null,
        color: String? = null,
        textAlign: String? = null,
        maxLines: Int? = null,
        overflow: String? = null,
        letterSpacing: String? = null,
        lineHeight: String? = null
    ) { addChild(KTextNode(...)) }

    // ── Button ──
    fun KButton(
        modifier: KModifier? = null,
        onClick: (() -> Unit)? = null,
        enabled: Boolean = true,
        containerColor: String? = null,
        contentColor: String? = null,
        elevation: String? = null,
        shape: String? = null,
        actionId: String? = null,
        content: KUniversalScope.() -> Unit
    ) { ... }

    // ── Layout ──
    fun KColumn(
        modifier: KModifier? = null,
        verticalArrangement: String? = null,
        horizontalAlignment: String? = null,
        content: KUniversalScope.() -> Unit
    ) { ... }

    fun KRow(
        modifier: KModifier? = null,
        horizontalArrangement: String? = null,
        verticalAlignment: String? = null,
        content: KUniversalScope.() -> Unit
    ) { ... }

    fun KBox(
        modifier: KModifier? = null,
        contentAlignment: String? = null,
        content: KUniversalScope.() -> Unit
    ) { ... }

    // ── Card ──
    fun KCard(
        modifier: KModifier? = null,
        shape: String? = null,
        containerColor: String? = null,
        contentColor: String? = null,
        elevation: String? = null,
        border: String? = null,
        onClick: (() -> Unit)? = null,
        enabled: Boolean = true,
        actionId: String? = null,
        content: KUniversalScope.() -> Unit
    ) { ... }

    // ... 30+ additional builder methods ...
}`,
    },
    properties: [
      { name: 'children', type: 'MutableList<KNode>', default: 'mutableListOf()', description: 'Inherited from KScope. Stores the accumulated child nodes.' },
    ],
    methods: [
      { name: 'KText(text: String, modifier: KModifier?, fontSize: String?, fontWeight: String?, color: String?, textAlign: String?, maxLines: Int?, overflow: String?, letterSpacing: String?, lineHeight: String?)', returns: 'Unit', description: 'Adds a text node. Supports Material 3 typography properties and theme color references.' },
      { name: 'KButton(modifier: KModifier?, onClick: (() -> Unit)?, enabled: Boolean, containerColor: String?, contentColor: String?, elevation: String?, shape: String?, actionId: String?, content: KUniversalScope.() -> Unit)', returns: 'Unit', description: 'Adds a button with customizable appearance and an onClick handler (registered via ActionRegistry).' },
      { name: 'KColumn(modifier: KModifier?, verticalArrangement: String?, horizontalAlignment: String?, content: KUniversalScope.() -> Unit)', returns: 'Unit', description: 'Adds a vertical layout container (maps to Compose Column).' },
      { name: 'KRow(modifier: KModifier?, horizontalArrangement: String?, verticalAlignment: String?, content: KUniversalScope.() -> Unit)', returns: 'Unit', description: 'Adds a horizontal layout container (maps to Compose Row).' },
      { name: 'KBox(modifier: KModifier?, contentAlignment: String?, content: KUniversalScope.() -> Unit)', returns: 'Unit', description: 'Adds a box layout container (maps to Compose Box).' },
      { name: 'KLazyColumn(modifier: KModifier?, verticalArrangement: String?, horizontalAlignment: String?, userScrollEnabled: Boolean?, reverseLayout: Boolean?, contentPadding: String?, beyondBoundsItemCount: Int?, content: KLazyListScope.() -> Unit)', returns: 'Unit', description: 'Adds a lazily-loaded vertical scrolling list.' },
      { name: 'KLazyRow(modifier: KModifier?, horizontalArrangement: String?, verticalAlignment: String?, userScrollEnabled: Boolean?, reverseLayout: Boolean?, contentPadding: String?, beyondBoundsItemCount: Int?, content: KLazyListScope.() -> Unit)', returns: 'Unit', description: 'Adds a lazily-loaded horizontal scrolling list.' },
      { name: 'KSpacer(modifier: KModifier?, width: String?, height: String?)', returns: 'Unit', description: 'Adds an empty spacer node for layout spacing.' },
      { name: 'KTextField(value: String, onValueChange: ((String) -> Unit)?, modifier: KModifier?, ..., content: KTextFieldScope.() -> Unit)', returns: 'Unit', description: 'Adds a Material 3 text input field with slot-based configuration via KTextFieldScope.' },
      { name: 'KImage(source: String, modifier: KModifier?, contentDescription: String?, scaleType: String?)', returns: 'Unit', description: 'Adds an image node. Source can be a URL, asset path, or resource reference.' },
      { name: 'KIcon(icon: String, modifier: KModifier?, size: String?, color: String?, style: String?, contentDescription: String?)', returns: 'Unit', description: 'Adds an icon from a string name (resolved via KIcons registry).' },
      { name: 'KIcon(icon: KIconRef, modifier: KModifier?, size: String?, color: String?, contentDescription: String?)', returns: 'Unit', description: 'Adds an icon from a typed KIconRef reference.' },
      { name: 'KIconButton(icon: String, onClick: (() -> Unit)?, modifier: KModifier?, ..., content: KUniversalScope.() -> Unit)', returns: 'Unit', description: 'Adds a clickable icon button using a string icon name.' },
      { name: 'KIconButton(icon: KIconRef, onClick: (() -> Unit)?, modifier: KModifier?, ..., content: KUniversalScope.() -> Unit)', returns: 'Unit', description: 'Adds a clickable icon button using a typed KIconRef.' },
      { name: 'KCard(modifier: KModifier?, shape: String?, containerColor: String?, contentColor: String?, elevation: String?, border: String?, onClick: (() -> Unit)?, enabled: Boolean, actionId: String?, content: KUniversalScope.() -> Unit)', returns: 'Unit', description: 'Adds a Material 3 card container with optional click handling.' },
      { name: 'KComponent(name: String, modifier: KModifier?, vararg properties: Pair<String, Any?>, ..., content: KUniversalScope.() -> Unit)', returns: 'Unit', description: 'Adds a custom registered component by name with vararg property pairs.' },
      { name: 'KComponent(name: String, properties: Map<String, Any?>, props: Map<String, Any?>, modifier: KModifier?, ..., content: KUniversalScope.() -> Unit)', returns: 'Unit', description: 'Adds a custom registered component by name with Map-based properties.' },
      { name: 'KComponentSmart(name: String, properties: Map<String, Any?>, modifier: KModifier?, autoLoad: Boolean, showError: Boolean)', returns: 'Unit', description: 'Adds a smart component that auto-resolves its renderer from the widget registry.' },
      { name: 'KFunctionCall(functionName: String, vararg arguments: Pair<String, Any?>)', returns: 'String', description: 'Serializes a function call node with vararg argument pairs. Returns the generated action ID.' },
      { name: 'KFunctionCall(functionName: String, arguments: Map<String, Any?>)', returns: 'String', description: 'Serializes a function call node with Map-based arguments. Returns the generated action ID.' },
      { name: 'KScaffold(modifier: KModifier?, containerColor: String?, contentColor: String?, ..., topBar: (KScaffoldScope.() -> Unit)?, bottomBar: (KScaffoldScope.() -> Unit)?, snackbarHost: (KScaffoldScope.() -> Unit)?, floatingActionButton: (KScaffoldScope.() -> Unit)?, floatingActionButtonPosition: String?, content: KUniversalScope.() -> Unit)', returns: 'Unit', description: 'Adds a Material 3 scaffold layout with slots for top bar, bottom bar, FAB, and snackbar host.' },
      { name: 'KTopAppBar(modifier: KModifier?, colors: String?, windowInsets: String?, scrollBehavior: String?, type: String?, expandedHeight: String?, title: (KAppBarScope.() -> Unit)?, navigationIcon: (KAppBarScope.() -> Unit)?, actions: (KAppBarScope.() -> Unit)?)', returns: 'Unit', description: 'Adds a Material 3 top app bar. Type can be "small", "medium", or "large".' },
      { name: 'KBottomAppBar(modifier: KModifier?, containerColor: String?, contentColor: String?, ..., content: KAppBarScope.() -> Unit)', returns: 'Unit', description: 'Adds a Material 3 bottom app bar.' },
      { name: 'KNavigationBar(modifier: KModifier?, containerColor: String?, contentColor: String?, tonalElevation: String?, windowInsets: String?, content: KNavigationScope.() -> Unit)', returns: 'Unit', description: 'Adds a Material 3 bottom navigation bar with navigation items defined via KNavigationScope.' },
      { name: 'KNavigationRail(modifier: KModifier?, containerColor: String?, contentColor: String?, windowInsets: String?, header: (KUniversalScope.() -> Unit)?, content: KNavigationRailScope.() -> Unit)', returns: 'Unit', description: 'Adds a Material 3 navigation rail with items defined via KNavigationRailScope.' },
      { name: 'KFloatingActionButton(onClick: (() -> Unit)?, modifier: KModifier?, shape: String?, containerColor: String?, contentColor: String?, elevation: String?, ..., content: KUniversalScope.() -> Unit)', returns: 'Unit', description: 'Adds a floating action button.' },
      { name: 'KSnackBar(modifier: KModifier?, ..., message: String?, duration: String?, action: (KSnackBarScope.() -> Unit)?, dismissAction: (KSnackBarScope.() -> Unit)?)', returns: 'Unit', description: 'Adds a snackbar with configurable message, duration, and action/dismiss slots.' },
      { name: 'KModalBottomSheet(onDismissRequest: (() -> Unit)?, modifier: KModifier?, ..., dragHandle: (KUniversalScope.() -> Unit)?, content: KUniversalScope.() -> Unit)', returns: 'Unit', description: 'Adds a modal bottom sheet overlay.' },
      { name: 'KSnackBarHost(hostState: String?, modifier: KModifier?, snackbar: (KSnackBarScope.() -> Unit)?)', returns: 'Unit', description: 'Adds a snackbar host that manages display of snackbars within a scaffold.' },
      { name: 'addComponent(component: KNode)', returns: 'Unit', description: 'Directly adds a pre-built KNode to the children list. Low-level escape hatch.' },
      { name: 'KIf(condition: Boolean, content: KUniversalScope.() -> Unit)', returns: 'Unit', description: 'Conditionally includes child nodes only when the condition is true.' },
      { name: 'KForEach(items: List<Any>, content: KUniversalScope.(Any) -> Unit)', returns: 'Unit', description: 'Iterates over a list and produces child nodes for each item.' },
      { name: 'KRepeat(times: Int, content: KUniversalScope.(Int) -> Unit)', returns: 'Unit', description: 'Repeats child content a fixed number of times with the current index.' },
      { name: 'KDataClass(id: String, className: String, vararg fields: Pair<String, Any?>)', returns: 'Unit', description: 'Declares a data class node with typed fields in the DSL tree.' },
      { name: 'KEnum(id: String, enumName: String, values: List<String>, selectedValue: String?, onSelectionChange: ((String) -> Unit)?, actionId: String?)', returns: 'Unit', description: 'Declares an enum selector node in the DSL tree.' },
      { name: 'addAny(component: KNode)', returns: 'Unit', description: 'Alias for addComponent – adds any KNode directly.' },
      { name: 'createText(text: String, color: String?)', returns: 'Unit', description: 'Shortcut for creating a simple text node with optional color.' },
      { name: 'createButton(text: String, color: String?, onClick: (() -> Unit)?)', returns: 'Unit', description: 'Shortcut for creating a simple labelled button with optional color and click.' },
    ],
    usage: `// KUniversalScope is the receiver for most content lambdas
val root = KColumn {
    KText(
        text = "Welcome to Ketoy",
        fontSize = "24sp",
        fontWeight = "Bold",
        color = KColors.Primary
    )
    KButton(
        onClick = { println("Tapped!") },
        containerColor = KColors.Primary,
        contentColor = KColors.OnPrimary
    ) {
        KText("Click Me")
    }
    KRow(horizontalArrangement = KArrangements.SpaceBetween) {
        KIcon(icon = KIcons.Home, color = KColors.Primary)
        KSpacer(width = "8dp")
        KText("Home")
    }
    KCard(
        modifier = kModifier { padding("16dp") },
        elevation = "4dp",
        shape = KShapes.Medium
    ) {
        KText("Card Content")
    }
    KIf(showDetails) {
        KText("Details visible")
    }
    KForEach(items) { item ->
        KText(item.toString())
    }
}`,
    notes:
      'KUniversalScope is open so it can be extended by specialised scopes (KScaffoldScope, KAppBarScope, KSnackBarScope). The onClick lambdas are registered in ActionRegistry and serialized as action IDs.',
    seeAlso: [
      'KScope', 'KLazyListScope', 'KTextFieldScope', 'KScaffoldScope',
      'KAppBarScope', 'KNavigationScope', 'KSnackBarScope',
      'KColors', 'KIcons', 'KShapes',
    ],
  },

  /* ─────────────────────────────────────────── */

  KLazyListScope: {
    name: 'KLazyListScope',
    kind: 'class',
    module: 'dsl',
    subpackage: 'scope',
    category: 'DSL',
    subcategory: 'Scopes',
    description:
      'DSL scope used as the receiver for KLazyColumn and KLazyRow content lambdas. Provides lazy-list–specific item and items builder methods analogous to Compose\'s LazyListScope.',
    android: {
      packageName: 'com.developerstring.ketoy.dsl',
      annotations: [],
      imports: [
        'import com.developerstring.ketoy.model.KNode',
      ],
      sourceCode: `class KLazyListScope : KScope() {

    fun item(content: KUniversalScope.() -> Unit) {
        val scope = KUniversalScope().apply(content)
        children.addAll(scope.children)
    }

    inline fun <T> items(
        items: List<T>,
        crossinline itemContent: KUniversalScope.(T) -> Unit
    ) {
        items.forEach { item ->
            val scope = KUniversalScope().apply { itemContent(item) }
            children.addAll(scope.children)
        }
    }

    inline fun <T> itemsIndexed(
        items: List<T>,
        crossinline itemContent: KUniversalScope.(Int, T) -> Unit
    ) {
        items.forEachIndexed { index, item ->
            val scope = KUniversalScope().apply { itemContent(index, item) }
            children.addAll(scope.children)
        }
    }

    inline fun <T> items(
        items: Array<T>,
        crossinline itemContent: KUniversalScope.(T) -> Unit
    ) {
        items.forEach { item ->
            val scope = KUniversalScope().apply { itemContent(item) }
            children.addAll(scope.children)
        }
    }

    inline fun items(
        count: Int,
        crossinline itemContent: KUniversalScope.(Int) -> Unit
    ) {
        repeat(count) { index ->
            val scope = KUniversalScope().apply { itemContent(index) }
            children.addAll(scope.children)
        }
    }
}`,
    },
    properties: [
      { name: 'children', type: 'MutableList<KNode>', default: 'mutableListOf()', description: 'Inherited from KScope. Stores accumulated lazy-list item nodes.' },
    ],
    methods: [
      { name: 'item(content: KUniversalScope.() -> Unit)', returns: 'Unit', description: 'Adds a single item to the lazy list.' },
      { name: 'items(items: List<T>, itemContent: KUniversalScope.(T) -> Unit)', returns: 'Unit', description: 'Adds one item node per element in the list.' },
      { name: 'itemsIndexed(items: List<T>, itemContent: KUniversalScope.(Int, T) -> Unit)', returns: 'Unit', description: 'Adds one item node per element with its index.' },
      { name: 'items(items: Array<T>, itemContent: KUniversalScope.(T) -> Unit)', returns: 'Unit', description: 'Adds one item node per element in an array.' },
      { name: 'items(count: Int, itemContent: KUniversalScope.(Int) -> Unit)', returns: 'Unit', description: 'Adds count item nodes by index.' },
    ],
    usage: `KLazyColumn(
    modifier = kModifier { fillMaxSize() },
    verticalArrangement = KArrangements.spacedBy("8dp")
) {
    item {
        KText("Header", fontWeight = "Bold", fontSize = "20sp")
    }
    items(userList) { user ->
        KCard(modifier = kModifier { padding("8dp") }) {
            KText(user.name)
            KText(user.email, color = KColors.OnSurfaceVariant)
        }
    }
    itemsIndexed(userList) { index, user ->
        KRow {
            KText("\${index + 1}.")
            KSpacer(width = "4dp")
            KText(user.name)
        }
    }
    items(count = 10) { i ->
        KText("Placeholder #\$i")
    }
}`,
    notes:
      'Each item/items call internally creates a KUniversalScope, evaluates the lambda, and appends the resulting children. This mirrors Compose\'s LazyListScope API.',
    seeAlso: ['KScope', 'KUniversalScope'],
  },

  /* ─────────────────────────────────────────── */

  KTextFieldScope: {
    name: 'KTextFieldScope',
    kind: 'class',
    module: 'dsl',
    subpackage: 'scope',
    category: 'DSL',
    subcategory: 'Scopes',
    description:
      'DSL scope for configuring slot content inside a KTextField. Provides builder methods for label, placeholder, leading/trailing icons, prefix, suffix, and supporting text – each accepting a KUniversalScope lambda so any widget can be placed in each slot.',
    android: {
      packageName: 'com.developerstring.ketoy.dsl',
      annotations: [],
      imports: [
        'import com.developerstring.ketoy.model.KNode',
      ],
      sourceCode: `class KTextFieldScope : KScope() {

    private var labelContent: List<KNode>? = null
    private var placeholderContent: List<KNode>? = null
    private var leadingIconContent: List<KNode>? = null
    private var trailingIconContent: List<KNode>? = null
    private var prefixContent: List<KNode>? = null
    private var suffixContent: List<KNode>? = null
    private var supportingTextContent: List<KNode>? = null

    fun label(content: KUniversalScope.() -> Unit) {
        labelContent = KUniversalScope().apply(content).children
    }
    fun placeholder(content: KUniversalScope.() -> Unit) {
        placeholderContent = KUniversalScope().apply(content).children
    }
    fun leadingIcon(content: KUniversalScope.() -> Unit) {
        leadingIconContent = KUniversalScope().apply(content).children
    }
    fun trailingIcon(content: KUniversalScope.() -> Unit) {
        trailingIconContent = KUniversalScope().apply(content).children
    }
    fun prefix(content: KUniversalScope.() -> Unit) {
        prefixContent = KUniversalScope().apply(content).children
    }
    fun suffix(content: KUniversalScope.() -> Unit) {
        suffixContent = KUniversalScope().apply(content).children
    }
    fun supportingText(content: KUniversalScope.() -> Unit) {
        supportingTextContent = KUniversalScope().apply(content).children
    }

    fun getLabelContent(): List<KNode>? = labelContent
    fun getPlaceholderContent(): List<KNode>? = placeholderContent
    fun getLeadingIconContent(): List<KNode>? = leadingIconContent
    fun getTrailingIconContent(): List<KNode>? = trailingIconContent
    fun getPrefixContent(): List<KNode>? = prefixContent
    fun getSuffixContent(): List<KNode>? = suffixContent
    fun getSupportingTextContent(): List<KNode>? = supportingTextContent
}`,
    },
    properties: [
      { name: 'labelContent', type: 'List<KNode>?', default: 'null', description: 'Internal storage for label slot children.' },
      { name: 'placeholderContent', type: 'List<KNode>?', default: 'null', description: 'Internal storage for placeholder slot children.' },
      { name: 'leadingIconContent', type: 'List<KNode>?', default: 'null', description: 'Internal storage for leading icon slot children.' },
      { name: 'trailingIconContent', type: 'List<KNode>?', default: 'null', description: 'Internal storage for trailing icon slot children.' },
      { name: 'prefixContent', type: 'List<KNode>?', default: 'null', description: 'Internal storage for prefix slot children.' },
      { name: 'suffixContent', type: 'List<KNode>?', default: 'null', description: 'Internal storage for suffix slot children.' },
      { name: 'supportingTextContent', type: 'List<KNode>?', default: 'null', description: 'Internal storage for supporting text slot children.' },
    ],
    methods: [
      { name: 'label(content: KUniversalScope.() -> Unit)', returns: 'Unit', description: 'Sets the label slot content for the text field.' },
      { name: 'placeholder(content: KUniversalScope.() -> Unit)', returns: 'Unit', description: 'Sets the placeholder slot content for the text field.' },
      { name: 'leadingIcon(content: KUniversalScope.() -> Unit)', returns: 'Unit', description: 'Sets the leading icon slot content.' },
      { name: 'trailingIcon(content: KUniversalScope.() -> Unit)', returns: 'Unit', description: 'Sets the trailing icon slot content.' },
      { name: 'prefix(content: KUniversalScope.() -> Unit)', returns: 'Unit', description: 'Sets the prefix slot content.' },
      { name: 'suffix(content: KUniversalScope.() -> Unit)', returns: 'Unit', description: 'Sets the suffix slot content.' },
      { name: 'supportingText(content: KUniversalScope.() -> Unit)', returns: 'Unit', description: 'Sets the supporting/helper text slot content.' },
      { name: 'getLabelContent()', returns: 'List<KNode>?', description: 'Returns the label slot children, or null if not set.' },
      { name: 'getPlaceholderContent()', returns: 'List<KNode>?', description: 'Returns the placeholder slot children, or null if not set.' },
      { name: 'getLeadingIconContent()', returns: 'List<KNode>?', description: 'Returns the leading icon slot children, or null if not set.' },
      { name: 'getTrailingIconContent()', returns: 'List<KNode>?', description: 'Returns the trailing icon slot children, or null if not set.' },
      { name: 'getPrefixContent()', returns: 'List<KNode>?', description: 'Returns the prefix slot children, or null if not set.' },
      { name: 'getSuffixContent()', returns: 'List<KNode>?', description: 'Returns the suffix slot children, or null if not set.' },
      { name: 'getSupportingTextContent()', returns: 'List<KNode>?', description: 'Returns the supporting text slot children, or null if not set.' },
    ],
    usage: `KTextField(
    value = searchQuery,
    onValueChange = { searchQuery = it }
) {
    label { KText("Search") }
    placeholder { KText("Type to search...") }
    leadingIcon { KIcon(icon = KIcons.Search) }
    trailingIcon {
        KIconButton(icon = KIcons.Close, onClick = { searchQuery = "" })
    }
    supportingText { KText("Enter at least 3 characters") }
}`,
    notes:
      'Each slot method can only be called once per scope; the last call overwrites previous values. Getter methods are used internally by the renderer.',
    seeAlso: ['KScope', 'KUniversalScope'],
  },

  /* ─────────────────────────────────────────── */

  KScaffoldScope: {
    name: 'KScaffoldScope',
    kind: 'class',
    module: 'dsl',
    subpackage: 'scope',
    category: 'DSL',
    subcategory: 'Scopes',
    description:
      'Generic scaffold slot scope that extends KUniversalScope. Used as the receiver for topBar, bottomBar, snackbarHost, and floatingActionButton lambdas inside KScaffold. Because it extends KUniversalScope, all standard widget builders are available.',
    android: {
      packageName: 'com.developerstring.ketoy.dsl',
      annotations: [],
      imports: [],
      sourceCode: `class KScaffoldScope : KUniversalScope()`,
    },
    properties: [
      { name: 'children', type: 'MutableList<KNode>', default: 'mutableListOf()', description: 'Inherited from KScope via KUniversalScope.' },
    ],
    methods: [],
    innerClasses: [],
    usage: `KScaffold(
    topBar = {
        // 'this' is KScaffoldScope → all KUniversalScope builders available
        KTopAppBar(type = "medium") {
            KText("My App", fontWeight = "Bold")
        }
    },
    bottomBar = {
        KNavigationBar {
            KNavigationBarItem(
                selected = true,
                onClick = { },
                icon = { KIcon(icon = KIcons.Home) },
                label = { KText("Home") }
            )
        }
    },
    floatingActionButton = {
        KFloatingActionButton(onClick = { }) {
            KIcon(icon = KIcons.Add)
        }
    }
) {
    KColumn(modifier = kModifier { padding("16dp") }) {
        KText("Scaffold body content")
    }
}`,
    notes:
      'KScaffoldScope adds no new methods – it exists purely to provide a distinct type for scaffold slot lambdas while retaining full KUniversalScope capabilities.',
    seeAlso: ['KUniversalScope', 'KAppBarScope'],
  },

  /* ─────────────────────────────────────────── */

  KAppBarScope: {
    name: 'KAppBarScope',
    kind: 'class',
    module: 'dsl',
    subpackage: 'scope',
    category: 'DSL',
    subcategory: 'Scopes',
    description:
      'Scope for TopAppBar and BottomAppBar action slot lambdas. Extends KUniversalScope and adds KAppBarAction() and a convenience KIconButton() overload tailored for app bar actions.',
    android: {
      packageName: 'com.developerstring.ketoy.dsl',
      annotations: [],
      imports: [
        'import com.developerstring.ketoy.model.KNode',
        'import com.developerstring.ketoy.util.KModifier',
      ],
      sourceCode: `class KAppBarScope : KUniversalScope() {

    fun KAppBarAction(
        onClick: (() -> Unit)? = null,
        modifier: KModifier? = null,
        enabled: Boolean = true,
        colors: String? = null,
        interactionSource: String? = null,
        actionId: String? = null,
        content: KUniversalScope.() -> Unit
    ) { ... }

    fun KIconButton(
        onClick: (() -> Unit)? = null,
        modifier: KModifier? = null,
        enabled: Boolean = true,
        colors: String? = null,
        content: KUniversalScope.() -> Unit
    ) {
        KAppBarAction(onClick, modifier, enabled, colors, content = content)
    }
}`,
    },
    properties: [
      { name: 'children', type: 'MutableList<KNode>', default: 'mutableListOf()', description: 'Inherited from KScope via KUniversalScope.' },
    ],
    methods: [
      { name: 'KAppBarAction(onClick: (() -> Unit)?, modifier: KModifier?, enabled: Boolean, colors: String?, interactionSource: String?, actionId: String?, content: KUniversalScope.() -> Unit)', returns: 'Unit', description: 'Adds an action button to the app bar.' },
      { name: 'KIconButton(onClick: (() -> Unit)?, modifier: KModifier?, enabled: Boolean, colors: String?, content: KUniversalScope.() -> Unit)', returns: 'Unit', description: 'Convenience alias for KAppBarAction, creating a simple icon button.' },
    ],
    usage: `KTopAppBar(
    title = {
        KText("My Screen", fontWeight = "Bold")
    },
    navigationIcon = {
        KIconButton(onClick = { navigateBack() }) {
            KIcon(icon = KIcons.ArrowBack)
        }
    },
    actions = {
        // 'this' is KAppBarScope
        KAppBarAction(onClick = { openSearch() }) {
            KIcon(icon = KIcons.Search)
        }
        KIconButton(onClick = { openSettings() }) {
            KIcon(icon = KIcons.Settings)
        }
    }
)`,
    notes:
      'KIconButton inside KAppBarScope is a convenience wrapper around KAppBarAction. It differs from the KUniversalScope.KIconButton overloads which produce standalone icon button nodes.',
    seeAlso: ['KUniversalScope', 'KScaffoldScope'],
  },

  /* ─────────────────────────────────────────── */

  KNavigationScope: {
    name: 'KNavigationScope',
    kind: 'class',
    module: 'dsl',
    subpackage: 'scope',
    category: 'DSL',
    subcategory: 'Scopes',
    description:
      'DSL scope for defining navigation items inside KNavigationBar. Provides builder methods for Material 3 NavigationBarItem, NavigationDrawerItem, and a fully customisable KCustomNavigationItem.',
    android: {
      packageName: 'com.developerstring.ketoy.dsl',
      annotations: [],
      imports: [
        'import com.developerstring.ketoy.model.KNode',
        'import com.developerstring.ketoy.util.KModifier',
      ],
      sourceCode: `class KNavigationScope : KScope() {

    fun KNavigationBarItem(
        selected: Boolean,
        onClick: (() -> Unit)? = null,
        modifier: KModifier? = null,
        enabled: Boolean = true,
        alwaysShowLabel: Boolean = true,
        colors: String? = null,
        actionId: String? = null,
        icon: (KUniversalScope.() -> Unit)? = null,
        selectedIcon: (KUniversalScope.() -> Unit)? = null,
        label: (KUniversalScope.() -> Unit)? = null
    ) { ... }

    fun KNavigationDrawerItem(
        selected: Boolean,
        onClick: (() -> Unit)? = null,
        modifier: KModifier? = null,
        enabled: Boolean = true,
        colors: String? = null,
        shape: String? = null,
        actionId: String? = null,
        icon: (KUniversalScope.() -> Unit)? = null,
        label: (KUniversalScope.() -> Unit)? = null,
        badge: (KUniversalScope.() -> Unit)? = null
    ) { ... }

    fun KCustomNavigationItem(
        selected: Boolean,
        onClick: (() -> Unit)? = null,
        modifier: KModifier? = null,
        enabled: Boolean = true,
        alwaysShowLabel: Boolean = true,
        containerColor: String? = null,
        contentColor: String? = null,
        selectedContainerColor: String? = null,
        selectedContentColor: String? = null,
        indicatorColor: String? = null,
        rippleColor: String? = null,
        actionId: String? = null,
        icon: (KUniversalScope.() -> Unit)? = null,
        selectedIcon: (KUniversalScope.() -> Unit)? = null,
        label: (KUniversalScope.() -> Unit)? = null
    ) { ... }
}`,
    },
    properties: [
      { name: 'children', type: 'MutableList<KNode>', default: 'mutableListOf()', description: 'Inherited from KScope. Stores accumulated navigation item nodes.' },
    ],
    methods: [
      { name: 'KNavigationBarItem(selected: Boolean, onClick: (() -> Unit)?, modifier: KModifier?, enabled: Boolean, alwaysShowLabel: Boolean, colors: String?, actionId: String?, icon: (KUniversalScope.() -> Unit)?, selectedIcon: (KUniversalScope.() -> Unit)?, label: (KUniversalScope.() -> Unit)?)', returns: 'Unit', description: 'Adds a Material 3 NavigationBarItem with icon, selected icon, and label slots.' },
      { name: 'KNavigationDrawerItem(selected: Boolean, onClick: (() -> Unit)?, modifier: KModifier?, enabled: Boolean, colors: String?, shape: String?, actionId: String?, icon: (KUniversalScope.() -> Unit)?, label: (KUniversalScope.() -> Unit)?, badge: (KUniversalScope.() -> Unit)?)', returns: 'Unit', description: 'Adds a Material 3 NavigationDrawerItem with icon, label, and badge slots.' },
      { name: 'KCustomNavigationItem(selected: Boolean, onClick: (() -> Unit)?, modifier: KModifier?, enabled: Boolean, alwaysShowLabel: Boolean, containerColor: String?, contentColor: String?, selectedContainerColor: String?, selectedContentColor: String?, indicatorColor: String?, rippleColor: String?, actionId: String?, icon: (KUniversalScope.() -> Unit)?, selectedIcon: (KUniversalScope.() -> Unit)?, label: (KUniversalScope.() -> Unit)?)', returns: 'Unit', description: 'Adds a fully customisable navigation item with granular color control for each state.' },
    ],
    usage: `KNavigationBar(
    containerColor = KColors.Surface,
    contentColor = KColors.OnSurface
) {
    KNavigationBarItem(
        selected = currentRoute == "home",
        onClick = { navigate("home") },
        icon = { KIcon(icon = KIcons.HomeOutlined) },
        selectedIcon = { KIcon(icon = KIcons.Home) },
        label = { KText("Home") }
    )
    KNavigationBarItem(
        selected = currentRoute == "search",
        onClick = { navigate("search") },
        icon = { KIcon(icon = KIcons.SearchOutlined) },
        selectedIcon = { KIcon(icon = KIcons.Search) },
        label = { KText("Search") }
    )
    KNavigationDrawerItem(
        selected = currentRoute == "settings",
        onClick = { navigate("settings") },
        icon = { KIcon(icon = KIcons.Settings) },
        label = { KText("Settings") },
        badge = { KText("3") }
    )
}`,
    notes:
      'KNavigationScope extends KScope (not KUniversalScope), so only navigation-specific builders are available inside the block.',
    seeAlso: ['KScope', 'KUniversalScope'],
  },

  /* ─────────────────────────────────────────── */

  KSnackBarScope: {
    name: 'KSnackBarScope',
    kind: 'class',
    module: 'dsl',
    subpackage: 'scope',
    category: 'DSL',
    subcategory: 'Scopes',
    description:
      'DSL scope for snackbar action and dismiss content slots. Extends KUniversalScope and adds specialised KSnackBarAction and KSnackBarDismiss methods.',
    android: {
      packageName: 'com.developerstring.ketoy.dsl',
      annotations: [],
      imports: [
        'import com.developerstring.ketoy.model.KNode',
        'import com.developerstring.ketoy.util.KModifier',
      ],
      sourceCode: `class KSnackBarScope : KUniversalScope() {

    fun KSnackBarAction(
        onClick: (() -> Unit)? = null,
        modifier: KModifier? = null,
        content: KUniversalScope.() -> Unit
    ) { ... }

    fun KSnackBarDismiss(
        onClick: (() -> Unit)? = null,
        modifier: KModifier? = null,
        content: KUniversalScope.() -> Unit
    ) { ... }
}`,
    },
    properties: [
      { name: 'children', type: 'MutableList<KNode>', default: 'mutableListOf()', description: 'Inherited from KScope via KUniversalScope.' },
    ],
    methods: [
      { name: 'KSnackBarAction(onClick: (() -> Unit)?, modifier: KModifier?, content: KUniversalScope.() -> Unit)', returns: 'Unit', description: 'Adds an action button inside the snackbar (e.g. "Undo", "Retry").' },
      { name: 'KSnackBarDismiss(onClick: (() -> Unit)?, modifier: KModifier?, content: KUniversalScope.() -> Unit)', returns: 'Unit', description: 'Adds a dismiss button inside the snackbar (e.g. close icon).' },
    ],
    usage: `KSnackBar(
    message = "Item deleted",
    duration = KSnackBarDuration.Short,
    action = {
        KSnackBarAction(onClick = { undoDelete() }) {
            KText("Undo", color = KColors.Primary)
        }
    },
    dismissAction = {
        KSnackBarDismiss(onClick = { dismissSnackbar() }) {
            KIcon(icon = KIcons.Close, size = "16dp")
        }
    }
)`,
    notes:
      'KSnackBarScope extends KUniversalScope so standard builders (KText, KIcon, etc.) are available inside the action/dismiss lambdas.',
    seeAlso: ['KUniversalScope', 'KSnackBarDuration'],
  },

  /* ─────────────────────────────────────────── */

  KNavigationRailScope: {
    name: 'KNavigationRailScope',
    kind: 'class',
    module: 'dsl',
    subpackage: 'scope',
    category: 'DSL',
    subcategory: 'Scopes',
    description:
      'DSL scope for defining navigation rail items inside KNavigationRail. Provides the KNavigationRailItem builder method.',
    android: {
      packageName: 'com.developerstring.ketoy.dsl',
      annotations: [],
      imports: [
        'import com.developerstring.ketoy.model.KNode',
        'import com.developerstring.ketoy.util.KModifier',
      ],
      sourceCode: `class KNavigationRailScope : KScope() {

    fun KNavigationRailItem(
        selected: Boolean,
        onClick: (() -> Unit)? = null,
        modifier: KModifier? = null,
        enabled: Boolean = true,
        alwaysShowLabel: Boolean = true,
        actionId: String? = null,
        icon: (KUniversalScope.() -> Unit)? = null,
        selectedIcon: (KUniversalScope.() -> Unit)? = null,
        label: (KUniversalScope.() -> Unit)? = null
    ) { ... }
}`,
    },
    properties: [
      { name: 'children', type: 'MutableList<KNode>', default: 'mutableListOf()', description: 'Inherited from KScope. Stores accumulated navigation rail item nodes.' },
    ],
    methods: [
      { name: 'KNavigationRailItem(selected: Boolean, onClick: (() -> Unit)?, modifier: KModifier?, enabled: Boolean, alwaysShowLabel: Boolean, actionId: String?, icon: (KUniversalScope.() -> Unit)?, selectedIcon: (KUniversalScope.() -> Unit)?, label: (KUniversalScope.() -> Unit)?)', returns: 'Unit', description: 'Adds a navigation rail item with icon, selected icon, and label slots.' },
    ],
    usage: `KNavigationRail(
    containerColor = KColors.Surface,
    header = {
        KFloatingActionButton(onClick = { createNew() }) {
            KIcon(icon = KIcons.Add)
        }
    }
) {
    KNavigationRailItem(
        selected = currentRoute == "home",
        onClick = { navigate("home") },
        icon = { KIcon(icon = KIcons.HomeOutlined) },
        selectedIcon = { KIcon(icon = KIcons.Home) },
        label = { KText("Home") }
    )
    KNavigationRailItem(
        selected = currentRoute == "favorites",
        onClick = { navigate("favorites") },
        icon = { KIcon(icon = KIcons.FavoriteOutlined) },
        selectedIcon = { KIcon(icon = KIcons.Favorite) },
        label = { KText("Favorites") }
    )
}`,
    notes:
      'KNavigationRailScope extends KScope (not KUniversalScope), so only KNavigationRailItem is available. The header slot uses KUniversalScope.',
    seeAlso: ['KScope', 'KUniversalScope', 'KNavigationScope'],
  },

  /* ══════════════════════════════════════════════
     SUBPACKAGE: builders
     ══════════════════════════════════════════════ */

  TopLevelBuilders: {
    name: 'TopLevelBuilders',
    kind: 'function',
    module: 'dsl',
    subpackage: 'builders',
    category: 'DSL',
    subcategory: 'Top-Level Builders',
    description:
      'Collection of top-level DSL entry-point functions for creating root-level UI node trees outside of any scope. Each function creates a scope, evaluates the content lambda, and returns the corresponding typed KNode. Primarily used when you need a standalone node tree (e.g. for serialization, testing, or passing to an API).',
    android: {
      packageName: 'com.developerstring.ketoy.dsl',
      annotations: [],
      imports: [
        'import com.developerstring.ketoy.model.*',
        'import com.developerstring.ketoy.util.KModifier',
        'import com.developerstring.ketoy.util.KWindowInsets',
      ],
      sourceCode: `fun KColumn(
    modifier: KModifier? = null,
    verticalArrangement: String? = null,
    horizontalAlignment: String? = null,
    content: KUniversalScope.() -> Unit
): KColumnNode {
    val scope = KUniversalScope().apply(content)
    return KColumnNode(
        KColumnProps(modifier, verticalArrangement, horizontalAlignment),
        scope.children
    )
}

fun KRow(
    modifier: KModifier? = null,
    horizontalArrangement: String? = null,
    verticalAlignment: String? = null,
    content: KUniversalScope.() -> Unit
): KRowNode {
    val scope = KUniversalScope().apply(content)
    return KRowNode(
        KRowProps(modifier, horizontalArrangement, verticalAlignment),
        scope.children
    )
}

fun KBox(
    modifier: KModifier? = null,
    contentAlignment: String? = null,
    content: KUniversalScope.() -> Unit
): KBoxNode {
    val scope = KUniversalScope().apply(content)
    return KBoxNode(KBoxProps(modifier, contentAlignment), scope.children)
}

fun KLazyColumn(
    modifier: KModifier? = null,
    verticalArrangement: String? = null,
    horizontalAlignment: String? = null,
    userScrollEnabled: Boolean? = null,
    reverseLayout: Boolean? = null,
    contentPadding: String? = null,
    beyondBoundsItemCount: Int? = null,
    content: KLazyListScope.() -> Unit
): KLazyColumnNode {
    val scope = KLazyListScope().apply(content)
    return KLazyColumnNode(
        KLazyColumnProps(modifier, verticalArrangement, horizontalAlignment,
            userScrollEnabled, reverseLayout, contentPadding, beyondBoundsItemCount),
        scope.children
    )
}

fun KLazyRow(
    modifier: KModifier? = null,
    horizontalArrangement: String? = null,
    verticalAlignment: String? = null,
    userScrollEnabled: Boolean? = null,
    reverseLayout: Boolean? = null,
    contentPadding: String? = null,
    beyondBoundsItemCount: Int? = null,
    content: KLazyListScope.() -> Unit
): KLazyRowNode {
    val scope = KLazyListScope().apply(content)
    return KLazyRowNode(
        KLazyRowProps(modifier, horizontalArrangement, verticalAlignment,
            userScrollEnabled, reverseLayout, contentPadding, beyondBoundsItemCount),
        scope.children
    )
}

fun KScaffold(
    modifier: KModifier? = null,
    containerColor: String? = null,
    contentColor: String? = null,
    contentWindowInsets: KWindowInsets? = null,
    topBar: (KScaffoldScope.() -> Unit)? = null,
    bottomBar: (KScaffoldScope.() -> Unit)? = null,
    snackbarHost: (KScaffoldScope.() -> Unit)? = null,
    floatingActionButton: (KScaffoldScope.() -> Unit)? = null,
    floatingActionButtonPosition: String? = null,
    content: KUniversalScope.() -> Unit
): KScaffoldNode {
    val mainScope = KUniversalScope().apply(content)
    val topBarNodes = topBar?.let { KScaffoldScope().apply(it).children }
    val bottomBarNodes = bottomBar?.let { KScaffoldScope().apply(it).children }
    val snackbarNodes = snackbarHost?.let { KScaffoldScope().apply(it).children }
    val fabNodes = floatingActionButton?.let { KScaffoldScope().apply(it).children }
    return KScaffoldNode(
        KScaffoldProps(modifier, containerColor, contentColor, contentWindowInsets,
            floatingActionButtonPosition),
        mainScope.children, topBarNodes, bottomBarNodes, snackbarNodes, fabNodes
    )
}`,
    },
    properties: [],
    methods: [
      { name: 'KColumn(modifier: KModifier?, verticalArrangement: String?, horizontalAlignment: String?, content: KUniversalScope.() -> Unit)', returns: 'KColumnNode', description: 'Creates a root-level column node tree.' },
      { name: 'KRow(modifier: KModifier?, horizontalArrangement: String?, verticalAlignment: String?, content: KUniversalScope.() -> Unit)', returns: 'KRowNode', description: 'Creates a root-level row node tree.' },
      { name: 'KBox(modifier: KModifier?, contentAlignment: String?, content: KUniversalScope.() -> Unit)', returns: 'KBoxNode', description: 'Creates a root-level box node tree.' },
      { name: 'KLazyColumn(modifier: KModifier?, verticalArrangement: String?, horizontalAlignment: String?, userScrollEnabled: Boolean?, reverseLayout: Boolean?, contentPadding: String?, beyondBoundsItemCount: Int?, content: KLazyListScope.() -> Unit)', returns: 'KLazyColumnNode', description: 'Creates a root-level lazy column node tree.' },
      { name: 'KLazyRow(modifier: KModifier?, horizontalArrangement: String?, verticalAlignment: String?, userScrollEnabled: Boolean?, reverseLayout: Boolean?, contentPadding: String?, beyondBoundsItemCount: Int?, content: KLazyListScope.() -> Unit)', returns: 'KLazyRowNode', description: 'Creates a root-level lazy row node tree.' },
      { name: 'KScaffold(modifier: KModifier?, containerColor: String?, contentColor: String?, contentWindowInsets: KWindowInsets?, topBar: (KScaffoldScope.() -> Unit)?, bottomBar: (KScaffoldScope.() -> Unit)?, snackbarHost: (KScaffoldScope.() -> Unit)?, floatingActionButton: (KScaffoldScope.() -> Unit)?, floatingActionButtonPosition: String?, content: KUniversalScope.() -> Unit)', returns: 'KScaffoldNode', description: 'Creates a root-level scaffold node tree with all slot content.' },
    ],
    usage: `// Create a standalone node tree for serialization
val screenNode = KScaffold(
    topBar = {
        KTopAppBar(title = { KText("My App") })
    },
    floatingActionButton = {
        KFloatingActionButton(onClick = { }) {
            KIcon(icon = KIcons.Add)
        }
    }
) {
    KColumn(modifier = kModifier { padding("16dp").fillMaxSize() }) {
        KText("Hello, Ketoy!", fontSize = "24sp")
        KButton(onClick = { }) {
            KText("Get Started")
        }
    }
}

// Serialize to JSON
val json = screenNode.toJson()

// Or create a simple column
val column = KColumn(
    verticalArrangement = KArrangements.spacedBy("12dp"),
    horizontalAlignment = KAlignments.CenterHorizontally
) {
    KText("Item 1")
    KText("Item 2")
    KText("Item 3")
}`,
    notes:
      'Top-level builders return typed KNode subclasses (KColumnNode, KScaffoldNode, etc.) rather than Unit, unlike the scope-level methods in KUniversalScope which add children in-place.',
    seeAlso: ['KUniversalScope', 'KScaffoldScope', 'KLazyListScope'],
  },

  /* ══════════════════════════════════════════════
     SUBPACKAGE: widget
     ══════════════════════════════════════════════ */

  KetoyWidgetsScope: {
    name: 'KetoyWidgetsScope',
    kind: 'class',
    module: 'dsl',
    subpackage: 'widget',
    category: 'DSL',
    subcategory: 'Custom Widgets',
    description:
      'DSL scope for defining custom widget parsers inline using the ketoyWidgets { } entry-point. Collects WidgetParserBuilder definitions and compiles them into a list of KetoyWidgetParser instances for registration in KetoyWidgetRegistry.',
    android: {
      packageName: 'com.developerstring.ketoy.dsl',
      annotations: [],
      imports: [
        'import com.developerstring.ketoy.widget.KetoyWidgetParser',
      ],
      sourceCode: `class KetoyWidgetsScope {
    internal val parsers = mutableListOf<KetoyWidgetParser<*>>()

    inline fun <reified T> widget(
        type: String,
        block: WidgetParserBuilder<T>.() -> Unit
    ) {
        val builder = WidgetParserBuilder<T>(type)
        builder.block()
        parsers.add(builder.build())
    }
}`,
    },
    properties: [
      { name: 'parsers', type: 'MutableList<KetoyWidgetParser<*>>', default: 'mutableListOf()', description: 'Internal list of built widget parsers accumulated during DSL evaluation.' },
    ],
    methods: [
      { name: 'widget<T>(type: String, block: WidgetParserBuilder<T>.() -> Unit)', returns: 'Unit', description: 'Defines a custom widget parser for the given type string. The block must call model() and render() on the WidgetParserBuilder.' },
    ],
    usage: `val parsers = ketoyWidgets {
    widget<BannerModel>("banner") {
        model { json ->
            BannerModel(
                title = json["title"]?.jsonPrimitive?.content ?: "",
                imageUrl = json["imageUrl"]?.jsonPrimitive?.content ?: ""
            )
        }
        render { banner ->
            Column {
                AsyncImage(model = banner.imageUrl)
                Text(banner.title)
            }
        }
    }
    widget<RatingModel>("rating") {
        model { json ->
            RatingModel(stars = json["stars"]?.jsonPrimitive?.int ?: 0)
        }
        render { rating ->
            RatingBar(stars = rating.stars)
        }
    }
}`,
    notes:
      'The parsers list is typically consumed by ketoyWidgets() which registers them in KetoyWidgetRegistry. Use reified type parameter T for automatic type inference.',
    seeAlso: ['WidgetParserBuilder', 'ketoyWidgets'],
  },

  /* ─────────────────────────────────────────── */

  WidgetParserBuilder: {
    name: 'WidgetParserBuilder',
    kind: 'class',
    module: 'dsl',
    subpackage: 'widget',
    category: 'DSL',
    subcategory: 'Custom Widgets',
    description:
      'Builder class for constructing a KetoyWidgetParser inline. Used inside KetoyWidgetsScope.widget { } blocks. Both model() and render() MUST be called for a valid parser.',
    android: {
      packageName: 'com.developerstring.ketoy.dsl',
      annotations: [],
      imports: [
        'import androidx.compose.runtime.Composable',
        'import com.developerstring.ketoy.widget.KetoyWidgetParser',
        'import kotlinx.serialization.json.JsonObject',
      ],
      sourceCode: `class WidgetParserBuilder<T>(private val type: String) {

    private var modelFactory: ((JsonObject) -> T)? = null
    private var renderComposable: (@Composable (T) -> Unit)? = null

    fun model(factory: (JsonObject) -> T) {
        modelFactory = factory
    }

    fun render(composable: @Composable (T) -> Unit) {
        renderComposable = composable
    }

    internal fun build(): KetoyWidgetParser<T> {
        val factory = modelFactory
            ?: error("model { } must be called in widget builder for type '$type'")
        val composable = renderComposable
            ?: error("render { } must be called in widget builder for type '$type'")
        return object : KetoyWidgetParser<T> {
            override val widgetType = type
            override fun parseModel(json: JsonObject) = factory(json)
            @Composable
            override fun Render(model: T) = composable(model)
        }
    }
}`,
    },
    properties: [
      { name: 'type', type: 'String', default: '—', description: 'The widget type identifier this parser handles (e.g. "banner", "rating").' },
      { name: 'modelFactory', type: '((JsonObject) -> T)?', default: 'null', description: 'Internal factory function for parsing JSON into a model object.' },
      { name: 'renderComposable', type: '(@Composable (T) -> Unit)?', default: 'null', description: 'Internal composable function for rendering the model.' },
    ],
    methods: [
      { name: 'model(factory: (JsonObject) -> T)', returns: 'Unit', description: 'Sets the factory that converts a JsonObject into a typed model T. MUST be called.' },
      { name: 'render(composable: @Composable (T) -> Unit)', returns: 'Unit', description: 'Sets the Composable that renders the typed model. MUST be called.' },
      { name: 'build()', returns: 'KetoyWidgetParser<T>', description: 'Internal: compiles the builder into a KetoyWidgetParser. Throws if model or render were not called.' },
    ],
    usage: `// Used inside ketoyWidgets { widget<T>(...) { ... } }
widget<ProfileCardModel>("profile_card") {
    model { json ->
        ProfileCardModel(
            name = json["name"]?.jsonPrimitive?.content ?: "",
            avatar = json["avatar"]?.jsonPrimitive?.content ?: "",
            role = json["role"]?.jsonPrimitive?.content ?: ""
        )
    }
    render { profile ->
        Card {
            Row(verticalAlignment = Alignment.CenterVertically) {
                AsyncImage(model = profile.avatar, modifier = Modifier.size(48.dp))
                Column(modifier = Modifier.padding(start = 12.dp)) {
                    Text(profile.name, style = MaterialTheme.typography.titleMedium)
                    Text(profile.role, style = MaterialTheme.typography.bodySmall)
                }
            }
        }
    }
}`,
    notes:
      'Both model() and render() are required. Calling build() without either will throw an IllegalStateException with a descriptive error message.',
    seeAlso: ['KetoyWidgetsScope', 'ketoyWidgets'],
  },

  /* ─────────────────────────────────────────── */

  ketoyWidgets: {
    name: 'ketoyWidgets',
    kind: 'function',
    module: 'dsl',
    subpackage: 'widget',
    category: 'DSL',
    subcategory: 'Custom Widgets',
    description:
      'Top-level DSL entry-point function for defining and registering custom widget parsers. Creates a KetoyWidgetsScope, evaluates the block, and returns the list of built KetoyWidgetParser instances. Parsers are automatically registered in KetoyWidgetRegistry.',
    android: {
      packageName: 'com.developerstring.ketoy.dsl',
      annotations: [],
      imports: [
        'import com.developerstring.ketoy.widget.KetoyWidgetParser',
        'import com.developerstring.ketoy.widget.KetoyWidgetRegistry',
      ],
      sourceCode: `fun ketoyWidgets(
    block: KetoyWidgetsScope.() -> Unit
): List<KetoyWidgetParser<*>> {
    val scope = KetoyWidgetsScope().apply(block)
    scope.parsers.forEach { KetoyWidgetRegistry.register(it) }
    return scope.parsers
}`,
    },
    properties: [],
    methods: [
      { name: 'ketoyWidgets(block: KetoyWidgetsScope.() -> Unit)', returns: 'List<KetoyWidgetParser<*>>', description: 'Evaluates the DSL block, registers all defined widget parsers, and returns them as a list.' },
    ],
    usage: `// In your Application or initialization code
val customWidgets = ketoyWidgets {
    widget<BannerModel>("banner") {
        model { json ->
            BannerModel(
                title = json["title"]?.jsonPrimitive?.content ?: "",
                imageUrl = json["imageUrl"]?.jsonPrimitive?.content ?: ""
            )
        }
        render { banner ->
            Card(modifier = Modifier.fillMaxWidth()) {
                AsyncImage(model = banner.imageUrl)
                Text(banner.title, style = MaterialTheme.typography.headlineSmall)
            }
        }
    }
}

// customWidgets are now registered and will be used when
// the renderer encounters a node with type "banner"`,
    notes:
      'Parsers are registered globally in KetoyWidgetRegistry. Call this early in app initialization (e.g. in Application.onCreate or a Hilt module) so parsers are available when screens are rendered.',
    seeAlso: ['KetoyWidgetsScope', 'WidgetParserBuilder'],
  },

  /* ══════════════════════════════════════════════
     SUBPACKAGE: screen
     ══════════════════════════════════════════════ */

  KetoyScreensScope: {
    name: 'KetoyScreensScope',
    kind: 'class',
    module: 'dsl',
    subpackage: 'screen',
    category: 'DSL',
    subcategory: 'Screen Configuration',
    description:
      'DSL scope for configuring Ketoy screens during initialization. Collects ScreenBuilder definitions and pre-built KetoyScreen instances into a list for registration.',
    android: {
      packageName: 'com.developerstring.ketoy.dsl',
      annotations: [],
      imports: [
        'import com.developerstring.ketoy.screen.KetoyScreen',
      ],
      sourceCode: `class KetoyScreensScope {
    internal val screens = mutableListOf<KetoyScreen>()

    fun screen(screenName: String, block: ScreenBuilder.() -> Unit) {
        val builder = ScreenBuilder(screenName)
        builder.block()
        builder.build()?.let { screens.add(it) }
    }

    fun screen(ketoyScreen: KetoyScreen) {
        screens.add(ketoyScreen)
    }
}`,
    },
    properties: [
      { name: 'screens', type: 'MutableList<KetoyScreen>', default: 'mutableListOf()', description: 'Internal list of configured Ketoy screens accumulated during DSL evaluation.' },
    ],
    methods: [
      { name: 'screen(screenName: String, block: ScreenBuilder.() -> Unit)', returns: 'Unit', description: 'Defines a screen using the ScreenBuilder DSL. The screen name is used as the routing key.' },
      { name: 'screen(ketoyScreen: KetoyScreen)', returns: 'Unit', description: 'Adds a pre-built KetoyScreen instance directly.' },
    ],
    usage: `val screens = ketoyScreens {
    screen("home") {
        displayName("Home Screen")
        description("Main landing screen")
        version("1.0")
        dsl {
            KScaffold(
                topBar = { KTopAppBar(title = { KText("Home") }) }
            ) {
                KColumn(modifier = kModifier { padding("16dp") }) {
                    KText("Welcome!", fontSize = "24sp")
                }
            }
        }
    }
    screen("profile") {
        displayName("Profile Screen")
        fromJson(profileJsonString)
    }
    screen("settings") {
        displayName("Settings")
        fromAsset("screens/settings.json")
    }
    // Add a pre-built screen
    screen(myPreBuiltScreen)
}`,
    notes:
      'If ScreenBuilder.build() returns null (e.g. no content source was specified), the screen is silently skipped. At least one of fromJson, dsl, fromComposable, or fromAsset should be called.',
    seeAlso: ['ScreenBuilder', 'ketoyScreens'],
  },

  /* ─────────────────────────────────────────── */

  ScreenBuilder: {
    name: 'ScreenBuilder',
    kind: 'class',
    module: 'dsl',
    subpackage: 'screen',
    category: 'DSL',
    subcategory: 'Screen Configuration',
    description:
      'Builder for configuring a single Ketoy screen. Supports multiple content sources with a defined priority order: fromJson > fromComposable > fromAsset > dsl. Only the highest-priority source is used.',
    android: {
      packageName: 'com.developerstring.ketoy.dsl',
      annotations: [],
      imports: [
        'import androidx.compose.runtime.Composable',
        'import com.developerstring.ketoy.screen.KetoyScreen',
      ],
      sourceCode: `class ScreenBuilder(private val screenName: String) {

    private var displayName: String? = null
    private var description: String? = null
    private var version: String? = null
    private var jsonSource: String? = null
    private var dslBuilder: (KUniversalScope.() -> Unit)? = null
    private var composableContent: (@Composable () -> Unit)? = null
    private var assetPath: String? = null

    fun displayName(name: String) { displayName = name }
    fun description(desc: String) { description = desc }
    fun version(ver: String) { version = ver }
    fun fromJson(json: String) { jsonSource = json }
    fun dsl(builder: KUniversalScope.() -> Unit) { dslBuilder = builder }
    fun fromComposable(content: @Composable () -> Unit) { composableContent = content }
    fun fromAsset(path: String) { assetPath = path }

    internal fun build(): KetoyScreen? {
        // Priority: fromJson > fromComposable > fromAsset > dsl
        return when {
            jsonSource != null -> KetoyScreen.fromJson(screenName, jsonSource!!, displayName, description, version)
            composableContent != null -> KetoyScreen.fromComposable(screenName, composableContent!!, displayName, description, version)
            assetPath != null -> KetoyScreen.fromAsset(screenName, assetPath!!, displayName, description, version)
            dslBuilder != null -> {
                val scope = KUniversalScope().apply(dslBuilder!!)
                KetoyScreen.fromNodes(screenName, scope.children, displayName, description, version)
            }
            else -> null
        }
    }
}`,
    },
    properties: [
      { name: 'screenName', type: 'String', default: '—', description: 'The routing key / identifier for this screen.' },
      { name: 'displayName', type: 'String?', default: 'null', description: 'Human-readable display name for the screen.' },
      { name: 'description', type: 'String?', default: 'null', description: 'Optional description of the screen\'s purpose.' },
      { name: 'version', type: 'String?', default: 'null', description: 'Optional version string for the screen definition.' },
    ],
    methods: [
      { name: 'displayName(name: String)', returns: 'Unit', description: 'Sets the human-readable display name.' },
      { name: 'description(desc: String)', returns: 'Unit', description: 'Sets the screen description.' },
      { name: 'version(ver: String)', returns: 'Unit', description: 'Sets the version string for this screen definition.' },
      { name: 'fromJson(json: String)', returns: 'Unit', description: 'Sets a raw JSON string as the screen content source. Highest priority.' },
      { name: 'dsl(builder: KUniversalScope.() -> Unit)', returns: 'Unit', description: 'Sets a DSL lambda as the screen content source. Lowest priority.' },
      { name: 'fromComposable(content: @Composable () -> Unit)', returns: 'Unit', description: 'Sets a native Composable as the screen content. Second priority.' },
      { name: 'fromAsset(path: String)', returns: 'Unit', description: 'Sets an asset file path as the screen content source. Third priority.' },
      { name: 'build()', returns: 'KetoyScreen?', description: 'Internal: compiles the builder into a KetoyScreen. Returns null if no content source was set.' },
    ],
    usage: `// Inside ketoyScreens { } block
screen("dashboard") {
    displayName("Dashboard")
    description("Analytics dashboard with charts")
    version("2.1")
    dsl {
        KColumn(modifier = kModifier { fillMaxSize().padding("16dp") }) {
            KText("Dashboard", fontSize = "28sp", fontWeight = "Bold")
            KSpacer(height = "16dp")
            KCard(elevation = "2dp") {
                KText("Revenue: \$12,345")
            }
            KCard(elevation = "2dp") {
                KText("Users: 1,234")
            }
        }
    }
}

// Or from a JSON string
screen("settings") {
    displayName("Settings")
    fromJson("""{ "type": "column", "children": [...] }""")
}

// Or from an asset
screen("about") {
    displayName("About")
    fromAsset("screens/about.json")
}

// Or from a native composable
screen("native_map") {
    displayName("Map View")
    fromComposable {
        GoogleMap(modifier = Modifier.fillMaxSize())
    }
}`,
    notes:
      'Priority order: fromJson > fromComposable > fromAsset > dsl. If multiple sources are set, only the highest priority one is used. If none are set, build() returns null and the screen is skipped.',
    seeAlso: ['KetoyScreensScope', 'ketoyScreens', 'KUniversalScope'],
  },

  /* ─────────────────────────────────────────── */

  ketoyScreens: {
    name: 'ketoyScreens',
    kind: 'function',
    module: 'dsl',
    subpackage: 'screen',
    category: 'DSL',
    subcategory: 'Screen Configuration',
    description:
      'Top-level DSL entry-point function for defining and registering Ketoy screens. Creates a KetoyScreensScope, evaluates the block, and returns the list of configured KetoyScreen instances.',
    android: {
      packageName: 'com.developerstring.ketoy.dsl',
      annotations: [],
      imports: [
        'import com.developerstring.ketoy.screen.KetoyScreen',
      ],
      sourceCode: `fun ketoyScreens(
    block: KetoyScreensScope.() -> Unit
): List<KetoyScreen> {
    val scope = KetoyScreensScope().apply(block)
    return scope.screens
}`,
    },
    properties: [],
    methods: [
      { name: 'ketoyScreens(block: KetoyScreensScope.() -> Unit)', returns: 'List<KetoyScreen>', description: 'Evaluates the DSL block and returns all configured screens as a list.' },
    ],
    usage: `// In your Application or initialization code
val appScreens = ketoyScreens {
    screen("home") {
        displayName("Home")
        dsl {
            KScaffold(
                topBar = { KTopAppBar(title = { KText("Ketoy App") }) }
            ) {
                KColumn {
                    KText("Welcome to Ketoy SDUI!")
                }
            }
        }
    }
    screen("profile") {
        displayName("Profile")
        fromAsset("screens/profile.json")
    }
}

// Register screens with Ketoy
KetoyScreenRegistry.registerAll(appScreens)`,
    notes:
      'Screens returned from this function need to be registered with KetoyScreenRegistry (or passed to a KetoyNavHost) to become navigable. Call this during app initialization.',
    seeAlso: ['KetoyScreensScope', 'ScreenBuilder'],
  },

}

export default dslData
