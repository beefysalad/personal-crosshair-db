"use client";
import { motion } from "framer-motion";
import CrosshairForm from "./crosshair-form";
const CreateComponent = () => {
  return (
    <main className='min-h-screen bg-background'>
      <div className='container mx-auto px-4 py-12'>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className='max-w-2xl mx-auto'
        >
          <div className='mb-8'>
            <h2 className='text-3xl font-bold text-accent mb-2'>
              Create New Crosshair
            </h2>
            <p className='text-muted-foreground'>
              Add a new crosshair to your personal vault
            </p>
          </div>

          <div className='bg-card border border-border rounded-xl p-8'>
            <CrosshairForm />
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default CreateComponent;
