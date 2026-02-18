import {type Product } from '../stores/index';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// 从 API 获取产品数据
export const fetchProductsFromApi = async (): Promise<Product[]> => {
  try {
    const response = await fetch('http://114.67.69.198:8080/api/images');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: ApiResponse<any[]> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || '获取产品数据失败');
    }
    
    // 将 API 返回的数据转换为 Product 接口格式
    return result.data.map((item: any) => ({
      id: item.id || item._id || Math.random().toString(36).substring(7),
      name: item.name || item.title || '未知商品',
      description: item.description || item.desc || '',
      price: item.price ? parseFloat(item.price) : 0,
      image: item.image || item.imageUrl || item.img || '',
      category: item.category || item.type || '其他',
      rating: item.rating ? parseFloat(item.rating) : 0, 
      isHot: item.isHot || false,
      isNew: item.isNew || false
    }));
  } catch (error) {
    console.error('获取产品数据失败:', error);
    // 如果 API 请求失败，返回一个友好的错误信息
    throw error;
  }
};

// 获取单个产品
export const fetchProductById = async (id: string): Promise<Product | undefined> => {
  const products = await fetchProductsFromApi();
  return products.find(product => product.id === id);
};