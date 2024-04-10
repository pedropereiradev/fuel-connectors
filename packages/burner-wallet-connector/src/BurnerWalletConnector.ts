import {
  type AbiMap,
  type Asset,
  type ConnectorMetadata,
  FuelConnector,
  FuelConnectorEventTypes,
  type JsonAbi,
  type Network,
  Provider,
  type TransactionRequestLike,
  type Version,
  Wallet,
  type WalletUnlocked,
} from 'fuels';
import { BETA_5_URL, BURNER_WALLET_ICON } from './constants';
import type { BurnerWalletConfig } from './types';

export class BurnerWalletConnector extends FuelConnector {
  name = 'Burner Wallet';

  connected = false;
  installed = false;

  events = FuelConnectorEventTypes;

  metadata: ConnectorMetadata = {
    image: BURNER_WALLET_ICON,
    install: {
      action: 'install',
      description: 'Install Burner Wallet to connect to Fuel',
      link: '',
    },
  };

  burnerWallet: WalletUnlocked | null = null;
  burnerWalletProvider: Provider | null = null;
  burnerWalletPrivateKey: string | null = null;

  private config: BurnerWalletConfig = {};

  constructor(config: BurnerWalletConfig = {}) {
    super();

    this.configFuelProvider(config);
    this.setupBurnerWallet(config);
  }

  async configFuelProvider(config: BurnerWalletConfig = {}) {
    this.config = Object.assign(config, {
      fuelProvider: config.fuelProvider || Provider.create(BETA_5_URL),
    });
  }

  async setupBurnerWallet(config: BurnerWalletConfig = {}) {
    if (config.privateKey) {
      sessionStorage.setItem('burner-wallet-private-key', config.privateKey);
    }

    const privateKey = sessionStorage.getItem('burner-wallet-private-key');

    if (!privateKey) {
      this.burnerWallet = Wallet.generate({
        provider: await this.config.fuelProvider,
      });

      this.burnerWalletProvider = this.burnerWallet.provider;
      this.burnerWalletPrivateKey = this.burnerWallet.privateKey;

      sessionStorage.setItem(
        'burner-wallet-private-key',
        this.burnerWalletPrivateKey,
      );

      return this.burnerWallet;
    }

    this.burnerWallet = Wallet.fromPrivateKey(
      privateKey,
      await this.config.fuelProvider,
    );

    this.burnerWalletProvider = this.burnerWallet.provider;
    this.burnerWalletPrivateKey = this.burnerWallet.privateKey;

    return this.burnerWallet;
  }

  /**
   * ============================================================
   * Connector methods
   * ============================================================
   */
  async ping(): Promise<boolean> {
    await this.configFuelProvider();
    await this.setupBurnerWallet();

    return true;
  }

  async version(): Promise<Version> {
    return { app: '0.0.0', network: '0.0.0' };
  }

  async isConnected(): Promise<boolean> {
    return this.burnerWallet?.address.toString() !== '';
  }

  async connect(): Promise<boolean> {
    if (!(await this.isConnected())) {
      if (!this.burnerWalletProvider) {
        throw Error('Burner Wallet Provider not found');
      }

      this.burnerWalletProvider = this.burnerWallet?.connect(
        this.burnerWalletProvider,
      ) as Provider;
    }

    this.emit(this.events.connection, true);
    this.emit(
      this.events.currentAccount,
      this.burnerWallet?.address.toAddress(),
    );
    this.emit(this.events.accounts, [this.burnerWallet?.address.toAddress()]);

    return this.connected;
  }

  async accounts(): Promise<string[]> {
    const account = this.burnerWallet?.address.toAddress();

    return [account as `fuel${string}`];
  }

  async disconnect(): Promise<boolean> {
    if (await this.isConnected()) {
      this.burnerWallet?.lock();
    }

    this.emit(this.events.connection, false);
    this.emit(this.events.currentAccount, null);
    this.emit(this.events.accounts, []);

    return this.connected;
  }

  async signMessage(_address: string, _message: string): Promise<string> {
    const signMessage = await this.burnerWallet?.signMessage(_message);

    return signMessage as string;
  }

  async sendTransaction(
    _address: string,
    transaction: TransactionRequestLike,
  ): Promise<string> {
    const transactionRequest = await this.burnerWallet?.sendTransaction(
      transaction,
      { awaitExecution: true },
    );

    if (!transactionRequest) {
      throw Error('Transaction request not found');
    }

    return transactionRequest?.id;
  }

  async currentAccount(): Promise<string | null> {
    return this.burnerWallet?.address.toString() || null;
  }

  async addAssets(_assets: Asset[]): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  async addAsset(_asset: Asset): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  async assets(): Promise<Array<Asset>> {
    return [];
  }

  async addNetwork(_networkUrl: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  async selectNetwork(_network: Network): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  async networks(): Promise<Network[]> {
    return [await this.currentNetwork()];
  }

  async currentNetwork(): Promise<Network> {
    if (!this.burnerWalletProvider) {
      throw Error('Burner Wallet Provider not found');
    }

    const { chainId } = await this.burnerWalletProvider.getNetwork();

    return {
      chainId: Number(chainId),
      url: this.burnerWalletProvider.url,
    };
  }

  async addAbi(_abiMap: AbiMap): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  async getAbi(_contractId: string): Promise<JsonAbi> {
    throw Error('Cannot get contractId ABI for a predicate');
  }

  async hasAbi(_contractId: string): Promise<boolean> {
    throw Error('A predicate account cannot have an ABI');
  }
}
