import Navbar from '@/components/NavBar'; 

export default function Page() {
  return (
    <>
      <Navbar />
      <div className="w-full min-h-screen">
        <iframe
          src="/portfolio/anth0020.pdf"
          className="w-full h-[calc(100vh-0px)]" 
          title="PDF Viewer"
        />
      </div>
    </>
  );
}