import { listTrainings } from '@/services/training/training-service';
import { TrainingCard } from '@/components/training-card';

export default async function TrainingsPage() {
  const trainings = await listTrainings();
  return <main className="container-page grid gap-3 md:grid-cols-2">{trainings.map((t) => <TrainingCard key={t.id} training={t} />)}</main>;
}
