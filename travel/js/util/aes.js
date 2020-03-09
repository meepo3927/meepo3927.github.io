import CryptoJS from 'lib/crypto.js';
const options = {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
};
const e = (content, key) => {
    key = CryptoJS.enc.Utf8.parse(key);
    const o = CryptoJS.AES.encrypt(content, key, options);
    const encryptedData = o.toString();
    return encryptedData;
};
const p = (passwd, key) => {
    const content = Math.random() + '|||' + passwd + '|||' + (new Date()).getTime();
    return e(content, key);
};
const d = (str, key) => {
    key = CryptoJS.enc.Utf8.parse(key);
    const decrypted = CryptoJS.AES.decrypt(str, key, options);
    return CryptoJS.enc.Utf8.stringify(decrypted);
};
const test = () => {
};
export default {
    e,
    p,
    d,
    test
}