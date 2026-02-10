import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
const NoCrosshair = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className='flex flex-col items-center justify-center py-24 px-4 rounded-xl border-2 border-dashed border-border/50 bg-card/30'
    >
      <h3 className='text-xl font-semibold mb-2'>No crosshairs yet</h3>
      <p className='text-muted-foreground text-center max-w-sm mb-6'>
        Create your first crosshair to start building your personal arsenal
      </p>
      <Link href='/create'>
        <Button className='bg-accent hover:bg-accent/90 text-accent-foreground'>
          Create First Crosshair
        </Button>
      </Link>
    </motion.div>
  );
};

export default NoCrosshair;
