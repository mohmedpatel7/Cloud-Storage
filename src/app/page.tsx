import Homes from "@/components/common/Home";

export default function Home() {
  return (
    <>
      <Homes />
    </>
  );
}

export async function generateMetadata() {
  return {
    title: "Cloud Storage",
    description: "Cloud Storage Welcomes You.",
  };
}
