import { spawn } from 'child_process';
import process from 'process';

const port = process.env.PORT || 8080;
const args = ['dist', '-p', port, '--spa', '-o'];

console.log(`Starting http-server on port ${port}`);
const server = spawn('npx', ['http-server', ...args], { 
  stdio: 'inherit',
  shell: true 
});

server.on('error', (error) => {
  console.error('Error starting server:', error);
  process.exit(1);
});

server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
  process.exit(code);
});
