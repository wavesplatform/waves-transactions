import { publicKey, verifySignature } from '@waves/ts-lib-crypto'
import {reissue, signTx, data, burn, broadcast, IDataParams} from '../src'
import { serialize, verify } from '../src/general'
import { reissueMinimalParams, burnMinimalParams, orderMinimalParams } from './minimalParams'
import { exampleTxs } from './exampleTxs'
import { order } from '../src/requests/order'
import {API_BASE} from './integration/config'
import {Transaction} from '@waves/ts-types'

const stringSeed = 'df3dd6d884714288a39af0bd973a1771c9f00f168cf040d6abb6a50dd5e055d8'

describe('signTx', () => {

  const txs = Object.keys(exampleTxs).map(x => (<any>exampleTxs)[x] as Transaction)
  txs.forEach(tx => {
    it('type: ' + tx.type, () => {
      const signed = signTx(tx, stringSeed)
      const bytes = serialize(signed)
      expect(verifySignature(publicKey(stringSeed), bytes, signed.proofs[1]!)).toBeTruthy()
    })
  })

  it('should throw on no public key or seed', () => {
    const tx = () => reissue({ ...reissueMinimalParams } as any)
    expect(tx).toThrow('Please provide either seed or senderPublicKey')
  })

  it('should add additional fee to auto calculated one', () => {
    const tx = burn({ ...burnMinimalParams, additionalFee: 100000 }, stringSeed)
    expect(tx.fee).toEqual(200000)
  })

  it('should throw when index already exists', () => {
    const tx = reissue({ ...reissueMinimalParams }, stringSeed)
    const signedTwoTimes = () => signTx(tx, [stringSeed])
    expect(signedTwoTimes).toThrow('Proof at index 0 already exists')
  })

  it('should throw when type is unknown', () => {
    const tx = reissue({ ...reissueMinimalParams }, stringSeed)
    const signedTwoTimes = () => signTx({ ...tx, type: 99 } as any, [stringSeed])
    expect(signedTwoTimes).toThrow('Unknown tx type: 99')
  })
})

describe('Node interaction', () => {

  it('should send tx to node', async () => {
    const dataParams = {
      data: [
        {
          key: 'oneTwo',
          value: false,
        },
        {
          key: 'twoThree',
          value: 2,
        },
        {
          key: 'three',
          value: Uint8Array.from([1, 2, 3, 4, 5, 6]),
        },
      ],
      timestamp: 100000,
    } as IDataParams
    const result = data(dataParams, 'seed')

    await expect(broadcast(result, API_BASE)).rejects
      .toMatchObject({error: 404})
  }, 100000)

})

it('verify signatures of txs and orders', async () => {
  const ord = order(orderMinimalParams, stringSeed)
  const tx = burn({...burnMinimalParams, version: 2}, [null, stringSeed])
  expect(verify(ord)).toEqual(true)
  expect(verify(tx, 1)).toEqual(true)
})
