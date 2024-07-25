import { PersonDetail } from '@/types/common';
import { mergeStrings } from '@/utils/common';

const RenderPersonOption = (
  props: React.HTMLAttributes<HTMLLIElement>,
  option: PersonDetail
) => {
  const { firstName, lastName, middleName, email, id, displayValue } = option;

  return (
    <li {...props} key={id}>
      <div>
        <div>
          {displayValue ??
            mergeStrings({ values: [firstName, middleName, lastName] })}
        </div>
        <div className='text-xs text-grey-56'>{email}</div>
      </div>
    </li>
  );
};

export default RenderPersonOption;
