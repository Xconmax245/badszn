export interface ProductImage {
  id:       string
  url:      string
  altText:  string | null
  sortOrder: number
}

export interface ProductVariant {
  id:    string
  size:  string
  color: string | null
  stock: number
  sku:   string
  price: number | null
}

export interface Product {
  id:             string
  name:           string
  slug:           string
  basePrice:      number
  compareAtPrice: number | null
  shippingCost:   number
  description:    string | null
  images:         ProductImage[]
  variants:       ProductVariant[]
  category:       { id: string; name: string; slug: string }
  isNew:          boolean
  details:        any | null
  createdAt:      string
}

export interface ShopSettings {
  shopEnabled:          boolean
  showSaleBadge:        boolean
  showStockBadge:       boolean
  showNewBadge:         boolean
  showSoldOutOverlay:   boolean
  enableFilters:        boolean
  enableSearch:         boolean
  featuredCategorySlug: string | null
  announcementText:     string | null
}

export interface ShopApiResponse {
  products: Product[]
  total:    number
  page:     number
  limit:    number
}
