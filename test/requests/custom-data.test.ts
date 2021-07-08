import { customData, serializeCustomData } from '../../src/requests/custom-data'
import { verifyCustomData } from '../../src/general'

import { base58Encode, blake2b } from '@waves/ts-lib-crypto'
import {DATA_FIELD_TYPE} from '@waves/ts-types'

describe('custom-data', () => {

  const stringSeed = 'df3dd6d884714288a39af0bd973a1771c9f00f168cf040d6abb6a50dd5e055d8'

  it('sign v1', () => {
    const p = { version: 1 as 1, binary: '0J/RgNC40LLQtdGCINC80LjRgAo=' }
    const d = customData(p, stringSeed)
    expect(d).toMatchObject(p)
    expect(d.hash).toEqual(base58Encode(blake2b(serializeCustomData(d))))
    expect(verifyCustomData(d)).toBe(true)
  })
  
  it('get v1 data', () => {
    const p = { version: 1 as 1, binary: '0J/RgNC40LLQtdGCINC80LjRgAo=' }
    const d = customData(p)
    expect(d).toMatchObject(p)
    expect(d.hash).toEqual(base58Encode(blake2b(serializeCustomData(d))))
  })

  it('sign v2', () => {
    const d = customData({
      version: 2,
      data: [{
        type: DATA_FIELD_TYPE.INTEGER,
        value: 1,
        key: 'foo',
      }],
    }, stringSeed)
    expect(verifyCustomData(d)).toBe(true)
  })
})
