let data: string|null = null;
let lastRequest: number|null = null;

const cookie = ''
const headers = new Headers();
headers.set('Cookie', cookie);

const server = Deno.listen({ port: 1337 });
console.log(`HTTP webserver running.  Access it at:  http://localhost:1337/`);

for await (const conn of server) {
  // In order to not be blocking, we need to handle each connection individually without awaiting the function
  serveHttp(conn);
}

async function serveHttp(conn: Deno.Conn) {
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');

  const httpConn = Deno.serveHttp(conn);
  for await (const requestEvent of httpConn) {
    const json = await getData();
    
    requestEvent.respondWith(
      new Response(json, {
        status: 200,
        headers
      }),
    );
  }
}

async function getData() {
  const fifteenMinutes = 15 * 60 * 1000;
  if (!lastRequest || lastRequest < (Date.now() - fifteenMinutes)) {
    console.log(`Cache miss.`);
    data = await (await fetch('https://adventofcode.com/2021/leaderboard/private/view/759284.json', { headers })).text();
    lastRequest = Date.now();
  }
  return data;
}