import { TypeAdapter, TypeInference } from '@type-adapters/adapter'
import * as SS from 'superstruct'

export interface Inference extends TypeInference {
  output: this['input'] extends SS.Struct<infer L, any> ? L : unknown
}

export class Adapter extends TypeAdapter<Inference> {
  validate(schema: SS.Struct<any, any>, value: unknown): boolean {
    throw Error('not implemented')
  }
}