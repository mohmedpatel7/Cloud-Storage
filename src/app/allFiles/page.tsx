import AllFiles from "@/components/Users/AllFiles";

export default function page() {
  return (
    <>
      <AllFiles />
    </>
  );
}

export async function generateMetadata() {
  return {
    title: "Files",
    description: "View and Manage all Files.",
  };
}
