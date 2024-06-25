import type { SvgIconProps } from '../../types';

export function FuelWalletIcon({ size, ...props }: SvgIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 491 496"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Fuel Wallet icon</title>
      <rect
        x="42.5535"
        y="28.3438"
        width="397.154"
        height="425.143"
        fill="#080808"
      />
      <path
        d="M32.6178 0C14.5697 0 0 14.7327 0 32.9826V496H405.852C419.568 496 432.759 490.492 442.473 480.67L475.353 447.422C485.066 437.6 490.513 424.261 490.513 410.391V0H32.6178ZM320.271 63.7752L160.726 225.105C156.788 229.086 151.407 231.343 145.828 231.343C137.69 231.343 130.208 226.565 126.73 219.132L64.9074 87.0024C59.8539 76.1852 67.6638 63.7752 79.4771 63.7752H320.271ZM63.0697 432.225V275.275C63.0697 266.914 69.7639 260.145 78.0332 260.145H233.246L63.0697 432.225ZM246.11 231.343H194.722L349.345 74.9906C356.433 67.8234 366.08 63.7752 376.121 63.7752H427.509L272.887 220.127C265.799 227.295 256.151 231.343 246.11 231.343Z"
        fill="#00F58C"
      />
    </svg>
  );
}
