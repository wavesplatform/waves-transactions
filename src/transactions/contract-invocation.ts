import {
  TRANSACTION_TYPE,
  WithId,
  WithSender,
  IContractInvocationParams,
  IContractInvocationTransaction
} from '../transactions'
import { signBytes, hashBytes, } from '@waves/waves-crypto'
import { addProof, getSenderPublicKey, convertToPairs, fee, networkByte } from '../generic'
import { TSeedTypes } from '../types'
import { binary } from '@waves/marshall'


/* @echo DOCS */
export function contractInvocation(params: IContractInvocationParams, seed: TSeedTypes): IContractInvocationTransaction & WithId;
export function contractInvocation(paramsOrTx: IContractInvocationParams & WithSender | IContractInvocationTransaction, seed?: TSeedTypes): IContractInvocationTransaction & WithId;
export function contractInvocation(paramsOrTx: any, seed?: TSeedTypes): IContractInvocationTransaction & WithId {
  const type = TRANSACTION_TYPE.CONTRACT_INVOCATION;
  const version = paramsOrTx.version || 1;
  const seedsAndIndexes = convertToPairs(seed);
  const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx);

  const tx: IContractInvocationTransaction & WithId = {
    type,
    version,
    senderPublicKey,
    contractAddress: paramsOrTx.contractAddress,
    call: paramsOrTx.call,
    payment: paramsOrTx.payment,
    fee: fee(paramsOrTx, 1000000),
    timestamp: Date.now(),
    chainId: networkByte(paramsOrTx.chainId, 87),
    proofs: paramsOrTx.proofs || [],
    id: '',
  };

  const bytes = binary.serializeTx(tx);

  seedsAndIndexes.forEach(([s, i]) => addProof(tx, signBytes(bytes, s), i));
  tx.id = hashBytes(bytes);

  //FixMe: for now node requires to have empty key field in args
  tx.call.args = tx.call.args.map(arg => ({...arg, key: ''}));

  return tx
}