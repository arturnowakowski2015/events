import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

type OptimisticConfig<TEntity, TPayload, TId extends string> = {
    create?: (payload: TPayload, tempId: TId) => TEntity;
    update?: (id: TId, payload: TPayload, current: TEntity | undefined) => TEntity | undefined;
};

type HooksConfig<TEntity, TPayload, TId extends string> = {
    resource: string;
    getId: (entity: TEntity) => TId;
    fetchAll: () => Promise<TEntity[]>;
    fetchOne: (id: TId) => Promise<TEntity>;
    create: (payload: TPayload) => Promise<TEntity>;
    update: (id: TId, payload: TPayload) => Promise<TEntity>;
    remove: (id: TId) => Promise<void>;
    optimistic?: OptimisticConfig<TEntity, TPayload, TId>;
};

type MutationContext<TEntity, TId extends string> = {
    previousAll: TEntity[] | undefined;
    previousDetail: TEntity | undefined;
    optimisticId?: TId;
};

function makeTempId<TId extends string>(resource: string): TId {
    return `${resource}-optimistic-${Date.now()}-${Math.random().toString(36).slice(2)}` as TId;
}

export function createHooks<TEntity, TPayload, TId extends string>(config: HooksConfig<TEntity, TPayload, TId>) {
    const keys = {
        all: [config.resource] as const,
        detail: (id: TId) => [config.resource, id] as const,
    };

    function useListQuery() {
        return useQuery({
            queryKey: keys.all,
            queryFn: config.fetchAll,
        });
    }

    function useDetailQuery(id: TId) {
        return useQuery({
            queryKey: keys.detail(id),
            queryFn: () => config.fetchOne(id),
            enabled: Boolean(id.trim()),
            retry: false,
        });
    }

    function useCreateMutation() {
        const queryClient = useQueryClient();

        return useMutation({
            mutationFn: (payload: TPayload) => config.create(payload),
            onMutate: async (payload): Promise<MutationContext<TEntity, TId>> => {
                await queryClient.cancelQueries({ queryKey: keys.all });

                const previousAll = queryClient.getQueryData<TEntity[]>(keys.all);

                if (!config.optimistic?.create) {
                    return { previousAll, previousDetail: undefined };
                }

                const optimisticId = makeTempId<TId>(config.resource);
                const optimisticEntity = config.optimistic.create(payload, optimisticId);

                queryClient.setQueryData<TEntity[]>(keys.all, (current = []) => [optimisticEntity, ...current]);
                queryClient.setQueryData(keys.detail(optimisticId), optimisticEntity);

                return { previousAll, previousDetail: undefined, optimisticId };
            },
            onError: (_error, _payload, context) => {
                if (!context) {
                    return;
                }
                queryClient.setQueryData(keys.all, context.previousAll);
                if (context.optimisticId) {
                    queryClient.removeQueries({ queryKey: keys.detail(context.optimisticId) });
                }
            },
            onSuccess: (entity, _payload, context) => {
                const id = config.getId(entity);
                if (context?.optimisticId) {
                    queryClient.setQueryData<TEntity[]>(keys.all, (current = []) => current.map((item) => (
                        config.getId(item) === context.optimisticId ? entity : item
                    )));
                    queryClient.removeQueries({ queryKey: keys.detail(context.optimisticId) });
                }
                void queryClient.invalidateQueries({ queryKey: keys.all });
                queryClient.setQueryData(keys.detail(id), entity);
            },
        });
    }

    function useUpdateMutation() {
        const queryClient = useQueryClient();

        return useMutation({
            mutationFn: ({ id, payload }: { id: TId; payload: TPayload }) => config.update(id, payload),
            onMutate: async ({ id, payload }): Promise<MutationContext<TEntity, TId>> => {
                await queryClient.cancelQueries({ queryKey: keys.all });
                await queryClient.cancelQueries({ queryKey: keys.detail(id) });

                const previousAll = queryClient.getQueryData<TEntity[]>(keys.all);
                const previousDetail = queryClient.getQueryData<TEntity>(keys.detail(id));

                if (!config.optimistic?.update) {
                    return { previousAll, previousDetail };
                }

                const current = previousDetail ?? previousAll?.find((item) => config.getId(item) === id);
                const optimisticEntity = config.optimistic.update(id, payload, current);

                if (!optimisticEntity) {
                    return { previousAll, previousDetail };
                }

                queryClient.setQueryData(keys.detail(id), optimisticEntity);
                queryClient.setQueryData<TEntity[]>(keys.all, (items = []) => items.map((item) => (
                    config.getId(item) === id ? optimisticEntity : item
                )));

                return { previousAll, previousDetail };
            },
            onError: (_error, variables, context) => {
                if (!context) {
                    return;
                }
                queryClient.setQueryData(keys.all, context.previousAll);
                queryClient.setQueryData(keys.detail(variables.id), context.previousDetail);
            },
            onSuccess: (entity) => {
                const id = config.getId(entity);
                queryClient.setQueryData<TEntity[]>(keys.all, (items = []) => items.map((item) => (
                    config.getId(item) === id ? entity : item
                )));
                void queryClient.invalidateQueries({ queryKey: keys.all });
                queryClient.setQueryData(keys.detail(id), entity);
            },
        });
    }

    function useDeleteMutation() {
        const queryClient = useQueryClient();

        return useMutation({
            mutationFn: (id: TId) => config.remove(id),
            onMutate: async (id): Promise<MutationContext<TEntity, TId>> => {
                await queryClient.cancelQueries({ queryKey: keys.all });
                await queryClient.cancelQueries({ queryKey: keys.detail(id) });

                const previousAll = queryClient.getQueryData<TEntity[]>(keys.all);
                const previousDetail = queryClient.getQueryData<TEntity>(keys.detail(id));

                queryClient.setQueryData<TEntity[]>(keys.all, (items = []) => items.filter((item) => config.getId(item) !== id));
                queryClient.removeQueries({ queryKey: keys.detail(id) });

                return { previousAll, previousDetail };
            },
            onError: (_error, id, context) => {
                if (!context) {
                    return;
                }
                queryClient.setQueryData(keys.all, context.previousAll);
                queryClient.setQueryData(keys.detail(id), context.previousDetail);
            },
            onSuccess: (_, id) => {
                void queryClient.invalidateQueries({ queryKey: keys.all });
                queryClient.removeQueries({ queryKey: keys.detail(id) });
            },
        });
    }

    return {
        keys,
        useListQuery,
        useDetailQuery,
        useCreateMutation,
        useUpdateMutation,
        useDeleteMutation,
    };
}