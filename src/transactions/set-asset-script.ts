import {
  TRANSACTION_TYPE,
  ISetAssetScriptTransaction,
  ISetAssetScriptParams,
  WithId,
  WithSender
} from '../transactions'
import {
  concat,
  BASE58_STRING,
  LONG,
  signBytes,
  hashBytes,
  BYTES,
  BASE64_STRING,
  OPTION,
  LEN,
  SHORT
} from 'waves-crypto'
import { addProof, getSenderPublicKey, base64Prefix, convertToPairs, networkByte, fee } from '../generic'
import { TSeedTypes } from '../types'
import { binary } from '/Users/siem/IdeaProjects/tx-parse-serialize/dist'

export const setAssetScriptToBytes = (tx: ISetAssetScriptTransaction): Uint8Array => concat(
  BYTES([TRANSACTION_TYPE.SET_ASSET_SCRIPT, tx.version, tx.chainId]),
  BASE58_STRING(tx.senderPublicKey),
  BASE58_STRING(tx.assetId),
  LONG(tx.fee),
  LONG(tx.timestamp),
  OPTION(LEN(SHORT)(BASE64_STRING))(tx.script ? tx.script.slice(7) : null)
);

/* @echo DOCS */
export function setAssetScript(params: ISetAssetScriptParams, seed: TSeedTypes): ISetAssetScriptTransaction & WithId;
export function setAssetScript(paramsOrTx: ISetAssetScriptParams & WithSender | ISetAssetScriptTransaction, seed?: TSeedTypes): ISetAssetScriptTransaction & WithId;
export function setAssetScript(paramsOrTx: any, seed?: TSeedTypes): ISetAssetScriptTransaction & WithId {
  const type = TRANSACTION_TYPE.SET_ASSET_SCRIPT;
  const version = paramsOrTx.version || 1;
  const seedsAndIndexes = convertToPairs(seed);
  const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx);
  if (paramsOrTx.script == null) throw new Error('Asset script cannot be empty')

  const tx: ISetAssetScriptTransaction & WithId = {
    type,
    version,
    senderPublicKey,
    assetId: paramsOrTx.assetId,
    chainId: networkByte(paramsOrTx.chainId, 87),
    fee: fee(paramsOrTx, 100000000),
    timestamp: paramsOrTx.timestamp || Date.now(),
    proofs: paramsOrTx.proofs || [],
    id: '',
    script: base64Prefix(paramsOrTx.script),
  };

  const bytes = binary.serializeTx(tx);

  seedsAndIndexes.forEach(([s, i]) => addProof(tx, signBytes(bytes, s), i));
  tx.id = hashBytes(bytes);

  return tx
}
