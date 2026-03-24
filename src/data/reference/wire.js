/**
 * Ketoy SDK – Wire Format Module
 * Package: com.developerstring.ketoy.wire
 *
 * 4-layer binary compression pipeline that shrinks SDUI JSON payloads 10-15×.
 * Pipeline (encode): key aliasing → type ID encoding → MessagePack → Gzip
 * Pipeline (decode): Gzip → MessagePack → type expansion → key expansion
 */

const wireData = {

  /* ══════════════════════════════════════════════════════════════
   *  Wire > Format  (KetoyWireFormat.kt)
   * ══════════════════════════════════════════════════════════════ */

  KetoyWireFormat: {
    name: 'KetoyWireFormat',
    kind: 'object',
    module: 'wire',
    subpackage: 'format',
    category: 'Wire',
    subcategory: 'Format',
    description: 'Orchestrates the Ketoy 4-layer compression pipeline that shrinks SDUI JSON payloads by 10-15×. Layer 1: Gzip (~4×), Layer 2a: key aliasing (~1.5-2×), Layer 2c: type-ID encoding (~1.2×), Layer 3: MessagePack (~2-3×). The autoDecode() method is format-agnostic — it inspects magic bytes and applies the correct decoding layers, supporting gzip+msgpack, gzip-only, aliased JSON, and plain JSON. Use JSONBytesToUI() or KetoyCloudScreen() rather than calling this directly.',
    android: {
      packageName: 'com.developerstring.ketoy.wire',
      annotations: [],
      imports: [
        'import com.developerstring.ketoy.wire.KetoyWireFormat',
        'import com.developerstring.ketoy.wire.WireFormatConfig',
      ],
      sourceCode: `object KetoyWireFormat {

    // Content-Type constants
    const val CONTENT_TYPE_KETOY_BINARY = "application/vnd.ketoy+msgpack"
    const val CONTENT_TYPE_KETOY_JSON   = "application/vnd.ketoy+json"
    const val ACCEPT_HEADER: String

    // Encoding
    fun encode(jsonString: String, config: WireFormatConfig = WireFormatConfig.OPTIMIZED): ByteArray
    fun encodeElement(element: JsonElement, config: WireFormatConfig = WireFormatConfig.OPTIMIZED): ByteArray

    // Decoding
    fun decode(data: ByteArray, config: WireFormatConfig = WireFormatConfig.OPTIMIZED): String
    fun decodeToElement(data: ByteArray, config: WireFormatConfig = WireFormatConfig.OPTIMIZED): JsonElement

    // Auto-detect decode (preferred for client-side)
    fun autoDecode(data: ByteArray): JsonElement

    // Metrics
    fun measureCompression(jsonString: String, config: WireFormatConfig = WireFormatConfig.OPTIMIZED): CompressionStats
}`,
    },
    properties: [
      { name: 'CONTENT_TYPE_KETOY_BINARY', type: 'String', description: 'Content-Type header for Ketoy binary wire format: "application/vnd.ketoy+msgpack". Servers should return this when sending optimized payloads.' },
      { name: 'CONTENT_TYPE_KETOY_JSON', type: 'String', description: 'Content-Type header for Ketoy aliased JSON: "application/vnd.ketoy+json". Used when binary encoding is disabled but key aliasing is active.' },
      { name: 'ACCEPT_HEADER', type: 'String', description: 'Accept header value that tells the server the client supports all Ketoy formats (binary, aliased JSON, and plain JSON).' },
    ],
    methods: [
      { name: 'encode(jsonString, config?)', returns: 'ByteArray', description: 'Encode a raw Ketoy JSON string through the full compression pipeline (key aliasing → type IDs → MessagePack → Gzip). Returns compressed wire bytes.' },
      { name: 'encodeElement(element, config?)', returns: 'ByteArray', description: 'Encode a JsonElement tree through the pipeline. Use this variant when you already have a parsed JsonElement to avoid double-parsing.' },
      { name: 'decode(data, config?)', returns: 'String', description: 'Decode wire bytes back to a JSON string using the given config. The config must match the one used during encoding.' },
      { name: 'decodeToElement(data, config?)', returns: 'JsonElement', description: 'Decode wire bytes to a JsonElement. Useful for inspecting or transforming the tree before rendering.' },
      { name: 'autoDecode(data)', returns: 'JsonElement', description: 'Format-agnostic decoder. Inspects magic bytes to auto-detect gzip, MessagePack, or plain JSON, then applies the appropriate decoding layers. Always attempts key and type expansion. Preferred for all client-side decoding.' },
      { name: 'measureCompression(jsonString, config?)', returns: 'CompressionStats', description: 'Calculate compression statistics for a JSON payload at each pipeline stage. Useful for debugging or benchmarking wire format effectiveness.' },
    ],
    innerClasses: [],
    usage: `// Encode a KNode DSL tree to wire bytes (on export / server side)
val node = KColumn { KText("Hello") }
val json = node.toJson()
val wireBytes = KetoyWireFormat.encode(json, WireFormatConfig.OPTIMIZED)

// Auto-decode on the client (format-agnostic)
val element = KetoyWireFormat.autoDecode(wireBytes)

// Or use the rendering shortcut — no need to call KetoyWireFormat directly
JSONBytesToUI(data = wireBytes)

// Measure compression gains
val stats = KetoyWireFormat.measureCompression(json)
println("Ratio: \${stats.totalReduction}×")  // e.g. "12.4×"`,
    notes: 'In production, always prefer JSONBytesToUI() or KetoyCloudScreen() — they call autoDecode() internally. Only interact with KetoyWireFormat directly when building custom network layers or analytics.',
    seeAlso: ['JSONBytesToUI', 'WireFormatConfig', 'KetoyMessagePack', 'KetoyCompression', 'KetoyKeyAlias', 'KetoyComponentTypeId', 'CompressionStats'],
  },

  WireFormatConfig: {
    name: 'WireFormatConfig',
    kind: 'data class',
    module: 'wire',
    subpackage: 'format',
    category: 'Wire',
    subcategory: 'Config',
    description: 'Configuration for the Ketoy wire format pipeline. Controls which compression layers are active. Four preset values cover the most common needs: NONE, GZIP_ONLY, ALIASED, and OPTIMIZED (the production default).',
    android: {
      packageName: 'com.developerstring.ketoy.wire',
      annotations: [],
      imports: [
        'import com.developerstring.ketoy.wire.WireFormatConfig',
        'import com.developerstring.ketoy.wire.BinaryEncoding',
      ],
      sourceCode: `data class WireFormatConfig(
    val keyAliasing: Boolean = true,
    val typeCompression: Boolean = true,
    val binaryEncoding: BinaryEncoding = BinaryEncoding.NONE,
    val gzipCompression: Boolean = true
) {
    companion object {
        /** No compression — raw JSON pass-through. */
        val NONE: WireFormatConfig

        /** Gzip only (~3-5× reduction). */
        val GZIP_ONLY: WireFormatConfig

        /** Gzip + key aliasing + type compression (~7-8× reduction). */
        val ALIASED: WireFormatConfig

        /** Full pipeline: gzip + aliasing + types + MessagePack (10-15× reduction). */
        val OPTIMIZED: WireFormatConfig
    }
}`,
    },
    properties: [
      { name: 'keyAliasing', type: 'Boolean', default: 'true', description: 'Enable Layer 2a — replaces verbose property names (e.g. "backgroundColor") with short 1-3 character aliases (e.g. "bg"). Requires both encoder and decoder to share the same KetoyKeyAlias vocabulary.' },
      { name: 'typeCompression', type: 'Boolean', default: 'true', description: 'Enable Layer 2c — replaces component type strings (e.g. "Column") with compact integer IDs (e.g. 1). Especially effective with MessagePack since small integers encode as 1 byte.' },
      { name: 'binaryEncoding', type: 'BinaryEncoding', default: 'BinaryEncoding.NONE', description: 'Layer 3 binary encoding format. BinaryEncoding.MESSAGE_PACK gives 2-3× reduction over JSON text. BinaryEncoding.NONE keeps text JSON.' },
      { name: 'gzipCompression', type: 'Boolean', default: 'true', description: 'Enable Layer 1 — gzip compress the final byte stream. Provides 3-5× reduction on its own; even more when combined with MessagePack which reduces entropy before compression.' },
    ],
    methods: [],
    innerClasses: [],
    usage: `// Use the full production pipeline (recommended)
Ketoy.initialize(
    context = applicationContext,
    wireFormatConfig = WireFormatConfig.OPTIMIZED,  // default
    // ...
)

// Custom: aliasing + gzip only (no MessagePack), e.g. for debugging
val debugConfig = WireFormatConfig(
    keyAliasing = true,
    typeCompression = true,
    binaryEncoding = BinaryEncoding.NONE,
    gzipCompression = true
)

// No compression (development / testing only)
val noCompress = WireFormatConfig.NONE`,
    notes: 'The OPTIMIZED preset is the default in Ketoy.initialize(). ALIASED is useful when you need human-readable wire output for debugging. NONE is only for unit tests.',
    seeAlso: ['KetoyWireFormat', 'BinaryEncoding'],
  },

  BinaryEncoding: {
    name: 'BinaryEncoding',
    kind: 'enum class',
    module: 'wire',
    subpackage: 'format',
    category: 'Wire',
    subcategory: 'Config',
    description: 'Selects the binary encoding format for Layer 3 of the Ketoy wire pipeline. MESSAGE_PACK produces 2-3× smaller output than JSON text and dramatically improves gzip ratio.',
    android: {
      packageName: 'com.developerstring.ketoy.wire',
      annotations: [],
      imports: ['import com.developerstring.ketoy.wire.BinaryEncoding'],
      sourceCode: `enum class BinaryEncoding {
    /** No binary encoding — keep text JSON. */
    NONE,
    /** MessagePack binary encoding (2-3× over JSON text). */
    MESSAGE_PACK
}`,
    },
    properties: [
      { name: 'NONE', type: 'BinaryEncoding', description: 'No binary encoding. The payload stays as UTF-8 JSON text after key/type transforms. Human-readable but larger.' },
      { name: 'MESSAGE_PACK', type: 'BinaryEncoding', description: 'MessagePack binary encoding. Produces 2-3× smaller payloads than JSON text. Not human-readable but significantly smaller and faster to decode.' },
    ],
    methods: [],
    innerClasses: [],
    usage: `val config = WireFormatConfig(
    binaryEncoding = BinaryEncoding.MESSAGE_PACK
)`,
    notes: 'MessagePack encoding is included in WireFormatConfig.OPTIMIZED. Use NONE only for debugging or when interoperability with plain JSON tools is required.',
    seeAlso: ['WireFormatConfig', 'KetoyMessagePack'],
  },

  CompressionStats: {
    name: 'CompressionStats',
    kind: 'data class',
    module: 'wire',
    subpackage: 'format',
    category: 'Wire',
    subcategory: 'Metrics',
    description: 'Compression statistics for a single payload through the Ketoy wire pipeline. Returned by KetoyWireFormat.measureCompression(). Useful for monitoring compression effectiveness or debugging performance.',
    android: {
      packageName: 'com.developerstring.ketoy.wire',
      annotations: [],
      imports: ['import com.developerstring.ketoy.wire.CompressionStats'],
      sourceCode: `data class CompressionStats(
    val originalSize: Int,
    val afterAliasing: Int,
    val afterTypeCompression: Int,
    val afterBinaryEncoding: Int,
    val afterGzip: Int,
    val totalReduction: Float
)`,
    },
    properties: [
      { name: 'originalSize', type: 'Int', description: 'Original JSON size in bytes before any compression.' },
      { name: 'afterAliasing', type: 'Int', description: 'Size in bytes after Layer 2a key aliasing.' },
      { name: 'afterTypeCompression', type: 'Int', description: 'Size in bytes after Layer 2c type-ID encoding.' },
      { name: 'afterBinaryEncoding', type: 'Int', description: 'Size in bytes after Layer 3 MessagePack encoding (or same as afterTypeCompression when BinaryEncoding.NONE).' },
      { name: 'afterGzip', type: 'Int', description: 'Final size in bytes after Layer 1 Gzip compression. This is the actual wire payload size.' },
      { name: 'totalReduction', type: 'Float', description: 'Overall compression ratio: originalSize / afterGzip. A value of 12.4 means the wire payload is 12.4× smaller than raw JSON.' },
    ],
    methods: [],
    innerClasses: [],
    usage: `val stats = KetoyWireFormat.measureCompression(jsonString)
println("Original: \${stats.originalSize} bytes")
println("After aliasing: \${stats.afterAliasing} bytes")
println("After types: \${stats.afterTypeCompression} bytes")
println("After msgpack: \${stats.afterBinaryEncoding} bytes")
println("After gzip: \${stats.afterGzip} bytes")
println("Total reduction: \${stats.totalReduction}×")`,
    notes: 'totalReduction is originalSize / afterGzip — higher is better. Typical values are 10-15× for OPTIMIZED config on real SDUI screens.',
    seeAlso: ['KetoyWireFormat'],
  },

  /* ══════════════════════════════════════════════════════════════
   *  Wire > MessagePack  (KetoyMessagePack.kt)
   * ══════════════════════════════════════════════════════════════ */

  KetoyMessagePack: {
    name: 'KetoyMessagePack',
    kind: 'object',
    module: 'wire',
    subpackage: 'msgpack',
    category: 'Wire',
    subcategory: 'MessagePack',
    description: 'Zero-dependency MessagePack encoder/decoder operating on JsonElement trees. MessagePack is a binary serialization format that produces 2-3× smaller payloads than equivalent JSON. This self-contained implementation covers the subset of the MessagePack spec required for SDUI payloads: nil, bool, int (fixint, int8/16/32/64, uint8/16/32), float64, str (fixstr, str8/16/32), array (fixarray, array16/32), and map (fixmap, map16/32). No external dependency on Jackson or msgpack-core.',
    android: {
      packageName: 'com.developerstring.ketoy.wire',
      annotations: [],
      imports: [
        'import com.developerstring.ketoy.wire.KetoyMessagePack',
        'import kotlinx.serialization.json.JsonElement',
        'import kotlinx.serialization.json.Json',
      ],
      sourceCode: `object KetoyMessagePack {
    fun encode(element: JsonElement): ByteArray
    fun decode(data: ByteArray): JsonElement
}`,
    },
    properties: [],
    methods: [
      { name: 'encode(element)', returns: 'ByteArray', description: 'Encode a JsonElement tree into MessagePack binary format. Handles all JSON types: null, boolean, integer, float, string, array, and object.' },
      { name: 'decode(data)', returns: 'JsonElement', description: 'Decode MessagePack binary data back into a JsonElement tree. Throws IllegalStateException for unknown format markers.' },
    ],
    innerClasses: [],
    usage: `val json = Json.parseToJsonElement("""{"type":"Text","props":{"text":"Hello"}}""")
val packed = KetoyMessagePack.encode(json)   // ~30% smaller than JSON string bytes
val decoded = KetoyMessagePack.decode(packed)
assert(json == decoded)`,
    notes: 'KetoyMessagePack is an internal component of the wire pipeline. In normal usage, call KetoyWireFormat.encode/decode or JSONBytesToUI — you do not need to call KetoyMessagePack directly.',
    seeAlso: ['KetoyWireFormat', 'WireFormatConfig', 'BinaryEncoding'],
  },

  /* ══════════════════════════════════════════════════════════════
   *  Wire > Compression  (KetoyCompression.kt)
   * ══════════════════════════════════════════════════════════════ */

  KetoyCompression: {
    name: 'KetoyCompression',
    kind: 'object',
    module: 'wire',
    subpackage: 'compression',
    category: 'Wire',
    subcategory: 'Compression',
    description: 'Gzip compression and decompression layer for Ketoy wire payloads. Gzip provides 3-5× reduction with zero schema knowledge. The autoDecompress() method transparently handles mixed payloads by checking magic bytes (0x1F 0x8B) — safe to call on any byte array regardless of whether it is compressed.',
    android: {
      packageName: 'com.developerstring.ketoy.wire',
      annotations: [],
      imports: ['import com.developerstring.ketoy.wire.KetoyCompression'],
      sourceCode: `object KetoyCompression {
    fun gzip(data: ByteArray): ByteArray
    fun gunzip(data: ByteArray): ByteArray
    fun isGzipped(data: ByteArray): Boolean
    fun gzipString(text: String): ByteArray
    fun gunzipToString(data: ByteArray): String
    fun autoDecompress(data: ByteArray): ByteArray
}`,
    },
    properties: [],
    methods: [
      { name: 'gzip(data)', returns: 'ByteArray', description: 'Gzip-compress raw bytes.' },
      { name: 'gunzip(data)', returns: 'ByteArray', description: 'Decompress gzip-compressed bytes. Throws ZipException if data is not valid gzip.' },
      { name: 'isGzipped(data)', returns: 'Boolean', description: 'Check if bytes start with gzip magic bytes (0x1F 0x8B). Used internally for auto-detection.' },
      { name: 'gzipString(text)', returns: 'ByteArray', description: 'Convenience: gzip a UTF-8 string. Equivalent to gzip(text.toByteArray(UTF_8)).' },
      { name: 'gunzipToString(data)', returns: 'String', description: 'Convenience: decompress gzip bytes to a UTF-8 string.' },
      { name: 'autoDecompress(data)', returns: 'ByteArray', description: 'Smart decompress: returns decompressed bytes if gzipped, otherwise returns the original bytes unchanged. Safe to call on any payload.' },
    ],
    innerClasses: [],
    usage: `// Compress for cache storage
val compressed = KetoyCompression.gzip(wireBytes)

// Safe auto-decompress (no need to check isGzipped first)
val raw = KetoyCompression.autoDecompress(unknownBytes)

// String convenience wrappers
val compressedJson = KetoyCompression.gzipString(jsonString)
val restored = KetoyCompression.gunzipToString(compressedJson)`,
    notes: 'The autoDecompress() method is used internally by KetoyWireFormat.autoDecode(). Use it directly only when implementing custom caching or network layers.',
    seeAlso: ['KetoyWireFormat', 'KetoyMessagePack'],
  },

  /* ══════════════════════════════════════════════════════════════
   *  Wire > Key Alias  (KetoyKeyAlias.kt)
   * ══════════════════════════════════════════════════════════════ */

  KetoyKeyAlias: {
    name: 'KetoyKeyAlias',
    kind: 'object',
    module: 'wire',
    subpackage: 'alias',
    category: 'Wire',
    subcategory: 'Key Alias',
    description: 'Bidirectional key-alias registry for Ketoy SDUI JSON payloads. Maps verbose property names (e.g. "backgroundColor") to short 1-3 character aliases (e.g. "bg"), achieving 1.5-2.5× size reduction on key-heavy SDUI trees. Structural keys use single-char aliases ("type" → "t", "props" → "p", "children" → "c"). The vocabulary is append-only and fixed at compile time — client and server must share the same version.',
    android: {
      packageName: 'com.developerstring.ketoy.wire',
      annotations: [],
      imports: ['import com.developerstring.ketoy.wire.KetoyKeyAlias'],
      sourceCode: `object KetoyKeyAlias {

    /** Full property name → short alias (130+ mappings). */
    val encode: Map<String, String>

    /** Short alias → full property name (inverse of encode). */
    val decode: Map<String, String>

    fun aliasKeys(element: JsonElement): JsonElement
    fun expandKeys(element: JsonElement): JsonElement
}`,
    },
    properties: [
      { name: 'encode', type: 'Map<String, String>', description: 'Full property name → short alias map. Contains 130+ mappings including structural keys ("type"→"t"), modifiers ("backgroundColor"→"bg", "padding"→"pd"), scaffold props, text field state colors, and more.' },
      { name: 'decode', type: 'Map<String, String>', description: 'Short alias → full property name. The inverse of encode. Built automatically from the encode map.' },
    ],
    methods: [
      { name: 'aliasKeys(element)', returns: 'JsonElement', description: 'Recursively replace all property names with their aliases. Unknown keys are passed through unchanged. Used by the encoder.' },
      { name: 'expandKeys(element)', returns: 'JsonElement', description: 'Recursively expand all alias keys back to their full names. Unknown aliases are passed through unchanged. Used by the decoder. Safe to call on non-aliased data.' },
    ],
    innerClasses: [],
    usage: `// Inspect the alias map (e.g. for debugging or docs)
val alias = KetoyKeyAlias.encode["backgroundColor"] // "bg"
val full  = KetoyKeyAlias.decode["bg"]              // "backgroundColor"

// Apply aliasing to a parsed JsonElement (done automatically by WireFormatConfig)
val aliased  = KetoyKeyAlias.aliasKeys(jsonElement)
val restored = KetoyKeyAlias.expandKeys(aliased)`,
    notes: `Key alias assignment conventions:
- Structural keys (type, props, children): 1 char
- High-frequency modifier keys: 2 chars
- Scaffold / TextField keys: 2-3 chars
- Color-state keys use prefixes: f=focused, u=unfocused, d=disabled, e=error, s=selected, us=unselected
Once assigned, aliases NEVER change — backward compatibility is guaranteed.`,
    seeAlso: ['KetoyWireFormat', 'WireFormatConfig', 'KetoyComponentTypeId'],
  },

  /* ══════════════════════════════════════════════════════════════
   *  Wire > Component Type IDs  (KetoyComponentTypeId.kt)
   * ══════════════════════════════════════════════════════════════ */

  KetoyComponentTypeId: {
    name: 'KetoyComponentTypeId',
    kind: 'object',
    module: 'wire',
    subpackage: 'typeid',
    category: 'Wire',
    subcategory: 'Component Type IDs',
    description: 'Bidirectional registry mapping Ketoy component type strings to compact integer IDs. Component type strings ("Column", "Text", "FloatingActionButton") are the most-repeated values in an SDUI JSON tree. Replacing them with 1-2 byte integers reduces payload size, especially with MessagePack where integers 0-127 encode as a single byte. IDs are densely packed starting at 1, partitioned by category: layouts (1-10), widgets (11-30), scaffold (31-60), data constructs (61-70). ID 0 is reserved. The mapping is append-only and stable.',
    android: {
      packageName: 'com.developerstring.ketoy.wire',
      annotations: [],
      imports: ['import com.developerstring.ketoy.wire.KetoyComponentTypeId'],
      sourceCode: `object KetoyComponentTypeId {

    /** Component type name → integer ID. */
    val typeToId: Map<String, Int>

    /** Integer ID → component type name (inverse of typeToId). */
    val idToType: Map<Int, String>

    fun compressTypes(element: JsonElement): JsonElement
    fun expandTypes(element: JsonElement): JsonElement
}`,
    },
    properties: [
      {
        name: 'typeToId',
        type: 'Map<String, Int>',
        description: `Complete type-to-ID map. Partitioned as:
Layouts (1-5): Column=1, Row=2, Box=3, LazyColumn=4, LazyRow=5
Widgets (11-19): Text=11, Button=12, Spacer=13, Card=14, TextField=15, Image=16, Icon=17, IconButton=18, Component=19
Scaffold (31-44): Scaffold=31, TopAppBar=32, BottomAppBar=33, NavigationBar=34, FloatingActionButton=35, SnackBar=36, SnackBarHost=37, NavigationDrawerItem=38, CustomNavigationItem=39, NavigationRail=40, NavigationRailItem=41, AppBarAction=42, NavigationBarItem=43, ModalBottomSheet=44
Data (61-63): DataClass=61, Enum=62, DataList=63`
      },
      { name: 'idToType', type: 'Map<Int, String>', description: 'Integer ID → component type name. The inverse of typeToId. Built automatically.' },
    ],
    methods: [
      { name: 'compressTypes(element)', returns: 'JsonElement', description: 'Recursively replace all "type" string values with their integer IDs. Unknown types are passed through unchanged. Used by the encoder.' },
      { name: 'expandTypes(element)', returns: 'JsonElement', description: 'Recursively expand integer type IDs back to string names. Unknown IDs are passed through unchanged. Used by the decoder. Safe to call on non-compressed data.' },
    ],
    innerClasses: [],
    usage: `// Inspect type IDs
val id   = KetoyComponentTypeId.typeToId["Column"]           // 1
val name = KetoyComponentTypeId.idToType[35]                  // "FloatingActionButton"

// Apply type compression (done automatically by WireFormatConfig)
val compressed = KetoyComponentTypeId.compressTypes(jsonElement)
val expanded   = KetoyComponentTypeId.expandTypes(compressed)`,
    notes: 'IDs are assigned in order of introduction and never reassigned. New component types receive the next available ID in their partition range. The mapping is identical on the Gradle plugin (encoder) and the SDK (decoder).',
    seeAlso: ['KetoyWireFormat', 'WireFormatConfig', 'KetoyKeyAlias'],
  },

  /* ══════════════════════════════════════════════════════════════
   *  Wire > Patch  (KetoyPatch.kt)
   * ══════════════════════════════════════════════════════════════ */

  KetoyPatch: {
    name: 'KetoyPatch',
    kind: 'object',
    module: 'wire',
    subpackage: 'patch',
    category: 'Wire',
    subcategory: 'Patch',
    description: 'RFC 6902 JSON Patch implementation for Ketoy SDUI trees. When a screen updates partially (e.g. a user action re-renders one subtree), sending the full JSON tree is wasteful. JSON Patch sends only the delta — typically 10-50× smaller than the full payload for incremental updates. Supports all 6 RFC 6902 operations: add, remove, replace, move, copy, test. Paths use JSON Pointer syntax (RFC 6901).',
    android: {
      packageName: 'com.developerstring.ketoy.wire',
      annotations: [],
      imports: [
        'import com.developerstring.ketoy.wire.KetoyPatch',
        'import com.developerstring.ketoy.wire.PatchOp',
      ],
      sourceCode: `object KetoyPatch {
    fun apply(document: JsonElement, operations: List<PatchOp>): JsonElement
    fun diff(source: JsonElement, target: JsonElement): List<PatchOp>
}`,
    },
    properties: [],
    methods: [
      { name: 'apply(document, operations)', returns: 'JsonElement', description: 'Apply a list of PatchOp operations sequentially to a JsonElement tree. Returns a new JsonElement with all patches applied. Throws PatchException if a path is invalid or an operation fails.' },
      { name: 'diff(source, target)', returns: 'List<PatchOp>', description: 'Generate a minimal list of PatchOp operations that transforms the source tree into the target tree. Uses structural recursive diff for objects and positional diff for arrays. Returns add/remove/replace operations.' },
    ],
    innerClasses: [],
    usage: `// Apply a patch received from the server
val patch = listOf(
    PatchOp(op = "replace", path = "/children/2/props/text", value = JsonPrimitive("Updated!")),
    PatchOp(op = "add", path = "/children/3", value = newComponentJson)
)
val updated = KetoyPatch.apply(originalTree, patch)

// Generate a patch to send to the client
val patch = KetoyPatch.diff(oldTree, newTree)
// Serialize patch and send instead of full newTree`,
    notes: 'JSON Pointer path syntax: "/children/2/props/text" where numeric segments index into arrays and "-" appends to end of an array. The ~ escape: "~1" → "/" and "~0" → "~".',
    seeAlso: ['PatchOp', 'PatchException', 'KetoyWireFormat'],
  },

  PatchOp: {
    name: 'PatchOp',
    kind: 'data class',
    module: 'wire',
    subpackage: 'patch',
    category: 'Wire',
    subcategory: 'Patch',
    description: 'A single RFC 6902 JSON Patch operation. Carries an operation name, a target path (JSON Pointer), an optional value, and an optional source path for move/copy.',
    android: {
      packageName: 'com.developerstring.ketoy.wire',
      annotations: ['@Serializable'],
      imports: [
        'import com.developerstring.ketoy.wire.PatchOp',
        'import kotlinx.serialization.json.JsonPrimitive',
      ],
      sourceCode: `@Serializable
data class PatchOp(
    val op: String,
    val path: String,
    val value: JsonElement? = null,
    val from: String? = null
)`,
    },
    properties: [
      { name: 'op', type: 'String', description: 'Operation name. One of: "add", "remove", "replace", "move", "copy", "test".' },
      { name: 'path', type: 'String', description: 'Target location as a JSON Pointer (RFC 6901), e.g. "/children/2/props/text".' },
      { name: 'value', type: 'JsonElement?', description: 'Value to add/replace/test. Unused for "remove" and "move" operations.' },
      { name: 'from', type: 'String?', description: 'Source location as a JSON Pointer. Required for "move" and "copy" operations.' },
    ],
    methods: [],
    innerClasses: [],
    usage: `PatchOp(op = "replace", path = "/children/0/props/text", value = JsonPrimitive("New text"))
PatchOp(op = "add",     path = "/children/-",              value = newNode)
PatchOp(op = "remove",  path = "/children/2")
PatchOp(op = "move",    path = "/children/1",              from = "/children/3")`,
    notes: 'PatchOp is @Serializable — you can encode/decode patch lists as JSON using kotlinx.serialization.',
    seeAlso: ['KetoyPatch', 'PatchException'],
  },

  PatchException: {
    name: 'PatchException',
    kind: 'class',
    module: 'wire',
    subpackage: 'patch',
    category: 'Wire',
    subcategory: 'Patch',
    description: 'Exception thrown when a JSON Patch operation fails — e.g. an invalid path, out-of-bounds array index, key not found, or a failing "test" assertion.',
    android: {
      packageName: 'com.developerstring.ketoy.wire',
      annotations: [],
      imports: ['import com.developerstring.ketoy.wire.PatchException'],
      sourceCode: `class PatchException(message: String) : Exception(message)`,
    },
    properties: [],
    methods: [],
    innerClasses: [],
    usage: `try {
    val updated = KetoyPatch.apply(document, operations)
} catch (e: PatchException) {
    Log.e("Ketoy", "Patch failed: \${e.message}")
}`,
    notes: 'Always wrap KetoyPatch.apply() in a try/catch when operations come from an external source.',
    seeAlso: ['KetoyPatch', 'PatchOp'],
  },
}

export default wireData
