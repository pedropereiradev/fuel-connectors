import { useState } from 'react';
import { Address, BaseAssetId } from 'fuels';
import { DEFAULT_AMOUNT } from './balance';
import Feature from './feature';
import Button from './button';
import Notification, { Props as NotificationProps } from './notification';
import { useWallet } from '../hooks/useWallet';

const DEFAULT_ADDRESS = Address.fromRandom().toString();

export default function Transfer() {
  const { balance, wallet, refetchWallet } = useWallet();

  const [receiver, setReceiver] = useState(DEFAULT_ADDRESS);
  const [isLoading, setLoading] = useState(false);
  const [toast, setToast] = useState<Omit<NotificationProps, 'setOpen'>>({
    open: false
  });

  const hasBalance = balance && balance.gte(DEFAULT_AMOUNT);

  const handleTransfer = async () => {
    setLoading(true);
    try {
      const receiverAddress = Address.fromString(receiver || DEFAULT_ADDRESS);

      const resp = await wallet?.transfer(
        receiverAddress,
        DEFAULT_AMOUNT,
        BaseAssetId,
        {
          gasPrice: 1,
          gasLimit: 10_000
        }
      );

      await resp?.waitForResult();

      setToast({
        open: true,
        type: 'success',
        children: (
          <p>
            Transfer successful! View it on the{' '}
            <a href="#link-to-block-explorer" className="underline">
              block explorer
            </a>
          </p>
        )
      });
    } catch (err: any) {
      console.error(err.message);
      setToast({
        open: true,
        type: 'error',
        children: `The transfer could not be processed: ${err.message.substring(0, 32)}...`
      });
    } finally {
      setLoading(false);
      refetchWallet();
    }
  };

  return (
    <Feature title="Transfer">
      <input
        type="text"
        placeholder="Receiver address"
        value={receiver}
        onChange={(e) => setReceiver(e.target.value)}
        className="-ml-1 mr-2 mt-1 w-2/3 shrink basis-2/3 rounded-lg border border-zinc-500/25 p-1 font-mono outline-none md:-ml-2 md:mt-2 md:p-2 dark:bg-transparent"
      />

      <Button
        onClick={handleTransfer}
        disabled={isLoading || !hasBalance}
        className="mt-1 shrink-0 md:mt-2"
        loading={isLoading}
        loadingText="Transferring..."
      >
        {`Transfer ${DEFAULT_AMOUNT.format()} ETH`}
      </Button>
      <Notification
        setOpen={() => setToast({ ...toast, open: false })}
        {...toast}
      />
    </Feature>
  );
}