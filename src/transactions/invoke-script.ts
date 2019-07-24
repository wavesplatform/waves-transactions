/**
 * @module index
 */
import {
  TRANSACTION_TYPE,
  WithId,
  WithSender,
  IInvokeScriptParams,
  IInvokeScriptTransaction, IInvokeScriptPayment
} from '../transactions'
import { signBytes, blake2b, base58Encode, } from '@waves/ts-lib-crypto'
import { addProof, getSenderPublicKey, convertToPairs, fee, networkByte, normalizeAssetId } from '../generic'
import { TSeedTypes } from '../types'
import { binary } from '@waves/marshall'
import { validate } from '../validators'


/* @echo DOCS */
export function invokeScript(params: IInvokeScriptParams, seed: TSeedTypes): IInvokeScriptTransaction & WithId
export function invokeScript(paramsOrTx: IInvokeScriptParams & WithSender | IInvokeScriptTransaction, seed?: TSeedTypes): IInvokeScriptTransaction & WithId
export function invokeScript(paramsOrTx: any, seed?: TSeedTypes): IInvokeScriptTransaction & WithId {
  const type = TRANSACTION_TYPE.INVOKE_SCRIPT
  const version = paramsOrTx.version || 1
  const seedsAndIndexes = convertToPairs(seed)
  const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx)

  const tx: IInvokeScriptTransaction & WithId = {
    type,
    version,
    senderPublicKey,
    dApp: paramsOrTx.dApp,
    call: paramsOrTx.call && {args: [], ...paramsOrTx.call},
    payment: mapPayment(paramsOrTx.payment),
    fee: fee(paramsOrTx, 500000),
    feeAssetId: normalizeAssetId(paramsOrTx.feeAssetId),
    timestamp: paramsOrTx.timestamp || Date.now(),
    chainId: networkByte(paramsOrTx.chainId, 87),
    proofs: paramsOrTx.proofs || [],
    id: '',
  }

  validate.invokeScript(tx)
  
  const bytes = binary.serializeTx(tx)

  seedsAndIndexes.forEach(([s, i]) => addProof(tx, signBytes(s, bytes), i))
  tx.id = base58Encode(base58Encode(blake2b(bytes)))

  return tx
}

const mapPayment = (payments?: IInvokeScriptPayment[]): IInvokeScriptPayment[] => payments == null
  ? []
  : payments.map(pmt => ({...pmt, assetId: pmt.assetId === 'WAVES' ? null : pmt.assetId}))
