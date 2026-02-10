import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

const Header = () => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className='sticky top-0 z-40 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'
    >
      <div className='container mx-auto px-4 py-6 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 bg-accent rounded-lg flex items-center justify-center font-bold text-accent-foreground text-lg'>
            Patrick
          </div>
          <div>
            <h1 className='text-2xl font-bold text-accent'>Crosshair Vault</h1>
            <p className='text-xs text-muted-foreground'>
              Saladus Personal Crosshair Collection
            </p>
          </div>
        </div>
        <div className='flex items-center gap-3'>
          <Link href='/settings'>
            <Button variant='secondary'>Settings</Button>
          </Link>
          <Link href='/create'>
            <Button className='bg-accent hover:bg-accent/90 text-accent-foreground font-semibold'>
              Create Crosshair
            </Button>
          </Link>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
