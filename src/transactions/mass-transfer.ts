import {
  TRANSACTION_TYPE,
  IMassTransferTransaction,
  IMassTransferItem,
  IMassTransferParams,
  WithId
} from '../transactions'
import { addProof, convertToPairs, getSenderPublicKey } from '../generic'
import { TSeedTypes } from '../types'
import { noError, ValidationResult } from 'waves-crypto/validation'
import {
  BASE58_STRING,
  BYTE,
  concat,
  COUNT,
  hashBytes,
  LEN,
  LONG,
  OPTION,
  SHORT,
  signBytes,
  STRING
} from 'waves-crypto'
import { binary } from '/Users/siem/IdeaProjects/tx-parse-serialize/src'



export const massTransferValidation = (tx: IMassTransferTransaction): ValidationResult => [
  noError,
]

export const massTransferToBytes = (tx: IMassTransferTransaction): Uint8Array => concat(
  BYTE(TRANSACTION_TYPE.MASS_TRANSFER),
  BYTE(1),
  BASE58_STRING(tx.senderPublicKey),
  OPTION(BASE58_STRING)(tx.assetId),
  COUNT(SHORT)((x: IMassTransferItem) => concat(BASE58_STRING(x.recipient), LONG(x.amount)))(tx.transfers),
  LONG(tx.timestamp),
  LONG(tx.fee),
  LEN(SHORT)(STRING)(tx.attachment)
)

/* @echo DOCS */
export function massTransfer(paramsOrTx: IMassTransferParams | IMassTransferTransaction, seed?: TSeedTypes): IMassTransferTransaction {
  const seedsAndIndexes = convertToPairs(seed);
  const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx);

  if (!Array.isArray(paramsOrTx.transfers))  throw new Error('["transfers should be array"]')

  const tx: IMassTransferTransaction & WithId = {
    type: TRANSACTION_TYPE.MASS_TRANSFER,
    version: 1,
    fee: (100000 + Math.ceil(0.5 * paramsOrTx.transfers.length) * 100000),
    senderPublicKey,
    timestamp: Date.now(),
    proofs: [],
    id: '', //TODO: invalid id for masstransfer tx
    ...paramsOrTx,
  }

  const bytes = binary.serializeTx(tx);

  seedsAndIndexes.forEach(([s,i]) => addProof(tx, signBytes(bytes, s),i));
  tx.id = hashBytes(bytes);

  return tx as any
}