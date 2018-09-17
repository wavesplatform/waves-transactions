import { mkdir } from "fs"
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

async function build() {
  await remove(p('tmp'))
  await create(p('tmp'))
  await create(p('tmp/src'))
  await copy(p('../src'), p('tmp/src'))
  await copy(p('../usage'), p('tmp/usage'))
  await copy(p('../tsconfig.json'), p('tmp/tsconfig.json'))
  await run('ts-node usage/index.ts', p('tmp'))
  await run('tsc', p('tmp'))
  await copy(p('package.json'), p('tmp/dist/package.json'))
  await copy(p('../README.md'), p('tmp/dist/README.md'))
  await copy(p('tmp/dist'), p('../dist'))
  await remove(p('tmp'))
}

build()