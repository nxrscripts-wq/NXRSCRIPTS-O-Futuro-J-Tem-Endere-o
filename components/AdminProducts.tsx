import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Product, NewProduct } from '../types';
import {
  fetchAllProductsAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductActive,
  uploadProductImage,
  getCategoryList,
} from '../services/storeService';
import { Pencil, Trash2, Image as ImageIcon, X, Plus, Loader2, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const INITIAL_FORM_STATE: Partial<Product> = {
  name: '',
  category: '',
  price: undefined,
  currency: 'AOA',
  stock_status: 'available',
  sort_order: 0,
  description: '',
  featured: false,
  active: true,
  tags: [],
  specs: {},
  images: [],
  cover_image: '',
};

export const AdminProducts: React.FC = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>(INITIAL_FORM_STATE);
  const [tagsInput, setTagsInput] = useState('');
  const [specsInput, setSpecsInput] = useState('');
  const [pendingImages, setPendingImages] = useState<File[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const categories = getCategoryList().filter(c => c !== 'Todos');

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: fetchAllProductsAdmin,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin-products'] });

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: async newProduct => {
      if (pendingImages.length > 0) {
        await handleImageUploads(newProduct.id);
      }
      toast.success('Produto criado com sucesso');
      closeForm();
      invalidate();
    },
    onError: err => toast.error(`Erro ao criar: ${(err as Error).message}`),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) => updateProduct(id, data),
    onSuccess: () => {
      toast.success('Produto atualizado com sucesso');
      closeForm();
      invalidate();
    },
    onError: err => toast.error(`Erro ao atualizar: ${(err as Error).message}`),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      toast.success('Produto eliminado');
      invalidate();
    },
    onError: err => toast.error(`Erro ao eliminar: ${(err as Error).message}`),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      toggleProductActive(id, active),
    onSuccess: () => invalidate(),
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: ({ id, featured }: { id: string; featured: boolean }) =>
      updateProduct(id, { featured }),
    onSuccess: () => invalidate(),
  });

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setTagsInput(product.tags?.join(', ') || '');
    const specsStr = product.specs
      ? Object.entries(product.specs)
          .map(([k, v]) => `${k}: ${v}`)
          .join('\n')
      : '';
    setSpecsInput(specsStr);
    setPendingImages([]);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    setFormData(INITIAL_FORM_STATE);
    setTagsInput('');
    setSpecsInput('');
    setPendingImages([]);
  };

  const handleImageUploads = async (productId: string) => {
    setUploadingImages(true);
    try {
      const urls: string[] = [];
      for (const file of pendingImages) {
        const url = await uploadProductImage(file, productId);
        urls.push(url);
      }

      if (urls.length > 0) {
        const existingImages = formData.images || [];
        const newImages = [...existingImages, ...urls];
        const updates: Partial<Product> = { images: newImages };
        if (!formData.cover_image && urls.length > 0) {
          updates.cover_image = urls[0];
        }
        await updateProduct(productId, updates);
      }
    } catch {
      toast.error('Erro ao fazer upload de imagens');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    const validFiles = files.filter(f => {
      if (!f.type.startsWith('image/')) {
        toast.error(`${f.name} não é uma imagem válida.`);
        return false;
      }
      if (f.size > 5 * 1024 * 1024) {
        toast.error(`${f.name} excede o limite de 5MB.`);
        return false;
      }
      return true;
    });

    if (editingProduct) {
      setUploadingImages(true);
      try {
        const urls: string[] = [];
        for (const file of validFiles) {
          const url = await uploadProductImage(file, editingProduct.id);
          urls.push(url);
        }
        const newImages = [...(formData.images || []), ...urls];
        setFormData({
          ...formData,
          images: newImages,
          cover_image: formData.cover_image || urls[0],
        });
      } catch {
        toast.error('Erro ao fazer upload');
      } finally {
        setUploadingImages(false);
      }
    } else {
      setPendingImages(prev => [...prev, ...validFiles]);
    }
  };

  const removeImage = (urlToRemove: string) => {
    const newImages = (formData.images || []).filter(url => url !== urlToRemove);
    setFormData({
      ...formData,
      images: newImages,
      cover_image: formData.cover_image === urlToRemove ? newImages[0] || '' : formData.cover_image,
    });
  };

  const removePendingImage = (idx: number) => {
    setPendingImages(prev => prev.filter((_, i) => i !== idx));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.description) {
      toast.error('Preencha os campos obrigatórios (*)');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const specs: Record<string, string> = {};
    specsInput.split('\n').forEach(line => {
      const parts = line.split(':');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const val = parts.slice(1).join(':').trim();
        if (key && val) specs[key] = val;
      }
    });

    const payload: Partial<Product> = {
      ...formData,
      tags,
      specs,
      price: formData.price === '' ? null : Number(formData.price) || null,
      sort_order: Number(formData.sort_order) || 0,
    };

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data: payload });
    } else {
      createMutation.mutate(payload as NewProduct);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-slate-900 border border-slate-700 p-4 rounded-xl">
        <div>
          <h2 className="text-xl font-bold text-white">Gestão de Produtos</h2>
          <p className="text-sm text-slate-400">
            {products.length} total · {products.filter(p => p.active).length} activos
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4" /> Novo Produto
          </button>
        )}
      </div>

      {showForm && (
        <form
          onSubmit={onSubmit}
          className="bg-slate-900 border border-cyan-500/50 p-6 rounded-xl space-y-6 shadow-xl shadow-cyan-900/10"
        >
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white">
              {editingProduct ? 'Editar Produto' : 'Novo Produto'}
            </h3>
            <button
              type="button"
              onClick={closeForm}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Nome *</label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Categoria *
                  </label>
                  <select
                    required
                    value={formData.category || ''}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded focus:outline-none focus:border-cyan-500"
                  >
                    <option value="" disabled>
                      Selecione...
                    </option>
                    {categories.map(c => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Status</label>
                  <select
                    value={formData.stock_status || 'available'}
                    onChange={e => setFormData({ ...formData, stock_status: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded focus:outline-none focus:border-cyan-500"
                  >
                    <option value="available">Disponível</option>
                    <option value="out_of_stock">Esgotado</option>
                    <option value="on_request">Sob Encomenda</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Preço</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Vazio = Consulte-nos"
                    value={formData.price || ''}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Moeda</label>
                  <select
                    value={formData.currency || 'AOA'}
                    onChange={e => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded focus:outline-none focus:border-cyan-500"
                  >
                    <option value="AOA">AOA (Kwanza)</option>
                    <option value="USD">USD (Dólar)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Ordem de Exibição
                </label>
                <input
                  type="number"
                  value={formData.sort_order || 0}
                  onChange={e => setFormData({ ...formData, sort_order: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Descrição *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description || ''}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Tags</label>
                <input
                  type="text"
                  placeholder="hardware, servidor, rede (separados por vírgula)"
                  value={tagsInput}
                  onChange={e => setTagsInput(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Especificações Técnicas
                </label>
                <textarea
                  rows={3}
                  placeholder="Formato Chave: Valor (uma por linha)"
                  value={specsInput}
                  onChange={e => setSpecsInput(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded focus:outline-none focus:border-cyan-500 font-mono text-sm"
                />
              </div>
              <div className="flex gap-6 mt-2">
                <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured || false}
                    onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-cyan-500"
                  />
                  Produto em Destaque
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active !== false}
                    onChange={e => setFormData({ ...formData, active: e.target.checked })}
                    className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-cyan-500"
                  />
                  Activo na loja
                </label>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-6">
            <label className="block text-sm font-medium text-white mb-3">Imagens do Produto</label>
            <div className="relative border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-xl p-8 text-center transition-colors">
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={uploadingImages}
              />
              <ImageIcon className="w-10 h-10 text-slate-500 mx-auto mb-2" />
              <p className="text-slate-300 font-medium">
                Arrasta imagens aqui ou clica para seleccionar
              </p>
              <p className="text-slate-500 text-xs mt-1">JPG, PNG, WebP · máx 5MB por imagem</p>

              {uploadingImages && (
                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center rounded-xl z-10">
                  <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                </div>
              )}
            </div>

            {/* Imagens Existentes (Online) */}
            {formData.images && formData.images.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-4">
                {formData.images.map((url, idx) => (
                  <div
                    key={idx}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 ${formData.cover_image === url ? 'border-cyan-400' : 'border-slate-700'}`}
                  >
                    <img src={url} alt="Prod" className="w-full h-full object-cover" />
                    {formData.cover_image === url && (
                      <span className="absolute bottom-0 inset-x-0 bg-cyan-500/80 text-[8px] text-white text-center font-bold uppercase py-0.5">
                        Principal
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(url)}
                      className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-500 text-white rounded-full p-0.5 backdrop-blur-sm"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    {formData.cover_image !== url && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, cover_image: url })}
                        className="absolute bottom-1 left-1 bg-slate-900/80 hover:bg-cyan-500 text-white rounded p-0.5 text-[8px] uppercase backdrop-blur-sm transition-colors"
                      >
                        Tornar Principal
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Imagens Pendentes (Locais, antes do envio) */}
            {pendingImages.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-slate-800">
                <p className="w-full text-xs text-slate-500 font-medium">Por enviar:</p>
                {pendingImages.map((file, idx) => (
                  <div
                    key={idx}
                    className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-yellow-500/50 opacity-80"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Pending"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removePendingImage(idx)}
                      className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-500 text-white rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={closeForm}
              className="px-6 py-2 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending || uploadingImages}
              className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg transition-colors flex items-center"
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Guardar Produto
            </button>
          </div>
        </form>
      )}

      <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/50 text-xs uppercase font-mono text-slate-500 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Produto</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4">Preço</th>
                <th className="px-6 py-4 text-center">Stock</th>
                <th className="px-6 py-4 text-center">Visível</th>
                <th className="px-6 py-4 text-center">Destaque</th>
                <th className="px-6 py-4 text-right">Acções</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />A carregar produtos...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    Nenhum produto cadastrado. Adicione o primeiro produto.
                  </td>
                </tr>
              ) : (
                products.map(product => (
                  <tr key={product.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-slate-800 flex-shrink-0 flex items-center justify-center overflow-hidden border border-slate-700">
                          {product.cover_image ? (
                            <img
                              src={product.cover_image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-4 h-4 text-slate-600" />
                          )}
                        </div>
                        <div
                          className="font-medium text-white line-clamp-1 max-w-[200px]"
                          title={product.name}
                        >
                          {product.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <span className="px-2 py-1 bg-slate-800 rounded text-[10px] uppercase font-mono text-cyan-400">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-3 font-mono text-xs">
                      {product.price
                        ? `${product.currency === 'USD' ? '$' : 'Kz '}${product.price.toLocaleString('pt-AO')}`
                        : 'Consulte-nos'}
                    </td>
                    <td className="px-6 py-3 text-center">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-[10px] font-bold ${
                          product.stock_status === 'available'
                            ? 'bg-green-900/30 text-green-400'
                            : product.stock_status === 'out_of_stock'
                              ? 'bg-red-900/30 text-red-400'
                              : 'bg-orange-900/30 text-orange-400'
                        }`}
                      >
                        {product.stock_status === 'available'
                          ? 'Disponível'
                          : product.stock_status === 'out_of_stock'
                            ? 'Esgotado'
                            : 'Sob Enc.'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={product.active}
                          onChange={e =>
                            toggleActiveMutation.mutate({
                              id: product.id,
                              active: e.target.checked,
                            })
                          }
                        />
                        <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500" />
                      </label>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <button
                        onClick={() =>
                          toggleFeaturedMutation.mutate({
                            id: product.id,
                            featured: !product.featured,
                          })
                        }
                        className={`p-1.5 rounded-full transition-colors ${product.featured ? 'text-yellow-400 bg-yellow-400/10' : 'text-slate-600 hover:text-yellow-400 hover:bg-slate-800'}`}
                        title="Destaque"
                      >
                        <Star className={`w-4 h-4 ${product.featured ? 'fill-current' : ''}`} />
                      </button>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        {deleteConfirmId === product.id ? (
                          <button
                            onClick={() => deleteMutation.mutate(product.id)}
                            className="px-2 py-1 text-[10px] font-bold text-white bg-red-600 hover:bg-red-700 rounded transition-colors"
                          >
                            Confirmar?
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setDeleteConfirmId(product.id);
                              setTimeout(() => setDeleteConfirmId(null), 3000);
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-400 bg-slate-800 hover:bg-slate-700 rounded transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
