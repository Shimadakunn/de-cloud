import * as bip39 from 'bip39';
import { hdkey } from 'ethereumjs-wallet';
import * as ethUtil from 'ethereumjs-util';

export default async function generateEthereumWallet() {
    // Generate a random mnemonic (uses BIP39)
    const mnemonic = bip39.generateMnemonic();

    // Convert mnemonic to seed
    const seed = await bip39.mnemonicToSeed(mnemonic);

    // Generate HD Wallet from seed
    const hdWallet = hdkey.fromMasterSeed(seed);

    // Derive the first account using the standard Ethereum derivation path
    // m/44'/60'/0'/0/0 is the derivation path for the first Ethereum account
    const walletHdpath = "m/44'/60'/0'/0/0";
    const wallet = hdWallet.derivePath(walletHdpath).getWallet();

    // Get Private Key and Public Key
    const privateKey = wallet.getPrivateKeyString();
    const publicKey = ethUtil.bufferToHex(wallet.getPublicKey());

    return {
        mnemonic,
        privateKey,
        publicKey
    };
}