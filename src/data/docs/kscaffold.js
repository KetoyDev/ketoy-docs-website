/**
 * Ketoy Documentation – Widgets: KScaffold, KTopAppBar, KBottomAppBar, KNavigationBar
 * Covers: Scaffold and app-level structure builders
 */

const kScaffoldDoc = {
  id: 'kscaffold',
  title: 'KScaffold & Navigation',
  description: 'KScaffold provides the Material 3 screen structure with scope-based slots for top bar, bottom bar, FAB, and content. Navigation bars use scope lambdas with KNavigationBarItem.',
  icon: 'FaMobileAlt',
  order: 9,
  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content: `\`KScaffold\` is the top-level structure builder that provides the Material 3 screen layout with **scope-based slots**: topBar, bottomBar, floatingActionButton, snackbarHost, and content.

Related builders:
- **KTopAppBar** — title, navigationIcon, and actions are all **scope lambdas** (not strings)
- **KNavigationBar** — renders a bottom navigation bar using \`KNavigationScope\` with \`KNavigationBarItem\`
- **KNavigationRail** — side navigation rail using \`KNavigationRailScope\` with \`KNavigationRailItem\`
- **KFloatingActionButton** — a FAB with \`content\` lambda (not text/icon params)

All \`onClick\` handlers are native Kotlin \`() -> Unit\` lambdas.`,
    },
    {
      id: 'kscaffold-signature',
      title: 'KScaffold – Signature',
      code: `fun KScaffold(
    modifier: KModifier? = null,
    containerColor: String? = null,
    contentColor: String? = null,
    contentWindowInsets: String? = null,
    topBar: (KScaffoldScope.() -> Unit)? = null,
    bottomBar: (KScaffoldScope.() -> Unit)? = null,
    snackbarHost: (KScaffoldScope.() -> Unit)? = null,
    floatingActionButton: (KScaffoldScope.() -> Unit)? = null,
    floatingActionButtonPosition: String? = null,
    content: KUniversalScope.() -> Unit
)`,
      language: 'kotlin',
    },
    {
      id: 'kscaffold-params',
      title: 'KScaffold – Parameters',
      table: {
        headers: ['Parameter', 'Type', 'Default', 'Description'],
        rows: [
          ['modifier', 'KModifier?', 'null', 'Layout modifier.'],
          ['containerColor', 'String?', 'null', 'Scaffold background color.'],
          ['contentColor', 'String?', 'null', 'Default content color.'],
          ['contentWindowInsets', 'String?', 'null', 'Window insets using KWindowInsetsDefaults constants.'],
          ['topBar', '(KScaffoldScope.() -> Unit)?', 'null', 'Top app bar slot.'],
          ['bottomBar', '(KScaffoldScope.() -> Unit)?', 'null', 'Bottom bar slot (navigation bar, bottom app bar, etc.).'],
          ['snackbarHost', '(KScaffoldScope.() -> Unit)?', 'null', 'Snackbar host slot.'],
          ['floatingActionButton', '(KScaffoldScope.() -> Unit)?', 'null', 'FAB slot.'],
          ['floatingActionButtonPosition', 'String?', 'null', 'KFabPosition.Start, .Center, .End, .EndOverlay, .CenterDocked, .EndDocked.'],
          ['content', 'KUniversalScope.() -> Unit', '—', 'Main screen content.'],
        ],
      },
    },
    {
      id: 'kscaffold-example',
      title: 'KScaffold – Complete Example',
      content: `A complete scaffold with top bar, bottom navigation, FAB, and content. Note: title, navigationIcon, and actions are all **scope lambdas**:`,
      code: `KScaffold(
    topBar = {
        KTopAppBar(
            type = KTopAppBarType.Small,
            title = {
                KText("Home", fontWeight = KFontWeights.Bold)
            },
            navigationIcon = {
                KIconButton(
                    icon = KIcons.Menu,
                    onClick = { openDrawer() }
                )
            },
            actions = {
                KIconButton(icon = KIcons.Search, onClick = { openSearch() })
                KIconButton(icon = KIcons.MoreVert, onClick = { openMenu() })
            }
        )
    },
    bottomBar = {
        KNavigationBar {
            KNavigationBarItem(
                selected = true,
                onClick = { navigateTo("home") },
                icon = { KIcon(icon = KIcons.Home) },
                selectedIcon = { KIcon(icon = KIcons.Filled.Home) },
                label = { KText("Home") }
            )
            KNavigationBarItem(
                selected = false,
                onClick = { navigateTo("explore") },
                icon = { KIcon(icon = KIcons.Outlined.Explore) },
                selectedIcon = { KIcon(icon = KIcons.Filled.Explore) },
                label = { KText("Explore") }
            )
            KNavigationBarItem(
                selected = false,
                onClick = { navigateTo("profile") },
                icon = { KIcon(icon = KIcons.Outlined.Person) },
                selectedIcon = { KIcon(icon = KIcons.Filled.Person) },
                label = { KText("Profile") }
            )
        }
    },
    floatingActionButton = {
        KFloatingActionButton(onClick = { createNew() }) {
            KIcon(icon = KIcons.Add)
        }
    }
) {
    // Main content
    KColumn(
        modifier = KModifier(fillMaxSize = 1f, padding = 16),
        verticalArrangement = spacedBy(12)
    ) {
        KText("Welcome!", fontSize = 24, fontWeight = KFontWeights.Bold)
        KText("Your dashboard content goes here.", color = KColors.OnSurfaceVariant)
    }
}`,
      language: 'kotlin',
    },
    {
      id: 'ktopappbar',
      title: 'KTopAppBar',
      content: `\`KTopAppBar\` uses scope lambdas for \`title\`, \`navigationIcon\`, and \`actions\`. The \`type\` controls the Material 3 variant:`,
      code: `fun KTopAppBar(
    modifier: KModifier? = null,
    colors: KTopAppBarColors? = null,
    windowInsets: String? = null,
    scrollBehavior: String? = null,
    type: String? = KTopAppBarType.Small,
    expandedHeight: Int? = null,
    title: (KAppBarScope.() -> Unit)? = null,
    navigationIcon: (KAppBarScope.() -> Unit)? = null,
    actions: (KAppBarScope.() -> Unit)? = null
)`,
      language: 'kotlin',
    },
    {
      id: 'ktopappbar-params',
      title: 'KTopAppBar – Parameters',
      table: {
        headers: ['Parameter', 'Type', 'Default', 'Description'],
        rows: [
          ['type', 'String?', 'KTopAppBarType.Small', 'KTopAppBarType.Small, .CenterAligned, .Medium, .Large.'],
          ['title', '(KAppBarScope.() -> Unit)?', 'null', 'Title scope lambda — use KText inside.'],
          ['navigationIcon', '(KAppBarScope.() -> Unit)?', 'null', 'Leading icon scope — typically KIconButton.'],
          ['actions', '(KAppBarScope.() -> Unit)?', 'null', 'Trailing action icons scope — add KIconButton(s).'],
          ['colors', 'KTopAppBarColors?', 'null', 'Custom color overrides.'],
          ['scrollBehavior', 'String?', 'null', 'KTopAppBarScrollBehaviorDefaults: .PinnedScroll, .EnterAlwaysScroll, .ExitUntilCollapsedScroll.'],
          ['expandedHeight', 'Int?', 'null', 'Height in dp when expanded (Medium/Large types).'],
        ],
      },
    },
    {
      id: 'ktopappbar-types',
      title: 'KTopAppBar Types',
      content: `Material 3 provides four top app bar variants:`,
      code: `// Small (default)
KTopAppBar(type = KTopAppBarType.Small, title = { KText("Title") })

// Center aligned
KTopAppBar(type = KTopAppBarType.CenterAligned, title = { KText("Centered") })

// Medium — two-line with expanded height
KTopAppBar(type = KTopAppBarType.Medium, title = { KText("Medium Title") })

// Large — prominent header
KTopAppBar(type = KTopAppBarType.Large, title = { KText("Large Title") })`,
      language: 'kotlin',
    },
    {
      id: 'knavigationbar',
      title: 'KNavigationBar',
      content: `\`KNavigationBar\` uses \`KNavigationScope\` with \`KNavigationBarItem\`. Each item's icon, selectedIcon, and label are scope lambdas:`,
      code: `KNavigationBar(
    containerColor = KColors.Surface,
    contentColor = KColors.OnSurface
) {
    KNavigationBarItem(
        selected = currentTab == "home",
        onClick = { selectTab("home") },
        icon = { KIcon(icon = KIcons.Outlined.Home) },
        selectedIcon = { KIcon(icon = KIcons.Filled.Home) },
        label = { KText("Home") },
        alwaysShowLabel = true
    )
    KNavigationBarItem(
        selected = currentTab == "search",
        onClick = { selectTab("search") },
        icon = { KIcon(icon = KIcons.Outlined.Search) },
        selectedIcon = { KIcon(icon = KIcons.Filled.Search) },
        label = { KText("Search") }
    )
    KNavigationBarItem(
        selected = currentTab == "alerts",
        onClick = { selectTab("alerts") },
        icon = { KIcon(icon = KIcons.Outlined.Notifications) },
        selectedIcon = { KIcon(icon = KIcons.Filled.Notifications) },
        label = { KText("Alerts") }
    )
    KNavigationBarItem(
        selected = currentTab == "profile",
        onClick = { selectTab("profile") },
        icon = { KIcon(icon = KIcons.Outlined.Person) },
        selectedIcon = { KIcon(icon = KIcons.Filled.Person) },
        label = { KText("Profile") }
    )
}`,
      language: 'kotlin',
    },
    {
      id: 'knavigationbaritem-params',
      title: 'KNavigationBarItem – Parameters',
      table: {
        headers: ['Parameter', 'Type', 'Default', 'Description'],
        rows: [
          ['selected', 'Boolean', '—', 'Whether this item is currently selected.'],
          ['onClick', '() -> Unit', '—', 'Native Kotlin click handler.'],
          ['icon', 'scope lambda', '—', 'Icon displayed when not selected.'],
          ['selectedIcon', 'scope lambda', 'null', 'Icon displayed when selected. Defaults to icon.'],
          ['label', 'scope lambda', 'null', 'Text label below the icon.'],
          ['alwaysShowLabel', 'Boolean', 'false', 'Whether to always show the label (even when not selected).'],
          ['colors', 'KNavigationBarItemColors?', 'null', 'Custom color overrides.'],
        ],
      },
    },
    {
      id: 'knavigationrail',
      title: 'KNavigationRail',
      content: `\`KNavigationRail\` is ideal for wider screens (tablets). Uses \`KNavigationRailScope\` with \`KNavigationRailItem\`:`,
      code: `KRow(modifier = KModifier(fillMaxSize = 1f)) {
    KNavigationRail(
        header = {
            KFloatingActionButton(onClick = { create() }) {
                KIcon(icon = KIcons.Add)
            }
        }
    ) {
        KNavigationRailItem(
            selected = true,
            onClick = { navigateTo("home") },
            icon = { KIcon(icon = KIcons.Home) },
            label = { KText("Home") }
        )
        KNavigationRailItem(
            selected = false,
            onClick = { navigateTo("stats") },
            icon = { KIcon(icon = KIcons.Outlined.Analytics) },
            label = { KText("Stats") }
        )
        KNavigationRailItem(
            selected = false,
            onClick = { navigateTo("settings") },
            icon = { KIcon(icon = KIcons.Outlined.Settings) },
            label = { KText("Settings") }
        )
    }
    // Main content area
    KColumn(modifier = KModifier(fillMaxSize = 1f, padding = 16)) {
        KText("Dashboard", fontSize = 24, fontWeight = KFontWeights.Bold)
    }
}`,
      language: 'kotlin',
    },
    {
      id: 'kfab',
      title: 'KFloatingActionButton',
      content: `\`KFloatingActionButton\` uses a \`content\` lambda — there are no \`icon\` or \`text\` parameters:`,
      code: `fun KFloatingActionButton(
    modifier: KModifier? = null,
    onClick: (() -> Unit)? = null,
    shape: String? = null,
    containerColor: String? = null,
    contentColor: String? = null,
    elevation: KFloatingActionButtonElevation? = null,
    interactionSource: String? = null,
    type: String? = null,
    content: KUniversalScope.() -> Unit = {}
)`,
      language: 'kotlin',
    },
    {
      id: 'kfab-params',
      title: 'KFloatingActionButton – Parameters',
      table: {
        headers: ['Parameter', 'Type', 'Default', 'Description'],
        rows: [
          ['onClick', '(() -> Unit)?', 'null', 'Native Kotlin click handler.'],
          ['shape', 'String?', 'null', 'Shape using KShapes constants.'],
          ['containerColor', 'String?', 'null', 'Background color (default: KScaffoldDefaults.FabContainerColor).'],
          ['contentColor', 'String?', 'null', 'Content color (default: KScaffoldDefaults.FabContentColor).'],
          ['type', 'String?', 'null', 'KFabType.Regular, .Small, .Large, .Extended.'],
          ['content', 'KUniversalScope.() -> Unit', '{}', 'FAB content — typically KIcon or KRow with icon and text.'],
        ],
      },
    },
    {
      id: 'kfab-examples',
      title: 'FAB Examples',
      code: `// Standard FAB
KFloatingActionButton(onClick = { createNew() }) {
    KIcon(icon = KIcons.Add)
}

// Small FAB
KFloatingActionButton(
    onClick = { createNew() },
    type = KFabType.Small
) {
    KIcon(icon = KIcons.Add)
}

// Extended FAB with text
KFloatingActionButton(
    onClick = { compose() },
    type = KFabType.Extended
) {
    KRow(horizontalArrangement = spacedBy(8), verticalAlignment = KAlignment.CenterVertically) {
        KIcon(icon = KIcons.Edit)
        KText("Compose")
    }
}`,
      language: 'kotlin',
    },
    {
      id: 'scaffold-constants',
      title: 'Scaffold Constants Reference',
      content: `Key constants for scaffold configuration:`,
      table: {
        headers: ['Object', 'Values', 'Description'],
        rows: [
          ['KTopAppBarType', 'Small, CenterAligned, Medium, Large', 'Top app bar variant.'],
          ['KFabType', 'Regular, Small, Large, Extended', 'FAB size variant.'],
          ['KFabPosition', 'Start, Center, End, EndOverlay, CenterDocked, EndDocked', 'FAB position within scaffold.'],
          ['KTopAppBarScrollBehaviorDefaults', 'PinnedScroll, EnterAlwaysScroll, ExitUntilCollapsedScroll', 'Scroll behavior types.'],
          ['KWindowInsetsDefaults', 'StatusBars, NavigationBars, Ime, SystemBars, ...', 'System window insets.'],
          ['KScaffoldDefaults', 'ContainerColor, ContentColor, FabContainerColor, ...', 'Default Material 3 scaffold colors.'],
        ],
      },
    },
  ],
  relatedReference: ['KScaffoldScope', 'KAppBarScope', 'KNavigationScope', 'KUniversalScope', 'KModifier', 'KTopAppBarType', 'KFabType', 'KFabPosition'],
  nextDoc: 'klists',
  prevDoc: 'kinput',
}

export default kScaffoldDoc
