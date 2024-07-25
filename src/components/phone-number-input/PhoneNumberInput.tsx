import 'react-phone-number-input/style.css';
import './styles.css';

import { FocusEvent, KeyboardEvent, useEffect, useRef } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import PhoneInput from 'react-phone-number-input';

const PhoneNumberInput = <T extends FieldValues>({
  name,
  control,
  handleBlur,
  isDisabled = false,
  placeHolder = 'Add phone number',
  testId = 'phone-number-input',
  ...rest
}: {
  name: Path<T>;
  control: Control<T>;
  placeHolder?: string;
  isDisabled?: boolean;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
  handleBlur: (event: FocusEvent<HTMLDivElement, Element>) => void;
  testId?: string;
}) => {
  const countrySelectorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (countrySelectorRef.current) {
      const countryFlagSelectorElement =
        countrySelectorRef.current?.querySelector(
          '.PhoneInputCountry'
        ) as HTMLElement | null;
      if (countryFlagSelectorElement) {
        if (isDisabled) {
          countryFlagSelectorElement.style.backgroundColor = '#f5f5f5';
        } else {
          countryFlagSelectorElement.style.background = '#ffffff';
        }
      }
    }
  }, [isDisabled]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div className='flex flex-col'>
          {/* handleBlur given here and not directly to Phone input due to the following reason.
          There are 2 elements within phone input. Country selector and tel input. The onblur is
          being applied only for tel input directly. If a user enters an input and then goes to
          pick the country, onblur gets triggered. Hence to prevent this onblur is handled this way.        
        */}
          <div onBlur={handleBlur} ref={countrySelectorRef}>
            <PhoneInput
              {...rest}
              name={name}
              value={value}
              onChange={onChange}
              defaultCountry='NL'
              disabled={isDisabled}
              placeholder={placeHolder}
              data-testid={testId}
            />
            {error ? (
              <hr className='-mt-0.5 ml-[11%] h-1 w-[89%] rounded-md bg-primary' />
            ) : (
              <> </>
            )}
          </div>
          {error ? (
            <p
              className='ml-[11%] mt-2 text-xs font-[500] text-primary'
              data-testid={`${testId}-helper-text`}
            >
              {error?.message}
            </p>
          ) : (
            <> </>
          )}
        </div>
      )}
    />
  );
};

export default PhoneNumberInput;
