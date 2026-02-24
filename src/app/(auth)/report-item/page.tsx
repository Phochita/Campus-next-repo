import { Suspense } from 'react';
import ReportItemForm from './ReportItemForm';

export default function ReportItemPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <ReportItemForm />
    </Suspense>
  );
}
