import Ajv, {ValidateFunction} from 'ajv'
import schemas from './manifest'

const ajv = Ajv({
  allErrors: true
})

const mapObj = <T>(obj: any, f:(v:any)=>any): {[key:string]: ValidateFunction} => {
  return Object.entries(obj).map(([k,v]) => [k, f(v)]).reduce((acc, [k,v]) => ({...acc,[k]:v}), {} as any)
}

export const VALIDATOR_MAP = mapObj(schemas, ajv.compile.bind(ajv))
