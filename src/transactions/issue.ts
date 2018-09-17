import { IssueTransaction, TransactionType } from "../transactions"
import { publicKey, concat, BASE58_STRING, BYTE, LEN, SHORT, STRING, LONG, signBytes, hashBytes, BYTES, BOOL } from "waves-crypto"

export interface IssueParams {
  name: string
  description: string
  decimals?: number
  quantity: number
  reissuable?: boolean
  fee?: number
  timestamp?: number
  chainId?: string
}

/* @echo DOCS */
export function issue(seed: string | string[], paramsOrTx: IssueParams | IssueTransaction): IssueTransaction {
  const _seed = typeof seed == 'string' ? seed : seed[0]
  const { name, description, decimals, quantity, reissuable, fee, timestamp, chainId } = paramsOrTx

  const proofs = paramsOrTx['proofs']
  const tx: IssueTransaction = proofs && proofs.length > 0 ?
    paramsOrTx as IssueTransaction : {
      type: TransactionType.Issue,
      version: 2,
      name,
      description,
      decimals: decimals || 8,
      quantity,
      reissuable: reissuable || false,
      fee: fee | 100000000,
      senderPublicKey: publicKey(_seed),
      timestamp: timestamp || Date.now(),
      chainId: chainId || 'W',
      proofs: [],
      id: ''
    }

  const bytes = concat(
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

  tx.proofs = [...tx.proofs, signBytes(bytes, _seed)]
  tx.id = hashBytes(bytes)

  if (typeof seed != 'string' && seed.length > 1) {
    const [, ...rest] = seed
    return issue(rest, tx)
  }

  return tx
}