import { remove, p, run, copy, create, copyJson, npmInstall } from './utils'

async function build() {
  try {
    await remove(p('tmp'))
    await remove(p('../dist'))
    await remove(p('../docs'))
    await create(p('tmp'))
    await create(p('tmp/src'))

    await npmInstall('typedoc-clarity-theme', 'tmp')
    await npmInstall('waves-crypto', 'tmp')

    await copy(p('../src'), p('tmp/src'))
    await copy(p('../usage'), p('tmp/usage'))
    await copy(p('../tsconfig.json'), p('tmp/tsconfig.json'))
    await run('tsc', p('tmp'))
    await create(p('tmp/node_modules/@waves/'))
    await copy(p('tmp/dist'), p('tmp/node_modules/@waves/waves-transactions'))
    await copyJson(p('../package.json'), p('tmp/node_modules/@waves/waves-transactions/package.json'), { main: 'index.js', types: 'index.d.ts' })
    await remove(p('tmp/dist'))
    await run('ts-node usage/index.ts', p('tmp'))
    await run('typedoc', p('tmp'))
    await run('tsc', p('tmp'))
    // const latestVersion = await npmGetVersion('@waves/waves-transactions')
    // await copyJson(p('../package.json'), p('tmp/dist/package.json'),
    //   {
    //     main: 'index.js',
    //     types: 'index.d.ts',
    //     version: latestVersion,
    //     //dependencies: undefined,
    //     devDependencies: undefined,
    //     scripts: undefined,
    //   })
    // await copy(p('../README.md'), p('tmp/dist/README.md'))
    await copy(p('tmp/dist'), p('../dist'))
    await copy(p('tmp/docs'), p('../docs'))
    await remove(p('tmp'))
  } catch (error) {
    console.log(error)
  }
}

build()
