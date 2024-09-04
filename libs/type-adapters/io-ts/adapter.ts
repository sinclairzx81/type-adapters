import { TypeAdapter, TypeInference } from '@type-adapters/adapter'
import * as IO from 'io-ts'

export interface Inference extends TypeInference {
  output: this['input'] extends IO.Any ? IO.TypeOf<this['input']> : unknown
}
export class Adapter extends TypeAdapter<Inference> {
  validate(schema: IO.Any, value: unknown): boolean {
    throw Error('not implemented')
  }
}