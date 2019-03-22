import {
  TRANSACTION_TYPE,
  WithId,
  WithSender,
  IInvokeScriptParams,
  IInvokeScriptTransaction
} from '../transactions'
import { signBytes, hashBytes, } from '@waves/waves-crypto'
import { addProof, getSenderPublicKey, convertToPairs, fee, networkByte } from '../generic'
import { TSeedTypes } from '../types'
import { binary } from '@waves/marshall'


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
    dappAddress: paramsOrTx.dappAddress,
    call: paramsOrTx.call,
    payment: paramsOrTx.payment || [],
    fee: fee(paramsOrTx, 1000000),
    feeAssetId: paramsOrTx.feeAssetId,
    timestamp: Date.now(),
    chainId: networkByte(paramsOrTx.chainId, 87),
    proofs: paramsOrTx.proofs || [],
    id: '',
  }

  const bytes = binary.serializeTx(tx)

  seedsAndIndexes.forEach(([s, i]) => addProof(tx, signBytes(bytes, s), i))
  tx.id = hashBytes(bytes)

  //FixMe: for now node requires to have empty key field in args
  tx.call.args = tx.call.args.map(arg => ({ ...arg, key: '' }))

  return tx
}