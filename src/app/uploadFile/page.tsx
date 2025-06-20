import FileUpload from "@/components/Users/FIleUpload";

export default function page() {
  return (
    <>
      <FileUpload />
    </>
  );
}

export async function generateMetadata() {
  return {
    title: "Upload",
    description: "Upload Files from here..",
  };
}
