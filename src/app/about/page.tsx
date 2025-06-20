import About from "@/components/common/About";

const about = () => {
  return (
    <>
      <About />
    </>
  );
};

export async function generateMetadata() {
  return {
    title: "About Us",
    description: "About Cloud Storage",
  };
}

export default about;
