import { readFileSync } from "fs"
import { runInNewContext } from "vm"

const pp = require('preprocess')

const txs = [
  { file: 'burn', interface: 'BurnTransaction' },
  { file: 'cancel-lease', interface: 'CancelLeaseTransaction' },
  { file: 'data', interface: 'DataTransaction' },
  { file: 'issue', interface: 'IssueTransaction' },
  { file: 'lease', interface: 'LeaseTransaction' },
  { file: 'mass-transfer', interface: 'MassTransferTransaction' },
  { file: 'reissue', interface: 'ReissueTransaction' },
  { file: 'transfer', interface: 'TransferTransaction' },
  { file: 'alias', interface: 'AliasTransaction' },
  { file: 'set-script', interface: 'SetScriptTransaction' },
]

const _DOCS = `/**
 * Creates and signs [[<!-- @echo TRANSACTION_TYPE -->]].
 *
 * You can use this function with multiple seeds. In this case it will sign transaction accordingly and will add one proof per seed.
 * Also you can use already signed [[<!-- @echo TRANSACTION_TYPE -->]] as a second argument.
 * 
 * ### Usage
 * \`\`\`js
<!-- @echo USAGE_JS -->
 * \`\`\`
 * ### Output
 * \`\`\`json
<!-- @echo OUTPUT -->
 * \`\`\`
 *
 * @param seed
 * @param paramsOrTx
 * @returns
 *
 */`

function use(filename: string) {
  const box: any = {
    output: undefined,
    require: (r) =>
      require(r),
    console: {
      log: (str) => {
        box.output = { id: str.id, ...str }
      }
    }
  }
  var file = readFileSync(filename, { encoding: 'utf8' })
  const regex = /import\s+\{\s*(\w+)\s*\}\s*from\s+('|")[\w\.\/]+('|")/gm
  file = file.replace(regex, (s, a) => {
    return `const { ${a} } = require('waves-transactions')`
  })

  runInNewContext(file, box)
  const lines = file.split('\n')
  lines.pop()
  const contents = lines.map(l => ' * ' + l).join('\n')
  const output = JSON.stringify(box.output, undefined, 2).split('\n').map(l => ' * ' + l).join('\n')

  return { contents, output }
}

txs.forEach(t => {
  const x = use(`./usage/${t.file}.ts`)

  const DOCS = pp.preprocess(_DOCS, {
    TRANSACTION_TYPE: t.interface,
    USAGE_JS: x.contents,
    OUTPUT: x.output
  })

  pp.preprocessFile(`./src/transactions/${t.file}.ts`, `./src/transactions/${t.file}.ts`, { DOCS }, (err) => {
    console.log(err)
  })
})