import { IssueTransaction, TransactionType } from '../transactions'
import { concat, BASE58_STRING, BYTE, LEN, SHORT, STRING, LONG, signBytes, hashBytes, BYTES, BOOL } from 'waves-crypto'
import { pullSeedAndIndex, addProof, mapSeed, getSenderPublicKey } from '../generic'
import { SeedTypes, Params} from '../types'
import { ValidationResult } from 'waves-crypto/validation'
import { generalValidation, raiseValidationErrors } from '../validation'
import { VALIDATOR_MAP } from '../schemas'

export interface IssueParams extends Params {
  name: string
  description: string
  decimals?: number
  quantity: number
  reissuable?: boolean
  fee?: number
  timestamp?: number
  chainId?: string
}

export const issueValidation = (tx: IssueTransaction): ValidationResult => []

export const issueToBytes = (tx: IssueTransaction): Uint8Array => concat(
  BYTES([TransactionType.Issue, tx.version, tx.chainId.charCodeAt(0)]),
  BASE58_STRING(tx.senderPublicKey),
  LEN(SHORT)(STRING)(tx.name),
  LEN(SHORT)(STRING)(tx.description),
  LONG(tx.quantity),
  BYTE(tx.decimals),
  BOOL(tx.reissuable),
  LONG(tx.fee),
  LONG(tx.timestamp),
  [0] //Script
)

/* @echo DOCS */
export function issue(paramsOrTx: IssueParams | IssueTransaction, seed?: SeedTypes): IssueTransaction {
  const { nextSeed } = pullSeedAndIndex(seed)

  const senderPublicKey = getSenderPublicKey(seed, paramsOrTx)

  const tx: IssueTransaction = {
      type: TransactionType.Issue,
      version: 2,
      decimals: 8,
      reissuable: false,
      fee:100000000,
      senderPublicKey,
      timestamp: Date.now(),
      chainId: 'W',
      proofs: [],
      id: '',
        ...paramsOrTx,
    }

    raiseValidationErrors(
      generalValidation(tx, VALIDATOR_MAP['IssueTransaction']),
      issueValidation(tx)
    )

  const bytes = issueToBytes(tx)

  mapSeed(seed, (s, i) => addProof(tx, signBytes(bytes, s), i))
  tx.id = hashBytes(bytes)
  return nextSeed ? issue(tx, nextSeed) : tx
}