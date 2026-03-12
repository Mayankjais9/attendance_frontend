export async function POST(req: Request) {
    const body = await req.json()

    const res = await fetch("http://3.110.204.3:8081/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    })

    const data = await res.json()

    return Response.json(data, { status: res.status })
}