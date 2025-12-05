import Tabs from '@/app/Tabs';
import { day_top, week_top } from '@/lib/fetchDC';

export default async function Home() {
    const day = await day_top();
    const week = await week_top();
    const data = { day: day, week: week };

    return <Tabs initialData={data} />;
}
