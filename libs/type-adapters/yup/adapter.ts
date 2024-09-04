import { TypeAdapter, TypeInference } from '@type-adapters/adapter'
import * as YP from 'yup'

export interface Inference extends TypeInference {
  output: this['input'] extends YP.AnySchema ? YP.InferType<this['input']> : unknown
}

export class Adapter extends TypeAdapter<Inference> {
  validate(schema: YP.AnySchema, value: unknown): boolean {
    throw Error('not implemented')
  }
}