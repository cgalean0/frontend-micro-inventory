import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productsApi, Product, CreateProductRequest } from '@/api/products'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { authApi } from '@/api/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'

export function ProductsPage() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const queryClient = useQueryClient()
  
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  
  const { data, isLoading } = useQuery({
    queryKey: ['products', search],
    queryFn: () => productsApi.getAll({ search: search || undefined }),
  })

  const createMutation = useMutation({
    mutationFn: (data: CreateProductRequest) => productsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      setIsModalOpen(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateProductRequest> }) => 
      productsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      setIsModalOpen(false)
      setEditingProduct(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => productsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })

  const handleLogout = async () => {
    await authApi.logout()
    logout()
    navigate('/login')
  }

  const openCreateModal = () => {
    setEditingProduct(null)
    setIsModalOpen(true)
  }

  const openEditModal = (product: Product) => {
    setEditingProduct(product)
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-black/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 violet-gradient rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">Control Stock</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              className="text-muted-foreground hover:text-white"
            >
              Dashboard
            </Button>
            <span className="text-sm text-muted-foreground">
              {user?.username}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-muted-foreground hover:text-white transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Productos</h1>
            <p className="text-muted-foreground mt-1">{data?.totalElements || 0} productos en total</p>
          </div>
          <Button onClick={openCreateModal} className="violet-gradient hover:opacity-90 text-white">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Producto
          </Button>
        </div>

        <div className="mb-6">
          <Input
            type="text"
            placeholder="Buscar por nombre o SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md bg-background border-border focus:border-violet-500"
          />
        </div>

        <Card className="card-dark">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Producto</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">SKU</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Categoría</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Stock</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Precio</th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center">
                        <div className="flex justify-center">
                          <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                      </td>
                    </tr>
                  ) : data?.content?.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground">
                        No hay productos
                      </td>
                    </tr>
                  ) : (
                    data?.content?.map((product) => (
                      <tr key={product.id} className="border-b border-border hover:bg-background/50 transition-colors">
                        <td className="p-4">
                          <div>
                            <p className="text-white font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">{product.size} · {product.color}</p>
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground font-mono text-sm">{product.sku}</td>
                        <td className="p-4">
                          <Badge variant="secondary" className="bg-violet-600/20 text-violet-400 border-violet-600/30">
                            {product.category}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <span className={product.quantity === 0 ? 'text-destructive' : product.quantity < 10 ? 'text-amber-400' : 'text-emerald-400'}>
                            {product.quantity}
                          </span>
                        </td>
                        <td className="p-4 text-white font-medium">{formatCurrency(product.price)}</td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditModal(product)}
                              className="text-muted-foreground hover:text-white"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteMutation.mutate(product.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>

      {isModalOpen && (
        <ProductModal
          product={editingProduct}
          onClose={() => { setIsModalOpen(false); setEditingProduct(null); }}
          onSubmit={(data) => {
            if (editingProduct) {
              updateMutation.mutate({ id: editingProduct.id, data });
            } else {
              createMutation.mutate(data as CreateProductRequest);
            }
          }}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      )}
    </div>
  )
}

function ProductModal({ 
  product, 
  onClose, 
  onSubmit, 
  isLoading 
}: { 
  product: Product | null
  onClose: () => void
  onSubmit: (data: Partial<CreateProductRequest>) => void
  isLoading: boolean
}) {
  const [formData, setFormData] = useState<Partial<CreateProductRequest>>({
    name: product?.name || '',
    sku: product?.sku || '',
    category: product?.category || '',
    size: product?.size || '',
    color: product?.color || '',
    quantity: product?.quantity || 0,
    price: product?.price || 0,
    description: product?.description || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <Card className="w-full max-w-lg card-dark relative z-10">
        <CardHeader>
          <CardTitle className="text-white">
            {product ? 'Editar Producto' : 'Nuevo Producto'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Nombre</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-background border-border"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">SKU</label>
                <Input
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="bg-background border-border"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Categoría</label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="bg-background border-border"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Precio</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className="bg-background border-border"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Talle</label>
                <Input
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Color</label>
                <Input
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Cantidad</label>
                <Input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                  className="bg-background border-border"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Descripción</label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-background border-border"
              />
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="ghost" onClick={onClose} className="text-muted-foreground">
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading} className="violet-gradient text-white">
                {isLoading ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
