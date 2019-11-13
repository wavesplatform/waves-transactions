import { readFileSync } from 'fs'
import { runInNewContext } from 'vm'

const pp = require('preprocess')

const txs = [
  { file: 'burn', interface: 'IBurnTransaction' },
  { file: 'cancel-lease', interface: 'ICancelLeaseTransaction' },
  { file: 'data', interface: 'IDataTransaction' },
  { file: 'issue', interface: 'IIssueTransaction' },
  { file: 'lease', interface: 'ILeaseTransaction' },
  { file: 'mass-transfer', interface: 'IMassTransferTransaction' },
  { file: 'reissue', interface: 'IReissueTransaction' },
  { file: 'transfer', interface: 'ITransferTransaction' },
  { file: 'alias', interface: 'IAliasTransaction' },
  { file: 'set-script', interface: 'ISetScriptTransaction' },
  { file: 'sponsorship', interface: 'ISponsorshipTransaction' },
  { file: 'invoke-script', interface: 'IInvokeScriptTransaction' },
]

const _DOCS = `/**
 * Creates and signs [[<!-- @echo TRANSACTION_TYPE -->]].
 *
 * If no senderPublicKey is set, it will be derived from seed.
 * In case sender and signer are different, you need to pass senderPublicKey explicitly.
 *
 * You can use this function with multiple seeds. In this case it will sign transaction accordingly and will add one proof per seed.
 * Also you can use already formed [[<!-- @echo TRANSACTION_TYPE -->]] instead of params.
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
 */`

function use(filename: string) {
  const box: any = {
    output: undefined,
    require: (r: any) =>
      require(r),
    console: {
      log: (str: any) => {
        box.output = { id: str.id, ...str }
      },
    },
  }
  var file = readFileSync(filename, { encoding: 'utf8' })
  const regex = /import\s+\{\s*(\w+)\s*\}\s*from\s+('|")[\w\.\/]+('|")/gm
  file = file.replace(regex, (s, a) => {
    return `const { ${a} } = require('@waves/waves-transactions')`
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
    OUTPUT: x.output,
  })

  pp.preprocessFile(`./src/transactions/${t.file}.ts`, `./src/transactions/${t.file}.ts`, { DOCS }, (err: any) => {
    console.log(err)
  })
})
