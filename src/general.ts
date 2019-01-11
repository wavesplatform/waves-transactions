import axios from 'axios'
import {
  IAliasTransaction,
  IBurnTransaction, ICancelLeaseTransaction, IDataTransaction,
  IIssueTransaction, ILeaseTransaction, IMassTransferTransaction,
  IOrder, IReissueTransaction, ISetAssetScriptTransaction, ISetScriptTransaction, ITransferTransaction,
  TRANSACTION_TYPE,
  TTx,
  TTxParams
} from './transactions'
import { TSeedTypes } from './types'
import { issue } from './transactions/issue'
import { transfer } from './transactions/transfer'
import { reissue } from './transactions/reissue'
import { burn } from './transactions/burn'
import { lease } from './transactions/lease'
import { cancelLease } from './transactions/cancel-lease'
import { data } from './transactions/data'
import { massTransfer } from './transactions/mass-transfer'
import { alias } from './transactions/alias'
import { setScript } from './transactions/set-script'
import { isOrder } from "./generic";
import { setAssetScript } from "./transactions/set-asset-script";
import { binary, json } from '@waves/marshall'

export interface WithTxType {
  type: TRANSACTION_TYPE
}

export const txTypeMap: { [type: number]: { sign: (tx: TTx | TTxParams & WithTxType, seed: TSeedTypes) => TTx } } = {
  [TRANSACTION_TYPE.ISSUE]: { sign: (x, seed) => issue(x as IIssueTransaction, seed)},
  [TRANSACTION_TYPE.TRANSFER]: { sign: (x, seed) => transfer(x as ITransferTransaction, seed) },
  [TRANSACTION_TYPE.REISSUE]: { sign: (x, seed) => reissue(x as IReissueTransaction, seed) },
  [TRANSACTION_TYPE.BURN]: { sign: (x, seed) => burn(x as IBurnTransaction, seed) },
  [TRANSACTION_TYPE.LEASE]: { sign: (x, seed) => lease(x as ILeaseTransaction, seed) },
  [TRANSACTION_TYPE.CANCEL_LEASE]: { sign: (x, seed) => cancelLease(x as ICancelLeaseTransaction, seed) },
  [TRANSACTION_TYPE.ALIAS]: { sign: (x, seed) => alias(x as IAliasTransaction, seed) },
  [TRANSACTION_TYPE.MASS_TRANSFER]: { sign: (x, seed) => massTransfer(x as IMassTransferTransaction, seed) },
  [TRANSACTION_TYPE.DATA]: { sign: (x, seed) => data(x as IDataTransaction, seed)},
  [TRANSACTION_TYPE.SET_SCRIPT]: { sign: (x, seed) => setScript(x as ISetScriptTransaction, seed) },
  [TRANSACTION_TYPE.SET_ASSET_SCRIPT]: { sign: (x, seed) => setAssetScript(x as ISetAssetScriptTransaction, seed) }
};

export const signTx = (tx: TTx | TTxParams & WithTxType, seed: TSeedTypes): TTx => {
  if (!txTypeMap[tx.type]) throw new Error(`Unknown tx type: ${tx.type}`)

  return txTypeMap[tx.type].sign(tx, seed)
};


export const serialize = (obj: TTx | IOrder): Uint8Array => {
  if (isOrder(obj)) return binary.serializeOrder(obj);
  return binary.serializeTx(obj);
};

export const broadcast = (tx: TTx, apiBase: string) =>
  axios.post('transactions/broadcast', json.stringifyTx(tx), {
    baseURL: apiBase,
    headers: { 'content-type': 'application/json' }
  })
    .then(x => x.data)
    .catch(e => Promise.reject(e.response && e.response.status === 400 ? new Error(e.response.data.message) : e))
