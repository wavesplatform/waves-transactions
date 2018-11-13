import { publicKey, verifySignature } from "waves-crypto";
import { order } from '../src';
import { OrderParams, orderToBytes } from "../src/transactions/order";

export const orderMinimalParams: OrderParams = {
  matcherPublicKey: 'aaaa',
  price: 10000,
  amount: 1233,
  orderType: 'buy'
}

describe('order', () => {

  const stringSeed = 'df3dd6d884714288a39af0bd973a1771c9f00f168cf040d6abb6a50dd5e055d8'

  it('should build from minimal set of params', () => {
    const tx = order({ ...orderMinimalParams }as any, stringSeed)
    expect(tx).toMatchObject({ ...orderMinimalParams })
  })

  it('Should throw on schema validation', () => {
    const tx = () => order({ ...orderMinimalParams, matcherPublicKey: null } as any, stringSeed)
    expect(tx).toThrow(`[{
  "keyword": "type",
  "dataPath": ".matcherPublicKey",
  "schemaPath": "#/properties/matcherPublicKey/type",
  "params": {
    "type": "string"
  },
  "message": "should be string"
}]`)
  })


  it('Should get correct signature', () => {
    const tx = order({ ...orderMinimalParams }, stringSeed)
    expect(verifySignature(publicKey(stringSeed), orderToBytes(tx),tx.proofs[0]!)).toBeTruthy()
  })

  it('Should get correct multiSignature', () => {
    const stringSeed2 = 'example seed 2'
    const tx = order({ ...orderMinimalParams, orderType: 'sell' }, [null, stringSeed, null, stringSeed2])
    expect(verifySignature(publicKey(stringSeed), orderToBytes(tx),tx.proofs[1]!)).toBeTruthy()
    expect(verifySignature(publicKey(stringSeed2), orderToBytes(tx),tx.proofs[3]!)).toBeTruthy()
  })
})