
// Descomentar as linhas para desabilitar a criptografia
function encrypt(str, key) {
	// return str;
  if (str === null) {
    return null;
  }

  let encryptedStr = str.split("").map((char, index) => {
    return String.fromCharCode(char.charCodeAt() ^ key.charCodeAt(index % key.length));
  }).join("");

  return encryptedStr;
}

function decrypt(encryptedStr, key) {
	// return encryptedStr;
  return encrypt(encryptedStr, key);
}

export { encrypt, decrypt }