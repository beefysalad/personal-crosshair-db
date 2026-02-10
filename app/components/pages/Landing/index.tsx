import { Crosshair } from "@/app/generated/prisma/client";
import {
  useDeleteCrosshair,
  useGetCrosshairs,
} from "@/app/shared/hooks/crosshair/useCrosshair";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Fragment, useState } from "react";
import CrosshairModal from "./crosshair-model";
import GalleryCommponent from "./gallery";
import NoCrosshair from "./no-crosshair";

const LIMIT = 12;
const LandingComponent = () => {
  const [page, setPage] = useState<number>(1);
  const { data, isLoading } = useGetCrosshairs(page, LIMIT);
  const deleteMutation = useDeleteCrosshair();

  const [selectedCrosshair, setSelectedCrosshair] = useState<Crosshair | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(false);

  if (isLoading || !data) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4' />
          <p className='text-muted-foreground'>Loading crosshairs...</p>
        </div>
      </div>
    );
  }
  const { crosshairs, total } = data;

  const totalPages = Math.ceil(total / LIMIT);

  const handleDeleteCrosshair = (id: string) => {
    deleteMutation.mutateAsync(id);
  };

  const handleSelectCrosshair = (crosshair: Crosshair) => {
    setSelectedCrosshair(crosshair);
    setShowModal(true);
  };

  return (
    <main className='min-h-screen bg-background'>
      <div className='container mx-auto px-4 py-12'>
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className='mb-8'
          >
            <h2 className='text-3xl font-bold text-accent mb-2'>
              Your Crosshairs
            </h2>
            <p className='text-muted-foreground'>
              {crosshairs.length === 0
                ? "Create your first crosshair to get started"
                : `${crosshairs.length} crosshair${
                    crosshairs.length !== 1 ? "s" : ""
                  } saved`}
            </p>
          </motion.div>

          {crosshairs.length === 0 ? (
            <NoCrosshair />
          ) : (
            <Fragment>
              <GalleryCommponent
                crosshairs={crosshairs}
                onSelectCrosshair={handleSelectCrosshair}
                onDeleteCrosshair={handleDeleteCrosshair}
              />
              <div className='flex justify-center items-center gap-4 mt-8'>
                <Button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  variant='outline'
                >
                  Previous
                </Button>

                <span className='text-xs text-muted-foreground'>
                  Page {page} of {totalPages}
                </span>

                <Button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  variant='outline'
                >
                  Next
                </Button>
              </div>
            </Fragment>
          )}
        </div>
      </div>

      {selectedCrosshair && (
        <CrosshairModal
          crosshair={selectedCrosshair}
          open={showModal}
          onOpenChange={setShowModal}
          onDelete={handleDeleteCrosshair}
        />
      )}
    </main>
  );
};

export default LandingComponent;
