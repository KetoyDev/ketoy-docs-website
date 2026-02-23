/**
 * Ketoy SDK – Annotation Module
 * Package: com.developerstring.ketoy.annotation
 */

const annotationData = {

  KComponent: {
    name: 'KComponent',
    kind: 'annotation class',
    module: 'annotation',
    category: 'Annotation',
    subcategory: 'Component Metadata',
    description: 'Marks a @Composable function as a Ketoy custom component that can be referenced from server-driven JSON via its name. When the renderer encounters a JSON node whose "type" matches the name, it delegates rendering to the annotated composable.',
    android: {
      packageName: 'com.developerstring.ketoy.annotation',
      annotations: ['@Target(FUNCTION)', '@Retention(RUNTIME)'],
      imports: [],
      sourceCode: `@Target(AnnotationTarget.FUNCTION)
@Retention(AnnotationRetention.RUNTIME)
annotation class KComponent(
    val name: String,
    val packageName: String = "",
    val description: String = "",
    val version: String = "1.0"
)`,
    },
    properties: [
      { name: 'name', type: 'String', default: '—', description: 'The unique component type identifier used in JSON "type" fields. Must be globally unique across the application.' },
      { name: 'packageName', type: 'String', default: '""', description: 'Optional fully-qualified package name for metadata and reflection-based dynamic loading.' },
      { name: 'description', type: 'String', default: '""', description: 'Optional human-readable description shown in documentation and the Ketoy DevTools component catalogue.' },
      { name: 'version', type: 'String', default: '"1.0"', description: 'Semantic version of this component\'s contract. Increment when the expected props change.' },
    ],
    usage: `@KComponent(
    name = "UserCard",
    packageName = "com.myapp.widgets",
    description = "Displays a user's name, avatar, and VIP badge.",
    version = "1.2"
)
@Composable
fun UserCardWidget(props: Map<String, Any>) {
    val name = props["name"] as? String ?: ""
    val isVip = props["isVip"] as? Boolean ?: false
    UserCard(name = name, isVip = isVip)
}`,
    notes: 'The component must also be registered in KComponentRegistry at runtime (either manually or via code-generation). The corresponding JSON should have a "type" field matching the name parameter.',
    seeAlso: ['KetoyJsonUtils', 'KetoyCloudScreen', 'KetoyCloudScreenFromJson'],
  },

}

export default annotationData
