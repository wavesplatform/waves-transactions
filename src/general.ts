import { Order, TransactionType, Tx } from './transactions'
import { SeedTypes } from "./types";
import { issue, issueToBytes } from "./transactions/issue";
import { transfer, transferToBytes } from "./transactions/transfer";
import { reissue, reissueToBytes } from "./transactions/reissue";
import { burn, burnToBytes } from "./transactions/burn";
import { lease, leaseToBytes } from "./transactions/lease";
import { cancelLease, cancelLeaseToBytes } from "./transactions/cancel-lease";
import { data, dataToBytes } from "./transactions/data";
import { massTransfer, massTransferToBytes } from "./transactions/mass-transfer";
import { alias, aliasToBytes } from "./transactions/alias";
import { setScript, setScriptToBytes } from "./transactions/set-script";
import { isOrder, orderToBytes } from "./transactions/order";
import axios from "axios";

export function signTx(tx: Tx, seed: SeedTypes): Tx {
  if (seed == null) throw new Error("Seed is not provided");
  switch (tx.type) {
    case TransactionType.Issue:
      return issue(tx, seed);
    case TransactionType.Transfer:
      return transfer(tx, seed);
    case TransactionType.Reissue:
      return reissue(tx, seed);
    case TransactionType.Burn:
      return burn(tx, seed);
    case TransactionType.Lease:
      return lease(tx, seed);
    case TransactionType.CancelLease:
      return cancelLease(tx, seed);
    case TransactionType.Alias:
      return alias(tx, seed);
    case TransactionType.MassTransfer:
      return massTransfer(tx, seed);
    case TransactionType.Data:
      return data(tx, seed);
    case TransactionType.SetScript:
      return setScript(tx, seed);
    default:
      throw new Error(`Unknown tx type: ${tx!.type}`)
  }
}

export function serialize(obj: Tx | Order): Uint8Array {
  if (isOrder(obj)) return orderToBytes(obj)
  switch (obj.type) {
    case TransactionType.Issue:
      return issueToBytes(obj);
    case TransactionType.Transfer:
      return transferToBytes(obj);
    case TransactionType.Reissue:
      return reissueToBytes(obj);
    case TransactionType.Burn:
      return burnToBytes(obj);
    case TransactionType.Lease:
      return leaseToBytes(obj);
    case TransactionType.CancelLease:
      return cancelLeaseToBytes(obj);
    case TransactionType.Alias:
      return aliasToBytes(obj);
    case TransactionType.MassTransfer:
      return massTransferToBytes(obj);
    case TransactionType.Data:
      return dataToBytes(obj);
    case TransactionType.SetScript:
      return setScriptToBytes(obj);
    default:
      throw new Error(`Unknown object type: ${obj}`)
  }
}

export async function broadcast(tx: Tx, apiBase: string) {
  const instance = axios.create({
    baseURL: apiBase
  });
  try{
    const resp = await instance.post('transactions/broadcast', tx);
    return resp.data
  }catch (e) {
    if (e.response && e.response.status === 400){
      throw new Error(e.response.data.message)
    }else throw e
  }
};