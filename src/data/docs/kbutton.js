/**
 * Ketoy Documentation – Widgets: KButton & KIconButton
 * Covers: KButton and KIconButton DSL builders inside KUniversalScope
 */

const kButtonDoc = {
  id: 'kbutton',
  title: 'KButton & KIconButton',
  description: 'Interactive button builders in the Ketoy DSL. KButton renders a Material 3 button with a content lambda; KIconButton renders an icon-only tappable area.',
  icon: 'FaBolt',
  order: 4,
  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content: `\`KButton\` and \`KIconButton\` are the primary interactive builders in the Ketoy DSL. They are available inside any \`KUniversalScope\` content lambda and map to the Material 3 Button and IconButton composables respectively.

**Important:** \`onClick\` is a native Kotlin \`() -> Unit\` lambda — it is **not** server-driven. Changing onClick behaviour requires a Play Store update. However, you can use \`actionId\` to dynamically switch the handler at runtime by mapping function IDs via the \`ActionRegistry\`.`,
    },
    {
      id: 'kbutton-basic',
      title: 'KButton – Basic Usage',
      content: `KButton uses a \`content\` lambda for its label. There is no \`text\` parameter — place KText inside the content lambda:`,
      code: `KButton(onClick = { /* handle click */ }) {
    KText("Click Me")
}`,
      language: 'kotlin',
    },
    {
      id: 'kbutton-signature',
      title: 'KButton – Signature',
      code: `fun KButton(
    modifier: KModifier? = null,
    onClick: (() -> Unit)? = null,
    enabled: Boolean = true,
    containerColor: String? = null,
    contentColor: String? = null,
    elevation: Int? = null,
    shape: String? = null,
    actionId: String? = null,
    content: KUniversalScope.() -> Unit = {}
)`,
      language: 'kotlin',
    },
    {
      id: 'kbutton-params',
      title: 'KButton – Parameters',
      table: {
        headers: ['Parameter', 'Type', 'Default', 'Description'],
        rows: [
          ['modifier', 'KModifier?', 'null', 'Layout modifier.'],
          ['onClick', '(() -> Unit)?', 'null', 'Native Kotlin click handler. Requires app update to change.'],
          ['enabled', 'Boolean', 'true', 'Whether the button is interactive.'],
          ['containerColor', 'String?', 'null', 'Background color (hex or KColors reference).'],
          ['contentColor', 'String?', 'null', 'Text/icon color inside the button.'],
          ['elevation', 'Int?', 'null', 'Shadow elevation in dp.'],
          ['shape', 'String?', 'null', 'Corner shape using KShapes (e.g. KShapes.Rounded12, KShapes.Circle).'],
          ['actionId', 'String?', 'null', 'Dynamic action ID registered in ActionRegistry. Allows server to switch onClick target.'],
          ['content', 'KUniversalScope.() -> Unit', '{}', 'Button label content — use KText, KIcon, KRow etc. inside.'],
        ],
      },
    },
    {
      id: 'kbutton-examples',
      title: 'KButton – Examples',
      content: `Different button styles and configurations:`,
      code: `KColumn(modifier = KModifier(padding = 16), verticalArrangement = spacedBy(12)) {
    // Standard button
    KButton(
        onClick = { saveData() },
        modifier = KModifier(fillMaxWidth = 1f)
    ) {
        KText("Save")
    }

    // Styled button with custom colors
    KButton(
        onClick = { cancel() },
        containerColor = KColors.SecondaryContainer,
        contentColor = KColors.OnSecondaryContainer,
        shape = KShapes.Rounded8
    ) {
        KText("Cancel")
    }

    // Button with icon and text
    KButton(
        onClick = { download() },
        containerColor = KColors.TertiaryContainer,
        contentColor = KColors.OnTertiaryContainer,
        shape = KShapes.Rounded12
    ) {
        KRow(horizontalArrangement = spacedBy(8), verticalAlignment = KAlignment.CenterVertically) {
            KIcon(icon = KIcons.Download, size = 18)
            KText("Download")
        }
    }

    // Disabled button
    KButton(enabled = false) {
        KText("Submit")
    }

    // Button with actionId for dynamic handler switching
    KButton(actionId = "primaryAction") {
        KText("Dynamic Action")
    }
}`,
      language: 'kotlin',
    },
    {
      id: 'kiconbutton-basic',
      title: 'KIconButton – Basic Usage',
      content: `\`KIconButton\` renders a tappable icon. It accepts either a \`String\` icon name or a typed \`KIconRef\`:`,
      code: `KIconButton(
    icon = KIcons.Favorite,
    onClick = { toggleFavorite() },
    contentDescription = "Toggle favorite"
)`,
      language: 'kotlin',
    },
    {
      id: 'kiconbutton-signature',
      title: 'KIconButton – Signature',
      code: `// String-based icon
fun KIconButton(
    icon: String = "",
    onClick: (() -> Unit)? = null,
    modifier: KModifier? = null,
    enabled: Boolean = true,
    iconSize: Int? = null,
    iconColor: String? = null,
    iconStyle: String? = null,
    containerColor: String? = null,
    contentColor: String? = null,
    disabledContainerColor: String? = null,
    disabledContentColor: String? = null,
    contentDescription: String? = null,
    actionId: String? = null,
    content: KUniversalScope.() -> Unit = {}
)

// KIconRef-based icon
fun KIconButton(
    icon: KIconRef,
    onClick: (() -> Unit)? = null,
    modifier: KModifier? = null,
    enabled: Boolean = true,
    iconSize: Int? = null,
    iconColor: String? = null,
    containerColor: String? = null,
    contentColor: String? = null,
    disabledContainerColor: String? = null,
    disabledContentColor: String? = null,
    contentDescription: String? = null,
    actionId: String? = null,
    content: KUniversalScope.() -> Unit = {}
)`,
      language: 'kotlin',
    },
    {
      id: 'kiconbutton-params',
      title: 'KIconButton – Parameters',
      table: {
        headers: ['Parameter', 'Type', 'Default', 'Description'],
        rows: [
          ['icon', 'String / KIconRef', '""', 'Icon name or typed KIconRef (e.g. KIcons.Outlined.Home).'],
          ['onClick', '(() -> Unit)?', 'null', 'Native Kotlin click handler.'],
          ['modifier', 'KModifier?', 'null', 'Layout modifier.'],
          ['enabled', 'Boolean', 'true', 'Whether the button is interactive.'],
          ['iconSize', 'Int?', 'null', 'Icon size in dp.'],
          ['iconColor', 'String?', 'null', 'Icon tint color (hex or KColors reference).'],
          ['iconStyle', 'String?', 'null', 'Icon style (e.g. "outlined", "filled"). Only for String-based overload.'],
          ['containerColor', 'String?', 'null', 'Background color of the button.'],
          ['contentColor', 'String?', 'null', 'Default content color.'],
          ['disabledContainerColor', 'String?', 'null', 'Background color when disabled.'],
          ['disabledContentColor', 'String?', 'null', 'Content color when disabled.'],
          ['contentDescription', 'String?', 'null', 'Accessibility description.'],
          ['actionId', 'String?', 'null', 'Dynamic action ID for ActionRegistry.'],
          ['content', 'KUniversalScope.() -> Unit', '{}', 'Optional custom content inside the button.'],
        ],
      },
    },
    {
      id: 'kiconbutton-examples',
      title: 'KIconButton – Examples',
      code: `KRow(
    modifier = KModifier(fillMaxWidth = 1f, padding = 8),
    horizontalArrangement = spacedBy(8)
) {
    KIconButton(
        icon = KIcons.ArrowBack,
        onClick = { navigateBack() },
        contentDescription = "Go back"
    )
    KIconButton(
        icon = KIcons.Share,
        iconColor = KColors.Primary,
        onClick = { share() }
    )
    KIconButton(
        icon = KIcons.Delete,
        iconColor = KColors.Error,
        onClick = { deleteItem() }
    )

    // Using KIconRef with styled icon
    KIconButton(
        icon = KIcons.Outlined.Settings,
        onClick = { openSettings() },
        iconSize = 28,
        containerColor = KColors.SurfaceVariant
    )
}`,
      language: 'kotlin',
    },
    {
      id: 'onclick-action-system',
      title: 'onClick & Action System',
      content: `\`onClick\` is a **native Kotlin lambda** (\`() -> Unit\`). It is compiled into the app binary, so changing it requires a Play Store update.

For dynamic action handling, use \`actionId\`:
- Register handlers in \`ActionRegistry\` at runtime
- The server can switch which \`actionId\` a button references
- Map custom functions and call them by their function ID

\`\`\`kotlin
// Register an action handler
ActionRegistry.register("refreshData") {
    viewModel.refresh()
}

// In the DSL — server controls which actionId to use
KButton(actionId = "refreshData") {
    KText("Refresh")
}
\`\`\`

You can also combine \`onClick\` with \`actionId\` — the \`actionId\` takes priority when set, falling back to \`onClick\`.`,
    },
  ],
  relatedReference: ['KUniversalScope', 'KModifier', 'KShapes', 'KColors', 'ActionRegistry'],
  nextDoc: 'klayout',
  prevDoc: 'ktext',
}

export default kButtonDoc
