import { listMedia } from "@/lib/admin/media";
import MediaLibrary from "./MediaLibrary";

export default async function MediaPage() {
  const media = await listMedia();

  return (
    <>
      <header className="admin-topbar">
        <div>
          <h1>Media library</h1>
          <div className="admin-topbar-sub">Photos and files uploaded across your site.</div>
        </div>
      </header>

      <div className="admin-content">
        <MediaLibrary initialMedia={media} />
      </div>
    </>
  );
}
