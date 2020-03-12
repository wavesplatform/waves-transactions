import { address, privateKey, randomBytes } from '@waves/ts-lib-crypto';

/**
 * Before running test ensure MASTER_SEED has at leas 10 WAVES!!
 */
// export const CHAIN_ID = 'S'
// export const API_BASE = 'https://nodes-stagenet.wavesnodes.com' //3MVCPdW6ZUzLSmMj4RnpZKva1cnTdxQKtNt

export const CHAIN_ID = 'T'
export const API_BASE = 'https://nodes-testnet.wavesnodes.com'

// export const MASTER_SEED = 'test acc 2'
export const MASTER_SEED = 'test acc 2'
console.log(address(MASTER_SEED, CHAIN_ID))
export const MATCHER_PUBLIC_KEY = '8QUAqtTckM5B8gvcuP7mMswat9SjKUuafJMusEoSn1Gy'
export const MATCHER_URL = 'https://matcher.testnet.wavesnodes.com/'

export const TIMEOUT = 200000

export const randomHexString = (l: number) => [...randomBytes(l)].map(n => n.toString(16)).join('')
