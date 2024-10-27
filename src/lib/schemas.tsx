import {z} from "zod";

export const zoneSchema = z.object({
    zoneName: z.string().min(1, "El nombre de la zona es requerido"),
    zoneDescription: z.string().min(1, "La descripción de la zona es requerida"),
    zoneColor: z.string().min(1, "El color de la zona es requerido"),
    zoneLogo: z.string().optional(),
});

export const existingZoneSchema = z.object({
    ...zoneSchema.shape,
    id: z.string().min(1, "El id de la zona es requerido"),
});