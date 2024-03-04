# Why?

This chrome extension allows you to access your Notr notes very fast.

# How to use

For now, in order to use this chrome extension you will need to build it from source and manually add it to your browser.

# Installation Guide

## Requirements

You will need pnpm version 8.14.1 or higher (older version may work, but if you face any issues just update pnpm by running `npm install pnpm -G`)

## Installation

First you need to clone this repo

```
git clone https://github.com/Meriegg/notr-chrome.git
```

And install the packages:

```
pnpm install
```

Then you need to build your extension:

```
pnpm run build
```

Finally, you need to manually add the generated `dist` folder to your browser:

1. Go to chrome://extensions (for edge: edge://extensions)
2. At the top right, turn on *Developer mode* (for edge: on the left sidebar, turn on *Developer mode*)
3. Click *Load unpacked*
4. Select the generated `dist` folder.
5. Open a new tab and check if the extension works correctly.
6. Enjoy!

