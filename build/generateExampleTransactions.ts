import { TransactionType } from '../src/transactions'
import { txTypeMap } from '../src/general'
import { writeFileSync } from 'fs'
import { execSync } from 'child_process'
import { minimalParams } from '../test/minimalParams'

const seed = 'b0ccc0b232c246ac940abecb6a5a939c56fb7ea10f374ca48f698736ac10b000'

const c = Object.keys(TransactionType).length / 2
const typeNumbers = Object.keys(TransactionType).slice(0, c)
const typeNames = Object.keys(TransactionType).slice(c)

const types = typeNumbers
  .map((n, i) => minimalParams[parseInt(n)] != null ? { n, name: typeNames[i] } : undefined)
  .filter(x => x != null)
  .reduce((a, b) => ({ ...a, [b.n]: b.name }), {})

const objectToSource = (obj: any) =>
  execSync('node -e \'console.log(JSON.parse(`' + JSON.stringify(obj) + '`))\'', { encoding: 'utf8' })

const r = Object.keys(types)
  .map((t) => txTypeMap[t].sign(minimalParams[t], seed))
  .map(async (tx) => `export const ${types[tx.type].slice(0, 1).toLowerCase()}${types[tx.type].slice(1)}Tx = ${objectToSource(tx)}`)

async function main() {
  const rr = await Promise.all(r)
  writeFileSync('./test/exampleTxs.ts', rr.join('\n'))
}

main()
