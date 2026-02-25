/**
 * Ketoy Documentation – Widgets: KColumn, KRow, KBox
 * Covers: Layout containers in KUniversalScope
 */

const kLayoutDoc = {
  id: 'klayout',
  title: 'KColumn, KRow & KBox',
  description: 'Core layout containers in the Ketoy DSL. KColumn stacks children vertically, KRow horizontally, and KBox overlays children on top of each other.',
  icon: 'FaThLarge',
  order: 5,
  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content: `Ketoy provides three fundamental layout containers that mirror Jetpack Compose:

- **KColumn** — arranges children vertically (top to bottom)
- **KRow** — arranges children horizontally (start to end)
- **KBox** — overlays children on top of each other (z-stacking)

All three are available inside any \`KUniversalScope\` content lambda and accept a trailing lambda for nested content.`,
    },
    {
      id: 'kcolumn',
      title: 'KColumn',
      content: `\`KColumn\` stacks children vertically. Use \`verticalArrangement\` and \`horizontalAlignment\` to control positioning.`,
      code: `fun KColumn(
    modifier: KModifier? = null,
    verticalArrangement: String? = null,
    horizontalAlignment: String? = null,
    content: KUniversalScope.() -> Unit
)`,
      language: 'kotlin',
    },
    {
      id: 'kcolumn-params',
      title: 'KColumn – Parameters',
      table: {
        headers: ['Parameter', 'Type', 'Default', 'Description'],
        rows: [
          ['modifier', 'KModifier?', 'null', 'Layout modifier.'],
          ['verticalArrangement', 'String?', 'null', 'KArrangements.Top, .Center, .Bottom, .SpaceBetween, .SpaceAround, .SpaceEvenly, or spacedBy(Int).'],
          ['horizontalAlignment', 'String?', 'null', 'KAlignment.Start, .CenterHorizontally, .End.'],
          ['content', 'KUniversalScope.() -> Unit', '—', 'Child content lambda.'],
        ],
      },
    },
    {
      id: 'kcolumn-example',
      title: 'KColumn – Example',
      code: `KColumn(
    modifier = KModifier(fillMaxSize = 1f, padding = 16),
    verticalArrangement = spacedBy(12),
    horizontalAlignment = KAlignment.CenterHorizontally
) {
    KText("Title", fontSize = 24, fontWeight = KFontWeights.Bold)
    KText("Subtitle", fontSize = 14, color = KColors.OnSurfaceVariant)
    KButton(onClick = { getStarted() }) {
        KText("Get Started")
    }
}`,
      language: 'kotlin',
    },
    {
      id: 'krow',
      title: 'KRow',
      content: `\`KRow\` arranges children horizontally. Use \`horizontalArrangement\` and \`verticalAlignment\` to control positioning.`,
      code: `fun KRow(
    modifier: KModifier? = null,
    horizontalArrangement: String? = null,
    verticalAlignment: String? = null,
    content: KUniversalScope.() -> Unit
)`,
      language: 'kotlin',
    },
    {
      id: 'krow-params',
      title: 'KRow – Parameters',
      table: {
        headers: ['Parameter', 'Type', 'Default', 'Description'],
        rows: [
          ['modifier', 'KModifier?', 'null', 'Layout modifier.'],
          ['horizontalArrangement', 'String?', 'null', 'KArrangements.Start, .Center, .End, .SpaceBetween, .SpaceAround, .SpaceEvenly, or spacedBy(Int).'],
          ['verticalAlignment', 'String?', 'null', 'KAlignment.Top, .CenterVertically, .Bottom.'],
          ['content', 'KUniversalScope.() -> Unit', '—', 'Child content lambda.'],
        ],
      },
    },
    {
      id: 'krow-example',
      title: 'KRow – Example',
      code: `KRow(
    modifier = KModifier(fillMaxWidth = 1f, padding = 12),
    horizontalArrangement = KArrangements.SpaceBetween,
    verticalAlignment = KAlignment.CenterVertically
) {
    KText("Settings", fontSize = 18, fontWeight = KFontWeights.SemiBold)
    KIconButton(
        icon = KIcons.ChevronRight,
        onClick = { openSettings() }
    )
}`,
      language: 'kotlin',
    },
    {
      id: 'kbox',
      title: 'KBox',
      content: `\`KBox\` overlays children on top of each other (z-order). Use \`contentAlignment\` to position all children within the box.`,
      code: `fun KBox(
    modifier: KModifier? = null,
    contentAlignment: String? = null,
    content: KUniversalScope.() -> Unit
)`,
      language: 'kotlin',
    },
    {
      id: 'kbox-params',
      title: 'KBox – Parameters',
      table: {
        headers: ['Parameter', 'Type', 'Default', 'Description'],
        rows: [
          ['modifier', 'KModifier?', 'null', 'Layout modifier.'],
          ['contentAlignment', 'String?', 'null', 'KAlignment.TopStart, .TopCenter, .TopEnd, .CenterStart, .Center, .CenterEnd, .BottomStart, .BottomCenter, .BottomEnd.'],
          ['content', 'KUniversalScope.() -> Unit', '—', 'Child content lambda.'],
        ],
      },
    },
    {
      id: 'kbox-example',
      title: 'KBox – Example',
      content: `Overlay a badge on top of an image:`,
      code: `KBox(
    modifier = KModifier(size = 200),
    contentAlignment = KAlignment.TopEnd
) {
    KImage(
        source = KUrlImageSource("https://example.com/photo.jpg"),
        contentDescription = "Profile photo",
        modifier = KModifier(fillMaxSize = 1f, cornerRadius = 16)
    )
    KText(
        text = "NEW",
        fontSize = 10,
        fontWeight = KFontWeights.Bold,
        color = KColors.OnPrimary,
        modifier = KModifier(
            background = KColors.Primary,
            cornerRadius = 4,
            padding = 4
        )
    )
}`,
      language: 'kotlin',
    },
    {
      id: 'nested',
      title: 'Nesting Layouts',
      content: `Layouts can be nested freely to create complex UIs:`,
      code: `KColumn(
    modifier = KModifier(fillMaxSize = 1f, padding = 16),
    verticalArrangement = spacedBy(16)
) {
    // Header row
    KRow(
        modifier = KModifier(fillMaxWidth = 1f),
        horizontalArrangement = KArrangements.SpaceBetween,
        verticalAlignment = KAlignment.CenterVertically
    ) {
        KText("Home", fontSize = 24, fontWeight = KFontWeights.Bold)
        KIconButton(icon = KIcons.Notifications, onClick = { showNotifications() })
    }

    // Content area
    KColumn(verticalArrangement = spacedBy(8)) {
        KText("Recent Activity", fontSize = 16, fontWeight = KFontWeights.SemiBold)
        KCard(modifier = KModifier(fillMaxWidth = 1f)) {
            KText("No recent activity", modifier = KModifier(padding = 16))
        }
    }
}`,
      language: 'kotlin',
    },
    {
      id: 'arrangements',
      title: 'Arrangements & Alignment',
      content: `\`KArrangements\` and \`KAlignment\` control child positioning:`,
      table: {
        headers: ['Constant', 'Applicable To', 'Description'],
        rows: [
          ['KArrangements.Top', 'KColumn', 'Pack children at the top.'],
          ['KArrangements.Center', 'KColumn / KRow', 'Center children along the main axis.'],
          ['KArrangements.Bottom', 'KColumn', 'Pack children at the bottom.'],
          ['KArrangements.Start', 'KRow', 'Pack children at the start.'],
          ['KArrangements.End', 'KRow', 'Pack children at the end.'],
          ['KArrangements.SpaceBetween', 'KColumn / KRow', 'Equal space between children.'],
          ['KArrangements.SpaceAround', 'KColumn / KRow', 'Equal space around children.'],
          ['KArrangements.SpaceEvenly', 'KColumn / KRow', 'Equal space between and around children.'],
          ['spacedBy(dp: Int)', 'KColumn / KRow', 'Fixed spacing between children (e.g. spacedBy(8)).'],
          ['KAlignment.CenterHorizontally', 'KColumn', 'Center children horizontally.'],
          ['KAlignment.CenterVertically', 'KRow', 'Center children vertically.'],
        ],
      },
    },
  ],
  relatedReference: ['KUniversalScope', 'KModifier', 'KArrangements', 'KAlignment'],
  nextDoc: 'kcard',
  prevDoc: 'kbutton',
}

export default kLayoutDoc
