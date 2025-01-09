<p align="center">
  <br>
  <a href="https://github.com/{{ github }}/{{ name }}">
    <img src="{{ logo }}" alt="{{ namePascal }} - {{ description }}" height="120">
  </a>
</p>
<h3 align="center">{{ description }}</h3>

<br>
<br>
{% if badges %}
<p align="center">
  <a href="https://www.npmjs.com/package/{{ name }}" target="__blank">
    <img src="https://img.shields.io/npm/v/{{ name }}?color=a1b858" alt="NPM version">
  </a>
  <a href="https://github.com/{{ github }}/{{ name }}/blob/main/LICENSE" target="__blank">
    <img src="https://img.shields.io/npm/l/{{ name }}" alt="license">
  </a>
  <a href="https://www.npmjs.com/package/{{ name }}" target="__blank">
    <img src="https://img.shields.io/npm/dm/{{ name }}" alt="NPM downloads">
  </a>
</p>
{% if build.length %}
<p align="center">{% if build.includes('github-actions') %}
  <a href="https://github.com/{{ github }}/{{ name }}/actions/workflows/release.yml" target="__blank">
    <img src="https://img.shields.io/github/actions/workflow/status/{{ github }}/{{ name }}/release.yml" alt="GitHub actions">
  </a>{% endif %}{% if build.includes('codecov') %}
  <a href="https://codecov.io/gh/{{ github }}/{{ name }}" target="__blank">
    <img src="https://img.shields.io/codecov/c/github/{{ github }}/{{ name }}?flag=core" alt="coverage">
  </a>{% endif %}
</p>
{% endif %}{% if social.length %}
<p align="center">{% if npm %}
  <a href="https://www.npmjs.com/~{{ name }}">
    <img src="https://img.shields.io/badge/NPM-CB3837.svg?logo=npm&logoColor=white" alt="NPM">
  </a>{% endif %}{% if juejin %}
  <a href="https://juejin.cn/user/{{ juejin }}/posts">
    <img src="https://img.shields.io/badge/稀土掘金-007FFF.svg?logo=juejin&logoColor=white" alt="稀土掘金">
  </a>{% endif %}{% if github %}
  <a href="https://github.com/{{ github }}/{{ name }}" target="__blank">
    <img alt="GitHub stars" src="https://img.shields.io/github/stars/{{ github }}/{{ name }}?style=social">
  </a>{% endif %}
</p>
{% endif %}{% endif %}
<br>
{% if contents.includes('Introduction') %}
## What is {{ namePascal }}

[AFFiNE](https://affine.pro) is an open-source, all-in-one workspace and an operating system for all the building blocks that assemble your knowledge base and much more -- wiki, knowledge management, presentation and digital assets. It's a better alternative to Notion and Miro.
{% endif %}
{% if contents.includes('Preview') %}
## Preview
<img src="https://picsum.photos/1200/740/?random" style="width: 100%"/>
{% endif %}
{% if contents.includes('Features') %}
## Features

Inspired by [Windi CSS](http://windicss.org/), [Tailwind CSS](https://tailwindcss.com/), and [Twind](https://github.com/tw-in-js/twind), but:

- [Fully customizable](https://unocss.dev/config/) - no core utilities. All functionalities are provided via presets.
- No parsing, no AST, no scanning, it's **INSTANT** (5x faster than Windi CSS or Tailwind JIT).
- ~6kb min+brotli - zero deps and browser friendly.
- [Shortcuts](https://unocss.dev/config/shortcuts) - aliasing utilities, dynamically.
- [Attributify mode](https://unocss.dev/presets/attributify/) - group utilities in attributes.
- [Pure CSS Icons](https://unocss.dev/presets/icons/) - use any icon as a single class.
- [Variant Groups](https://unocss.dev/transformers/variant-group) - shorthand for group utils with common prefixes.
- [CSS Directives](https://unocss.dev/transformers/directives) - reuse utils in CSS with `@apply` directive.
- [Compilation mode](https://unocss.dev/transformers/compile-class/) - synthesizes multiple classes into one at build time.
- [Inspector](https://unocss.dev/tools/inspector) - inspect and debug interactively.
- [CSS-in-JS Runtime build](https://unocss.dev/integrations/runtime) - use UnoCSS with one line of CDN import.
- [VS Code extension](https://marketplace.visualstudio.com/items?itemName=antfu.unocss)
- Code-splitting for CSS - ships minimal CSS for MPA.
{% endif %}
{% if contents.includes('GettingStarted') %}
## Getting Started

### Installation

```shell
pnpm add {{ name }}
```
 
### Usage

```js
import { xxx } from '{{ name }}'
```

Read [Documents](https://kythuen.github.io/{{ name }}) for more detail usage.
{% endif %}

{% if contents.includes('Questions') %}
## Questions
For questions and support please use [the official forum](https://github.com/Kythuen/ephemeras/discussions). 

The issue list of this repo is **exclusively** for bug reports and feature requests.{% endif %}

{% if contents.includes('Contribution') %}
## Contribution
Please make sure to read the [Contributing Guide](./CONTRIBUTING.md) before making a pull request. 

If you have a related project/component/tool, add it with a pull request to [this curated list](https://github.com/Kythuen/awesome).

Thank you to all the people who already contributed to Ephemeras!

<a href="https://github.com/Kythuen/ephemeras/graphs/contributors"><img src="https://opencollective.com/ephemeras/contributors.svg?width=890" /></a>
{% endif %}

{% if contents.includes('License') %}
## License
[MIT](./LICENSE) License &copy; 2021-PRESENT [{{ github }}](https://github.com/{{ github }})
{% endif %}