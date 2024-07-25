'use client';

import { Typography } from '@AM-i-B-V/ui-kit';
import {
  Autocomplete,
  autocompleteClasses,
  Button,
  Grid,
  MenuItem,
  TextField,
} from '@mui/material';
import DialogContent from '@mui/material/DialogContent';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { MdManageSearch } from 'react-icons/md';

import { RenderPersonOption } from '@/components';
import Dialog from '@/components/Dialog';
import SelectWithController from '@/components/select-with-controller/SelectWithController';
import {
  ConnectionRelationType,
  organisationPersonRelationTypesList,
  organisationRelationTypesList,
  personOrganisationRelationTypesList,
  personRelationTypesList,
} from '@/constants/common';
import { useOptions } from '@/hooks/options';
import { useTranslations } from '@/hooks/translation';
import {
  IOrganisationDetails,
  NewConnection,
  PersonsDetails,
} from '@/types/api';
import { ENTITIES } from '@/types/common';
import { addConnection, editConnection } from '@/utils/actions/formActions';
import { mergeStrings } from '@/utils/common';
import { showErrorToast, showSuccessToast } from '@/utils/toast';

import { Connection } from './types';

interface Error {
  linkId?: string;
  connectionType?: string;
}

const AddConnectionDialog = ({
  open,
  handleClose,
  childEntity,
  parentEntity,
  existingConnections,
  connectionToEdit,
}: {
  open: boolean;
  handleClose: () => void;
  parentEntity: ENTITIES;
  childEntity: ENTITIES;
  existingConnections?:
    | IOrganisationDetails['connections']
    | PersonsDetails['connections'];
  connectionToEdit?: Connection;
}) => {
  const { id: parentEntityId } = useParams();
  const t = useTranslations();

  const [errors, setErrors] = useState<Error>();
  const [isApiLoading, setApiLoading] = useState(false);

  const formMethods = useForm<NewConnection>({
    defaultValues: { connectionType: connectionToEdit?.connectionType },
  });

  const { control, handleSubmit, watch } = formMethods;

  const connectionTypeValue = watch('connectionType');

  const {
    onOpen,
    options,
    loading,
    onInputChange,
    selectedOption,
    setSelectedOption,
  } = useOptions({
    url:
      childEntity === ENTITIES.PERSON
        ? `/api/getPersons`
        : `/api/getOrganisations`,
    ...(childEntity === ENTITIES.PERSON && {
      customSearchParamKeys: ['name', 'email'],
    }),
    currentOptions:
      existingConnections
        ?.filter(
          (connection) => connectionToEdit?.linkId !== connection?.linkId
        )
        .map((connection) => ({ id: connection.linkId })) || undefined,
  });

  const getRelationTypes = () => {
    if (childEntity === parentEntity) {
      if (childEntity === ENTITIES.PERSON) return personRelationTypesList;

      if (childEntity === ENTITIES.ORGANISATION)
        return organisationRelationTypesList;
    } else {
      if (
        parentEntity === ENTITIES.PERSON &&
        childEntity === ENTITIES.ORGANISATION
      )
        return organisationPersonRelationTypesList;
      if (
        parentEntity === ENTITIES.ORGANISATION &&
        childEntity === ENTITIES.PERSON
      )
        return personOrganisationRelationTypesList;
    }
    return [ConnectionRelationType.CLIENT];
  };

  const validateInput = () => {
    if (selectedOption?.id && connectionTypeValue) return true;

    if (!selectedOption?.id) {
      setErrors((prev) => ({
        ...prev,
        linkId:
          childEntity === ENTITIES?.PERSON
            ? t('connections.errors.person')
            : t('connections.errors.organisation'),
      }));
    }

    if (!connectionTypeValue)
      setErrors((prev) => ({
        ...prev,
        connectionType: t('connections.errors.relationType'),
      }));

    return false;
  };

  const onAddConnection = async (formData: NewConnection) => {
    setApiLoading(true);
    const validated = validateInput();

    if (validated) {
      const res = await addConnection(parentEntityId as string, parentEntity, {
        ...formData,
        linkId: selectedOption!.id!,
        entity: childEntity === ENTITIES.PERSON ? 'Person' : 'Organisation',
      });

      if (res?.id) {
        showSuccessToast(t('common.savedSuccessfully'));

        handleClose();
      } else {
        showErrorToast(t('common.somethingWentWrong'));
      }
    }
    setApiLoading(false);
  };

  const onEditConnection = async (formData: NewConnection) => {
    setApiLoading(true);
    const validated = validateInput();

    if (connectionToEdit?.id && validated) {
      const res = await editConnection(
        connectionToEdit.id,
        parentEntityId as string,
        parentEntity,
        {
          ...formData,
          linkId: selectedOption!.id!,
          entity: childEntity === ENTITIES.PERSON ? 'Person' : 'Organisation',
        }
      );

      if (res?.id) {
        showSuccessToast(t('common.savedSuccessfully'));

        handleClose();
      } else {
        showErrorToast(t('common.somethingWentWrong'));
      }
    }
    setApiLoading(false);
  };

  const handleAddClick = async () => {
    await handleSubmit(async (formData) => {
      if (connectionToEdit?.id) onEditConnection(formData);
      else onAddConnection(formData);
    })();
  };

  useEffect(() => {
    if (connectionToEdit)
      setSelectedOption({
        id: connectionToEdit?.linkId,
        ...(childEntity === ENTITIES.PERSON && {
          firstName: connectionToEdit?.linkName,
        }),
        ...(childEntity === ENTITIES.ORGANISATION && {
          name: connectionToEdit?.linkName,
        }),
      });
  }, [connectionToEdit]);

  useEffect(() => {
    if (selectedOption?.id) setErrors((prev) => ({ ...prev, linkId: '' }));

    if (connectionTypeValue)
      setErrors((prev) => ({ ...prev, connectionType: '' }));
  }, [selectedOption, connectionTypeValue]);

  return (
    <Dialog
      headerElement={
        connectionToEdit?.id
          ? t('connections.editConnection')
          : t('connections.addConnection')
      }
      onClose={handleClose}
      onSubmit={handleAddClick}
      isOpen={open}
      disabled={isApiLoading}
      isLoading={isApiLoading}
      submitText={connectionToEdit?.id ? t('common.edit') : t('common.add')}
    >
      <FormProvider {...formMethods}>
        <div>
          <DialogContent sx={{ maxWidth: '360px' }}>
            <Grid container gap={2}>
              <SelectWithController
                testId='select-controller-connection-type'
                control={control}
                name='connectionType'
                label={t('connections.relationType')}
                options={getRelationTypes()}
                renderOption={(option) => (
                  <MenuItem key={option} value={option}>
                    {t(`connections.${option}`)}
                  </MenuItem>
                )}
                error={!!errors?.connectionType}
                helperText={errors?.connectionType}
                required
              />
              <Autocomplete
                options={options}
                className='w-full'
                onInputChange={onInputChange}
                loading={loading}
                loadingText={`${t('common.loading')}...`}
                noOptionsText={t('common.startTyping')}
                getOptionLabel={(option) =>
                  childEntity === ENTITIES.PERSON
                    ? mergeStrings({
                        values: [
                          option.firstName,
                          option.middleName,
                          option.lastName,
                        ],
                      })
                    : option.name || ''
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={
                      childEntity === ENTITIES.PERSON
                        ? t('connections.findPerson')
                        : t('connections.findOrganisation')
                    }
                    error={!!errors?.linkId}
                    helperText={errors?.linkId}
                    required
                  />
                )}
                popupIcon={<MdManageSearch size={24} />}
                sx={{
                  [`& .${autocompleteClasses.popupIndicator}`]: {
                    transform: 'none',
                  },
                }}
                onChange={(_, value) => {
                  setSelectedOption(value);
                }}
                value={selectedOption}
                filterOptions={(value) => value}
                renderOption={
                  childEntity === ENTITIES.PERSON
                    ? (props, option) => RenderPersonOption(props, option)
                    : undefined
                }
                onOpen={onOpen}
              />
              <Link
                href={
                  childEntity === ENTITIES.PERSON
                    ? '/persons/new'
                    : '/organisations/new'
                }
                target='_blank'
                rel='noreferrer'
              >
                <Button
                  variant='outlined'
                  color='secondary'
                  sx={{ maxWidth: '180px', textTransform: 'none' }}
                >
                  <Typography variant='titleSmallBold'>
                    {childEntity === ENTITIES.PERSON
                      ? 'Create new person'
                      : 'Create new organisation'}
                  </Typography>
                </Button>
              </Link>
            </Grid>
          </DialogContent>
        </div>
      </FormProvider>
    </Dialog>
  );
};

export default AddConnectionDialog;
