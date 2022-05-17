/**
 * @module index
 */
import {IIssueParams, WithId, WithProofs, WithSender} from '../transactions'
import {base58Encode, blake2b, signBytes} from '@waves/ts-lib-crypto'
import {addProof, base64Prefix, convertToPairs, fee, getSenderPublicKey, networkByte} from '../generic'
import {TSeedTypes} from '../types'
import {binary} from '@waves/marshall'
import {validate} from '../validators'
import {txToProtoBytes} from '../proto-serialize'
import {DEFAULT_VERSIONS} from '../defaultVersions'
import {IssueTransaction, TRANSACTION_TYPE} from '@waves/ts-types'

/* @echo DOCS */
export function issue(params: IIssueParams, seed: TSeedTypes): IssueTransaction & WithId & WithProofs
export function issue(paramsOrTx: IIssueParams & WithSender | IssueTransaction, seed?: TSeedTypes): IssueTransaction & WithId & WithProofs
export function issue(paramsOrTx: any, seed?: TSeedTypes): IssueTransaction & WithId & WithProofs {
  const type = TRANSACTION_TYPE.ISSUE
  const version = paramsOrTx.version || DEFAULT_VERSIONS.ISSUE
  const seedsAndIndexes = convertToPairs(seed)
  const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx)

  const tx: IssueTransaction & WithId & WithProofs = {
    type,
    version,
    senderPublicKey,
    name: paramsOrTx.name,
    description: paramsOrTx.description,
    quantity: paramsOrTx.quantity,
    script: paramsOrTx.script == null ? null : base64Prefix(paramsOrTx.script)!,
    decimals: paramsOrTx.decimals == null ? 8 : paramsOrTx.decimals,
    reissuable: paramsOrTx.reissuable || false,
    fee: checkForNFT(paramsOrTx) ? fee(paramsOrTx, 100000) : fee(paramsOrTx, 100000000),
    timestamp: paramsOrTx.timestamp || Date.now(),
    chainId: networkByte(paramsOrTx.chainId, 87),
    proofs: paramsOrTx.proofs || [],
    id: '',
  }

  validate.issue(tx);

  const bytes = version > 2 ? txToProtoBytes(tx) : binary.serializeTx(tx);

  seedsAndIndexes.forEach(([s, i]) => addProof(tx, signBytes(s, bytes), i));
  tx.id = base58Encode(blake2b(bytes))

  return tx
}

const checkForNFT = (paramsOrTx: any) => {
  return paramsOrTx.quantity === 1 && paramsOrTx.reissuable == false && paramsOrTx.decimals == 0
}
