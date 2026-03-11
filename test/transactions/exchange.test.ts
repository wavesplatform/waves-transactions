import {binary} from '@waves/marshall'
import {exchange, order} from '../../src'
import {protoBytesToTx, txToProtoBytes} from '../../src/proto-serialize'
import {deleteProofsAndId} from '../utils'

const seed1 = 'shoe used festival regular fancy electric powder symptom stool physical cabbage need accuse silly ring'
const seed2 = 'next one puppy history bag vanish conduct lion royal dentist reject usual story invite leader'

const baseOrder = {
  amount: 100,
  price: 500000000,
  matcherFee: 100,
  amountAsset: '3JmaWyFqWo8YSA8x3DXCBUW7veesxacvKx19dMv7wTMg',
  priceAsset: null,
  matcherPublicKey: 'BvJEWY79uQEFetuyiZAF5U4yjPioMj9J6ZrF9uTNfe3E',
}

const matcherFeeAssetId = 'DvXjujyWbi7ARdExyayN42gcfBKGTBRgYYyPWMxy5grK'

const buildOrder = (version: 1 | 2 | 3 | 4, orderType: 'buy' | 'sell', seed: string) => {
  const params: any = {
    ...baseOrder,
    version,
    orderType,
  }

  if (orderType === 'sell') params.matcherFeeAssetId = matcherFeeAssetId
  if (version === 4) params.priceMode = 'fixedDecimals'

  return order(params, seed)
}

const checkRoundTrip = (tx: any) => {
  if (tx.version > 2) {
    const normalizeOrder = (o: any) => {
      const {id, proofs, signature, ...orderWithoutMeta} = o
      return {
        ...orderWithoutMeta,
        matcherFeeAssetId: o.matcherFeeAssetId || '',
        assetPair: {
          ...o.assetPair,
          priceAsset: o.assetPair.priceAsset || '',
        },
      }
    }

    const parsed = protoBytesToTx(txToProtoBytes(tx))
    const expected = deleteProofsAndId({
      ...tx,
      order1: normalizeOrder(tx.order1),
      order2: normalizeOrder(tx.order2),
    })
    expect(parsed).toMatchObject(expected)
    return
  }

  const parsed = binary.parseTx(binary.serializeTx(tx))
  expect(parsed.type).toBe(tx.type)
  if (parsed.version !== undefined) expect(parsed.version).toBe(tx.version)
  expect(String(parsed.price)).toBe(String(tx.price))
  expect(String(parsed.amount)).toBe(String(tx.amount))
  if (parsed.order1.version !== undefined) expect(parsed.order1.version).toBe(tx.order1.version)
  if (parsed.order2.version !== undefined) expect(parsed.order2.version).toBe(tx.order2.version)
}

describe('exchange', () => {
  const cases: Array<{
    title: string
    txVersion: 1 | 2 | 3
    order1Version: 1 | 2 | 3 | 4
    order2Version: 1 | 2 | 3 | 4
    chainId: string | number
  }> = [
    {title: 'v1 with orders v1/v1', txVersion: 1, order1Version: 1, order2Version: 1, chainId: 'T'},
    {title: 'v2 with orders v1/v2', txVersion: 2, order1Version: 1, order2Version: 2, chainId: 84},
    {title: 'v2 with orders v2/v3', txVersion: 2, order1Version: 2, order2Version: 3, chainId: 84},
    {title: 'v3 with orders v1/v1', txVersion: 3, order1Version: 1, order2Version: 1, chainId: 84},
    {title: 'v3 with orders v3/v4', txVersion: 3, order1Version: 3, order2Version: 4, chainId: 84},
  ]

  cases.forEach(({title, txVersion, order1Version, order2Version, chainId}) => {
    it(`builds ${title}`, () => {
      const txParams = {
        order1: buildOrder(order1Version, 'buy', seed1),
        order2: buildOrder(order2Version, 'sell', seed2),
        price: 500000000,
        amount: 100,
        buyMatcherFee: 100,
        sellMatcherFee: 100,
        chainId,
        fee: 700000,
        version: txVersion,
      }

      const tx = exchange(
          { ...txParams } as Parameters<typeof exchange>[0],
          seed1
      )
      const expectedChainId = typeof chainId === 'string' ? chainId.charCodeAt(0) : chainId

      expect(tx).toMatchObject({...txParams, chainId: expectedChainId})
      checkRoundTrip(tx)
    })
  })
})
