import AllVideos from "@/components/Users/AllVideos";

export default function page() {
  return (
    <>
      <AllVideos />
    </>
  );
}

export async function generateMetadata() {
  return {
    title: "Video",
    description: "View and Manage all Videos.",
  };
}
