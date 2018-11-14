export const issueTx = {
  type: 3,
  version: 2,
  decimals: 8,
  reissuable: false,
  fee: 100000000,
  senderPublicKey: '7GGPvAPV3Gmxo4eswmBRLb6bXXEhAovPinfcwVkA2LJh',
  timestamp: 1542220949024,
  chainId: 'W',
  proofs:
    ['4kknVE9LiB3bATTN7nsLWuR94ybeCYaDHKQatEhR94bCStdf4zAty4Zspma1URHY71VEuBjsu8hCkCpS5zg3wVuf'],
  id: '4qmeEkvJAdy8WZ9aDtki9FvhopouwGebQzSNTrVkGJCR',
  assetId: 'test',
  quantity: 10000,
  name: 'test',
  description: 'tratata',
}

export const transferTx = {
  type: 4,
  version: 2,
  fee: 100000,
  senderPublicKey: '7GGPvAPV3Gmxo4eswmBRLb6bXXEhAovPinfcwVkA2LJh',
  timestamp: 1542220949042,
  proofs:
    ['2N3t8fdU1q1Nz2jNSGMe7eGhS9gLYF58kV57ydL9pMrc5D4RJc771XycDbMxABdbRRMTEF5T62NEnkv9X1Egf4YT'],
  id: 'D9LR1EULg4P58GNc1uTdeUyiAqHpbW8EZmbw18pGvo9m',
  recipient: 'aaaa',
  amount: 10000,
}

export const reissueTx = {
  type: 5,
  version: 2,
  chainId: 'W',
  fee: 100000000,
  senderPublicKey: '7GGPvAPV3Gmxo4eswmBRLb6bXXEhAovPinfcwVkA2LJh',
  timestamp: 1542220949056,
  proofs:
    ['2Jqtj4Bhgehi1pBPMQkhvFDRs3Fh6nBXt8siacTDUcjzuTgh5jjsW5PS1eHUpbbZNkzEuTJhCR2CgoR4wrnDEPyP'],
  id: '7F55EV6jKrhaTPVznaSBx1gx6mydWpuriH1DzFQWdLdD',
  assetId: 'test',
  quantity: 10000,
  reissuable: false,
}

export const burnTx = {
  type: 6,
  version: 2,
  chainId: 'W',
  fee: 100000,
  senderPublicKey: '7GGPvAPV3Gmxo4eswmBRLb6bXXEhAovPinfcwVkA2LJh',
  timestamp: 1542220949071,
  proofs:
    ['DsKeNcWxk9ybpRKaek63PMHS53ETtT4jTqRjMfB17HPyC8Uzu2fpxiP6Am9ACx7NQNaxgLbTHc6djyeC8fG1t56'],
  id: '25CrnCXsmiPiTfvLMqWSnQARkrHB6y2dBSoGNzCEfy1Z',
  assetId: 'test',
  quantity: 10000,
}

export const leaseTx = {
  type: 8,
  version: 2,
  fee: 100000,
  senderPublicKey: '7GGPvAPV3Gmxo4eswmBRLb6bXXEhAovPinfcwVkA2LJh',
  timestamp: 1542220949089,
  proofs:
    ['KVLyuE7r9TZiYky3Nhy3He92NfgA8y2wRucXFBmVKuNidYfhn9cvQc8wvQJsReLkQqTSFqa4NQ2LyyaPkSrL5EW'],
  id: '3kCVEhJs3QJwqW55K8TJGUumZDwrkYqWBSaQjMqESZt1',
  recipient: 'sssss',
  amount: 10000,
}

export const cancelLeaseTx = {
  type: 9,
  version: 2,
  fee: 100000,
  senderPublicKey: '7GGPvAPV3Gmxo4eswmBRLb6bXXEhAovPinfcwVkA2LJh',
  timestamp: 1542220949104,
  chainId: 'W',
  proofs:
    ['2MZfunNG8BekntdaRcuJaVVr56oNFTmbQoehpeBUQYexpzE5x45YzX44q1XjTLvhL77uUmosR3b95wQcqbFFSqhs'],
  id: '6Nkq9ccU9WXzVWHRW1t81BdqksSavCabiXuEacjuvZKc',
  leaseId: 'test',
}

export const aliasTx = {
  type: 10,
  version: 2,
  fee: 100000,
  senderPublicKey: '7GGPvAPV3Gmxo4eswmBRLb6bXXEhAovPinfcwVkA2LJh',
  timestamp: 1542220949120,
  id: 'GUr1PbA29hac7Tjb2ZfFL3jt8q7VnRVetszP3et4hfce',
  proofs:
    ['4KdqsZzv62gqd6quMSLcGjJswB5PKmbD3dpPBLvvVSDXJFQUyyApBFbat4p3rFX3b6z1g2AnYqMzA9JpLkP2ASmK'],
  alias: 'MyTestAlias',
}

export const massTransferTx = {
  type: 11,
  version: 1,
  fee: 200000,
  senderPublicKey: '7GGPvAPV3Gmxo4eswmBRLb6bXXEhAovPinfcwVkA2LJh',
  timestamp: 1542220949163,
  proofs:
    ['38Ud1tigEtytuFDH8oBfhtUQUy9GdSH7RFcNwuW6yXf8H8i6g8FPrSyVQfwTEU5zHLjp1mr5spWHrir4dH3X6BSJ'],
  id: 'F68JGjbrgyFiARuVwX9k9xkaeWcfGKqg4AXC8VvtrB9b',
  transfers:
    [{ recipient: 'aaa', amount: 10000 },
    { recipient: 'aab', amount: 10000 }],
}

export const dataTx = {
  type: 12,
  version: 1,
  senderPublicKey: '7GGPvAPV3Gmxo4eswmBRLb6bXXEhAovPinfcwVkA2LJh',
  fee: 100000,
  timestamp: 1542220949185,
  proofs:
    ['2EEBs8jWGwJPWSLxATb7uyncDYuBcp9hPhWmi9Q11bBoak87Cn3UzvHpFEckFvq3BACrf7MPcUjATPHFowvKRQrp'],
  id: 'SLG8x5uQxgDQXbzTcnFvuQwgKZeAwyo5QQA6f4UMYn2',
  data:
    [{ type: 'binary', key: 'someparam', value: 'base64:AQIDBA==' },
    { key: 'someparam2', type: 'binary', value: 'base64:YXNkYQ==' },
    { type: 'boolean', key: 'someparam3', value: true }],
}

export const setScriptTx = {
  type: 13,
  version: 1,
  fee: 1000000,
  senderPublicKey: '7GGPvAPV3Gmxo4eswmBRLb6bXXEhAovPinfcwVkA2LJh',
  timestamp: 1542220949206,
  chainId: 'W',
  proofs:
    ['UkaqdvZbWGAeNF1yho9XUjNvN3bZHRTtcT2A4tRhfsW8BtS9HvNZYpRnWgt57W1M3QjgSTJwmrshMFhrtcFC1rx'],
  id: 'GF7hZx6ew6w1zyRRUwRU8BBmBPEf1WgHfmZpvPXnB1pK',
  script: 'base64:AQa3b8tH',
}
