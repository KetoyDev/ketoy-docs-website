/**
 * Ketoy Documentation – Widgets: KImage & KIcon
 * Covers: Media widgets in KUniversalScope
 */

const kMediaDoc = {
  id: 'kmedia',
  title: 'KImage & KIcon',
  description: 'Display images from multiple sources using KImageSource, and Material icons using KIcon/KIconRef in your Ketoy server-driven UI.',
  icon: 'FaImage',
  order: 7,
  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content: `Ketoy provides two builders for visual media:

- **KImage** — loads and displays an image from a \`KImageSource\` (URL, resource, base64, or icon)
- **KIcon** — renders a Material icon by name or typed \`KIconRef\`

Both are available inside any \`KUniversalScope\` content lambda.`,
    },
    {
      id: 'kimage-signature',
      title: 'KImage – Signature',
      code: `fun KImage(
    source: KImageSource,
    modifier: KModifier? = null,
    contentDescription: String? = null,
    scaleType: String? = KScaleType.FitCenter
)`,
      language: 'kotlin',
    },
    {
      id: 'kimage-params',
      title: 'KImage – Parameters',
      table: {
        headers: ['Parameter', 'Type', 'Default', 'Description'],
        rows: [
          ['source', 'KImageSource', '—', 'Image source: KUrlImageSource, KResImageSource, KBase64ImageSource, or KIconImageSource.'],
          ['modifier', 'KModifier?', 'null', 'Layout modifier.'],
          ['contentDescription', 'String?', 'null', 'Accessibility description.'],
          ['scaleType', 'String?', 'KScaleType.FitCenter', 'Scale type using KScaleType constants.'],
        ],
      },
    },
    {
      id: 'kimagesource',
      title: 'KImageSource Types',
      content: `\`KImageSource\` is a sealed class with four implementations:`,
      code: `// URL-based image (loaded via Coil)
KUrlImageSource(value = "https://example.com/photo.jpg")

// Android resource image
KResImageSource(value = "ic_launcher")

// Base64 encoded image
KBase64ImageSource(value = "iVBORw0KGgo...")

// Icon as image source
KIconImageSource(value = "Favorite", style = "filled")`,
      language: 'kotlin',
    },
    {
      id: 'kscaletype',
      title: 'KScaleType Reference',
      content: `\`KScaleType\` provides constants for image scaling:`,
      table: {
        headers: ['Constant', 'Description'],
        rows: [
          ['KScaleType.FitCenter', 'Scale to fit within bounds, centered (default).'],
          ['KScaleType.CenterCrop', 'Scale to fill bounds, cropping if needed.'],
          ['KScaleType.FillBounds', 'Stretch to fill bounds exactly.'],
          ['KScaleType.Inside', 'Scale down to fit, never scale up.'],
          ['KScaleType.FillWidth', 'Scale to fill width, maintaining aspect ratio.'],
          ['KScaleType.FillHeight', 'Scale to fill height, maintaining aspect ratio.'],
        ],
      },
    },
    {
      id: 'kimage-examples',
      title: 'KImage – Examples',
      code: `// URL image
KImage(
    source = KUrlImageSource("https://example.com/photo.jpg"),
    contentDescription = "User avatar",
    scaleType = KScaleType.CenterCrop,
    modifier = KModifier(size = 80, cornerRadius = 40)
)

// Full-width banner
KImage(
    source = KUrlImageSource("https://example.com/banner.jpg"),
    contentDescription = "Banner",
    scaleType = KScaleType.CenterCrop,
    modifier = KModifier(fillMaxWidth = 1f, height = 200, cornerRadius = 12)
)

// Resource image
KImage(
    source = KResImageSource("ic_placeholder"),
    modifier = KModifier(width = 120, height = 120)
)

// Icon as image
KImage(
    source = KIconImageSource("Star", style = "filled"),
    modifier = KModifier(size = 48)
)`,
      language: 'kotlin',
    },
    {
      id: 'kicon-signature',
      title: 'KIcon – Signature',
      content: `\`KIcon\` has two overloads — one for string icon names and one for typed \`KIconRef\`:`,
      code: `// String-based icon
fun KIcon(
    icon: String,
    modifier: KModifier? = null,
    size: Int? = null,
    color: String? = null,
    style: String? = null,
    contentDescription: String? = null
)

// KIconRef-based icon
fun KIcon(
    icon: KIconRef,
    modifier: KModifier? = null,
    size: Int? = null,
    color: String? = null,
    contentDescription: String? = null
)`,
      language: 'kotlin',
    },
    {
      id: 'kicon-params',
      title: 'KIcon – Parameters',
      table: {
        headers: ['Parameter', 'Type', 'Default', 'Description'],
        rows: [
          ['icon', 'String / KIconRef', '—', 'Material icon name or typed KIconRef from KIcons.'],
          ['modifier', 'KModifier?', 'null', 'Layout modifier.'],
          ['size', 'Int?', 'null', 'Icon size in dp.'],
          ['color', 'String?', 'null', 'Icon tint color (hex or KColors reference).'],
          ['style', 'String?', 'null', 'Icon style ("outlined", "filled", "rounded", "sharp", "twoTone"). Only for String overload.'],
          ['contentDescription', 'String?', 'null', 'Accessibility description.'],
        ],
      },
    },
    {
      id: 'kicons-inner-classes',
      title: 'KIcons – Styled Icon Classes',
      content: `\`KIcons\` provides inner classes for accessing Material icons by style. Each returns a typed \`KIconRef(name, style)\`:`,
      code: `// Default (string shorthand)
KIcon(icon = KIcons.Home)

// Filled icons
KIcon(icon = KIcons.Filled.Favorite)

// Outlined icons
KIcon(icon = KIcons.Outlined.Home)

// Rounded icons
KIcon(icon = KIcons.Rounded.Search)

// Sharp icons
KIcon(icon = KIcons.Sharp.Star)

// TwoTone icons
KIcon(icon = KIcons.TwoTone.Settings)`,
      language: 'kotlin',
    },
    {
      id: 'kicons-classes-table',
      title: 'KIcons Style Classes',
      table: {
        headers: ['Class', 'Returns', 'Description'],
        rows: [
          ['KIcons.Filled', 'KIconRef', 'Filled style Material icons — solid appearance.'],
          ['KIcons.Outlined', 'KIconRef', 'Outlined style — stroke/outline appearance.'],
          ['KIcons.Rounded', 'KIconRef', 'Rounded style — softer, rounded corners.'],
          ['KIcons.Sharp', 'KIconRef', 'Sharp style — crisp, angular corners.'],
          ['KIcons.TwoTone', 'KIconRef', 'TwoTone style — two-color fill.'],
        ],
      },
    },
    {
      id: 'kicon-examples',
      title: 'KIcon – Examples',
      code: `// Default icon
KIcon(icon = KIcons.Home, contentDescription = "Home")

// Colored icon
KIcon(
    icon = KIcons.Favorite,
    color = KColors.Error,
    size = 32
)

// Styled icon using inner class
KIcon(
    icon = KIcons.Outlined.Notifications,
    color = KColors.Primary,
    size = 24
)

// Icon in a row
KRow(
    modifier = KModifier(padding = 12),
    horizontalArrangement = spacedBy(8),
    verticalAlignment = KAlignment.CenterVertically
) {
    KIcon(icon = KIcons.Star, color = "#FFD700", size = 20)
    KText("4.8", fontSize = 16, fontWeight = KFontWeights.SemiBold)
    KText("(128 reviews)", fontSize = 12, color = KColors.OnSurfaceVariant)
}`,
      language: 'kotlin',
    },
    {
      id: 'avatar-pattern',
      title: 'Common Pattern: Avatar',
      content: `Combine \`KImage\` with \`KBox\` for avatar + badge patterns:`,
      code: `KBox(modifier = KModifier(size = 56)) {
    KImage(
        source = KUrlImageSource(userAvatarUrl),
        contentDescription = "Profile",
        scaleType = KScaleType.CenterCrop,
        modifier = KModifier(fillMaxSize = 1f, cornerRadius = 28)
    )
    // Online indicator
    KBox(
        modifier = KModifier(
            size = 14,
            background = "#4CAF50",
            cornerRadius = 7,
            border = KBorder(width = 2, color = KColors.Surface)
        ),
        contentAlignment = KAlignment.BottomEnd
    ) {}
}`,
      language: 'kotlin',
    },
    {
      id: 'icon-list',
      title: 'Available Icons',
      content: `KIcon uses Material Symbols names. Common icons include:

**Navigation:** Home, ArrowBack, ArrowForward, Menu, Close, ChevronRight, ExpandMore, ExpandLess

**Actions:** Search, Add, Delete, Edit, Share, Download, Upload, Refresh, Settings, MoreVert

**Content:** Favorite, Star, Bookmark, Notifications, Email, Chat, Phone, Person, Group

**Media:** PlayArrow, Pause, SkipNext, VolumeUp, CameraAlt, Image

**Status:** CheckCircle, Error, Warning, Info, Help

Each icon can be accessed via \`KIcons.IconName\` (string shorthand) or \`KIcons.Filled.IconName\`, \`KIcons.Outlined.IconName\`, etc. (typed KIconRef).

Refer to [Material Symbols](https://fonts.google.com/icons) for the full catalog.`,
    },
  ],
  relatedReference: ['KUniversalScope', 'KModifier', 'KImageSource', 'KScaleType', 'KIcons', 'KIconRef'],
  nextDoc: 'kinput',
  prevDoc: 'kcard',
}

export default kMediaDoc
