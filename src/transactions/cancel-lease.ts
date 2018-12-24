import { TRANSACTION_TYPE, ICancelLeaseTransaction, ICancelLeaseParams, WithId, WithSender } from '../transactions'
import { binary } from '@waves/marshall'
import { concat, BASE58_STRING, LONG, signBytes, hashBytes, BYTES } from 'waves-crypto'
import { addProof, getSenderPublicKey, convertToPairs, networkByte, fee } from '../generic'
import { TSeedTypes } from '../types'

export const cancelLeaseToBytes = (tx: ICancelLeaseTransaction): Uint8Array => concat(
  BYTES([TRANSACTION_TYPE.CANCEL_LEASE, tx.version, tx.chainId]),
  BASE58_STRING(tx.senderPublicKey),
  LONG(tx.fee),
  LONG(tx.timestamp),
  BASE58_STRING(tx.leaseId)
)

/* @echo DOCS */
export function cancelLease(params: ICancelLeaseParams, seed: TSeedTypes): ICancelLeaseTransaction & WithId;
export function cancelLease(paramsOrTx: ICancelLeaseParams & WithSender | ICancelLeaseTransaction, seed?: TSeedTypes): ICancelLeaseTransaction & WithId;
export function cancelLease(paramsOrTx: any, seed?: TSeedTypes): ICancelLeaseTransaction & WithId {
  const type = TRANSACTION_TYPE.CANCEL_LEASE;
  const version = paramsOrTx.version || 2;
  const seedsAndIndexes = convertToPairs(seed);
  const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx);

  const tx: ICancelLeaseTransaction & WithId = {
    type,
    version,
    senderPublicKey,
    leaseId: paramsOrTx.leaseId,
    fee: fee(paramsOrTx, 100000),
    timestamp: paramsOrTx.timestamp || Date.now(),
    chainId: networkByte(paramsOrTx.chainId, 87),
    proofs: paramsOrTx.proofs || [],
    id: '',
  }

  const bytes = binary.serializeTx(tx);

  seedsAndIndexes.forEach(([s, i]) => addProof(tx, signBytes(bytes, s), i));
  tx.id = hashBytes(bytes);

  return tx
}