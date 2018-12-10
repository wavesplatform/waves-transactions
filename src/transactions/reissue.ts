import { TRANSACTION_TYPE, IReissueTransaction, IReissueParams, WithId, WithSender } from '../transactions'
import { concat, BASE58_STRING, LONG, signBytes, hashBytes, BYTES, BOOL } from 'waves-crypto'
import { addProof, convertToPairs, fee, getSenderPublicKey, networkByte } from '../generic'
import { TSeedTypes } from '../types'
import { binary } from '/Users/siem/IdeaProjects/tx-parse-serialize/dist'


export const reissueToBytes = (tx: IReissueTransaction): Uint8Array => concat(
  BYTES([TRANSACTION_TYPE.REISSUE, tx.version, tx.chainId]),
  BASE58_STRING(tx.senderPublicKey),
  BASE58_STRING(tx.assetId),
  LONG(tx.quantity),
  BOOL(tx.reissuable),
  LONG(tx.fee),
  LONG(tx.timestamp)
)

/* @echo DOCS */
export function reissue(paramsOrTx: IReissueParams, seed: TSeedTypes): IReissueTransaction & WithId
export function reissue(paramsOrTx: IReissueParams & WithSender | IReissueTransaction, seed?: TSeedTypes): IReissueTransaction & WithId
export function reissue(paramsOrTx: any, seed?: TSeedTypes): IReissueTransaction & WithId{
  const type = TRANSACTION_TYPE.REISSUE;
  const version = paramsOrTx.version || 2;
  const seedsAndIndexes = convertToPairs(seed);
  const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx);

  const tx: IReissueTransaction & WithId = {
    type,
    version,
    senderPublicKey,
    assetId: paramsOrTx.assetId,
    quantity: paramsOrTx.quantity,
    reissuable: paramsOrTx.reissuable,
    chainId: networkByte(paramsOrTx.chainId, 87),
    fee: fee(paramsOrTx,100000000),
    timestamp: paramsOrTx.timestamp || Date.now(),
    proofs: paramsOrTx.proofs || [],
    id: '',
  };

  const bytes = binary.serializeTx(tx);

  seedsAndIndexes.forEach(([s,i]) => addProof(tx, signBytes(bytes, s),i));
  tx.id = hashBytes(bytes);

  return tx
}