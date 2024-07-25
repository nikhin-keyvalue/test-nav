import { MdCheck, MdClose, MdErrorOutline } from 'react-icons/md';
import { Bounce, toast, ToastOptions } from 'react-toastify';

const POSITION = 'bottom-center';
const AUTO_CLOSE_DELAY = 3000;
const style = {
  background: '#DA212C',
  color: '#FFF',
  display: 'flex',
};
const successStyle = {
  background: '#323C49',
  color: '#FFF',
};

const toastProps: ToastOptions = {
  hideProgressBar: true,
  closeButton: <MdClose className='!mt-0 h-6 w-6' />,
  pauseOnHover: true,
  transition: Bounce,
  className:
    '!min-h-[48px] !mt-4 !mb-4 lg:!mb-0 mx-2 !rounded !p-[12px] lg:w-[280px]',
  bodyClassName:
    'justify-center rounded-4px !p-0 !m-0 break-all !items-start text-sm max-w-[235px]',
};

export const defaultAutoCloseTime = 5000;

export const showErrorToast = (message: string, config?: ToastOptions) =>
  toast.error(message, {
    ...toastProps,
    autoClose: toastProps.autoClose ?? AUTO_CLOSE_DELAY,
    position: POSITION,
    style,
    icon: <MdErrorOutline className='!mt-0 h-6 w-6' />,
    ...(config || {}),
  });

export const showSuccessToast = (message: JSX.Element | string, config?: ToastOptions) =>
  toast.success(message, {
    ...toastProps,
    position: POSITION,
    autoClose: toastProps.autoClose ?? AUTO_CLOSE_DELAY,
    style: successStyle,
    icon: <MdCheck className='!mt-0 h-6 w-6' />,
    ...(config || {}),
  });
