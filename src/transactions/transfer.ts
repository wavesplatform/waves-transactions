import { TRANSACTION_TYPE, ITransferTransaction, ITransferParams, WithId, WithSender } from '../transactions'
import { concat, BASE58_STRING, BYTE, LEN, SHORT, STRING, LONG, signBytes, hashBytes, OPTION } from 'waves-crypto'
import { addProof, getSenderPublicKey, convertToPairs, fee } from '../generic'
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
export function transfer(params: ITransferParams, seed: TSeedTypes): ITransferTransaction & WithId;
export function transfer(paramsOrTx: ITransferParams & WithSender | ITransferTransaction, seed?: TSeedTypes): ITransferTransaction & WithId;
export function transfer(paramsOrTx: any, seed?: TSeedTypes): ITransferTransaction {
  const type = TRANSACTION_TYPE.TRANSFER;
  const version = paramsOrTx.version || 2;
  const seedsAndIndexes = convertToPairs(seed);
  const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx);

  const tx: ITransferTransaction & WithId = {
    type,
    version,
    senderPublicKey,
    recipient: paramsOrTx.recipient,
    amount: paramsOrTx.amount,
    attachment: paramsOrTx.attachment || '',
    fee: fee(paramsOrTx, 100000),
    timestamp: paramsOrTx.timestamp || Date.now(),
    proofs: paramsOrTx.proofs || [],
    id: ''
  }

  const bytes = binary.serializeTx(tx);

  seedsAndIndexes.forEach(([s,i]) => addProof(tx, signBytes(bytes, s),i));
  tx.id = hashBytes(bytes);

  return tx
}