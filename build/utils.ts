import { mkdir, readdir } from "fs"
import { exec } from "child_process"
import { resolve } from "path"
const ncp = require('ncp').ncp
const rimraf = require('rimraf')

export const p = (...path: string[]) => resolve(__dirname, ...path)

export const remove = (path: string): Promise<void> =>
  new Promise((resolve, reject) => rimraf(path, (err) => err ? reject(err) : resolve()))

export const copy = (src: string, dst: string): Promise<void> =>
  new Promise((resolve, reject) => ncp(src, dst, (err) => err ? reject(err) : resolve()))

export const create = (path: string): Promise<void> =>
  new Promise((resolve, reject) => mkdir(path, (err) => err ? reject(err) : resolve()))

export const run = (cmd: string, cwd?: string): Promise<string> =>
  new Promise((resolve, reject) => exec(cmd, { cwd }, (err, out) => err ? reject(err) : resolve(out)))

export const files = (path: string, filter: (file: string) => boolean = (_) => true): Promise<string[]> =>
  new Promise((resolve, reject) => readdir(path, (err, files) => err ? reject(err) : resolve(files.filter(filter))))
