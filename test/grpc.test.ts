// import { exampleTxs } from './exampleTxs'
// import { libs, TTx } from '../src'
// import * as grpcService from '@waves/protobuf-serialization/dist/waves/node/grpc/Transactions_apiServiceClientPb'
// import * as waves_transaction_pb from "@waves/protobuf-serialization/dist/waves/transaction_pb"
// import { protoBytesToTx, txToProtoBytes, txToProto } from '../src/proto-serialize'
// import * as wavesProto from '@waves/protobuf-serialization'
// import { transfer } from '../src/transactions/transfer'
//
// (global as any).XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest
//
// const SEED = 'test acc 2'
// describe('serializes and parses txs', () => {
//   it('broadcasts transactions', async () => {
//     const ttx = transfer({
//       recipient: libs.crypto.address(SEED, 'S'),
//       amount: 1000
//     }, SEED)
//     const client = new grpcService.TransactionsApiClient('http://localhost:8081')
//     const tx = txToProto(ttx)
//     const proofs = ttx.proofs.map(p => libs.crypto.base58Decode(p))
//     const signedTransaction = new wavesProto.waves.SignedTransaction({ transaction: tx, proofs: proofs })
//     const signedTransactionBytes = wavesProto.waves.SignedTransaction.encode(signedTransaction).finish()
//     const stx = waves_transaction_pb.SignedTransaction.deserializeBinary(signedTransactionBytes)
//     client.broadcast(stx, null, (err: any, resp: any) => {
//       console.log('a')
//       if (err) {
//         console.error(err)
//       } else {
//         console.log(resp)
//       }
//     })
//   }, 10000)
//
//
// },)
