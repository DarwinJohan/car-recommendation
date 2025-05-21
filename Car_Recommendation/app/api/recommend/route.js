// app/api/recommend/route.js
import { exec } from 'child_process';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const body = await req.json();
  const user_input = body.user_input;

  if (!user_input) {
    return NextResponse.json({ error: 'Missing input' }, { status: 400 });
  }

  const scriptPath = path.resolve('recommender/car_recommender.py');
  const command = `python ${scriptPath} "${user_input.replace(/"/g, '\\"')}"`;

  return new Promise((resolve) => {
    console.log('Running script at:', scriptPath);
    console.log('Full command:', command);

    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.error(stderr);
        return resolve(NextResponse.json({ error: 'Python execution failed' }, { status: 500 }));
      }

      try {
        const parsed = JSON.parse(stdout);
        return resolve(NextResponse.json(parsed));
      } catch (e) {
        return resolve(NextResponse.json({ error: 'Failed to parse output' }, { status: 500 }));
      }
    });
  });
}
