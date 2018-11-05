import { BASE58_STRING, BASE64_STRING, BYTES, concat, LEN, LONG, OPTION, SHORT, verifySignature } from "waves-crypto";
import { setScript } from '../src';
import { SetScriptTransaction } from "../src/transactions";

test('setScript', () => {
  const seed = 'test seed';
  const compiledContract = 'AQQAAAALYWxpY2VQdWJLZXkBAAAAID3+K0HJI42oXrHhtHFpHijU5PC4nn1fIFVsJp5UWrYABAAAAAlib2JQdWJLZXkBAAAAIBO1uieokBahePoeVqt4/usbhaXRq+i5EvtfsdBILNtuBAAAAAxjb29wZXJQdWJLZXkBAAAAIOfM/qkwkfi4pdngdn18n5yxNwCrBOBC3ihWaFg4gV4yBAAAAAthbGljZVNpZ25lZAMJAAH0AAAAAwgFAAAAAnR4AAAACWJvZHlCeXRlcwkAAZEAAAACCAUAAAACdHgAAAAGcHJvb2ZzAAAAAAAAAAAABQAAAAthbGljZVB1YktleQAAAAAAAAAAAQAAAAAAAAAAAAQAAAAJYm9iU2lnbmVkAwkAAfQAAAADCAUAAAACdHgAAAAJYm9keUJ5dGVzCQABkQAAAAIIBQAAAAJ0eAAAAAZwcm9vZnMAAAAAAAAAAAEFAAAACWJvYlB1YktleQAAAAAAAAAAAQAAAAAAAAAAAAQAAAAMY29vcGVyU2lnbmVkAwkAAfQAAAADCAUAAAACdHgAAAAJYm9keUJ5dGVzCQABkQAAAAIIBQAAAAJ0eAAAAAZwcm9vZnMAAAAAAAAAAAIFAAAADGNvb3BlclB1YktleQAAAAAAAAAAAQAAAAAAAAAAAAkAAGcAAAACCQAAZAAAAAIJAABkAAAAAgUAAAALYWxpY2VTaWduZWQFAAAACWJvYlNpZ25lZAUAAAAMY29vcGVyU2lnbmVkAAAAAAAAAAACVateHg=='

  it('Should generate correct signed setScript transaction', () => {
    const txParams = { script: compiledContract };
    const signedTx = setScript(seed, txParams);

    expect(validateSetScriptTx(signedTx)).toBe(true)
  });

  it('Should generate correct signed setScript transaction with null script', () => {
    const txParams = { script: null };
    const signedTx = setScript(seed, txParams);

    expect(validateSetScriptTx(signedTx)).toBe(true)
  });

  it('Should throw on undefined script', () => {
    const txParams = {};
    expect(() => setScript(seed, txParams)).toThrow('Script field cannot be undefined. Use null explicitly to remove script')
  });
})

function validateSetScriptTx(tx: SetScriptTransaction, proofNumber = 0): boolean {
  const bytes = concat(
    BYTES([tx.type, tx.version, tx.chainId.charCodeAt(0)]),
    BASE58_STRING(tx.senderPublicKey),
    OPTION(LEN(SHORT)(BASE64_STRING))(tx.script ? tx.script.slice(7) : null),
    LONG(tx.fee),
    LONG(tx.timestamp),
  )
  return verifySignature(tx.senderPublicKey, bytes, tx.proofs[proofNumber])
}