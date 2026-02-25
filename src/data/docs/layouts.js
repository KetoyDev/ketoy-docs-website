/**
 * Ketoy Documentation – Layouts
 * Covers: KColumn, KRow, KBox, KLazyColumn, KLazyRow, and KSpacer (Ketoy DSL)
 */

const layoutsDoc = {
  id: 'layouts',
  title: 'Layouts',
  description: 'Use layout components like KColumn, KRow, KBox, KLazyColumn, and KLazyRow to structure your server-driven UI with the Ketoy DSL. This guide covers DSL syntax, properties, and practical examples for each layout.',
  icon: 'FaThLarge',
  order: 2,
  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content: `Ketoy provides five core layout DSL builders that correspond directly to their Jetpack Compose counterparts:

| DSL Builder | Compose Equivalent | Scope | Description |
|---|---|---|---|
| **KColumn** | \`Column\` | \`KUniversalScope\` | Vertical layout — children stacked top to bottom |
| **KRow** | \`Row\` | \`KUniversalScope\` | Horizontal layout — children placed start to end |
| **KBox** | \`Box\` | \`KUniversalScope\` | Overlap layout — children stacked on top of each other |
| **KLazyColumn** | \`LazyColumn\` | \`KLazyListScope\` | Virtualised vertical list (scrollable) |
| **KLazyRow** | \`LazyRow\` | \`KLazyListScope\` | Virtualised horizontal list (scrollable) |

All layouts accept an optional \`KModifier\` data class for sizing, padding, background, etc. and support nested children. Arrangement and alignment are configured via \`KArrangements\` and \`KAlignments\`.`,
    },
    {
      id: 'dsl-structure',
      title: 'DSL Structure',
      content: `Every layout is built using Kotlin DSL builder functions. The receiver scope (\`KUniversalScope\` or \`KLazyListScope\`) gives you access to child builders like \`KText\`, \`KButton\`, \`KIcon\`, and nested layout builders:`,
      code: `KColumn(
    modifier = KModifier(fillMaxSize = 1f, padding = 16),
    verticalArrangement = KArrangements.SpaceBetween,
    horizontalAlignment = KAlignments.CenterHorizontally
) {
    KText("Hello", fontSize = 20, fontWeight = KFontWeights.Bold)
    KText("World", color = KColors.OnSurfaceVariant)
}`,
      language: 'kotlin',
    },

    // ── Column ──
    {
      id: 'column',
      title: 'KColumn',
      content: `\`KColumn\` places children vertically from top to bottom — equivalent to Compose's \`Column\`. Use it for any vertically stacked content: forms, lists, page sections, etc.

Inside a \`KColumn\`, the content lambda receives a \`KUniversalScope\`, giving you access to all DSL builders like \`KText\`, \`KButton\`, \`KRow\`, \`KCard\`, etc.`,
      code: `KColumn(
    modifier = KModifier(fillMaxWidth = 1f, padding = 16),
    verticalArrangement = KArrangements.SpaceBetween,
    horizontalAlignment = KAlignments.CenterHorizontally
) {
    KText(
        text = "Title",
        fontSize = 24,
        fontWeight = KFontWeights.Bold
    )
    KText(
        text = "Subtitle",
        color = KColors.OnSurfaceVariant
    )
    KButton(
        onClick = { /* handle submit */ },
        containerColor = KColors.Primary,
        contentColor = KColors.OnPrimary
    ) {
        KText("Submit")
    }
}`,
      language: 'kotlin',
      subsections: [
        {
          id: 'column-props',
          title: 'KColumn Parameters',
          table: {
            headers: ['Parameter', 'Type', 'Default', 'Description'],
            rows: [
              ['modifier', 'KModifier?', 'null', 'KModifier data class for sizing, padding, background, etc.'],
              ['verticalArrangement', 'String?', 'null (Top)', 'Use KArrangements: .Top, .Center, .Bottom, .SpaceBetween, .SpaceAround, .SpaceEvenly, .spacedBy(X)'],
              ['horizontalAlignment', 'String?', 'null (Start)', 'Use KAlignments: .Start, .CenterHorizontally, .End'],
            ],
          },
        },
        {
          id: 'column-weight',
          title: 'Child Weights',
          content: `Children inside a \`KColumn\` can use the \`weight\` property in KModifier to take proportional space — just like \`Modifier.weight()\` in Compose:`,
          code: `KColumn(modifier = KModifier(fillMaxSize = 1f)) {
    KBox(modifier = KModifier(weight = 1f, fillMaxWidth = 1f, background = KColors.PrimaryContainer)) {
        KText("Top (1x)")
    }
    KBox(modifier = KModifier(weight = 2f, fillMaxWidth = 1f, background = KColors.SecondaryContainer)) {
        KText("Bottom (2x)")
    }
}`,
          language: 'kotlin',
        },
      ],
    },

    // ── Row ──
    {
      id: 'row',
      title: 'KRow',
      content: `\`KRow\` places children horizontally from start to end — equivalent to Compose's \`Row\`. Use it for toolbars, horizontal card lists, side-by-side elements, etc.

Like \`KColumn\`, the content lambda receives \`KUniversalScope\`.`,
      code: `KRow(
    modifier = KModifier(fillMaxWidth = 1f, padding = 8),
    horizontalArrangement = KArrangements.SpaceBetween,
    verticalAlignment = KAlignments.CenterVertically
) {
    KIcon(icon = KIcons.ArrowBack, color = KColors.OnSurface)
    KText(
        text = "Page Title",
        fontSize = 18,
        fontWeight = KFontWeights.SemiBold
    )
    KIcon(icon = KIcons.MoreVert, color = KColors.OnSurface)
}`,
      language: 'kotlin',
      subsections: [
        {
          id: 'row-props',
          title: 'KRow Parameters',
          table: {
            headers: ['Parameter', 'Type', 'Default', 'Description'],
            rows: [
              ['modifier', 'KModifier?', 'null', 'KModifier data class for sizing, padding, background, etc.'],
              ['horizontalArrangement', 'String?', 'null (Start)', 'Use KArrangements: .Start, .Center, .End, .SpaceBetween, .SpaceAround, .SpaceEvenly, .spacedBy(X)'],
              ['verticalAlignment', 'String?', 'null (Top)', 'Use KAlignments: .Top, .CenterVertically, .Bottom'],
            ],
          },
        },
        {
          id: 'row-weight',
          title: 'Child Weights',
          content: `Like KColumn, KRow children can use \`weight\` for proportional horizontal sizing:`,
          code: `KRow(modifier = KModifier(fillMaxWidth = 1f)) {
    KBox(
        modifier = KModifier(weight = 1f),
        contentAlignment = KAlignments.Center
    ) {
        KText("Left")
    }
    KBox(
        modifier = KModifier(weight = 2f),
        contentAlignment = KAlignments.Center
    ) {
        KText("Center (wider)")
    }
    KBox(
        modifier = KModifier(weight = 1f),
        contentAlignment = KAlignments.Center
    ) {
        KText("Right")
    }
}`,
          language: 'kotlin',
        },
      ],
    },

    // ── Box ──
    {
      id: 'box',
      title: 'KBox',
      content: `\`KBox\` stacks children on top of each other — equivalent to Compose's \`Box\`. Use it for overlays, badges, image + text overlaps, centering single children, etc.

> **Note:** Unlike KColumn and KRow, KBox does not distribute children — they are overlaid. Use \`contentAlignment\` to control how children are positioned within the box.`,
      code: `KBox(
    modifier = KModifier(size = 200, background = KColors.SurfaceVariant, cornerRadius = 12),
    contentAlignment = KAlignments.Center
) {
    KImage(
        source = KUrlImageSource("https://example.com/photo.jpg"),
        modifier = KModifier(fillMaxSize = 1f)
    )
    KText(
        text = "Overlay",
        color = KColors.OnPrimary,
        fontWeight = KFontWeights.Bold
    )
}`,
      language: 'kotlin',
      subsections: [
        {
          id: 'box-props',
          title: 'KBox Parameters',
          table: {
            headers: ['Parameter', 'Type', 'Default', 'Description'],
            rows: [
              ['modifier', 'KModifier?', 'null', 'KModifier data class for sizing, padding, background, etc.'],
              ['contentAlignment', 'String?', 'null (TopStart)', 'Use KAlignments: .TopStart, .TopCenter, .TopEnd, .CenterStart, .Center, .CenterEnd, .BottomStart, .BottomCenter, .BottomEnd'],
            ],
          },
        },
      ],
    },

    // ── LazyColumn ──
    {
      id: 'lazy-column',
      title: 'KLazyColumn',
      content: `\`KLazyColumn\` renders a vertically-scrolling list with lazy composition — only visible items are rendered. Equivalent to Compose's \`LazyColumn\`.

The content lambda receives \`KLazyListScope\`, which provides \`item { }\`, \`items(list) { }\`, and \`itemsIndexed(list) { }\` for building list items.`,
      code: `KLazyColumn(
    modifier = KModifier(fillMaxSize = 1f),
    verticalArrangement = KArrangements.spacedBy(8),
    contentPadding = KPadding(all = 16)
) {
    item {
        KText("Header", fontWeight = KFontWeights.Bold, fontSize = 20)
    }
    items(userList) { user ->
        KCard(modifier = KModifier(fillMaxWidth = 1f, padding = 8)) {
            KText(user.name, fontWeight = KFontWeights.SemiBold)
            KText(user.email, color = KColors.OnSurfaceVariant)
        }
    }
    itemsIndexed(userList) { index, user ->
        KRow(verticalAlignment = KAlignments.CenterVertically) {
            KText("\${index + 1}.", color = KColors.Primary)
            KSpacer(width = 4)
            KText(user.name)
        }
    }
    items(count = 10) { i ->
        KText("Placeholder #\$i")
    }
}`,
      language: 'kotlin',
      subsections: [
        {
          id: 'lazy-column-props',
          title: 'KLazyColumn Parameters',
          table: {
            headers: ['Parameter', 'Type', 'Default', 'Description'],
            rows: [
              ['modifier', 'KModifier?', 'null', 'KModifier data class for sizing, padding, background, etc.'],
              ['verticalArrangement', 'String?', 'null (Top)', 'Use KArrangements constants or .spacedBy(X) for item spacing (Int dp).'],
              ['horizontalAlignment', 'String?', 'null (Start)', 'Use KAlignments: .Start, .CenterHorizontally, .End'],
              ['userScrollEnabled', 'Boolean?', 'true', 'Whether the user can scroll the list.'],
              ['reverseLayout', 'Boolean?', 'false', 'When true, items are laid out bottom-to-top (like a chat).'],
              ['contentPadding', 'Int?', 'null', 'Padding around the content in dp (e.g. 16). Use KPadding for directional padding.'],
              ['beyondBoundsItemCount', 'Int?', 'null', 'Number of items to compose beyond the visible bounds.'],
            ],
          },
        },
        {
          id: 'lazy-list-scope',
          title: 'KLazyListScope Methods',
          content: `The \`KLazyListScope\` provides the following item builder methods:`,
          table: {
            headers: ['Method', 'Description'],
            rows: [
              ['item { }', 'Adds a single static item. Content lambda receives KUniversalScope.'],
              ['items(list) { item -> }', 'Adds one item per element in the list.'],
              ['itemsIndexed(list) { index, item -> }', 'Adds one item per element, with its index.'],
              ['items(array) { item -> }', 'Adds one item per element in an array.'],
              ['items(count) { index -> }', 'Adds count items by index.'],
            ],
          },
        },
      ],
    },

    // ── LazyRow ──
    {
      id: 'lazy-row',
      title: 'KLazyRow',
      content: `\`KLazyRow\` renders a horizontally-scrolling list with lazy composition. Equivalent to Compose's \`LazyRow\`. Great for carousels, horizontal card lists, and chip groups.

Like \`KLazyColumn\`, the content lambda receives \`KLazyListScope\`.`,
      code: `KLazyRow(
    modifier = KModifier(fillMaxWidth = 1f, height = 120),
    horizontalArrangement = KArrangements.spacedBy(12),
    contentPadding = KPadding(all = 8)
) {
    items(cardList) { card ->
        KCard(
            modifier = KModifier(width = 160),
            elevation = 4,
            shape = KShapes.Medium
        ) {
            KColumn(modifier = KModifier(padding = 12)) {
                KText(card.title, fontWeight = KFontWeights.SemiBold)
                KSpacer(height = 4)
                KText(card.subtitle, color = KColors.OnSurfaceVariant, fontSize = 12)
            }
        }
    }
}`,
      language: 'kotlin',
      subsections: [
        {
          id: 'lazy-row-props',
          title: 'KLazyRow Parameters',
          table: {
            headers: ['Parameter', 'Type', 'Default', 'Description'],
            rows: [
              ['modifier', 'KModifier?', 'null', 'KModifier data class for sizing, padding, background, etc.'],
              ['horizontalArrangement', 'String?', 'null (Start)', 'Use KArrangements constants or .spacedBy(X) for item spacing (Int dp).'],
              ['verticalAlignment', 'String?', 'null (Top)', 'Use KAlignments: .Top, .CenterVertically, .Bottom'],
              ['userScrollEnabled', 'Boolean?', 'true', 'Whether the user can scroll the list.'],
              ['reverseLayout', 'Boolean?', 'false', 'When true, items are laid out end-to-start.'],
              ['contentPadding', 'Int?', 'null', 'Padding around the content in dp (e.g. 8). Use KPadding for directional padding.'],
              ['beyondBoundsItemCount', 'Int?', 'null', 'Number of items to compose beyond the visible bounds.'],
            ],
          },
        },
      ],
    },

    // ── Spacer ──
    {
      id: 'spacer',
      title: 'KSpacer',
      content: `\`KSpacer\` creates empty space between siblings. Use it to add fixed or weighted gaps in KColumn and KRow layouts.`,
      code: `// Fixed-size spacer
KColumn {
    KText("Above")
    KSpacer(height = 24)
    KText("Below")
}

// Weighted spacer (push content apart)
KColumn(modifier = KModifier(fillMaxSize = 1f)) {
    KText("Top")
    KSpacer(modifier = KModifier(weight = 1f))
    KButton(onClick = { /* action */ }) {
        KText("Bottom Button")
    }
}

// Horizontal spacer in a Row
KRow(modifier = KModifier(fillMaxWidth = 1f)) {
    KIcon(icon = KIcons.Home)
    KSpacer(width = 8)
    KText("Home")
}`,
      language: 'kotlin',
    },

    // ── Nesting ──
    {
      id: 'nesting',
      title: 'Nesting Layouts',
      content: `Layouts can be freely nested to create complex UI structures. Combine KColumn, KRow, KBox, and lazy layouts to build any screen design.`,
      code: `KColumn(modifier = KModifier(fillMaxSize = 1f, padding = 16)) {
    // Top bar
    KRow(
        modifier = KModifier(fillMaxWidth = 1f),
        horizontalArrangement = KArrangements.SpaceBetween,
        verticalAlignment = KAlignments.CenterVertically
    ) {
        KText("Dashboard", fontSize = 24, fontWeight = KFontWeights.Bold)
        KIcon(icon = KIcons.Notifications, color = KColors.OnSurface)
    }

    KSpacer(height = 16)

    // Scrollable content
    KLazyColumn(
        modifier = KModifier(weight = 1f, fillMaxWidth = 1f),
        verticalArrangement = KArrangements.spacedBy(12)
    ) {
        items(stats) { stat ->
            KCard(
                modifier = KModifier(fillMaxWidth = 1f),
                elevation = 2,
                shape = KShapes.Medium
            ) {
                KRow(
                    modifier = KModifier(padding = 12),
                    verticalAlignment = KAlignments.CenterVertically
                ) {
                    KIcon(
                        icon = stat.icon,
                        modifier = KModifier(size = 40),
                        color = KColors.Primary
                    )
                    KSpacer(width = 12)
                    KColumn {
                        KText(stat.label, fontWeight = KFontWeights.SemiBold)
                        KText(stat.value, fontSize = 20, fontWeight = KFontWeights.Bold)
                    }
                }
            }
        }
    }
}`,
      language: 'kotlin',
    },

    // ── KModifier reference ──
    {
      id: 'modifier-reference',
      title: 'KModifier Properties',
      content: `All layouts accept a \`KModifier\` data class instance. Create one by passing named parameters for sizing, padding, background, and more:`,
      code: `// Example: combined modifier
val myModifier = KModifier(
    fillMaxWidth = 1f,
    padding = 16,
    background = KColors.Surface,
    cornerRadius = 12,
    border = KBorder(width = 1, color = KColors.Outline)
)

KColumn(modifier = myModifier) {
    KText("Styled column")
}`,
      language: 'kotlin',
      subsections: [
        {
          id: 'modifier-methods',
          title: 'KModifier Properties',
          table: {
            headers: ['Property', 'Type', 'Example', 'Description'],
            rows: [
              ['fillMaxSize', 'Float?', 'fillMaxSize = 1f', 'Fill available width and height (fraction 0f–1f)'],
              ['fillMaxWidth', 'Float?', 'fillMaxWidth = 1f', 'Fill available width (fraction 0f–1f)'],
              ['fillMaxHeight', 'Float?', 'fillMaxHeight = 1f', 'Fill available height (fraction 0f–1f)'],
              ['width', 'Int?', 'width = 200', 'Fixed width in dp'],
              ['height', 'Int?', 'height = 100', 'Fixed height in dp'],
              ['size', 'Int?', 'size = 48', 'Fixed width and height in dp'],
              ['padding', 'Int?', 'padding = 16', 'Uniform padding in dp'],
              ['weight', 'Float?', 'weight = 1f', 'Proportional weight inside KColumn/KRow'],
              ['background', 'String?', 'background = KColors.Primary', 'Background color (hex string or KColors reference)'],
              ['cornerRadius', 'Int?', 'cornerRadius = 12', 'Corner radius in dp'],
              ['border', 'KBorder?', 'border = KBorder(width = 1, color = KColors.Outline)', 'Border via KBorder data class'],
            ],
          },
        },
      ],
    },
  ],
  relatedReference: ['KUniversalScope', 'KLazyListScope', 'TopLevelBuilders', 'KColumnProps', 'KRowProps', 'KBoxProps', 'KNode', 'KModifier'],
  nextDoc: null,
  prevDoc: 'initialization',
}

export default layoutsDoc
