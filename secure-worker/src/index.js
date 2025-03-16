/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
export default {
	async fetch(request, env) {
	  const url = new URL(request.url);
  
	  // Handle /secure path
	  if (url.pathname === "/secure") {
		// Extract user information from Cloudflare Access
		const email = request.headers.get("cf-access-authenticated-user-email");
		const timestamp = new Date().toISOString();
		const country = request.cf.country;
  
		// Generate HTML response
		const htmlResponse = `
		  <!DOCTYPE html>
		  <html>
			<head>
			  <title>Secure Page</title>
			</head>
			<body>
			  <h1>${email} authenticated at ${timestamp} from <a href="/secure/${country}">${country}</a></h1>
			</body>
		  </html>
		`;
  
		return new Response(htmlResponse, {
		  headers: { "Content-Type": "text/html" },
		});
	  }
  
	  // Handle /secure/${COUNTRY} path
	  if (url.pathname.startsWith("/secure/")) {
		const country = url.pathname.split("/")[2];
  
		// Fetch the flag from R2 bucket
		const flagObject = await env.FLAGS_BUCKET.get(`${country}.png`);
		if (!flagObject) {
		  return new Response("Flag not found", { status: 404 });
		}
  
		// Return the flag image with appropriate content type
		return new Response(flagObject.body, {
		  headers: { "Content-Type": "image/png" },
		});
	  }
  
	  // Default response for unknown paths
	  return new Response("Not Found", { status: 404 });
	},
  };
