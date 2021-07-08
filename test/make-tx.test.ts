import { exampleTxs } from './exampleTxs'
import { makeTx } from '../src'

describe('makes tx', () => {
  const txs = Object.keys(exampleTxs).map(x => (<any>exampleTxs)[x])
  txs.forEach(tx => {
    it('type: ' + tx.type, () => {
      const made = makeTx(tx)
      expect(tx.type).toEqual(made.type)
      expect(typeof made.id).toBe('string')
    })
  })

  it('thows on unexpected type', () => {
    const t = 100
    const params = {type: t} as any
    expect(() => makeTx(params)).toThrow(`Unknown tx type: ${t}`)
  })
})
