---
"@studiocms/ui": patch
---

Changes the way colors are declared to allow for a better customization experience.

Before, we would use raw HSL values in order to be able to modify them later on:
```css
:root {
	--background-base: 0 0% 6%;
}
```

This introduces an unnecessary hurdle to customization, since most other libraries ship with either their own color values and spaces or a different approach entirely. Thus, the goal of this PR is to replace this approach with a simpler one. We will now default to HSL functions instead of the raw values:

```css
:root {
	--background-base: hsl(0 0% 6%);
}
```

Migrating from this can be a little tedious if the old system was used in custom components. You can use this regular expression with VSCode's (or any other IDE's) search & replace feature to replace all instances of the old syntax with the new:

**Search Value**: `hsl[a]?\((var\([A-Za-z-\d]+\))\)`
**Replace Value**: `$1`

Please make sure to manually search for `hsl(var(` and `hsla(var(` after running the above to make sure all previous values have been replaced. 
