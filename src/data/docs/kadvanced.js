/**
 * Ketoy Documentation – Advanced: KSpacer, KIf, KForEach, KRepeat, KComponent
 * Covers: Utility and control-flow builders
 */

const kAdvancedDoc = {
  id: 'kadvanced',
  title: 'Advanced Builders',
  description: 'Utility and control-flow builders: KSpacer for spacing, KIf for conditionals, KForEach / KRepeat for iteration, and KComponent for reusable composables.',
  icon: 'FaCogs',
  order: 11,
  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content: `Ketoy provides several utility builders for layout spacing, conditional rendering, loops, and component reuse:

- **KSpacer** — empty space for layout adjustment
- **KIf** — conditional rendering based on server state
- **KForEach** — iterate over a list of data
- **KRepeat** — repeat a block N times
- **KComponent / KComponentSmart** — reusable component references
- **KDataClass / KEnum** — data type declarations`,
    },
    {
      id: 'kspacer',
      title: 'KSpacer',
      content: `\`KSpacer\` adds empty space. Use \`modifier\` to control its size, or use \`weight\` to fill remaining space.`,
      code: `KColumn(modifier = KModifier(fillMaxSize = 1f)) {
    KText("Top content", fontSize = 18)

    // Fixed spacer
    KSpacer(modifier = KModifier(height = 24))

    KText("Middle content")

    // Flexible spacer — pushes footer to the bottom
    KSpacer(modifier = KModifier(weight = 1f))

    KButton(onClick = { onFooterClick() }, modifier = KModifier(fillMaxWidth = 1f)) {
        KText("Footer Button")
    }
}`,
      language: 'kotlin',
    },
    {
      id: 'kif',
      title: 'KIf – Conditional Rendering',
      content: `\`KIf\` conditionally renders content based on a boolean condition. This is evaluated on the server:`,
      code: `KColumn(modifier = KModifier(padding = 16), verticalArrangement = spacedBy(12)) {
    KText("Account Status", fontSize = 20, fontWeight = KFontWeights.Bold)

    KIf(condition = isLoggedIn) {
        KText("Welcome back, \${userName}!", color = KColors.Primary)
        KButton(onClick = { signOut() }) {
            KText("Sign Out")
        }
    }

    KIf(condition = !isLoggedIn) {
        KText("Please sign in to continue.", color = KColors.OnSurfaceVariant)
        KButton(onClick = { signIn() }) {
            KText("Sign In")
        }
    }
}`,
      language: 'kotlin',
    },
    {
      id: 'kif-signature',
      title: 'KIf – Signature',
      code: `fun KIf(
    condition: Boolean,
    content: KUniversalScope.() -> Unit
)`,
      language: 'kotlin',
    },
    {
      id: 'kforeach',
      title: 'KForEach – Iteration',
      content: `\`KForEach\` renders content for each item in a list. Unlike \`KLazyColumn\`, this eagerly renders all items (suitable for small lists).`,
      code: `KColumn(verticalArrangement = spacedBy(8)) {
    KForEach(items = menuItems) { item ->
        KRow(
            modifier = KModifier(
                fillMaxWidth = 1f,
                padding = 12,
                cornerRadius = 8
            ),
            horizontalArrangement = spacedBy(12),
            verticalAlignment = KAlignment.CenterVertically
        ) {
            KIcon(icon = item.icon, color = KColors.Primary)
            KText(item.title, fontSize = 16)
        }
    }
}`,
      language: 'kotlin',
    },
    {
      id: 'krepeat',
      title: 'KRepeat',
      content: `\`KRepeat\` renders content a fixed number of times, passing the index:`,
      code: `KRow(horizontalArrangement = spacedBy(4)) {
    KRepeat(count = 5) { index ->
        KIcon(
            icon = KIcons.Star,
            color = if (index < rating) "#FFD700" else KColors.OnSurfaceVariant,
            size = 20
        )
    }
}`,
      language: 'kotlin',
    },
    {
      id: 'kcomponent',
      title: 'KComponent & KComponentSmart',
      content: `\`KComponent\` references a reusable composable defined elsewhere. \`KComponentSmart\` loads the component lazily with caching.`,
      code: `// Reference a named component
KComponent(name = "UserCard", args = mapOf("userId" to "42"))

// Smart component with caching
KComponentSmart(
    name = "ProductTile",
    args = mapOf("productId" to id),
    cacheKey = "product_\$id"
)`,
      language: 'kotlin',
    },
    {
      id: 'kcomponent-signature',
      title: 'KComponent – Signatures',
      code: `fun KComponent(
    name: String,
    args: Map<String, Any>? = null
)

fun KComponentSmart(
    name: String,
    args: Map<String, Any>? = null,
    cacheKey: String? = null
)`,
      language: 'kotlin',
    },
    {
      id: 'kdataclass',
      title: 'KDataClass & KEnum',
      content: `Declare data models used by your server-driven UI:`,
      code: `// Define a data class
KDataClass("User") {
    field("id", type = "String")
    field("name", type = "String")
    field("email", type = "String?")
    field("role", type = "UserRole")
}

// Define an enum
KEnum("UserRole") {
    value("ADMIN")
    value("EDITOR")
    value("VIEWER")
}`,
      language: 'kotlin',
    },
    {
      id: 'onclick-action-system',
      title: 'onClick & Action System',
      content: `In Ketoy, \`onClick\` is a native Kotlin lambda \`(() -> Unit)?\` — it is **not** server-driven. Changes to onClick logic require a Play Store update.

However, you can use \`actionId\` to switch which registered action a button triggers without redeploying:`,
      code: `// Direct lambda — compiled into the app
KButton(onClick = { navigateToDetails(itemId) }) {
    KText("View Details")
}

// Using actionId — map to registered actions
KButton(actionId = "navigate_details") {
    KText("View Details")
}

// Register actions in your host app
ActionRegistry.register("navigate_details") {
    navigateToDetails(currentItemId)
}`,
      language: 'kotlin',
    },
  ],
  relatedReference: ['KUniversalScope', 'KModifier'],
  prevDoc: 'klists',
}

export default kAdvancedDoc
