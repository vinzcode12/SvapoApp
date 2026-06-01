export interface ProductFeature {
  id: string;
  name: string;
  value: string;
  unit?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  inShowcase: boolean;
  image: string;
  features: ProductFeature[];
}

export interface Customer {
  id: string;
  name: string;
  surname: string;
  phone: string;
  date: string;
}

const PRODUCTS_KEY = 'svapo_products';
const CUSTOMERS_KEY = 'svapo_customers';

export const getProducts = (): Product[] => {
  try {
    const data = localStorage.getItem(PRODUCTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveProducts = (products: Product[]) => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};

export const getCustomers = (): Customer[] => {
  try {
    const data = localStorage.getItem(CUSTOMERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveCustomers = (customers: Customer[]) => {
  localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
};

export const resizeAndCompressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8)); // Compress and convert to base64
      };
      img.onerror = (e) => reject(e);
    };
    reader.onerror = (e) => reject(e);
  });
};
