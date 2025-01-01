import AboutSectionOne from "@/components/About/AboutSectionOne";
import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Contact from "@/components/Contact";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sipanda - Dinas Pangan Bandar Lampung",
  description: "Sipanda - Dinas Pangan Bandar Lampung",
  // other metadata
};

const AboutPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Privacy"
        description="Privacy Policy."
      />
      
      <section id="contact" className="py-16 overflow-hidden md:py-20 lg:py-28">
      <div className="container">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full px-4">
            <div
              className="mb-12 rounded-sm bg-white px-8 py-11 shadow-three sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]"
              data-wow-delay=".15s
              "
            >
              <h2 className="mb-3 text-2xl font-bold text-black sm:text-3xl lg:text-2xl xl:text-3xl">
                
              </h2>

              <div className="min-h-screen px-5 py-10 bg-gray-50">
      <div className="max-w-4xl p-8 mx-auto bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-center text-gray-800">
          Privacy Policy - SIPANDA MOBILE
        </h1>

        <p className="mb-4 text-gray-700">
          Terakhir diperbarui: <strong>30/12/2024</strong>
        </p>

        <p className="mb-4 text-gray-700">
          Terima kasih telah menggunakan aplikasi <strong>SIPANDA MOBILE</strong>. Privasi Anda sangat penting bagi kami,
          dan kami berkomitmen untuk melindungi data pribadi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami
          mengumpulkan, menggunakan, dan melindungi informasi Anda saat menggunakan aplikasi ini.
        </p>

        <h2 className="mt-6 mb-2 text-lg font-semibold text-gray-800">
          1. Informasi yang Kami Kumpulkan
        </h2>
        <ul className="mb-4 text-gray-700 list-disc list-inside">
          <li>
            <strong>Informasi Pribadi:</strong> Nama, alamat email, nomor telepon, atau data lain yang Anda masukkan
            dalam aplikasi.
          </li>
          <li>
            <strong>Informasi Non-Pribadi:</strong> Data terkait penggunaan aplikasi, seperti alamat IP, tipe perangkat,
            versi sistem operasi, dan aktivitas dalam aplikasi.
          </li>
          <li>
            <strong>Lokasi:</strong> Jika Anda memberikan izin, kami dapat mengakses data lokasi perangkat Anda untuk
            mendukung fitur tertentu.
          </li>
        </ul>

        <h2 className="mt-6 mb-2 text-lg font-semibold text-gray-800">
          2. Penggunaan Informasi
        </h2>
        <p className="mb-4 text-gray-700">
          Informasi yang dikumpulkan akan digunakan untuk:
        </p>
        <ul className="mb-4 text-gray-700 list-disc list-inside">
          <li>Menyediakan layanan utama aplikasi.</li>
          <li>Meningkatkan pengalaman pengguna dan kinerja aplikasi.</li>
          <li>Memberikan dukungan pelanggan dan komunikasi terkait.</li>
          <li>Mematuhi peraturan hukum yang berlaku.</li>
        </ul>

        <h2 className="mt-6 mb-2 text-lg font-semibold text-gray-800">
          3. Berbagi Informasi
        </h2>
        <p className="mb-4 text-gray-700">
          Kami tidak akan membagikan data pribadi Anda kepada pihak ketiga tanpa persetujuan Anda, kecuali jika diwajibkan
          oleh hukum atau untuk:
        </p>
        <ul className="mb-4 text-gray-700 list-disc list-inside">
          <li>Penyedia layanan pihak ketiga yang membantu kami menjalankan aplikasi.</li>
          <li>Penegak hukum, jika diperlukan oleh hukum.</li>
        </ul>

        <h2 className="mt-6 mb-2 text-lg font-semibold text-gray-800">
          4. Keamanan Data
        </h2>
        <p className="mb-4 text-gray-700">
          Kami berkomitmen untuk melindungi data Anda dengan langkah-langkah keamanan teknis, administratif, dan fisik.
          Meskipun demikian, kami tidak dapat menjamin 100% keamanan data di internet.
        </p>

        <h2 className="mt-6 mb-2 text-lg font-semibold text-gray-800">
          5. Hak Anda
        </h2>
        <ul className="mb-4 text-gray-700 list-disc list-inside">
          <li>Mengakses data pribadi Anda.</li>
          <li>Memperbaiki atau memperbarui data pribadi Anda.</li>
          <li>Menghapus data pribadi Anda, jika tidak lagi diperlukan untuk layanan kami.</li>
        </ul>

        <h2 className="mt-6 mb-2 text-lg font-semibold text-gray-800">
          6. Perubahan Kebijakan Privasi
        </h2>
        <p className="mb-4 text-gray-700">
          Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Jika ada perubahan besar, kami akan memberi
          tahu Anda melalui aplikasi atau metode lain.
        </p>

        <h2 className="mt-6 mb-2 text-lg font-semibold text-gray-800">
          7. Kontak Kami
        </h2>
        <p className="mb-4 text-gray-700">
          Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami di:
        </p>
        <ul className="mb-4 text-gray-700 list-disc list-inside">
          <li>
            <strong>Email:</strong> <a href="mailto:admin@sipanda.bandarlampungkota.go.id" className="text-blue-600">admin@sipanda.bandarlampungkota.go.id</a>
          </li>
          <li>
            <strong>Alamat:</strong> sipanda.bandarlampungkota.go.id
          </li>
        </ul>
      </div>
    </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default AboutPage;
