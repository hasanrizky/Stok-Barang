// script.js
let daftarBarang = [];

function tambahBarang() {
  const nama = document.getElementById("namaBarang").value;
  const spesifikasi = document.getElementById("spesifikasiBarang").value;
  const jumlah = document.getElementById("jumlahBarang").value;
  const satuan = document.getElementById("satuanBarang").value;
  const data = JSON.parse(localStorage.getItem("stokBarang"));

  if (nama && jumlah && spesifikasi) {
    daftarBarang.push({ nama, spesifikasi, jumlah, satuan });
    simpanData();
    tampilkanData();
  }
}

function tampilkanData() {
  const isiTabel = document.getElementById("isiTabel");
  isiTabel.innerHTML = "";

  daftarBarang.forEach((item, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${item.nama}</td>
      <td>${item.spesifikasi}</td>
      <td>${item.jumlah}</td>
      <td>${item.satuan}</td>
      <td>
        <button onclick="editBarang(${index})">Edit</button>
        <button onclick="hapusBarang(${index})">Hapus</button>
      </td>
    `;

    isiTabel.appendChild(row);
  });
}

function editBarang(index) {
  const barang = daftarBarang[index];
  document.getElementById("namaBarang").value = barang.nama;
  document.getElementById("spesifikasiBarang").value = barang.spesifikasi;
  document.getElementById("jumlahBarang").value = barang.jumlah;
  document.getElementById("satuanBarang").value = barang.satuan;
  daftarBarang.splice(index, 1);
  simpanData();
  tampilkanData();
}

function hapusBarang(index) {
  daftarBarang.splice(index, 1);
  simpanData();
  tampilkanData();
}

function simpanData() {
  localStorage.setItem("stokBarang", JSON.stringify(daftarBarang));
}

function muatData() {
  const data = localStorage.getItem("stokBarang");
  if (data) {
    daftarBarang = JSON.parse(data);
    tampilkanData();
  }
}

function barangMasuk() {
  const nama = document.getElementById("namaBarang").value;
  const jumlah = parseInt(document.getElementById("jumlahBarang").value);
  const satuan = document.getElementById("satuanBarang").value;
  const spesifikasi = document.getElementById("spesifikasiBarang").value;

  const index = daftarBarang.findIndex(item => item.nama === nama && item.spesifikasi === spesifikasi);

  if (index !== -1) {
    daftarBarang[index].jumlah = parseInt(daftarBarang[index].jumlah) + jumlah;
  } else {
    daftarBarang.push({ nama, jumlah, satuan, spesifikasi });
  }

  simpanData();
  tampilkanData();
}

function barangKeluar() {
  const nama = document.getElementById("namaBarang").value;
  const jumlah = parseInt(document.getElementById("jumlahBarang").value);
  const satuan = document.getElementById("satuanBarang").value;
  const spesifikasi = document.getElementById("spesifikasiBarang").value;

  const index = daftarBarang.findIndex(item => item.nama === nama && item.spesifikasi === spesifikasi);

  if (index !== -1) {
    daftarBarang[index].jumlah = Math.max(0, parseInt(daftarBarang[index].jumlah) - jumlah);
    simpanData();
    tampilkanData();
  } else {
    alert("Barang tidak ditemukan!");
  }
}
kirimKeSheets({ nama, spesifikasi, jumlah, satuan });
function kirimKeSheets(dataBarang) {
  fetch("https://script.google.com/macros/s/AKfycbzD5OPdqhK5wRli-hufNfqRb7Uwo0eidOpLN1Pi7a2FsN0Ba8cnoOnu8e6FGhP7JR41/exec", {
    method: "POST",
    body: JSON.stringify(dataBarang),
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(res => res.text())
  .then(res => console.log(res))
  .catch(err => console.error("Gagal kirim:", err));
}

function convertToCSV(dataArray) {
  const header = Object.keys(dataArray[0]).join(",");
  const rows = dataArray.map(obj => Object.values(obj).join(","));
  return [header, ...rows].join("\n");
}

function downloadCSV() {
  const data = JSON.parse(localStorage.getItem("stokBarang"));
  if (!data || data.length === 0) return alert("Data kosong!");

  const csv = convertToCSV(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "stok_barang.csv";
  link.click();
}
window.onload = muatData;
