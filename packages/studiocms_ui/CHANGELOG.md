# @studiocms/ui

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
