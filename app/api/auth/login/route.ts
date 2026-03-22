export async function POST(req: Request) {
  try {
    const body = await req.text();

    const res = await fetch("http://3.110.204.3:8081/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    const data = await res.text();

    return new Response(data, {
      status: res.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error("PROXY ERROR:", err);

    return new Response(
      JSON.stringify({ error: "Backend not reachable" }),
      { status: 500 }
    );
  }
}