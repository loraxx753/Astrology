import { z } from 'zod';

// New unified schema for pageFormData context
export const chartFormSchema = z.object({
  pageFormData: z.object({
    // Personal Information
    name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
    gender: z.enum(['male', 'female', 'other', 'prefer-not-to-say']).optional().or(z.literal('')).optional(),

    // Date & Time
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
    time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Time must be in HH:MM format (24-hour)")
      .refine((time) => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
      }, "Invalid time format"),
    timeKnown: z.boolean().default(true),

    // Location
    location: z.object({
      city: z.string().max(100, "City name too long").optional(),
      country: z.string().max(100, "Country name too long").optional(),
      state: z.string().max(100, "State/Province name too long").optional(),
      latitude: z.number().min(-90).max(90).optional(),
      longitude: z.number().min(-180).max(180).optional(),
      knowsCoordinates: z.boolean().optional(),
      timezone: z.string().optional(),
    }).refine((data) => {
      const hasCityCountry = data.city && data.city.trim().length > 0 && data.country && data.country.trim().length > 0;
      const hasCoordinates = typeof data.latitude === 'number' && typeof data.longitude === 'number' && !isNaN(data.latitude) && !isNaN(data.longitude) && data.latitude >= -90 && data.latitude <= 90 && data.longitude >= -180 && data.longitude <= 180;
      return hasCityCountry || hasCoordinates;
    }, {
      message: "Either provide city and country, or provide latitude and longitude coordinates",
      path: ["city"]
    }),

    houseSystem: z.enum([
      'placidus',
      'koch',
      'equal',
      'whole-sign',
      'campanus',
      'regiomontanus'
    ]).default('placidus'),

    orbPreferences: z.object({
      conjunction: z.number().min(0).max(15).default(8),
      opposition: z.number().min(0).max(15).default(8),
      trine: z.number().min(0).max(15).default(8),
      square: z.number().min(0).max(15).default(8),
      sextile: z.number().min(0).max(15).default(6),
      quincunx: z.number().min(0).max(15).default(3),
    }).optional(),

    notes: z.string().max(500, "Notes must be less than 500 characters").optional(),
  })
});

export type ChartFormData = z.infer<typeof chartFormSchema>;

export const defaultChartFormValues: Partial<ChartFormData> = {
  pageFormData: {
    houseSystem: 'placidus',
    timeKnown: true,
    orbPreferences: {
      conjunction: 8,
      opposition: 8,
      trine: 8,
      square: 8,
      sextile: 6,
      quincunx: 3,
    },
  }
};

export const houseSystemDescriptions = {
  placidus: 'Most widely used modern system, unequal houses based on time',
  koch: 'Popular alternative with different mathematical approach',
  equal: 'Equal 30-degree houses from Ascendant',
  'whole-sign': 'Ancient system where each sign = one house',
  campanus: 'Medieval system based on prime vertical',
  regiomontanus: 'Renaissance system, predecessor to Placidus'
} as const;
