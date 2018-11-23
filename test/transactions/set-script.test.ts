import { verifySignature, publicKey, } from 'waves-crypto'
import { setScript } from '../../src'
import { ISetScriptTransaction } from '../../src/transactions'
import { setScriptToBytes } from '../../src/transactions/set-script'

describe('setScript', () => {

  const seed = 'test seed'
  const seed2 = 'test seed 2'
  const compiledContract = 'AQQAAAALYWxpY2VQdWJLZXkBAAAAID3+K0HJI42oXrHhtHFpHijU5PC4nn1fIFVsJp5UWrYABAAAAAlib2JQdWJLZXkBAAAAIBO1uieokBahePoeVqt4/usbhaXRq+i5EvtfsdBILNtuBAAAAAxjb29wZXJQdWJLZXkBAAAAIOfM/qkwkfi4pdngdn18n5yxNwCrBOBC3ihWaFg4gV4yBAAAAAthbGljZVNpZ25lZAMJAAH0AAAAAwgFAAAAAnR4AAAACWJvZHlCeXRlcwkAAZEAAAACCAUAAAACdHgAAAAGcHJvb2ZzAAAAAAAAAAAABQAAAAthbGljZVB1YktleQAAAAAAAAAAAQAAAAAAAAAAAAQAAAAJYm9iU2lnbmVkAwkAAfQAAAADCAUAAAACdHgAAAAJYm9keUJ5dGVzCQABkQAAAAIIBQAAAAJ0eAAAAAZwcm9vZnMAAAAAAAAAAAEFAAAACWJvYlB1YktleQAAAAAAAAAAAQAAAAAAAAAAAAQAAAAMY29vcGVyU2lnbmVkAwkAAfQAAAADCAUAAAACdHgAAAAJYm9keUJ5dGVzCQABkQAAAAIIBQAAAAJ0eAAAAAZwcm9vZnMAAAAAAAAAAAIFAAAADGNvb3BlclB1YktleQAAAAAAAAAAAQAAAAAAAAAAAAkAAGcAAAACCQAAZAAAAAIJAABkAAAAAgUAAAALYWxpY2VTaWduZWQFAAAACWJvYlNpZ25lZAUAAAAMY29vcGVyU2lnbmVkAAAAAAAAAAACVateHg=='

  it('Should generate correct signed setScript transaction', () => {
    const txParams = { script: compiledContract }
    const signedTx = setScript(txParams, seed)

    expect(validateSetScriptTx(signedTx)).toBe(true)
  })

  it('Should generate correct signed setScript transaction with multiple signers via array', () => {
    const txParams = { script: null }
    const signedTx = setScript(txParams, [null, seed, seed2])

    expect(signedTx.proofs[0]).toEqual('')
    expect(signedTx.script).toBeNull()
    expect(validateSetScriptTx(signedTx, 1)).toBe(true)
    expect(validateSetScriptTx(signedTx, 2, publicKey(seed2))).toBe(true)
  })

  it('Should generate correct signed setScript transaction with multiple signers via object', () => {
    const txParams = { script: compiledContract }
    const signedTx = setScript(txParams, { '1': seed, '2': seed2 })

    expect(signedTx.proofs[0]).toEqual('')
    expect(validateSetScriptTx(signedTx, 1, publicKey(seed))).toBe(true)
    expect(validateSetScriptTx(signedTx, 2, publicKey(seed2))).toBe(true)
  })

  it('Should generate correct signed setScript transaction with null script', () => {
    const txParams = { script: null }
    const signedTx = setScript(txParams, seed)

    expect(validateSetScriptTx(signedTx)).toBe(true)
  })

  it('Should generate correct setScript transaction without seed', () => {
    const txParams = { script: compiledContract, senderPublicKey: publicKey(seed) }
    const tx = setScript(txParams,)

    expect(tx.script).toEqual('base64:' + txParams.script)
    expect(tx.senderPublicKey).toEqual(publicKey(seed))
  })

  it('Should throw on undefined script', () => {
    const txParams = {}
    expect(() => setScript(txParams as any, seed)).toThrow('Script field cannot be undefined. Use null explicitly to remove script')
  })

  it('Should handle incorrect keys in seedObject', () => {
    const txParams = { script: compiledContract }
    const signedTx = setScript(txParams, { 'asd1': seed, '2': seed2 } as any)

    expect(signedTx.proofs[0]).toEqual('')
    expect(signedTx.proofs[1]).toEqual('')
    expect(validateSetScriptTx(signedTx, 2, publicKey(seed2))).toBe(true)
  })

  it('Should throw on schema validation', () => {
    const tx = () => setScript({ script: null, fee: null } as any, seed)
    expect(tx).toThrow(`[{
  "keyword": "type",
  "dataPath": ".fee",
  "schemaPath": "#/properties/fee/type",
  "params": {
    "type": "string,number"
  },
  "message": "should be string,number"
}]`)
  })
})

function validateSetScriptTx(tx: ISetScriptTransaction, proofNumber = 0, publicKey?: string): boolean {
  const bytes = setScriptToBytes(tx)
  return verifySignature(publicKey || tx.senderPublicKey, bytes, tx.proofs[proofNumber]!)
}