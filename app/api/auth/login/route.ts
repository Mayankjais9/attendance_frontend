export async function POST(req: Request) {
  try {
    const body = await req.text();

    const res = await fetch("http://65.2.3.19:8081/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
      cache: "no-store",
    });

    const data = await res.text();

    return new Response(data, {
      status: res.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error("PROXY LOGIN ERROR:", err);

    return new Response(
      JSON.stringify({ error: "Backend not reachable" }),
      { status: 500 }
    );
  }
}