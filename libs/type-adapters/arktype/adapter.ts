import { TypeAdapter, TypeInference } from '@type-adapters/adapter'
import * as Ark from 'arktype'

export interface Inference extends TypeInference {
  output: 'infer' extends keyof this['input'] ? this['input']['infer'] : unknown
}
export class Adapter extends TypeAdapter<Inference> {
  validate(schema: Ark.Type, value: unknown): boolean {
    throw Error('not implemented')
  }
}