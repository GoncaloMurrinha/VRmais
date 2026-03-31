export function AboutPhotoDeleteForm({ id }: { id: string }) {
  return (
    <form action={`/api/admin/about-photos/${id}`} method="post">
      <input type="hidden" name="_method" value="delete" />
      <button type="submit" className="text-sm font-semibold text-rose-600 transition hover:text-rose-700">
        Eliminar
      </button>
    </form>
  );
}
