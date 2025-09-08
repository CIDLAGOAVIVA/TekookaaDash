import { Suspense } from 'react';
import MetricsClientPage from './MetricsClientPage';

export default function MetricsPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <MetricsClientPage />
    </Suspense>
  );
}
