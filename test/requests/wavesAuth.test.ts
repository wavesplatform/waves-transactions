import { wavesAuth, serializeWavesAuthData } from '../../src/requests/wavesAuth'
import { verifyWavesAuthData } from '../../src/general'
import { base58Encode, blake2b } from '@waves/ts-lib-crypto'
import { address } from '@waves/ts-lib-crypto'

describe('wavesAuth', () => {

  const stringSeed = 'df3dd6d884714288a39af0bd973a1771c9f00f168cf040d6abb6a50dd5e055d8'

  it('wavesAuth v0', () => {
    const p = { timestamp: Date.now(), publicKey: '' }
    const d = wavesAuth(p, stringSeed)
    p.publicKey = d.publicKey
    expect(d).toMatchObject(p)
    expect(d.hash).toEqual(base58Encode(blake2b(serializeWavesAuthData(d))))
    expect(verifyWavesAuthData(d, p)).toBe(true)
  })

  it('Wrong auth v1', () => {
    const p = { timestamp: Date.now(), publicKey: 'Aa4Kz9N6njigV3T1WC6Buh841x4QTcpcPghrvaQK5zFJ' }
    const d = wavesAuth(p, stringSeed)
    expect(d).toMatchObject(p)
    expect(d.hash).toEqual(base58Encode(blake2b(serializeWavesAuthData(d))))
    const wrongData = { ...d, address: address('123') }
    expect(verifyWavesAuthData(wrongData, p)).toBe(false)
  })
})
