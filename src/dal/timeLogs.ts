// TODO: Student implementation - Part 2: DAL for time logs

import {db, TimeLog, NewTimeLog } from '../db/database.js';

export async function insertTimeLog(
  ticketId: number,
  userId: number,
  hours: number,
): Promise<any> {
  return await db
    .insertInto('time_logs')
    .values({
      ticket_id: ticketId,
      user_id: userId,
      hours: hours,
    })
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function getTotalHoursForTicket(
  ticketId: number,
): Promise<number> {
  const result = await db
    .selectFrom('time_logs')
    .select(db.fn.sum<string | number>('hours').as('total_hours'))
    .where('ticket_id', '=', ticketId)
    .execureTakeFirst();
  
  return Number(result?.total_hours ?? 0);
}
