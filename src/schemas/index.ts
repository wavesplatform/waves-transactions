import Ajv from 'ajv'
import schemas from './manifest'

const ajv = Ajv({
  allErrors: true
})


const mapObj = <T, U, K extends string>(obj: Record<K, T>, f:(v: T)=> U): Record<K, U> =>
  Object.entries<T>(obj).map(([k,v]) => [k, f(v)] as [string, U])
    .reduce((acc, [k,v]) => ({...acc as any, [k]: v}), {} as Record<K,U>)


export const VALIDATOR_MAP = mapObj(schemas, (schema) => ajv.compile(schema));
