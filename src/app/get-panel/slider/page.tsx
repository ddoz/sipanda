import React, { Suspense } from 'react'
import Content from './content'
import {  getKategoriPangan, getPanganPagination } from '@/services/master-data'
import { getSlide } from '@/services/slide';

const SliderPage = async () => {
    const [slide ] = await Promise.all([getSlide()]);


  return (
    <div className='flex w-full mt-2'>
        <Content 
            data={slide} 
        />
    </div>
  )
}

export default SliderPage