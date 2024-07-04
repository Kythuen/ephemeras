---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Ephemeras"
  text: "Make development easier and more efficient"
  image:
    src: /brand.png
    alt: Ephemeras
  actions:
    - theme: brand
      text: Getting Started
      link: /guide/

features:
  - title: '@ephemeras/linter'
    details: Command line tool, quickly configuring and completing project code standardization construction.
    link: /linter

  - title: '@ephemeras/compiler'
    details: File template compilation tool.
    link: /compiler

  - title: '@ephemeras/file'
    details: File editing tool based on AST, make modify JS/TS files easilier.
    link: /file

  - title: '@ephemeras/profile'
    details: Configuration file management, makes it easy to create and manage configuration information.
    link: /profile

  - title: '@ephemeras/fs'
    details: File system  management, superset of `node:fs/promise`, providing more user-friendly features.
    link: /fs
    
  - title: '@ephemeras/utils'
    details: Tool collections provide useful features for front-end building, efficient and reliable.
    link: /utils
---

