export default function NotFound() {
  return (
    <main className="bg-accent relative isolate flex min-h-dvh flex-col">
      {/* Grid Background */}
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
      <div className="max-w-container mx-auto flex min-h-dvh flex-col items-center justify-center p-4">
        <svg
          className="size-20"
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
        >
          <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q54 0 104-17.5t92-50.5L228-676q-33 42-50.5 92T160-480q0 134 93 227t227 93Zm252-124q33-42 50.5-92T800-480q0-134-93-227t-227-93q-54 0-104 17.5T284-732l448 448ZM480-480Z" />
        </svg>
        <h1 className="my-4 text-center text-xl font-bold">404 - Page Not Found</h1>
        <p className="text-muted-foreground text-center text-lg">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>
      </div>
    </main>
  );
}
