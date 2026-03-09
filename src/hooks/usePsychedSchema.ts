// Re-export from the admin app's hooks — this hook reads from PsychedSchemaContext
// which is provided by the admin shell (PsychedSchemaProvider in App.tsx).
// The translatable plugin needs schema access but doesn't own the schema provider.
//
// At build time this resolves via the admin app's module graph since
// admin-translatable is consumed as a workspace dependency.
export { usePsychedSchema } from '../../../../admin/src/hooks/usePsychedSchema.ts';
