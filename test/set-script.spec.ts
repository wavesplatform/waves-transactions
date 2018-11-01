import { describe, it } from 'mocha';
import { expect } from 'chai';
import {
  BASE58_STRING,
  BASE64_STRING,
  BYTES,
  concat,
  LEN,
  LONG,
  OPTION,
  SHORT,
  verifySignature,
  publicKey,
} from "waves-crypto";
import { setScript } from '../src';
import { SetScriptTransaction } from "../src/transactions";

describe('setScript', () => {
  const seed = 'test seed';
  const seed2 = 'test seed 2'
  const compiledContract = 'AQQAAAALYWxpY2VQdWJLZXkBAAAAID3+K0HJI42oXrHhtHFpHijU5PC4nn1fIFVsJp5UWrYABAAAAAlib2JQdWJLZXkBAAAAIBO1uieokBahePoeVqt4/usbhaXRq+i5EvtfsdBILNtuBAAAAAxjb29wZXJQdWJLZXkBAAAAIOfM/qkwkfi4pdngdn18n5yxNwCrBOBC3ihWaFg4gV4yBAAAAAthbGljZVNpZ25lZAMJAAH0AAAAAwgFAAAAAnR4AAAACWJvZHlCeXRlcwkAAZEAAAACCAUAAAACdHgAAAAGcHJvb2ZzAAAAAAAAAAAABQAAAAthbGljZVB1YktleQAAAAAAAAAAAQAAAAAAAAAAAAQAAAAJYm9iU2lnbmVkAwkAAfQAAAADCAUAAAACdHgAAAAJYm9keUJ5dGVzCQABkQAAAAIIBQAAAAJ0eAAAAAZwcm9vZnMAAAAAAAAAAAEFAAAACWJvYlB1YktleQAAAAAAAAAAAQAAAAAAAAAAAAQAAAAMY29vcGVyU2lnbmVkAwkAAfQAAAADCAUAAAACdHgAAAAJYm9keUJ5dGVzCQABkQAAAAIIBQAAAAJ0eAAAAAZwcm9vZnMAAAAAAAAAAAIFAAAADGNvb3BlclB1YktleQAAAAAAAAAAAQAAAAAAAAAAAAkAAGcAAAACCQAAZAAAAAIJAABkAAAAAgUAAAALYWxpY2VTaWduZWQFAAAACWJvYlNpZ25lZAUAAAAMY29vcGVyU2lnbmVkAAAAAAAAAAACVateHg=='

  it('Should generate correct signed setScript transaction', () => {
    const txParams = { script: compiledContract };
    const signedTx = setScript(seed, txParams);

    expect(validateSetScriptTx(signedTx)).to.be.true
  });

  it('Should generate correct signed setScript transaction with multiple signers via array', () => {
    const txParams = { script: compiledContract };
    const signedTx = setScript([null, seed, seed2], txParams);

    expect(signedTx.proofs[0]).to.be.null
    expect(validateSetScriptTx(signedTx, 1)).to.be.true
    expect(validateSetScriptTx(signedTx, 2, publicKey(seed2))).to.be.true
  });

  it('Should generate correct signed setScript transaction with multiple signers via object', () => {
    const txParams = { script: compiledContract };
    const signedTx = setScript({ '1': seed, '2': seed2 }, txParams);

    expect(signedTx.proofs[0]).to.be.null
    expect(validateSetScriptTx(signedTx, 1, publicKey(seed))).to.be.true
    expect(validateSetScriptTx(signedTx, 2, publicKey(seed2))).to.be.true
  });

  it('Should generate correct signed setScript transaction with null script', () => {
    const txParams = { script: null };
    const signedTx = setScript(seed, txParams);

    expect(validateSetScriptTx(signedTx)).to.be.true
  });

  it('Should generate correct signed setScript transaction without seed', () => {
    const txParams = { script: compiledContract, senderPublicKey: publicKey(seed) };
    const tx = setScript(null, txParams);

    expect(tx.script).to.eql('base64:' + txParams.script);
    expect(tx.senderPublicKey).to.eql(publicKey(seed));
  });

  it('Should throw on undefined script', () => {
    const txParams = {};
    expect(() => setScript(seed, txParams)).to.throw('Script field cannot be undefined. Use null explicitly to remove script')
  });

  it('Should handle incorrect keys in seedObject', () => {
    const txParams = { script: compiledContract };
    const signedTx = setScript({ 'asd1': seed, '2': seed2 }as any, txParams);

    expect(signedTx.proofs[0]).to.be.null
    expect(signedTx.proofs[1]).to.be.null
    expect(validateSetScriptTx(signedTx, 2, publicKey(seed2))).to.be.true
  });
})

function validateSetScriptTx(tx: SetScriptTransaction, proofNumber = 0, publicKey?: string): boolean {
  const bytes = concat(
    BYTES([tx.type, tx.version, tx.chainId.charCodeAt(0)]),
    BASE58_STRING(tx.senderPublicKey),
    OPTION(LEN(SHORT)(BASE64_STRING))(tx.script ? tx.script.slice(7) : null),
    LONG(tx.fee),
    LONG(tx.timestamp),
  )
  return verifySignature(publicKey || tx.senderPublicKey, bytes, tx.proofs[proofNumber])
}