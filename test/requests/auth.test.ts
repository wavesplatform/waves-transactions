import { auth, serializeAuthData } from '../../src/requests/auth'
import { verifyAuthData } from '../../src/general'
import { base58Encode, blake2b } from '@waves/ts-lib-crypto'
import { address } from '@waves/ts-lib-crypto'

describe('auth', () => {

  const stringSeed = 'df3dd6d884714288a39af0bd973a1771c9f00f168cf040d6abb6a50dd5e055d8'

  it('auth v1', () => {
    const p = { host: 'test.hello.com', data: 'custom data' }
    const d = auth(p, stringSeed)
    expect(d).toMatchObject(p)
    expect(d.hash).toEqual(base58Encode(blake2b(serializeAuthData(d))))
    expect(verifyAuthData(d, p)).toBe(true)
  })
  
  it('Wrong auth v1', () => {
    const p = { host: 'test.hello.com', data: 'custom data' }
    const d = auth(p, stringSeed)
    expect(d).toMatchObject(p)
    expect(d.hash).toEqual(base58Encode(blake2b(serializeAuthData(d))))
    const wrongData = { ...d, address: address('123') }
    expect(verifyAuthData(wrongData, p)).toBe(false)
  })
})
