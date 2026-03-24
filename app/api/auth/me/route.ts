export async function GET(req: Request) {
  try {
    const token = req.headers.get("authorization");

    const res = await fetch("http://65.2.3.19:8081/auth/me", {
      method: "GET",
      headers: {
        Authorization: token || "",
      },
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
    console.error("AUTH ME ERROR:", err);

    return new Response(
      JSON.stringify({ error: "Backend not reachable" }),
      { status: 500 }
    );
  }
}