import { publicKey } from '@waves/ts-lib-crypto'
import { invokeScriptMinimalParams } from '../minimalParams'
import { invokeScript } from '../../src/transactions/invoke-script'
import { IInvokeScriptParams } from '../../src'
import { validateTxSignature } from '../../test/utils'

describe('invokeScript', () => {

  const stringSeed = 'df3dd6d884714288a39af0bd973a1771c9f00f168cf040d6abb6a50dd5e055d8'

  it('should build from minimal set of params', () => {
    const tx = invokeScript({ ...invokeScriptMinimalParams }, stringSeed)
    expect(tx).toMatchObject({ ...invokeScriptMinimalParams })
  })

  it('should build from minimal set of params with payment', () => {
    const tx = invokeScript({ ...invokeScriptMinimalParams, payment: [{ amount: 100, assetId: null }] }, stringSeed)
    expect(tx).toMatchObject({ ...invokeScriptMinimalParams })
  })

  it('should build without args', () => {
    const params: IInvokeScriptParams = {
      dApp: '3N3Cn2pYtqzj7N9pviSesNe8KG9Cmb718Y1',
      call: {
        function: 'foo'
      },
    }
    const tx = invokeScript(params, stringSeed)
    expect(tx).toMatchObject({
      dApp: '3N3Cn2pYtqzj7N9pviSesNe8KG9Cmb718Y1',
      call: {
        function: 'foo',
        args: []
      },
    })
  })

  it('should build from minimal set of params with additional properties', () => {
    const tx = invokeScript({ ...invokeScriptMinimalParams, a: 10000 } as any, stringSeed)
    expect(tx).toMatchObject({ ...invokeScriptMinimalParams })
  })

  it('Should get correct signature', () => {
    const tx = invokeScript({ ...invokeScriptMinimalParams }, stringSeed)
    expect(validateTxSignature(tx, 1)).toBeTruthy()
  })

  it('Should sign already signed', () => {
    let tx = invokeScript({ ...invokeScriptMinimalParams }, stringSeed)
    tx = invokeScript(tx, stringSeed)
    expect(validateTxSignature(tx, 1, 1)).toBeTruthy()
  })

  it('Should get correct multiSignature', () => {
    const stringSeed2 = 'example seed 2'
    const tx = invokeScript({
      ...invokeScriptMinimalParams,
      payment: [{ amount: 100, assetId: null }]
    }, [null, stringSeed, null, stringSeed2])

    expect(validateTxSignature(tx, 1, 1, publicKey(stringSeed))).toBeTruthy()
    expect(validateTxSignature(tx, 1, 3, publicKey(stringSeed2))).toBeTruthy()
  })
})
