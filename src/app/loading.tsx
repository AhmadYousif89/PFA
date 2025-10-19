import Logo from "public/assets/images/logo.svg";

export default function Loading() {
  return (
    <div className="bg-accent relative isolate flex h-full items-center justify-center">
      <Logo className="size-28 animate-pulse" />
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,#277C7815_1px,transparent_1px),linear-gradient(to_bottom,#277C7815_1px,transparent_1px)] bg-[size:30px_30px]"
          style={{
            maskImage: "radial-gradient(ellipse 100% 50% at 50% 0%, #000 80%, transparent 200%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 100% 50% at 50% 0%, #000 80%, transparent 200%)",
          }}
        />
      </div>
      <div className="text-muted-foreground flex flex-col items-center gap-10 text-lg font-medium"></div>
    </div>
  );
}
