import { TypeAdapter, TypeInference } from '@type-adapters/adapter'
import * as JST from 'json-schema-to-ts'
import Ajv2020 from 'ajv/dist/2020'
import Ajv2019 from 'ajv/dist/2019'
import Ajv from 'ajv'

export interface Inference extends TypeInference {
  output: this['input'] extends JST.JSONSchema ? JST.FromSchema<this['input']> : unknown
}

export class Adapter extends TypeAdapter<Inference> {
  readonly validator: Ajv
  constructor(spec: 'draft-7' | '2020-12' | '2019-09' = 'draft-7') {
    super()
    this.validator = (
      spec === '2020-12' ? new Ajv2020() : 
      spec === '2019-09' ? new Ajv2019() : 
      new Ajv()
    )
  }
  validate(schema: JST.JSONSchema, value: unknown): boolean {
    return this.validator.validate(schema, value)
  }
}