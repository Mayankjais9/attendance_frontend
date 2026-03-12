export default function Forbidden() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">403 — Not authorized</h1>
        <p className="text-muted-foreground mt-2">
          You don’t have access to this page.
        </p>
      </div>
    </div>
  );
}
