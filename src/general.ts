import axios from 'axios'
import {
  IAliasTransaction,
  IBurnTransaction,
  ICancelLeaseTransaction,
  IDataTransaction,
  IIssueTransaction,
  ILeaseTransaction,
  IMassTransferTransaction,
  IOrder,
  IReissueTransaction,
  ISetAssetScriptTransaction,
  ISetScriptTransaction,
  ITransferTransaction,
  TRANSACTION_TYPE,
  TTx,
  TTxParams
} from './transactions'
import { TSeedTypes } from './types'
import { issue, issueToBytes } from './transactions/issue'
import { transfer, transferToBytes } from './transactions/transfer'
import { reissue, reissueToBytes } from './transactions/reissue'
import { burn, burnToBytes } from './transactions/burn'
import { lease, leaseToBytes } from './transactions/lease'
import { cancelLease, cancelLeaseToBytes } from './transactions/cancel-lease'
import { data, dataToBytes } from './transactions/data'
import { massTransfer, massTransferToBytes } from './transactions/mass-transfer'
import { alias, aliasToBytes } from './transactions/alias'
import { setScript, setScriptToBytes } from './transactions/set-script'
import { orderToBytes } from './transactions/order'
import { isOrder} from "./generic";
import { txToJson } from './txToJson'
import { setAssetScript, setAssetScriptToBytes } from "./transactions/set-asset-script";

export interface WithTxType {
  type: TRANSACTION_TYPE
}

export const txTypeMap: { [type: number]: { sign: (tx: TTx | TTxParams & WithTxType, seed: TSeedTypes) => TTx, serialize: (obj: TTx | IOrder) => Uint8Array } } = {
  [TRANSACTION_TYPE.ISSUE]: { sign: (x, seed) => issue(x as IIssueTransaction, seed), serialize: (x) => issueToBytes(x as IIssueTransaction) },
  [TRANSACTION_TYPE.TRANSFER]: { sign: (x, seed) => transfer(x as ITransferTransaction, seed), serialize: (x) => transferToBytes(x as ITransferTransaction) },
  [TRANSACTION_TYPE.REISSUE]: { sign: (x, seed) => reissue(x as IReissueTransaction, seed), serialize: (x) => reissueToBytes(x as IReissueTransaction) },
  [TRANSACTION_TYPE.BURN]: { sign: (x, seed) => burn(x as IBurnTransaction, seed), serialize: (x) => burnToBytes(x as IBurnTransaction) },
  [TRANSACTION_TYPE.LEASE]: { sign: (x, seed) => lease(x as ILeaseTransaction, seed), serialize: (x) => leaseToBytes(x as ILeaseTransaction) },
  [TRANSACTION_TYPE.CANCEL_LEASE]: { sign: (x, seed) => cancelLease(x as ICancelLeaseTransaction, seed), serialize: (x) => cancelLeaseToBytes(x as ICancelLeaseTransaction) },
  [TRANSACTION_TYPE.ALIAS]: { sign: (x, seed) => alias(x as IAliasTransaction, seed), serialize: (x) => aliasToBytes(x as IAliasTransaction) },
  [TRANSACTION_TYPE.MASS_TRANSFER]: { sign: (x, seed) => massTransfer(x as IMassTransferTransaction, seed), serialize: (x) => massTransferToBytes(x as IMassTransferTransaction) },
  [TRANSACTION_TYPE.DATA]: { sign: (x, seed) => data(x as IDataTransaction, seed), serialize: (x) => dataToBytes(x as IDataTransaction) },
  [TRANSACTION_TYPE.SET_SCRIPT]: { sign: (x, seed) => setScript(x as ISetScriptTransaction, seed), serialize: (x) => setScriptToBytes(x as ISetScriptTransaction) },
  [TRANSACTION_TYPE.SET_ASSET_SCRIPT]: { sign: (x, seed) => setAssetScript(x as ISetAssetScriptTransaction, seed), serialize: (x) => setAssetScriptToBytes(x as ISetAssetScriptTransaction) },
}

export const signTx = (tx: TTx | TTxParams & WithTxType, seed: TSeedTypes): TTx => {
  if (!txTypeMap[tx.type]) throw new Error(`Unknown tx type: ${tx.type}`)

  return txTypeMap[tx.type].sign(tx, seed)
};

export const serialize = (obj: TTx | IOrder): Uint8Array => {
  if (isOrder(obj)) return orderToBytes(obj)
  if (!txTypeMap[obj.type]) throw new Error(`Unknown tx type: ${obj.type}`)

  return txTypeMap[obj.type].serialize(obj)
};

export const broadcast = (tx: TTx, apiBase: string) =>
  axios.post('transactions/broadcast', txToJson(tx), { baseURL: apiBase, headers: { 'content-type': 'application/json' } })
    .then(x => x.data)
    .catch(e => Promise.reject(e.response && e.response.status === 400 ? new Error(e.response.data.message) : e))
