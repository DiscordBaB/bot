import Ajv, { JSONSchemaType } from 'ajv'
import * as fs from 'fs'

const ajv = new Ajv()

export async function validatePermsJson(
  input: string,
  schema: JSONSchemaType<unknown>
): Promise<{ valid: boolean; errors?: string[] }> {
  try {
    let data: unknown

    // Check if input is a file path
    if (fs.existsSync(input)) {
      const fileContent = fs.readFileSync(input, 'utf-8')
      data = JSON.parse(fileContent)
    } else {
      // Treat as JSON string
      data = JSON.parse(input)
    }

    const validate = ajv.compile(schema)
    const isValid = validate(data)

    if (!isValid) {
      return {
        valid: false,
        errors: validate.errors?.map((err) => `${err.instancePath} ${err.message}`) ?? [],
      }
    }

    return { valid: true }
  } catch (error) {
    return {
      valid: false,
      errors: [error instanceof Error ? error.message : 'Unknown error'],
    }
  }
}