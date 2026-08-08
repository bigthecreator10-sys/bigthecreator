// Vercel serves the public files and /api functions directly.
// This file exists for local tooling compatibility.
const http=require("http");http.createServer((req,res)=>{res.writeHead(200,{"Content-Type":"text/plain"});res.end("BIG THE CReator");}).listen(process.env.PORT||3000);