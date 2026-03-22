export async function GET(req: Request) {
  const token = req.headers.get("authorization");

  const res = await fetch("http://3.110.204.3:8081/auth/me", {
    method: "GET",
    headers: {
      Authorization: token || "",
    },
  });

  const data = await res.text();

  return new Response(data, {
    status: res.status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}