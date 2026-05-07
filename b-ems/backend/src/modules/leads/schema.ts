import { z } from 'zod';

export const leadSchema = z.object({
  name: z.string().min(2),
  phone: z.string(),
  email: z.string().email().optional().nullable(),
  source: z.string().optional(),
  status: z.string().optional(),
  assignedToId: z.string().optional().nullable(),
  courseInterest: z.string().optional(),
  branchId: z.string().optional().nullable(),
  notes: z.string().optional(),
  followUpAt: z.string().optional().nullable(),
});
