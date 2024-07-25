import LoginForm from './_components/LoginForm';

const Page = async ({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) => (
  <>
    <h1 className='text-1.5xl font-kanit font-bold'>Sign in</h1>
    <LoginForm redirect={searchParams.redirectUrl} />
  </>
);
export default Page;
