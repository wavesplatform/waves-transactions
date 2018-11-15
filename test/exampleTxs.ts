export const issueTx = {
  type: 3,
  version: 2,
  decimals: 8,
  reissuable: false,
  fee: 100000000,
  senderPublicKey: '7GGPvAPV3Gmxo4eswmBRLb6bXXEhAovPinfcwVkA2LJh',
  timestamp: 1542221991784,
  chainId: 'W',
  proofs:
    ['2cQNW7Z3arV48quzJnzDB46YnwbZHPHXU1CJnqzf8gcx1jmo8WLB5KhSxF9HGvMwm4kU8GnNiVZTXXjkogzjUPD4'],
  id: 'GnbRfN1FvVN6bqTkX7nHNGecvRCz1cUVUHR7jFs9Xd24',
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
  timestamp: 1542221991805,
  proofs:
    ['BM5vkvpA9Q4hBUiTSVr4u73ne5msVsBDvRen8hhPkZzsggtNwBkX6BkutcgmLiGqCcsZugej4p7izPZdYpzNXNJ'],
  id: '2JVyFNogQyVzoct1V3rw2AozyHReGVXWa5i5PndrkGYf',
  recipient: 'aaaa',
  amount: '10000',
}

export const reissueTx = {
  type: 5,
  version: 2,
  chainId: 'W',
  fee: 100000000,
  senderPublicKey: '7GGPvAPV3Gmxo4eswmBRLb6bXXEhAovPinfcwVkA2LJh',
  timestamp: 1542221991821,
  proofs:
    ['3VGki4wW4G3Vy2t94q4GjYf958HrnWMuzwWdGYV2y7TdpQqbcqNdpnBDp1maUw8B8k9RdKyL3q1DofKYFJi9XmHd'],
  id: 'AG6EM99nEoPUFCvipdfLBLFVhFB7tdf5rwYCZeWdp6s4',
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
  timestamp: 1542221991839,
  proofs:
    ['2CTB6wpxXD4LZgQJe2gGcBkyUEoqPnMEvp9i2mbLuqvAcQnp1FCYVizRMN8yMe8nVG9FhMfWUKqZ28qfD6MsJgEQ'],
  id: '2wWZ6dXHfAGfQdxcM1f9Pojzry6232vypgfMHQRHJtcv',
  assetId: 'test',
  quantity: 10000,
}

export const leaseTx = {
  type: 8,
  version: 2,
  fee: 100000,
  senderPublicKey: '7GGPvAPV3Gmxo4eswmBRLb6bXXEhAovPinfcwVkA2LJh',
  timestamp: 1542221991861,
  proofs:
    ['2nytT3T9YPpveTRV1iRNMvEkYYUDELxjq1JwiQ8g8k9HRQRSiMRyeQaMpBMTZEN9nAbgc6WNzi6nV2nZpDmp5JPN'],
  id: '3dogsYhQYwPTjb4b7chXYuLr2WMze3wE37rjsbWUQMUe',
  recipient: 'sssss',
  amount: 10000,
}

export const cancelLeaseTx = {
  type: 9,
  version: 2,
  fee: 100000,
  senderPublicKey: '7GGPvAPV3Gmxo4eswmBRLb6bXXEhAovPinfcwVkA2LJh',
  timestamp: 1542221991885,
  chainId: 'W',
  proofs:
    ['4r8ZqWKg1PYJ1KpPSUZ1XWyFBDCfwhVJnTzoDCuyQxu6qNjBQWWdUbdKMuP725cmPG31qU5Aius8EpiTCnJQhhZM'],
  id: '9weezx5KEqDKobXsfk9Fsr9V1xLZafULsiwYhXSewcTF',
  leaseId: 'test',
}

export const aliasTx = {
  type: 10,
  version: 2,
  fee: 100000,
  senderPublicKey: '7GGPvAPV3Gmxo4eswmBRLb6bXXEhAovPinfcwVkA2LJh',
  timestamp: 1542221991910,
  id: 'B1HWe79wktdz1TNztSiEZgk4YAcSb3qNTxm1vPVs3PPo',
  proofs:
    ['5DKAehbNcAVgUsrwgVrimqXe4Jes7z81QYBtGoHSLfvxcsaGPsXq9eiNz9zwyBTStSKZLshow3BBpRxt4xq6jTQ6'],
  alias: 'MyTestAlias',
}

export const massTransferTx = {
  type: 11,
  version: 1,
  fee: 200000,
  senderPublicKey: '7GGPvAPV3Gmxo4eswmBRLb6bXXEhAovPinfcwVkA2LJh',
  timestamp: 1542221991972,
  proofs:
    ['bJsS418x9QjNw5eCPNG9yVC9WhgUfsqYEv3C9mU8GXVGHBkgwUGLxrFve7v4rLNaFtRLjD7jV78KShXRQRhnCAg'],
  id: 'CrJ54daPArTPFdNEjWxZqGkDFL8NgkJru7yQsoweY44F',
  transfers:
    [{ recipient: 'aaa', amount: 10000 },
    { recipient: 'aab', amount: 10000 }],
}

export const dataTx = {
  type: 12,
  version: 1,
  senderPublicKey: '7GGPvAPV3Gmxo4eswmBRLb6bXXEhAovPinfcwVkA2LJh',
  fee: 100000,
  timestamp: 1542221992012,
  proofs:
    ['B3E7rzQoyc6wHNGg3moXo2ALaJy3bDExpbQ9GKFjn7WhhmLrYede75bkzrWemsxcWqjdtcAzQNhG2u1mRHctCUq'],
  id: 'B6CX13jXGusWUZ68mrjCZwxXtptnthcqPqnZbrYc4kzY',
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
  timestamp: 1542221992061,
  chainId: 'W',
  proofs:
    ['2KmbtwMvXiNhT281x4uCQHSY3Y5CRXuUgdK8xodTETqJkgYrS6dJsmEgLoyXpQCis8hZSUHPHjKvapWEfiKJHfGs'],
  id: '5mrCEXwv8oezJbEnGYqVo3JEsQ2qmrxiC4Vvkx8seMof',
  script: 'base64:AQa3b8tH',
}

export const exampleTxs = { 3: issueTx, 4: transferTx, 5: reissueTx, 6: burnTx, 8: leaseTx, 9: cancelLeaseTx, 10: aliasTx, 11: massTransferTx, 12: dataTx, 13: setScriptTx }
