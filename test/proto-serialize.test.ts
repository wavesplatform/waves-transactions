import { exampleTxs } from './exampleTxs'
import {  TTx } from '../src'
import { protoBytesToTx, txToProtoBytes } from '../src/proto-serialize'

describe('serializes and parses txs', () => {
  const txs = Object.keys(exampleTxs).map(x => (<any>exampleTxs)[x] as TTx)
  txs.forEach(tx => {
    it('type: ' + tx.type, () => {
      const parsed =protoBytesToTx(txToProtoBytes(tx))
      expect(parsed).toEqual(tx)
    })
  })
})
