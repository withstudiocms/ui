---
"@studiocms/ui": patch
---

Fix Icon component requiring functions from Iconify Utils lib during runtime as well as extend usage possibilities.

NEW: 
- `IconBase` component exported from `studiocms:ui/components` which allows passing custom image collections from Iconify.

Updated:
- `Icon` component to use this new system.