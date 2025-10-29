/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Candidate } from '../services/db';
import { db } from '../services/db';

// Export candidates to CSV
export function exportCandidatesToCSV(candidates: any[]) {
  const headers = ['Name', 'Email', 'Phone', 'Stage', 'Job Title', 'Applied Date'];
  
  const csvContent = [
    headers.join(','),
    ...candidates.map(c => [
      c.name,
      c.email,
      c.phone || '',
      c.stage,
      c.jobTitle || '',
      new Date(c.appliedDate).toLocaleDateString()
    ].join(','))
  ].join('\n');

  downloadFile(csvContent, 'candidates.csv', 'text/csv');
}

// Export jobs to JSON
export function exportJobsToJSON(jobs: any[]) {
  const jsonContent = JSON.stringify(jobs, null, 2);
  downloadFile(jsonContent, 'jobs.json', 'application/json');
}

// Export assessments to JSON
export function exportAssessmentsToJSON(assessments: any[]) {
  const jsonContent = JSON.stringify(assessments, null, 2);
  downloadFile(jsonContent, 'assessments.json', 'application/json');
}

// Import candidates from CSV
export async function importCandidatesFromCSV(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        
        // Skip header row
        const dataLines = lines.slice(1);
        
        const candidates: Candidate[] = dataLines.map((line, index) => {
          const [name, email, phone, stage, jobTitle, appliedDate] = line.split(',').map(s => s.trim());
          
          return {
            id: `cand-imported-${Date.now()}-${index}`,
            name: name || 'Unknown',
            email: email || '',
            phone: phone || '',
            stage: (stage as Candidate['stage']) || 'applied',
            jobId: `job-1`, // Default job
            jobTitle: jobTitle || 'Not specified',
            appliedDate: appliedDate ? new Date(appliedDate).toISOString() : new Date().toISOString(),
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
            notes: [],
          };
        });

        // Add to database
        await db.candidates.bulkAdd(candidates);
        resolve(candidates.length);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

// Helper function to trigger download
function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}