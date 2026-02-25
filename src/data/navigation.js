/**
 * Sidebar navigation structure.
 * Mirrors the package hierarchy: ketoy-sdk > annotation | cloud | core
 */

const navigation = [
  {
    type: 'link',
    label: 'Home',
    path: '/',
  },
  {
    type: 'link',
    label: 'All References',
    path: '/reference',
  },
  {
    type: 'divider',
  },
  {
    type: 'header',
    label: 'Documentation',
  },
  {
    type: 'link',
    label: 'All Guides',
    path: '/docs',
  },
  {
    type: 'section',
    label: 'guides',
    children: [
      { label: 'Initialization', path: '/docs/initialization' },
      { label: 'Layouts', path: '/docs/layouts' },
      { label: 'Screens', path: '/docs/screens' },
      { label: 'Navigation', path: '/docs/knavigation' },
      { label: 'Testing Locally', path: '/docs/testing-locally' },
      { label: 'Production Release', path: '/docs/production-release' },
    ],
  },
  {
    type: 'section',
    label: 'components',
    children: [
      { label: 'KText', path: '/docs/ktext' },
      { label: 'KButton & KIconButton', path: '/docs/kbutton' },
      { label: 'KColumn, KRow & KBox', path: '/docs/klayout' },
      { label: 'KCard', path: '/docs/kcard' },
      { label: 'KImage & KIcon', path: '/docs/kmedia' },
      { label: 'KTextField', path: '/docs/kinput' },
      { label: 'KScaffold & Navigation', path: '/docs/kscaffold' },
      { label: 'KLazyColumn & KLazyRow', path: '/docs/klists' },
      { label: 'Advanced Builders', path: '/docs/kadvanced' },
    ],
  },
  {
    type: 'divider',
  },
  {
    type: 'header',
    label: 'ketoy-sdk',
  },
  {
    type: 'section',
    label: 'ketoy',
    children: [
      {
        type: 'section',
        label: 'entry point',
        children: [
          { label: 'Ketoy', path: '/reference/Ketoy' },
          { label: 'KetoyInitializer', path: '/reference/KetoyInitializer' },
        ],
      },
    ],
  },
  {
    type: 'section',
    label: 'annotation',
    children: [
      { label: 'KComponent', path: '/reference/KComponent' },
    ],
  },
  {
    type: 'section',
    label: 'cloud',
    children: [
      {
        type: 'section',
        label: 'service',
        children: [
          { label: 'KetoyCloud', path: '/reference/KetoyCloud' },
          { label: 'KetoyCloudConfig', path: '/reference/KetoyCloudConfig' },
          { label: 'KetoyCloudService', path: '/reference/KetoyCloudService' },
          { label: 'FetchResult', path: '/reference/FetchResult' },
        ],
      },
      {
        type: 'section',
        label: 'screen',
        children: [
          { label: 'KetoyCloudScreen', path: '/reference/KetoyCloudScreen' },
          { label: 'KetoyCloudScreenFromJson', path: '/reference/KetoyCloudScreenFromJson' },
          { label: 'CloudScreenState', path: '/reference/CloudScreenState' },
        ],
      },
      {
        type: 'section',
        label: 'navigation',
        children: [
          { label: 'KetoyCloudNavService', path: '/reference/KetoyCloudNavService' },
          { label: 'NavFetchResult', path: '/reference/NavFetchResult' },
        ],
      },
      {
        type: 'section',
        label: 'cache',
        children: [
          { label: 'KetoyCacheConfig', path: '/reference/KetoyCacheConfig' },
          { label: 'KetoyCacheEntry', path: '/reference/KetoyCacheEntry' },
          { label: 'KetoyCacheStore', path: '/reference/KetoyCacheStore' },
          { label: 'KetoyCacheStrategy', path: '/reference/KetoyCacheStrategy' },
        ],
      },
      {
        type: 'section',
        label: 'network',
        children: [
          { label: 'KetoyApiClient', path: '/reference/KetoyApiClient' },
          { label: 'KetoyApiResponse', path: '/reference/KetoyApiResponse' },
          { label: 'KetoyScreenData', path: '/reference/KetoyScreenData' },
          { label: 'KetoyScreenVersionData', path: '/reference/KetoyScreenVersionData' },
          { label: 'KetoyNetworkException', path: '/reference/KetoyNetworkException' },
        ],
      },
    ],
  },
  {
    type: 'section',
    label: 'core',
    children: [
      {
        type: 'section',
        label: 'actions',
        children: [
          { label: 'ActionRegistry', path: '/reference/ActionRegistry' },
        ],
      },
      {
        type: 'section',
        label: 'serialization',
        children: [
          { label: 'KetoyJson', path: '/reference/KetoyJson' },
          { label: 'KetoyJsonUtils', path: '/reference/KetoyJsonUtils' },
        ],
      },
      {
        type: 'section',
        label: 'state',
        children: [
          { label: 'KetoyVariableRegistry', path: '/reference/KetoyVariableRegistry' },
          { label: 'ketoyRemember', path: '/reference/ketoyRemember' },
          { label: 'ketoyMutableStateOf', path: '/reference/ketoyMutableStateOf' },
          { label: 'variableValue', path: '/reference/variableValue' },
        ],
      },
    ],
  },
  {
    type: 'section',
    label: 'util',
    children: [
      {
        type: 'section',
        label: 'colors',
        children: [
          { label: 'KColors', path: '/reference/KColors' },
        ],
      },
      {
        type: 'section',
        label: 'constants',
        children: [
          { label: 'KArrangements', path: '/reference/KArrangements' },
          { label: 'KAlignments', path: '/reference/KAlignments' },
          { label: 'KFontWeights', path: '/reference/KFontWeights' },
          { label: 'KTextAlign', path: '/reference/KTextAlign' },
          { label: 'KGradients', path: '/reference/KGradients' },
          { label: 'KFabPosition', path: '/reference/KFabPosition' },
          { label: 'KTopAppBarType', path: '/reference/KTopAppBarType' },
          { label: 'KFabType', path: '/reference/KFabType' },
          { label: 'KSnackBarDuration', path: '/reference/KSnackBarDuration' },
          { label: 'KTopAppBarScrollBehaviorDefaults', path: '/reference/KTopAppBarScrollBehaviorDefaults' },
          { label: 'KWindowInsetsDefaults', path: '/reference/KWindowInsetsDefaults' },
          { label: 'KScaffoldDefaults', path: '/reference/KScaffoldDefaults' },
        ],
      },
      {
        type: 'section',
        label: 'helpers',
        children: [
          { label: 'kModifier', path: '/reference/kModifier' },
          { label: 'kPadding', path: '/reference/kPadding' },
          { label: 'kMargin', path: '/reference/kMargin' },
          { label: 'kBorder', path: '/reference/kBorder' },
          { label: 'kShadow', path: '/reference/kShadow' },
          { label: 'kWindowInsets', path: '/reference/kWindowInsets' },
          { label: 'kTopAppBarColors', path: '/reference/kTopAppBarColors' },
          { label: 'kFabElevation', path: '/reference/kFabElevation' },
          { label: 'kNavigationDrawerItemColors', path: '/reference/kNavigationDrawerItemColors' },
          { label: 'kIconButtonColors', path: '/reference/kIconButtonColors' },
          { label: 'kImageRes', path: '/reference/kImageRes' },
          { label: 'kImageUrl', path: '/reference/kImageUrl' },
          { label: 'kImageBase64', path: '/reference/kImageBase64' },
          { label: 'kImageIcon', path: '/reference/kImageIcon' },
          { label: 'kIcon', path: '/reference/kIcon' },
          { label: 'kIconButton', path: '/reference/kIconButton' },
        ],
      },
      {
        type: 'section',
        label: 'icons',
        children: [
          { label: 'KIcons', path: '/reference/KIcons' },
          { label: 'KIconRef', path: '/reference/KIconRef' },
          { label: 'resolveIcon', path: '/reference/resolveIcon' },
        ],
      },
      {
        type: 'section',
        label: 'shapes',
        children: [
          { label: 'KShapes', path: '/reference/KShapes' },
          { label: 'kRounded', path: '/reference/kRounded' },
          { label: 'kCircle', path: '/reference/kCircle' },
          { label: 'kRectangle', path: '/reference/kRectangle' },
        ],
      },
    ],
  },
  {
    type: 'section',
    label: 'model',
    children: [
      {
        type: 'section',
        label: 'component models',
        children: [
          { label: 'KComponentInfo', path: '/reference/KComponentInfo' },
          { label: 'KComponentMetadata', path: '/reference/KComponentMetadata' },
          { label: 'KetoyJsonSchema', path: '/reference/KetoyJsonSchema' },
        ],
      },
      {
        type: 'section',
        label: 'gradient',
        children: [
          { label: 'KGradient', path: '/reference/KGradient' },
        ],
      },
      {
        type: 'section',
        label: 'image source',
        children: [
          { label: 'KImageSource', path: '/reference/KImageSource' },
          { label: 'KScaleType', path: '/reference/KScaleType' },
        ],
      },
      {
        type: 'section',
        label: 'modifier',
        children: [
          { label: 'KModifier', path: '/reference/KModifier' },
          { label: 'KPadding', path: '/reference/KPadding' },
          { label: 'KMargin', path: '/reference/KMargin' },
          { label: 'KBorder', path: '/reference/KBorder' },
          { label: 'KShadow', path: '/reference/KShadow' },
        ],
      },
      {
        type: 'section',
        label: 'node',
        children: [
          { label: 'KNode', path: '/reference/KNode' },
        ],
      },
      {
        type: 'section',
        label: 'props',
        children: [
          { label: 'KColumnProps', path: '/reference/KColumnProps' },
          { label: 'KRowProps', path: '/reference/KRowProps' },
          { label: 'KBoxProps', path: '/reference/KBoxProps' },
          { label: 'KTextProps', path: '/reference/KTextProps' },
          { label: 'KButtonProps', path: '/reference/KButtonProps' },
          { label: 'KImageProps', path: '/reference/KImageProps' },
          { label: 'KCardProps', path: '/reference/KCardProps' },
          { label: 'KIconProps', path: '/reference/KIconProps' },
          { label: 'KSpacerProps', path: '/reference/KSpacerProps' },
          { label: 'KComponentProps', path: '/reference/KComponentProps' },
        ],
      },
      {
        type: 'section',
        label: 'variable',
        children: [
          { label: 'KetoyVariable', path: '/reference/KetoyVariable' },
          { label: 'DataReference', path: '/reference/DataReference' },
          { label: 'EnumReference', path: '/reference/EnumReference' },
          { label: 'KReferences', path: '/reference/KReferences' },
        ],
      },
      {
        type: 'section',
        label: 'serializer',
        children: [
          { label: 'AnyValueSerializer', path: '/reference/AnyValueSerializer' },
        ],
      },
    ],
  },
  {
    type: 'section',
    label: 'navigation',
    children: [
      {
        type: 'section',
        label: 'route',
        children: [
          { label: 'KetoyRoute', path: '/reference/KetoyRoute' },
        ],
      },
      {
        type: 'section',
        label: 'nav graph',
        children: [
          { label: 'KetoyNavDestination', path: '/reference/KetoyNavDestination' },
          { label: 'KetoyNavAction', path: '/reference/KetoyNavAction' },
          { label: 'KetoyNavGraph', path: '/reference/KetoyNavGraph' },
          { label: 'KetoyNavRegistry', path: '/reference/KetoyNavRegistry' },
        ],
      },
      {
        type: 'section',
        label: 'nav host',
        children: [
          { label: 'KetoyNavHost', path: '/reference/KetoyNavHost' },
          { label: 'KetoyNavGraphScope', path: '/reference/KetoyNavGraphScope' },
          { label: 'LocalKetoyNavController', path: '/reference/LocalKetoyNavController' },
          { label: 'LocalKetoyNavHostName', path: '/reference/LocalKetoyNavHostName' },
          { label: 'LocalKetoyNavGraph', path: '/reference/LocalKetoyNavGraph' },
        ],
      },
      {
        type: 'section',
        label: 'controller',
        children: [
          { label: 'KetoyNavController', path: '/reference/KetoyNavController' },
        ],
      },
      {
        type: 'section',
        label: 'overrides',
        children: [
          { label: 'KetoyNavDevOverrides', path: '/reference/KetoyNavDevOverrides' },
          { label: 'KetoyCloudNavOverrides', path: '/reference/KetoyCloudNavOverrides' },
        ],
      },
      {
        type: 'section',
        label: 'registry',
        children: [
          { label: 'KetoyComposableRegistry', path: '/reference/KetoyComposableRegistry' },
        ],
      },
      {
        type: 'section',
        label: 'models',
        children: [
          { label: 'NavigationStyle', path: '/reference/NavigationStyle' },
          { label: 'KNavigateAction', path: '/reference/KNavigateAction' },
        ],
      },
      {
        type: 'section',
        label: 'executor',
        children: [
          { label: 'KetoyNavigationExecutor', path: '/reference/KetoyNavigationExecutor' },
        ],
      },
      {
        type: 'section',
        label: 'navigator',
        children: [
          { label: 'KetoyNavigator', path: '/reference/KetoyNavigator' },
        ],
      },
    ],
  },
  {
    type: 'section',
    label: 'parser',
    children: [
      {
        type: 'section',
        label: 'arrangement',
        children: [
          { label: 'parseVerticalArrangement', path: '/reference/parseVerticalArrangement' },
          { label: 'parseHorizontalArrangement', path: '/reference/parseHorizontalArrangement' },
          { label: 'parseHorizontalAlignment', path: '/reference/parseHorizontalAlignment' },
          { label: 'parseVerticalAlignment', path: '/reference/parseVerticalAlignment' },
          { label: 'parseContentAlignment', path: '/reference/parseContentAlignment' },
          { label: 'parseContentAlignmentFromString', path: '/reference/parseContentAlignmentFromString' },
          { label: 'parsePadding', path: '/reference/parsePadding' },
        ],
      },
      {
        type: 'section',
        label: 'color',
        children: [
          { label: 'parseColor', path: '/reference/parseColor' },
          { label: 'parseColorOrNull', path: '/reference/parseColorOrNull' },
          { label: 'resolveKetoyColor', path: '/reference/resolveKetoyColor' },
          { label: 'resolveKetoyColorOrNull', path: '/reference/resolveKetoyColorOrNull' },
        ],
      },
      {
        type: 'section',
        label: 'gradient',
        children: [
          { label: 'parseGradient', path: '/reference/parseGradient' },
        ],
      },
      {
        type: 'section',
        label: 'modifier',
        children: [
          { label: 'parseModifier', path: '/reference/parseModifier' },
        ],
      },
      {
        type: 'section',
        label: 'shape',
        children: [
          { label: 'parseShape', path: '/reference/parseShape' },
          { label: 'parseShapeWithRadius', path: '/reference/parseShapeWithRadius' },
        ],
      },
      {
        type: 'section',
        label: 'scaffold',
        children: [
          { label: 'parseWindowInsets', path: '/reference/parseWindowInsets' },
          { label: 'parseTopAppBarColors', path: '/reference/parseTopAppBarColors' },
          { label: 'parseTopAppBarScrollBehavior', path: '/reference/parseTopAppBarScrollBehavior' },
          { label: 'parseNavigationDrawerItemColors', path: '/reference/parseNavigationDrawerItemColors' },
          { label: 'parseIconButtonColors', path: '/reference/parseIconButtonColors' },
          { label: 'parseNavigationBarItemColors', path: '/reference/parseNavigationBarItemColors' },
          { label: 'parseFabElevation', path: '/reference/parseFabElevation' },
          { label: 'parseFabPosition', path: '/reference/parseFabPosition' },
        ],
      },
      {
        type: 'section',
        label: 'textfield',
        children: [
          { label: 'parseTextStyle', path: '/reference/parseTextStyle' },
          { label: 'parseVisualTransformation', path: '/reference/parseVisualTransformation' },
          { label: 'parseKeyboardOptions', path: '/reference/parseKeyboardOptions' },
          { label: 'parseKeyboardActions', path: '/reference/parseKeyboardActions' },
          { label: 'parseTextFieldColors', path: '/reference/parseTextFieldColors' },
        ],
      },
    ],
  },
  {
    type: 'section',
    label: 'registry',
    children: [
      {
        type: 'section',
        label: 'component',
        children: [
          { label: 'KComponentRegistry', path: '/reference/KComponentRegistry' },
        ],
      },
      {
        type: 'section',
        label: 'function',
        children: [
          { label: 'KetoyFunctionRegistry', path: '/reference/KetoyFunctionRegistry' },
          { label: 'FunctionInfo', path: '/reference/FunctionInfo' },
        ],
      },
    ],
  },
  {
    type: 'section',
    label: 'renderer',
    children: [
      {
        type: 'section',
        label: 'core',
        children: [
          { label: 'UIComponent', path: '/reference/UIComponent' },
          { label: 'JSONStringToUI', path: '/reference/JSONStringToUI' },
          { label: 'RenderComponent', path: '/reference/RenderComponent' },
          { label: 'RenderContentSlotFromJson', path: '/reference/RenderContentSlotFromJson' },
          { label: 'RenderCustomWidgetParser', path: '/reference/RenderCustomWidgetParser' },
        ],
      },
      {
        type: 'section',
        label: 'component',
        children: [
          { label: 'RenderCustomComponent', path: '/reference/RenderCustomComponent' },
          { label: 'RenderRegisteredComponent', path: '/reference/RenderRegisteredComponent' },
          { label: 'extractProperties', path: '/reference/extractProperties' },
        ],
      },
      {
        type: 'section',
        label: 'layout',
        children: [
          { label: 'RenderColumn', path: '/reference/RenderColumn' },
          { label: 'RenderRow', path: '/reference/RenderRow' },
          { label: 'RenderBox', path: '/reference/RenderBox' },
          { label: 'RenderLazyColumn', path: '/reference/RenderLazyColumn' },
          { label: 'RenderLazyRow', path: '/reference/RenderLazyRow' },
        ],
      },
      {
        type: 'section',
        label: 'action',
        children: [
          { label: 'OnClickResolver', path: '/reference/OnClickResolver' },
        ],
      },
      {
        type: 'section',
        label: 'scaffold',
        children: [
          { label: 'RenderScaffold', path: '/reference/RenderScaffold' },
          { label: 'RenderTopAppBar', path: '/reference/RenderTopAppBar' },
          { label: 'RenderBottomAppBar', path: '/reference/RenderBottomAppBar' },
          { label: 'RenderNavigationBar', path: '/reference/RenderNavigationBar' },
          { label: 'RenderNavigationBarItem', path: '/reference/RenderNavigationBarItem' },
          { label: 'RenderNavigationDrawerItem', path: '/reference/RenderNavigationDrawerItem' },
          { label: 'RenderCustomNavigationItem', path: '/reference/RenderCustomNavigationItem' },
          { label: 'RenderFloatingActionButton', path: '/reference/RenderFloatingActionButton' },
          { label: 'RenderSnackBar', path: '/reference/RenderSnackBar' },
          { label: 'RenderSnackBarHost', path: '/reference/RenderSnackBarHost' },
          { label: 'RenderAppBarAction', path: '/reference/RenderAppBarAction' },
          { label: 'RenderNavigationRail', path: '/reference/RenderNavigationRail' },
          { label: 'RenderNavigationRailItem', path: '/reference/RenderNavigationRailItem' },
          { label: 'RenderModalBottomSheet', path: '/reference/RenderModalBottomSheet' },
        ],
      },
      {
        type: 'section',
        label: 'textfield',
        children: [
          { label: 'RenderTextField', path: '/reference/RenderTextField' },
        ],
      },
      {
        type: 'section',
        label: 'widget',
        children: [
          { label: 'rememberOnClick', path: '/reference/rememberOnClick' },
          { label: 'RenderText', path: '/reference/RenderText' },
          { label: 'RenderButton', path: '/reference/RenderButton' },
          { label: 'RenderSpacer', path: '/reference/RenderSpacer' },
          { label: 'RenderCard', path: '/reference/RenderCard' },
          { label: 'RenderImage', path: '/reference/RenderImage' },
          { label: 'RenderIcon', path: '/reference/RenderIcon' },
          { label: 'RenderIconButton', path: '/reference/RenderIconButton' },
          { label: 'applyJsonPadding', path: '/reference/applyJsonPadding' },
        ],
      },
    ],
  },
  {
    type: 'section',
    label: 'widget',
    children: [
      {
        type: 'section',
        label: 'action parser',
        children: [
          { label: 'KetoyActionParser', path: '/reference/KetoyActionParser' },
          { label: 'ActionContext', path: '/reference/ActionContext' },
        ],
      },
      {
        type: 'section',
        label: 'action registry',
        children: [
          { label: 'KetoyActionRegistry', path: '/reference/KetoyActionRegistry' },
        ],
      },
      {
        type: 'section',
        label: 'widget parser',
        children: [
          { label: 'KetoyWidgetParser', path: '/reference/KetoyWidgetParser' },
        ],
      },
      {
        type: 'section',
        label: 'widget registry',
        children: [
          { label: 'KetoyWidgetRegistry', path: '/reference/KetoyWidgetRegistry' },
        ],
      },
      {
        type: 'section',
        label: 'builtin',
        children: [
          { label: 'CallFunctionActionParser', path: '/reference/CallFunctionActionParser' },
          { label: 'CallFunctionAction', path: '/reference/CallFunctionAction' },
          { label: 'NavigateActionParser', path: '/reference/NavigateActionParser' },
        ],
      },
    ],
  },
  {
    type: 'section',
    label: 'screen',
    children: [
      {
        type: 'section',
        label: 'content',
        children: [
          { label: 'KetoyContent', path: '/reference/KetoyContent' },
        ],
      },
      {
        type: 'section',
        label: 'screen',
        children: [
          { label: 'LocalKetoyScreen', path: '/reference/LocalKetoyScreen' },
          { label: 'ProvideKetoyScreen', path: '/reference/ProvideKetoyScreen' },
          { label: 'KetoyScreen', path: '/reference/KetoyScreen' },
          { label: 'ContentEntry', path: '/reference/ContentEntry' },
        ],
      },
      {
        type: 'section',
        label: 'annotation',
        children: [
          { label: 'KScreen', path: '/reference/KScreen' },
        ],
      },
      {
        type: 'section',
        label: 'registry',
        children: [
          { label: 'KetoyScreenRegistry', path: '/reference/KetoyScreenRegistry' },
        ],
      },
      {
        type: 'section',
        label: 'view',
        children: [
          { label: 'KetoyView', path: '/reference/KetoyView' },
          { label: 'KetoyViewFromJson', path: '/reference/KetoyViewFromJson' },
          { label: 'KetoyViewFromAsset', path: '/reference/KetoyViewFromAsset' },
          { label: 'KetoyViewFromNetwork', path: '/reference/KetoyViewFromNetwork' },
        ],
      },
    ],
  },
  {
    type: 'section',
    label: 'theme',
    children: [
      {
        type: 'section',
        label: 'mode',
        children: [
          { label: 'KetoyThemeMode', path: '/reference/KetoyThemeMode' },
        ],
      },
      {
        type: 'section',
        label: 'color scheme',
        children: [
          { label: 'KetoyColorScheme', path: '/reference/KetoyColorScheme' },
          { label: 'LocalKetoyColors', path: '/reference/LocalKetoyColors' },
        ],
      },
      {
        type: 'section',
        label: 'provider',
        children: [
          { label: 'LocalKetoyDarkTheme', path: '/reference/LocalKetoyDarkTheme' },
          { label: 'KetoyThemeProvider', path: '/reference/KetoyThemeProvider' },
        ],
      },
    ],
  },
  {
    type: 'section',
    label: 'export',
    children: [
      {
        type: 'section',
        label: 'production',
        children: [
          { label: 'KetoyProductionExport', path: '/reference/KetoyProductionExport' },
          { label: 'ScreenBuilder', path: '/reference/ScreenBuilder' },
          { label: 'ScreenDefinition', path: '/reference/ScreenDefinition' },
          { label: 'ContentDefinition', path: '/reference/ContentDefinition' },
          { label: 'ScreenExport', path: '/reference/ScreenExport' },
          { label: 'NavGraphExport', path: '/reference/NavGraphExport' },
          { label: 'ExportResult', path: '/reference/ExportResult' },
          { label: 'ExportSummary', path: '/reference/ExportSummary' },
        ],
      },
      {
        type: 'section',
        label: 'loader',
        children: [
          { label: 'KetoyProductionNavLoader', path: '/reference/KetoyProductionNavLoader' },
        ],
      },
    ],
  },
  {
    type: 'section',
    label: 'dsl',
    children: [
      {
        type: 'section',
        label: 'scope',
        children: [
          { label: 'KScope', path: '/reference/KScope' },
          { label: 'KUniversalScope', path: '/reference/KUniversalScope' },
          { label: 'KLazyListScope', path: '/reference/KLazyListScope' },
          { label: 'KTextFieldScope', path: '/reference/KTextFieldScope' },
          { label: 'KScaffoldScope', path: '/reference/KScaffoldScope' },
          { label: 'KAppBarScope', path: '/reference/KAppBarScope' },
          { label: 'KNavigationScope', path: '/reference/KNavigationScope' },
          { label: 'KSnackBarScope', path: '/reference/KSnackBarScope' },
          { label: 'KNavigationRailScope', path: '/reference/KNavigationRailScope' },
        ],
      },
      {
        type: 'section',
        label: 'builders',
        children: [
          { label: 'TopLevelBuilders', path: '/reference/TopLevelBuilders' },
        ],
      },
      {
        type: 'section',
        label: 'widget',
        children: [
          { label: 'KetoyWidgetsScope', path: '/reference/KetoyWidgetsScope' },
          { label: 'WidgetParserBuilder', path: '/reference/WidgetParserBuilder' },
          { label: 'ketoyWidgets', path: '/reference/ketoyWidgets' },
        ],
      },
      {
        type: 'section',
        label: 'screen',
        children: [
          { label: 'KetoyScreensScope', path: '/reference/KetoyScreensScope' },
          { label: 'ScreenBuilder', path: '/reference/ScreenBuilder' },
          { label: 'ketoyScreens', path: '/reference/ketoyScreens' },
        ],
      },
    ],
  },
]

export default navigation
