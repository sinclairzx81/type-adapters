import { TypeAdapter, TypeInference } from '@type-adapters/adapter'
import * as SC from 'scale-codec'

export interface Inference extends TypeInference {
  output: this['input'] extends SC.Codec<any, infer R> ? R : unknown
}
export class Adapter extends TypeAdapter<Inference> {
  validate(schema: SC.Codec<any, any>, value: unknown): boolean {
    throw Error('not implemented')
  }
}