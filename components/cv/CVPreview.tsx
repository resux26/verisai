import React, { forwardRef } from 'react';
import { Card } from '../ui/Card';
import { Mail, MapPin, Phone } from 'lucide-react';

interface CVPreviewProps {
  data: any;
}

export const CVPreview = forwardRef<HTMLDivElement, CVPreviewProps>(
  ({ data }, ref) => {
    if (!data) return null;

    return (
      <Card 
        ref={ref}
        static 
        className="bg-white text-gray-900 border-gray-200 shadow-sm p-8 md:p-12 font-sans print:shadow-none print:border-none print:p-0"
      >
        {/* Header */}
        <div className="border-b-2 border-gray-900 pb-6 mb-6">
          <h1 className="text-3xl font-bold uppercase tracking-tight text-gray-900 mb-2">{data.name}</h1>
          <h2 className="text-xl text-gray-600 font-medium mb-4">{data.title}</h2>
          
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600">
            {data.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> {data.location}
              </div>
            )}
            {data.email && (
              <div className="flex items-center gap-1.5">
                <Mail className="w-4 h-4" /> {data.email}
              </div>
            )}
            {data.phone && (
              <div className="flex items-center gap-1.5">
                <Phone className="w-4 h-4" /> {data.phone}
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        {data.summary && (
          <div className="mb-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-3 border-b border-gray-200 pb-1">Professional Summary</h3>
            <p className="text-gray-700 leading-relaxed text-sm">{data.summary}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="md:col-span-2 space-y-8">
            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4 border-b border-gray-200 pb-1">Experience</h3>
                <div className="space-y-6">
                  {data.experience.map((exp: any, i: number) => (
                    <div key={i}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h4 className="font-semibold text-gray-900">{exp.role}</h4>
                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{exp.period}</span>
                      </div>
                      <div className="text-sm font-medium text-indigo-600 mb-2">{exp.company}</div>
                      <p className="text-sm text-gray-700 leading-relaxed">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {data.projects && data.projects.length > 0 && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4 border-b border-gray-200 pb-1">Key Projects</h3>
                <div className="space-y-5">
                  {data.projects.map((proj: any, i: number) => (
                    <div key={i}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h4 className="font-semibold text-gray-900">{proj.name}</h4>
                      </div>
                      {proj.tech && <div className="text-xs font-medium text-gray-500 mb-2">{proj.tech}</div>}
                      <p className="text-sm text-gray-700 leading-relaxed">{proj.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4 border-b border-gray-200 pb-1">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill: string, i: number) => (
                    <span key={i} className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4 border-b border-gray-200 pb-1">Education</h3>
                <div className="space-y-4">
                  {data.education.map((edu: any, i: number) => (
                    <div key={i}>
                      <h4 className="text-sm font-semibold text-gray-900 mb-0.5">{edu.degree}</h4>
                      <div className="text-xs text-gray-600 mb-1">{edu.institution}</div>
                      <div className="text-xs text-gray-400">{edu.year}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  }
);
CVPreview.displayName = 'CVPreview';
