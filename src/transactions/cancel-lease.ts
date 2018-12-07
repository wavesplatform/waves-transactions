import { TRANSACTION_TYPE, ICancelLeaseTransaction, ICancelLeaseParams, WithId } from '../transactions'
import { binary } from '/Users/siem/IdeaProjects/tx-parse-serialize/src'
import { concat, BASE58_STRING, LONG, signBytes, hashBytes, BYTES } from 'waves-crypto'
import { addProof, getSenderPublicKey, convertToPairs } from '../generic'
import { TSeedTypes } from '../types'

export const cancelLeaseToBytes = (tx: ICancelLeaseTransaction): Uint8Array => concat(
  BYTES([TRANSACTION_TYPE.CANCEL_LEASE, tx.version, tx.chainId.charCodeAt(0)]),
  BASE58_STRING(tx.senderPublicKey),
  LONG(tx.fee),
  LONG(tx.timestamp),
  BASE58_STRING(tx.leaseId)
)

/* @echo DOCS */
export function cancelLease(paramsOrTx: ICancelLeaseParams | ICancelLeaseTransaction, seed?: TSeedTypes): ICancelLeaseTransaction {
  const seedsAndIndexes = convertToPairs(seed);
  const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx);

  const tx: ICancelLeaseTransaction & WithId = {
      type: TRANSACTION_TYPE.CANCEL_LEASE,
      version: 2,
      fee:100000,
      senderPublicKey,
      timestamp: Date.now(),
      chainId: 'W',
      proofs: [],
      id: '',
    ...paramsOrTx,
    }

  const bytes = binary.serializeTx(tx);

  seedsAndIndexes.forEach(([s,i]) => addProof(tx, signBytes(bytes, s),i));
  tx.id = hashBytes(bytes);

  return tx as any
}