import { publicKey, verifySignature } from '@waves/ts-lib-crypto'
import { burn } from '../../src'
import { burnMinimalParams } from '../minimalParams'
import { binary } from '@waves/marshall'
import * as wavesProto from '@waves/protobuf-serialization'
import { parseProtoBytes, serializeToProtoBytes } from '../../src/proto-serialize'

describe('burn', () => {

  const stringSeed = 'df3dd6d884714288a39af0bd973a1771c9f00f168cf040d6abb6a50dd5e055d8'

  it('should build from minimal set of params', () => {
    const tx = burn({ ...burnMinimalParams } as any, stringSeed)
    expect(tx).toMatchObject({ ...burnMinimalParams })
    const bytes = serializeToProtoBytes(tx)
    const parsed = parseProtoBytes(bytes)
    const a = 20
  })


  it('Should get correct signature', () => {
    const tx = burn({ ...burnMinimalParams }, stringSeed)
    expect(verifySignature(publicKey(stringSeed), binary.serializeTx(tx), tx.proofs[0]!)).toBeTruthy()
  })

  it('Should sign already signed', () => {
    let tx = burn({ ...burnMinimalParams }, stringSeed)
    tx = burn(tx, stringSeed)
    expect(verifySignature(publicKey(stringSeed), binary.serializeTx(tx), tx.proofs[1]!)).toBeTruthy()
  })

  it('Should get correct multiSignature', () => {
    const stringSeed2 = 'example seed 2'
    const tx = burn({ ...burnMinimalParams }, [null, stringSeed, null, stringSeed2])
    expect(verifySignature(publicKey(stringSeed), binary.serializeTx(tx), tx.proofs[1]!)).toBeTruthy()
    expect(verifySignature(publicKey(stringSeed2), binary.serializeTx(tx), tx.proofs[3]!)).toBeTruthy()
  })
})
