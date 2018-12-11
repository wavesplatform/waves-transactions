import { publicKey, verifySignature } from 'waves-crypto'
import { contractInvocationMinimalParams } from '../minimalParams'
import { contractInvocation } from "../../src/transactions/contract-invocation";

describe('contractInvocation', () => {

  const stringSeed = 'df3dd6d884714288a39af0bd973a1771c9f00f168cf040d6abb6a50dd5e055d8'

  it('should build from minimal set of params', () => {
    const tx = contractInvocation({ ...contractInvocationMinimalParams }, stringSeed)
    expect(tx).toMatchObject({ ...contractInvocationMinimalParams })
  });

  it('should build from minimal set of params with additional properties', () => {
    const tx = contractInvocation({ ...contractInvocationMinimalParams, a: 10000 } as any, stringSeed)
    expect(tx).toMatchObject({ ...contractInvocationMinimalParams })
  });


  // it('Should get correct signature', () => {
  //   const tx = contractInvocation({ ...contractInvocationMinimalParams }, stringSeed)
  //   expect(verifySignature(publicKey(stringSeed), aliasToBytes(tx), tx.proofs[0]!)).toBeTruthy()
  // });
  //
  // it('Should sign already signed', () => {
  //   let tx = contractInvocation({ ...contractInvocationMinimalParams }, stringSeed);
  //   tx = contractInvocation(tx, stringSeed);
  //   expect(verifySignature(publicKey(stringSeed), aliasToBytes(tx), tx.proofs[1]!)).toBeTruthy()
  // });
  //
  // it('Should get correct multiSignature', () => {
  //   const stringSeed2 = 'example seed 2'
  //   const tx = contractInvocation({ ...contractInvocationMinimalParams }, [null, stringSeed, null, stringSeed2])
  //   expect(verifySignature(publicKey(stringSeed), aliasToBytes(tx), tx.proofs[1]!)).toBeTruthy()
  //   expect(verifySignature(publicKey(stringSeed2), aliasToBytes(tx), tx.proofs[3]!)).toBeTruthy()
  // })
})
