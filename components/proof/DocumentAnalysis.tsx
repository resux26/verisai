import React from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Badge } from '../ui/Badge';
import { Bot } from 'lucide-react';

interface AnalysisData {
  documentType: string;
  title: string;
  summary: string;
  keywords: string[];
  author?: string;
  createdDate?: string;
}

interface DocumentAnalysisProps {
  data: AnalysisData;
  onChange: (data: AnalysisData) => void;
  readOnly?: boolean;
}

export function DocumentAnalysis({ data, onChange, readOnly = false }: DocumentAnalysisProps) {
  const handleChange = (field: keyof AnalysisData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <Card className="flex flex-col gap-6">
      <div className="flex items-center gap-2 border-b border-border-default pb-4">
        <Bot className="w-5 h-5 text-accent-primary" />
        <h3 className="text-lg font-semibold">AI Analysis Results</h3>
        <Badge variant="accent" className="ml-auto">AI Generated</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input 
          label="Document Type" 
          value={data.documentType || ''}
          onChange={(e) => handleChange('documentType', e.target.value)}
          disabled={readOnly}
        />
        <Input 
          label="Title" 
          value={data.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          disabled={readOnly}
        />
      </div>

      <Textarea 
        label="Summary" 
        value={data.summary || ''}
        onChange={(e) => handleChange('summary', e.target.value)}
        disabled={readOnly}
        className="min-h-[100px]"
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-text-secondary">Extracted Keywords</label>
        <div className="flex flex-wrap gap-2">
          {data.keywords?.map((keyword, i) => (
            <span key={i} className="px-2.5 py-1 text-xs font-medium bg-bg-elevated border border-border-default rounded-md">
              {keyword}
            </span>
          ))}
          {(!data.keywords || data.keywords.length === 0) && (
            <span className="text-sm text-text-tertiary italic">No keywords extracted</span>
          )}
        </div>
      </div>

      {(data.author || data.createdDate) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border-default border-dashed">
          {data.author && (
            <div className="flex flex-col gap-1">
              <span className="text-xs text-text-tertiary uppercase tracking-wider">Detected Author</span>
              <span className="text-sm">{data.author}</span>
            </div>
          )}
          {data.createdDate && (
            <div className="flex flex-col gap-1">
              <span className="text-xs text-text-tertiary uppercase tracking-wider">Detected Date</span>
              <span className="text-sm">{data.createdDate}</span>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
