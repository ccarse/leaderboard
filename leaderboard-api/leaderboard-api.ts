const cached: { [year: number]: { ts: number, data: string } } = {};
const cacheMinutes = 7;

const cookie = ''
const headers = new Headers();
headers.set('Cookie', `session=${cookie}`);

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
    const year = getYear(requestEvent);
    console.log(`Request received for year: ${year}`);

    if (year < 2015 || year > new Date().getFullYear()) {
      requestEvent.respondWith(new Response('Invalid year', { status: 400, headers }));
      continue;
    }

    const json = await getData(year);

    requestEvent.respondWith(
      new Response(json, {
        status: 200,
        headers
      }),
    );
  }
}

async function getData(year: number) {
  let data;
  let cache = cached[year];
  const cacheTimeout = cacheMinutes * 60 * 1000;
  if (!cache || cache["ts"] < (Date.now() - cacheTimeout)) {
    console.log(`Cache miss.`);
    data = await (await fetch(`https://adventofcode.com/${year}/leaderboard/private/view/759284.json`, { headers })).text();
    cache = { ts: Date.now(), data: data };
    cached[year] = cache;
  } else {
    data = cache["data"];
  }
  return data;
}

function getYear(req: Deno.RequestEvent) {
  const url = req.request.url
  const lastIndex = url.lastIndexOf('/');
  const year = parseInt(url.slice(lastIndex + 1));

  if (isNaN(year)) {
    return new Date().getFullYear();
  }

  return year;
}