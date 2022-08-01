import { SecretsManager } from 'aws-sdk'
import * as dotenv from 'dotenv'

dotenv.config()

const sm = new SecretsManager({
  region: process.env.AWS_REGION,
})

const getSecret = async (secretName: string): Promise<string> => {
  const { SecretString } = await sm
    .getSecretValue({
      SecretId: process.env.SECRET_ID,
    })
    .promise()
  const secrets = JSON.parse(SecretString)
  return secrets[secretName]
}

export const configuration = async (): Promise<{ [key: string]: string }> => ({
  mongoUri: await getSecret('MONGO_URI'),
  omnicellUrl: await getSecret('OMNICELL_URL'),
  omnicellAuthToken: await getSecret('OMNICELL_AUTH_TOKEN'),
  jwtSecret: await getSecret('JWT_SECRET'),
  sdkSecret: await getSecret('SDK_SECRET'),
  appleClientId: await getSecret('APPLE_CLIENT_ID'),
  appleTestPhone: await getSecret('APPLE_TEST_PHONE'),
  appleTestCode: await getSecret('APPLE_TEST_CODE'),
})
