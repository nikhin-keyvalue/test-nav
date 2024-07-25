'use client';

import 'quill-mention';

import { Typography } from '@AM-i-B-V/ui-kit';
import { Grid } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  FC,
  FormEvent,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';
import ReactQuill from 'react-quill';

import { CustomDialog } from '@/components';
import Combobox from '@/components/Combobox';
import RichTextEditor from '@/components/rich-text-editor/RichTextEditor';
import SpinnerScreen from '@/components/SpinnerScreen';
import SubmitLine from '@/components/SubmitLine';
import TabSwitch from '@/components/tab-switch/TabSwitch';
import { LOCALE_LIST_ARRAY, LocaleList } from '@/constants/common';
import { useTranslations } from '@/hooks/translation';
import { showErrorToast, showSuccessToast } from '@/utils/toast';

import { emailTemplateTestIds } from '../../../../tests/e2e/constants/testIds';
import { editEmailTemplate } from '../api/actions';
import { EmailTemplateDetails } from '../api/types';
import {
  bodyToolbarConfig,
  subjectToolbarConfig,
  variableMentionConfig,
} from '../constants';

const SUB_CHAR_LIMIT = 180;

type VariableOption = {
  id: string;
  value: string;
};

type OnSelectItem = {
  id: string;
  value: string;
  index?: number;
};

interface EditEmailTemplateProps {
  emailTemplateDetails: EmailTemplateDetails | null;
}

const EditEmailTemplate: FC<EditEmailTemplateProps> = ({
  emailTemplateDetails,
}) => {
  const [showEditor, setShowEditor] = useState(false);
  const [hasUnsavedForm, setHasUnsavedForm] = useState(false);
  const [variableOptions, setVariableOptions] = useState<VariableOption[]>([]);
  const [activeLanguageTab, setActiveLanguageTab] = useState<LocaleList>(
    LocaleList.nl_NL
  );
  const [emailData, setEmailData] = useState<EmailTemplateDetails | null>(
    emailTemplateDetails
  );
  const [charLimitExceeded, setCharLimitExceeded] = useState<
    Record<LocaleList, boolean>
  >({
    [LocaleList.en_GB]: false,
    [LocaleList.nl_NL]: false,
  });

  const emailSubjectEditorRef = useRef<ReactQuill>(null);
  const emailContentEditorRef = useRef<ReactQuill>(null);

  const router = useRouter();
  const t = useTranslations();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const tEmailTemplates = useTranslations('settings.emailTemplates');

  // Note: To initialise relevant states with emailTemplateDetails api response
  const initializeFormStateWithEmailTemplateData = () => {
    const { variables } = emailTemplateDetails!;
    setEmailData(emailTemplateDetails);
    const formattedVariableOptions = variables?.map((variableValue) => ({
      id: variableValue,
      value: variableValue,
    }));
    if (formattedVariableOptions) setVariableOptions(formattedVariableOptions);
  };

  useEffect(() => {
    if (emailTemplateDetails) {
      initializeFormStateWithEmailTemplateData();
    }
  }, [emailTemplateDetails]);

  useEffect(() => {
    // Note: react-quill's editor is not re-rendering correctly on route navigations. This state helps to fix the issue
    setShowEditor(true);
  }, []);

  const handleChange = (value: string, field: 'body' | 'subject') => {
    const textOnly = value.replace(/<[^>]*>?/gm, '');
    if (field === 'subject' && textOnly.length > SUB_CHAR_LIMIT) {
      setCharLimitExceeded((prev) => ({ ...prev, [activeLanguageTab]: true }));
      setTimeout(() => {
        setCharLimitExceeded((prev) => ({
          ...prev,
          [activeLanguageTab]: false,
        }));
      }, 3000);
    }

    setEmailData((prev) => {
      if (!prev) return prev;
      const safePrev = prev;
      const fieldData = safePrev[field] || {};
      return {
        ...safePrev,
        [field]: {
          ...fieldData,
          [activeLanguageTab]:
            textOnly.length <= SUB_CHAR_LIMIT || field === 'body'
              ? value
              : value.slice(0, SUB_CHAR_LIMIT),
        },
      };
    });
  };

  const comboboxVariableOptions: {
    id: string;
    value: string;
    displayValue: string;
  }[] = useMemo(
    () =>
      variableOptions?.map((variableItem) => ({
        ...variableItem,
        displayValue: variableItem.value,
      })),
    [variableOptions]
  );

  const onSelect = useCallback(
    (item: OnSelectItem, insertItem: (item: VariableOption) => void) => {
      // Note: formated the inserted value as a variable by wrapping in {}
      const modifiedItem = { ...item, value: `{${item.value}}` };
      if (modifiedItem.index) delete modifiedItem.index;
      insertItem(modifiedItem);
    },
    []
  );

  const handleSetActiveTab = (tabId: LocaleList) => {
    setActiveLanguageTab(tabId);
  };

  const filterSource = useCallback(
    (
      searchTerm: string,
      renderList: (values: VariableOption[], searchTerm: string) => void
    ) => {
      const values = [...variableOptions];

      if (searchTerm.length === 0) {
        renderList(values, searchTerm);
      } else {
        const matches = values.filter(
          (item) =>
            item.value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0
        );
        renderList(matches, searchTerm);
      }
    },
    [variableOptions]
  );

  const mentionConfig = {
    ...variableMentionConfig,
    source: filterSource,
    onSelect,
  };

  const emailSubjectModules = {
    toolbar: subjectToolbarConfig,
    mention: mentionConfig,
  };

  const emailContentModules = {
    toolbar: bodyToolbarConfig,
    mention: mentionConfig,
  };

  const onChangeCombobox = (
    newValues: { id: string; displayValue: string }[],
    editorRef: RefObject<ReactQuill>
  ) => {
    const selectedItem = newValues[0];
    if (!editorRef?.current || !selectedItem) return;

    const quill = editorRef.current.getEditor();
    /* Note: Programmatic insertion at the cursor point using the mention module on a newline, inserts the mention before the newline character. Focusing the editor first fixes this bug */
    quill.focus();
    quill.getModule('mention').insertItem(
      {
        id: selectedItem.id,
        value: `{${selectedItem.displayValue}}`,
      },
      true
    );
  };

  const navigateToEmailTemplatesList = () => {
    const urlParams = new URLSearchParams(searchParams);
    urlParams.delete('id');
    const query = urlParams.toString() || '';
    router.push(`?${query}`);
  };

  const onEditEmailTemplate = async (event: FormEvent) => {
    event.preventDefault();
    if (emailData) {
      Object.keys(emailData.body).forEach((item) => {
        if (emailData?.subject[item] === '<div><br></div>') {
          emailData.subject[item] = null;
        }

        if (emailData?.body[item] === '<div><br></div>') {
          emailData.body[item] = null;
        }
      });
    }

    if (
      !(
        (emailData?.subject[activeLanguageTab] === null &&
          emailData?.body[activeLanguageTab] === null) ||
        (emailData?.subject[activeLanguageTab] !== null &&
          emailData?.body[activeLanguageTab] !== null)
      )
    ) {
      showErrorToast(t('common.somethingWentWrong'));
    } else {
      const editPayload = {
        subject: {
          ...emailData?.subject,
          [activeLanguageTab]:
            emailSubjectEditorRef?.current?.getEditor().root.innerText === '\n'
              ? null
              : emailSubjectEditorRef?.current?.getEditor().root.innerText ??
                null,
        },
        body: {
          ...emailData?.body,
          [activeLanguageTab]: emailData?.body[activeLanguageTab] ?? null,
        },
      };

      if (!emailTemplateDetails?.id) return;
      const res = await editEmailTemplate(emailTemplateDetails.id, editPayload);

      if (res?.success) {
        showSuccessToast(t('common.savedSuccessfully'));
        navigateToEmailTemplatesList();
      } else {
        showErrorToast(t('common.somethingWentWrong'));
      }
    }
  };

  const compareHtmlForDifference = (html1: string, html2: string) => {
    const parser = new DOMParser();

    const dom1 = parser.parseFromString(html1, 'text/html');
    const dom2 = parser.parseFromString(html2, 'text/html');

    return !dom1.isEqualNode(dom2);
  };

  const checkForUnsavedFormChanges = () => {
    const emailSubjectText =
      emailSubjectEditorRef?.current?.getEditor().root.innerText;
    const hasEmailSubjectChanged =
      emailSubjectText !== emailTemplateDetails?.subject || '';
    const hasEmailContentChanged = compareHtmlForDifference(
      emailData?.body[activeLanguageTab] || '',
      emailTemplateDetails?.body[activeLanguageTab] || ''
    );
    return hasEmailSubjectChanged || hasEmailContentChanged;
  };

  const onCancel = () => {
    const hasUnsavedFormChanges = checkForUnsavedFormChanges();
    if (hasUnsavedFormChanges) {
      setHasUnsavedForm(true);
      return;
    }
    navigateToEmailTemplatesList();
  };

  const onUnSavedFormDialogSubmit = () => {
    setHasUnsavedForm(false);
    navigateToEmailTemplatesList();
  };

  const onFormSubmit = (e: FormEvent) => {
    startTransition(() => {
      onEditEmailTemplate(e);
    });
  };

  if (!showEditor) return <SpinnerScreen />;

  return (
    <>
      <form
        noValidate
        className='w-full'
        onSubmit={onFormSubmit}
        id='emailTemplateEditForm'
      >
        <Grid container direction='column'>
          <TabSwitch
            activeTab={activeLanguageTab}
            tabs={[
              {
                id: LocaleList.en_GB,
                content: LocaleList.en_GB.replace('_', '-'),
              },
              {
                id: LocaleList.nl_NL,
                content: LocaleList.nl_NL.replace('_', '-'),
              },
            ]}
            handleSetActiveTab={handleSetActiveTab}
          >
            <Grid item className='mb-6'>
              <Typography variant='textMedium'>
                {tEmailTemplates('instructionForVariableInsertion')}
              </Typography>
            </Grid>
            <Grid
              container
              direction='column'
              item
              className='rounded border border-solid border-[#DEE0E2] bg-[#EFEFF0]'
            >
              <Grid item padding={1}>
                <Combobox
                  values={[]}
                  options={comboboxVariableOptions}
                  label={tEmailTemplates('addVariableToEmailSubject')}
                  onValChange={(newValues) =>
                    onChangeCombobox(newValues, emailSubjectEditorRef)
                  }
                  dataTestId={
                    emailTemplateTestIds.emailSubjectVariableSelection
                  }
                />
              </Grid>
              {/* Mapping through the LOCALE_LIST_ARRAY to manually trigger rerender 
              of the RichTextEditor component inorder to solve data persistance issue */}
              {LOCALE_LIST_ARRAY.map((lang) => {
                if (lang === activeLanguageTab) {
                  return (
                    <Grid item key={`${lang}subject`}>
                      <RichTextEditor
                        theme='bubble'
                        className='font-roboto'
                        ref={emailSubjectEditorRef}
                        modules={emailSubjectModules}
                        value={emailData?.subject[activeLanguageTab] ?? ''}
                        onChange={(val) => handleChange(val ?? '', 'subject')}
                        placeholder={tEmailTemplates('emailSubjectPlaceholder')}
                      />
                    </Grid>
                  );
                }
                return <> </>;
              })}
            </Grid>
            <div className='mb-6 bg-transparent pl-4 pt-1 text-xs text-primary'>
              {charLimitExceeded[activeLanguageTab]
                ? tEmailTemplates('charLimitExceeded', {
                    charLimit: SUB_CHAR_LIMIT,
                  })
                : ''}
            </div>
            <Grid
              item
              container
              direction='column'
              className='rounded border border-solid border-[#DEE0E2] bg-[#EFEFF0]'
            >
              <Grid item padding={1}>
                <Combobox
                  values={[]}
                  options={comboboxVariableOptions}
                  dataTestId={
                    emailTemplateTestIds.emailContentVariableSelection
                  }
                  label={tEmailTemplates('addVariableToEmailText')}
                  onValChange={(newValues) =>
                    onChangeCombobox(newValues, emailContentEditorRef)
                  }
                />
              </Grid>
              {LOCALE_LIST_ARRAY.map((lang) => {
                if (lang === activeLanguageTab) {
                  return (
                    <Grid item key={`${lang}body`}>
                      <RichTextEditor
                        theme='snow'
                        preserveWhitespace
                        className='font-roboto'
                        ref={emailContentEditorRef}
                        style={{ height: '395px' }}
                        modules={emailContentModules}
                        value={emailData?.body[activeLanguageTab] ?? ''}
                        onChange={(val) => handleChange(val ?? '', 'body')}
                        placeholder={tEmailTemplates('emailContentPlaceholder')}
                      />
                    </Grid>
                  );
                }
                return <> </>;
              })}
            </Grid>
          </TabSwitch>
          <SubmitLine
            className='pl-0'
            onCancel={onCancel}
            disableButtons={isPending}
            testId={emailTemplateTestIds.editSubmitBtn}
          />
        </Grid>
      </form>
      <CustomDialog
        isOpen={hasUnsavedForm}
        onSubmit={onUnSavedFormDialogSubmit}
        onClose={() => setHasUnsavedForm(false)}
        headerElement={tEmailTemplates(
          'unSavedChangeConfirmationModal.heading'
        )}
        cancelText={tEmailTemplates(
          'unSavedChangeConfirmationModal.cancelBtnText'
        )}
        submitText={tEmailTemplates(
          'unSavedChangeConfirmationModal.proceedBtnText'
        )}
      >
        {tEmailTemplates('unSavedChangeConfirmationModal.content')}
      </CustomDialog>
    </>
  );
};

export default EditEmailTemplate;
