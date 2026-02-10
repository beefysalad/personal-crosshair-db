import React from "react";

const Footer = () => {
  return (
    <footer className='border-t border-border/40 bg-background/50 backdrop-blur mt-16'>
      <div className='container mx-auto px-4 py-8'>
        <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
          <div>
            <p className='text-sm text-muted-foreground'>
              Created by
              <span className='text-accent font-semibold'>patr1ck</span>
            </p>
          </div>
          <p className='text-xs text-muted-foreground'>Crosshair Vault</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
