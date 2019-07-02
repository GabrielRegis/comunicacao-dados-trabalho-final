
function encrypt(str, key) {
  if (str === null) {
    return null;
  }

  let encryptedStr = str.split("").map((char, index) => {
    return String.fromCharCode(char.charCodeAt() ^ key.charCodeAt(index % key.length));
  }).join("");

  return encryptedStr;
}

function decrypt(encryptedStr, key) {
  return this.encrypt(encryptedStr, key);
}

export { encrypt, decrypt }