export type GalleryItem = {
  _id?: string;
  name: string;
  hindiName: string;
  description: string;
  imageUrl: string;
  label?: string;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export function createGallerySlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}
