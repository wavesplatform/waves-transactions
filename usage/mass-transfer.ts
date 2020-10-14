import { massTransfer } from '../dist/index'

const seed = 'example seed phrase'

const params = {
  transfers: [
    {
      amount: 100,
      recipient: '3P23fi1qfVw6RVDn4CH2a5nNouEtWNQ4THs',
    },
    {
      amount: 200,
      recipient: '3PPnqZznWJbPG2Z1Y35w8tZzskiq5AMfUXr',
    },
  ],
  //senderPublicKey: 'by default derived from seed',
  //timestamp: Date.now(),
  //fee: 100000 + transfers.length * 50000,
}

const signedMassTransferTx = massTransfer(params, seed)
console.log(signedMassTransferTx)