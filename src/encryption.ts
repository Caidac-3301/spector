import { randomBytes, createCipheriv, createHash, createDecipheriv } from 'crypto';

const ALGORITHM = 'aes-256-ctr';
const IV_LENGTH = 16;

export const encrypt = (text: string, password: string) => {
  const hash = createHash('sha1');
  const iv = randomBytes(IV_LENGTH);
  const key = hash.update(password).digest('hex').toString().slice(0, 32);
  const cipher = createCipheriv(ALGORITHM, key, iv)
  const crypted = cipher.update(text, 'utf8', 'hex')

  return iv.toString('hex') + ':' + crypted.toString();
}

export const decrypt = (text: string, password: string) => {
  const hash = createHash('sha1');
  const key = hash.update(password).digest('hex').toString().slice(0, 32);
  const [iv_str, encrypted] = text.split(':');
  const iv = Buffer.from(iv_str, 'hex');
  const decipher = createDecipheriv(ALGORITHM, key, iv)
  const dec = decipher.update(encrypted, 'hex', 'utf8');

  return dec;
}
