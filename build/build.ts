import { mkdir, readdir } from "fs"
import { exec } from "child_process"
import { resolve } from "path"
const ncp = require('ncp').ncp
const rimraf = require('rimraf')

type error = string

const p = (...path: string[]) => resolve(__dirname, ...path)

const remove = (path: string): Promise<void | error> =>
  new Promise((resolve, reject) => rimraf(path, (err) => err ? reject(err) : resolve()))

const copy = (src: string, dst: string): Promise<void | error> =>
  new Promise((resolve, reject) => ncp(src, dst, (err) => err ? reject(err) : resolve()))

const create = (path: string): Promise<void | error> =>
  new Promise((resolve, reject) => mkdir(path, (err) => err ? reject(err) : resolve()))

const run = (cmd: string, cwd?: string): Promise<void | error> =>
  new Promise((resolve, reject) => exec(cmd, { cwd }, (err) => err ? reject(err) : resolve()))

const files = (path: string, filter: (file: string) => boolean = (_) => true): Promise<string[] | Error> =>
  new Promise((resolve, reject) => readdir(path, (err, files) => err ? reject(err) : resolve(files.filter(filter))))

async function build() {
  try {
    await remove(p('tmp'))
    await create(p('tmp'))
    await create(p('tmp/src'))
    //  await run('npm pack waves-transactions', p('tmp'))
    //  const tgz = (await files(p('tmp'), f => f.startsWith('waves-transactions-')))[0]
    //  await run(`tar zxvf ${tgz}`, p('tmp'))
    //  await create(p('tmp/node_modules'))
    //  await copy(p('tmp/package'), p('tmp/node_modules/waves-transactions'))

    await copy(p('../src'), p('tmp/src'))
    await copy(p('../usage'), p('tmp/usage'))
    await copy(p('../tsconfig.json'), p('tmp/tsconfig.json'))
    await run('tsc', p('tmp'))
    await create(p('tmp/node_modules'))
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