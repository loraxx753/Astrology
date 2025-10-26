import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { ChartFormData, chartFormSchema } from '@/lib/schemas/chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ThirdParty/ShadCn/Card';
import { StarIcon } from 'lucide-react';
import { PageComponentType } from '@/lib/types';

function parseQuery(queryString: string): Record<string, string> {
  const params = new URLSearchParams(queryString);
  const result: Record<string, string> = {};
  for (const [key, value] of params.entries()) {
    result[key] = value;
  }
  return result;
}

function queryToChartFormData(query: Record<string, string>): ChartFormData | null {
  // Flattened query keys like pageFormData.name, pageFormData.location.city, etc.
  const data: any = {};
  for (const key in query) {
    if (key.startsWith('pageFormData.')) {
      const path = key.replace('pageFormData.', '').split('.');
      let curr = data;
      for (let i = 0; i < path.length - 1; i++) {
        curr[path[i]] = curr[path[i]] || {};
        curr = curr[path[i]];
      }
      curr[path[path.length - 1]] = query[key];
    }
  }
  try {
    return chartFormSchema.parse({ pageFormData: data });
  } catch {
    return null;
  }
}

const ChartPage: PageComponentType = () => {
  const location = useLocation();
  const query = useMemo(() => parseQuery(location.search), [location.search]);
  const chartData = useMemo(() => queryToChartFormData(query), [query]);

  if (!chartData) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <StarIcon className="w-5 h-5" /> Invalid Chart Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Could not parse chart data from URL. Please check your link or try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render a summary (can be expanded to full chart rendering)
  const { name, date, time, location: loc, houseSystem, notes } = chartData.pageFormData;
  return (
    <div className="max-w-2xl mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-800">
            <StarIcon className="w-5 h-5" /> Chart for {name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div><strong>Date:</strong> {date}</div>
            <div><strong>Time:</strong> {time}</div>
            <div><strong>Location:</strong> {loc?.city}, {loc?.state}, {loc?.country}</div>
            <div><strong>House System:</strong> {houseSystem}</div>
            {notes && <div><strong>Notes:</strong> {notes}</div>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

ChartPage.path = '/chart';

export default ChartPage;
