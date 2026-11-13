import { Component, type ReactNode } from "react";

/** Catches WebGL/render failures in the carousel and shows a fallback. */
export class WebGLErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export function WebGLFallback({
  className,
  message,
}: {
  className?: string;
  message: string;
}) {
  return (
    <div
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        display: "grid",
        placeItems: "center",
        padding: 24,
        textAlign: "center",
        color: "#6e6e73",
        fontSize: 14,
        lineHeight: 1.6,
      }}
    >
      {message}
    </div>
  );
}
