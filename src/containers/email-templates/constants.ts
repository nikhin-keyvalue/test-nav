export const bodyToolbarConfig = [
  [{ header: [1, 2, false] }],
  ['bold', 'italic', 'underline', 'blockquote'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['link'],
];

export const subjectToolbarConfig = null;

export const variableMentionConfig = {
  allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
  mentionDenotationChars: ['{'],
  showDenotationChar: false,
  listItemClass: 'p-2 hover:bg-grey-4',
  mentionListClass:
    'bg-white border border-solid border-grey-200 rounded overflow-auto',
  mentionContainerClass: 'z-10',
};
