import {
  address,
  privateKey,
  publicKey,
  randomUint8Array,
  libs,
  byteArrayToHexString,
  hexStringToByteArray,
  sha256
} from '@waves/waves-crypto'
import dictionary from './dictionary'
import { serializePrimitives, parsePrimitives } from '@waves/marshall'

export class Seed {

  public readonly phrase: string
  public readonly address: string
  public readonly keyPair: {
    publicKey: string,
    privateKey: string
  }

  constructor(phrase: string) {
    if (phrase.length < 12) {
      throw new Error('Your seed length is less than allowed in config')
    }


    this.phrase = phrase
    this.address = address(phrase)
    this.keyPair = {
      privateKey: privateKey(phrase),
      publicKey: publicKey(phrase),
    }

    Object.freeze(this)
    Object.freeze(this.keyPair)
  }

  public encrypt(password: string, encryptionRounds?: number) {
    return Seed.encryptSeedPhrase(this.phrase, password, encryptionRounds)
  }

  public static encryptSeedPhrase(seedPhrase: string, password: string, encryptionRounds: number = 5000): string {
    if (password && password.length < 8) {
      // logger.warn('Your password may be too weak');
    }

    if (encryptionRounds < 1000) {
      // logger.warn('Encryption rounds may be too few');
    }

    if (seedPhrase.length < 12) {
      throw new Error('The seed phrase you are trying to encrypt is too short')
    }

    return encryptSeed(seedPhrase, password, encryptionRounds)
  }

  public static decryptSeedPhrase(encryptedSeedPhrase: string, password: string, encryptionRounds: number = 5000): string {

    const wrongPasswordMessage = 'The password is wrong'

    let phrase

    try {
      phrase = decryptSeed(encryptedSeedPhrase, password, encryptionRounds)
    } catch (e) {
      throw new Error(wrongPasswordMessage)
    }

    if (phrase === '' || phrase.length < 12) {
      throw new Error(wrongPasswordMessage)
    }

    return phrase

  }

  public static create(words: number = 15): Seed {
    const phrase = generateNewSeed(words)
    const minimumSeedLength = 12

    if (phrase.length < minimumSeedLength) {
      // If you see that error you should increase the number of words in the generated seed
      throw new Error(`The resulted seed length is less than the minimum length (${minimumSeedLength})`)
    }

    return new Seed(phrase)
  }

  public static fromExistingPhrase(phrase: string): Seed {
    const minimumSeedLength = 12

    if (phrase.length < minimumSeedLength) {
      // If you see that error you should increase the number of words or set it lower in the config
      throw new Error(`The resulted seed length is less than the minimum length (${minimumSeedLength})`)
    }

    return new Seed(phrase)
  }

}


export function generateNewSeed(length: number) {
  const random = Array.from({ length })
    .map(_ => randomUint8Array(4)
      .reduce((acc, next, i) => acc + next * 2 ** (i * 4), 0)
    )

  const wordCount = dictionary.length
  const phrase = []

  for (let i = 0; i < length; i++) {
    const wordIndex = random[i] % wordCount
    phrase.push(dictionary[wordIndex])
  }

  return phrase.join(' ')
}


export function strengthenPassword(password: string, rounds: number = 5000): string {
  while (rounds--) {
    const bytes = serializePrimitives.STRING(password)
    password = byteArrayToHexString(sha256(bytes))
  }
  return password
}

export function encryptSeed(seed: string, password: string, encryptionRounds?: number): string {

  if (!seed || typeof seed !== 'string') {
    throw new Error('Seed is required')
  }

  if (!password || typeof password !== 'string') {
    throw new Error('Password is required')
  }

  password = strengthenPassword(password, encryptionRounds)
  return libs.CryptoJS.AES.encrypt(seed, password).toString()

}


export function decryptSeed(encryptedSeed: string, password: string, encryptionRounds?: number): string {
  if (!encryptedSeed || typeof encryptedSeed !== 'string') {
    throw new Error('Encrypted seed is required')
  }

  if (!password || typeof password !== 'string') {
    throw new Error('Password is required')
  }

  password = strengthenPassword(password, encryptionRounds)
  const hexSeed = libs.CryptoJS.AES.decrypt(encryptedSeed, password)
  const byteSeed = hexStringToByteArray(hexSeed.toString())
  return parsePrimitives.P_STRING_FIXED(byteSeed.length)(Uint8Array.from(byteSeed)).value
}


