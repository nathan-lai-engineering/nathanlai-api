import { db, actionLogs } from '#db';
import { desc } from 'drizzle-orm';

const getActionLogsSchema = {
  querystring: {
    type: 'object',
    properties: {
      limit: { type: 'integer', minimum: 1, maximum: 100, default: 1 },
    },
  },
};

export default async function actionLogsRoutes(fastify) {
  fastify.get('/action_logs', { schema: getActionLogsSchema }, async (request) => {
    const { limit } = request.query;

    return db.select({
        id: actionLogs.id,
        actionName: actionLogs.actionName,
        startedAt: actionLogs.startedAt,
        finishedAt: actionLogs.finishedAt,
        status: actionLogs.status,
        errorMessage: actionLogs.errorMessage,
      })
      .from(actionLogs)
      .orderBy(desc(actionLogs.startedAt))
      .limit(limit);
  });
}
