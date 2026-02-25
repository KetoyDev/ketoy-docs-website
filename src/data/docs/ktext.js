/**
 * Ketoy Documentation – Widgets: KText
 * Covers: KText DSL builder inside KUniversalScope
 */

const kTextDoc = {
  id: 'ktext',
  title: 'KText',
  description: 'The KText DSL builder adds text nodes to your Ketoy UI. Supports fontSize, fontWeight, color, textAlign, and other Material 3 typography properties.',
  icon: 'FaFont',
  order: 3,
  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content: `\`KText\` is the primary text builder in the Ketoy DSL. It is available inside any \`KUniversalScope\` content lambda (e.g. inside \`KColumn\`, \`KRow\`, \`KCard\`, etc.) and maps directly to Jetpack Compose's \`Text\` composable.

Use \`KText\` to display labels, headings, paragraphs, and any other text content in your server-driven UI.`,
    },
    {
      id: 'basic-usage',
      title: 'Basic Usage',
      content: `Pass just a string to create a simple text node:`,
      code: `KColumn {
    KText("Hello, World!")
    KText("Welcome to Ketoy")
}`,
      language: 'kotlin',
    },
    {
      id: 'signature',
      title: 'Full Signature',
      content: `The complete \`KText\` signature with all parameters:`,
      code: `fun KText(
    text: String,
    modifier: KModifier? = null,
    fontSize: Int? = null,
    fontWeight: String? = null,
    color: String? = null,
    textAlign: String? = null,
    maxLines: Int? = null,
    overflow: String? = null,
    letterSpacing: Float? = null,
    lineHeight: Float? = null
)`,
      language: 'kotlin',
    },
    {
      id: 'parameters',
      title: 'Parameters',
      table: {
        headers: ['Parameter', 'Type', 'Default', 'Description'],
        rows: [
          ['text', 'String', '—', 'The text content to display.'],
          ['modifier', 'KModifier?', 'null', 'Layout modifier using KModifier(...).'],
          ['fontSize', 'Int?', 'null', 'Font size in sp (e.g. 24 for 24sp). Null uses the theme default.'],
          ['fontWeight', 'String?', 'null', 'Use KFontWeights constants: KFontWeights.Bold, .SemiBold, .Medium, .Normal, .Light'],
          ['color', 'String?', 'null', 'Text color as hex or KColors reference (e.g. KColors.Primary, KColors.OnSurface).'],
          ['textAlign', 'String?', 'null', 'Use KTextAlign constants: KTextAlign.Start, .Center, .End, .Justify'],
          ['maxLines', 'Int?', 'null', 'Maximum number of lines. Text is truncated with ellipsis if exceeded.'],
          ['overflow', 'String?', 'null', 'Use KTextOverflow constants: KTextOverflow.Ellipsis, .Clip, .Visible'],
          ['letterSpacing', 'Float?', 'null', 'Letter spacing in sp (e.g. 0.5).'],
          ['lineHeight', 'Float?', 'null', 'Line height in sp (e.g. 22).'],
        ],
      },
    },
    {
      id: 'styling',
      title: 'Styling Examples',
      content: `Common styling patterns for text:`,
      code: `KColumn(modifier = KModifier(padding = 16)) {
    // Heading
    KText(
        text = "Dashboard",
        fontSize = 28,
        fontWeight = KFontWeights.Bold,
        color = KColors.Primary
    )

    // Subtitle
    KText(
        text = "Your analytics overview",
        fontSize = 14,
        color = KColors.OnSurfaceVariant
    )

    // Centered text
    KText(
        text = "Welcome back!",
        fontSize = 18,
        textAlign = KTextAlign.Center,
        modifier = KModifier(fillMaxWidth = 1f)
    )

    // Truncated text
    KText(
        text = "This is a very long paragraph that might not fit on a single line...",
        maxLines = 2,
        overflow = KTextOverflow.Ellipsis,
        lineHeight = 22
    )
}`,
      language: 'kotlin',
    },
    {
      id: 'with-modifier',
      title: 'Using KModifier',
      content: `\`KText\` accepts a \`KModifier\` for layout control:`,
      code: `KText(
    text = "Padded & clickable",
    modifier = KModifier(
        padding = 12,
        fillMaxWidth = 1f,
        background = KColors.PrimaryContainer,
        cornerRadius = 8
    ),
    color = KColors.OnPrimaryContainer,
    fontSize = 16
)`,
      language: 'kotlin',
    },
    {
      id: 'kcolors',
      title: 'Theme Colors',
      content: `Use \`KColors\` constants for Material 3 theme-aware colors:`,
      code: `KText("Primary", color = KColors.Primary)
KText("On Surface", color = KColors.OnSurface)
KText("Error", color = KColors.Error)
KText("On Surface Variant", color = KColors.OnSurfaceVariant)
KText("Tertiary", color = KColors.Tertiary)`,
      language: 'kotlin',
    },
  ],
  relatedReference: ['KUniversalScope', 'KModifier', 'KColors', 'KFontWeights', 'KTextAlign', 'KTextOverflow'],
  nextDoc: 'kbutton',
  prevDoc: 'production-release',
}

export default kTextDoc
