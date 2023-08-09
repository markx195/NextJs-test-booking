import Image from 'next/image'
import dynamic from 'next/dynamic';
const DynamicTable = dynamic(() => import('../component/table'), { ssr: false });
export default function Home() {
  return (
    <main>
      <DynamicTable/>
    </main>
  )
}
