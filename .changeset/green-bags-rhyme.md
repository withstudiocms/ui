---
"@studiocms/ui": major
---

Moves the following helpers into their own virtual modules:

- `studiocms:ui/components/toaster/client` - `toast`
- `studiocms:ui/components/modal/client` - `ModalHelper`
- `studiocms:ui/components/dropdown/client` - `DropdownHelper`
- `studiocms:ui/components/progress/client` - `ProgressHelper`
- `studiocms:ui/components/sidebar/client` - `SingleSidebarHelper, DoubleSidebarHelper`

There is also a new `studiocms:ui/components/client` joined module that contains all the above component helpers.