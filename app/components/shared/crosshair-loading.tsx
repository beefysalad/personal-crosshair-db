const CrosshairLoading = () => {
  return (
    <div className='min-h-screen bg-background flex items-center justify-center'>
      <div className='text-center'>
        <div className='w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4' />
        <p className='text-muted-foreground'>Loading crosshairs...</p>
      </div>
    </div>
  );
};

export default CrosshairLoading;
