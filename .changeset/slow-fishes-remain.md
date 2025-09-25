---
"@studiocms/ui": major
---

Update Icon component to utilize all iconifyJSON icons that have been passed through into the config

### Breaking Changes

- Default Icon names are now prefixed with `heroicons:` instead of just the icons name. This allows user-defined icons to be used without conflicting with the pre-shipped icons.