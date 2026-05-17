import { CSSProperties } from "react";

interface BlurredOrbProps {
  className?: string;
  style?: CSSProperties;
}

const BlurredOrb = ({ className = "", style }: BlurredOrbProps) => {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none rounded-full ${className}`}
      style={style}
    />
  );
};

export default BlurredOrb;
