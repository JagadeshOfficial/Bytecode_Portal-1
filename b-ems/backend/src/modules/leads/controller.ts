import { Request, Response } from 'express';
import prisma from '@/prisma';
import { leadSchema } from './schema';
import { io } from '@/server';

export const getLeads = async (req: Request, res: Response) => {
  try {
    const leads = await prisma.lead.findMany({
      include: { assignedTo: true, branch: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: leads });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createLead = async (req: Request, res: Response) => {
  try {
    const data = leadSchema.parse(req.body);
    const lead = await prisma.lead.create({
      data: {
        ...data,
        followUpAt: data.followUpAt ? new Date(data.followUpAt) : null,
      },
      include: { assignedTo: true },
    });

    // Notify via socket
    io.emit('new_lead', lead);

    res.status(201).json({ success: true, data: lead });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const updateLead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = leadSchema.partial().parse(req.body);
    
    const lead = await prisma.lead.update({
      where: { id },
      data: {
        ...data,
        followUpAt: data.followUpAt ? new Date(data.followUpAt) : undefined,
      },
    });

    res.json({ success: true, data: lead });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const deleteLead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.lead.delete({ where: { id } });
    res.json({ success: true, message: 'Lead deleted' });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};
