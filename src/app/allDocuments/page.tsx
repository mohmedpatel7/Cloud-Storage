import AllDocs from "@/components/Users/AllDoc";

export default function page() {
  return (
    <>
      <AllDocs />
    </>
  );
}

export async function generateMetadata() {
  return {
    title: "Document",
    description: "View and Manage all Documents.",
  };
}
