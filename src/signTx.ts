import { TransactionType, Tx } from './transactions'
import { SeedTypes } from "./types";
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