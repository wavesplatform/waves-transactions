import { TRANSACTION_TYPE, ITransferTransaction, ITransferParams, WithId } from '../transactions'
import { concat, BASE58_STRING, BYTE, LEN, SHORT, STRING, LONG, signBytes, hashBytes, OPTION } from 'waves-crypto'
import { addProof, getSenderPublicKey, convertToPairs } from '../generic'
import { TSeedTypes } from '../types'
import { binary } from '/Users/siem/IdeaProjects/tx-parse-serialize/dist'

export const transferToBytes = (tx: ITransferTransaction) => concat(
  BYTE(TRANSACTION_TYPE.TRANSFER),
  BYTE(tx.version),
  BASE58_STRING(tx.senderPublicKey),
  OPTION(BASE58_STRING)(tx.assetId),
  OPTION(BASE58_STRING)(tx.feeAssetId),
  LONG(tx.timestamp),
  LONG(tx.amount),
  LONG(tx.fee),
  BASE58_STRING(tx.recipient),
  LEN(SHORT)(STRING)(tx.attachment)
)

/* @echo DOCS */
export function transfer(paramsOrTx: ITransferParams | ITransferTransaction, seed?: TSeedTypes): ITransferTransaction {
  const seedsAndIndexes = convertToPairs(seed);
  const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx);

  const tx: ITransferTransaction & WithId = {
    type: TRANSACTION_TYPE.TRANSFER,
    version: 2,
    fee: 100000,
    senderPublicKey,
    attachment: paramsOrTx.attachment || '',
    timestamp: Date.now(),
    proofs: [],
    id: '',
    ...paramsOrTx,
  }

  const bytes = binary.serializeTx(tx);

  seedsAndIndexes.forEach(([s,i]) => addProof(tx, signBytes(bytes, s),i));
  tx.id = hashBytes(bytes);

  return tx as any
}