import { TRANSACTION_TYPE, IBurnTransaction, IBurnParams, WithId, WithSender } from '../transactions'
import { binary } from '/Users/siem/IdeaProjects/tx-parse-serialize/dist'
import { concat, BASE58_STRING, LONG, signBytes, hashBytes, BYTES } from 'waves-crypto'
import { addProof, getSenderPublicKey, convertToPairs } from '../generic'
import { TSeedTypes } from '../types'

export const burnToBytes = (tx: IBurnTransaction): Uint8Array => concat(
  BYTES([TRANSACTION_TYPE.BURN, tx.version, tx.chainId.charCodeAt(0)]),
  BASE58_STRING(tx.senderPublicKey),
  BASE58_STRING(tx.assetId),
  LONG(tx.quantity),
  LONG(tx.fee),
  LONG(tx.timestamp)
)

/* @echo DOCS */
export function burn(params: IBurnParams, seed: TSeedTypes): IBurnTransaction & WithId;
export function burn(paramsOrTx: IBurnParams & WithSender | IBurnTransaction, seed?: TSeedTypes): IBurnTransaction & WithId;
export function burn(paramsOrTx: any, seed?: TSeedTypes): IBurnTransaction & WithId {
  const type = TRANSACTION_TYPE.BURN;
  const version = paramsOrTx.version || 2;
  const seedsAndIndexes = convertToPairs(seed);
  const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx);

  const tx: IBurnTransaction & WithId = {
    type: TRANSACTION_TYPE.BURN,
    version,
    chainId: paramsOrTx.chainId || 'W',
    fee: 100000,
    senderPublicKey,
    timestamp: Date.now(),
    proofs: [],
    id: '',
    ...paramsOrTx,
  }


  const bytes = binary.serializeTx(tx);

  seedsAndIndexes.forEach(([s, i]) => addProof(tx, signBytes(bytes, s), i));
  tx.id = hashBytes(bytes);

  return tx as any
}
