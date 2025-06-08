import { exec } from "child_process";
import path from "path";
import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();
  const filters = body.filters;

  const scriptPath = path.resolve("recommender/car_filter.py");
  const args = JSON.stringify(filters).replace(/"/g, '\\"');
  const command = `python ${scriptPath} "${args}"`;

  return new Promise((resolve) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.error("Python error:", stderr);
        return resolve(NextResponse.json({ error: "Python failed" }, { status: 500 }));
      }
      try {
        const parsed = JSON.parse(stdout);
        resolve(NextResponse.json(parsed));
      } catch (e) {
        resolve(NextResponse.json({ error: "Invalid JSON from Python" }, { status: 500 }));
      }
    });
  });
}
