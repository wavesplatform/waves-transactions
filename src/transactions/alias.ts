import { IAliasParams, IAliasTransaction, TRANSACTION_TYPE, WithId, WithSender } from '../transactions'
import { binary } from '/Users/siem/IdeaProjects/tx-parse-serialize/src'
import { BASE58_STRING, BYTES, concat, hashBytes, LEN, LONG, SHORT, signBytes, STRING } from 'waves-crypto'
import { addProof, convertToPairs, getSenderPublicKey } from '../generic'
import { TSeedTypes } from '../types'

export const aliasToBytes = (tx: IAliasTransaction): Uint8Array => concat(
  BYTES([TRANSACTION_TYPE.ALIAS, tx.version]),
  BASE58_STRING(tx.senderPublicKey),
  LEN(SHORT)(STRING)(tx.alias),
  LONG(tx.fee),
  LONG(tx.timestamp)
)

/* @echo DOCS */
export function alias(params: IAliasParams, seed: TSeedTypes): IAliasTransaction & WithId;
export function alias(paramsOrTx: IAliasParams & WithSender | IAliasTransaction, seed?: TSeedTypes): IAliasTransaction & WithId;
export function alias(paramsOrTx: any, seed?: TSeedTypes): IAliasTransaction & WithId {
  const type = TRANSACTION_TYPE.ALIAS;
  const version = paramsOrTx.version || 2;
  const seedsAndIndexes = convertToPairs(seed);
  const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx);

  const tx = {
    type,
    version,
    senderPublicKey,
    alias: paramsOrTx.alias,
    fee: paramsOrTx.fee || 100000,
    timestamp: paramsOrTx.timestamp || Date.now(),
    proofs: [] || paramsOrTx.proofs,
    id: ''
  };

  const bytes = binary.serializeTx(tx);

  seedsAndIndexes.forEach(([s,i]) => addProof(tx, signBytes(bytes, s),i));
  tx.id = hashBytes(bytes);

  return tx as any
}