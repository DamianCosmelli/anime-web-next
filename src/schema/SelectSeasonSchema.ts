import * as z from "zod";

export const selectSeasonSchema = z.object({
    season: z.string().min(1, "Selecciona una temporada"),
    seasonYear: z.string().min(1, "Selecciona un año"),
});

export type SelectSeasonFormData = z.infer<typeof selectSeasonSchema>;
