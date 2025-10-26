import { useForm, FormProvider, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { chartFormSchema, defaultChartFormValues, ChartFormData } from '@/lib/schemas/chart';

export function useChartForm() {
  const methods = useForm<ChartFormData>({
    resolver: zodResolver(chartFormSchema),
    defaultValues: defaultChartFormValues,
    mode: 'onChange',
  });
  return methods;
}

export type UseChartFormReturn = UseFormReturn<ChartFormData>;
