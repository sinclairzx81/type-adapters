import { TypeAdapter, TypeInference } from '@type-adapters/adapter'
import * as YRel from 'yrel'

export interface Inference extends TypeInference {
  output: this['input'] extends YRel.YrelSchema<any> ? YRel.InferYrel<this['input']> : unknown
}
export class Adapter extends TypeAdapter<Inference> {
  validate(schema: YRel.YrelSchema<any>, value: unknown): boolean {
    throw Error('not implemented')
  }
}