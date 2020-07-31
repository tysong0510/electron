# voxpop

## Development environment prerequisites

All platforms

- Node.js
- Yarn
- `yarn global add @vue/cli`

Windows users

- `yarn global add ramda`
- `yarn global add node-gyp`
- `yarn global add node-pre-gyp`
- `yarn global add build-tools`

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn serve
```

### Compiles and minifies for production (current OS)

```
yarn build
```

### Compiles and minifies for production (for Windows)

```
yarn build:win
```

### Compiles and minifies for production (for Linux)

```
yarn build:linux
```

### Compiles and minifies for production (for Mac OS) `Mac OS only`

```
yarn build:mac
```

### Compiles and minifies for production (All OS) `Mac OS only`

```
yarn build:all
```

### Compiles and minifies for staging (current OS)

```
yarn build:staging
```

### Build and publish to github releases

```
yarn build --mac --win -p always
```

### Build and publish to github releases for Mac and 32/64 bit Windows

```
yarn build --mac --win --x64 --ia32 -p always
```

### Run your tests

```
yarn test
```

### Lints and fixes files

```
yarn lint
```

### Run end-to-end tests

```
yarn run test:e2e
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
