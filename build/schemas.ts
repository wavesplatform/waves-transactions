import { resolve } from 'path'
import { writeFile } from 'fs-extra'

import * as TJS from 'typescript-json-schema'

export const TYPES = [
  'Tx',
  'AliasTransaction',
  'IssueTransaction',
  'TransferTransaction',
  'ReissueTransaction',
  'BurnTransaction',
  'LeaseTransaction',
  'CancelLeaseTransaction',
  'MassTransferTransaction',
  'SetScriptTransaction',
  'DataTransaction',
  'Order',
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
  }

  const program = TJS.getProgramFromFiles([resolve('src/transactions.ts')], compilerOptions)


  TYPES.forEach(type => {
    const id = `https://github.com/github/ebceu4/blob/master/src/schemas/${type}.json`
    const schema = TJS.generateSchema(program, type, { ...settings, id })
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