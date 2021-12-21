# [2.0.0-next-major.3](https://github.com/andipaetzold/react-firehooks/compare/v2.0.0-next-major.2...v2.0.0-next-major.3) (2021-12-21)


### Bug Fixes

* move default exports condition to end ([cbe32b9](https://github.com/andipaetzold/react-firehooks/commit/cbe32b978c89dc77efdae3002c5512585a409ea9))

# [2.0.0-next-major.2](https://github.com/andipaetzold/react-firehooks/compare/v2.0.0-next-major.1...v2.0.0-next-major.2) (2021-12-21)


### Bug Fixes

* move default exports condition to end ([0562179](https://github.com/andipaetzold/react-firehooks/commit/05621793c6515426d738bf02d573512ec14e8fdc))

# [2.0.0-next-major.1](https://github.com/andipaetzold/react-firehooks/compare/v1.6.0...v2.0.0-next-major.1) (2021-12-21)


* feat!: require firebase 9.5.0 or later ([5dd8110](https://github.com/andipaetzold/react-firehooks/commit/5dd81103bfffc1faf018e7661bddebb066ed4288))
* feat!: make package ESM only ([8d47128](https://github.com/andipaetzold/react-firehooks/commit/8d47128ceee8a8d1f68977d03230854105592051))


### Features

* **storage:** add useBlob & useStream ([f92ca24](https://github.com/andipaetzold/react-firehooks/commit/f92ca246cfd2d12777dd27f5003af6f9246f7018))


### BREAKING CHANGES

* require firebase 9.5.0 or later
* make package ESM only

# [1.6.0](https://github.com/andipaetzold/react-firehooks/compare/v1.5.1...v1.6.0) (2021-12-21)


### Features

* **storage:** add useMetadata ([dbb25e0](https://github.com/andipaetzold/react-firehooks/commit/dbb25e042c57e5cdf1dde36b0aea5ca0d7aeca6e))

## [1.5.1](https://github.com/andipaetzold/react-firehooks/compare/v1.5.0...v1.5.1) (2021-12-21)


### Bug Fixes

* add missing `messaging` folder to package ([0fbfc6d](https://github.com/andipaetzold/react-firehooks/commit/0fbfc6de903ca359f1d249b3eee57272194305b6))

# [1.5.0](https://github.com/andipaetzold/react-firehooks/compare/v1.4.2...v1.5.0) (2021-11-19)


### Features

* **storage:** add `useBytes` ([#31](https://github.com/andipaetzold/react-firehooks/issues/31)) ([462089f](https://github.com/andipaetzold/react-firehooks/commit/462089f10cc98317be785e3c6f104104aa1e2bcf))

# [1.5.0-next.2](https://github.com/andipaetzold/react-firehooks/compare/v1.5.0-next.1...v1.5.0-next.2) (2021-11-19)


### Bug Fixes

* **storage:** use `require` in `useBytes` ([9822fa0](https://github.com/andipaetzold/react-firehooks/commit/9822fa03a4c2f1cf0c7809c049073157a2a20bbc))

# [1.5.0-next.1](https://github.com/andipaetzold/react-firehooks/compare/v1.4.2...v1.5.0-next.1) (2021-11-19)


### Features

* **storage:** add `useBytes` ([205869c](https://github.com/andipaetzold/react-firehooks/commit/205869c5b372e69112280400e3a652e4502a7a41))

## [1.4.2](https://github.com/andipaetzold/react-firehooks/compare/v1.4.1...v1.4.2) (2021-10-22)


### Bug Fixes

* loading state for undefined refs/queries ([#16](https://github.com/andipaetzold/react-firehooks/issues/16)) ([385a5de](https://github.com/andipaetzold/react-firehooks/commit/385a5def225df12b521b83896495104ea0e9d82f))

## [1.4.1](https://github.com/andipaetzold/react-firehooks/compare/v1.4.0...v1.4.1) (2021-10-20)


### Bug Fixes

* **auth:** only use currentUser as default if signed in ([3c9086d](https://github.com/andipaetzold/react-firehooks/commit/3c9086dd845bcc488b942d8e129f8ac046fb1c02))

# [1.4.0](https://github.com/andipaetzold/react-firehooks/compare/v1.3.1...v1.4.0) (2021-10-17)


### Bug Fixes

* **auth:** don't return loading state if currentUser is set ([fa53819](https://github.com/andipaetzold/react-firehooks/commit/fa53819683852f0546d158fe037a73b86dc4d53c))


### Features

* **messaging:** add useMessagingToken ([#9](https://github.com/andipaetzold/react-firehooks/issues/9)) ([8bc1f4e](https://github.com/andipaetzold/react-firehooks/commit/8bc1f4e5443ea4e0189bf054d017c96dcaabb2d2))

## [1.3.1](https://github.com/andipaetzold/react-firehooks/compare/v1.3.0...v1.3.1) (2021-10-17)


### Bug Fixes

* **auth:** skip initial load if currentUser is set ([b345137](https://github.com/andipaetzold/react-firehooks/commit/b345137f83bf05e48c9906a887b84b4d744a1315))

# [1.3.0](https://github.com/andipaetzold/react-firehooks/compare/v1.2.4...v1.3.0) (2021-10-17)


### Features

* **database:** add converter option to useObjectValue hooks ([8cb8511](https://github.com/andipaetzold/react-firehooks/commit/8cb8511f446ab31cbe3543be3dcbeddc6ecaf7ad))

## [1.2.4](https://github.com/andipaetzold/react-firehooks/compare/v1.2.3...v1.2.4) (2021-10-15)


### Bug Fixes

* **database:** correctly name useObject & useObjectOnce ([4c7b83e](https://github.com/andipaetzold/react-firehooks/commit/4c7b83eeb5abe3337663fe65925f1b0372d75347))
* **database:** export all hooks ([704065c](https://github.com/andipaetzold/react-firehooks/commit/704065c76055580a430ed107c3a52a21a2789004))

## [1.2.3](https://github.com/andipaetzold/react-firehooks/compare/v1.2.2...v1.2.3) (2021-10-15)


### Bug Fixes

* **database:** use new query when changing from/to undefined ([a096c41](https://github.com/andipaetzold/react-firehooks/commit/a096c41223a45c096172a7e7b60fd4e11938aaa4))
* **firestore:** use new ref/query when changing from/to undefined ([981ec92](https://github.com/andipaetzold/react-firehooks/commit/981ec922daf76fbfb3618c326de76910d306890b))

## [1.2.2](https://github.com/andipaetzold/react-firehooks/compare/v1.2.1...v1.2.2) (2021-10-15)


### Bug Fixes

* **firestore:** remove GetOptions ([cd08bd3](https://github.com/andipaetzold/react-firehooks/commit/cd08bd38a53459d8c50aa105ed179ae644539719))

## [1.2.1](https://github.com/andipaetzold/react-firehooks/compare/v1.2.0...v1.2.1) (2021-10-15)


### Bug Fixes

* mark modules as side-effect-free ([235029e](https://github.com/andipaetzold/react-firehooks/commit/235029ef741070d834f16e846a0793e7939148ce))

# [1.2.0](https://github.com/andipaetzold/react-firehooks/compare/v1.1.2...v1.2.0) (2021-10-15)


### Features

* **auth:** add auth module ([12ab9ca](https://github.com/andipaetzold/react-firehooks/commit/12ab9ca5390e81cea63ac7a93d39202cc36da23f))
* **database:** add database module ([e202767](https://github.com/andipaetzold/react-firehooks/commit/e20276768cca9fa6e3a23b7a34a7f5a3ee81acca))

## [1.1.2](https://github.com/andipaetzold/react-firehooks/compare/v1.1.1...v1.1.2) (2021-10-14)


### Bug Fixes

* export individual modules with package.json ([18ab7e3](https://github.com/andipaetzold/react-firehooks/commit/18ab7e3d06100b397d6cdc4e36b1c0a755669bdd))

## [1.1.1](https://github.com/andipaetzold/react-firehooks/compare/v1.1.0...v1.1.1) (2021-10-14)


### Bug Fixes

* allow null & undefined as storage reference ([3c95bd5](https://github.com/andipaetzold/react-firehooks/commit/3c95bd58c5b0c972dd26e4334981919b83f7682f))

# [1.1.0](https://github.com/andipaetzold/react-firehooks/compare/v1.0.1...v1.1.0) (2021-10-14)


### Features

* add one export per module ([c755b75](https://github.com/andipaetzold/react-firehooks/commit/c755b757b451f21072a2a0eb95106576fe706d5d))
* add storage module ([32a6d4d](https://github.com/andipaetzold/react-firehooks/commit/32a6d4dc9bf205afbc14cdf6077fc8459dd2d805))

## [1.0.1](https://github.com/andipaetzold/react-firehooks/compare/v1.0.0...v1.0.1) (2021-10-14)


### Bug Fixes

* accept null as reference & query ([1a4300e](https://github.com/andipaetzold/react-firehooks/commit/1a4300e7bd0727196dd69d311d76fb25f3b43526))

# 1.0.0 (2021-10-14)


### Features

* firestore hooks ([37ac438](https://github.com/andipaetzold/react-firehooks/commit/37ac438a6886d75b732e1d7fca73d1a65a43928c))
