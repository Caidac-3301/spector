import * as crypto from 'crypto';

// To be later implemented with Master Password
const ENCRYPTION_KEY = 'XXhardXcodedXvalueXforXdemoXhere';
const IV_LENGTH = 16; // For AES, this is always 16

export const encrypt = (text: string) => {
  let iv = crypto.randomBytes(IV_LENGTH);
  let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);

  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export const decrypt = (text: string) => {
  let textParts = text.split(':');
  let iv = Buffer.from(textParts.shift() as string, 'hex');
  let encryptedText = Buffer.from(textParts.join(':'), 'hex');
  let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText);

  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}
