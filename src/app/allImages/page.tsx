import AllImages from "@/components/Users/AllImages";

export default function page() {
  return (
    <>
      <AllImages />
    </>
  );
}

export async function generateMetadata() {
  return {
    title: "Image",
    description: "View and Manage all Images.",
  };
}
