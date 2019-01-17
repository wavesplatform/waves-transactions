import { TRANSACTION_TYPE, ISetScriptTransaction, ISetScriptParams, WithId, WithSender } from '../transactions'
import { signBytes, hashBytes, } from '@waves/waves-crypto'
import { addProof, getSenderPublicKey, base64Prefix, convertToPairs, networkByte, fee } from '../generic'
import { TSeedTypes } from '../types'
import { binary } from '@waves/marshall'

/* @echo DOCS */
export function setScript(params: ISetScriptParams, seed: TSeedTypes): ISetScriptTransaction & WithId
export function setScript(paramsOrTx: ISetScriptParams & WithSender | ISetScriptTransaction, seed?: TSeedTypes): ISetScriptTransaction & WithId
export function setScript(paramsOrTx: any, seed?: TSeedTypes): ISetScriptTransaction & WithId {
  const type = TRANSACTION_TYPE.SET_SCRIPT
  const version = paramsOrTx.version || 1
  const seedsAndIndexes = convertToPairs(seed)
  const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx)
  if (paramsOrTx.script === undefined) throw new Error('Script field cannot be undefined. Use null explicitly to remove script')

  const tx: ISetScriptTransaction & WithId = {
    type,
    version,
    senderPublicKey,
    chainId: networkByte(paramsOrTx.chainId, 87),
    fee: fee(paramsOrTx, 1000000),
    timestamp: paramsOrTx.timestamp || Date.now(),
    proofs: paramsOrTx.proofs || [],
    id: '',
    script: base64Prefix(paramsOrTx.script),
  }

  const bytes = binary.serializeTx(tx)

  seedsAndIndexes.forEach(([s,i]) => addProof(tx, signBytes(bytes, s),i))
  tx.id = hashBytes(bytes)

  return tx
}
