declare module "@/halftone/react/index.js" {
  import type { ReactNode } from "react";

  type HalftoneComponentProps = {
    children?: ReactNode;
    className?: string;
    style?: React.CSSProperties;
    color?: string;
    [key: string]: unknown;
  };

  export function HalftoneProvider(props: HalftoneComponentProps): JSX.Element;
  export function Surface(props: HalftoneComponentProps & { pressRef?: { current: { pressIn?: () => void; pressOut?: () => void } | null } }): JSX.Element;
  export function Button(props: HalftoneComponentProps): JSX.Element;
  export function Meter(props: HalftoneComponentProps): JSX.Element;
  export function Card(props: HalftoneComponentProps): JSX.Element;
  export function BarChart(props: HalftoneComponentProps): JSX.Element;
  export function LineChart(props: HalftoneComponentProps): JSX.Element;
  export function Text(props: HalftoneComponentProps & { text: string; animate?: boolean }): JSX.Element;
}
