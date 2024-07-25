const successResponse = {
  status: 'OK',
};

export async function GET() {
  return new Response(JSON.stringify(successResponse), { status: 200 });
}
