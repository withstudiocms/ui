# @studiocms/ui

## 1.0.0-beta.3

### Patch Changes

- [#130](https://github.com/withstudiocms/ui/pull/130) [`57f900d`](https://github.com/withstudiocms/ui/commit/57f900d40d37ae64ce1aaf984509d646b401a16b) Thanks [@RATIU5](https://github.com/RATIU5)! - Fixes toggle colors, adds new "gray" color for toggle circles, and adds a light variant for the default flat colors.

## 1.0.0-beta.2

### Minor Changes

- [#125](https://github.com/withstudiocms/ui/pull/125) [`9473be8`](https://github.com/withstudiocms/ui/commit/9473be82b5c1b226248e7028dce31b013534f3ba) Thanks [@RATIU5](https://github.com/RATIU5)! - Colors have been adjusted to look better for all components. Badge variants now default to "outlined" and the "default" value has been deprecated. The deprecation was due to the badges failing WGAG AAA guidelines. All projects using the "default" variant should be updated to use "outlined" instead.

- [#118](https://github.com/withstudiocms/ui/pull/118) [`1779190`](https://github.com/withstudiocms/ui/commit/1779190849e80ed21af4eeac3b36553cb4c8447f) Thanks [@RATIU5](https://github.com/RATIU5)! - Updates the Tabs components to optionally use a custom ID

### Patch Changes

- [#119](https://github.com/withstudiocms/ui/pull/119) [`6bdc0ee`](https://github.com/withstudiocms/ui/commit/6bdc0ee2b99fd984caf49f83a680a23c7c1d497a) Thanks [@louisescher](https://github.com/louisescher)! - Fixes an issue where the toaster HTML Element would have an unnecessary comma attribute due to a typo.

- [#124](https://github.com/withstudiocms/ui/pull/124) [`8a2f606`](https://github.com/withstudiocms/ui/commit/8a2f6060d1c25c9a537a078c21e967c5d998ef8b) Thanks [@Adammatthiesen](https://github.com/Adammatthiesen)! - Improve icon handling and processing, allowing icon sets defined in the config to also use `-` in their name (e.g. 'simple-icons')

## 1.0.0-beta.1

### Patch Changes

- [#110](https://github.com/withstudiocms/ui/pull/110) [`8bb4637`](https://github.com/withstudiocms/ui/commit/8bb4637f84dcc66cba8ed68d36d31671fb3b3058) Thanks [@louisescher](https://github.com/louisescher)! - Fixes the focus outline of buttons within groups sometimes being hidden behind other buttons in the same group.

- [#112](https://github.com/withstudiocms/ui/pull/112) [`ba10776`](https://github.com/withstudiocms/ui/commit/ba10776d35c04f1abff7451ece468689fbfe1212) Thanks [@louisescher](https://github.com/louisescher)! - Fixes buttons within dropdowns not displaying properly within a group

- [#111](https://github.com/withstudiocms/ui/pull/111) [`f2fc787`](https://github.com/withstudiocms/ui/commit/f2fc787501445ba150c409d38ddedc7fa4cf5034) Thanks [@louisescher](https://github.com/louisescher)! - Adds optional icons and help texts to inputs

## 1.0.0-beta.0

### Major Changes

- [#88](https://github.com/withstudiocms/ui/pull/88) [`b96fe4d`](https://github.com/withstudiocms/ui/commit/b96fe4d7b88fced72a65c96a4aa893f9bc164af8) Thanks [@Adammatthiesen](https://github.com/Adammatthiesen)! - Update Icon component to utilize all iconifyJSON icons that have been passed through into the config

  ### Breaking Changes

  - Default Icon names are now prefixed with `heroicons:` instead of just the icons name. This allows user-defined icons to be used without conflicting with the pre-shipped icons.

### Minor Changes

- [#106](https://github.com/withstudiocms/ui/pull/106) [`613830e`](https://github.com/withstudiocms/ui/commit/613830edf9625a52166d3f520e6b513b2e96128f) Thanks [@Adammatthiesen](https://github.com/Adammatthiesen)! - Introduce individual component virtual exports alongside the bundled barrel virtual export `'studiocms:ui/components'`

  You can now import for example `Button` component from `studiocms:ui/components/button`

- [#89](https://github.com/withstudiocms/ui/pull/89) [`ce1f6fc`](https://github.com/withstudiocms/ui/commit/ce1f6fcbad376fd0fd2cc65d251baec6ccd5cc10) Thanks [@Adammatthiesen](https://github.com/Adammatthiesen)! - Migrate from injected types to ambient types for static virtual modules

- [#86](https://github.com/withstudiocms/ui/pull/86) [`63e3b9e`](https://github.com/withstudiocms/ui/commit/63e3b9e2a2c2d3b2162de4b4a9c88cc6eed25f96) Thanks [@RATIU5](https://github.com/RATIU5)! - Adds a skeleton loading state component

- [#87](https://github.com/withstudiocms/ui/pull/87) [`80d1970`](https://github.com/withstudiocms/ui/commit/80d1970a7b91860efafcac69139379a7e3e900eb) Thanks [@Adammatthiesen](https://github.com/Adammatthiesen)! - Removes ThemeToggle as it was causing a error when added to the virtual module, it is now recommended to use the ThemeHelper directly

### Patch Changes

- [#92](https://github.com/withstudiocms/ui/pull/92) [`bd47caf`](https://github.com/withstudiocms/ui/commit/bd47cafc61f9688d3541b6cebf80471c5d1b5475) Thanks [@RATIU5](https://github.com/RATIU5)! - Fixes #91, alert type is respected and shows appropriate colors

- [#103](https://github.com/withstudiocms/ui/pull/103) [`111e685`](https://github.com/withstudiocms/ui/commit/111e685e622e61d0549b9d2e2344dd16dfea2259) Thanks [@RATIU5](https://github.com/RATIU5)! - Fixes Select components UI bug, where list items had no background and showed bullet points

- [#104](https://github.com/withstudiocms/ui/pull/104) [`f708d9d`](https://github.com/withstudiocms/ui/commit/f708d9d17ecf72fc9821901c0e8c41516025c992) Thanks [@RATIU5](https://github.com/RATIU5)! - - Refactored the accordion component so it works with the Tabs component, and with nested accordions

  - Refactored the Tabs component to support nested tabs
  - Added a new `active` prop to the Tabs component to set the initial active tab

- [#96](https://github.com/withstudiocms/ui/pull/96) [`ddf67da`](https://github.com/withstudiocms/ui/commit/ddf67da745b4fe9c68077fd01f7c04b9994fbdac) Thanks [@louisescher](https://github.com/louisescher)! - Changes the way colors are declared to allow for a better customization experience.

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

- [#101](https://github.com/withstudiocms/ui/pull/101) [`12eba39`](https://github.com/withstudiocms/ui/commit/12eba3931e50fd5eb727e8aedae3bf57d051014c) Thanks [@RATIU5](https://github.com/RATIU5)! - adds the tooltip component

- [#93](https://github.com/withstudiocms/ui/pull/93) [`bb5ab5a`](https://github.com/withstudiocms/ui/commit/bb5ab5ab409dd96245498631dd35e1d78b742d35) Thanks [@RATIU5](https://github.com/RATIU5)! - Adds StudioCMS Typography using a `.prose` class

## 0.4.17

### Patch Changes

- [#94](https://github.com/withstudiocms/ui/pull/94) [`2b89d92`](https://github.com/withstudiocms/ui/commit/2b89d92eb95277cdb65be6839851bd75650661a9) Thanks [@RATIU5](https://github.com/RATIU5)! - prevents overflow select dropdowns with a scrollable container and enables toggling the dropdown via svg icon click

## 0.4.16

### Patch Changes

- [#83](https://github.com/withstudiocms/ui/pull/83) [`9fc5efb`](https://github.com/withstudiocms/ui/commit/9fc5efb169b7d534cc67d95ecf5f716adace8db4) Thanks [@louisescher](https://github.com/louisescher)! - Fixes selects not being form compatible

## 0.4.15

### Patch Changes

- [#81](https://github.com/withstudiocms/ui/pull/81) [`cbee510`](https://github.com/withstudiocms/ui/commit/cbee5108ad7355cd810297d28bfce7350c931d7f) Thanks [@RATIU5](https://github.com/RATIU5)! - fixes select interfaces and types and adds safety check to prevent duplicate event listeners

## 0.4.14

### Patch Changes

- [#78](https://github.com/withstudiocms/ui/pull/78) [`c27bf16`](https://github.com/withstudiocms/ui/commit/c27bf1633d6ba3d537e7afcd5515be403f477553) Thanks [@louisescher](https://github.com/louisescher)! - Fixes mismatched IDs in the CSS for the double sidebar component

## 0.4.13

### Patch Changes

- [#67](https://github.com/withstudiocms/ui/pull/67) [`ad073b3`](https://github.com/withstudiocms/ui/commit/ad073b3a3cc9fc3d0a9d82fdada17ff487bcca0a) Thanks [@RATIU5](https://github.com/RATIU5)! - Adds multi-select functionality on the select component

## 0.4.12

### Patch Changes

- [#72](https://github.com/withstudiocms/ui/pull/72) [`f183732`](https://github.com/withstudiocms/ui/commit/f18373291c20ffbd69c1e0fb3c23526931f1d8da) Thanks [@louisescher](https://github.com/louisescher)! - Fixes a z-index for starlight variant tabs being too great

## 0.4.11

### Patch Changes

- [#69](https://github.com/withstudiocms/ui/pull/69) [`ef29352`](https://github.com/withstudiocms/ui/commit/ef29352b03b87a34da163ade2aae6652ce819251) Thanks [@louisescher](https://github.com/louisescher)! - Fixes broken styles for flat success buttons in light mode and starlight tabs when used in cards

## 0.4.10

### Patch Changes

- [#63](https://github.com/withstudiocms/ui/pull/63) [`dc7b723`](https://github.com/withstudiocms/ui/commit/dc7b723c86ae9bafd9b8dba626be2345a92a2568) Thanks [@Adammatthiesen](https://github.com/Adammatthiesen)! - Adds a value prop to the checkbox

## 0.4.9

### Patch Changes

- [#61](https://github.com/withstudiocms/ui/pull/61) [`59f4c05`](https://github.com/withstudiocms/ui/commit/59f4c05d303686b139fef632d69c2edf49895ea3) Thanks [@louisescher](https://github.com/louisescher)! - Fixes card footers to be hidden should they have no content

## 0.4.8

### Patch Changes

- [#59](https://github.com/withstudiocms/ui/pull/59) [`f71057d`](https://github.com/withstudiocms/ui/commit/f71057dcc00468d9c4f5584cbbc384dc987c136a) Thanks [@Adammatthiesen](https://github.com/Adammatthiesen)! - Add viewbox attribute for IconBase component

## 0.4.7

### Patch Changes

- [#56](https://github.com/withstudiocms/ui/pull/56) [`40ae2ea`](https://github.com/withstudiocms/ui/commit/40ae2eaa60f0b0df6e0447be5f3e362cbb9bff76) Thanks [@Adammatthiesen](https://github.com/Adammatthiesen)! - Add option to disable global CSS injection and allow users to import the global css themselves.

  Basic Example of how to import:

  ```astro
  ---
  import "studiocms:ui/global-css";
  ---
  ```

## 0.4.6

### Patch Changes

- [#52](https://github.com/withstudiocms/ui/pull/52) [`65eea2c`](https://github.com/withstudiocms/ui/commit/65eea2cff78c2c38314de9b3fe4b65173c81ea90) Thanks [@Adammatthiesen](https://github.com/Adammatthiesen)! - Update Input component to allow search type

## 0.4.5

### Patch Changes

- [#50](https://github.com/withstudiocms/ui/pull/50) [`51d5565`](https://github.com/withstudiocms/ui/commit/51d556504790741ad3b6cd23092b9be0a92e8157) Thanks [@Adammatthiesen](https://github.com/Adammatthiesen)! - fix weird icon sizing during build

## 0.4.4

### Patch Changes

- [#48](https://github.com/withstudiocms/ui/pull/48) [`4a43e03`](https://github.com/withstudiocms/ui/commit/4a43e031b2395ca1cf72c8343638f5836178944e) Thanks [@Adammatthiesen](https://github.com/Adammatthiesen)! - Fix Icon component requiring functions from Iconify Utils lib during runtime as well as extend usage possibilities.

  NEW:

  - `IconBase` component exported from `studiocms:ui/components` which allows passing custom image collections from Iconify.

  Updated:

  - `Icon` component to use this new system.

## 0.4.3

### Patch Changes

- [#46](https://github.com/withstudiocms/ui/pull/46) [`29ea967`](https://github.com/withstudiocms/ui/commit/29ea967c2cee935715de0f4787b603d69997e84b) Thanks [@louisescher](https://github.com/louisescher)! - Fixes icons getting cut off in certain circumstances and changes dropdown links to include icons

## 0.4.2

### Patch Changes

- [#44](https://github.com/withstudiocms/ui/pull/44) [`99a2f79`](https://github.com/withstudiocms/ui/commit/99a2f7959b4269d47c99c87a06ea6711c74a373e) Thanks [@louisescher](https://github.com/louisescher)! - Fixes compatibility issues with Astro view transitions

## 0.4.1

### Patch Changes

- [#40](https://github.com/withstudiocms/ui/pull/40) [`641e4b0`](https://github.com/withstudiocms/ui/commit/641e4b09574eb3d54c08b52be65e36233c2bbd6a) Thanks [@Adammatthiesen](https://github.com/Adammatthiesen)! - Update publish config and files included

## 0.4.0

### Minor Changes

- [#36](https://github.com/withstudiocms/ui/pull/36) [`07e2d9e`](https://github.com/withstudiocms/ui/commit/07e2d9e5a473bdcd516bf4d43e8274988ec796e6) Thanks [@louisescher](https://github.com/louisescher)! - Implement Build step and migrate all exported components into virtual modules

  Instead of `@studiocms/ui/components` use `studiocms:ui/components`

  For more information see https://ui.studiocms.dev

- [#36](https://github.com/withstudiocms/ui/pull/36) [`07e2d9e`](https://github.com/withstudiocms/ui/commit/07e2d9e5a473bdcd516bf4d43e8274988ec796e6) Thanks [@louisescher](https://github.com/louisescher)! - Add a few new components:

  - Accordion
  - Badge
  - Breadcrumbs
  - Group
  - Progress
  - Sidebar

  Add two new colors

  - `info` (Blue)
  - `monochrome` (Black/White)

  Add the ability to pass a CSS file for customization of all colors

## 0.3.2

### Patch Changes

- [#33](https://github.com/withstudiocms/ui/pull/33) [`58e223c`](https://github.com/withstudiocms/ui/commit/58e223c861321e95c8db064be67e28e4563b4ff3) Thanks [@louisescher](https://github.com/louisescher)! - Fix tabs not being displayed correctly & dividers displaying backgrounds for empty slots

## 0.3.1

### Patch Changes

- [#27](https://github.com/withstudiocms/ui/pull/27) [`6b0b58f`](https://github.com/withstudiocms/ui/commit/6b0b58fbbe2a92d4bce7fa44c587164b8f2f53e5) Thanks [@louisescher](https://github.com/louisescher)! - Add pathe as a dependency to deal with path issues on Windows

## 0.3.0

### Minor Changes

- [#18](https://github.com/withstudiocms/ui/pull/18) [`e471e11`](https://github.com/withstudiocms/ui/commit/e471e1129a30ff2a5b019366a8eb7bbbf2abb73e) Thanks [@louisescher](https://github.com/louisescher)! - The Accessibility Update

  This version of `@studiocms/ui` includes a lot of improvements to the documentation and components. The most important changes include the move to
  an integration-based system and a massive keyboard accessibility overhaul (thanks to [HiDeoo](https://github.com/HiDeoo) for the feedback on this)!

  ### Components

  - Added a new `<Tabs />` component based on the tabs on the homepage.
  - Updated the `<Card />` component to include a new "filled" style.

  ### Utilities

  - Moved the `ThemeHelper` class to its own category in the docs.

  ### Accessibility

  - Overhauled the keyboard accessibility on all components to make them adhere to the ARIA standards.

## 0.1.0

### Minor Changes

- [#1](https://github.com/withstudiocms/ui/pull/1) [`14be139`](https://github.com/withstudiocms/ui/commit/14be139876aa2c5ab75fea07ee338afefece6f56) Thanks [@Adammatthiesen](https://github.com/Adammatthiesen)! - Added a new footer component, made accessibility improvements and preparations for first stable release

### Patch Changes

- [#1](https://github.com/withstudiocms/ui/pull/1) [`14be139`](https://github.com/withstudiocms/ui/commit/14be139876aa2c5ab75fea07ee338afefece6f56) Thanks [@Adammatthiesen](https://github.com/Adammatthiesen)! - - Update `<Input />` component's available types

- [#1](https://github.com/withstudiocms/ui/pull/1) [`14be139`](https://github.com/withstudiocms/ui/commit/14be139876aa2c5ab75fea07ee338afefece6f56) Thanks [@Adammatthiesen](https://github.com/Adammatthiesen)! - Added a new searchable select component and improved accessibility for normal selects

- [#1](https://github.com/withstudiocms/ui/pull/1) [`14be139`](https://github.com/withstudiocms/ui/commit/14be139876aa2c5ab75fea07ee338afefece6f56) Thanks [@Adammatthiesen](https://github.com/Adammatthiesen)! - Created new UI Library in preparations for the new StudioCMS Dashboard project

- [#1](https://github.com/withstudiocms/ui/pull/1) [`14be139`](https://github.com/withstudiocms/ui/commit/14be139876aa2c5ab75fea07ee338afefece6f56) Thanks [@Adammatthiesen](https://github.com/Adammatthiesen)! - Added a theme helper and theme toggle component

- [#1](https://github.com/withstudiocms/ui/pull/1) [`14be139`](https://github.com/withstudiocms/ui/commit/14be139876aa2c5ab75fea07ee338afefece6f56) Thanks [@Adammatthiesen](https://github.com/Adammatthiesen)! - Adjusted persistent toasts to include an outline for better visibility

## 0.0.1

### Patch Changes

- Initial Testing release
