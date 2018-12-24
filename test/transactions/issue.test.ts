import { publicKey, verifySignature } from 'waves-crypto'
import { issue } from '../../src'
import { issueToBytes } from '../../src/transactions/issue'
import { issueMinimalParams } from '../minimalParams'

describe('issue', () => {

  const stringSeed = 'df3dd6d884714288a39af0bd973a1771c9f00f168cf040d6abb6a50dd5e055d8';

  it('should build from minimal set of params', () => {
    const tx = issue({ ...issueMinimalParams }, stringSeed);
    expect(tx).toMatchObject({ ...issueMinimalParams })
  });

  it('should build with asset script', () => {
    const tx = issue({ ...issueMinimalParams, script:'AQQAAAAHJG1hdGNoMAUAAAACdHgDCQAAAQAAAAIFAAAAByRtYXRjaDACAAAAD0J1cm5UcmFuc2FjdGlvbgQAAAABdAUAAAAHJG1hdGNoMAcGPmRSDA==' }, stringSeed);
    expect(tx).toMatchObject({ ...issueMinimalParams })
  });

  it('Should get correct signature', () => {
    const tx = issue({ ...issueMinimalParams }, stringSeed);
    expect(verifySignature(publicKey(stringSeed), issueToBytes(tx),tx.proofs[0]!)).toBeTruthy()
  });

  it('Should sign already signed', () => {
    let tx = issue({ ...issueMinimalParams }, stringSeed);
    tx = issue(tx, stringSeed);
    expect(verifySignature(publicKey(stringSeed), issueToBytes(tx), tx.proofs[1]!)).toBeTruthy()
  });

  it('Should get correct multiSignature', () => {
    const stringSeed2 = 'example seed 2';
    const tx = issue({ ...issueMinimalParams }, [null, stringSeed, null, stringSeed2]);
    expect(verifySignature(publicKey(stringSeed), issueToBytes(tx),tx.proofs[1]!)).toBeTruthy();
    expect(verifySignature(publicKey(stringSeed2), issueToBytes(tx),tx.proofs[3]!)).toBeTruthy()
  })
});

//AQQAAAAHJG1hdGNoMAUAAAACdHgDCQAAAQAAAAIFAAAAByRtYXRjaDACAAAAD0J1cm5UcmFuc2FjdGlvbgQAAAABdAUAAAAHJG1hdGNoMAcGPmRSDA