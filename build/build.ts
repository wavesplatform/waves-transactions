import { remove, p, run, files, copy, create } from "./utils";

async function build() {
  try {
    await remove(p('tmp'))
    await remove(p('../dist'))
    await remove(p('../docs'))
    await create(p('tmp'))
    await create(p('tmp/src'))

    await run('npm pack typedoc-clarity-theme', p('tmp'))
    const tgz = (await files(p('tmp'), f => f.startsWith('typedoc-clarity-theme-')))[0]
    await run(`tar zxvf ${tgz}`, p('tmp'))
    await create(p('tmp/node_modules'))
    await copy(p('tmp/package'), p('tmp/node_modules/typedoc-clarity-theme'))

    await copy(p('../src'), p('tmp/src'))
    await copy(p('../usage'), p('tmp/usage'))
    await copy(p('../tsconfig.json'), p('tmp/tsconfig.json'))
    await run('tsc', p('tmp'))
    await copy(p('tmp/dist'), p('tmp/node_modules/waves-transactions'))
    await copy(p('package.json'), p('tmp/node_modules/waves-transactions/package.json'))
    await remove(p('tmp/dist'))
    await run('ts-node usage/index.ts', p('tmp'))
    await run('typedoc', p('tmp'))
    await run('tsc', p('tmp'))
    await copy(p('package.json'), p('tmp/dist/package.json'))
    await copy(p('../README.md'), p('tmp/dist/README.md'))
    await copy(p('tmp/dist'), p('../dist'))
    await copy(p('tmp/docs'), p('../docs'))
    await remove(p('tmp'))
  } catch (error) {
    console.log(error)
  }
}

build()