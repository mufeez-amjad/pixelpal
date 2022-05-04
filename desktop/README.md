## Setup Project

```
yarn
yarn build
yarn electron:serve
```

You may need to code sign the electron app on dev

```
codesign --deep --force --verbose --sign - node_modules/electron/dist/Electron.app
```