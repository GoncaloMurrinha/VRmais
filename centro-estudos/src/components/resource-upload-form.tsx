export function ResourceUploadForm() {
  return (
    <form
      action="/api/admin/resources"
      method="post"
      encType="multipart/form-data"
      className="content-surface grid gap-4 p-5 md:grid-cols-2 md:p-6"
    >
      <div className="md:col-span-2">
        <label htmlFor="resource-title" className="mb-2 block text-sm font-medium text-slate-700">
          Título
        </label>
        <input
          id="resource-title"
          name="title"
          required
          className="brand-input w-full rounded-2xl px-4 py-3"
        />
      </div>
      <div className="md:col-span-2">
        <label htmlFor="resource-description" className="mb-2 block text-sm font-medium text-slate-700">
          Descrição
        </label>
        <textarea
          id="resource-description"
          name="description"
          rows={4}
          required
          className="brand-input w-full rounded-2xl px-4 py-3"
        />
      </div>
      <div>
        <label htmlFor="resource-category" className="mb-2 block text-sm font-medium text-slate-700">
          Categoria
        </label>
        <input
          id="resource-category"
          name="category"
          required
          className="brand-input w-full rounded-2xl px-4 py-3"
        />
      </div>
      <div>
        <label htmlFor="resource-file" className="mb-2 block text-sm font-medium text-slate-700">
          Ficheiro
        </label>
        <input
          id="resource-file"
          name="file"
          type="file"
          required
          className="brand-input w-full rounded-2xl px-4 py-3"
        />
      </div>
      <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
        <input name="isPublished" type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300" />
        Disponível no site público
      </label>
      <div className="flex items-center md:justify-end">
        <button
          type="submit"
          className="brand-button-secondary w-full px-5 py-3 text-sm font-semibold md:w-auto"
        >
          Carregar ficha
        </button>
      </div>
    </form>
  );
}
