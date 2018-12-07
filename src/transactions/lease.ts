import { TRANSACTION_TYPE, ILeaseTransaction, ILeaseParams, WithId } from '../transactions'
import { concat, BASE58_STRING, LONG, signBytes, hashBytes, BYTES } from 'waves-crypto'
import { addProof, convertToPairs, getSenderPublicKey } from '../generic'
import { TSeedTypes } from '../types'
import { binary } from '/Users/siem/IdeaProjects/tx-parse-serialize/dist'

export const leaseToBytes = (tx: ILeaseTransaction): Uint8Array => concat(
  BYTES([TRANSACTION_TYPE.LEASE, tx.version, 0]),
  BASE58_STRING(tx.senderPublicKey),
  BASE58_STRING(tx.recipient),
  LONG(tx.amount),
  LONG(tx.fee),
  LONG(tx.timestamp)
)

/* @echo DOCS */
export function lease(paramsOrTx: ILeaseParams | ILeaseTransaction, seed?: TSeedTypes): ILeaseTransaction & WithId {
  const seedsAndIndexes = convertToPairs(seed);
  const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx);

  const tx: ILeaseTransaction & WithId =  {
      type: TRANSACTION_TYPE.LEASE,
      version: 2,
      fee: 100000,
      senderPublicKey,
      timestamp:Date.now(),
      proofs: [],
      id: '',
    ...paramsOrTx,
    }

  const bytes = binary.serializeTx(tx);

  seedsAndIndexes.forEach(([s,i]) => addProof(tx, signBytes(bytes, s),i));
  tx.id = hashBytes(bytes);

  return tx as any
}