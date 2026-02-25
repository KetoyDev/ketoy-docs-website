/**
 * Ketoy Documentation – Widgets: KCard
 * Covers: KCard DSL builder inside KUniversalScope
 */

const kCardDoc = {
  id: 'kcard',
  title: 'KCard',
  description: 'KCard renders a Material 3 card surface with elevation, shape (KShapes), optional border (KBorder), and click handling. Use it to group related content visually.',
  icon: 'FaBoxOpen',
  order: 6,
  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content: `\`KCard\` renders a Material 3 card — a contained surface with elevation, shape, and optional border. It accepts a content lambda so you can nest any combination of KText, KImage, KButton, and layout containers inside it.

Cards are the fundamental grouping primitive in server-driven UIs, perfect for list items, info tiles, and detail sections. The card shape defaults to \`KShapes.Rounded12\` and elevation defaults to 1.`,
    },
    {
      id: 'signature',
      title: 'Signature',
      code: `fun KCard(
    modifier: KModifier? = null,
    shape: String? = null,
    containerColor: String? = null,
    contentColor: String? = null,
    elevation: Int? = null,
    border: KBorder? = null,
    onClick: (() -> Unit)? = null,
    enabled: Boolean = true,
    actionId: String? = null,
    content: KUniversalScope.() -> Unit
)`,
      language: 'kotlin',
    },
    {
      id: 'parameters',
      title: 'Parameters',
      table: {
        headers: ['Parameter', 'Type', 'Default', 'Description'],
        rows: [
          ['modifier', 'KModifier?', 'null', 'Layout modifier.'],
          ['shape', 'String?', 'KShapes.Rounded12', 'Corner shape using KShapes constants (e.g. KShapes.Rounded16, KShapes.Circle, KShapes.Rectangle).'],
          ['containerColor', 'String?', 'null', 'Card background color (hex or KColors reference).'],
          ['contentColor', 'String?', 'null', 'Default text/icon color inside the card.'],
          ['elevation', 'Int?', '1', 'Shadow elevation in dp.'],
          ['border', 'KBorder?', 'null', 'Card border using KBorder(width, color, shape).'],
          ['onClick', '(() -> Unit)?', 'null', 'Native Kotlin click handler. If set, the card becomes clickable.'],
          ['enabled', 'Boolean', 'true', 'Whether the card is interactive (when onClick is set).'],
          ['actionId', 'String?', 'null', 'Dynamic action ID for ActionRegistry.'],
          ['content', 'KUniversalScope.() -> Unit', '—', 'Child content lambda.'],
        ],
      },
    },
    {
      id: 'basic-usage',
      title: 'Basic Usage',
      code: `KCard(modifier = KModifier(fillMaxWidth = 1f)) {
    KColumn(modifier = KModifier(padding = 16), verticalArrangement = spacedBy(8)) {
        KText("Card Title", fontSize = 18, fontWeight = KFontWeights.Bold)
        KText("This is a simple card with some content.", color = KColors.OnSurfaceVariant)
    }
}`,
      language: 'kotlin',
    },
    {
      id: 'clickable-card',
      title: 'Clickable Card',
      content: `Add \`onClick\` to make the entire card tappable:`,
      code: `KCard(
    modifier = KModifier(fillMaxWidth = 1f),
    onClick = { openDetails(itemId) }
) {
    KRow(
        modifier = KModifier(padding = 16, fillMaxWidth = 1f),
        horizontalArrangement = KArrangements.SpaceBetween,
        verticalAlignment = KAlignment.CenterVertically
    ) {
        KColumn(verticalArrangement = spacedBy(4)) {
            KText("Product Name", fontSize = 16, fontWeight = KFontWeights.SemiBold)
            KText("$19.99", fontSize = 14, color = KColors.OnSurfaceVariant)
        }
        KIcon(icon = KIcons.ChevronRight, color = KColors.OnSurfaceVariant)
    }
}`,
      language: 'kotlin',
    },
    {
      id: 'shape-border',
      title: 'Shape & Border',
      content: `Use \`KShapes\` constants for shape and \`KBorder\` for border styling:`,
      code: `KColumn(verticalArrangement = spacedBy(12)) {
    // Rounded card (default)
    KCard(shape = KShapes.Rounded12, modifier = KModifier(fillMaxWidth = 1f)) {
        KText("Default Shape", modifier = KModifier(padding = 16))
    }

    // Card with large corner radius
    KCard(shape = KShapes.Rounded24, modifier = KModifier(fillMaxWidth = 1f)) {
        KText("Large Radius", modifier = KModifier(padding = 16))
    }

    // Card with border
    KCard(
        modifier = KModifier(fillMaxWidth = 1f),
        border = KBorder(width = 1, color = KColors.Outline),
        elevation = 0
    ) {
        KText("Outlined Card", modifier = KModifier(padding = 16))
    }

    // Custom rounded card with border
    KCard(
        shape = KShapes.rounded(topStart = 16, topEnd = 16, bottomEnd = 0, bottomStart = 0),
        border = KBorder(width = 2, color = KColors.Primary),
        containerColor = KColors.PrimaryContainer
    ) {
        KText("Custom Shape", modifier = KModifier(padding = 16), color = KColors.OnPrimaryContainer)
    }
}`,
      language: 'kotlin',
    },
    {
      id: 'rich-card',
      title: 'Rich Content Card',
      content: `Combine image, text, and buttons inside a card:`,
      code: `KCard(modifier = KModifier(fillMaxWidth = 1f), shape = KShapes.Rounded16) {
    KColumn {
        KImage(
            source = KUrlImageSource("https://example.com/banner.jpg"),
            contentDescription = "Banner",
            scaleType = KScaleType.CenterCrop,
            modifier = KModifier(fillMaxWidth = 1f, height = 180)
        )
        KColumn(modifier = KModifier(padding = 16), verticalArrangement = spacedBy(8)) {
            KText("Featured Article", fontSize = 20, fontWeight = KFontWeights.Bold)
            KText(
                "Explore the latest updates and features available in the new release.",
                fontSize = 14,
                color = KColors.OnSurfaceVariant,
                maxLines = 3,
                overflow = KTextOverflow.Ellipsis
            )
            KRow(horizontalArrangement = spacedBy(8)) {
                KButton(onClick = { readArticle() }) {
                    KText("Read More")
                }
                KButton(
                    onClick = { saveArticle() },
                    containerColor = KColors.SecondaryContainer,
                    contentColor = KColors.OnSecondaryContainer
                ) {
                    KText("Save")
                }
            }
        }
    }
}`,
      language: 'kotlin',
    },
    {
      id: 'kshapes-reference',
      title: 'KShapes Reference',
      content: `\`KShapes\` provides predefined shape constants and factory methods:`,
      table: {
        headers: ['Constant / Method', 'Description'],
        rows: [
          ['KShapes.Rectangle', 'No corner rounding.'],
          ['KShapes.Circle', 'Fully circular shape.'],
          ['KShapes.Rounded4 – Rounded32', 'Predefined corner radii: 4, 8, 12, 16, 20, 24, 28, 32 dp.'],
          ['KShapes.rounded(radius)', 'Custom uniform corner radius.'],
          ['KShapes.rounded(topStart, topEnd, bottomEnd, bottomStart)', 'Per-corner radius.'],
          ['KShapes.circle()', 'Factory for circle shape.'],
          ['KShapes.rectangle()', 'Factory for rectangle shape.'],
        ],
      },
    },
    {
      id: 'kborder-reference',
      title: 'KBorder Reference',
      content: `\`KBorder\` is a data class for card/component borders:`,
      code: `data class KBorder(
    val width: Int,
    val color: String,
    val shape: String? = null   // Optional shape override
)

// Examples
KBorder(width = 1, color = KColors.Outline)
KBorder(width = 2, color = "#FF5722", shape = KShapes.Rounded8)`,
      language: 'kotlin',
    },
  ],
  relatedReference: ['KUniversalScope', 'KModifier', 'KShapes', 'KBorder', 'KColors', 'ActionRegistry'],
  nextDoc: 'kmedia',
  prevDoc: 'klayout',
}

export default kCardDoc
