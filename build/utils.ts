import { mkdir, readdir, exists as ex, readFile, writeFile } from 'fs'
import { exec } from 'child_process'
import { resolve } from 'path'
const ncp = require('ncp').ncp
const rimraf = require('rimraf')

export const p = (...path: string[]) => resolve(__dirname, ...path)

export const remove = (path: string): Promise<void> =>
  new Promise((resolve, reject) => rimraf(path, (err: any) => err ? reject(err) : resolve()))

export const copy = (src: string, dst: string): Promise<void> =>
  new Promise((resolve, reject) => ncp(src, dst, (err: any) => err ? reject(err) : resolve()))

export const exists = (path: string): Promise<boolean> =>
  new Promise((resolve, _) => ex(path, (exists) => resolve(exists)))

export const create = (path: string): Promise<void> =>
  new Promise((resolve, reject) =>
    exists(path).then(exists => !exists ? (mkdir(path, (err) => err ? reject(err) : resolve())) : resolve())
  )

export const run = (cmd: string, cwd?: string): Promise<string> =>
  new Promise((resolve, reject) => exec(cmd, { cwd }, (err, out) => err ? reject(err) : resolve(out)))

export const files = (path: string, filter: (file: string) => boolean = (_) => true): Promise<string[]> =>
  new Promise((resolve, reject) => readdir(path, (err, files) => err ? reject(err) : resolve(files.filter(filter))))

export const copyJson = (src: string, dst: string, rewriteFields?: { [key: string]: any }): Promise<void> =>
  new Promise(((resolve, reject) => readFile(src, ((err, data) => {
    if (err) reject(err)
    const modified = { ...JSON.parse(data.toString()), ...rewriteFields }
    writeFile(dst, JSON.stringify(modified, null, 2), err => err ? reject(err) : resolve())
  }))))

export const npmInstall = async (pkg: string, path: string) => {
  await run(`npm pack ${pkg}`, p(path))
  const tgz = (await files(p(path), f => f.startsWith(`${pkg}-`)))[0]
  await run(`tar zxvf ${tgz}`, p(path))
  await create(p(path, 'node_modules'))
  await copy(p(path, 'package'), p(path, `node_modules/${pkg}`))
  await remove(p(path, 'package'))
  await remove(p(path, tgz))
}

export const npmGetVersion = async (pkg: string): Promise<string> =>
  (await run(`npm show ${pkg} version`)).trim()

