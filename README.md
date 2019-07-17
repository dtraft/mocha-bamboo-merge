# mocha-bamboo-merge

Merge several [mocha-bamboo](https://github.com/dtraft/mocha-bamboo-reporter) JSON reports. Based off the excellent [mochawesome-merge](https://github.com/Antontelesh/mochawesome-merge)

## Installation

via `yarn`:

```
$ yarn add mocha-bamboo-merge --dev
```

via `npm`:

```
$ npm install mocha-bamboo-merge --save-dev
```

## Usage

```javascript
const { merge } = require('mocha-bamboo-merge')

// See Options below
const options = {
  reportDir: 'report',
}
merge(options).then(report => {
  console.log(report)
})
```

## CLI

```
$ mocha-bamboo-merge --reportDir [directory] > output.json
```

## Options

- `reportDir` (optional) — source mocha-bamboo JSON reports directory. Defaults to `mocha-bamboo-report`.

## [Cypress](https://github.com/cypress-io/cypress)

The main motivation to create this library was to be able to use [mocha-bamboo](https://github.com/adamgruber/mocha-bamboo) together with [Cypress](https://github.com/cypress-io/cypress).

Since the version `3.0.0`, Cypress runs every spec separately, which leads to generating multiple mocha-bamboo reports, one for each spec. `mocha-bamboo-merge` can be used to merge these reports and then generate one HTML report for all your cypress tests.

First, configure `cypress.json`:

```jsonc
{
  // use mocha-bamboo-reporter
  "reporter": "mocha-bamboo-reporter",
  "reporterOptions": {
    "output": "cypress/results/mocha-[hash].json"
  }
}
```

You can use CLI to merge JSON reports and generate HTML report.
For example, an AWS CodeBuild `buildspec.yml` file might look something like this:

```yaml
phases:
  install:
    commands:
      - yarn install
  build:
    commands:
      - yarn cypress run
  post_build:
    commands:
      - yarn mocha-bamboo-merge > mocha-bamboo.json
      - yarn marge mocha-bamboo.json
```
