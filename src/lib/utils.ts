import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const getFormattedDate = (isoString:any) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
  });
};

export const getFormattedDateTime = (isoString:any) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZone: 'Asia/Jakarta',
  });
};

export const getFormattedDateOnly = (isoString:any) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      timeZone: 'Asia/Jakarta',
  });
};

export const getFormattedDateShort = (isoString:any) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'Asia/Jakarta',
  });
};

export const getFormattedMOnthOnly = (isoString:any) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('id-ID', {
      month: 'long',
      timeZone: 'Asia/Jakarta',
  });
};


export const formatPrice = (price: string) => {
  const amount = parseFloat(price)
  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)

  return formattedPrice
}
