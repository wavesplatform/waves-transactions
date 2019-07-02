import { randomBytes } from '@waves/waves-crypto'

/**
 * Before running test ensure MASTER_SEED has at leas 10 WAVES!!
 */
export const MASTER_SEED = 'test acc 2'
export const API_BASE = 'https://testnodes.wavesnodes.com'
export const CHAIN_ID = 'T'

export const MATCHER_PUBLIC_KEY = '8QUAqtTckM5B8gvcuP7mMswat9SjKUuafJMusEoSn1Gy'
export const MATCHER_URL = 'https://matcher.testnet.wavesnodes.com/'

export const TIMEOUT = 200000

export const randomHexString = (l: number) => [...randomBytes(l)].map(n => n.toString(16)).join('')