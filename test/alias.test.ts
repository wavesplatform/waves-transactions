import { publicKey, verifySignature } from 'waves-crypto'
import { alias } from '../src'
import { aliasToBytes } from '../src/transactions/alias'
import { aliasMinimalParams } from './testMinimalParams'

describe('alias', () => {

  const stringSeed = 'df3dd6d884714288a39af0bd973a1771c9f00f168cf040d6abb6a50dd5e055d8'

  it('should build from minimal set of params', () => {
    const tx = alias({ ...aliasMinimalParams }, stringSeed)
    expect(tx).toMatchObject({ ...aliasMinimalParams })
  })

  it('should build from minimal set of params with additional properties', () => {
    const tx = alias({ ...aliasMinimalParams, a: 10000 } as any, stringSeed)
    expect(tx).toMatchObject({ ...aliasMinimalParams })
  })

  it('Should throw on schema validation', () => {
    const aliasMinimalParams = {
      alias: null,
    }

    const tx = () => alias({ ...aliasMinimalParams } as any, stringSeed)
    expect(tx).toThrow(`{
  "keyword": "type",
  "dataPath": ".alias",
  "schemaPath": "#/properties/alias/type",
  "params": {
    "type": "string"
  },
  "message": "should be string"
}`)
  })

  it('Should throw 2 errors with fee validation', () => {
    const aliasMinimalParams = {
      alias: '',
      fee: -1,
    }

    const tx = () => alias({ ...aliasMinimalParams }, stringSeed)
    expect(tx).toThrow(`[fee is lees than 100000,
alias is empty or undefined]`)
  })

  it('Should get correct signature', () => {
    const tx = alias({ ...aliasMinimalParams }, stringSeed)
    expect(verifySignature(publicKey(stringSeed), aliasToBytes(tx), tx.proofs[0]!)).toBeTruthy()
  })

  it('Should get correct multiSignature', () => {
    const stringSeed2 = 'example seed 2'
    const tx = alias({ ...aliasMinimalParams }, [null, stringSeed, null, stringSeed2])
    expect(verifySignature(publicKey(stringSeed), aliasToBytes(tx), tx.proofs[1]!)).toBeTruthy()
    expect(verifySignature(publicKey(stringSeed2), aliasToBytes(tx), tx.proofs[3]!)).toBeTruthy()
  })
})