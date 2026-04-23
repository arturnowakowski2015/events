import { useState } from 'react';

type CrudActionStateConfig<TEntity, TForm, TId extends string> = {
    emptyForm: TForm;
    getId: (entity: TEntity) => TId;
    toForm: (entity: TEntity) => TForm;
};

export function useCrudActionState<TEntity, TForm, TId extends string>(config: CrudActionStateConfig<TEntity, TForm, TId>) {
    const [lookupInput, setLookupInput] = useState('');
    const [activeLookupId, setActiveLookupId] = useState('');

    const [createForm, setCreateForm] = useState<TForm>(config.emptyForm);
    const [updateId, setUpdateId] = useState('');
    const [updateForm, setUpdateForm] = useState<TForm>(config.emptyForm);
    const [deleteId, setDeleteId] = useState('');
    const [lastDeletedId, setLastDeletedId] = useState('');

    const activateLookup = () => {
        setActiveLookupId(lookupInput.trim());
    };

    const setCreateField = <K extends keyof TForm>(field: K, value: TForm[K]) => {
        setCreateForm((current) => ({ ...current, [field]: value }));
    };

    const setUpdateField = <K extends keyof TForm>(field: K, value: TForm[K]) => {
        setUpdateForm((current) => ({ ...current, [field]: value }));
    };

    const applyCreatedEntity = (entity: TEntity) => {
        const id = config.getId(entity);
        setCreateForm(config.emptyForm);
        setLookupInput(id);
        setActiveLookupId(id);
        setUpdateId(id);
        setUpdateForm(config.toForm(entity));
        setDeleteId(id);
    };

    const applyUpdatedEntity = (entity: TEntity) => {
        const id = config.getId(entity);
        setLookupInput(id);
        setActiveLookupId(id);
        setUpdateForm(config.toForm(entity));
    };

    const applyDeletedId = (id: TId) => {
        setLastDeletedId(id);
        if (activeLookupId === id) {
            setActiveLookupId('');
            setLookupInput('');
        }
        if (updateId === id) {
            setUpdateId('');
            setUpdateForm(config.emptyForm);
        }
        setDeleteId('');
    };

    const selectEntity = (entity: TEntity) => {
        const id = config.getId(entity);
        setLookupInput(id);
        setActiveLookupId(id);
        setUpdateId(id);
        setUpdateForm(config.toForm(entity));
        setDeleteId(id);
    };

    return {
        lookupInput,
        setLookupInput,
        activeLookupId,
        activateLookup,

        createForm,
        setCreateForm,
        setCreateField,

        updateId,
        setUpdateId,
        updateForm,
        setUpdateForm,
        setUpdateField,

        deleteId,
        setDeleteId,
        lastDeletedId,

        applyCreatedEntity,
        applyUpdatedEntity,
        applyDeletedId,
        selectEntity,
    };
}
