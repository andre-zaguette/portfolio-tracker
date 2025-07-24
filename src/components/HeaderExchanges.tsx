type Props = {
  className?: string;
};

export default function HeaderExchanges({ className = "" }: Props) {
  return (
    <div className={`mb-4 p-4 border rounded-xl text-center ${className}`}>
      <div>kucoin</div>
      <div>Bybit</div>
    </div>
  );
}
