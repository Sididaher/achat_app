export interface User {
  id: number
  username: string
  email: string
  role: 'admin' | 'employee'
  created_at: string
}

export interface Fournisseur {
  id: number
  nom: string
  contact?: string
  telephone?: string
  adresse?: string
  created_at: string
}

export interface Category {
  id: number
  nom: string
  description?: string
}

export interface Produit {
  id: number
  nom: string
  description?: string
  prix_achat: number
  stock: number
  categorie_id?: number
  fournisseur_id?: number
  image_url?: string
  created_at: string
  categories?: Category
  fournisseurs?: Fournisseur
}

export interface Achat {
  id: number
  user_id?: number
  fournisseur_id?: number
  date_achat: string
  total?: number
  image_url?: string
  created_at: string
  users?: User
  fournisseurs?: Fournisseur
}

export interface AchatDetail {
  id: number
  achat_id: number
  produit_id: number
  quantite: number
  prix_unitaire: number
  produits?: Produit
}

export interface AchatWithDetails extends Achat {
  achat_details?: AchatDetail[]
}
