"use client";
import Header from "./header";

interface ContainerProps {
  children: React.ReactNode;
}
const Container = ({ children }: ContainerProps) => {
  return (
    <main className='min-h-screen bg-background'>
      <Header />
      {children}
    </main>
  );
};

export default Container;
