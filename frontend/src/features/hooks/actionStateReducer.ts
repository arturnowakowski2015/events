export type ActionState<TForm, TId extends string> = {
    lookupInput: string;
    activeLookupId: string;
    createForm: TForm;
    updateId: string;
    updateForm: TForm;
    deleteId: string;
    lastDeletedId: string;
};

export type FormUpdater<TForm> = TForm | ((current: TForm) => TForm);

export type ActionStateAction<TForm, TId extends string> =
    | { type: 'SET_LOOKUP_INPUT'; value: string }
    | { type: 'ACTIVATE_LOOKUP' }
    | { type: 'SET_CREATE_FORM'; value: FormUpdater<TForm> }
    | { type: 'SET_CREATE_FIELD'; field: keyof TForm; value: TForm[keyof TForm] }
    | { type: 'SET_UPDATE_ID'; value: string }
    | { type: 'SET_UPDATE_FORM'; value: FormUpdater<TForm> }
    | { type: 'SET_UPDATE_FIELD'; field: keyof TForm; value: TForm[keyof TForm] }
    | { type: 'SET_DELETE_ID'; value: string }
    | { type: 'APPLY_CREATED_ENTITY'; id: TId; form: TForm; emptyForm: TForm }
    | { type: 'APPLY_UPDATED_ENTITY'; id: TId; form: TForm }
    | { type: 'APPLY_DELETED_ID'; id: TId; emptyForm: TForm }
    | { type: 'SELECT_ENTITY'; id: TId; form: TForm };

export function createInitialActionState<TForm, TId extends string>(emptyForm: TForm): ActionState<TForm, TId> {
    return {
        lookupInput: '',
        activeLookupId: '',
        createForm: emptyForm,
        updateId: '',
        updateForm: emptyForm,
        deleteId: '',
        lastDeletedId: '',
    };
}

function resolveFormValue<TForm>(current: TForm, value: FormUpdater<TForm>) {
    return typeof value === 'function' ? (value as (form: TForm) => TForm)(current) : value;
}

export function actionStateReducer<TForm, TId extends string>(
    state: ActionState<TForm, TId>,
    action: ActionStateAction<TForm, TId>,
): ActionState<TForm, TId> {
    switch (action.type) {
        case 'SET_LOOKUP_INPUT':
            return { ...state, lookupInput: action.value };
        case 'ACTIVATE_LOOKUP':
            return { ...state, activeLookupId: state.lookupInput.trim() };
        case 'SET_CREATE_FORM':
            return { ...state, createForm: resolveFormValue(state.createForm, action.value) };
        case 'SET_CREATE_FIELD':
            return { ...state, createForm: { ...state.createForm, [action.field]: action.value } as TForm };
        case 'SET_UPDATE_ID':
            return { ...state, updateId: action.value };
        case 'SET_UPDATE_FORM':
            return { ...state, updateForm: resolveFormValue(state.updateForm, action.value) };
        case 'SET_UPDATE_FIELD':
            return { ...state, updateForm: { ...state.updateForm, [action.field]: action.value } as TForm };
        case 'SET_DELETE_ID':
            return { ...state, deleteId: action.value };
        case 'APPLY_CREATED_ENTITY':
            return {
                ...state,
                createForm: action.emptyForm,
                lookupInput: action.id,
                activeLookupId: action.id,
                updateId: action.id,
                updateForm: action.form,
                deleteId: action.id,
            };
        case 'APPLY_UPDATED_ENTITY':
            return {
                ...state,
                lookupInput: action.id,
                activeLookupId: action.id,
                updateForm: action.form,
            };
        case 'APPLY_DELETED_ID': {
            const nextState: ActionState<TForm, TId> = {
                ...state,
                lastDeletedId: action.id,
                deleteId: '',
            };

            if (state.activeLookupId === action.id) {
                nextState.activeLookupId = '';
                nextState.lookupInput = '';
            }

            if (state.updateId === action.id) {
                nextState.updateId = '';
                nextState.updateForm = action.emptyForm;
            }

            return nextState;
        }
        case 'SELECT_ENTITY':
            return {
                ...state,
                lookupInput: action.id,
                activeLookupId: action.id,
                updateId: action.id,
                updateForm: action.form,
                deleteId: action.id,
            };
        default:
            return state;
    }
}
