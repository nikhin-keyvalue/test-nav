import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import './styles.css';

import dynamic from 'next/dynamic';
import { ForwardedRef, forwardRef } from 'react';
import ReactQuill, { Quill, ReactQuillProps } from 'react-quill';

import SpinnerScreen from '../SpinnerScreen';

// Note: By default, ReactQuill uses P tag for block elements. We want to use DIV tag instead. When using p tag, new-lines appear differently in actual html compared to the editor.
const Block = Quill.import('blots/block');
Block.tagName = 'DIV';
Quill.register(Block, true);

type ReactQuillWithNoSSRProps =
  | ReactQuillProps
  | { forwardedRef?: ForwardedRef<ReactQuill> };

const ReactQuillWithNoSSR = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill');

    // eslint-disable-next-line react/display-name
    return (props: ReactQuillWithNoSSRProps) => {
      if ('forwardedRef' in props) {
        const { forwardedRef, ...otherProps } = props;
        return <RQ ref={forwardedRef} {...otherProps} />;
      }
      return <RQ {...props} />;
    };
  },
  {
    loading: () => <SpinnerScreen />,
    ssr: false,
  }
);

const RichTextEditor = forwardRef<ReactQuill, ReactQuillProps>(
  ({ id, theme, value, onChange, modules, placeholder, ...props }, ref) => (
    <ReactQuillWithNoSSR
      id={id}
      theme={theme}
      value={value}
      modules={modules}
      forwardedRef={ref}
      onChange={onChange}
      placeholder={placeholder}
      {...props}
    />
  )
);

RichTextEditor.displayName = 'RichTextEditor';

export default RichTextEditor;
