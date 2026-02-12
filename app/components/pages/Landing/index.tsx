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
import CrosshairLoading from "../../shared/crosshair-loading";

const LIMIT = 12;
const LandingComponent = () => {
  const [page, setPage] = useState<number>(1);
  const { data, isLoading, isFetching } = useGetCrosshairs(page, LIMIT);
  const deleteMutation = useDeleteCrosshair();

  const [selectedCrosshair, setSelectedCrosshair] = useState<Crosshair | null>(
    null,
  );
  const [showModal, setShowModal] = useState(false);

  if (isLoading || !data) {
    return <CrosshairLoading />;
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
              {total === 0
                ? "Create your first crosshair to get started"
                : `${total} crosshair${total !== 1 ? "s" : ""} saved`}
            </p>
          </motion.div>

          {(isFetching || deleteMutation.isPending) && (
            <div className='fixed inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50'>
              <div className='bg-card border border-border rounded-lg p-6 shadow-xl'>
                <div className='w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3' />
                <p className='text-muted-foreground text-sm'>
                  {deleteMutation.isPending ? "Deleting..." : "Updating..."}
                </p>
              </div>
            </div>
          )}

          {total === 0 ? (
            <NoCrosshair />
          ) : (
            <Fragment>
              <GalleryCommponent
                crosshairs={crosshairs}
                onSelectCrosshair={handleSelectCrosshair}
                onDeleteCrosshair={handleDeleteCrosshair}
                isDeleting={deleteMutation.isPending}
              />
              <div className='flex justify-center items-center gap-4 mt-8'>
                <Button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || isFetching}
                  variant='outline'
                >
                  Previous
                </Button>

                <span className='text-xs text-muted-foreground'>
                  Page {page} of {totalPages}
                </span>

                <Button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || isFetching}
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
