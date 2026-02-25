/**
 * Ketoy Documentation – Widgets: KTextField
 * Covers: Text input builder in KUniversalScope
 */

const kInputDoc = {
  id: 'kinput',
  title: 'KTextField',
  description: 'KTextField renders a Material 3 text input with slot-based configuration via KTextFieldScope. Supports labels, placeholders, icons, keyboard options, and visual transformations.',
  icon: 'FaKeyboard',
  order: 8,
  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content: `\`KTextField\` is the text input builder in the Ketoy DSL. It uses a **slot-based** \`KTextFieldScope\` content lambda for label, placeholder, leading/trailing icons, prefix, suffix, and supporting text — rather than flat string parameters.

The \`onValueChange\` callback is a native Kotlin \`(String) -> Unit\` lambda.`,
    },
    {
      id: 'signature',
      title: 'Signature',
      code: `fun KTextField(
    value: String = "",
    onValueChange: ((String) -> Unit)? = null,
    modifier: KModifier? = null,
    enabled: Boolean = true,
    readOnly: Boolean = false,
    textStyle: KTextStyle? = null,
    isError: Boolean = false,
    visualTransformation: KVisualTransformation? = null,
    keyboardOptions: KKeyboardOptions? = null,
    keyboardActions: KKeyboardActions? = null,
    singleLine: Boolean = false,
    maxLines: Int? = null,
    minLines: Int? = null,
    interactionSource: String? = null,
    shape: String? = null,
    colors: KTextFieldColors? = null,
    content: KTextFieldScope.() -> Unit = {}
)`,
      language: 'kotlin',
    },
    {
      id: 'parameters',
      title: 'Parameters',
      table: {
        headers: ['Parameter', 'Type', 'Default', 'Description'],
        rows: [
          ['value', 'String', '""', 'Current text value.'],
          ['onValueChange', '((String) -> Unit)?', 'null', 'Native Kotlin callback invoked when text changes.'],
          ['modifier', 'KModifier?', 'null', 'Layout modifier.'],
          ['enabled', 'Boolean', 'true', 'Whether the field is interactive.'],
          ['readOnly', 'Boolean', 'false', 'Display value but prevent editing.'],
          ['textStyle', 'KTextStyle?', 'null', 'Custom text style for the input.'],
          ['isError', 'Boolean', 'false', 'Show error state styling.'],
          ['visualTransformation', 'KVisualTransformation?', 'null', 'Visual transformation (e.g. password masking).'],
          ['keyboardOptions', 'KKeyboardOptions?', 'null', 'Keyboard type, capitalization, auto-correct, IME action.'],
          ['keyboardActions', 'KKeyboardActions?', 'null', 'IME action handlers (onDone, onSearch, etc.).'],
          ['singleLine', 'Boolean', 'false', 'Restrict to a single line.'],
          ['maxLines', 'Int?', 'null', 'Maximum number of visible lines.'],
          ['minLines', 'Int?', 'null', 'Minimum number of visible lines.'],
          ['shape', 'String?', 'null', 'Input field shape using KShapes (e.g. KShapes.Rounded8).'],
          ['colors', 'KTextFieldColors?', 'null', 'Custom color overrides for the text field.'],
          ['content', 'KTextFieldScope.() -> Unit', '{}', 'Slot-based content: label, placeholder, icons, etc.'],
        ],
      },
    },
    {
      id: 'ktextfieldscope',
      title: 'KTextFieldScope Slots',
      content: `Inside the \`content\` lambda, use \`KTextFieldScope\` methods to define field slots. Each slot accepts a \`KUniversalScope\` lambda:`,
      table: {
        headers: ['Slot Method', 'Description'],
        rows: [
          ['label { ... }', 'Floating label displayed above the input.'],
          ['placeholder { ... }', 'Placeholder text shown when the field is empty.'],
          ['leadingIcon { ... }', 'Icon displayed at the start of the field.'],
          ['trailingIcon { ... }', 'Icon displayed at the end of the field.'],
          ['prefix { ... }', 'Content displayed before the input text.'],
          ['suffix { ... }', 'Content displayed after the input text.'],
          ['supportingText { ... }', 'Helper text displayed below the field (e.g. error messages).'],
        ],
      },
    },
    {
      id: 'basic-usage',
      title: 'Basic Usage',
      code: `KTextField(
    value = username,
    onValueChange = { newValue -> updateUsername(newValue) },
    modifier = KModifier(fillMaxWidth = 1f)
) {
    label { KText("Username") }
    placeholder { KText("Enter your username") }
    leadingIcon { KIcon(icon = KIcons.Person) }
}`,
      language: 'kotlin',
    },
    {
      id: 'form-example',
      title: 'Form Example',
      content: `Build a login form with slot-based text fields:`,
      code: `KColumn(
    modifier = KModifier(fillMaxWidth = 1f, padding = 24),
    verticalArrangement = spacedBy(16)
) {
    KText("Sign In", fontSize = 28, fontWeight = KFontWeights.Bold)

    KTextField(
        value = email,
        onValueChange = { updateEmail(it) },
        singleLine = true,
        keyboardOptions = KKeyboardOptions(keyboardType = "email"),
        modifier = KModifier(fillMaxWidth = 1f)
    ) {
        label { KText("Email") }
        placeholder { KText("you@example.com") }
        leadingIcon { KIcon(icon = KIcons.Email) }
    }

    KTextField(
        value = password,
        onValueChange = { updatePassword(it) },
        singleLine = true,
        visualTransformation = KVisualTransformation.Password,
        keyboardOptions = KKeyboardOptions(keyboardType = "password"),
        modifier = KModifier(fillMaxWidth = 1f)
    ) {
        label { KText("Password") }
        leadingIcon { KIcon(icon = KIcons.Lock) }
        trailingIcon {
            KIconButton(
                icon = KIcons.Visibility,
                onClick = { togglePasswordVisibility() }
            )
        }
    }

    KButton(
        onClick = { signIn() },
        modifier = KModifier(fillMaxWidth = 1f)
    ) {
        KText("Sign In")
    }
}`,
      language: 'kotlin',
    },
    {
      id: 'validation',
      title: 'Validation & Error States',
      content: `Use \`isError\` and \`supportingText\` slot for validation feedback:`,
      code: `KTextField(
    value = emailValue,
    onValueChange = { updateEmail(it) },
    isError = true,
    modifier = KModifier(fillMaxWidth = 1f)
) {
    label { KText("Email") }
    leadingIcon { KIcon(icon = KIcons.Email) }
    supportingText {
        KText("Please enter a valid email address", color = KColors.Error, fontSize = 12)
    }
}`,
      language: 'kotlin',
    },
    {
      id: 'multiline',
      title: 'Multiline Input',
      content: `Create a text area with \`maxLines\` and \`minLines\`:`,
      code: `KTextField(
    value = bio,
    onValueChange = { updateBio(it) },
    maxLines = 5,
    minLines = 3,
    modifier = KModifier(fillMaxWidth = 1f)
) {
    label { KText("Bio") }
    placeholder { KText("Tell us about yourself...") }
    supportingText { KText("\${bio.length}/500") }
}`,
      language: 'kotlin',
    },
    {
      id: 'search-field',
      title: 'Search Pattern',
      content: `Common pattern for a search bar:`,
      code: `KTextField(
    value = searchQuery,
    onValueChange = { search(it) },
    singleLine = true,
    shape = KShapes.Rounded28,
    modifier = KModifier(fillMaxWidth = 1f)
) {
    placeholder { KText("Search...") }
    leadingIcon { KIcon(icon = KIcons.Search) }
    trailingIcon {
        KIconButton(
            icon = KIcons.Close,
            onClick = { clearSearch() }
        )
    }
}`,
      language: 'kotlin',
    },
    {
      id: 'prefix-suffix',
      title: 'Prefix & Suffix',
      content: `Use \`prefix\` and \`suffix\` slots for formatted inputs:`,
      code: `KTextField(
    value = amount,
    onValueChange = { updateAmount(it) },
    keyboardOptions = KKeyboardOptions(keyboardType = "number"),
    singleLine = true,
    modifier = KModifier(fillMaxWidth = 1f)
) {
    label { KText("Price") }
    prefix { KText("$") }
    suffix { KText(".00") }
}`,
      language: 'kotlin',
    },
  ],
  relatedReference: ['KUniversalScope', 'KTextFieldScope', 'KModifier', 'KShapes', 'KKeyboardOptions', 'KVisualTransformation'],
  nextDoc: 'kscaffold',
  prevDoc: 'kmedia',
}

export default kInputDoc
