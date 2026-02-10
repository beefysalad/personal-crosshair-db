import { Crosshair } from "@/app/generated/prisma/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AnimatePresence, motion } from "framer-motion";
import { Copy, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface CrosshairGalleryProps {
  crosshairs: Crosshair[];
  onSelectCrosshair: (crosshair: Crosshair) => void;
  onDeleteCrosshair: (id: string) => void;
}

const GalleryCommponent = ({
  crosshairs,
  onSelectCrosshair,
  onDeleteCrosshair,
}: CrosshairGalleryProps) => {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleConfirmDelete = (id: string) => {
    onDeleteCrosshair(id);
    setDeleteConfirm(null);
  };

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
        <AnimatePresence mode='wait'>
          {crosshairs.map((crosshair, index) => (
            <motion.div
              key={crosshair.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.03 }}
              className='group relative bg-card border border-border/50 rounded-lg overflow-hidden transition-all hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10'
            >
              <motion.div
                onClick={() => onSelectCrosshair(crosshair)}
                whileHover={{ y: -1 }}
                className='relative w-full aspect-square bg-background overflow-hidden cursor-pointer'
              >
                <Image
                  src={crosshair.imageUrl || "/placeholder.svg"}
                  alt={crosshair.name}
                  height={"100"}
                  width={"100"}
                  className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className='absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent flex items-end justify-center pb-2'
                >
                  <span className='text-xs font-semibold text-accent bg-background/80 px-2 py-0.5 rounded-full backdrop-blur'>
                    View
                  </span>
                </motion.div>
              </motion.div>

              <div className='p-2 border-t border-border/30'>
                <h3 className='font-semibold text-foreground truncate mb-0.5 text-xs group-hover:text-accent transition-colors'>
                  {crosshair.name}
                </h3>
                <p className='text-xs text-muted-foreground truncate font-mono mb-1.5'>
                  {crosshair.code.length > 10
                    ? `${crosshair.code.substring(0, 10)}...`
                    : crosshair.code}
                </p>
                <div className='flex'>
                  <button
                    onClick={() => setDeleteConfirm(crosshair.id)}
                    className='w-full h-6 p-0 text-muted-foreground hover:text-green-500 hover:bg-green-500/10 border border-border/50 rounded text-xs font-medium transition-all'
                  >
                    <Copy className='w-3 h-3 mx-auto' />
                  </button>{" "}
                  <button
                    onClick={() => setDeleteConfirm(crosshair.id)}
                    className='w-full h-6 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 border border-border/50 rounded text-xs font-medium transition-all'
                  >
                    <Trash2 className='w-3 h-3 mx-auto' />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {deleteConfirm && (
        <Dialog
          open={!!deleteConfirm}
          onOpenChange={(open) => !open && setDeleteConfirm(null)}
        >
          <DialogContent className='max-w-sm bg-card border-border/50'>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader>
                <DialogTitle className='text-xl text-destructive flex items-center gap-2'>
                  <Trash2 className='w-5 h-5' />
                  Delete Crosshair?
                </DialogTitle>
                <DialogDescription className='text-muted-foreground'>
                  Are you sure you want to delete this crosshair? This action
                  cannot be undone.
                </DialogDescription>
              </DialogHeader>

              <div className='flex gap-2 mt-6'>
                <Button
                  onClick={() => setDeleteConfirm(null)}
                  variant='outline'
                  className='flex-1 border-border/50 hover:bg-background'
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleConfirmDelete(deleteConfirm)}
                  className='flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold'
                >
                  Delete
                </Button>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default GalleryCommponent;
