/**
 * Ketoy Documentation – Widgets: KLazyColumn, KLazyRow
 * Covers: Scrollable list containers
 */

const kListsDoc = {
  id: 'klists',
  title: 'KLazyColumn & KLazyRow',
  description: 'Efficient scrollable lists in the Ketoy DSL. KLazyColumn scrolls vertically, KLazyRow scrolls horizontally. Both recycle items for performance.',
  icon: 'FaListUl',
  order: 10,
  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content: `\`KLazyColumn\` and \`KLazyRow\` are the lazy list builders in Ketoy. They map to Jetpack Compose's \`LazyColumn\` and \`LazyRow\`, recycling off-screen items for efficient rendering of long lists.

Both accept a \`KLazyListScope\` content lambda with \`item {}\`, \`items(list) {}\`, \`items(count) {}\`, and \`itemsIndexed(list) {}\` blocks.`,
    },
    {
      id: 'klazycolumn-signature',
      title: 'KLazyColumn – Signature',
      code: `fun KLazyColumn(
    modifier: KModifier? = null,
    verticalArrangement: String? = null,
    horizontalAlignment: String? = null,
    userScrollEnabled: Boolean? = null,
    reverseLayout: Boolean? = null,
    contentPadding: KPadding? = null,
    beyondBoundsItemCount: Int? = null,
    content: KLazyListScope.() -> Unit
)`,
      language: 'kotlin',
    },
    {
      id: 'klazycolumn-params',
      title: 'KLazyColumn – Parameters',
      table: {
        headers: ['Parameter', 'Type', 'Default', 'Description'],
        rows: [
          ['modifier', 'KModifier?', 'null', 'Layout modifier.'],
          ['verticalArrangement', 'String?', 'null', 'Same as KColumn: spacedBy(Int), KArrangements.*.'],
          ['horizontalAlignment', 'String?', 'null', 'KAlignment.Start, .CenterHorizontally, .End.'],
          ['userScrollEnabled', 'Boolean?', 'null', 'Whether the user can scroll the list. Default true.'],
          ['reverseLayout', 'Boolean?', 'null', 'Reverse the scroll direction. Default false.'],
          ['contentPadding', 'KPadding?', 'null', 'Padding around the entire list content.'],
          ['beyondBoundsItemCount', 'Int?', 'null', 'Number of items to compose beyond visible bounds.'],
          ['content', 'KLazyListScope.() -> Unit', '—', 'Lazy list content using item {}, items(), itemsIndexed().'],
        ],
      },
    },
    {
      id: 'basic-list',
      title: 'Basic List',
      code: `KLazyColumn(
    modifier = KModifier(fillMaxSize = 1f),
    verticalArrangement = spacedBy(8)
) {
    item {
        KText("Header", fontSize = 20, fontWeight = KFontWeights.Bold, modifier = KModifier(padding = 16))
    }
    items(dataList) { data ->
        KCard(modifier = KModifier(fillMaxWidth = 1f)) {
            KRow(
                modifier = KModifier(padding = 16, fillMaxWidth = 1f),
                verticalAlignment = KAlignment.CenterVertically,
                horizontalArrangement = spacedBy(12)
            ) {
                KImage(
                    source = KUrlImageSource(data.imageUrl),
                    scaleType = KScaleType.CenterCrop,
                    modifier = KModifier(size = 48, cornerRadius = 24)
                )
                KColumn(verticalArrangement = spacedBy(4)) {
                    KText(data.title, fontSize = 16, fontWeight = KFontWeights.SemiBold)
                    KText(data.subtitle, fontSize = 12, color = KColors.OnSurfaceVariant)
                }
            }
        }
    }
}`,
      language: 'kotlin',
    },
    {
      id: 'klazyrow-signature',
      title: 'KLazyRow – Signature',
      code: `fun KLazyRow(
    modifier: KModifier? = null,
    horizontalArrangement: String? = null,
    verticalAlignment: String? = null,
    userScrollEnabled: Boolean? = null,
    reverseLayout: Boolean? = null,
    contentPadding: KPadding? = null,
    beyondBoundsItemCount: Int? = null,
    content: KLazyListScope.() -> Unit
)`,
      language: 'kotlin',
    },
    {
      id: 'horizontal-list',
      title: 'Horizontal List',
      content: `Use \`KLazyRow\` for horizontal scrolling:`,
      code: `KLazyRow(
    modifier = KModifier(fillMaxWidth = 1f, height = 180),
    horizontalArrangement = spacedBy(12)
) {
    items(categories) { category ->
        KCard(
            modifier = KModifier(width = 140, height = 160),
            onClick = { selectCategory(category.id) }
        ) {
            KColumn(
                modifier = KModifier(fillMaxSize = 1f, padding = 12),
                verticalArrangement = KArrangements.SpaceBetween
            ) {
                KIcon(icon = category.icon, size = 32, color = KColors.Primary)
                KText(category.name, fontSize = 14, fontWeight = KFontWeights.SemiBold)
            }
        }
    }
}`,
      language: 'kotlin',
    },
    {
      id: 'lazy-list-scope',
      title: 'KLazyListScope API',
      content: `Inside \`KLazyColumn\` and \`KLazyRow\`, you use \`KLazyListScope\` methods:`,
      table: {
        headers: ['Method', 'Description'],
        rows: [
          ['item { ... }', 'Add a single item to the list.'],
          ['items(list) { item -> ... }', 'Add multiple items from a list.'],
          ['items(count) { index -> ... }', 'Add a fixed count of indexed items.'],
          ['itemsIndexed(list) { index, item -> ... }', 'Add items with both index and item available.'],
        ],
      },
    },
    {
      id: 'items-indexed',
      title: 'Indexed Items',
      content: `Use \`itemsIndexed\` when you need both the index and the item:`,
      code: `KLazyColumn(
    modifier = KModifier(fillMaxSize = 1f),
    verticalArrangement = spacedBy(4)
) {
    itemsIndexed(items) { index, item ->
        KRow(
            modifier = KModifier(fillMaxWidth = 1f, padding = 12),
            horizontalArrangement = spacedBy(12),
            verticalAlignment = KAlignment.CenterVertically
        ) {
            KText("\${index + 1}.", fontSize = 14, fontWeight = KFontWeights.Bold, color = KColors.Primary)
            KText(item.name, fontSize = 16)
        }
    }
}`,
      language: 'kotlin',
    },
    {
      id: 'content-padding',
      title: 'Content Padding',
      content: `Use \`contentPadding\` to add padding around the list content without clipping items:`,
      code: `KLazyColumn(
    modifier = KModifier(fillMaxSize = 1f),
    verticalArrangement = spacedBy(8),
    contentPadding = KPadding(horizontal = 16, vertical = 8)
) {
    items(dataList) { data ->
        KCard(modifier = KModifier(fillMaxWidth = 1f)) {
            KText(data.title, modifier = KModifier(padding = 16))
        }
    }
}`,
      language: 'kotlin',
    },
    {
      id: 'performance',
      title: 'Performance Tips',
      content: `**Keys** — Provide stable keys for items to optimize recomposition:
- Use unique item IDs as keys when possible
- Avoid using list index as the sole key for dynamic lists

**Content size** — Keep individual item composables lightweight. Move heavy logic to the host app.

**Arrangement** — Use \`spacedBy(Int)\` instead of adding spacers between items for better performance.

**beyondBoundsItemCount** — Pre-compose items beyond the visible area to reduce jank during fast scrolling.`,
    },
  ],
  relatedReference: ['KLazyListScope', 'KUniversalScope', 'KModifier', 'KArrangements', 'KPadding'],
  nextDoc: 'kadvanced',
  prevDoc: 'kscaffold',
}

export default kListsDoc
