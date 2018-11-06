import { TransactionType, Tx } from './transactions'
import { SeedTypes } from "./generic";
import { issue } from "./transactions/issue";
import { transfer } from "./transactions/transfer";
import { reissue } from "./transactions/reissue";
import { burn } from "./transactions/burn";
import { lease } from "./transactions/lease";
import { cancelLease } from "./transactions/cancel-lease";
import { data } from "./transactions/data";
import { massTransfer } from "./transactions/mass-transfer";
import { alias } from "./transactions/alias";
import { setScript } from "./transactions/set-script";

export function signTx(seed: SeedTypes, tx: Tx): Tx {
  switch (tx.type) {
    case TransactionType.Issue:
      return issue(seed, tx);
    case TransactionType.Transfer:
      return transfer(seed, tx);
    case TransactionType.Reissue:
      return reissue(seed, tx);
    case TransactionType.Burn:
      return burn(seed, tx);
    case TransactionType.Lease:
      return lease(seed, tx);
    case TransactionType.CancelLease:
      return cancelLease(seed, tx);
    case TransactionType.Alias:
      return alias(seed, tx);
    case TransactionType.MassTransfer:
      return massTransfer(seed, tx);
    case TransactionType.Data:
      return data(seed, tx);
    case TransactionType.SetScript:
      return setScript(seed, tx);
    default:
      throw new Error(`Unknown tx type: ${tx!.type}`)
  }
}