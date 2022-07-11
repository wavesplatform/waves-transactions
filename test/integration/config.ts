import { randomBytes } from '@waves/ts-lib-crypto'

/**
 * Before running test ensure MASTER_SEED has at leas 10 WAVES!!
 */
// export const CHAIN_ID = 'S'
// export const API_BASE = 'https://nodes-stagenet.wavesnodes.com' //3MVCPdW6ZUzLSmMj4RnpZKva1cnTdxQKtNt

export const CHAIN_ID = 'T'
export const API_BASE = 'https://nodes-testnet.wavesnodes.com' //3MxhTY7cuPFJibGHcYogpviQipZdc5yeLCu

export const MASTER_SEED = 'test acc 3'
// export const MASTER_SEED = 'next one puppy history bag vanish conduct lion royal dentist reject usual story invite leader'
export const MATCHER_PUBLIC_KEY = '8QUAqtTckM5B8gvcuP7mMswat9SjKUuafJMusEoSn1Gy'
export const MATCHER_URL = 'https://matcher-testnet.waves.exchange/'



export const TIMEOUT = 60000

// @ts-ignore
export const randomHexString = (l: number) => [...randomBytes(l)].map(n => n.toString(16)).join('')
