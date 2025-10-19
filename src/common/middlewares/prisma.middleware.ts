// Commented out for now as it's not needed for the current implementation

// interface MiddlewareParams {
//   action: string;
//   args: {
//     data?: Record<string, unknown>;
//     where?: Record<string, unknown>;
//   };
// }

// type Middleware = (
//   params: MiddlewareParams,
//   next: (params: MiddlewareParams) => Promise<unknown>,
// ) => Promise<unknown>;

// export const softDeleteMiddleware: Middleware = async (params, next) => {
//   // Handle single soft delete operation
//   if (params.action === 'delete') {
//     params.action = 'update';
//     params.args.data = { ...(params.args.data ?? {}), deletedAt: new Date() };
//   }

//   // Handle bulk soft delete operation
//   if (params.action === 'deleteMany') {
//     params.action = 'updateMany';
//     params.args.data = { ...(params.args.data ?? {}), deletedAt: new Date() };
//   }

//   // Handle find operations
//   if (
//     [
//       'findUnique',
//       'findFirst',
//       'findMany',
//       'count',
//       'aggregate',
//       'groupBy',
//     ].includes(params.action)
//   ) {
//     // Filter out deleted records
//     const whereClause = params.args.where;
//     if (whereClause && whereClause.deletedAt === undefined) {
//       params.args.where = {
//         ...whereClause,
//         deletedAt: null,
//       };
//     }
//   }

//   return await next(params);
// };
