import { TRANSACTION_TYPE, IReissueTransaction, IReissueParams, WithId } from '../transactions'
import { concat, BASE58_STRING, LONG, signBytes, hashBytes, BYTES, BOOL } from 'waves-crypto'
import { addProof, convertToPairs, getSenderPublicKey } from '../generic'
import { TSeedTypes } from '../types'
import { binary } from '/Users/siem/IdeaProjects/tx-parse-serialize/dist'


export const reissueToBytes = (tx: IReissueTransaction): Uint8Array => concat(
  BYTES([TRANSACTION_TYPE.REISSUE, tx.version, tx.chainId.charCodeAt(0)]),
  BASE58_STRING(tx.senderPublicKey),
  BASE58_STRING(tx.assetId),
  LONG(tx.quantity),
  BOOL(tx.reissuable),
  LONG(tx.fee),
  LONG(tx.timestamp)
)

/* @echo DOCS */
export function reissue(paramsOrTx: IReissueParams | IReissueTransaction, seed?: TSeedTypes): IReissueTransaction & WithId{
  const seedsAndIndexes = convertToPairs(seed);
  const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx);

  const tx: IReissueTransaction & WithId = {
    type: TRANSACTION_TYPE.REISSUE,
    version: 2,
    chainId: 'W',
    fee: 100000000,
    senderPublicKey,
    timestamp: Date.now(),
    proofs: [],
    id: '',
    ...paramsOrTx,
  };

  const bytes = binary.serializeTx(tx);

  seedsAndIndexes.forEach(([s,i]) => addProof(tx, signBytes(bytes, s),i));
  tx.id = hashBytes(bytes);

  return tx as any
}