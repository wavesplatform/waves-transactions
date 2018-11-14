import { publicKey, verifySignature } from 'waves-crypto'
import { reissue, signTx, data } from '../src'
import { reissueToBytes } from '../src/transactions/reissue'
import { broadcast, txTypeMap, serialize } from '../src/general'
import { reissueMinimalParams, minimalParams } from './minimalParams'
import { TransactionType, Tx } from '../src/transactions'
import { exampleTxs } from './exampleTxs'

describe('signTx', () => {

  const stringSeed = 'df3dd6d884714288a39af0bd973a1771c9f00f168cf040d6abb6a50dd5e055d8'

  const txs = Object.keys(exampleTxs).map(x => exampleTxs[x] as Tx)
  txs.forEach(tx => {
    it('sign tx type: ' + tx.type, () => {
      const signed = signTx(tx, stringSeed)
      const bytes = serialize(signed)
      expect(verifySignature(publicKey(stringSeed), bytes, signed.proofs[1]!)).toBeTruthy()
    })
  })

  it('should throw on no public key or seed', () => {
    const tx = () => reissue({ ...reissueMinimalParams })
    expect(tx).toThrow('Please provide either seed or senderPublicKey')
  })

  it('should throw when index already exists', () => {
    const tx = reissue({ ...reissueMinimalParams }, stringSeed)
    const signedTwoTimes = () => signTx(tx, [stringSeed])
    expect(signedTwoTimes).toThrow('Proof at index 0 is already exists.')
  })

  it('should throw when type is unknown', () => {
    const tx = reissue({ ...reissueMinimalParams }, stringSeed)
    const signedTwoTimes = () => signTx({ ...tx, type: 99 }, [stringSeed])
    expect(signedTwoTimes).toThrow('Unknown tx type: 99')
  })
})

it('Should send tx to node', async () => {
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
  }
  const result = data(dataParams, 'seed')

  await expect(broadcast(result, 'https://nodes.wavesplatform.com/')).rejects
    .toEqual(new Error('Transaction not allowed by account-script'))
})