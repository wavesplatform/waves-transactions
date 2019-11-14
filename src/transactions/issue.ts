/**
 * @module index
 */
import { IIssueTransaction, TRANSACTION_TYPE, IIssueParams, WithId, WithSender } from '../transactions'
import { signBytes, blake2b, base58Encode } from '@waves/ts-lib-crypto'
import { addProof, getSenderPublicKey, base64Prefix, convertToPairs, fee, networkByte } from '../generic'
import { TSeedTypes } from '../types'
import { binary } from '@waves/marshall'
import { validate } from '../validators'

/* @echo DOCS */
export function issue(params: IIssueParams, seed: TSeedTypes): IIssueTransaction & WithId
export function issue(paramsOrTx: IIssueParams & WithSender | IIssueTransaction, seed?: TSeedTypes): IIssueTransaction & WithId
export function issue(paramsOrTx: any, seed?: TSeedTypes): IIssueTransaction & WithId {
  const type = TRANSACTION_TYPE.ISSUE
  const version = paramsOrTx.version || 2
  const seedsAndIndexes = convertToPairs(seed)
  const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx)

  const tx: IIssueTransaction & WithId = {
    type,
    version,
    senderPublicKey,
    name: paramsOrTx.name,
    description: paramsOrTx.description,
    quantity: paramsOrTx.quantity,
    script: paramsOrTx.script == null ? undefined : base64Prefix(paramsOrTx.script)!,
    decimals: paramsOrTx.decimals == null ? 8 : paramsOrTx.decimals,
    reissuable: paramsOrTx.reissuable || false,
    fee: paramsOrTx.quantity === 1 ? fee(paramsOrTx, 1000000) : fee(paramsOrTx, 100000000),
    timestamp: paramsOrTx.timestamp || Date.now(),
    chainId: networkByte(paramsOrTx.chainId, 87),
    proofs: paramsOrTx.proofs || [],
    id: '',
  }

  validate.issue(tx)

  const bytes = binary.serializeTx(tx)

  seedsAndIndexes.forEach(([s, i]) => addProof(tx, signBytes(s, bytes), i))
  tx.id = base58Encode(blake2b(bytes))

  return tx
}
