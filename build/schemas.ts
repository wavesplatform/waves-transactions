import { resolve } from 'path'
import { writeFile } from 'fs-extra'

import * as TJS from 'typescript-json-schema'

export const TYPES = [
  'TTx',
  'IAliasTransaction',
  'IIssueTransaction',
  'ITransferTransaction',
  'IReissueTransaction',
  'IBurnTransaction',
  'IExchangeTransaction',
  'ILeaseTransaction',
  'ICancelLeaseTransaction',
  'IMassTransferTransaction',
  'ISetScriptTransaction',
  'ISetAssetScriptTransaction',
  'IDataTransaction',
  'IOrder',
  'IAliasParams',
  'IIssueParams',
  'ITransferParams',
  'IReissueParams',
  'IBurnParams',
  'ILeaseParams',
  'ICancelLeaseParams',
  'IMassTransferParams',
  'ISetScriptParams',
  'ISetAssetScriptParams',
  'IDataParams',
]

export function buildSchemas() {
  // optionally pass argument to schema generator
  const settings: TJS.PartialArgs = {
    required: true,
    include: ['transactions.ts'],
    excludePrivate: true,
    noExtraProps: false,
  }

  // optionally pass ts compiler options
  const compilerOptions: TJS.CompilerOptions = {
    strictNullChecks: true,
    resolveJsonModule: true,
    allowSyntheticDefaultImports: true,
    downlevelIteration: true,
    lib: [
      'esnext'
    ]
  }

  const program = TJS.getProgramFromFiles([resolve('src/transactions.ts')], compilerOptions)


  TYPES.forEach(type => {
    const id = `https://raw.githubusercontent.com/wavesplatform/waves-transactions/master/src/schemas/${type}.json`
    let schema = TJS.generateSchema(program, type, { ...settings, id })
    //Define generic LONG as string | number in JSON schema. Otherwise ot would be object. Should probably pass param that defines LONG schema;
    schema!.definitions = {...schema!.definitions,  LONG:{type:['string', 'number']}};
    const filePath = `src/schemas/${type}.json`
    const fileContent = JSON.stringify(schema, null, 2)
    writeFile(filePath, fileContent, (err) => {
      if (err) throw err
      console.log(`${type} schema has been written`)
    })
  })

  const manifest = `${TYPES.map(type => `import ${type} from './${type}.json'`).join('\n')}
export default {
  ${TYPES.join(',\n  ')}
}`
  writeFile('src/schemas/manifest.ts', manifest, err1 => {
    if (err1) throw err1
    console.log('Manifest has been written')
  })


}

//buildSchemas()