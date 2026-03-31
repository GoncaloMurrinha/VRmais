export function AboutPhotoUploadForm() {
  return (
    <form
      action="/api/admin/about-photos"
      method="post"
      encType="multipart/form-data"
      className="content-surface grid gap-4 p-5 md:grid-cols-2 md:p-6"
    >
      <div className="md:col-span-2">
        <label htmlFor="about-photo-title" className="mb-2 block text-sm font-medium text-slate-700">
          Título
        </label>
        <input id="about-photo-title" name="title" required className="brand-input w-full rounded-2xl px-4 py-3" />
      </div>
      <div className="md:col-span-2">
        <label htmlFor="about-photo-file" className="mb-2 block text-sm font-medium text-slate-700">
          Fotografia
        </label>
        <input
          id="about-photo-file"
          name="file"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/avif"
          required
          className="brand-input w-full rounded-2xl px-4 py-3"
        />
      </div>
      <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
        <input name="isPublished" type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300" />
        Publicar na página Quem somos
      </label>
      <div className="flex items-center md:justify-end">
        <button
          type="submit"
          className="brand-button-secondary w-full px-5 py-3 text-sm font-semibold md:w-auto"
        >
          Carregar foto
        </button>
      </div>
    </form>
  );
}
