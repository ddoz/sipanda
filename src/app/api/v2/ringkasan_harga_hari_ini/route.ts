import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export function GET(req) {
  return new Promise(function (resolve) {
    // Ambil data pangan
    prisma.pangan
      .findMany()
      .then(function (panganList) {
        var now = new Date();
        var sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 7);

        // Format ke string 'YYYY-MM-DD'
        function pad(n) {
          return n.toString().length < 2 ? "0" + n : n;
        }

        var sevenDaysAgoStr =
          sevenDaysAgo.getFullYear() +
          "-" +
          pad(sevenDaysAgo.getMonth() + 1) +
          "-" +
          pad(sevenDaysAgo.getDate());

        prisma.hargaPasar
          .findMany({
            // where: {
            //   tanggal: {
            //     gte: sevenDaysAgoStr,
            //   },
            // },
            select: {
              panganId: true,
              harga: true,
            },
          })
          .then(function (hargaPasarList) {
            var result = panganList.map(function (pangan) {
              var hargaList = hargaPasarList
                .filter(function (h) {
                  return h.panganId === pangan.id;
                })
                .map(function (h) {
                  return h.harga;
                });

              var freqMap = {};
              for (var i = 0; i < hargaList.length; i++) {
                var harga = hargaList[i];
                if (freqMap[harga]) {
                  freqMap[harga]++;
                } else {
                  freqMap[harga] = 1;
                }
              }

              var modus = 0;
              var maxFreq = 0;
              for (var hargaKey in freqMap) {
                if (freqMap[hargaKey] > maxFreq) {
                  maxFreq = freqMap[hargaKey];
                  modus = parseInt(hargaKey);
                }
              }

              var resultItem: any = {};
              for (var key in pangan) {
                resultItem[key] = pangan[key];
              }
              resultItem.rataRataHarga = modus;

              return resultItem;
            });

            resolve(NextResponse.json(result, { status: 200 }));
          })
          .catch(function (err) {
            console.error(err);
            resolve(
              NextResponse.json(
                { status: "fail", error: err.message },
                { status: 500 },
              ),
            );
          });
      })
      .catch(function (err) {
        console.error(err);
        resolve(
          NextResponse.json(
            { status: "fail", error: err.message },
            { status: 500 },
          ),
        );
      });
  });
}
