import { useReducer } from 'react';
import {
    actionStateReducer,
    createInitialActionState,
    type FormUpdater,
} from './actionStateReducer';

type ActionStateConfig<TEntity, TForm, TId extends string> = {
    emptyForm: TForm;
    getId: (entity: TEntity) => TId;
    toForm: (entity: TEntity) => TForm;
};

export function useActionState<TEntity, TForm, TId extends string>(config: ActionStateConfig<TEntity, TForm, TId>) {
    const [state, dispatch] = useReducer(
        actionStateReducer<TForm, TId>,
        createInitialActionState<TForm, TId>(config.emptyForm),
    );

    const setLookupInput = (value: string) => {
        dispatch({ type: 'SET_LOOKUP_INPUT', value });
    };

    const activateLookup = () => {
        dispatch({ type: 'ACTIVATE_LOOKUP' });
    };

    const setCreateField = <K extends keyof TForm>(field: K, value: TForm[K]) => {
        dispatch({ type: 'SET_CREATE_FIELD', field, value });
    };

    const setCreateForm = (value: FormUpdater<TForm>) => {
        dispatch({ type: 'SET_CREATE_FORM', value });
    };

    const setUpdateField = <K extends keyof TForm>(field: K, value: TForm[K]) => {
        dispatch({ type: 'SET_UPDATE_FIELD', field, value });
    };

    const setUpdateForm = (value: FormUpdater<TForm>) => {
        dispatch({ type: 'SET_UPDATE_FORM', value });
    };

    const setUpdateId = (value: string) => {
        dispatch({ type: 'SET_UPDATE_ID', value });
    };

    const setDeleteId = (value: string) => {
        dispatch({ type: 'SET_DELETE_ID', value });
    };

    const applyCreatedEntity = (entity: TEntity) => {
        const id = config.getId(entity);
        dispatch({
            type: 'APPLY_CREATED_ENTITY',
            id,
            form: config.toForm(entity),
            emptyForm: config.emptyForm,
        });
    };

    const applyUpdatedEntity = (entity: TEntity) => {
        const id = config.getId(entity);
        dispatch({ type: 'APPLY_UPDATED_ENTITY', id, form: config.toForm(entity) });
    };

    const applyDeletedId = (id: TId) => {
        dispatch({ type: 'APPLY_DELETED_ID', id, emptyForm: config.emptyForm });
    };

    const selectEntity = (entity: TEntity) => {
        const id = config.getId(entity);
        dispatch({ type: 'SELECT_ENTITY', id, form: config.toForm(entity) });
    };

    return {
        lookupInput: state.lookupInput,
        setLookupInput,
        activeLookupId: state.activeLookupId,
        activateLookup,

        createForm: state.createForm,
        setCreateForm,
        setCreateField,

        updateId: state.updateId,
        setUpdateId,
        updateForm: state.updateForm,
        setUpdateForm,
        setUpdateField,

        deleteId: state.deleteId,
        setDeleteId,
        lastDeletedId: state.lastDeletedId,

        applyCreatedEntity,
        applyUpdatedEntity,
        applyDeletedId,
        selectEntity,
    };
}
