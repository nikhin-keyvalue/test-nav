import packageJson from '../../../package.json';

const responseObject = {
  applicationVersion: packageJson.version,
  nextjsVersion: packageJson.dependencies.next,
};

export async function GET() {
  return new Response(JSON.stringify(responseObject), { status: 200 });
}
