'use client';

const ChangeLogItem: React.FC<{ id: string }> = () => (
  <div className='inline-flex h-[38px] w-[592px] flex-col items-start justify-start'>
    <div className='inline-flex items-start justify-start gap-1 self-stretch'>
      <div className='shrink grow basis-0 font-roboto text-xs font-normal leading-none text-grey-56'>
        10 Jul 2023 12:34 - Sander de Vries
      </div>
    </div>
    <div className='self-stretch font-roboto text-[15px] font-normal leading-[21px] text-gray-700'>
      Reiciendis voluptatibus maiores alias consequatur aut perferendis
      doloribus
    </div>
  </div>
);

export default ChangeLogItem;
