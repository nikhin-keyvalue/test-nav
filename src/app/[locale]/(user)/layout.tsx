import 'react-toastify/dist/ReactToastify.css';

import NavBar from '@/components/navigation/desktop/navbar';
import MenuBar from '@/components/navigation/MenuBar';
import DynamicFilterCriteria from '@/components/search-criteria/DynamicSearchCriteria.server';
import { currentUser } from '@/hooks/server/currentUser';

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  // TODO: Revisit;
  return (
    <div className='m-0 h-full  min-h-screen bg-[#F7F7F8] md:ml-20'>
      {user && (
        <>
          <MenuBar
            dynamicFilterSubMenu={<DynamicFilterCriteria />}
            user={user}
          />
          <NavBar
            dynamicFilterSubMenu={<DynamicFilterCriteria />}
            user={user}
          />
        </>
      )}
      <main className='relative overflow-x-hidden px-6 py-5'>{children}</main>
    </div>
  );
}
