// app/bioartlab/page.tsx
import ProjectPage from '@/components/ProjectPage';

export default function BioArtLab() {
  // Step 1: Define sections
  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'explorations', label: 'Explorations' },
    { id: 'final', label: 'Final' },
  ];

  return (
    <ProjectPage
      projectTitle="BioArt Lab"
      projectSubtitle="Student-run initiative exploring art, biology, and community impact"
      projectDate="FALL 2024"
      sections={sections}
    >
      {/* Step 2: Create sections with matching IDs */}
      
      <section id="overview" className="mb-16">
        <h2 className="heading-4 mb-6">I. Motivation</h2>
        <p className="body mb-4">
          BioArt Lab is a student-run initiative that explores the intersection 
          of art, biology, and community impact by partnering with local 
          Philadelphia schools to design and host interactive, hands-on workshops 
          that spark creativity and curiosity.
        </p>
        <p className="body mb-4">
          Our mission is to foster a collaborative space that introduces students 
          to STEAM (Science, Technology, Engineering, Art, and Mathematics) through 
          artistic expression and scientific discovery.
        </p>
        <p className="body">
          We also plan to host an annual Art & Science Exposition displaying 
          student works to fundraise for school supplies and educational resources 
          for participating schools.
        </p>
      </section>

      <section id="explorations" className="mb-16">
        <h2 className="heading-4 mb-6">II. Our Partners</h2>
        <p className="body mb-4">
          We partner with local Philadelphia schools including School A, School B, 
          and School C to bring STEAM education to underserved communities.
        </p>
        
        {/* Add images for more scrollable content */}
        <div className="grid grid-cols-3 gap-4 my-8">
          <div className="aspect-square bg-gray-200 dark:bg-gray-800 rounded"></div>
          <div className="aspect-square bg-gray-200 dark:bg-gray-800 rounded"></div>
          <div className="aspect-square bg-gray-200 dark:bg-gray-800 rounded"></div>
        </div>
        
        <p className="body mb-4">
          Each partnership is tailored to the specific needs and interests of 
          the students and faculty at each school.
        </p>
        <p className="body">
          Through these collaborations, we've reached over 500 students across 
          the Philadelphia area.
        </p>
      </section>

      <section id="final" className="mb-16">
        <h2 className="heading-4 mb-6">III. Final Implementation</h2>
        <p className="body mb-4">
          Our workshops have been incredibly successful, with students creating 
          amazing projects that combine art and science in creative ways.
        </p>
        
        {/* More images */}
        <div className="my-8">
          <div className="w-full h-96 bg-gray-200 dark:bg-gray-800 rounded"></div>
        </div>
        
        <p className="body mb-4">
          Students have created everything from microscopic art to large-scale 
          installations inspired by biological systems.
        </p>
        <p className="body">
          Looking ahead, we plan to expand our reach to more schools and continue 
          developing innovative workshops that inspire the next generation of 
          scientists and artists.
        </p>
      </section>
    </ProjectPage>
  );
}