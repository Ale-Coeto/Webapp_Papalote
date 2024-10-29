import { z } from "zod";

const zoneSchema = z.object({
  zoneName: z.string().min(1, "El nombre de la zona es requerido"),
  zoneDescription: z.string().min(1, "La descripción de la zona es requerida"),
  zoneColor: z.string().min(1, "El color de la zona es requerido"),
  zoneLogo: z.string().optional(),
});

export const existingZoneSchema = z.object({
  ...zoneSchema.shape,
  id: z.string().optional(),
});

const insigniaSchema = z.object({
  zone_id: z.string().min(1, "La zona es requerida"),
  insigniaName: z.string().min(1, "El nombre de la insignia es requerido"),
  insigniaDescription: z
    .string()
    .min(1, "La descripción de la insignia es requerida"),
  insigniaNfcCode: z.string().min(1, "El código NFC es requerido"),
  insigniaLogo: z.string().min(1, "El logo es requerido"),
  insigniaSpecialEventId: z.string().optional(),
});

export const existingInsigniaSchema = z.object({
  ...insigniaSchema.shape,
  insigniaId: z.string().optional(),
});

const exhibitionSchema = z.object({
  zone_id: z.string().min(1, "La zona es requerida"),
  exhibitionName: z.string().min(1, "El nombre de la exhibición es requerido"),
  exhibitionIsOpen: z.boolean(),
  exhibitionImage: z.string().optional(),
  exhibitionDescription: z
    .string()
    .min(1, "La descripción de la exhibición es requerida"),
});

export const existingExhibitionSchema = z.object({
  ...exhibitionSchema.shape,
  exhibitionId: z.string().optional(),
});
