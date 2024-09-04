import { TypeAdapter, TypeInference } from '@type-adapters/adapter'

export interface Inference extends TypeInference {
  output: unknown // this['input']
}
export class Adapter extends TypeAdapter<Inference> {
  validate(schema: unknown, value: unknown): boolean {
    return true
  }
}