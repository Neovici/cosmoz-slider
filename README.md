cosmoz-slider
==================

[![Build Status](https://github.com/Neovici/cosmoz-slider/workflows/Github%20CI/badge.svg)](https://github.com/Neovici/cosmoz-slider/actions?workflow=Github+CI)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

## &lt;cosmoz-slider&gt;

**cosmoz-slider** is a haunted general purpose slider.

## Getting started

### Installing

Using npm:
```bash
npm install --save @neovici/cosmoz-slider
```

### Usage

```js
import { html } from 'lit-html';
import { slideInRight } from '@neovici/cosmoz-slider';

html`<cosmoz-slider .slide=${ {id: 0, content: html`Hello`, animation: slideInRight}} />`;
```
