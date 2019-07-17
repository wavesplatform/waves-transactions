import { publicKey, verifySignature } from '@waves/ts-lib-crypto'
import { cancelOrder } from '../../src/index'
import { cancelOrderParamsToBytes } from '../../src/requests/cancel-order'
import { cancelOrderMinimalParams } from '../minimalParams'

describe('cancel-order', () => {

  const stringSeed = 'df3dd6d884714288a39af0bd973a1771c9f00f168cf040d6abb6a50dd5e055d8'

  it('should build from minimal set of params', () => {
    const tx = cancelOrder({ ...cancelOrderMinimalParams } as any, stringSeed)
    expect(tx).toMatchObject({ ...cancelOrderMinimalParams })
  })


  it('should get correct signature', () => {
    const co = cancelOrder({ ...cancelOrderMinimalParams }, stringSeed)
    expect(verifySignature(publicKey(stringSeed), cancelOrderParamsToBytes(co), co.signature)).toBeTruthy()
  })
})
