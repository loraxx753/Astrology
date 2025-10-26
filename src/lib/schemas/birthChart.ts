import { z } from 'zod';

/**
 * Comprehensive birth chart data schema for astrological calculations
 * 
 * Essential data points needed:
 * - Personal info (name, gender optional)
 * - Birth date & precise time (down to the minute)
 * - Geographic location (latitude/longitude for house calculations)
 * - Timezone information (for accurate time conversion to GMT/UTC)
 */

export const birthChartSchema = z.object({
  // Personal Information
  name: z.string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  
  gender: z.enum(['male', 'female', 'other', 'prefer-not-to-say'])
    .optional(),

  // Birth Date & Time
  birthDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  
  birthTime: z.string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Time must be in HH:MM format (24-hour)")
    .refine((time) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
    }, "Invalid time format"),

  timeKnown: z.boolean()
    .default(true), // If false, we'll use noon as default

  // Geographic Location - Either city/country OR lat/long must be provided
  birthLocation: z.object({
    city: z.string()
      .max(100, "City name too long")
      .optional(),
    
    country: z.string()
      .max(100, "Country name too long")
      .optional(),
    
    state: z.string()
      .max(100, "State/Province name too long")
      .optional(),

    // Precise coordinates for astronomical calculations
    latitude: z.number()
      .min(-90, "Latitude must be between -90 and 90 degrees")
      .max(90, "Latitude must be between -90 and 90 degrees")
      .optional(),
    
    longitude: z.number()
      .min(-180, "Longitude must be between -180 and 180 degrees")
      .max(180, "Longitude must be between -180 and 180 degrees")
      .optional(),

    // Timezone information (now optional, backend will determine if not provided)
    timezone: z.string().optional(),
  }).refine((data) => {
    // Either both city AND country are provided, OR both latitude AND longitude are provided
    const hasCityCountry = data.city && data.city.trim().length > 0 && data.country && data.country.trim().length > 0;
    const hasCoordinates = typeof data.latitude === 'number' && typeof data.longitude === 'number' && 
                          !isNaN(data.latitude) && !isNaN(data.longitude) &&
                          data.latitude >= -90 && data.latitude <= 90 &&
                          data.longitude >= -180 && data.longitude <= 180;
    
    return hasCityCountry || hasCoordinates;
  }, {
    message: "Either provide city and country, or provide latitude and longitude coordinates",
    path: ["city"] // This will show the error on the city field
  }),

  // Optional preferences for chart calculation
  houseSystem: z.enum([
    'placidus',     // Most common modern system
    'koch',         // Popular alternative
    'equal',        // Equal 30-degree houses
    'whole-sign',   // Ancient system
    'campanus',     // Medieval system
    'regiomontanus' // Renaissance system
  ]).default('placidus'),

  // Orb preferences for aspects (in degrees)
  orbPreferences: z.object({
    conjunction: z.number().min(0).max(15).default(8),
    opposition: z.number().min(0).max(15).default(8),
    trine: z.number().min(0).max(15).default(8),
    square: z.number().min(0).max(15).default(8),
    sextile: z.number().min(0).max(15).default(6),
    quincunx: z.number().min(0).max(15).default(3),
  }).optional(),

  // Notes or additional context
  notes: z.string()
    .max(500, "Notes must be less than 500 characters")
    .optional(),
});

export type BirthChartData = z.infer<typeof birthChartSchema>;

/**
 * Validation helper functions
 */
export const validateBirthChart = (data: unknown) => {
  return birthChartSchema.safeParse(data);
};

/**
 * Default values for form initialization
 */
export const defaultBirthChartValues: Partial<BirthChartData> = {
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
};

/**
 * Common timezone options for dropdown
 */
export const commonTimezones = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
  { value: 'Europe/Paris', label: 'Central European Time (CET)' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
  { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)' },
  { value: 'UTC', label: 'Coordinated Universal Time (UTC)' },
] as const;

/**
 * House system descriptions for user selection
 */
export const houseSystemDescriptions = {
  placidus: 'Most widely used modern system, unequal houses based on time',
  koch: 'Popular alternative with different mathematical approach',
  equal: 'Equal 30-degree houses from Ascendant',
  'whole-sign': 'Ancient system where each sign = one house',
  campanus: 'Medieval system based on prime vertical',
  regiomontanus: 'Renaissance system, predecessor to Placidus'
} as const;