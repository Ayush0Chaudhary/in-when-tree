import Navbar from '@/components/nav';
import { HoverEffect } from '@/components/ui/hover-card';
import { Separator } from '@/components/ui/separator';
import { projects } from '@/lib/const';

const Homepage = () => {
  return (
    <div className='bg-black min-h-screen p-8'>
      <div className='container mx-auto'>
        <Navbar />
        <Separator />
        <div className='max-w-full mx-auto px-8'>
          {/* Adjusted max-w-full to make content expand to the maximum width */}
          <HoverEffect items={projects} />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
