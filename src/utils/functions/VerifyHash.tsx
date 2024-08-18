import crypto from "crypto";

export function checkHashValidity(initData: any) {
  const encoded = decodeURIComponent(initData);
  // if mode is in test mode, use the testing bot token else use the production bot token
  // console.log(process.env.NEXT_PUBLIC_BOT_TOKEN); lol
  // console.log(initData);
  const secret = crypto
    .createHmac("sha256", "WebAppData")
    .update(process.env.NEXT_PUBLIC_BOT_TOKEN!);
  const arr = encoded.split("&");
  const hashIndex = arr.findIndex((str) => str.startsWith("hash="));
  const hash = arr.splice(hashIndex)[0].split("=")[1];
  // sorted alphabetically
  arr.sort((a, b) => a.localeCompare(b));
  // in the format key=<value> with a line feed character ('\n', 0x0A) used as separator
  // e.g., 'auth_date=<auth_date>\nquery_id=<query_id>\nuser=<user>
  const dataCheckString = arr.join("\n");

  // The hexadecimal representation of the HMAC-SHA-256 signature of the data-check-string with the secret key
  const _hash = crypto
    .createHmac("sha256", secret.digest())
    .update(dataCheckString)
    .digest("hex");
  // console.log(hash, _hash);
  // if hash are equal the data may be used on your server.
  // Complex data types are represented as JSON-serialized objects.
  // console.log('hash', _hash === hash)
  return _hash === hash;
}
