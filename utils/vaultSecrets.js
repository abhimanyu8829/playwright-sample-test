import fs from 'node:fs';

const defaultVaultSecretsPath = 'playwright/.vault/admin-vault.json';

export function getVaultPrivateKey() {
  if (process.env.NITROBERRY_VAULT_PRIVATE_KEY) {
    return process.env.NITROBERRY_VAULT_PRIVATE_KEY;
  }

  const secretsPath = process.env.NITROBERRY_VAULT_SECRETS_PATH || defaultVaultSecretsPath;

  if (!fs.existsSync(secretsPath)) {
    throw new Error(
      `Vault private key not found. Create ${secretsPath} or set NITROBERRY_VAULT_PRIVATE_KEY.`
    );
  }

  const secrets = JSON.parse(fs.readFileSync(secretsPath, 'utf8'));

  if (!secrets.privateKey) {
    throw new Error(`Vault private key missing in ${secretsPath}.`);
  }

  return secrets.privateKey;
}
